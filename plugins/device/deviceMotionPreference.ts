import { useDeviceStore } from "~/stores/device";
import type { Pinia } from "pinia";

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as Pinia;
  const deviceStore = useDeviceStore(pinia);

  const motionPreference = {
    mediaQuery: window.matchMedia("(prefers-reduced-motion: reduce)"),
    init() {
      window.addEventListener("reducedMotionUpdated", this.set);

      this.get();
      this.watch();
    },
    watch() {
      this.mediaQuery.addEventListener("change", this.get, false);
    },
    get(ev?: MediaQueryListEvent) {
      const reduce = ev ? ev.matches : this.mediaQuery.matches;
      const event = new CustomEvent("reducedMotionUpdated", {
        detail: { reduce },
      });
      window.dispatchEvent(event);
    },
    set(ev: any) {
      deviceStore.setUserMotionReduced(ev.detail.reduce);
    },
    destroy() {
      this.mediaQuery.removeEventListener("change", this.get, false);
    },
  };

  motionPreference.init();
});
