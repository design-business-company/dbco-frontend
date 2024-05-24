<template>
  <span class="link">
    <a :href="href" :target="blank ? '_blank' : undefined">
      <slot />
    </a>
  </span>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      required: true,
    },
    blank: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
};
</script>

<style scoped>
.link {
  display: inline-block;
}
</style>
