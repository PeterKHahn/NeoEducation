package com.neoeducation.authentication

import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.FileOutputStream;
import java.security.SecureRandom;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.spec.IvParameterSpec;
import java.util.Base64;

class AesEncryption {


    private val secretKey: SecretKey

    init {
        secretKey = generateKey()
    }

    private fun generateKey(): SecretKey {
        val keyGen = KeyGenerator.getInstance("AES")
        keyGen.init(128)

        return keyGen.generateKey()
    }

    fun encrypt(message: String) {
        val aesCipher = Cipher.getInstance("AES")
        val byteText = "Hello there".toByteArray(Charsets.UTF_8)
        aesCipher.init(Cipher.ENCRYPT_MODE, secretKey)
        val byteCypherText = aesCipher.doFinal(byteText)
    }

    companion object {



        fun temp2(secKey: SecretKey) {
            val aesCipher = Cipher.getInstance("AES")
            val byteText = "Hello there".toByteArray(Charsets.UTF_8)
            aesCipher.init(Cipher.ENCRYPT_MODE, secKey)
            val byteCypherText = aesCipher.doFinal(byteText)
        }




        val iv = ByteArray(128/8)

    }
}