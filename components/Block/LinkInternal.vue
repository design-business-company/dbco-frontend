<template>
  <nuxt-link :to="link">
    <slot></slot>
  </nuxt-link>
</template>

<script>
export default {
  name: "InternalLink",
  props: {
    mark: {
      type: Object,
      required: true,
    },
  },
  computed: {
    link() {
      console.log("mark:", this.$props);
      if (this.mark && this.mark.href) {
        return this.mark.href;
      } else {
        return "/";
      }
    },
  },
};
</script>

<style scoped>
/* Add any custom styles for your internal links here */
</style>
