package com.neoeducation.server.serverdata

import com.neoeducation.notes.CardSetData
import com.neoeducation.notes.CardSetInfo


open class ResponseBody(val msg: String)

/**
 * Standard Response Kit for /save-card-set that returns whether the authentication
 * was a success as well as the id of the card set that was created. The id will be -1
 * if the creation was a failure
 */
data class SaveCardSetResponse(val id: Int) : ResponseBody("")

data class HasCredentialsResponse(val loggedIn: Boolean) : ResponseBody("")

data class RetrieveCardSetResponse(val cardSet: CardSetData) : ResponseBody("")
data class RetrieveCardSetsResponse(val cardSets: List<CardSetInfo>) : ResponseBody("")


object AuthenticationFailureResponse : ResponseBody("Authentication Failed")
object InvalidCardsetResponse : ResponseBody("Not a valid card set")


data class ApiResponse(val authSucc: Boolean, val body: ResponseBody)

