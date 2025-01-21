<template>
  <span class="link">
    <!-- some sanity schemas pass href directly (like the footer)-->
    <a
      v-if="href"
      :href="href"
      :target="blank ? '_blank' : undefined"
      rel="noopener noreferrer"
    >
      <slot />
    </a>

    <!-- some sanity schemas budle href in value  -->
    <a
      v-else
      :href="value?.href || '#'"
      :target="value?.blank ? '_blank' : undefined"
      rel="noopener noreferrer"
    >
      <slot />
    </a>
  </span>
</template>

<script setup>
const props = defineProps({
  value: {
    type: Object,
    default: null,
  },
  href: {
    type: String,
    default: null,
  },
  blank: {
    type: Boolean,
    default: true,
  },
  text: {
    type: String,
    required: false,
    default: "",
  },
});

const { value, href, blank } = toRefs(props);

defineOptions({
  inheritAttrs: false,
});
</script>

<style scoped>
.link {
  display: inline;
}
</style>
