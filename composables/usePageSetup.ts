// ~/composables/PageSetup.ts
import { onMounted } from "vue";
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

  const getSrcFromSrcset = (srcset: string | null) => {
    if (!srcset) return;

    const sources = srcset.split(",");

    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    
    return sources.find((source) => {
      const [_, width] = source.trim().split(" ");
      const imageWidth = parseInt(width);
      return window.matchMedia(`(max-width: ${imageWidth}px)`).matches && vw <= imageWidth;
    })?.trim().split(" ")[0];
  }

  const preloadMedia = (el: HTMLElement) => {
    if (!el) return;

    const videoEls = el.querySelectorAll("mux-player");
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
      const srcset = el.getAttribute("srcset");
      const src = getSrcFromSrcset(srcset)

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
    link.fetchPriority = "low";
    document.head.appendChild(link);
  }
}
