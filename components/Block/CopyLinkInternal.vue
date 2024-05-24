<template>
  <span class="link">
    <NuxtLink :to="slug === 'index' ? '/' : slug" class="link">
      <slot />
    </NuxtLink>
  </span>
</template>

<script>
export default {
  props: {
    slug: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.link {
  display: inline-block;
}
</style>
