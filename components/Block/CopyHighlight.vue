<template>
  <mark class="highlight"><slot /></mark>
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
});
</script>

<style lang="scss">
.highlight {
  background-color: color-mix(
    in srgb,
    yellow 50%,
    var(--background-primary) 50%
  );
  color: inherit;
  padding: 0 0;
  border-radius: 0.1em;
  mix-blend-mode: screen;
}
</style>
