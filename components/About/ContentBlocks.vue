<template>
  <div
    v-for="block in content"
    :class="['block', `block--${block._type}`]"
    :key="block._key"
    :ref="trackBlock"
  >
    <Grid v-if="block._type === 'media'">
      <Space />
      <Column>
        <BlockMedia :media="block.media[0]" />
      </Column>
      <Space />
    </Grid>

    <AboutChart v-if="block._type === 'collaboratorChart'" />

    <BlockThemeSwitcher
      v-if="block._type === 'themeSwitcher'"
      v-bind="block"
    ></BlockThemeSwitcher>

    <BlockTextBlock
      v-if="block._type === 'textBlock'"
      :blocks="block.textBody.text"
      :settings="block.settings"
    />

    <Grid v-if="block._type === 'hyperText'">
      <Space />
      <Column>
        <Text size="body-1">
          <BlockHypertext :blocks="block.text" />
        </Text>
      </Column>
      <Space />
    </Grid>

    <AboutClients v-if="block._type === 'carouselClients'" />

    <AboutStaffGallery v-if="block._type === 'staffGallery'" v-bind="block" />

    <div v-if="block._type === 'rule'">
      <BlockRule
        :space-above="block.spaceAbove"
        :space-below="block.spaceBelow"
      />
    </div>

    <Space v-if="block._type === 'spacer'" :size="block.size" />
  </div>
</template>

<script setup>
import useNearViewport from "~/composables/useNearViewport";

// flags blocks in/near the viewport so only those run the theme's text fade
const trackBlock = useNearViewport();

const props = defineProps({
  content: {
    type: Array,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
