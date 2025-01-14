<template>
  <div
    v-for="block in content"
    :class="['block', `block--${block._type}`]"
    :key="block._key"
  >
    <Space v-if="block._type === 'spacer'" :size="block.size" />

    <BlockThemeSwitcher
      v-if="block._type === 'themeSwitcher'"
      v-bind="block"
    ></BlockThemeSwitcher>

    <BlockSpotlight
      v-if="block._type === 'spotlight'"
      v-bind="block"
    ></BlockSpotlight>

    <BlockSnackGrid
      v-if="block._type === 'snackGrid'"
      v-bind="block"
    ></BlockSnackGrid>

    <Grid v-if="block._type === 'richText'">
      <Column>
        <BlockRichText
          :blocks="block.text"
          :indent="block.indented"
          :alignment="block.alignment"
        />
      </Column>
    </Grid>

    <Grid v-if="block._type === 'media'">
      <Column>
        <BlockMedia :media="block.media[0]" />
      </Column>
    </Grid>

    <div v-if="block._type === 'hyperText'">
      <Text size="body-1">
        <BlockHypertext :blocks="block.text" />
      </Text>
    </div>

    <BlockTextBlock
      v-if="block._type === 'textBlock'"
      :blocks="block.textBody.text"
      :settings="block.settings"
    />

    <div v-if="block._type === 'rule'">
      <BlockRule
        :space-above="block.spaceAbove"
        :space-below="block.spaceBelow"
      />
    </div>

    <div v-if="block._type === 'carousel'">
      <BlockCarousel :items="block.items" :settings="block.settings" />
    </div>

    <AboutClients v-if="block._type === 'carouselClients'" />

    <AboutStaffGallery v-if="block._type === 'staffGallery'" v-bind="block" />
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
