<template>
  <Observer :onEnter="handleEnter" :onLeave="handleExit">
    <CarouselPauseButton
      v-if="items?.length && settings?.autoplay"
      :playing="autoScrollControl.playing.value"
      @toggle="autoScrollControl.toggle"
    />
    <div
      v-if="items?.length"
      class="spotlight-media-carousel"
      :class="{
        'variable-width': settings ? settings.variableWidth : null,
      }"
      ref="emblaRef"
      :style="{
        '--grid-cols': items.length,
      }"
      tabindex="0"
      role="region"
      aria-roledescription="carousel"
      aria-label="Media carousel — use left and right arrow keys to scroll"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <div class="spotlight-media-carousel__container">
        <BlockMedia
          v-for="item in items"
          :key="item._key"
          :media="item"
          class="spotlight-media-carousel__slide"
          :class="[
            {
              '--center': settings?.slideAlignment === 'center',
            },
            {
              '--bottom': settings?.slideAlignment === 'bottom',
            },
          ]"
          :style="{
            '--slide-aspect-ratio': item.aspectRatio
              ?.toString()
              .replace(':', '/'),
          }"
          :sizes="calculateSlideSizes(item.aspectRatio)"
        />
      </div>
    </div>
  </Observer>
</template>

<script setup>
import emblaCarouselVue from "embla-carousel-vue";
import AutoScroll from "embla-carousel-auto-scroll";
import { ref, computed } from "vue";
import { onKeyStroke } from "@vueuse/core";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  settings: {
    type: Object,
    required: false,
  },
});

const isFocused = ref(false); // Track if this carousel is focused

// Auto-scroll is held for keyboard focus only (WCAG 2.2.2); a mouse press
// also focuses the root and must not hold it.
const handleFocus = (event) => {
  isFocused.value = true;
  if (event.target.matches(":focus-visible")) autoScrollControl.hold();
};

const handleBlur = () => {
  isFocused.value = false;
  autoScrollControl.release();
};

const emblaPlugins = computed(() => {
  if (props.settings && props.settings.autoplay) {
    return [
      AutoScroll({
        speed: 0.9,
        startDelay: 0,
        // Started from the in-view Observer via useAutoScrollControl so
        // reduced-motion users never get auto-scroll started for them.
        playOnInit: false,
        // false so useAutoScrollControl decides what resumes after a hover
        // or drag; with true the plugin stops for good and the pause
        // button's label goes stale.
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        // Must stay false alongside stopOnInteraction: false + dragFree +
        // loop (embla-carousel #1263, see SpotlightMediaCarousel.vue). The
        // keyboard-focus pause is handled in handleFocus/handleBlur.
        stopOnFocusIn: false,
      }),
    ];
  }

  return [];
});

const [emblaRef, emblaApi] = emblaCarouselVue(
  {
    loop: true,
    skipSnaps: true,
    align: (view) => {
      if (!process.client) return;
      const marginValue = getComputedStyle(document.documentElement)
        .getPropertyValue("--grid-margin")
        .trim();
      const marginNumber = parseInt(marginValue, 10);

      return marginNumber;
    },
    containScroll: false,
    inViewThreshold: 0.01,
    dragFree: true,
    dragThreshold: 50,
  },
  emblaPlugins.value
);

const autoScrollControl = useAutoScrollControl(
  () => emblaPlugins.value[0],
  emblaApi
);

const route = useRoute();
// Carousel blocks have no title in the schema — track by page path
const { trackInteract } = useCarouselTracking(emblaApi, () => route.path);

const calculateSlideSizes = (aspectRatio) => {
  if (!aspectRatio) return `(min-width: ${DEVICE_SIZES.tablet}px) 60vw, 90vw`;

  return `(min-width: ${DEVICE_SIZES.tablet}px) ${widthTimesAspectRatio(aspectRatio, 50)}vw, ${widthTimesAspectRatio(aspectRatio, 70)}vw`;
}

const handleEnter = () => {
  autoScrollControl.setInView(true);
};

const handleExit = () => {
  autoScrollControl.setInView(false);
};

onKeyStroke("ArrowRight", (e) => {
  if (!isFocused.value) return; // Only respond if this carousel is focused
  e.preventDefault();
  emblaApi.value.scrollNext();
  trackInteract();
});

onKeyStroke("ArrowLeft", (e) => {
  if (!isFocused.value) return; // Only respond if this carousel is focused
  e.preventDefault();
  emblaApi.value.scrollPrev();
  trackInteract();
});
</script>

<style lang="scss" scoped>
.spotlight-media-carousel {
  width: 100%;
  overflow: hidden;
  outline: none;
  position: relative;

  &:focus-visible {
    outline: solid;
    outline-offset: -2px;
  }

  &__container {
    display: flex;
  }

  &__slide {
    width: 100%;
    flex: 0 0 calc(100% - calc(var(--smallest) * 2));
    margin-right: var(--grid-gap);
    display: flex;
    align-items: flex-start;

    &.--center {
      align-items: center;
    }

    &.--bottom {
      align-items: flex-end;
    }

    @include tablet {
      flex: 0 0 calc(37.25vw - calc(var(--grid-margin) * 2));
    }
  }

  &:hover {
    cursor: grab;
  }

  &:active {
    cursor: grabbing;
  }

  &.variable-width {
    .spotlight-media-carousel__slide {
      width: auto;
      flex: unset;

      :deep(.pic),
      :deep(.vid-container) {
        width: auto;
        height: 40vh;
        aspect-ratio: var(--slide-aspect-ratio);
        flex-shrink: 0;
      }

      @include tablet {
        flex: unset;

        :deep(.pic),
        :deep(.vid-container) {
          height: clamp(350px, 60vh, 1024px);
        }
      }
    }
  }
}
</style>
