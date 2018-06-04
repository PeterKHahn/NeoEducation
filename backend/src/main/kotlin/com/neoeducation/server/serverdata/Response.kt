package com.neoeducation.server.serverdata


open class ResponseBody(msg: String)

/**
 * Standard Response Kit for /save-card-set that returns whether the authentication
 * was a success as well as the id of the card set that was created. The id will be -1
 * if the creation was a failure
 */
data class SaveCardSetResponse(val id: Int) : ResponseBody("")

data class HasCredentialsResponse(val loggedIn: Boolean) : ResponseBody("")

data class RetrieveCardSetResponse(val authSucc: String) : ResponseBody("")

object AuthenticationFailureResponse : ResponseBody("Authentication Failed")


data class ApiResponse(val authSucc: Boolean, val body: ResponseBody)

