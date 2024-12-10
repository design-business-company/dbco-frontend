<template>
  <div class="spotlight" ref="spotlightRef">
    <Grid class="grid--full spotlight__content">
      <Space size="bigger" sizeTablet="big" />

      <Column
        startMobile="1"
        spanMobile="12"
        spanLaptop="5"
        class="spotlight__heading"
      >
        <Text element="div" size="body-2">
          <h2 class="spotlight__title">{{ title }}</h2>
          <span v-if="shortDescription" class="spotlight__separator"> — </span>
          <span class="spotlight__short-description">
            <SanityContent
              v-if="shortDescription"
              :blocks="shortDescription.text"
            />
          </span>
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

      <Space size="small" sizeTablet="big" sizeLaptop="huge" />
    </Grid>
    <div class="spotlight__media">
      <BlockSpotlightMedia :items="media" v-if="media.length < 5" />
      <BlockSpotlightMediaCarousel :settings="settings" :items="media" v-else />
    </div>
    <Space size="bigger" sizeTablet="big" sizeLaptop="huger" />
  </div>
</template>

<script setup>
import { useIntersectionObserver } from "@vueuse/core";
import { defaultThemes, useTheme } from "~/composables/useTheme";

const { getProcessedTheme, setTheme } = useTheme();

const spotlightRef = ref(null);

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: Object,
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
  theme: {
    type: Object,
    required: false,
  },
});

const scrollPercent = computed(() => props.theme?.settings?.percent ?? 50);
const processedTheme = computed(() => getProcessedTheme(props.theme));

const { stop } = useIntersectionObserver(spotlightRef, ([entry]) => {
  if (entry.isIntersecting) {
    setTheme(processedTheme.value);
  }
}, {
  threshold: 0,
  rootMargin: `-${scrollPercent.value}% 0px -${scrollPercent.value}% 0px`,
})
  
onBeforeUnmount(() => {
  stop();
})

// Override root-level variables locally within the component
watchEffect(() => {
  if (spotlightRef.value) {
    spotlightRef.value.style.setProperty(
      "--background-primary",
      processedTheme.value.background
    );
    spotlightRef.value.style.setProperty(
      "--foreground-primary",
      processedTheme.value.foreground
    );
    spotlightRef.value.style.setProperty(
      "--accent-primary",
      processedTheme.value.accent
    );

    // Redefine dependent variables
    spotlightRef.value.style.setProperty(
      "--background-secondary",
      `color-mix(in srgb, var(--background-primary) 90%, var(--foreground-primary) 10%)`
    );
    spotlightRef.value.style.setProperty(
      "--background-tertiary",
      `color-mix(in srgb, var(--background-primary) 90%, var(--foreground-primary) 10%)`
    );
    spotlightRef.value.style.setProperty(
      "--foreground-secondary",
      `color-mix(in srgb, var(--foreground-primary) 70%, var(--background-primary) 30%)`
    );
    spotlightRef.value.style.setProperty(
      "--foreground-tertiary",
      `color-mix(in srgb, var(--foreground-primary) 30%, var(--background-primary) 70%)`
    );
    spotlightRef.value.style.setProperty(
      "--accent-secondary",
      `color-mix(in srgb, var(--accent-primary) 50%, var(--background-primary) 50%)`
    );
  }
});
</script>

<style lang="scss">
.spotlight {
  display: flex;
  flex-direction: column;
  // background-color: var(--background-primary);
  // color: var(--foreground-primary);

  &__content {
    padding-inline: var(--grid-margin);
    width: 100%;
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
    color: inherit;
  }

  &__tags {
    display: flex;
    align-items: center;
    gap: var(--tinier);
    flex-wrap: wrap;
    margin-bottom: var(--smaller);
  }

  &__details {
    display: flex;
    flex-direction: column;
    row-gap: var(--smallest);

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
      column-gap: var(--grid-gap);
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

  &__description > p,
  &__credits {
    max-width: 50ch;
  }
}
</style>
