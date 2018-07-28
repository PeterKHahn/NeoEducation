package com.neoeducation.authentication

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
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
    private val expirationDays = 30

    init {

        val keyGen = KeyGenerator.getInstance("HmacSHA256")
        val secretKey = keyGen.generateKey()
        val key = secretKey.encoded

        algorithm = Algorithm.HMAC256(key)


    }

    /**
     * Given a user's email, generates a token with expiration, hashed with the initialized algorithm. Note that this
     * method should only be called after the client has offered credentials that the user belongs to them, either
     * through Google Authentication or a email and password combination.
     */
    fun generate(email: String): AuthenticationToken {
        val expirationDate = generateExpiration()


        val token = JWT.create()
                .withIssuer("auth0")
                .withExpiresAt(expirationDate)
                .withClaim("email", email)
                .sign(algorithm)

        return AuthenticationToken(token)


    }

    /**
     * A private method that generates the expiration date of the token given today's date. The number of days is
     * specified by the constant initialized.
     */
    private fun generateExpiration(): Date {
        val calendar = Calendar.getInstance()
        calendar.add(Calendar.DATE, expirationDays)
        return calendar.time
    }


    /**
     * Given an AuthenticationToken, returns true if it is authenticated and valid under the tokens created under
     * generate, and false if it does not
     */
    fun verify(auth: AuthenticationToken): Boolean {

        return try {
            val jwt = auth.token
            val verifier = JWT.require(algorithm)
                    .withIssuer("auth0")
                    .acceptExpiresAt(60)
                    .build()
            verifier.verify(jwt)

            //OK, we can trust this JWT

            true

        } catch (e: JWTVerificationException) {
            false

        }


    }

    /**
     * Given a AuthenticationToken, returns a UserInformation object that represents the data extracted from the
     * token. Only use this method after validating that the authentication token. If it is not valid, then this method
     * will throw a NotVerifiedException
     */
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