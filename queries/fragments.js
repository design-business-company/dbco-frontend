export const pictureFields = groq`
  ...,
  "aspectRatio": asset->metadata.dimensions.aspectRatio
`;

export const videoFields = groq`
  _type,
  _key,
  alt,
  caption,
  settings,
  "playbackId": file.asset->playbackId,
  "aspectRatio": file.asset->data.aspect_ratio,
  poster {
    ${pictureFields}
  }
`;

export const seoQuery = groq`
seo {
  ...,
  "image": image.asset->url
}
`;

export const themePickerFields = groq`
  theme,
  backgroundPrimary,
  foregroundPrimary,
  accentPrimary,
`;
export const themeSwitcherFields = groq`
  ${themePickerFields}
  settings {
    percent
  }
`;

export const buttonGroup = groq`
  _type == "buttonGroup" => {
    buttons[] {
      ...,
      link-> {
        _id,
        "slug": coalesce(slug.current, "/"),
      },
    }
  }
`;
