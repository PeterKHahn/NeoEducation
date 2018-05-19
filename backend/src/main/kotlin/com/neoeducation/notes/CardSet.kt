package com.neoeducation.notes

import io.ktor.application.ApplicationCall
import io.ktor.content.TextContent
import io.ktor.features.ContentConverter
import io.ktor.http.ContentType
import io.ktor.pipeline.PipelineContext
import io.ktor.request.ApplicationReceiveRequest
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

class StandardCard(id : String,  var term: String="", var definition: String="") : Card(id){
    override fun toString(): String {
        return "TERM: $term DEF: $definition"
    }
}

sealed class Card(val id : String) {

}


class TempCardConverter : ContentConverter {
    override suspend fun convertForSend(context: PipelineContext<Any, ApplicationCall>, contentType: ContentType, value: Any): Any? {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override suspend fun convertForReceive(context: PipelineContext<ApplicationReceiveRequest, ApplicationCall>): Any? {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

}