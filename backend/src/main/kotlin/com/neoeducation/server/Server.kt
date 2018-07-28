package com.neoeducation.server


import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import com.google.api.client.auth.oauth2.StoredCredential
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

            routing {

                post("/has-credentials") {
                    println("Checking if client has credentials")
                    val authToken = call.sessions.get<AuthenticationToken>()
                    if (authToken != null) {
                        println("Authentication token found")


                        if (tokenHandler.verify(authToken)) {
                            println("User is verified and logged in")

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

                        // Sends a cookie in the response that will allow them to access their info without re-logging in
                        call.sessions.set(tokenHandler.generate(email))

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
                    val authenticationToken = call.sessions.get<AuthenticationToken>()
                    if (authenticationToken != null) {
                        println("Authentication found...")
                        if (tokenHandler.verify(authenticationToken)) {
                            val userInformation = tokenHandler.retrieveUserInformation(authenticationToken)

                            val email = userInformation.email
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
                    val authenticationToken = call.sessions.get<AuthenticationToken>()
                    if (authenticationToken != null) {
                        println("Authentication found...")

                        if (tokenHandler.verify(authenticationToken)) {
                            println("Authentication success!")
                            val userInformation = tokenHandler.retrieveUserInformation(authenticationToken)
                            val email = userInformation.email


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
                    val authenticationToken = call.sessions.get<AuthenticationToken>()
                    if (authenticationToken != null) {
                        println("Authentication found...")


                        if (tokenHandler.verify(authenticationToken)) {
                            println("Authentication success!")
                            val userInformation = tokenHandler.retrieveUserInformation(authenticationToken)
                            val email = userInformation.email


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
