<template>
  <Grid class="password-page">
    <Column span-laptop="6" start-laptop="4">
      <GatedPagePasswordForm :slug="slug" />
    </Column>
  </Grid>
</template>

<script setup>
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";

const slug = useRoute().query.slug;

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
