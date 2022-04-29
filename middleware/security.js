const crypto = require('crypto');


module.exports.generateRSA = async function (req, res){
    const { publicKey, privateKey } = crypto.generateKeyPairSync ('rsa', {
        // modulusLength: 4096,
        modulusLength: 512,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: 'top secret'
        }
      });
      return {"keyPub": publicKey, "keyPrive":privateKey};
}

