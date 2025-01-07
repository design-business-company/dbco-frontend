import { useDeviceStore } from "~/stores/device";

export interface ColorTheme {
  theme?: "light" | "dark" | "custom";
  background: string;
  foreground: string;
  accent: string;
  backgroundPrimary?: { hex: string };
  foregroundPrimary?: { hex: string };
  accentPrimary?: { hex: string };
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
    let theme;

    switch (props.theme) {
      case "custom":
        // Check for undefined optional properties
        if (
          props.backgroundPrimary?.hex &&
          props.foregroundPrimary?.hex &&
          props.accentPrimary?.hex
        ) {
          theme = {
            background: props.backgroundPrimary.hex,
            foreground: props.foregroundPrimary.hex,
            accent: props.accentPrimary.hex,
          };
        } else {
          // Provide fallback or throw an error if these are mandatory
          throw new Error("Missing required properties for custom theme.");
        }
        break;

      case "light":
        theme = defaultThemes.light;
        break;

      default:
        theme = defaultThemes.dark;
        break;
    }

    return theme;
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
