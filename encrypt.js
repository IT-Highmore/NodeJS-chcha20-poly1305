let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('不支持 crypto');
}
// example 96-bit nonce
let nonce = Buffer.alloc(12, 0xff);

// example 256-bit key
let key = Buffer.alloc(32, 0x01);

// some associated data 
let assocData = Buffer.alloc(16, 0xaa);

// some data to encrypt
let data = Buffer.alloc(64, 0xbb);

// construct the cipher
let cipher = crypto.createCipheriv('chacha20-poly1305', key, nonce, {
  authTagLength: 16
});
const plaintext = 'Hello world';
// add associated data to cipher
cipher.setAAD(assocData, {
  plaintextLength: Buffer.byteLength(plaintext)
});
// cipher.setAAD(assocData);
// encrypt the data which will return an encrypted Buffer
// that is of equal length to the overall input to the
// stream cipher
cipher.update(data);
// 25805b670d5834ecb8a018ea87b6ff864117762481880fc723690d0e2d0cfd08a43c144291eb2df148b0d6981b66ca101344ea27c7a0860c2e5f1a7eed1e70eb
// <Buffer ce f3 09 8f 18 70 da 0f 55 8a 26 18 44 e5 2a f5 3f d6 bb 62 ea 40 a6 da 3e da 6e 9c 6b dc 0e 3e 44 39 8b 46 59 92 12 a5 88 6d 38 45 82 20 32 74 5b 9e ... 14 more bytes>
// console.log('encrypt:', cipher.update(data))
// finalize cipher which allows us to calculate the MAC
cipher.final();
// obtain the 128-bit poly1305 MAC that includes our associated data
const keyMessage = cipher.getAuthTag()
console.log('getAuthTag:', keyMessage);
// <Buffer 9e f6 22 ce c7 a5 71 92 61 03 1e 9c a9 10 49 d4>