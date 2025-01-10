import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    appHasLoaded: false as boolean,
    routeIsTransitioning: true as boolean,
    headerIsVisible: true as boolean,
    mobileNavIsVisible: false as boolean,
    seo: {
      image: "" as string,
      description: "" as string,
      url: "" as string,
      logo: "" as string,
    },
  }),
  actions: {
    setAppHasLoaded(loaded: boolean) {
      this.appHasLoaded = loaded;
    },
    setRouteIsTransitioning(transitioning: boolean) {
      this.routeIsTransitioning = transitioning;
    },
    setHeaderIsVisible(visible: boolean) {
      this.headerIsVisible = visible;
    },
    setMobileNavVisibility(visible: boolean) {
      this.mobileNavIsVisible = visible;
    },
    setSeoData(seoData: {
      image?: string;
      description?: string;
      url?: string;
      logo?: string;
    }) {
      // Log to verify the input
      console.log("setSeoData Input:", seoData);

      // Update state with the provided data
      this.seo = { ...this.seo, ...seoData };

      // Log to verify the state after the update
      console.log("Updated SEO State:", this.seo);
    },
  },
});
