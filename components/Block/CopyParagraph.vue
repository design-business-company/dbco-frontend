<template>
  <Text :size="$attrs.node ? $attrs.node.style : null">
    <slot></slot>
  </Text>
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
});
</script>
