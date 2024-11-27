import { seoQuery } from "../fragments"

export const aboutQuery = groq`*[_type=="about"][0] {
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