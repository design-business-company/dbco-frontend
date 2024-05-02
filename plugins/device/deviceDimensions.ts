import { useDeviceStore } from "~/stores/device";

export default defineNuxtPlugin((nuxtApp) => {
  const deviceStore = useDeviceStore(nuxtApp.$pinia as any);

  const dimensions = {
    init() {
      this.set();
      window.addEventListener("scroll", this.set);
      window.addEventListener("windowResized", this.set);
    },
    set() {
      deviceStore.setDPI(window.devicePixelRatio);
      deviceStore.setWindowWidth(window.innerWidth);
      deviceStore.setWindowHeight(window.innerHeight);
      deviceStore.setDocumentHeight(document.body.scrollHeight);
      deviceStore.setDocumentWidth(document.body.scrollWidth);
    },
  };

  nuxtApp.provide("dimensions", dimensions);
  dimensions.init();
});
