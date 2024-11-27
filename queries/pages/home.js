import { contentBlocksQuery } from "../blocks";
import { seoQuery } from "../fragments";
export const homeQuery = groq`*[_type=="homepage"][0] {
  ...,
  ${contentBlocksQuery},
  ${seoQuery},
}`