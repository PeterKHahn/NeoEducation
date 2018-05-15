package com.neoeducation.server


import com.google.api.client.auth.oauth2.StoredCredential
import spark.Service.ignite
import com.google.api.client.googleapis.auth.oauth2.*
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import com.google.api.client.util.store.DataStore
import com.google.api.client.util.store.DataStoreFactory
import com.google.api.client.util.store.FileDataStoreFactory
import spark.Request
import spark.Response
import java.io.File
import java.util.*

class Server{

    private val CLIENT_ID = "904281358251-rhgerstv3o3t53nal0jat706npmmler4.apps.googleusercontent.com"
    private val verifier: GoogleIdTokenVerifier
    private val dataStoreFactory: DataStoreFactory
    private val dataStorage: DataStore<StoredCredential>
    init {
        verifier = GoogleIdTokenVerifier.Builder(NetHttpTransport(), JacksonFactory())
                .setAudience(Collections.singletonList(CLIENT_ID))
                .build()
        dataStoreFactory = FileDataStoreFactory(File("secrets/credentials"))
        dataStorage = dataStoreFactory.getDataStore("authentication-tokens")
    }
    fun start(){

        val http = ignite()


        http.post("/authenticate") { request: Request, response: Response ->

            val idTokenString = request.body()

            val idToken = verifier.verify(idTokenString)

            if(idToken != null) {
                // we have verified the ID, it is time to do action
                println("VERIFIED")

                val payload = idToken.payload
                val email = payload.email


                // Puts the credentials into storage, linked to the email
                val credential = GoogleCredential().setAccessToken(idTokenString)
                dataStorage.set(email, StoredCredential(credential))

                // Sends a cookie in the response that will allow them to access their info without re-logging in
                response.cookie("token", idTokenString)
                
                "VERIFIED"
            } else {
                // we have failed verification, fuck off fraud
                println("NOT VERIFIED")
                "NOT VERIFIED"
            }
        }

        http.get("/testCookie") {request: Request, response: Response ->
            val cookies = request.cookies()
            for(entry in cookies) {
                println(entry)
            }
            println("GOT THE COOKIES")


            "COOKIES"
        }




    }




}
