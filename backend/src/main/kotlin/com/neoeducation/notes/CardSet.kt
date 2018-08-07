package com.neoeducation.notes


data class CardData(val id: Int, val term: String, val definition: String, val priority: Int)

data class CardSetData(val id: Int, val title: String, val subject: String, val cards: List<CardData>)


/**
 * The following classes are data classes that represent information received from the front end
 */
data class CardSetReceived(val title: String = "[Untitled]", val subject: String = "", val cards: List<CardReceived>)

data class UpdateCardSetReceived(val id: Int, val title: String, val subject: String, val cards: List<UpdatedCardReceived>)


data class CardReceived(val term: String, val definition: String)

data class UpdatedCardReceived(val id: Int, val term: String, val definition: String, val priority: Int)


/**
 *
 */

data class CardSetRequest(val id: Int)


data class CardSetInfo(val id: Int, val title: String, val subject: String)

