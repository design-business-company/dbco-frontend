<template>
  <span class="underline"><slot></slot></span>
</template>

<style scoped>
.underline {
  display: inline-block;
  text-decoration: wavy underline;
  text-underline-offset: 0.2em;
  text-decoration-thickness: 0.08em;
  text-decoration-color: color-mix(
    in srgb,
    red 70%,
    var(--background-primary) 30%
  );
}
</style>
