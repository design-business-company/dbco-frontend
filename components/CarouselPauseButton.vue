<template>
  <div class="carousel-pause-row">
    <button
      type="button"
      class="carousel-pause"
      :aria-label="`${verbFor(playing)} carousel`"
      @click.stop="emit('toggle')"
    >
      <span class="carousel-pause__inner" aria-hidden="true">
        <Icon :name="playing ? 'Pause' : 'Play'" />
        <span class="carousel-pause__label text-micro"
          >{{ verb }} carousel</span
        >
      </span>
    </button>
  </div>
</template>

<script setup>
import { useDeviceStore } from "~/stores/device";

const props = defineProps({
  playing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle"]);

const deviceStore = useDeviceStore();

const verbFor = (playing) => (playing ? "Pause" : "Play");

// The verb is retyped when the state changes: backspace to the shared
// prefix, then type the new word. The button's aria-label always carries
// the settled label, so assistive tech never reads a half-typed word.
const TYPE_STEP_MS = 45;
const verb = ref(verbFor(props.playing));
let typeTimer;

const typeStep = (target) => {
  const current = verb.value;
  if (current === target) return;

  verb.value = target.startsWith(current)
    ? target.slice(0, current.length + 1)
    : current.slice(0, -1);
  typeTimer = setTimeout(() => typeStep(target), TYPE_STEP_MS);
};

watch(
  () => props.playing,
  (playing) => {
    clearTimeout(typeTimer);
    const target = verbFor(playing);

    if (deviceStore.userMotionReduced) {
      verb.value = target;
      return;
    }

    typeStep(target);
  }
);

onBeforeUnmount(() => clearTimeout(typeTimer));
</script>

<style lang="scss" scoped>
// Pause affordance for auto-scrolling carousels (WCAG 2.2.2). Sits in its
// own row above the carousel as a labelled text button, always visible, so
// it can't be mistaken for the play/pause tile on videos inside the slides
// (Vid.vue's .vid-button). The aria-label matches the settled visible label.
// The row sits on the page margin, in line with the content above it (the
// slides themselves scroll, so there is no fixed slide edge to align to).
.carousel-pause-row {
  display: flex;
  padding-inline: var(--grid-margin);
}

.carousel-pause {
  appearance: none;
  background: 0;
  border: 0;
  padding: 0;
  // Buttons don't inherit the page font by default
  font-family: inherit;
  // 44px tap target with no visible box
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  color: var(--foreground-secondary);
  cursor: pointer;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--foreground-primary);
  }

  &:focus-visible {
    outline: none;
    color: var(--foreground-primary);

    .carousel-pause__inner {
      outline: solid;
      outline-offset: 4px;
    }
  }

  &__inner {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  &__label {
    display: inline;
    max-width: none;
    white-space: nowrap;
  }

  svg {
    display: block;
    flex: none;
    width: 10px;
    height: 10px;
    // Optical centring on the cap height of the uppercase label, which sits
    // slightly below the middle of its line box.
    transform: translateY(0.5px);
    fill: currentColor;
  }
}
</style>
