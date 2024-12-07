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
        speed: 0.9,
        startDelay: 0,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
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
  },
  emblaPlugins.value
);

const handleEnter = () => {
  if (props.settings && props.settings.autoplay) {
    const instance = emblaPlugins.value[0];

    if (!instance.isPlaying()) instance.play();
  }
};

const handleExit = () => {
  if (props.settings && props.settings.autoplay) {
    const instance = emblaPlugins.value[0];

    if (instance.isPlaying()) instance.stop();
  }
};

onKeyStroke("ArrowRight", (e) => {
  if (!isFocused.value) return; // Only respond if this carousel is focused
  e.preventDefault();
  emblaApi.value.scrollNext();
});

onKeyStroke("ArrowLeft", (e) => {
  if (!isFocused.value) return; // Only respond if this carousel is focused
  e.preventDefault();
  emblaApi.value.scrollPrev();
});
</script>

<style lang="scss" scoped>
.spotlight-media-carousel {
  width: 100%;
  overflow: hidden;
  outline: none;

  &__container {
    display: flex;
  }

  &__slide {
    width: 100%;
    flex: 0 0 calc(100% - calc(var(--smallest) * 2));
    margin-right: var(--grid-gap);
    display: flex;

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
      height: 40vh;
      aspect-ratio: var(--slide-aspect-ratio);
      flex: unset;

      @include tablet {
        flex: unset;
        height: clamp(350px, 60vh, 1024px);
        aspect-ratio: var(--slide-aspect-ratio);
      }
    }
  }
}
</style>
