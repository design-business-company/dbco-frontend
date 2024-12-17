import {
  pictureFields,
  videoFields,
  themeSwitcherFields,
  buttonGroup,
} from "./fragments";

export const themeSwitcherQuery = groq`
_type == "themeSwitcher" => {
  ${themeSwitcherFields}
}
`;

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
    theme {
      ${themeSwitcherFields}
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
`;

export const mediaBlockQuery = groq`
_type == "media" => {
    media[] {
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
      ${pictureFields},
      ${videoFields}
    },
}
`;

export const carouselQuery = groq`
_type == "carousel" => {
    ...,

    items[] {
      ...,
      _type == "picture" => {
        ${pictureFields}
      },
      _type == "video" => {
        ${videoFields}
      },
    },
}
`;

const richTextQuery = groq`
_type == "richText" => {
  ...,
  text[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
          "slug": coalesce(reference->slug.current, "/"),
        }
    }
  }
}
`;

const textBlockQuery = groq`
_type == "textBlock" => {
  ...,
  textBody {
    text[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
            "slug": coalesce(reference->slug.current, "/"),
          }
      },
      ${mediaBlockQuery},
      ${buttonGroup}
    },
  }
}
`;

const staffGalleryQuery = groq`
_type == "staffGallery" => {
  ...,
  staff[]-> {
    ...,
    images[] {
      ...,
      media[] {
        ...,
        "aspectRatio": asset->metadata.dimensions.aspectRatio,
      }
    }
  }
}
`;

export const contentBlocksQuery = groq`
content[]{
  ...,
  ${themeSwitcherQuery},
  ${spotlightQuery},
  ${richTextQuery},
  ${textBlockQuery},
  ${mediaBlockQuery},
  ${carouselQuery},
  ${snackGridQuery},
  ${staffGalleryQuery}
}
`;
