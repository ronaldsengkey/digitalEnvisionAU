const crypto = require('crypto'),
    NodeRSA = require('node-rsa'),
    fs = require('fs'),
    aes_key = process.env.AES_KEY_SERVER,
    aes_iv = process.env.AES_IV_SERVER,
    pub = fs.readFileSync('./publicKey.key', 'utf8'),
    priv = fs.readFileSync('./privateKey.key', 'utf8'),
    jwt = require('jsonwebtoken');

function generateToken(data, aesKey = aes_key, iv = aes_iv) {
    let dg = '';
    if(Array.isArray(data)){
        dg = data[0];
    }else{
        dg = data;
    }
    let coba = encryptAes(JSON.stringify({
        profile: dg.fullName,
        scope: [dg.category],
        type: dg.type,
        role: dg.role
    }));
    const jwtResult = jwt.sign({
        profile: coba
    }, process.env.KREDENTIAL_KEY, {
        // expiresIn: '365d'
        // expires in 1 year
        expiresIn: 300
        // expiresIn: 86400
        // expires in 24 hours
    });
    return {"token":jwtResult};
}

function jwtVerify(token) {
    try {
        let ct = jwt.verify(token, process.env.KREDENTIAL_KEY);
        return ct;
    } catch (err) {
        console.log("Not valid =>", err)
        return 401;
    }
}

function decryptAes(text, aesKey = aes_key, iv = aes_iv) {
    try {
        // text += "";
        let decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
        let decrypted = decipher.update(text, 'base64', 'utf8');
        return (decrypted + decipher.final('utf8'));
    } catch (error) {
        console.log('decryptAes: ', error);
        return false;
    }
}

function encryptAes(text, key = aes_key, iv = aes_iv) {
    try {
        let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    } catch (error) {
        console.log('error: ', error);
        return process.env.ERRORINTERNAL_RESPONSE;
    }
}

module.exports = {
    encryptAes,
    decryptAes,
    generateToken,
    jwtVerify
}