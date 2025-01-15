<template>
  <div class="mobile-trigger">
    <button
      class="mobile-trigger__button"
      :aria-label="app.mobileNavIsVisible ? 'Close Nav' : 'Open Nav'"
    >
      <div
        class="mobile-trigger__button-content"
        :class="[
          'mobile-trigger__button-content',
          { 'nav-is-visible': app.mobileNavIsVisible },
        ]"
      >
        <div class="mobile-trigger__button-lines">
          <div class="mobile-trigger__button-line"></div>
          <div class="mobile-trigger__button-line"></div>
        </div>
      </div>
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAppStore } from "~/stores/app";

const app = useAppStore();
const topLineRef = ref(null);
const bottomLineRef = ref(null);
</script>

<style lang="scss" scoped>
.mobile-trigger {
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: center;
  height: 44px;
  border-radius: 0;

  &__button {
    margin-right: calc(-1 * var(--tinier));
    cursor: pointer;
    appearance: none;
    background: 0;
    border: 0;
    outline: none;
    height: 100%;

    &-content {
      transition: background-color var(--transition);
      background-color: var(--background-tertiary);
      border-radius: 100vw;
      padding: var(--tinier) var(--smallest);
      font-size: inherit;
      line-height: 0;

      &.nav-is-visible {
        background-color: var(--foreground-primary);

        .mobile-trigger__button-line {
          background-color: var(--background-primary);
          &:first-child,
          &:last-child {
            transform: translate3d(0, 0, 0);
          }
        }
      }
    }

    &:hover {
      .mobile-trigger__button-content {
        transition-duration: 100ms;
        background-color: var(--background-secondary);

        &.nav-is-visible {
          background-color: var(--foreground-secondary);
        }
      }
    }

    &:active {
      .mobile-trigger__button-content {
        transition-duration: 50ms;
        background-color: var(--background-tertiary);
      }
    }

    &:focus-visible {
      .mobile-trigger__button-content {
        outline: solid;
      }
    }
  }

  &__button-lines {
    display: grid;
    position: relative;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    place-items: center;
    width: 32px;
    height: 12px;
  }

  &__button-line {
    display: block;
    grid-column: 1 / span 1;
    grid-row: 1 / span 1;
    width: 100%;
    height: 1.5px;
    position: relative;
    background-color: var(--foreground-primary);
    transition: background-color var(--transition-fast),
      transform var(--transition-fast);
    border-radius: 10px;

    &:first-child {
      transform: translateY(-4.5px);
    }

    &:last-child {
      transform: translateY(4.5px);
    }
  }
}
</style>
