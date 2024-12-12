import { useDeviceStore } from "~/stores/device";

export interface ColorTheme {
  theme?: "light" | "dark" | "custom";
  background: string;
  foreground: string;
  accent: string;
}

export const defaultThemes = {
  light: {
    background: "#ffffff",
    foreground: "#111111",
    accent: "#007aff",
  },
  dark: {
    background: "#000000",
    foreground: "#ffffff",
    accent: "red",
  },
};

export const useTheme = () => {
  const deviceStore = useDeviceStore();

  const getProcessedTheme = (props: ColorTheme): Omit<ColorTheme, "theme"> => {
    if (!props.theme || props.theme === "light") return defaultThemes.light;
    if (props.theme === "dark") return defaultThemes.dark;
    if (props.theme === "custom") {
      return {
        background: props.background ?? defaultThemes.light.background,
        foreground: props.foreground ?? defaultThemes.light.foreground,
        accent: props.accent ?? defaultThemes.light.accent,
      };
    }
    return defaultThemes.light;
  };

  const updateCssVariables = (theme: Omit<ColorTheme, "theme">) => {
    const cssVars = {
      "--background-primary": theme.background,
      "--foreground-primary": theme.foreground,
      "--accent-primary": theme.accent,
    };

    Object.entries(cssVars).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  };

  const setPageTheme = (theme: ColorTheme) => {
    const newTheme = getProcessedTheme(theme);
    deviceStore.setPageTheme(newTheme);
    updateCssVariables(newTheme);
  };

  const setTheme = (theme: ColorTheme) => {
    const newTheme = getProcessedTheme(theme);
    deviceStore.updateTheme(newTheme);
    updateCssVariables(newTheme);
  };

  const resetTheme = () => {
    deviceStore.updateTheme(deviceStore.pageTheme);
    updateCssVariables(deviceStore.pageTheme);
  };

  return {
    setTheme,
    setPageTheme,
    resetTheme,
    getProcessedTheme,
    theme: deviceStore.theme,
  };
};
