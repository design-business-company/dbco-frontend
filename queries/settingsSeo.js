import { pictureFields } from "./fragments";

export const settingsSeoQuery = groq`*[_type=="settingsSeo"][0]{
  title,
  description,
  favicon {
    ${pictureFields}
  },
  image {
    ${pictureFields}
  }
}`;
