const CryptoJS = require('crypto-js');

const key = "swuE9cmCZQwrkYRV"; 

function Decrypt(word) {
    let decrypt = CryptoJS.AES.decrypt(word, key);

    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}


function Encrypt(word) {
  
    let encrypted = CryptoJS.AES.encrypt(word, key);
        
    return encrypted.toString();
}

export {Decrypt , Encrypt}