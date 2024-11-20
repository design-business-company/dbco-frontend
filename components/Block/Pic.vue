<template>
  <picture ref="pic">
    <source
      :srcset="`
        ${$urlFor(src).width(320).url()} 320w,
        ${$urlFor(src).width(640).url()} 640w,
        ${$urlFor(src).width(1024).url()} 1024w,
        ${$urlFor(src).width(1280).url()} 1280w,
        ${$urlFor(src).width(1600).url()} 1600w,
        ${$urlFor(src).width(2048).url()} 2048w,
        ${$urlFor(src).width(3072).url()} 3072w,
        ${$urlFor(src).width(4096).url()} 4096w
      `"
      :sizes="`
        (max-width: 320px) 280px,
        (max-width: 640px) 600px,
        (max-width: 1024px) 960px,
        (max-width: 1280px) 1200px,
        (max-width: 1600px) 1500px,
        100vw
      `"
    />
    <img
      :alt="alt"
      loading="lazy"
      class="pic"
      :srcset="`
        ${$urlFor(src).width(320).url()} 320w,
        ${$urlFor(src).width(640).url()} 640w,
        ${$urlFor(src).width(1024).url()} 1024w,
        ${$urlFor(src).width(1280).url()} 1280w,
        ${$urlFor(src).width(1600).url()} 1600w,
        ${$urlFor(src).width(2048).url()} 2048w,
        ${$urlFor(src).width(3072).url()} 3072w,
        ${$urlFor(src).width(4096).url()} 4096w
      `"
      :sizes="`
        (max-width: 320px) 280px,
        (max-width: 640px) 600px,
        (max-width: 1024px) 960px,
        (max-width: 1280px) 1200px,
        (max-width: 1600px) 1500px,
        100vw
      `"
    />
  </picture>
</template>

<script setup>
import gsap from "gsap";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "An image by Design Business Company",
  },
});
</script>

<style scoped>
.pic {
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--border-radius);
  overflow: hidden;
}
</style>
