package com.neoeducation.server


import com.google.api.client.auth.oauth2.StoredCredential
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import com.google.api.client.util.store.DataStore
import com.google.api.client.util.store.DataStoreFactory
import com.google.api.client.util.store.FileDataStoreFactory
import com.neoeducation.notes.CardSetReceived
import com.neoeducation.server.serverdata.AuthenticationCookie
import com.neoeducation.server.serverdata.CardId
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
import java.io.File
import java.util.*

class Server {

    private val clientId = "904281358251-rhgerstv3o3t53nal0jat706npmmler4.apps.googleusercontent.com"
    private val verifier: GoogleIdTokenVerifier
    private val dataStoreFactory: DataStoreFactory
    private val dataStorage: DataStore<StoredCredential>

    init {
        verifier = GoogleIdTokenVerifier.Builder(NetHttpTransport(), JacksonFactory())
                .setAudience(Collections.singletonList(clientId))
                .build()
        dataStoreFactory = FileDataStoreFactory(File("secrets/credentials"))
        dataStorage = dataStoreFactory.getDataStore("010101")
    }

    fun start() {


        embeddedServer(Netty, 4567) {

            install(Sessions) {
                cookie<AuthenticationCookie>("SESSION")
            }
            install(ContentNegotiation) {
                gson {
                    // http://ktor.io/features/gson.html
                    setPrettyPrinting()

                }

            }

            routing {

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
                            call.respond(CardId(true, "a"))
                            //call.respondText("Success", ContentType.Text.Html)

                        } else {
                            call.respond(CardId(false, ""))

                        }
                    } else {
                        call.respond(CardId(false, ""))
                        //call.respondText("Failure, identification was not sent", ContentType.Text.Html)

                    }
                }


            }
        }.start(wait = true)


    }

    fun saveCardSet(cardSet: CardSetReceived) {

    }


}
