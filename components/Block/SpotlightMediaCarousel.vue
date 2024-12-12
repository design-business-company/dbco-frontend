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
    >
      <div class="spotlight-media-carousel__container">
        <BlockMedia
          v-for="item in items"
          :key="item._key"
          :media="item"
          class="spotlight-media-carousel__slide"
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
import { onKeyStroke } from "@vueuse/core";
import { clamp } from "@/utils/clamp";

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
      return clamp(view * 0.02, 16, 40);
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
  e.preventDefault();
  emblaApi.value.scrollNext();
});

onKeyStroke("ArrowLeft", (e) => {
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

    @include tablet {
      flex: 0 0 35vw;
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
        height: clamp(350px, 60vh, 800px);
        aspect-ratio: var(--slide-aspect-ratio);
      }
    }
  }
}
</style>
