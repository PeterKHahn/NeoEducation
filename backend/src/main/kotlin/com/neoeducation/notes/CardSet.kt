package com.neoeducation.notes

class CardSet(val id: Int, val owner: String, cardData: CardSetReceived) {
    val title: String = cardData.title
    val subject: String = cardData.subject
    val cards: List<StandardCard> = cardData.cards.map { StandardCard(-1, it) }
}

class StandardCard(val id: Int, card: CardReceived) {
    val term: String = card.term
    val definition: String = card.definition


}

data class CardData(val id: Int, val term: String, val definition: String)

data class CardSetData(val id: Int, val title: String, val subject: String, val cards: List<CardData>)


data class CardSetReceived(val title: String = "[Untitled]", val subject: String = "", val cards: List<CardReceived>)
data class CardReceived(val term: String, val definition: String)


data class CardSetRequest(val id: Int)


data class CardSetInfo(val id: Int, val title: String, val subject: String)

