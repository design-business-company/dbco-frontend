<template>
  <span class="link">
    <a
      v-if="$attrs.value"
      :href="$attrs.value.href"
      :target="$attrs.value.blank ? '_blank' : undefined"
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
