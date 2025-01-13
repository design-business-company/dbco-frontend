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
          v-for="(item, index) in items"
          :key="item._key"
          :media="item"
          class="spotlight-media-carousel__slide"
          :style="{
            '--slide-aspect-ratio': item.aspectRatio
              ?.toString()
              .replace(':', '/'),
          }"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  </Observer>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
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

const onSlideChange = (ev) => {
  useTrackEvent("Carousel change", props.title);
};

onKeyStroke("ArrowRight", (e) => {
  e.preventDefault();
  emblaApi.value.scrollNext();
});

onKeyStroke("ArrowLeft", (e) => {
  e.preventDefault();
  emblaApi.value.scrollPrev();
});

onMounted(() => {
  emblaApi.value.on("select", onSlideChange);
});

onUnmounted(() => {
  emblaApi.value.off("select", onSlideChange);
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
