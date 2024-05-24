<template>
  <component :is="element" ref="container" :class="`text-${size}`">
    <!-- <Observer :onEnter="handleEnter" :once="true"> -->
    <slot></slot>
    <!-- </Observer> -->
  </component>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";
import { type PropType } from "vue";

type SizeType =
  | "micro"
  | "caption-1"
  | "caption-2"
  | "body-1"
  | "body-2"
  | "headline-1"
  | "headline-2"
  | "headline-3";

const props = defineProps({
  size: {
    type: String as PropType<SizeType>,
    default: "body-2",
    validator: (value: SizeType): boolean =>
      [
        "micro",
        "caption-1",
        "caption-2",
        "body-1",
        "body-2",
        "headline-1",
        "headline-2",
        "headline-3",
      ].includes(value),
  },
  element: {
    type: String as PropType<string>,
    default: "p",
  },
  animateOnEnter: {
    type: Boolean,
    default: true,
  },
});

const container = ref<HTMLElement | null>(null);

const handleEnter = () => {
  if (props.animateOnEnter && container.value) {
    // Animate each child element of the container
    gsap.fromTo(
      container.value,
      { opacity: 0.2 },
      { opacity: 1, duration: 0.5, delay: 0.25 }
    );
  }
};
</script>
