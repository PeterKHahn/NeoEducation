package com.neoeducation.authentication

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTCreationException
import com.auth0.jwt.exceptions.JWTVerificationException
import java.util.*
import javax.crypto.KeyGenerator


class TokenHandler {


    private val key: ByteArray
    private val algorithm: Algorithm

    init {

        val keyGen = KeyGenerator.getInstance("HmacSHA256")


        if (keyGen == null) {
            println("HEY YOUR KEYGENERATED IS NULL")
        }

        val secretKey = keyGen.generateKey()

        key = secretKey.encoded

        algorithm = Algorithm.HMAC256(key)


    }

    fun generate(email: String): AuthenticationToken {
        return try {
            val expirationDate = generateExpiration()

            val token = JWT.create()
                    .withIssuer("auth0")
                    .withExpiresAt(expirationDate)
                    .withClaim("email", email)
                    .sign(algorithm)

            AuthenticationToken(token)
        } catch (jwtce: JWTCreationException) {
            println("invalid authentication token")
            AuthenticationToken(".")

        }


    }

    private fun generateExpiration(): Date {
        val calendar = Calendar.getInstance()
        calendar.add(Calendar.DATE, 30)
        val expireTime = calendar.time
        println(expireTime)
        return expireTime
    }


    fun verify(auth: AuthenticationToken): Boolean {


        try {
            val jwt = auth.token
            val verifier = JWT.require(algorithm)
                    .withIssuer("auth0")
                    .acceptExpiresAt(60)
                    .build()
            verifier.verify(jwt)





            println("Auth success! Come get your key bih")

            //OK, we can trust this JWT

            return true

        } catch (e: JWTVerificationException) {
            return false

        }


    }

    fun retrieveUserInformation(auth: AuthenticationToken): UserInformation {
        try {
            val jwt = auth.token
            val verifier = JWT.require(algorithm)
                    .withIssuer("auth0")
                    .build()
            val decodedJwt = verifier.verify(jwt)
            val email = decodedJwt.getClaim("email").asString()
            val expiresAt = decodedJwt.expiresAt
            println(expiresAt)


            return UserInformation(email)


        } catch (e: JWTVerificationException) {
            throw NotVerifiedException()
        }
    }
}

class NotVerifiedException : RuntimeException("User was not verified")

data class AuthenticationToken(val token: String)

data class UserInformation(val email: String)