<template>
  <Observer
    :on-enter="handleEnter"
    :on-leave="handleLeave"
    class="vid-container"
    :style="{
      '--aspect-ratio': formattedAspectRatio,
    }"
  >
    <mux-player
      v-if="playbackId"
      :playback-id="playbackId"
      :controls="false"
      :muted="settings.mute"
      :autoplay="settings.autoplay"
      :placeholder="placeholder"
      :loop="settings.loop"
      :metadata-video-title="alt"
      :playsinline="settings.playsinline"
      ref="vid"
      accent-color="#ff0000"
      class="vid mux-player"
      :class="{
        'mux-player--controls-hidden': !settings.controls,
      }"
    />
  </Observer>
</template>

<script setup>
import "@mux/mux-player";
import { createBlurUp } from "@mux/blurup";

const props = defineProps({
  playbackId: {
    type: String,
    required: false,
  },
  aspectRatio: {
    type: String,
    required: false,
  },
  alt: {
    type: String,
    default: "An image by Design Business Company",
  },
  poster: {
    type: String,
    default: null,
  },
  settings: {
    type: Object,
    default: {
      controls: true,
      loop: true,
      playsinline: true,
      mute: true,
      autoplay: false,
    },
  },
});

const vid = ref(null);
const placeholder = ref(null);

if (props.playbackId) {
  createBlurUp(props.playbackId, {}).then((res) => {
    placeholder.value = res.blurDataURL;
  });
}

const formattedAspectRatio = computed(() => {
  return props.aspectRatio?.replaceAll(":", "/").trim() ?? "auto";
});

const handleEnter = () => {
  if (props.settings.autoplay) {
    vid.value.play();
  }
};

const handleLeave = () => {
  if (props.settings.autoplay) {
    vid.value.pause();
  }
};
</script>

<style>
.vid-container {
  width: 100%;
  aspect-ratio: var(--aspect-ratio);
  position: relative;
}

.vid {
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--border-radius);
  overflow: hidden;
}

.mux-player,
mux-player {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  --loading-indicator: none;
  --media-object-fit: cover;
  aspect-ratio: var(--aspect-ratio);
}

.mux-player--controls-hidden {
  --controls: none;
}
</style>
