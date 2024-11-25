<template>
  <div class="media">
    <div v-if="media._type === 'video'" class="media__video">
      <BlockVid
        :playback-id="media.playbackId"
        :src="media.url"
        :alt="media.alt"
        :settings="media.settings"
        :poster="media.poster?.asset?._ref"
        :aspect-ratio="media.aspectRatio"
      />
      <BlockCaption v-if="media.caption" :caption="media.caption" class="media__caption" />
      <Space />
    </div>

    <div v-if="media._type === 'picture'" class="media__picture">
      <BlockPic :src="media.asset._ref" :alt="media.alt" :aspect-ratio="media.aspectRatio" />
      <BlockCaption v-if="media.caption" :caption="media.caption" class="media__caption" />
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

<style lang="scss" scoped>
.media {
  position: relative;

  &__video, &__picture {
    display: flex;
    flex-direction: column;
    gap: var(--tiniest);
    align-items: flex-start;
  }

  &__caption {
    margin-top: var(--tiniest);
    transform-origin: 0 100%;
    pointer-events: none;
    transition: opacity 300ms ease-out, transform 200ms ease-out;

    @include tablet {
      opacity: 0;
      transform: translate3d(0, 10%, 0) scale(0.95);
    }
  }

  &:hover .media__caption {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>
