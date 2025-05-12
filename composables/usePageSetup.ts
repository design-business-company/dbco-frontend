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
    const seoData = pageSEO({
      ...options.seoMeta,
      siteName: options.seoMeta.siteName || "Design Business Company",
    });

    // Use useHead for both title and meta tags to ensure they update during routing
    useHead({
      title: seoData.title,
      meta: [
        { name: "description", content: seoData.description },
        { name: "robots", content: seoData.robots },
        // OpenGraph
        { property: "og:title", content: seoData.ogTitle },
        { property: "og:description", content: seoData.ogDescription },
        { property: "og:image", content: seoData.ogImage },
        { property: "og:type", content: seoData.ogType },
        { property: "og:url", content: seoData.ogUrl },
        // Twitter
        { name: "twitter:card", content: seoData.twitterCard },
        { name: "twitter:title", content: seoData.twitterTitle },
        { name: "twitter:description", content: seoData.twitterDescription },
        { name: "twitter:image", content: seoData.twitterImage },
        { name: "twitter:url", content: seoData.twitterUrl },
        { name: "twitter:site", content: seoData.twitterSite },
        { name: "twitter:creator", content: seoData.twitterCreator },
      ].filter((meta) => meta.content), // Filter out empty values
    });
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
  };
}
