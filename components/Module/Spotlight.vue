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
import { clamp } from "@/utils/clamp";
import tinycolor from "tinycolor2";

import { defaultThemes, useTheme } from "~/composables/useTheme";
import { useElementBounding, useElementVisibility } from "@vueuse/core";

const { theme, setTemporaryTheme, restoreTheme } = useTheme();

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

// Process the theme prop to return the appropriate theme
const processedTheme = computed(() => {
  if (!props.theme) return defaultThemes.light; // Default to light theme
  if (props.theme.theme === "light") return defaultThemes.light; // Use default light theme
  if (props.theme.theme === "dark") return defaultThemes.dark; // Use default dark theme
  if (props.theme.theme === "custom") {
    // Merge custom theme properties with defaults for missing fields
    return {
      background:
        props.theme.backgroundPrimary?.hex || defaultThemes.light.background,
      foreground:
        props.theme.foregroundPrimary?.hex || defaultThemes.light.foreground,
      accent: props.theme.accentPrimary?.hex || defaultThemes.light.accent,
    };
  }
  return defaultThemes.light; // Fallback to light theme if nothing matches
});

// Reference the component's root element
const spotlightRef = ref(null);

const isVisible = useElementVisibility(spotlightRef);
const { top } = useElementBounding(spotlightRef);

const lastPosTop = ref(0);
const scrollPercent = ref(0);
const direction = ref(1);

const startColors = ref(null);

const handleScroll = () => {
  if (!isVisible.value) return;

  direction.value = top.value > lastPosTop.value ? 1 : -1;
  const percentScrolled = (direction.value * (top.value / (window.innerHeight / 2))) + .5;

  if (percentScrolled >= 0 && percentScrolled <= 1 && !startColors.value) {
    const startBackground = getComputedStyle(document.documentElement).getPropertyValue('--background-primary').trim();
    const startForeground = getComputedStyle(document.documentElement).getPropertyValue('--foreground-primary').trim();
    const startAccent = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim();
    console.log('setting start colors', startBackground, startForeground, startAccent)
    startColors.value = {
      background: startBackground,
      foreground: startForeground,
      accent: startAccent,
    }
  }

  if ((percentScrolled > 1 || percentScrolled < 0) && startColors.value) {
    startColors.value = null;
    console.log('resetting start colors', startColors.value)
  }

  if (percentScrolled > 0 && isVisible.value && startColors.value) {
    console.log(scrollPercent.value)
    scrollPercent.value = percentScrolled;
    const background = tinycolor.mix(startColors.value.background, processedTheme.value.background, scrollPercent.value * 100).toHexString()
    const foreground = tinycolor.mix(startColors.value.foreground, processedTheme.value.foreground, scrollPercent.value * 100).toHexString()
    const accent = tinycolor.mix(startColors.value.accent, processedTheme.value.accent, scrollPercent.value * 100).toHexString()

    setTemporaryTheme({
      background,
      foreground,
      accent,
    })
  }

  lastPosTop.value = top.value;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
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

  console.log('isVisible', isVisible.value)
  if (!isVisible.value) {
    restoreTheme();
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
