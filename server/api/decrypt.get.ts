import { decryptPassword } from "~/server/helpers";

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
  });

  const query = getQuery(event)

  const encryptedPassword = query.password as string;

  if (!encryptedPassword) {
    return {
      error: 'Password is required',
    }
  }

  const decrypted = decryptPassword(encryptedPassword);

  return {
    decrypted
  }
})