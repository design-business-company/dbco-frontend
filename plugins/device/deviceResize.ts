import { useDeviceStore } from "~/stores/device";

type TimeoutId = ReturnType<typeof setTimeout> | null;

export default defineNuxtPlugin((nuxtApp) => {
  const deviceStore = useDeviceStore(nuxtApp.$pinia as any);

  const windowResize = {
    delay: 200 as number,
    timeout: null as TimeoutId,
    resizeHandler: null as (() => void) | null,
    init() {
      this.resizeHandler = this.throttleResize.bind(this);
      this.timeout = null;
      this.delay = 150;

      window.addEventListener("resize", this.resizeHandler);
    },
    emit() {
      const resize = new CustomEvent("windowResized");
      dispatchEvent(resize);
    },
    throttleResize() {
      if (this.timeout !== null) clearTimeout(this.timeout);

      deviceStore.setResizing(true);

      this.timeout = setTimeout(() => {
        deviceStore.setResizing(false);
        (nuxtApp.$scroll as { setPosition: () => void }).setPosition();
        (nuxtApp.$dimensions as { set: () => void }).set();

        this.emit();
      }, this.delay);
    },
  };

  windowResize.init();
});
