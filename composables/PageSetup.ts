// ~/composables/PageSetup.ts
import { onBeforeMount, onUnmounted } from "vue";
import pageSEO from "~/assets/scripts/pages/seo";
import { type SEOData } from "~/assets/scripts/pages/seo";

interface PageSetupOptions {
  seoMeta?: SEOData;
}

export default function PageSetup(options?: PageSetupOptions) {
  const nuxt = useNuxtApp();

  onBeforeMount(() => {
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
