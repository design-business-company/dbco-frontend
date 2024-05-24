<template>
  <mark class="ts-highlight"><slot /></mark>
</template>

<style lang="scss">
.ts-highlight {
  display: inline-block;
  background-color: color-mix(
    in srgb,
    yellow 80%,
    var(--background-primary) 100%
  );
  color: inherit;
  padding: 0 0.1em;
  border-radius: 0.1em;
}
</style>
