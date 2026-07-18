<template>
  <Grid class="password-page">
    <header class="sr-only"><h1>Password required</h1></header>
    <Column span-laptop="6" start-laptop="4">
      <GatedPagePasswordForm :slug="slug" />
    </Column>
  </Grid>
</template>

<script setup>
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";

const slug = useRoute().query.slug;

// Utility route — never index the password prompt
useSeoMeta({ robots: "noindex, nofollow" });
useHead({ title: "Enter password" });

definePageMeta({
  pageTransition: pageTransitionDefault(),
});
</script>

<style>
.password-page {
  width: 100%;
  min-height: 60vh;
  place-content: center;
}
</style>
