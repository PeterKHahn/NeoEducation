package com.neoeducation.utility

class IdGenerator {
    companion object {
        private var id: Int = 0

        @Synchronized
        fun generate(prefix: String): String {
            val time = System.nanoTime()
            val res = "$prefix-$time-$id"
            id++
            return res
        }
    }
}