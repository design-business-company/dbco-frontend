<template>
  <Grid class="tool-gallery">
    <Column
      v-for="item in data"
      span="12"
      span-tablet="4"
      class="tool-gallery__item"
    >
      <BlockMedia :media="item.media[0].media[0]" />
      <Space size="tiny" />
      <BlockTextBody
        class="tool-gallery__caption"
        :blocks="item.description.text"
      />
    </Column>
  </Grid>
</template>

<script setup>
/* ----------------------------------------------------------------------------
 * Fetch data from sanity
 * --------------------------------------------------------------------------*/
const query = groq`*[_type=="tools" && featured] | order(orderRank) {
  title,
  description,
  orderRank,
  media[] {
    media[] {
      ...,
      _type,
      _key,
      alt,
      caption,
      settings,
      _type == "picture" => {
        "aspectRatio": asset->metadata.dimensions.aspectRatio
      },
      _type == "video" => {
        "playbackId": file.asset->playbackId,
        "aspectRatio": file.asset->data.aspect_ratio,
        poster {
          ...,
          "aspectRatio": asset->metadata.dimensions.aspectRatio
        }
      }
    }
  }
}`;

const { data, error } = await useSanityQuery(query);
if (error.value) {
  console.error("Sanity query error:", error.value);
  await navigateTo("/error");
}
</script>

<style lang="scss" scoped>
.tool-gallery {
  &__item {
    margin-bottom: var(--big);
  }

  &__caption {
    max-width: 50ch;

    @include tablet {
      max-width: 70ch;
      padding-right: var(--small);
    }
  }
}
</style>
