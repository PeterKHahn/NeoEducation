package com.neoeducation.server

import com.google.common.collect.ImmutableMap
import freemarker.template.Configuration
import spark.ModelAndView
import spark.Spark.externalStaticFileLocation
import spark.Spark.get
import spark.template.freemarker.FreeMarkerEngine
import java.io.File
import java.io.IOException


class Server{
    fun start(){
        externalStaticFileLocation("src/main/resources/static");

        val freeMarker = createEngine()
        get("/", {req, res ->
            ModelAndView(ImmutableMap.of("title", "NeoEducation"), "home.ftl")
        }, freeMarker)

        get("/flash", {req, res ->
            ModelAndView(ImmutableMap.of("title", "Flash : NeoEducation"), "card-maker.ftl")}, freeMarker)
    }

    private fun createEngine(): FreeMarkerEngine {
        val config = Configuration()
        val templates = File("src/main/resources/spark/template/freemarker")
        try{
            config.setDirectoryForTemplateLoading(templates)
        } catch (ioe: IOException){
            println("ERROR: Directory for freemarker templates not found")
            System.exit(1)
        }
        return FreeMarkerEngine(config)
    }


}
