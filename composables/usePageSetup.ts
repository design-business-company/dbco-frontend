import { onMounted } from "vue";
import pageSEO from "~/assets/scripts/pages/seo";
import { type SEOData } from "~/assets/scripts/pages/seo";

interface PreloadItem {
  src?: string | null;
  srcset?: string | null;
  sizes?: string | null;
}

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

    const videoEls = el.querySelectorAll("mux-player");
    const imageEls = el.querySelectorAll("img");

    let posters: PreloadItem[] = [];
    let images: PreloadItem[] = [];

    videoEls?.forEach((el) => {
      const poster = el.getAttribute("poster");

      if (poster) {
        posters.push({ src: poster });
      }
    });

    imageEls?.forEach((el) => {
      const srcset = el.getAttribute("srcset");
      const sizes = el.getAttribute("sizes");
      const src = el.getAttribute("src");

      images.push({
        src,
        srcset,
        sizes,
      });
    });

    posters.forEach(handlePreload);
    images.forEach(handlePreload);
  };

  const handlePreload = (item: PreloadItem) => {
    if (!item?.src) return;

    const img = new Image();
    img.src = item.src;
    if (item.srcset) img.srcset = item.srcset;
    if (item.sizes) img.sizes = item.sizes;

    // img.onload = () => {
    //   console.log("Image loaded");
    // }
  };
}
