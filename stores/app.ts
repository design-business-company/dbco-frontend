import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    appHasLoaded: false as boolean | false,
    routeIsTransitioning: true as boolean | true,
    route: {} as object | {},
    headerIsVisible: true as boolean | true,
    mobileNavIsVisible: false as boolean | false,
    seo: {} as object | {},
  }),
  actions: {
    setAppHasLoaded(loaded: boolean) {
      this.appHasLoaded = loaded;
    },
    setRouteIsTransitioning(transitioning: boolean) {
      this.routeIsTransitioning = transitioning;
    },
    setRoute(route: object) {
      this.route = route;
    },
    setHeaderIsVisible(visible: boolean) {
      this.headerIsVisible = visible;
    },
    setMobileNavVisibility(visible: boolean) {
      this.mobileNavIsVisible = visible;
    },
    setSeo(data: boolean) {
      this.seo = data;
    },
  },
});
