<template>
  <NuxtLink
    :href="href"
    :target="blank ? '_blank' : undefined"
    rel="noopener noreferrer"
  >
    <span>
      <slot />
    </span>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  href: {
    type: String,
    default: null,
  },
  blank: {
    type: Boolean,
    default: true,
  },
});

const { href, blank } = toRefs(props);

defineOptions({
  inheritAttrs: false,
});

</script>
