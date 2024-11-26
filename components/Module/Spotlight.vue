<template>
  <div class="spotlight">
    <Space />
    <Grid class="grid--full spotlight__content">
      <Column
        startMobile="1"
        spanMobile="12"
        spanLaptop="5"
        class="spotlight__heading"
      >
        <Text element="div" size="body-2">
          <h2 class="spotlight__title">{{ title }}</h2>
          <span v-if="shortDescription" class="spotlight__separator"> — </span>
          <SanityContent
            v-if="shortDescription"
            :blocks="shortDescription.text"
          />
        </Text>
        <div class="spotlight__tags">
          <BlockTag v-for="tag in tags" :text="tag.title" :key="tag._key" />
        </div>
      </Column>
      <Column
        spanMobile="12"
        spanLaptop="6"
        startMobile="1"
        startLaptop="7"
        class="spotlight__details"
      >
        <Text element="div" size="caption-2" class="spotlight__description">
          <SanityContent v-if="description?.text" :blocks="description.text" />
        </Text>
        <Text element="div" size="caption-2" class="spotlight__credits">
          <SanityContent v-if="credits?.text" :blocks="credits.text" />
        </Text>
      </Column>
    </Grid>
    <div class="spotlight__media">
      <BlockSpotlightMedia :items="media" v-if="media.length < 4" />
      <BlockSpotlightMediaCarousel :settings="settings" :items="media" v-else />
    </div>
    <Space />
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: false,
  },
  description: {
    type: Object,
    required: true,
  },
  credits: {
    type: Object,
    required: false,
  },
  tags: {
    type: Array,
    required: false,
  },
  media: {
    type: Array,
    required: true,
  },
  settings: {
    type: Object,
    required: false,
  },
});
</script>

<style lang="scss">
.spotlight {
  display: flex;
  flex-direction: column;
  row-gap: var(--big);
  margin-block: var(--bigger);

  &__content {
    padding-inline: var(--grid-margin);
    width: 100%;
    row-gap: var(--small);
    grid-template-rows: auto;
  }

  &__media {
    width: 100%;
  }

  &__heading {
    display: flex;
    flex-direction: column;
    row-gap: var(--tiny);

    [class^="text-"] {
      max-width: 30ch;
    }

    p {
      display: inline;
    }
  }

  &__title {
    display: inline;
  }

  &__separator,
  &__short-description {
    opacity: 0.6;
  }

  &__tags {
    display: flex;
    align-items: center;
    gap: var(--tinier);
    flex-wrap: wrap;
  }

  &__details {
    display: flex;
    flex-direction: column;
    column-gap: $grid-gap;
    row-gap: var(--smaller);

    @include tablet {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__description {
    display: flex;
    flex-direction: column;
    row-gap: var(--tiny);

    @include tablet {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column: auto / span 2;
      column-gap: $grid-gap;
    }

    & > p:only-child {
      grid-column-end: -1;
    }
  }

  &__details p {
    padding-right: var(--smallest);
  }

  &__credits {
    opacity: 0.6;
  }
}
</style>
