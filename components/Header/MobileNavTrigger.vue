<template>
  <div class="mobile-trigger">
    <button
      class="mobile-trigger__button"
      :aria-label="app.mobileNavIsVisible ? 'Close Nav' : 'Open Nav'"
    >
      <div class="mobile-trigger__button-content">
        <svg
          width="34"
          height="12"
          viewBox="0 0 34 12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            ref="topLineRef"
            :d="`M1 ${!app.mobileNavIsVisible ? '1H33' : '6H33'}`"
            stroke="var(--foreground-primary)"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            ref="bottomLineRef"
            :d="`M1 ${!app.mobileNavIsVisible ? '11H33' : '6H33'}`"
            stroke="var(--foreground-primary)"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
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
    }

    &:hover {
      .mobile-trigger__button-content {
        transition-duration: 100ms;
        background-color: var(--background-secondary);
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
  svg {
    display: block;
    width: 32px;
    height: auto;

    path {
      transition: d 150ms ease-out;
    }
  }
}
</style>
