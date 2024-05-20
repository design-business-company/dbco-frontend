<template>
  <Observer :on-enter="handleEnter" :on-leave="handleLeave">
    <video
      :aria-label="alt"
      :muted="settings.mute"
      :autoplay="settings.autoplay"
      :controls="settings.controls"
      :loop="settings.loop"
      :playsinline="settings.playsinline"
      :poster="$urlFor(poster).width(1920).url()"
      ref="vid"
      class="vid"
    >
      <source :src="src" />
    </video>
  </Observer>
</template>

<script setup>
const vid = ref(null);

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

const props = defineProps({
  src: {
    type: String,
    required: true,
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
</script>

<style scoped>
.vid {
  display: block;
  width: 100%;
  height: auto;
}
</style>
