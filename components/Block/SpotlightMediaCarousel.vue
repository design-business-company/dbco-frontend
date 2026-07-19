<template>
  <Observer :onEnter="handleEnter" :onLeave="handleExit">
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
      :aria-label="`${title} media carousel — use left and right arrow keys to scroll`"
      data-carousel
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <div class="spotlight-media-carousel__container">
        <BlockMedia
          v-for="(item, index) in items"
          :key="item._key"
          :media="item"
          class="spotlight-media-carousel__slide"
          :style="{
            '--slide-aspect-ratio': item.aspectRatio
              ?.toString()
              .replace(':', '/'),
          }"
          :sizes="calculateSlideSizes(item.aspectRatio)"
        />
      </div>
      <CarouselPauseButton
        v-if="settings?.autoplay"
        :playing="autoScrollControl.playing.value"
        @toggle="autoScrollControl.toggle"
      />
    </div>
  </Observer>
</template>

<script setup>
import emblaCarouselVue from "embla-carousel-vue";
import AutoScroll from "embla-carousel-auto-scroll";
import { onKeyStroke } from "@vueuse/core";
import { clamp } from "@/utils/clamp";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
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

const handleFocus = () => {
  isFocused.value = true;
};

const handleBlur = () => {
  isFocused.value = false;
};

const emblaPlugins = computed(() => {
  if (props.settings && props.settings.autoplay) {
    return [
      AutoScroll({
        speed: 0.75,
        startDelay: 0,
        // Started from the in-view Observer via useAutoScrollControl so
        // reduced-motion users never get auto-scroll started for them.
        playOnInit: false,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        // Default (true): pause while keyboard focus is inside, mirroring
        // the mouse-hover pause (WCAG 2.2.2).
        stopOnFocusIn: true,
      }),
    ];
  }

  return [];
});

const autoScrollControl = useAutoScrollControl(() => emblaPlugins.value[0]);

const [emblaRef, emblaApi] = emblaCarouselVue(
  {
    loop: true,
    skipSnaps: true,
    align: (view) => {
      return clamp(view * 0.02, 16, 40);
    },
    containScroll: false,
    inViewThreshold: 0.01,
    dragFree: true,
    dragThreshold: 50,
  },
  emblaPlugins.value
);

const handleEnter = () => {
  autoScrollControl.play();
};
const handleExit = () => {
  autoScrollControl.stop();
};

const { trackInteract } = useCarouselTracking(emblaApi, () => props.title);

const calculateSlideSizes = (aspectRatio) => {
  if (!aspectRatio) return `(min-width: ${DEVICE_SIZES.tablet}px) 60vw, 90vw`;

  return `(min-width: ${DEVICE_SIZES.tablet}px) ${widthTimesAspectRatio(aspectRatio, 50)}vw, ${widthTimesAspectRatio(aspectRatio, 80)}vw`;
}

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

    @include tablet {
      flex: 0 0 35vw;
    }
  }

  &:hover {
    cursor: grab;

    &:deep(.vid-container) {
      cursor: grab;
    }
  }

  &:active {
    cursor: grabbing;
  }

  &.variable-width {
    .spotlight-media-carousel__slide {
      --maxHeight: calc(100vw - calc(var(--grid-margin) * 3));

      width: auto;
      height: clamp(350px, 40vmax, var(--maxHeight));
      aspect-ratio: var(--slide-aspect-ratio);
      flex: unset;

      @include laptop {
        --maxHeight: calc(40vw - calc(var(--grid-margin) * 3));
        min-height: 500px;
      }

      @include desktop {
        // max-height: 800px;
        min-height: 600px;
      }
    }
  }
}
</style>
