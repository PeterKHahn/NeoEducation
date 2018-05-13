package com.neoeducation.notes

import java.util.*

class CardSet(val id: String, var title: String=""){
    private val cardCollection: MutableList<Card>
    val size : Int
        get() = cardCollection.size

    init {
        cardCollection = ArrayList()
    }

    fun add(card : Card) {
        cardCollection.add(card)
    }
    fun add(id: String, term: String, definition: String){
        add(Card(id, term, definition))
    }
}

class Card(val id : String,  var term: String="", var definition: String="") {

}