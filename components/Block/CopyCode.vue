<template>
  <code class="ts-mono">
    <slot />
  </code>
</template>

<style lang="scss" scoped>
.ts-mono {
  display: inline-block;
  vertical-align: baseline;
  padding: 0.2em 0.4em;
  margin-left: 0.2em;
  margin-right: 0.2em;
  border-radius: 0.3em;
  color: var(--foreground-primary);
  background-color: color-mix(
    in srgb,
    var(--foreground-primary) 15%,
    var(--background-primary) 100%
  );
  font-size: 80%;
  letter-spacing: 0;
  font-family: monospace;
}
</style>
