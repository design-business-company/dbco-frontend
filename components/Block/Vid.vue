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
      :env-key="envKey"
      ref="vid"
      accent-color="#ff0000"
      class="vid mux-player"
      :poster="poster"
      min-resolution="1080p"
      :class="{
        'mux-player--controls-hidden': !settings.controls,
      }"
    />
  </Observer>
</template>

<script setup>
import "@mux/mux-player";
import { createBlurUp } from "@mux/blurup";

const { $urlFor } = useNuxtApp();

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

const config = useRuntimeConfig();

const envKey = computed(() => config.public.muxEnvKey);

const vid = ref(null);
const placeholder = ref(null);

const poster = computed(() => {
  if (!props.poster) return null;

  const width = vid.value ? vid.value.clientWidth : 1080;

  return $urlFor(props.poster).width(width).auto('format').quality(80).url();
})

if (props.playbackId) {
  createBlurUp(props.playbackId, {}).then((res) => {
    placeholder.value = res.blurDataURL;
  });
}

const formattedAspectRatio = computed(() => {
  return props.aspectRatio?.replaceAll(":", "/").trim() ?? "auto";
});

const handleEnter = () => {
  if (props.settings.autoplay && vid.value?.readyState === 4) {
    vid.value.play();
  }
};

const handleLeave = () => {
  if (props.settings.autoplay && vid.value) {
    vid.value.pause();
  } else {
    console.warn("Video element is not available in handleLeave.");
  }
};
</script>

<style>
.vid-container {
  width: 100%;
  height: 100%;
  aspect-ratio: var(--aspect-ratio);
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
}

.vid {
  display: block;
  width: 100%;
  height: auto;
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
