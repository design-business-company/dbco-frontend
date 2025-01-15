// ~/composables/PageSetup.ts
import { onMounted, onUnmounted } from "vue";
import pageSEO from "~/assets/scripts/pages/seo";
import { type SEOData } from "~/assets/scripts/pages/seo";

interface PageSetupOptions {
  seoMeta?: SEOData;
  pageRef?: Ref<HTMLElement>;
}

export default function usePageSetup(options?: PageSetupOptions) {
  const nuxt = useNuxtApp();

  if (options?.seoMeta) {
    useServerSeoMeta(pageSEO(options.seoMeta));
  }

  onMounted(() => {
    // Update dimension on refresh
    (nuxt.$dimensions as any).set();

    if (options?.pageRef?.value) {
      preloadMedia(options.pageRef.value);
    }
  });

  const preloadMedia = (el: HTMLElement) => {
    if (!el) return;

    const videoEls = el.querySelectorAll("mux-video");
    const imageEls = el.querySelectorAll("img");

    let posters: string[] = [];
    let images: string[] = [];

    videoEls?.forEach((el) => {
      const poster = el.getAttribute("poster");

      if (poster) {
        posters.push(poster);
      }
    })

    imageEls?.forEach((el) => {
      const src = el.getAttribute("src");

      if (src) {
        images.push(src);
      }
    })

    posters.forEach(handlePreload);
    images.forEach(handlePreload);
  }

  const handlePreload = (src: string) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = src;
    link.as = "image";
    document.head.appendChild(link);
    
    link.onload = () => {
      link.remove();
    }
  }
  

  onUnmounted(() => {
    // Your onUnmounted logic
  });
}
