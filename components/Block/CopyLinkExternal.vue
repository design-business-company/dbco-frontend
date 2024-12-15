<template>
  <span class="link">
    <a
      v-if="$attrs"
      v-bind="$attrs"
    >
      <slot />
    </a>
  </span>
</template>

<style scoped>
.link {
  display: inline-block;
}
</style>
