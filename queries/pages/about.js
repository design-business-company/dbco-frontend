import { contentBlocksQuery } from "../blocks";
import { seoQuery } from "../fragments";

export const aboutQuery = groq`*[_type=="about"][0] {
  ...,
  ${seoQuery},
  ${contentBlocksQuery},
}`;
