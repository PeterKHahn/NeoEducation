package com.neoeducation.main

import com.neoeducation.notes.Card
import com.neoeducation.notes.CardSet
import com.neoeducation.notes.StandardCard
import com.neoeducation.server.Server

fun main(args: Array<String>) {
    println("Hello world")
    val card = StandardCard("id1")

    Server().start()
    println(card.definition)

}