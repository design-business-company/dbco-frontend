<template>
  <Text :size="size" element="div">
    <CustomPortableText :simple="true" :value="text" />
  </Text>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    required: false,
  },
  text: {
    type: Array,
    required: false,
    default: () => [],
  },
});

const { size, text } = toRefs(props);

defineOptions({
  inheritAttrs: false,
});
</script>

