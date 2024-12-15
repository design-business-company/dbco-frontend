import { contentBlocksQuery } from "../blocks"
import { seoQuery, themeSwitcherFields } from "../fragments"

export const pageQuery = groq`*[_type=="page" && slug.current==$slug][0] {
  _type,
  _id,
  slug,
  pageTheme {
    ${themeSwitcherFields}
  },
  ${contentBlocksQuery},
  ${seoQuery},
}`