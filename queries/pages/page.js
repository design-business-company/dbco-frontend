import { contentBlocksQuery } from "../blocks"
import { seoQuery } from "../fragments"

export const pageQuery = groq`*[_type=="page" && slug.current==$slug][0] {
  ...,
  ${contentBlocksQuery},
  ${seoQuery},
}`