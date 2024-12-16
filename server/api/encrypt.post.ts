import { encryptPassword } from "~/server/helpers";

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
  });

  const query = getQuery(event)

  const password = query.password as string;

  if (!password) {
    return {
      error: 'Password is required',
    }
  }

  const encrypted = encryptPassword(password);

  return {
    encrypted
  }
})