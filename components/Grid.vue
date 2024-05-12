<template>
  <component :is="element" class="grid">
    <slot></slot>
  </component>
</template>

<script setup>
const props = defineProps({
  element: {
    type: String,
    default: "div",
  },
});
</script>
