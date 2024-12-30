<template>
  <img
    ref="pic"
    :alt="alt"
    loading="lazy"
    class="pic"
    :style="{ '--pic-aspect-ratio': aspectRatio }"
    :src="initialSrc"
    :srcset="srcSet"
    :sizes="sizes"
  />
</template>

<script setup>
import gsap from "gsap";
const { $urlFor } = useNuxtApp();

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "An image by Design Business Company",
  },
  aspectRatio: {
    type: Number,
    default: 1,
  },
  sizes: {
    type: String,
    required: false,
    default: `
      (max-width: 320px) 280px,
      (max-width: 640px) 600px,
      (max-width: 1024px) 960px,
      (max-width: 1280px) 1200px,
      (max-width: 1600px) 1500px,
      100vw
    `
  }
});

const deviceSizes = ref([320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]);

const initialSrc = computed(() => {
  return $urlFor(props.src).width(640).url();
})

const srcSet = computed(() => {
  return deviceSizes.value.map((size) => `${$urlFor(props.src).width(size).url()} ${size}w`).join(', ');
});
</script>

<style scoped>
.pic {
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--border-radius);
  overflow: hidden;
  aspect-ratio: var(--pic-aspect-ratio);
}
</style>
