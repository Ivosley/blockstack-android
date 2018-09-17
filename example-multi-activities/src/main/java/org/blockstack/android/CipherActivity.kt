package org.blockstack.android

import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.drawable.BitmapDrawable
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.widget.Toast
import kotlinx.android.synthetic.main.activity_account.*
import kotlinx.android.synthetic.main.content_cipher.*
import org.blockstack.android.sdk.*
import org.json.JSONObject
import java.io.ByteArrayOutputStream

val TAG = CipherActivity::class.java.simpleName

class CipherActivity : AppCompatActivity() {

    private var _blockstackSession: BlockstackSession2? = null


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cipher)
        setSupportActionBar(toolbar)
        supportActionBar!!.setDisplayHomeAsUpEnabled(true)

        Log.d(TAG, "json " + intent.getStringExtra("json"))
        val userData = UserData(JSONObject(intent.getStringExtra("json")))
        _blockstackSession = BlockstackSession2(this, defaultConfig)
    }

    override fun onResume() {
        super.onResume()
        if (_blockstackSession?.loaded == true) {
            checkLogin()
        }
    }

    fun checkLogin() {
        if (blockstackSession().isUserSignedIn()) {
            //encryptDecryptString()
            putFileGetFile()
            //encryptDecryptImage()
        } else {
            navigateToAccount()
        }
    }

    private fun putFileGetFile() {
        blockstackSession().putFile("try.txt", "Hello from Blockstack2", PutFileOptions(encrypt = false)) {
            Log.d(TAG, "result: " + it.value)
            blockstackSession().getFile("try.txt", GetFileOptions(false)) {
                Log.d(TAG, "content " + it.value)
            }

        }

    }

    private fun navigateToAccount() {
        startActivity(Intent(this, AccountActivity::class.java))
    }

    fun encryptDecryptString() {
        val options = CryptoOptions()
        val cipherResult = blockstackSession().encryptContent("Hello Android", options)
        if (cipherResult.hasValue) {
            val cipher = cipherResult.value!!
            blockstackSession().decryptContent(cipher.json.toString(), options) { plainContentResult ->
                if (plainContentResult.hasValue) {
                    val plainContent: String = plainContentResult.value as String
                    runOnUiThread {
                        textView.setText(plainContent)
                    }
                } else {
                    Toast.makeText(this, "error: " + plainContentResult.error, Toast.LENGTH_SHORT).show()
                }
            }
        } else {
            Toast.makeText(this, "error: " + cipherResult.error, Toast.LENGTH_SHORT).show()
        }
    }

    fun encryptDecryptImage() {

        val drawable: BitmapDrawable = resources.getDrawable(R.drawable.default_avatar) as BitmapDrawable

        val bitmap = drawable.getBitmap()
        val stream = ByteArrayOutputStream()

        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, stream)
        val bitMapData = stream.toByteArray()

        val options = CryptoOptions()
        val cipherResult = blockstackSession().encryptContent(bitMapData, options)

        if (cipherResult.hasValue) {
            val cipher = cipherResult.value!!
            blockstackSession().decryptContent(cipher.json.toString(), options) { plainContentResult ->
                if (plainContentResult.hasValue) {
                    val plainContent: ByteArray = plainContentResult.value as ByteArray
                    val imageByteArray = plainContent
                    val bitmap = BitmapFactory.decodeByteArray(imageByteArray, 0, imageByteArray.size)
                    runOnUiThread {
                        imageView.setImageBitmap(bitmap)
                    }
                } else {
                    Toast.makeText(this, "error: " + plainContentResult.error, Toast.LENGTH_SHORT).show()
                }
            }
        } else {
            Toast.makeText(this, "error: " + cipherResult.error, Toast.LENGTH_SHORT).show()
        }
    }


    fun blockstackSession(): BlockstackSession2 {
        val session = _blockstackSession
        if (session != null) {
            return session
        } else {
            throw IllegalStateException("No session.")
        }
    }
}