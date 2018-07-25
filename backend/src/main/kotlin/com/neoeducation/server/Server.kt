package com.neoeducation.server


import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import com.google.api.client.auth.oauth2.StoredCredential
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import com.google.api.client.util.store.DataStore
import com.google.api.client.util.store.DataStoreFactory
import com.google.api.client.util.store.MemoryDataStoreFactory
import com.neoeducation.authentication.AuthenticationToken
import com.neoeducation.authentication.TokenHandler
import com.neoeducation.database.CardDatabase
import com.neoeducation.database.ElementNotInDatabaseException
import com.neoeducation.notes.CardSetReceived
import com.neoeducation.notes.CardSetRequest
import com.neoeducation.server.serverdata.*
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.auth.Authentication
import io.ktor.auth.UserIdPrincipal
import io.ktor.auth.authenticate
import io.ktor.auth.authentication
import io.ktor.auth.jwt.JWTPrincipal
import io.ktor.auth.jwt.jwt
import io.ktor.features.ContentNegotiation
import io.ktor.gson.gson
import io.ktor.http.ContentType
import io.ktor.request.receive
import io.ktor.request.receiveText
import io.ktor.response.respond
import io.ktor.response.respondText
import io.ktor.routing.post
import io.ktor.routing.routing
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.sessions.*
import java.util.*


class Server {

    private val clientId = "904281358251-rhgerstv3o3t53nal0jat706npmmler4.apps.googleusercontent.com"
    private val verifier: GoogleIdTokenVerifier
    private val dataStoreFactory: DataStoreFactory
    private val dataStorage: DataStore<StoredCredential>
    private val cardDatabase: CardDatabase

    private val tokenHandler: TokenHandler

    init {
        verifier = GoogleIdTokenVerifier.Builder(NetHttpTransport(), JacksonFactory())
                .setAudience(Collections.singletonList(clientId))
                .build()
        dataStoreFactory = MemoryDataStoreFactory.getDefaultInstance();
        dataStorage = StoredCredential.getDefaultDataStore(dataStoreFactory)
        cardDatabase = CardDatabase("secrets/databases/cardsdb.sqlite3")
        tokenHandler = TokenHandler()


    }

    private val algorithm = Algorithm.HMAC256("secret")


    private fun makeJwtVerifier(issuer: String, audience: String): JWTVerifier = JWT
            .require(algorithm)
            .withAudience(audience)
            .withIssuer(issuer)
            .build()


    fun start() {


        embeddedServer(Netty, 4567) {

            install(Sessions) {
                cookie<AuthenticationToken>("SESSION")
            }
            install(ContentNegotiation) {
                gson {
                    // http://ktor.io/features/gson.html
                    setPrettyPrinting()

                }

            }
            val jwtIssuer = "https://jwt-provider-domain/" // environment.config.property("jwt.domain").getString()
            val jwtAudience = "jwt-audience" // environment.config.property("jwt.audience").getString()
            val jwtRealm = "ktor sample app" // environment.config.property("jwt.realm").getString()


            install(Authentication) {
                println("hey1")

                jwt(name = "cardcalls") {
                    println("BRAVO")
                    realm = jwtRealm
                    verifier(makeJwtVerifier(jwtIssuer, jwtAudience))

                    validate { credential ->
                        println("Charlie")
                        println(credential)
                        if (true || credential.payload.audience.contains(jwtAudience)) {
                            JWTPrincipal(credential.payload)

                        } else {
                            null
                        }
                    }
                }


            }

            routing {
                // https://ktor.io/features/authentication.html

                authenticate("cardcalls") {
                    post("/test-card-set") {
                        println("AYYYYY")
                        val principal = call.authentication.principal<UserIdPrincipal>()
                        println("OH HO2")

                        println(principal)
                        call.respond("hello there")
                    }
                }

                post("/has-credentials") {
                    println("Checking if client has credentials")
                    val cookie = call.sessions.get<AuthenticationToken>()
                    if (cookie != null) {
                        println("Authentication token found")

                        val authenticationCode = cookie.jwt

                        if(tokenHandler.verify(cookie)) {
                            // TODO fill with all the stuff we have for Google
                            println("User is verified and logged in")

                            // TODO have their email retrieved

                            // TODO respond positively

                            call.respond(ApiResponse(true, HasCredentialsResponse(true)))


                        }else {
                            // We have failed verification, fuck off fraud
                            println("Verification Failed")
                            call.respond(ApiResponse(false, HasCredentialsResponse(false)))
                        }

                        val idToken = verifier.verify(authenticationCode)
                        if (idToken != null) {
                            // we have verified the ID, it is time to do action
                            println("User is verified and logged in")
                            val payload = idToken.payload
                            val email = payload.email


                            // Puts the credentials into storage, linked to the email
                            val credential = GoogleCredential().setAccessToken(authenticationCode)
                            dataStorage.set(email, StoredCredential(credential))


                            call.respond(ApiResponse(true, HasCredentialsResponse(true)))


                        } else {
                            // We have failed verification, fuck off fraud
                            println("Verification Failed")
                            call.respond(ApiResponse(false, HasCredentialsResponse(false)))
                        }

                    } else {
                        println("Authentication cookie not found")
                        call.respond(ApiResponse(false, HasCredentialsResponse(false)))

                    }
                }

                post("/authenticate") {
                    println("Got a message")
                    val authenticationCode = call.receiveText()
                    val idToken = verifier.verify(authenticationCode)
                    if (idToken != null) {
                        // we have verified the ID, it is time to do action
                        println("Verified")
                        val payload = idToken.payload
                        val email = payload.email

                        // Puts the credentials into storage, linked to the email
                        val credential = GoogleCredential().setAccessToken(authenticationCode)
                        dataStorage.set(email, StoredCredential(credential))

                        // Sends a cookie in the response that will allow them to access their info without re-logging in
                        call.sessions.set(AuthenticationCookie(authenticationCode))

                        call.respondText("Verified, authentication set", ContentType.Text.Html)


                    } else {
                        // We have failed verification, fuck off fraud
                        println("NOT VERIFIED")
                        call.respondText("Not verified", ContentType.Text.Html)
                    }

                }


                /**
                 * This is not autosave, this is normal save, where we assign a new ID
                 */
                post("/save-card-set") {
                    val authenticationCookie = call.sessions.get<AuthenticationCookie>()
                    if (authenticationCookie != null) {
                        println("Authentication found...")
                        val token = authenticationCookie.token
                        val idToken = verifier.verify(token)
                        if (idToken != null) {
                            println("Authentication success!")
                            val payload = idToken.payload
                            val email = payload.email
                            val cardSet = call.receive<CardSetReceived>()
                            println(cardSet)
                            val cards = cardSet.cards
                            val title = cardSet.title
                            val subject = cardSet.subject

                            val cardSetId = cardDatabase.insertCardSet(email, CardSetReceived(title, subject, cards))
                            call.respond(ApiResponse(true, SaveCardSetResponse(cardSetId)))

                        } else {
                            call.respond(ApiResponse(false, AuthenticationFailureResponse))

                        }
                    } else {
                        call.respond(ApiResponse(false, AuthenticationFailureResponse))

                    }
                }

                post("/retrieve-card-set") {
                    val authenticationCookie = call.sessions.get<AuthenticationCookie>()
                    if (authenticationCookie != null) {
                        println("Authentication found...")
                        val token = authenticationCookie.token
                        val idToken = verifier.verify(token)
                        if (idToken != null) {
                            println("Authentication success!")

                            val payload = idToken.payload
                            val email = payload.email

                            val request = call.receive<CardSetRequest>()
                            val id = request.id
                            println("retreiving card set")
                            try {
                                val resultCardSet = cardDatabase.retrieveCardSet(id, email)
                                println("card set found!")
                                call.respond(ApiResponse(true, RetrieveCardSetResponse(resultCardSet)))


                            } catch (e: ElementNotInDatabaseException) {
                                println("Card set not found")
                                call.respond(ApiResponse(false, InvalidCardsetResponse))
                            }


                        } else {
                            call.respond(ApiResponse(false, AuthenticationFailureResponse))

                        }
                    } else {
                        call.respond(ApiResponse(false, AuthenticationFailureResponse))

                    }


                }

                post("/retrieve-all-cards") {
                    val authenticationCookie = call.sessions.get<AuthenticationCookie>()
                    if (authenticationCookie != null) {
                        println("Authentication found...")
                        val token = authenticationCookie.token
                        val idToken = verifier.verify(token)
                        if (idToken != null) {
                            println("Authentication success!")

                            val payload = idToken.payload
                            val email = payload.email

                            println("retreiving card sets")

                            val resultCardSets = cardDatabase.retreiveCardSetsFromUser(email)
                            println("card set found!")
                            call.respond(ApiResponse(true, RetrieveCardSetsResponse(resultCardSets)))


                        } else {
                            call.respond(ApiResponse(false, AuthenticationFailureResponse))

                        }
                    } else {
                        call.respond(ApiResponse(false, AuthenticationFailureResponse))
                    }
                }


            }
        }.start(wait = true)


    }


}
