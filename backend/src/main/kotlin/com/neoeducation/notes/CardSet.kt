package com.neoeducation.notes

class CardSet(val id: String, val owner: String, cardData: CardSetReceived) {
    val title: String = cardData.title
    val subject: String = cardData.subject
    val cards: List<StandardCard> = cardData.cards.map { StandardCard("", it) }
}

class StandardCard(val id: String, card: CardReceived) {
    val term: String = card.term
    val definition: String = card.definition


}

data class CardData(val id: String, val term: String, val definition: String)

data class CardSetData(val id: String, val title: String, val subject: String, val cards: List<CardData>)


data class CardSetReceived(val title: String = "[Untitled]", val subject: String = "", val cards: List<CardReceived>)
data class CardReceived(val term: String, val definition: String)

