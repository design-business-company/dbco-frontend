<template>
  <div class="carousel-pause-row">
    <button type="button" class="carousel-pause" @click.stop="emit('toggle')">
      <span class="carousel-pause__inner">
        <Icon :name="playing ? 'Pause' : 'Play'" aria-hidden="true" />
        <span class="carousel-pause__label text-micro">
          {{ playing ? "Pause carousel" : "Play carousel" }}
        </span>
      </span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  playing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle"]);
</script>

<style lang="scss" scoped>
// Pause affordance for auto-scrolling carousels (WCAG 2.2.2). Sits in its
// own row above the carousel as a labelled text button, always visible, so
// it can't be mistaken for the play/pause tile on videos inside the slides
// (Vid.vue's .vid-button). The visible label is the accessible name.
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
    fill: currentColor;
  }
}
</style>
