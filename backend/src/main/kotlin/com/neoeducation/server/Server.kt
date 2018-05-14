package com.neoeducation.server

import freemarker.template.Configuration

import spark.Service.ignite
import spark.template.freemarker.FreeMarkerEngine
import java.io.File
import java.io.IOException
import com.google.api.client.googleapis.auth.oauth2.*
import com.google.api.client.http.HttpTransport
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import spark.Request
import spark.Response
import java.util.*

class Server{

    private val CLIENT_ID = "904281358251-rhgerstv3o3t53nal0jat706npmmler4.apps.googleusercontent.com"
    fun start(){

        val http = ignite()


        http.get("/testAuth") { request: Request, response: Response ->
            val qm = request.queryMap()

            val idTokenString = qm.value("idToken")
            if(verifyId(idTokenString)) {
                // we have verified the ID, it is time to do action
                println("VERIFIED")
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
        val verifier = GoogleIdTokenVerifier.Builder(NetHttpTransport(), JacksonFactory())
                .setAudience(Collections.singletonList(CLIENT_ID))
                .build()

        val idToken = verifier.verify(idTokenString)
        return idToken != null


    }


}
