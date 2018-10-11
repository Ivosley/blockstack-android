require("blockstack.js")
require("base64.js")

var transitPrivateKey = blockstack.generateAndStoreTransitKey()

function makeAuthResponse(privateKey, appPrivateKey) {
  const token = blockstack.makeAuthResponse(privateKey, {}, null, {}, null, appPrivateKey);
  console.log(JSON.stringify(blockstack.decodeToken(token)))
  return token
}

function redirectToSignIn(appDomain, redirectURI, manifestURI, scopes) {
  var authRequest = blockstack.makeAuthRequest(transitPrivateKey, redirectURI, manifestURI, scopes, appDomain)
  blockstack.redirectToSignInWithAuthRequest(authRequest)
}

function handlePendingSignIn(nameLookupUrl, authResponseToken) {
  blockstack.handlePendingSignIn(nameLookupUrl, authResponseToken)
  .then(function(userData) {
    var userDataString = JSON.stringify(userData)
    android.signInSuccess(userDataString)
  }, function(error) {
    android.signInFailure(error.toString())
  })
}

function loadUserData() {
  return blockstack.loadUserData()
}

function isUserSignedIn() {
  return blockstack.isUserSignedIn()
}

function signUserOut()  {
  return blockstack.signUserOut()
}

function validateProofs(profile, ownerAddress, name) {
  blockstack.validateProofs(JSON.parse(profile), ownerAddress, name)
  .then(function(proofs) {
    android.validateProofsResult(JSON.stringify(proofs))
  }, function(error) {
    android.validateProofsFailure(error.toString)
  })
}

function lookupProfile(username, zoneLookupFileURL) {
  blockstack.lookupProfile(username, zoneLookupFileURL)
  .then(function(userData) {
      android.lookupProfileResult(username, JSON.stringify(userData))
  }, function(error) {
      android.lookupProfileFailure(username, error.toString())
  })
}

function getFile(path, options, uniqueIdentifier) {
  console.log('getFile: ' + uniqueIdentifier)
  blockstack.getFile(path, options)
  .then(function(result) {
    if(typeof result === "string") {
        console.log('getFile: retrieved String')
        var isBinary = false
        android.getFileResult(result, uniqueIdentifier, isBinary)
    } else {
        console.log('getFile: retrieved binary file')
        var isBinary = true
        console.log('Base64 encoding binary file')
        encodedResult = Base64.encode(result)
        android.getFileResult(encodedResult, uniqueIdentifier, isBinary)
    }
  })
}

function putFile(path, content, options, uniqueIdentifier, isBinary) {
  console.log('putFile: ' + uniqueIdentifier)

  if(isBinary) {
    console.log('Base64 decoding binary file')
    content = Base64.decode(content)
  }

  blockstack.putFile(path, content, options)
  .then(function(result) {
    console.log(result)
    android.putFileResult(result, uniqueIdentifier)
  }, function(error) {
    android.putFileFailure(error.toString(), uniqueIdentifier)
  })
}

function encryptContent(content, options, isBinary) {
  console.log('encryptContent')
  if (isBinary) {
    content = Base64.decode(content)
  }

  encryption = blockstack.encryptContent(content, options)
  return JSON.parse(encryption)
}

function decryptContent(cipher, options, isBinary) {
  console.log('decryptContent')
  if (isBinary) {
    cipher = Base64.decode(cipher)
  }

  var decrypted = blockstack.decryptContent(cipher, options)
  if (typeof decrypted === "string") {
    console.log(decrypted)
    return decrypted
  } else {
    return Base64.encode(decrypted)
  }
}

function getAppBucketUrl(gaiaHubUrl, appPrivateKey) {
  blockstack.getAppBucketUrl(gaiaHubUrl, appPrivateKey)
  .then(function(url) {
      android.getAppBucketUrlResult(url)
  }, function(error) {
    android.getAppBucketUrlFailure(error.toString())
  })
}

function getUserAppFileUrl(path, username, appOrigin) {
  blockstack.getUserAppFileUrl(path, username, appOrigin)
  .then(function(url) {
    if (url != null) {
      android.getUserAppFileUrlResult(url)
    } else {
     android.getUserAppFileUrlResult('NO_URL')
    }
  }, function(error) {
    android.getUserAppFileUrlFailure(error.toString())
  })
}
