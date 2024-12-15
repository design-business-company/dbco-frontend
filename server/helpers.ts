import crypto from 'crypto';

const key = process.env.ENCRYPTION_KEY;

export const encryptPassword = (plaintext: string) => {
  if (!key) {
    throw new Error('Encryption key is not set');
  }

  const keyBuffer = Buffer.from(key, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}


export const decryptPassword = (ciphertext: string) => {
  if (!key) {
    throw new Error('Encryption key is not set');
  }

  const keyBuffer = Buffer.from(key, 'hex');
  const [ivHex, encrypted] = ciphertext.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export const comparePasswords = ({ password, encryptedPassword }: { password: string, encryptedPassword: string }) => {
  const decrypted = decryptPassword(encryptedPassword);
  return password === decrypted;
}