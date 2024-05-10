<template>
  <component :is="element" :class="`text-${size}`">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
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
    default: "body1",
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
});
</script>
