package com.neoeducation.main

import com.neoeducation.notes.Card
import com.neoeducation.notes.CardSet
import com.neoeducation.server.Server

fun main(args: Array<String>) {
    println("Hello world")
    val cardSet = CardSet("cardset1")
    val card = Card("id1")
    cardSet.add(card)


    card.definition = "hello"
    Server().start()
    println(card.definition)

}