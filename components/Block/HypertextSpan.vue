<template>
  <span :class="['hypertext']">
    <slot />
  </span>
</template>

<script setup>
import { useGsapPulse } from "@/composables/Hypertext/Pulse.js";
import { useGsapWave } from "@/composables/Hypertext/Wave.js";

useGsapPulse('.hypertext[name="new"]');
useGsapWave('.hypertext[name="design"]');
</script>

<style scoped>
.hypertext {
  display: inline-block;
}
</style>
