package com.neoeducation.notes


data class CardData(val id: Int, val term: String, val definition: String, val priority: Int)

data class CardSetData(val id: Int, val title: String, val subject: String, val cards: List<CardData>)


data class CardSetReceived(val title: String = "[Untitled]", val subject: String = "", val cards: List<CardReceived>)
data class CardReceived(val id: Int = -1, val term: String, val definition: String, val priority: Int = 1) {
    fun validId(): Boolean {
        return id < 0
    }
}


data class CardSetRequest(val id: Int)


data class CardSetInfo(val id: Int, val title: String, val subject: String)

