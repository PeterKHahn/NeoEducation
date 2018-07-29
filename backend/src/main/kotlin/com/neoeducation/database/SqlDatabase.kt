package com.neoeducation.database

import com.neoeducation.notes.*
import org.jetbrains.exposed.dao.EntityID
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.IntIdTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SchemaUtils.create
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.Connection

// https://github.com/JetBrains/Exposed/wiki/DAO
// https://github.com/JetBrains/Exposed/wiki/DSL


/**
 * There may be motive to change these classes to DAOs in the future, but
 * I'm waiting for more documentation and I want to get this working
 */
object CardsDb : IntIdTable() {
    val term = text("term")
    val definition = text("definition")
    val priority = integer("priority")
}

class Card(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Card>(CardsDb)

    val term by CardsDb.term
    val definition by CardsDb.definition
    val priority by CardsDb.priority
}

object CardSetsDb : IntIdTable() {
    val title = varchar("title", 255)
    val subject = varchar("subject", 255)
    val email = varchar("email", 255)
}

object CardSetsToCardsDb : Table() {
    val cardSetId = (entityId("cardSetId", CardSetsDb) references CardSetsDb.id)
    val cardId = (entityId("cardId", CardsDb) references CardsDb.id)

}

object UsersDb : Table() {
    val email = varchar("email", 32).primaryKey()
    val name = varchar("fullName", 32)

}


object UsersToCardSetDb : Table() {
    val userEmail = varchar("email", 50) references UsersDb.email
    val cardSetId = entityId("cardSet", CardSetsDb) references CardSetsDb.id
}

object UsersToCardsDb : Table() {
    val userEmail = varchar("email", 50) references UsersDb.email
    val cardId = entityId("card", CardsDb) references CardsDb.id
}


class CardDatabase(name: String) {
    init {

        val url = "jdbc:sqlite:$name"
        Database.connect(url, "org.sqlite.JDBC")
        TransactionManager.manager.defaultIsolationLevel = Connection.TRANSACTION_SERIALIZABLE

        println("Initializing Databases")
        transaction {
            logger.addLogger(StdOutSqlLogger)
            create(CardsDb, CardSetsDb, UsersDb)
            create(CardSetsToCardsDb, UsersToCardSetDb, UsersToCardsDb)
        }

    }


    private fun insertCard(card: CardReceived): Int {
        return transaction {

            if (card.validId()) {
                val x = CardsDb.update({ CardsDb.id eq card.id }) {
                    it[term] = card.term
                    it[definition] = card.definition
                    it[priority] = card.priority


                }


                card.id // TODO does not deal with security


            } else {
                val newId = CardsDb.insertAndGetId {
                    it[term] = card.term
                    it[definition] = card.definition
                    it[priority] = 1

                }
                newId.value


            }


        }

    }

    /**
     * Returns the id of the cardSet
     */
    fun insertCardSet(email: String, cardSet: CardSetReceived): Int {
        return transaction {

            // Inserts the CardSet into the database
            val newCardSetId = CardSetsDb.insertAndGetId {
                it[title] = cardSet.title
                it[subject] = cardSet.subject
                it[CardSetsDb.email] = email
            }


            // Insert into the User to CardSets associative table
            UsersToCardSetDb.insert {
                it[userEmail] = email
                it[cardSetId] = newCardSetId
            }


            // Adds the elements into the associative table
            cardSet.cards.forEach { card ->

                val newCardId = insertCard(card)

                CardSetsToCardsDb.insert {
                    it[cardSetId] = newCardSetId
                    it[cardId] = newCardId


                }
            }

            newCardSetId.value


        }

    }

    fun retrieveCardSet(setId: Int, email: String): CardSetData {
        println("retreiving card set")
        return transaction {
            logger.addLogger(StdOutSqlLogger)

            val cardSetQuery = CardSetsDb.select {
                CardSetsDb.id eq setId
            }


            if (!cardSetQuery.empty()) {
                val cardSetRow = cardSetQuery.first()
                if (cardSetRow[CardSetsDb.email] != email) { // This particular if statement
                    // The user does not have access to this particular Card Set
                    throw InvalidCredentialsException()

                } else {

                    // This is where it is throwing something bad, namely in innerJoin
                    val cards = (CardSetsToCardsDb innerJoin CardsDb)
                            .select {
                                CardSetsToCardsDb.cardSetId eq setId

                            }.map {
                                val cardData = CardData(it[CardsDb.id].value, it[CardsDb.term], it[CardsDb.definition], it[CardsDb.priority])
                                cardData
                            }



                    CardSetData(setId, cardSetRow[CardSetsDb.title], cardSetRow[CardSetsDb.subject], cards)

                }
            } else {
                throw ElementNotInDatabaseException()
            }


        }
    }

    /**
     * Retrieves all CardSets associated with a given email. The SQL call does not check for credentials, so it is
     * important that is done beforehand
     */
    fun retreiveCardSetsFromUser(email: String): List<CardSetInfo> {
        return transaction {

            val cardSets = (UsersToCardSetDb innerJoin CardSetsDb).select {
                UsersToCardSetDb.userEmail eq email
            }.map {
                CardSetInfo(it[CardSetsDb.id].value, it[CardSetsDb.title], it[CardSetsDb.subject])
            }
            cardSets


        }
    }


}

class ElementNotInDatabaseException : RuntimeException()
class InvalidCredentialsException : RuntimeException()