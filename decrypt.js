let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('不支持 crypto');
}

// same 96-bit nonce
let nonce = Buffer.alloc(12, 0xff);

// same 256-bit key
let key = Buffer.alloc(32, 0x01);

// same associated data
let assocData = Buffer.alloc(16, 0xaa);

// auth tag from encryption output
let authTag = Buffer.from("9ef622cec7a5719261031e9ca91049d4", "hex");

// cipher data from encryption output
let cipherData = Buffer.from("25805b670d5834ecb8a018ea87b6ff864117762481880fc723690d0e2d0cfd08a43c144291eb2df148b0d6981b66ca101344ea27c7a0860c2e5f1a7eed1e70eb", "hex");

// create decipher
let decipher = crypto.createDecipheriv("chacha20-poly1305", key, nonce, {
  authTagLength: 16
});

// set associated data
decipher.setAAD(assocData);

// decrypt data, which should be the initial data
const message = decipher.update(cipherData);
// bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
// set the auth tag received during encryption
decipher.setAuthTag(authTag);
// validate the MAC is ok => this will throw an
// exception if the cipher, assoc data, or auth tag are
// inaccurate
decipher.final();
console.log('decipher:', message)
// console.log(decipher.final())
// try {
//   decipher.final();
// } catch (err) {
//   console.error('Authentication failed!');
//   return;
// }