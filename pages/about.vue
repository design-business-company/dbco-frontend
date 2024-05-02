<template>
  <div>
    <p class="placeholder-hero">About</p>
    <p>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum
      molestias, amet recusandae aspernatur illum veniam enim minima, fuga
      dolorum minus ab repellat voluptatum sapiente eum quaerat? Unde officiis
      libero autem!
    </p>
  </div>
</template>

<script setup>
import PageSetup from "~/composables/PageSetup";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";

// Run common mount/unmount scripts. Seup SEO, etc.
PageSetup({
  seoMeta: { title: "About" },
});

// Define page transitions or other page meta
definePageMeta({
  pageTransition: pageTransitionDefault(),
});
</script>
