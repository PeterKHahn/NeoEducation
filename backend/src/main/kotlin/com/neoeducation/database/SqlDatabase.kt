package com.neoeducation.database

import com.neoeducation.notes.CardData
import com.neoeducation.notes.CardSetData
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

object CardSet : Table() {
    val id = varchar("id", 16).primaryKey()
    val title = varchar("title", 255)
    val subject = varchar("subject", 255)
}

object CardSetToCards : Table() {
    val idCardSet = varchar("idCardSet", 16) references CardSet.id
    val idCard = varchar("idCard", 16) references Card.id
}

object Users : Table() {
    val email = varchar("email", 32).primaryKey()
    val fullName = varchar("full_name", 32)
}

object UsersToCardSet : Table() {
    val userEmail = varchar("email", 32) references Users.email
    val cardSetId = varchar("cardSetId", 32) references CardSet.id
}

class CardDatabase(name: String) {
    init {

        val url = "jdbc:sqlite:$name"
        Database.connect(url, "org.sqlite.JDBC")
        TransactionManager.manager.defaultIsolationLevel = Connection.TRANSACTION_SERIALIZABLE

        println("Initializing Databases")
        transaction {
            logger.addLogger(StdOutSqlLogger)
            create(Card, CardSet, CardSetToCards)

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
            create(CardSet, CardSetToCards, UsersToCardSet)

            // Insert into the User to CardSet associative table
            UsersToCardSet.insert {
                it[userEmail] = email
                it[cardSetId] = cardSet.id
            }

            CardSet.insert {
                it[id] = cardSet.id
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
            create(Card, CardSet, CardSetToCards)

            CardSet.innerJoin(CardSetToCards).innerJoin(Card).selectAll().forEach {
                println(it)
            }
        }

    }

    /**
     * Retrieves all CardSets associated with a given email
     */
    fun retreiveCardSetFromUser(email: String) {
        transaction {
            logger.addLogger(StdOutSqlLogger)
            create(UsersToCardSet, CardSet)
            UsersToCardSet.innerJoin(CardSet).select {
                UsersToCardSet.userEmail.eq(email)
            }.forEach { println(it) }

        }
    }

    companion object {
        /*fun cardTest() {
            val database = CardDatabase("secrets/databases/testxdb.sqlite3")
            val cardList1 = listOf<CardData>(
                    CardData("id1", "term1", "def1"),
                    CardData("id2", "term2", "def2"),
                    CardData("id3", "term3", "def3"))
            val cardList2 = listOf<CardData>(
                    CardData("id4", "term4", "def4"),
                    CardData("id5", "term5", "def5"),
                    CardData("id6", "term6", "def6"))
            val cardSet1 = CardSetData("dataId1", "title1", "subject1", cardList1)
            val cardSet2 = CardSetData("dataId2", "title2", "subject2", cardList2)

            database.insertCardSet(cardSet1)
            database.insertCardSet(cardSet2)

            database.retrieveCardSet("dataId1")

        }*/
    }
}