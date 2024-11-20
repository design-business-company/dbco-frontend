export const pictureFields = groq`
  ...,
`

export const videoFields = groq`
  _type,
  _key,
  alt,
  caption,
  settings,
  "playbackId": file.asset->playbackId,
  "aspectRatio": file.asset->data.aspect_ratio,
`

export const seoQuery = groq`
seo {
  ...,
  "image": image.asset->url
}
`