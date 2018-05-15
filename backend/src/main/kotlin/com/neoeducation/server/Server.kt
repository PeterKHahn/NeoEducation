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

            if(verifyId(idTokenString)) {
                // we have verified the ID, it is time to do action
                println("VERIFIED")

                response.cookie("token", idTokenString)

                val credential = GoogleCredential().setAccessToken(idTokenString)

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

    private fun verifyId(idTokenString: String): Boolean {

        val idToken = verifier.verify(idTokenString)
        return idToken != null


    }


}
