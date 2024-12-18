import Cryptr from 'cryptr';

const key = useRuntimeConfig().encryptionKey;
const cryptr = new Cryptr(key);

export const encryptPassword = (plaintext: string) => {
  console.log('encrypting: ', plaintext, cryptr)
  if (!key) {
    throw new Error('Encryption key is not set');
  }

  const encrypted = cryptr.encrypt(plaintext);
  
  return encrypted
}

export const decryptPassword = (ciphertext: string) => {
  console.log('decrypting: ', ciphertext, cryptr)
  if (!key) {
    throw new Error('Encryption key is not set');
  }

  const decrypted = cryptr.decrypt(ciphertext);

  return decrypted
}

export const comparePasswords = ({ password, encryptedPassword }: { password: string, encryptedPassword: string }) => {
  const decrypted = decryptPassword(encryptedPassword);
  return password === decrypted;
}