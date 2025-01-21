<template>
  <Text :size="style" v-if="!simple">
    <slot></slot>
  </Text>
  <component :is="simpleComponent" v-else>
    <slot></slot>
  </component>
</template>

<script setup>
const props = defineProps({
  style: {
    type: String,
    required: false,
  },
  // If true, use the style as the rendered element and not the size of <Text>
  simple: {
    type: Boolean,
    required: false,
    default: false,
  }
});

const { style, simple } = toRefs(props);

const simpleComponent = computed(() => {
  switch (style.value) {
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "h5":
      return "h5";
    case "h6":
      return "h6";
    default:
      return "p";
  }
})

defineOptions({
  inheritAttrs: false,
});
</script>
