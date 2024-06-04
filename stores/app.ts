import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    appHasLoaded: false as boolean | false,
    routeIsTransitioning: true as boolean | true,
    headerIsVisible: true as boolean | true,
    mobileNavIsVisible: false as boolean | false,
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
  },
});
