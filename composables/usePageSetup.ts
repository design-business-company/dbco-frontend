// ~/composables/PageSetup.ts
import { onMounted, onUnmounted } from "vue";
import pageSEO from "~/assets/scripts/pages/seo";
import { type SEOData } from "~/assets/scripts/pages/seo";

interface PageSetupOptions {
  seoMeta?: SEOData;
}

export default function usePageSetup(options?: PageSetupOptions) {
  const nuxt = useNuxtApp();

  if (options?.seoMeta) {
    useServerSeoMeta(pageSEO(options.seoMeta));
  }

  onMounted(() => {
    // Update dimension on refresh
    (nuxt.$dimensions as any).set();
  });

  onUnmounted(() => {
    // Your onUnmounted logic
  });
}
