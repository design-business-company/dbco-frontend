<template>
  <div class="tag">
    <Text element="div" size="micro" class="tag__text">{{ text }}</Text>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
// Fixed metrics on purpose: the chip, its padding and its type stay the same
// size on ultrawide instead of scaling with the viewport, matching the
// "Pause carousel" label (CarouselPauseButton.vue).
.tag {
  padding: 4px 8px;
  border-radius: 4px;
  background-color: var(--background-tertiary);
  color: var(--foreground-secondary);
  transition: color var(--transition), background-color var(--transition);
}

.tag__text {
  font-size: 11px;
  line-height: 14px;
  letter-spacing: 0.04em;
}
</style>
