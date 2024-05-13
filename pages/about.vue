<template>
  <div>
    <Grid>
      <!-- <Column v-for="client in data" span="4" v-if="!client.title">
        <pre><code>{{ client }}</code></pre>
      </Column> -->

      <Column tablet-span="6">
        <Text size="headline-1"
          >Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
          inventore nemo exercitationem? Ex nihil cupiditate exercitationem
          deserunt quisquam tenetur, voluptas libero consectetur dolorem esse
          rerum, labore explicabo maiores sint autem.</Text
        ></Column
      >
    </Grid>
    <AboutClients />
  </div>
</template>

<script setup>
import PageSetup from "~/composables/PageSetup";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";
import { Theme } from "~/composables/Theme";
const { setTheme } = Theme();

setTheme({
  background: "#ffffff",
  foreground: "#000000",
  accent: "#ff0000",
});

// Run common mount/unmount scripts. Seup SEO, etc.
PageSetup({
  seoMeta: { title: "About" },
});

// Define page transitions or other page meta
definePageMeta({
  pageTransition: pageTransitionDefault(),
});

const query = groq`*[_type=="clients"]`;
const { data } = useSanityQuery(query);
</script>
