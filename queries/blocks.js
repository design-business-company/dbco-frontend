import { pictureFields, videoFields } from "./global";

export const spotlightQuery = groq`
  _type == "spotlight" => {
    "type": work->type,
    "title": work->title,
    "slug": work->slug.current,
    "shortDescription": work->shortDescription,
    "description": work->description,
    "credits": work->credits,
    "tags": work->tags[]-> {
      _key,
      title,
    },
    "media": work->media[] {
      _type == "picture" => {
        ${pictureFields}
      },
      _type == "video" => {
        ${videoFields}
      }
    },
    settings {
      autoplay,
      variableWidth
    }
  }
`;

export const snackGridQuery = groq`
_type == "snackGrid" => {
  items[] -> {
    _key,
    type,
    title,
    "slug": slug.current,
    shortDescription,
    media[] {
      _type == "picture" => {
        ${pictureFields}
      },
      _type == "video" => {
        ${videoFields}
      }
    },
  }
}
`

const richTextQuery = groq`
_type == "richText" => {
  ...,
  text[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
        "slug": @.reference->slug.current
      }
    }
  }
}
`

export const contentBlocksQuery = groq`
content[]{
  ...,
  ${spotlightQuery},
  ${richTextQuery},
  ${snackGridQuery}
}
`