<template>
  <Text :size="style">
    <slot></slot>
  </Text>
</template>

<script setup>
const props = defineProps({
  style: {
    type: String,
    required: false,
  },
});

const { style } = toRefs(props);

defineOptions({
  inheritAttrs: false,
});
</script>
