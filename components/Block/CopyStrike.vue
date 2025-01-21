<template>
  <s class="strikethrough"><slot></slot></s>
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
});
</script>

<style scoped>
.strikethrough {
  display: inline-block;
  text-decoration: none;
  text-decoration: line-through;
  text-decoration-thickness: 0.08em;
  text-decoration-color: color-mix(
    in srgb,
    var(--foreground-primary) 40%,
    var(--background-primary) 40%
  );
  color: color-mix(
    in srgb,
    var(--foreground-primary) 40%,
    var(--background-primary) 40%
  );
}
</style>
