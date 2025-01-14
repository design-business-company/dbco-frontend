<template>
  <Observer
    v-if="playbackId"
    :on-enter="handleEnter"
    :on-leave="handleLeave"
    :class="['vid-container']"
    :style="{
      '--aspect-ratio': formattedAspectRatio,
    }"
    @click="manualToggle"
    :aria-label="`${!isPlaying ? 'Play video' : 'Pause video'}`"
  >
    <button class="vid-button">
      <div class="content">
        <transition name="fade" mode="out-in">
          <Icon v-if="!isPlaying" name="Play" />
          <Icon v-else name="Pause" />
        </transition>
      </div>
    </button>
    <mux-player
      :playback-id="playbackId"
      :controls="false"
      :muted="settings.mute"
      :placeholder="placeholder"
      :metadata-video-title="alt"
      :playsinline="settings.playsinline"
      :env-key="envKey"
      :loop="settings.loop"
      ref="vid"
      class="vid mux-player"
      :poster="poster"
      min-resolution="720p"
      preload="metadata"
      :class="{
        'mux-player--controls-hidden': !settings.controls,
      }"
    />
  </Observer>
</template>

<script setup>
import "@mux/mux-player";
import { createBlurUp } from "@mux/blurup";
import { ref, computed } from "vue";
import { useDeviceStore } from "~/stores/device";

const deviceStore = useDeviceStore();
const { $urlFor } = useNuxtApp();
const userPaused = ref(false);

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
const isPlaying = ref(false);
const placeholder = ref(null);

const poster = computed(() => {
  if (!props.poster) return null;

  // const width = vid.value ? vid.value.clientWidth : 1080;
  const width = 1080;

  return $urlFor(props.poster).width(width).auto("format").quality(80).url();
});

if (props.playbackId) {
  createBlurUp(props.playbackId, {}).then((res) => {
    placeholder.value = res.blurDataURL;
  });
}

const formattedAspectRatio = computed(() => {
  return props.aspectRatio?.replaceAll(":", "/").trim() ?? "auto";
});

const videoCanPlay = (e) => {
  e.target.play();
  e.target.removeEventListener('canplay', videoCanPlay)
}

const handleEnter = () => {
  if (!deviceStore.userMotionReduced) {
    if (props.settings.autoplay && !userPaused.value) {
      play();
    }
  } else {
    pause();
  }
};

const handleLeave = () => {
  if (vid.value) {
    if (!vid.value.paused) {
      userPaused.value = false;
    }
    
    pause();
  } else {
    console.warn("Video element is not available in handleLeave.");
  }
};

const play = () => {
  if (!vid.value) return;

  vid.value.play();
  isPlaying.value = true;
};

const pause = () => {
  if (!vid.value) return;

  vid.value.pause();
  isPlaying.value = false;
};

const manualToggle = () => {
  userPaused.value = true;
  toggle();
};

const toggle = () => {
  isPlaying.value ? pause() : play();
};
</script>

<style lang="scss" scoped>
.vid-container {
  width: 100%;
  height: 100%;
  aspect-ratio: var(--aspect-ratio);
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  cursor: pointer;

  @media (pointer: fine) {
    .vid-button {
      opacity: 0;
    }

    &:hover .vid-button {
      opacity: 1;
    }
  }

  @media (pointer: coarse) {
    .vid-button, &:hover .vid-button {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .vid-button {
      opacity: 1;
    }
  }
}

.vid {
  display: block;
  width: 100%;
  height: auto;

  &-button {
    appearance: none;
    background: 0;
    border: 0;
    fill: var(--background-primary);
    position: absolute;
    z-index: 9;
    bottom: 0;
    left: 0;
    padding: var(--tinier);
    cursor: pointer;
    will-change: opacity;
    transition: opacity var(--transition-fast);

    .content {
      width: 32px;
      height: 32px;
      background-color: var(--background-primary);
      border-radius: var(--border-radius);
      transition: background-color var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &:hover .content {
      background-color: var(--background-secondary);
    }

    svg {
      display: block;
      width: var(--smallest);
      height: auto;
      fill: var(--foreground-primary);
    }
  }
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms var(--transition-function);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
