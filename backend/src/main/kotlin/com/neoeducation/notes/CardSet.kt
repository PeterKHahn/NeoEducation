package com.neoeducation.notes

import java.util.*

class CardSet(val id: String, val owner : String, var title: String=""){
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
        add(StandardCard(id, term, definition))
    }
}

class StandardCard(id : String,  var term: String="", var definition: String="") : Card(id) {

    override fun toString(): String {
        return "ID: $id TERM: $term DEF: $definition"
    }
}

class TempThing(val id : String, val term : String, val definition : List<String>, val obj: StandardCard) {
    override fun toString() : String {
        return "ID: $id TERM: $term DEF: $definition OBJ: $obj"
    }
}

sealed class Card(val id : String) {

}
