<template>
  <Grid>
    <Column class="content">
      <Observer
        v-for="(num, index) in Array(code).fill(0)"
        :key="index"
        :onEnter="(el) => onEnter(el, index)"
        :onLeave="(el) => onLeave(el, index)"
        ref="particles"
      >
        <Text size="caption-1">{{ formatIndex(index + 1) }}</Text>
      </Observer>
    </Column>
  </Grid>
</template>

<script setup>
import { onBeforeUnmount } from "vue";
import { gsap } from "gsap";

const props = defineProps({
  code: {
    type: Number,
    required: true,
  },
});

const formatIndex = (index) => {
  return String(index).padStart(3, "0"); // Pad the number to 3 digits
};

const timelines = new Map(); // Store timelines for each element

const onEnter = (el, index) => {
  const colors = [
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#FE9D26", // yellow
    "#69152A", // plum
    "#72C3E3", // cyan
    "#37B74A", // green
    "#CF2F00", //red
  ];

  const timeline = gsap.timeline({ repeat: -1, repeatRefresh: true });

  timelines.set(index, timeline);

  timeline.to(el, {
    color: () => colors[Math.floor(Math.random() * colors.length)], // Randomly select a color
    rotation: () => [90, 180, 270, 360][Math.floor(Math.random() * 4)], // Randomly select 90, 180, 270, or 360
    duration: 0.2, // Time for each cycle
    ease: "power4.inOut", // Smooth easing
  });
};

// Handle animation on leave
const onLeave = (el, index) => {
  const timeline = timelines.get(index);
  if (timeline) {
    timeline.pause(); // Stop animation
    timelines.delete(index); // Remove reference
  }
};

// Clean up timelines on unmount
onBeforeUnmount(() => {
  timelines.forEach((timeline) => timeline.kill());
  timelines.clear();
});
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  font-variant-numeric: tabular-nums;
  gap: var(--small);

  > * {
    width: auto;
  }
}
</style>
