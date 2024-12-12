import { defineStore } from "pinia";

interface PreferredTheme {
  theme: "light" | "dark" | "no-preference";
}

type ScrollDirection = "up" | "down" | "left" | "right";

interface Theme {
  background: string;
  foreground: string;
  accent: string;
}

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
    scrollNearTop: true as boolean | true,
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
    // theme
    theme: {
      background: "#ffffff", // Default white background
      foreground: "#000000", // Default black foreground
      accent: "#ff0000", // Default red accent
    } as Theme,
    // page theme
    pageTheme: {
      background: "#ffffff",
      foreground: "#000000",
      accent: "#ff0000",
    } as Theme,
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
    setPageTheme(newTheme: Partial<Theme>) {
      if (newTheme.background !== undefined) {
        this.pageTheme.background = newTheme.background;
        this.theme.background = newTheme.background;
      }
      if (newTheme.foreground !== undefined) {
        this.pageTheme.foreground = newTheme.foreground;
        this.theme.foreground = newTheme.foreground;
      }
      if (newTheme.accent !== undefined) {
        this.pageTheme.accent = newTheme.accent;
        this.theme.accent = newTheme.accent;
      }
    },
    updateTheme(newTheme: Partial<Theme>) {
      // Update each theme property if provided
      if (newTheme.background !== undefined)
        this.theme.background = newTheme.background;
      if (newTheme.foreground !== undefined)
        this.theme.foreground = newTheme.foreground;
      if (newTheme.accent !== undefined) this.theme.accent = newTheme.accent;
    },
  },
});
