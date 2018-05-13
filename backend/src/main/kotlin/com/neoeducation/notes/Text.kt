package com.neoeducation.notes

/**
 * Currently an unused set of classes, that will become necessary once we implement linking to various cards
 */
sealed class Text
class NormalText(text: String): Text()
class LinkedText(text: String, id: String): Text()


class Paragraph(){
    // TODO We need a list of Text to form a paragraph

    fun setText(text : String) {
        // TODO Sets the string to just a plan text
    }

    private fun coalesce(){
        // TODO After removing or adding, we can coalesce the Normal Texts if applicable
    }
}