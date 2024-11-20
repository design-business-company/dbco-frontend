<template>
  <div 
    v-if="items?.length"
    class="spotlight-media-carousel"
    ref="emblaRef"
    :style="{
      '--grid-cols': items.length,
    }"
  >
    <div class="spotlight-media-carousel__container">
      <BlockMedia v-for="item in items" :key="item._key" :media="item" class="spotlight-media-carousel__slide" />
    </div>
  </div>
</template>

<script setup>
import emblaCarouselVue from "embla-carousel-vue";
import AutoScroll from "embla-carousel-auto-scroll";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
}

const [emblaRef, emblaApi] = emblaCarouselVue({
  loop: true,
  skipSnaps: true,
  align: (view, snap, index) => {
    return clamp(view * 0.02, 16, 40);
  },
  containScroll: false,
  inViewThreshold: 0.01,
});
</script>

<style lang="scss" scoped>
.spotlight-media-carousel {
  width: 100%;
  overflow: hidden;

  &__container {
    display: flex;
  }

  &__slide {
    width: 100%;
    flex: 0 0 calc(100% - calc(var(--smallest) * 2));
    margin-right: 10px;

    @include tablet {
      flex: 0 0 35vw;
    }
  }
}
</style>
