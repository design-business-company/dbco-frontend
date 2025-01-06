import { contentBlocksQuery } from "../blocks";
import { seoQuery, themeSwitcherFields } from "../fragments";
export const homeQuery = groq`*[_type=="homepage"][0] {
  _id,
  pageTheme {
    ${themeSwitcherFields}
  },
  ${contentBlocksQuery},
  ${seoQuery},
}`