import { defineStore } from "pinia";

interface PreferredTheme {
  theme: "light" | "dark" | "no-preference";
}

type ScrollDirection = "up" | "down" | "left" | "right";

export const useDeviceStore = defineStore("device", {
  state: () => ({
    // context
    isTouch: null as boolean | null,
    isCursor: null as boolean | null,
    isMobile: null as boolean | null,
    isResizing: false as boolean | false,
    // scroll info
    isScrolling: false as boolean | false,
    scrollX: null as number | null,
    scrollY: null as number | null,
    scrollDirection: null as ScrollDirection | null,
    scrollAtTop: null as boolean | null,
    scrollNearTop: null as boolean | null,
    scrollAtBottom: null as boolean | null,
    scrollNearBottom: null as boolean | null,

    // user prefs
    userMotionReduced: null as boolean | null,
    userThemePreference: null as PreferredTheme | null,

    // viewport metrics
    winWidth: 0 as number | 0,
    winHeight: 0 as number | 0,
    docWidth: 0 as number | 0,
    docHeight: 0 as number | 0,
    dpi: 0 as number | 0,
  }),
  actions: {
    setTouch(val: boolean) {
      this.isTouch = val;
    },
    setCursor(val: boolean) {
      this.isCursor = val;
    },
    setMobile(val: boolean) {
      this.isMobile = val;
    },
    setWindowWidth(val: number) {
      this.winWidth = val;
    },
    setWindowHeight(val: number) {
      this.winHeight = val;
    },
    setDocumentWidth(val: number) {
      this.docWidth = val;
    },
    setDocumentHeight(val: number) {
      this.docHeight = val;
    },
    setDPI(val: number) {
      this.dpi = val;
    },
    setScrollX(val: number) {
      this.scrollX = val;
    },
    setScrollY(val: number) {
      this.scrollY = val;
    },
    setUserMotionReduced(val: boolean) {
      this.userMotionReduced = val;
    },
    setUserThemePreference(val: PreferredTheme) {
      this.userThemePreference = val;
    },
    setScrolling(val: boolean) {
      this.isScrolling = val;
    },
    setScrollDirection(val: ScrollDirection) {
      this.scrollDirection = val;
    },
    setScrollNearBottom(val: boolean) {
      this.scrollNearBottom = val;
    },
    setScrollAtTop(val: boolean) {
      this.scrollAtTop = val;
    },
    setScrollAtBottom(val: boolean) {
      this.scrollAtBottom = val;
    },
    setScrollNearTop(val: boolean) {
      this.scrollNearTop = val;
    },
    setResizing(val: boolean) {
      this.isResizing = val;
    },
  },
});
