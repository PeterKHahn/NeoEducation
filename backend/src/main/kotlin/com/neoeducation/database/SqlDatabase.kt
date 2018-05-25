package com.neoeducation.database

import com.neoeducation.notes.CardData
import com.neoeducation.notes.CardSetData
import org.jetbrains.exposed.dao.EntityID
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.IntIdTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SchemaUtils.create
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.Connection


object Card : Table() {
    val id = varchar("id", 16).primaryKey()
    val term = text("term")
    val definition = text("definition")
}

object CardSets : IntIdTable() {
    val title = varchar("title", 255)
    val subject = varchar("subject", 255)
}

class DatabaseCardSet(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<DatabaseCardSet>(CardSets)

    val title by CardSets.title
    val subject by CardSets.subject

}


object CardSetToCards : Table() {
    val idCardSet = varchar("idCardSet", 16) references CardSets.id
    val idCard = varchar("idCard", 16) references Card.id
}

object Users : Table() {
    val email = varchar("email", 32).primaryKey()
    val fullName = varchar("full_name", 32)
}

object UsersToCardSet : Table() {
    val userEmail = varchar("email", 32) references Users.email
    val cardSetId = varchar("cardSetId", 32) references CardSets.id
}

class CardDatabase(name: String) {
    init {

        val url = "jdbc:sqlite:$name"
        Database.connect(url, "org.sqlite.JDBC")
        TransactionManager.manager.defaultIsolationLevel = Connection.TRANSACTION_SERIALIZABLE

        println("Initializing Databases")
        transaction {
            logger.addLogger(StdOutSqlLogger)
            create(Card, CardSets, CardSetToCards)

        }

    }

    private fun insertCard(card: CardData) {
        transaction {
            logger.addLogger(StdOutSqlLogger)
            create(Card)
            Card.insert {
                it[term] = card.term
                it[id] = card.id
                it[definition] = card.definition
            }
        }
    }

    fun insertCardSet(email: String, cardSet: CardSetData) {
        transaction {
            logger.addLogger(StdOutSqlLogger)
            create(CardSets, CardSetToCards, UsersToCardSet)

            // Insert into the User to CardSets associative table
            UsersToCardSet.insert {
                it[userEmail] = email
                it[cardSetId] = cardSet.id
            }

            CardSets.insert {
                it[title] = cardSet.title
                it[subject] = cardSet.subject
            }

            // Adds the elements into the associative table
            cardSet.cards.forEach { card ->
                CardSetToCards.insert { row ->
                    row[idCardSet] = cardSet.id
                    row[idCard] = card.id
                    insertCard(card)
                }
            }

        }
    }

    fun retrieveCardSet(id: String) {
        transaction {
            logger.addLogger(StdOutSqlLogger)
            create(Card, CardSets, CardSetToCards)

            CardSets.innerJoin(CardSetToCards).innerJoin(Card).selectAll().forEach {
                println(it)
            }
        }

    }

    /**
     * Retrieves all CardSets associated with a given email
     */
    fun retreiveCardSetsFromUser(email: String) {
        transaction {
            logger.addLogger(StdOutSqlLogger)
            create(UsersToCardSet, CardSets)
            val query = UsersToCardSet.innerJoin(CardSets).slice(CardSets.columns).select {
                UsersToCardSet.userEmail.eq(email)
            }
            val a = DatabaseCardSet.wrapRows(query).toList()
            a.forEach {
                println(it)
            }

        }
    }

}