<template>
  <div
    v-for="block in content"
    :class="['block', `block--${block._type}`]"
    :key="block._key"
  >
    <Grid v-if="block._type === 'richText'">
      <Space />
      <Column>
        <BlockRichText :blocks="block.text" />
      </Column>
      <Space />
    </Grid>

    <div v-if="block._type === 'video'">
      <Grid>
        <Column>
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
      </Grid>
    </div>

    <div v-if="block._type === 'picture'">
      <Space />

      <BlockPic :src="block.asset._ref" :alt="block.alt" />
      <BlockCaption v-if="block.caption" :caption="block.caption" />
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
