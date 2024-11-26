<template>
  <Text size="micro">
    <SanityContent :blocks="caption" :serializers="serializers" />
  </Text>
</template>

<script setup>
const props = defineProps({
  caption: {
    type: Array,
    required: true,
  },
});

const serializers = {
  types: {
    // This is how to access a component registered by `@nuxt/components`
    // lazyRegisteredComponent: resolveComponent('LazyCustomSerializer'),
    // A directly imported component
    // importedComponent: CustomBlockComponent,
    // Example of a more complex async component
    // dynamicComponent: defineAsyncComponent({
    //   loadingComponent: () => 'Loading...',
    //   loader: () => import('~/other/component.vue'),
    // }),
  },
  marks: {
    // You can also just pass a string for a custom serializer if it's an HTML element
    // internalLink: BlockInternalLink,
  },
};
</script>

<style scoped>
.caption {
  max-width: 45ch;
}
</style>
