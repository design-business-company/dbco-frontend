<template>
  <div class="media">
    <!-- Video Media -->
    <div v-if="normalizedMedia._type === 'video'" class="media__video">
      <BlockVid
        :playback-id="normalizedMedia.playbackId"
        :alt="normalizedMedia.alt"
        :settings="normalizedMedia.settings"
        :poster="normalizedMedia.poster?.asset?._ref"
        :aspect-ratio="normalizedMedia.aspectRatio"
      />
      <BlockCaption
        v-if="normalizedMedia.caption"
        :caption="normalizedMedia.caption"
        class="media__caption"
      />
    </div>

    <!-- Picture Media -->
    <div v-if="normalizedMedia._type === 'picture'" class="media__picture">
      <BlockPic
        :src="normalizedMedia.asset._ref"
        :alt="normalizedMedia.alt"
        :aspect-ratio="normalizedMedia.aspectRatio"
      />
      <BlockCaption
        v-if="normalizedMedia.caption"
        :caption="normalizedMedia.caption"
        class="media__caption"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  media: {
    type: Object,
    required: false,
    default: null,
  },
  value: {
    type: Object,
    required: false,
    default: null,
  },
});

// Normalize input to always use `media`
const normalizedMedia = computed(() => {
  // Use `media` if provided, otherwise extract from `value`
  if (props.media) {
    return props.media;
  }

  if (props.value && props.value.media && props.value.media.length > 0) {
    return props.value.media[0]; // Assuming we want the first media item
  }
  return null; // Fallback if no media is provided
});
</script>

<style lang="scss" scoped>
.media {
  position: relative;

  &__video,
  &__picture {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--tiniest);
    align-items: flex-start;
  }

  &__caption {
    margin-top: var(--tiniest);
    transform-origin: 0 100%;
    pointer-events: none;
  }

  &:hover .media__caption {
    transform: translate3d(0, 0, 0);
  }
}
</style>
