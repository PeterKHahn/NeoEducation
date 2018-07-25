package com.neoeducation.authentication

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.SignatureException
import java.util.*
import javax.crypto.KeyGenerator


class TokenHandler {


    private val key: ByteArray

    init {

        val keyGen = KeyGenerator.getInstance("HMACSHA256")
        if (keyGen == null) {
            println("HEY YOUR KEYGENERATED IS NULL")
        }

        val secretKey = keyGen.generateKey()
        key = secretKey.encoded


    }

    fun generate(email: String): AuthenticationToken {

        val expirationDate = GregorianCalendar(118, 7, 25).time // Date(2018, 7, 25)

        val jwt = Jwts.builder().setIssuer("http://neoeducation.com/")
                .setSubject("subject")
                .setExpiration(expirationDate)
                .claim("scope", "self api/bux")
                .claim("email", email)
                .signWith(SignatureAlgorithm.HS256, key)
                .compact()
        return AuthenticationToken(jwt)
    }


    fun verify(token: AuthenticationToken): Boolean {

        try {
            val jwt = token.jwt
            val jwtClaims = Jwts.parser().setSigningKey(key).parseClaimsJws(jwt)

            val claims = jwtClaims.body
            val subject = claims.subject
            val a = claims["email"].toString() // FIXME not sure if this is legal but okay, let's check it out later





            println("Auth success! Come get your key bih")
            println(subject)

            //OK, we can trust this JWT

            return true

        } catch (e: SignatureException) {

            println("FAILURE AUTHENTICATION HACKER BIH")
        }


        return false
    }
}

data class AuthenticationToken(val jwt: String)