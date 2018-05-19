package com.neoeducation.notes

data class LinkedText(val linkId : String, val text : String) : Text()

data class StandardText(val text: String) : Text()

sealed class Text
