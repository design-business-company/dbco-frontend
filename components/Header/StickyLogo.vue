<template>
  <h1 ref="heading" @mouseover="scaleUp" @mouseleave="scaleDown">
    <span>D</span>
    <span class="hide">esign</span>
    <span>B</span>
    <span class="hide">usiness</span>
    <span>Co</span>
    <span class="hide">mpany</span>
    <span>.</span>
  </h1>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDeviceStore } from "~/stores/device";
import gsap from "gsap";

// init the store
const device = useDeviceStore();

const heading = ref<HTMLElement | null>(null);
const { createSplitText } = useSplitText();

onMounted(() => {
  if (heading.value) {
    const hideElements = Array.from(heading.value.querySelectorAll(".hide"));
    createSplitText(hideElements, "words");
    hideElements.forEach((element) => {
      const words = element.querySelectorAll("div");
      gsap.set(words, {
        scaleX: 0,
        width: 0,
        opacity: 0,
        marginRight: 0,
        transformOrigin: "left",
      });
    });
  }
});

function scaleUp() {
  if (device.winWidth <= 700) return;

  const words = heading.value.querySelectorAll(".hide div");
  gsap.to(words, {
    scaleX: 1,
    width: "auto",
    duration: 0.4,
    stagger: 0.05,
    opacity: 1,
    marginRight: "0.3ch",
    ease: "power4.out",
  });
}

function scaleDown() {
  if (device.winWidth <= 700) return;

  const chars = heading.value.querySelectorAll(".hide div");
  gsap.to(chars, {
    scaleX: 0,
    width: 0,
    duration: 0.8,
    stagger: -0.05,
    opacity: 0,
    marginRight: 0,
    ease: "power4.inOut",
  });
}
</script>

<style scoped>
h1 {
  cursor: pointer;
  overflow: visible;
  white-space: nowrap;
  position: relative;
}
span {
  display: inline-block;
  transform-origin: left;
}
</style>
