// @ts-ignore
import DetectScroll from "@egstad/detect-scroll";
import { useDeviceStore } from "~/stores/device";

export default defineNuxtPlugin((nuxtApp) => {
  const deviceStore = useDeviceStore(nuxtApp.$pinia as any);

  const scroll: {
    instance?: DetectScroll;
    init(): void;
    scrollStart(): void;
    scrollStop(): void;
    scrollUp(): void;
    scrollDown(): void;
    scrollY(): void;
    setPosition(): void;
    isAtTop(): void;
    isAtBottom(): void;
    isNearTop(): void;
    isNearBottom(): void;
    destroy(): void;
  } = {
    init() {
      this.scrollY = this.scrollY.bind(this);
      this.scrollUp = this.scrollUp.bind(this);
      this.scrollDown = this.scrollDown.bind(this);
      this.scrollStart = this.scrollStart.bind(this);
      this.scrollStop = this.scrollStop.bind(this);
      this.isAtTop = this.isAtTop.bind(this);
      this.isAtBottom = this.isAtBottom.bind(this);
      this.isNearTop = this.isNearTop.bind(this);
      this.isNearBottom = this.isNearBottom.bind(this);
      this.instance = new DetectScroll(window, {
        // debugMode: true,
        events: {
          scrollY: this.scrollY,
          scrollUp: this.scrollUp,
          scrollDown: this.scrollDown,
          scrollStart: this.scrollStart,
          scrollStop: this.scrollStop,
        },
      });

      this.setPosition();
    },
    scrollY() {
      this.setPosition();
    },
    scrollUp() {
      deviceStore.setScrollDirection("up");
    },
    scrollDown() {
      deviceStore.setScrollDirection("down");
    },
    scrollStart() {
      deviceStore.setScrolling(true);
    },
    scrollStop() {
      deviceStore.setScrolling(false);
      this.setPosition();
    },
    isAtTop() {
      const scrollPosition = this.instance?.y || 0;
      deviceStore.setScrollAtTop(scrollPosition === 0);
    },
    isAtBottom() {
      const totalPageHeight = deviceStore.docHeight;
      const scrollPosition = this.instance?.y + deviceStore.winHeight;

      deviceStore.setScrollAtBottom(totalPageHeight < scrollPosition + 1);
    },
    setPosition() {
      // reset vals
      deviceStore.setScrollAtTop(false);
      deviceStore.setScrollNearTop(false);
      deviceStore.setScrollAtBottom(false);
      deviceStore.setScrollNearBottom(false);

      // update state
      this.isAtTop();
      this.isAtBottom();
      this.isNearTop();
      this.isNearBottom();
      deviceStore.setScrollX(this.instance?.x);
      deviceStore.setScrollY(this.instance?.y);
    },

    isNearTop(threshold = 72) {
      if (!this.instance) return;
      const scrollPosition = this.instance.y;
      deviceStore.setScrollNearTop(scrollPosition <= threshold);
    },
    isNearBottom(threshold = 50) {
      if (!this.instance) return;
      const totalPageHeight = deviceStore.docHeight;
      const scrollPosition = this.instance.y + deviceStore.winHeight;

      deviceStore.setScrollNearBottom(
        totalPageHeight - scrollPosition <= threshold
      );
    },
    destroy() {
      this.instance.destroy();
    },
  };

  nuxtApp.provide("scroll", scroll);
  scroll.init();
});
