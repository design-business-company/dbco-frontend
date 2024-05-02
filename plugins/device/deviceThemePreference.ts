import { useDeviceStore } from "~/stores/device";
import type { Pinia } from "pinia";

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as Pinia;
  const deviceStore = useDeviceStore(pinia);

  const themeDetection = {
    mediaQuery: window.matchMedia("(prefers-color-scheme: dark)"),
    init() {
      window.addEventListener("colorSchemeUpdated", this.set);

      this.get();
      this.watch();
    },
    watch() {
      this.mediaQuery.addEventListener("change", this.get, false);
    },
    get() {
      const theme = ["dark", "light", "no-preference"].find(
        (scheme) =>
          window.matchMedia(`(prefers-color-scheme: ${scheme})`).matches
      );

      const event = new CustomEvent("colorSchemeUpdated", {
        detail: {
          theme,
        },
      });
      window.dispatchEvent(event);
    },
    set(ev: any) {
      deviceStore.setUserThemePreference(ev.detail.theme);
    },
  };

  themeDetection.init();
});
