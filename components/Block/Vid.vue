<template>
  <Observer
    v-if="playbackId"
    :on-enter="handleEnter"
    :on-leave="handleLeave"
    :class="[
      'vid-container',
      { 'is-paused': !isPlaying, 'has-native-controls': settings.controls },
    ]"
    :style="{
      '--aspect-ratio': formattedAspectRatio,
    }"
    @click="manualToggle"
  >
    <!--
      Poster underlay for chrome-less (autoplay-style) videos. The player's
      own poster is disabled so nothing inside the shadow DOM swaps at the
      instant playback starts; instead the player (with a transparent
      background, so only real video pixels composite) dissolves in over
      this still once its first frame has actually been presented. The
      still is removed once the dissolve completes. Being plain HTML it
      also paints before the custom element upgrades, which the shadow-DOM
      poster never did.

      Videos with native controls keep Mux's own poster: the player can't
      be faded as a whole there without hiding the play button, and the
      inner <video> isn't exposed as a ::part in this mux-player version.
    -->
    <img
      v-if="!settings.controls && !underlayDone"
      class="vid-underlay"
      :src="underlaySrc"
      :srcset="underlaySrcset"
      :sizes="sizes"
      :style="placeholder ? { backgroundImage: `url('${placeholder}')` } : null"
      alt=""
      aria-hidden="true"
      decoding="async"
    />
    <button
      v-if="!settings.controls"
      type="button"
      class="vid-button"
      :aria-label="!isPlaying ? 'Play video' : 'Pause video'"
    >
      <div class="content">
        <transition name="fade" mode="out-in">
          <Icon v-if="!isPlaying" name="Play" />
          <Icon v-else name="Pause" />
        </transition>
      </div>
    </button>
    <mux-player
      v-if="showPlayer"
      :playback-id="playbackId"
      :controls="false"
      :muted="settings.mute"
      :placeholder="settings.controls ? placeholder : null"
      :aria-label="alt"
      :playsinline="settings.playsinline"
      :env-key="envKey"
      :loop="settings.loop"
      ref="vid"
      class="vid mux-player"
      :poster="settings.controls ? underlaySrc : ''"
      min-resolution="720p"
      preload="metadata"
      :class="{
        'mux-player--controls-hidden': !settings.controls,
        'mux-player--fades': !settings.controls,
        'is-ready': hasPlayed,
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
  sizes: {
    type: String,
    default: "100vw",
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
const isLoading = ref(true);
const isInView = ref(false);
const hasPlayed = ref(false);
const underlayDone = ref(false);
const placeholder = ref(null);

// Underlay still: the Sanity poster when one is set, otherwise Mux's frame-0
// thumbnail (which matches the first video frame exactly). Sized with
// srcset/sizes rather than a viewport-derived width so the URL is the same
// on the server and the client — a breakpoint-based width swapped the image
// after hydration whenever the UA-guessed breakpoint didn't match the window.
const UNDERLAY_WIDTHS = [360, 640, 800, 1080, 1280, 1920];

const underlayUrl = (width) => {
  if (props.poster) {
    return $urlFor(props.poster).width(width).quality(80).url();
  }
  return `https://image.mux.com/${props.playbackId}/thumbnail.webp?time=0&width=${width}`;
};

const underlaySrc = computed(() => underlayUrl(1280));

const underlaySrcset = computed(() =>
  UNDERLAY_WIDTHS.map((width) => `${underlayUrl(width)} ${width}w`).join(", ")
);

if (props.playbackId) {
  createBlurUp(props.playbackId, {})
    .then((res) => {
      placeholder.value = res.blurDataURL;
    })
    .catch((err) => {
      console.warn("Error creating blur up for video: ", err);
    });
}

const formattedAspectRatio = computed(() => {
  return props.aspectRatio?.replaceAll(":", "/").trim() ?? "auto";
});

// On SSR/hydration the player is in the initial HTML as usual. On client-side
// navigation the page tree is built detached (Suspense + out-in transition),
// and media-chrome warns "No style sheet found" when the player's internals
// run before being connected — so defer creating the element until mounted.
const showPlayer = ref(process.server || useNuxtApp().isHydrating);

onMounted(async () => {
  showPlayer.value = true;
  await nextTick();

  vid.value?.addEventListener("loadedmetadata", handleVideoLoaded);
  vid.value?.addEventListener("playing", handleVideoPlaying);
  vid.value?.addEventListener("transitionend", handleTransitionEnd);
  vid.value?.addEventListener("error", handleVideoError);
});

// `playing` alone isn't enough to reveal the video: browsers (Safari in
// particular) can fire it before the first frame is composited, which
// showed as a beat of black between the still and the footage. Wait for the
// next presented frame via requestVideoFrameCallback where available.
const handleVideoPlaying = () => {
  if (hasPlayed.value) return;

  const inner =
    vid.value?.media?.nativeEl ??
    vid.value?.media?.shadowRoot?.querySelector("video");

  if (inner?.requestVideoFrameCallback) {
    inner.requestVideoFrameCallback(() => {
      hasPlayed.value = true;
    });
  } else {
    hasPlayed.value = true;
  }
};

// Drop the underlay once the dissolve has finished — it's done its job and
// there's no point keeping a decoded still per video on a page with dozens.
const handleTransitionEnd = (e) => {
  if (e.target === vid.value && e.propertyName === "opacity" && hasPlayed.value) {
    underlayDone.value = true;
  }
};

const handleVideoLoaded = () => {
  isLoading.value = false;
  if (props.settings.autoplay && !userPaused.value && isInView.value) {
    play();
  }
};

const handleVideoError = (e) => {
  isLoading.value = false;
  console.error("Error loading video: ", e);
};

const handleEnter = () => {
  isInView.value = true;

  if (isLoading.value) {
    vid.value?.load();
  }

  if (!deviceStore.userMotionReduced && !isLoading.value) {
    if (props.settings.autoplay && !userPaused.value) {
      play();
    }
  } else {
    pause();
  }
};

const handleLeave = () => {
  isInView.value = false;

  if (!vid.value) {
    return;
  }

  if (!vid.value.paused) {
    userPaused.value = false;
  }

  pause();
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
  // Native Mux controls own playback — don't hijack clicks (they bubble up
  // from the Mux chrome and would double-toggle)
  if (props.settings.controls) return;

  userPaused.value = true;
  toggle();
};

const toggle = () => {
  isPlaying.value ? pause() : play();
};

onBeforeUnmount(() => {
  vid.value?.removeEventListener("loadedmetadata", handleVideoLoaded);
  vid.value?.removeEventListener("playing", handleVideoPlaying);
  vid.value?.removeEventListener("transitionend", handleTransitionEnd);
  vid.value?.removeEventListener("error", handleVideoError);
});
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

  &.has-native-controls {
    cursor: default;
  }

  &.is-paused {
    .vid-button {
      opacity: 1;
    }
  }

  @media (pointer: fine) {
    .vid-button {
      opacity: 0;
    }

    &:hover .vid-button {
      opacity: 1;
    }
  }

  @media (pointer: coarse) {
    .vid-button,
    &:hover .vid-button {
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

  // Sits under the player. object-fit/position mirror the player's
  // --media-object-fit so the still and the first frame line up. The blur-up
  // data URL paints as a background until the still itself decodes.
  &-underlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    background-size: cover;
    background-position: center;
    pointer-events: none;
  }

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
  --dialog: none;
  // Replace Mux's default hot-pink accent with the brand palette. Fixed
  // grays, not theme tokens — the chrome must not flip dark on
  // light-themed pages
  --media-primary-color: var(--gray-50);
  --media-accent-color: var(--gray-50);
  aspect-ratio: var(--aspect-ratio);
}

// Chip behind a Mux button on hover only. ::part, not
// --media-control-background — the theme pins that var to transparent
// inside its shadow DOM
.mux-player::part(bottom button) {
  border-radius: var(--border-radius);
}

.mux-player::part(bottom button):hover {
  background: var(--gray-900);
}

// Hidden until the first presented frame, then dissolves in over the
// underlay. Long enough to read as a dissolve rather than a flicker, short
// enough not to feel like lag. media-chrome paints its container black by
// default — that black faded in *with* the player and blotted out the still
// before the footage showed, so make it transparent: only video pixels
// composite over the underlay.
.mux-player--fades {
  --media-background-color: transparent;
  opacity: 0;
  transition: opacity 300ms var(--transition-function);

  &.is-ready {
    opacity: 1;
  }
}

.mux-player--controls-hidden {
  --controls: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-fast-time) var(--transition-function);
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
