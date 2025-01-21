<template>
  <span :class="['hypertext__span']">
    <slot />
  </span>
</template>

<script setup>
import { useGsapPulse } from "@/composables/Hypertext/Pulse.js";
import { useGsapWave } from "@/composables/Hypertext/Wave.js";

useGsapPulse(".hypertext__span.new");
useGsapWave(".hypertext__span.design");

defineOptions({
  inheritAttrs: false,
});
</script>

<style scoped>
.hypertext__span {
  display: inline-flex;
}
</style>
