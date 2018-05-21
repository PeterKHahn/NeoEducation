package com.neoeducation.notes

import java.util.*


data class LinkedText(val linkId: String, val text: String) : TextElement()

data class StandardText(val text: String) : TextElement()

sealed class TextElement


class Text(val input: String) {
    private val regex = Regex("""\{(.*?)}""", RegexOption.MULTILINE)

    val groups: Sequence<MatchGroup>

    init {
        val res = regex.findAll(input)
        groups = res.mapNotNull { it.groups[1] }


    }


    fun toTextElement(): List<TextElement> {
        val standardList = input.split(regex).iterator()
        val linkedList = groups.map { it.value }.iterator()

        val res = LinkedList<TextElement>()
        res.add(StandardText(standardList.next()))
        while (standardList.hasNext()) {
            res.add(LinkedText("", linkedList.next()))
            res.add(StandardText(standardList.next()))
        }
        return res

    }


}
