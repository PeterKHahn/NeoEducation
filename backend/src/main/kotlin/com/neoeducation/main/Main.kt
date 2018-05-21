package com.neoeducation.main

import com.neoeducation.database.CardDatabase

fun main(args: Array<String>) {
    println("Hello world")

    val input = "{boy {Hello}{5}{There}{7}6yy"

    val re = Regex("""\{.*?}\{.*?}""")
    val re2 = Regex("""\{.*?}""")

    val res = re2.findAll(input)
    res.forEach { println(it.value) }

    CardDatabase.cardTest()

    // Start the server
    //Server().start()

}