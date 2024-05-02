// ~/composables/PageSetup.ts
import { onMounted, onUnmounted } from "vue";
import pageSEO from "~/assets/scripts/pages/seo";
import type { SEOData } from "~/types/SEOData";

interface PageSetupOptions {
  seoMeta?: SEOData;
}

export default function PageSetup(options?: PageSetupOptions) {
  const nuxt = useNuxtApp();

  onMounted(() => {
    // Update dimension on refresh
    (nuxt.$dimensions as any).set();

    // Set page meta if seoMeta is provided
    if (options?.seoMeta) {
      useSeoMeta(pageSEO(options.seoMeta));
    }
  });

  onUnmounted(() => {
    // Your onUnmounted logic
  });
}
