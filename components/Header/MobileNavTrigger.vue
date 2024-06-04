<template>
  <div class="mobile-trigger">
    {{ app.mobileNavIsVisible ? "Close Nav" : "Open Nav" }}
  </div>
</template>

<script setup>
import { useAppStore } from "~/stores/app";

const app = useAppStore();
</script>

<style lang="scss" scoped>
.mobile-trigger {
  cursor: pointer;
}
</style>
