import { useDeviceStore } from "~/stores/device";

export interface ColorTheme {
  theme?: "light" | "dark" | "custom";
  background: string;
  foreground: string;
  accent: string;
}

// Define default themes outside the composable
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

  const getProcessedTheme = (props: ColorTheme) => {
    if (!props.theme || props.theme === "light") return defaultThemes.light;
    if (props.theme === "dark") return defaultThemes.dark;
    if (props.theme === "custom") {
      return {
        background:
          props.backgroundPrimary?.hex || defaultThemes.light.background,
        foreground:
          props.foregroundPrimary?.hex || defaultThemes.light.foreground,
        accent: props.accentPrimary?.hex || defaultThemes.light.accent,
      };
    }
    return defaultThemes.light;
  };

  const updateCssVariables = (theme: ColorTheme) => {
    document.documentElement.style.setProperty(
      "--background-primary",
      theme.background
    );
    document.documentElement.style.setProperty(
      "--foreground-primary",
      theme.foreground
    );
    document.documentElement.style.setProperty(
      "--accent-primary",
      theme.accent
    );
  };

  const resetTheme = () => {
    deviceStore.updateTheme(deviceStore.pageTheme);
  };

  // Watch for changes in theme
  watch(
    () => deviceStore.theme,
    (newTheme) => {
      updateCssVariables(newTheme);
    },
    { deep: true }
  );

  // Set the global page theme that we can reset to when needed
  const setPageTheme = (theme: ColorTheme) => {
    if (theme.theme === "light" || theme.theme === "dark") {
      deviceStore.setPageTheme(defaultThemes[theme.theme]);
    } else if (typeof theme === "object") {
      deviceStore.setPageTheme({
        background: theme.background || theme.backgroundPrimary.hex,
        foreground: theme.foreground || theme.foregroundPrimary.hex,
        accent: theme.accent || theme.accentPrimary.hex,
      });
    }
  };

  // Provide methods to update theme
  const setTheme = (newTheme: ColorTheme) => {
    // console.log(newTheme);

    if (newTheme.theme === "light" || newTheme.theme === "dark") {
      deviceStore.updateTheme(defaultThemes[newTheme.theme]);
    } else if (typeof newTheme === "object") {
      deviceStore.updateTheme({
        background: newTheme.background || newTheme.backgroundPrimary.hex,
        foreground: newTheme.foreground || newTheme.foregroundPrimary.hex,
        accent: newTheme.accent || newTheme.accentPrimary.hex,
      });
    }
  };

  return {
    setTheme,
    setPageTheme,
    resetTheme,
    getProcessedTheme,
    theme: deviceStore.theme,
  };
};
