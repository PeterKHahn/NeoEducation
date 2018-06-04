package com.neoeducation.database

import com.neoeducation.notes.CardData
import com.neoeducation.notes.CardReceived
import com.neoeducation.notes.CardSetInfo
import com.neoeducation.notes.CardSetReceived
import org.jetbrains.exposed.dao.EntityID
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
}

object CardSetsDb : IntIdTable() {
    val title = varchar("title", 255)
    val subject = varchar("subject", 255)
    val email = varchar("email", 255)
}

object CardSetsToCardsDb : Table() {
    val cardSetId = entityId("cardSetId", CardSetsDb)
    val cardId = entityId("cardId", CardsDb)
}

object UsersDb : Table() {
    val email = varchar("email", 32).primaryKey()
    val name = varchar("fullName", 32)

}


object UsersToCardSet : Table() {
    val userEmail = varchar("email", 32) references UsersDb.email
    val cardSetId = entityId("cardSet", CardSetsDb)
}


class CardDatabase(name: String) {
    init {

        val url = "jdbc:sqlite:$name"
        Database.connect(url, "org.sqlite.JDBC")
        TransactionManager.manager.defaultIsolationLevel = Connection.TRANSACTION_SERIALIZABLE

        println("Initializing Databases")
        transaction {
            logger.addLogger(StdOutSqlLogger)
            create(CardsDb, CardSetsDb) // TODO get all the databases initialized here

        }

    }


    private fun insertCard(card: CardReceived): EntityID<Int> {
        return transaction {
            logger.addLogger(StdOutSqlLogger)


            val newId = CardsDb.insertAndGetId {
                it[term] = card.term
                it[definition] = card.definition

            }



            newId
        }

    }

    /**
     * Returns the id of the cardSet
     */
    fun insertCardSet(email: String, cardSet: CardSetReceived): Int {
        return transaction {
            logger.addLogger(StdOutSqlLogger)

            // Inserts the CardSet into the database
            val newCardSetId = CardSetsDb.insertAndGetId {
                it[title] = cardSet.title
                it[subject] = cardSet.subject
                it[CardSetsDb.email] = email
            }


            // Insert into the User to CardSets associative table
            UsersToCardSet.insert {
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

    fun retrieveCardSet(setId: Int, email: String): List<CardData> {
        return transaction {
            logger.addLogger(StdOutSqlLogger)


            val cardSetQuery = CardSetsDb.select {
                CardSetsDb.id eq setId
            }



            if (!cardSetQuery.empty()) {
                val cardSetRow = cardSetQuery.first()
                if (cardSetRow[CardSetsDb.email] != email) { // This particular if statement
                    // The user does not have access to this particular Card Set
                    emptyList()

                } else {
                    val cards = (CardSetsToCardsDb innerJoin CardsDb)
                            .select {
                                CardSetsDb.id eq setId
                            }.map {
                                val cardData = CardData(it[CardsDb.id].value, it[CardsDb.term], it[CardsDb.definition])
                                cardData
                            }

                    cards

                }
            } else {
                emptyList()
            }


        }
    }

    /**
     * Retrieves all CardSets associated with a given email
     */
    fun retreiveCardSetsFromUser(email: String): List<CardSetInfo> {
        return transaction {
            logger.addLogger(StdOutSqlLogger)

            val cardSets = (UsersToCardSet innerJoin CardSetsDb).select {
                UsersToCardSet.userEmail eq email
            }.map {
                CardSetInfo(it[CardSetsDb.id].value, it[CardSetsDb.title], it[CardSetsDb.subject])
            }
            cardSets


        }
    }

}