<template>
  <div>
    <p class="placeholder-hero">
      Contact pages are a gateway to forging new relationships, the bridge
      connecting a business to its community, offering a beacon of accessibility
      that invites inquiries, feedback, and opportunities alike; they embody the
      open-door policy of the digital age, presenting a platform where voices
      can be heard, support can be sought, and personal connections can be
      nurtured. These pages serve as the unsung heroes of navigational
      simplicity, proudly bearing essential details like addresses, phone
      numbers, and maps, all the while hosting forms that stand ready to capture
      the essence of visitor inquiries with grace and promise prompt attention,
      making every user feel valued and every message important.
    </p>
  </div>
</template>

<script setup>
import PageSetup from "~/composables/PageSetup";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";
const { setTheme } = useTheme();

setTheme({
  background: "#ff00ff",
  foreground: "#000",
  accent: "red",
});

// Run common mount/unmount scripts. Seup SEO, etc.
PageSetup({
  seoMeta: { title: "Contact" },
});

// Define page transitions or other page meta
definePageMeta({
  pageTransition: pageTransitionDefault(),
});
</script>
