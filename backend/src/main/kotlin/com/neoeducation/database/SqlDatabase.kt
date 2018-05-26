package com.neoeducation.database

import com.neoeducation.notes.CardData
import com.neoeducation.notes.CardSetData
import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SchemaUtils.create
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.Connection

// https://github.com/JetBrains/Exposed/wiki/DAO


object Cards : IntIdTable() {
    val term = text("term")
    val definition = text("definition")
}

class DatabaseCard(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<DatabaseCard>(Cards)

    var term by Cards.term
    var definition by Cards.definition
}


object CardSets : IntIdTable() {
    val title = varchar("title", 255)
    val subject = varchar("subject", 255)

}

class DatabaseCardSet(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<DatabaseCardSet>(CardSets)

    var title by CardSets.title
    var subject by CardSets.subject

    val cards by DatabaseCard via CardSetsToCards

}


object CardSetsToCards : Table() {
    val cardSetId = reference("id", CardSets.id)
    val cardId = reference("id", Cards.id)
}


object Users : IdTable<String>("email") {
    override val id: Column<EntityID<String>>
        get() = email.entityId()

    val email = varchar("email", 32)
    val fullName = varchar("full_name", 32)
}

class DatabaseUser(id: EntityID<String>) : Entity<String>(id) {
    companion object : EntityClass<String, DatabaseUser>(Users)

    var email by Users.email
    var fullName by Users.fullName

    val cardSets by DatabaseCardSet via UsersToCardSet
}

object UsersToCardSet : Table() {
    val userEmail = reference("email", Users.email)
    val cardSetId = reference("cardSet", CardSets.id)
}


class CardDatabase(name: String) {
    init {

        val url = "jdbc:sqlite:$name"
        Database.connect(url, "org.sqlite.JDBC")
        TransactionManager.manager.defaultIsolationLevel = Connection.TRANSACTION_SERIALIZABLE

        println("Initializing Databases")
        transaction {
            logger.addLogger(StdOutSqlLogger)
            create(Cards, CardSets)

        }

    }

    private fun insertCard(card: CardData) {
        transaction {
            logger.addLogger(StdOutSqlLogger)
            create(Cards)
            Cards.insert {
                it[term] = card.term
                it[definition] = card.definition
            }
        }
    }

    fun insertCardSet(email: String, cardSet: CardSetData) {
        transaction {
            logger.addLogger(StdOutSqlLogger)
            create(CardSets, CardSetsToCards, UsersToCardSet)

            val newCardSet = DatabaseCardSet.new {
                title = cardSet.title
                subject = cardSet.subject

            }

            val newUser = DatabaseUser.new {
                this.email = email
                this.fullName = "default name"

            }


            // Insert into the User to CardSets associative table
            UsersToCardSet.insert {
                it[userEmail] = email
                it[cardSetId] = newCardSet.id
            }


            CardSets.insert {
                it[title] = cardSet.title
                it[subject] = cardSet.subject
            }

            // Adds the elements into the associative table
            cardSet.cards.forEach { card ->

                insertCard(card)

                val newCard = DatabaseCard.new {
                    term = card.term
                    definition = card.definition
                }

                CardSetsToCards.insert {
                    it[cardSetId] = newCardSet.id
                    it[cardId] = newCard.id

                }
            }

        }
    }

    fun retrieveCardSet(setId: Int): List<DatabaseCard> {
        return transaction {
            logger.addLogger(StdOutSqlLogger)
            create(Cards, CardSets, CardSetsToCards)

            val cards = DatabaseCardSet[setId].cards.toList()
            cards

        }
    }

    /**
     * Retrieves all CardSets associated with a given email
     */
    fun retreiveCardSetsFromUser(email: String): List<DatabaseCardSet> {
        return transaction {
            logger.addLogger(StdOutSqlLogger)
            create(UsersToCardSet, CardSets)
            val cards = DatabaseUser[email].cardSets.toList()
            cards


        }
    }

}