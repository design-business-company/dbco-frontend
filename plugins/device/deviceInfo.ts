import { useDeviceStore } from "~/stores/device";
import type { Pinia } from "pinia";

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as Pinia;
  const deviceStore = useDeviceStore(pinia);

  const device = {
    init() {
      this.set();
      window.addEventListener("resize", this.set);
    },
    set() {
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const isCursor = "onmousedown" in document.documentElement;
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      deviceStore.setTouch(isTouch);
      deviceStore.setCursor(isCursor);
      deviceStore.setMobile(isMobile);
    },
  };

  device.init();
});
