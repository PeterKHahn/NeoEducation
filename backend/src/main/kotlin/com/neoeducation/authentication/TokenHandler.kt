package com.neoeducation.authentication

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTCreationException
import com.auth0.jwt.exceptions.JWTVerificationException
import java.util.*
import javax.crypto.KeyGenerator


/**
 * The TokenHandler class handles authentication tokens given out by this server so that clients can access the
 * NeoEducation API. The exact hashing of the token is left as implementation details, but this class provides the
 * framework for creating, verifying, and extracting information from tokens.
 *
 * @author Peter Hahn
 */
class TokenHandler {


    private val algorithm: Algorithm

    init {

        val keyGen = KeyGenerator.getInstance("HmacSHA256")
        val secretKey = keyGen.generateKey()
        val key = secretKey.encoded

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


            return UserInformation(email)


        } catch (e: JWTVerificationException) {
            throw NotVerifiedException()
        }
    }
}

class NotVerifiedException : RuntimeException("User was not verified")

data class AuthenticationToken(val token: String)

data class UserInformation(val email: String)