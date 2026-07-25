<template>
  <button
    type="button"
    class="carousel-pause"
    :aria-label="
      playing ? 'Pause automatic scrolling' : 'Start automatic scrolling'
    "
    @click.stop="emit('toggle')"
  >
    <span class="content">
      <transition name="fade" mode="out-in">
        <Icon v-if="playing" name="Pause" />
        <Icon v-else name="Play" />
      </transition>
    </span>
  </button>
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
// Pause affordance for auto-scrolling carousels (WCAG 2.2.2). Mirrors
// Vid.vue's .vid-button so pause controls look the same site-wide:
// bottom-left 32px tile, hidden on fine pointers until the carousel is
// hovered or the button is focused, always visible on touch.
.carousel-pause {
  appearance: none;
  background: 0;
  border: 0;
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

  &:focus-visible {
    opacity: 1;

    .content {
      outline: solid;
    }
  }

  svg {
    display: block;
    width: var(--smallest);
    height: auto;
    fill: var(--foreground-primary);
  }
}

@media (pointer: fine) {
  .carousel-pause {
    opacity: 0;
  }

  :global([data-carousel]:hover .carousel-pause) {
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-fast-time) var(--transition-function);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
