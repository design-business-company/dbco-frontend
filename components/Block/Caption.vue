<template>
  <Text element="div" size="micro" class="caption">
    <CustomPortableText :value="caption" />
  </Text>
</template>

<script setup>
const props = defineProps({
  caption: {
    type: Array,
    required: true,
  },
});

defineOptions({
  inheritAttrs: false,
});
</script>

<style lang="scss" scoped>
.caption {
  max-width: 60ch;
  text-indent: 0;
  color: var(--foreground-secondary);
}
</style>
