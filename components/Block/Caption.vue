<template>
  <Text element="div" size="micro" class="caption">
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

<style lang="scss" scoped>
.caption {
  max-width: 60ch;
  text-indent: 0;
  color: var(--foreground-secondary);
}
</style>
