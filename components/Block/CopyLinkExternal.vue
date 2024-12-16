<template>
  <span class="link">
    <a
      v-if="$attrs"
      v-bind="$attrs"
      :target="$attrs.blank ? '_blank' : undefined"
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
