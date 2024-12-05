import { useDeviceStore } from "~/stores/device";

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

  const setTemporaryTheme = (newTheme) => {
    document.documentElement.style["transition"] = "none";
    updateCssVariables(newTheme);
  }

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

  const restoreTheme = () => {
    document.documentElement.style["transition"] = "var(--transition), color var(--transition)";
    console.log('restoring theme', deviceStore.theme)
    deviceStore.updateTheme(deviceStore.theme);
    updateCssVariables(deviceStore.theme);
  }

  return {
    setTheme,
    setTemporaryTheme,
    restoreTheme,
    theme: deviceStore.theme,
  };
};
