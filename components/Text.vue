<template>
  <component
    :is="element"
    ref="container"
    :class="[`text-${size}`, { '--indent': indent }]"
    v-bind="$attrs"
  >
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { gsap } from "gsap";
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
        "normal",
        "headline-1",
        "headline-2",
        "headline-3",
      ].includes(value),
  },
  element: {
    type: String as PropType<string>,
    required: false,
    default: "p",
  },
  indent: {
    type: Boolean,
    required: false,
    default: false,
  },
  animateOnEnter: {
    type: Boolean,
    default: true,
  },
});

const container = ref<HTMLElement | null>(null);
</script>

<style scoped>
.--indent {
  text-indent: var(--text-indent);
}

.--mono {
  font-variant-numeric: tabular-nums;
}
</style>
