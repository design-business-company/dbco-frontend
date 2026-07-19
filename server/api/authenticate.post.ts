import { comparePasswords } from "~/server/helpers";
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '5jjj3zhb',
  dataset: 'production',
  apiVersion: '2022-03-07',
  useCdn: false,
})

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
  });

  const body = await readBody(event)

  const password = body?.password as string;
  const slug = body?.slug as string;

  if (!password || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password and slug are required',
    })
  }

  const encryptedPassword = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0].password.password`,
    { slug }
  )

  // Unknown slugs (or pages without a password) have no ciphertext — without
  // this check Cryptr.decrypt throws and the request 500s. Respond exactly
  // like a wrong password so the endpoint can't be used to probe which slugs
  // exist or are gated.
  if (!encryptedPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid password',
    })
  }

  const isAuthenticated = comparePasswords({ password, encryptedPassword });

  if (!isAuthenticated) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid password',
    })
  }

  return {
    slug,
    authenticated: true
  }
})