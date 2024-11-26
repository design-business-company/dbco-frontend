<template>
  <div
    v-for="block in content"
    :class="['block', `block--${block._type}`]"
    :key="block._key"
  >
    <ModuleSpotlight
      v-if="block._type === 'spotlight'"
      v-bind="block"
    ></ModuleSpotlight>

    <ModuleSnackGrid
      v-if="block._type === 'snackGrid'"
      v-bind="block"
    ></ModuleSnackGrid>

    <Grid v-if="block._type === 'richText'">
      <Space />
      <Column>
        <BlockRichText :blocks="block.text" />
      </Column>
      <Space />
    </Grid>

    <div v-if="block._type === 'media'">
      <Space />
      <BlockMedia :media="block.media[0]" />
      <Space />
    </div>

    <div v-if="block._type === 'hyperText'">
      <Space />
      <Text size="body-1">
        <BlockHypertext :blocks="block.text" />
      </Text>
      <Space />
    </div>

    <div v-if="block._type === 'rule'">
      <BlockRule
        :space-above="block.spaceAbove"
        :space-below="block.spaceBelow"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  content: {
    type: Array,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
