package com.neoeducation.server.serverdata

data class AuthenticationCookie(val token: String)

data class CardId(val authenticationSuccess: Boolean, val cardSetId: String)


