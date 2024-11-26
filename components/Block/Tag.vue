<template>
  <div class="tag">
    <Text element="div" size="micro" class="tag__text"> #{{ text }} </Text>
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
.tag {
  padding: 6px;
  padding-block-start: 5px;
  border-radius: var(--border-radius);
  background-color: var(--background-tertiary);
}
</style>
