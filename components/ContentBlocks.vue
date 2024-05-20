<template>
  <Grid>
    <template v-for="block in content" :key="block._key">
      <Column v-if="block._type === 'video'">
        <Space />

        <BlockVid
          :src="block.url"
          :alt="block.alt"
          :settings="block.settings"
          :poster="block.poster.asset._ref"
        />
        <BlockCaption v-if="block.caption" :caption="block.caption" />
        <Space />
      </Column>

      <Column v-if="block._type === 'picture'">
        <Space />

        <BlockPic :src="block.asset._ref" :alt="block.alt" />
        <BlockCaption v-if="block.caption" :caption="block.caption" />
        <Space />
      </Column>

      <Column v-if="block._type === 'hypertext'">
        <Space />
        <Text size="body-1">
          <BlockHypertext :blocks="block.text" />
        </Text>
        <Space />
      </Column>
    </template>
  </Grid>
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
