<template>
  <div>
    <div v-if="media._type === 'video'">
      <BlockVid
        :src="media.url"
        :alt="media.alt"
        :settings="media.settings"
        :poster="media.poster.asset._ref"
      />
      <BlockCaption v-if="media.caption" :caption="media.caption" />
      <Space />
    </div>

    <div v-if="media._type === 'picture'">
      <BlockPic :src="media.asset._ref" :alt="media.alt" />
      <BlockCaption v-if="media.caption" :caption="media.caption" />
      <Space />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  media: {
    type: Object,
    required: true,
  },
});
</script>
