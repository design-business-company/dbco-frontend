import { useDeviceStore } from "~/stores/device";

export const useTheme = () => {
  const deviceStore = useDeviceStore();

  // Define default themes
  const defaultThemes = {
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

  const updateCssVariables = (theme) => {
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

  // Watch for changes in theme
  watch(
    () => deviceStore.theme,
    (newTheme) => {
      updateCssVariables(newTheme);
    },
    { deep: true }
  );

  // Provide methods to update theme
  const setTheme = (newTheme) => {
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
    theme: deviceStore.theme,
  };
};
