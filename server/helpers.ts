import CryptoJS from 'crypto-js';
import AES from 'crypto-js/aes';

const key = useRuntimeConfig().encryptionKey;
const parsedKey = CryptoJS.enc.Utf8.parse(key);

export const encryptPassword = (plaintext: string) => {
  console.log('encrypting: ', plaintext, CryptoJS)
  if (!key) {
    throw new Error('Encryption key is not set');
  }

  const encrypted = AES.encrypt(`${plaintext}`, key)
  
  return encrypted.toString()
}

export const decryptPassword = (ciphertext: string) => {
  console.log('decrypting: ', ciphertext, CryptoJS)
  if (!key) {
    throw new Error('Encryption key is not set');
  }

  const decrypted = AES.decrypt(ciphertext, key)

  return decrypted.toString(CryptoJS.enc.Utf8)
}

export const comparePasswords = ({ password, encryptedPassword }: { password: string, encryptedPassword: string }) => {
  const decrypted = decryptPassword(encryptedPassword);
  return password === decrypted;
}