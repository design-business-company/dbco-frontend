<template>
  <Text :size="$attrs.value.size" element="div">
    <CustomPortableText :value="$attrs.value.text" />
  </Text>
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
});
</script>

