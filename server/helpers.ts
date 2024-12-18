import CryptoJS from 'crypto-js';

const key = useRuntimeConfig().encryptionKey;
const parsedKey = CryptoJS.enc.Utf8.parse(key);

export const encryptPassword = (plaintext: string) => {
  if (!key) {
    throw new Error('Encryption key is not set');
  }

  const encrypted = CryptoJS.AES.encrypt(`${plaintext}`, key)
  
  return encrypted.toString()
}

export const decryptPassword = (ciphertext: string) => {
  if (!key) {
    throw new Error('Encryption key is not set');
  }

  const decrypted = CryptoJS.AES.decrypt(ciphertext, key)

  return decrypted.toString(CryptoJS.enc.Utf8)
}

export const comparePasswords = ({ password, encryptedPassword }: { password: string, encryptedPassword: string }) => {
  const decrypted = decryptPassword(encryptedPassword);
  return password === decrypted;
}