import { seoQuery } from "../fragments"

export const contactQuery = groq`*[_type=="contact"][0] {
  ...,
  content[]{
    ...,
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
  },
  ${seoQuery}
}`