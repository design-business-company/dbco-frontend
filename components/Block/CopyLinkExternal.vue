<template>
  <span class="link">
    <a
      :href="resolvedHref"
      :target="!isMailto && resolvedBlank ? '_blank' : undefined"
      rel="noopener noreferrer"
      @click="onClick"
    >
      <slot />
    </a>
    <span class="link__tooltip" :class="{ '--visible': copied }" aria-hidden="true">
      <span class="link__tooltip-pill text-caption-2">Copied to clipboard!</span>
      <span class="link__tooltip-caret"></span>
    </span>
    <span role="status" class="sr-only">{{ copied ? "Email address copied to clipboard" : "" }}</span>
  </span>
</template>

<script setup>
import { useRoute } from "vue-router";

const props = defineProps({
  value: {
    type: Object,
    default: null,
  },
  href: {
    type: String,
    default: null,
  },
  blank: {
    type: Boolean,
    default: true,
  },
  text: {
    type: String,
    required: false,
    default: "",
  },
});

// some sanity schemas pass href directly (like the footer),
// others bundle it in value
const resolvedHref = computed(() => props.href || props.value?.href || "#");
const resolvedBlank = computed(() =>
  props.href ? props.blank : props.value?.blank
);
const isMailto = computed(() => resolvedHref.value.startsWith("mailto:"));

const route = useRoute();
const copied = ref(false);
let copiedTimer = null;

const onClick = (event) => {
  if (!isMailto.value) return;

  // No clipboard API (http, old browsers) — let the native mailto proceed
  if (!navigator.clipboard?.writeText) return;

  event.preventDefault();

  const email = resolvedHref.value.replace(/^mailto:/, "").split("?")[0];

  navigator.clipboard.writeText(email).then(
    () => {
      copied.value = true;
      clearTimeout(copiedTimer);
      copiedTimer = setTimeout(() => (copied.value = false), 2000);
      useTrackEvent("Contact: copy email", {
        props: { email, page: route.path },
      });
    },
    () => {
      // Copy refused (permissions) — fall back to the mail client
      window.location.href = resolvedHref.value;
    }
  );
};

onUnmounted(() => clearTimeout(copiedTimer));
</script>

<style scoped>
.link {
  display: inline;
  position: relative;
}

.link__tooltip {
  position: absolute;
  bottom: calc(100% + var(--tiniest));
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  filter: drop-shadow(0 0 2.5px var(--background-primary));
  pointer-events: none;
  opacity: 0;
  transition: opacity 150ms ease;
}

.link__tooltip-pill {
  padding: var(--tinier);
  border-radius: 6px;
  color: var(--background-primary);
  background-color: var(--foreground-primary);
  white-space: nowrap;
}

.link__tooltip-caret {
  width: 14px;
  height: 7px;
  background-color: var(--foreground-primary);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}

.link__tooltip.--visible {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .link__tooltip {
    transition: none;
  }
}
</style>
