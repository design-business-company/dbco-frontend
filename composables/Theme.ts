import { useDeviceStore } from "~/stores/device";
import { onBeforeMount, watch } from "vue";

export const Theme = () => {
  const deviceStore = useDeviceStore();

  const updateCssVariables = (theme: {
    background: string;
    foreground: string;
    accent: string;
  }) => {
    document.documentElement.style.setProperty(
      "--background-primary",
      theme.background
    );
    document.documentElement.style.setProperty(
      "--background-secondary",
      theme.foreground
    );
    document.documentElement.style.setProperty(
      "--accent-primary",
      theme.accent
    );
  };

  onBeforeMount(() => {
    updateCssVariables(deviceStore.theme);
  });

  // Watch for changes in theme
  watch(
    () => deviceStore.theme,
    (newTheme) => {
      updateCssVariables(newTheme);
    },
    { deep: true }
  );

  // Provide methods to update theme
  const setTheme = (
    newTheme: Partial<{
      background: string;
      foreground: string;
      accent: string;
    }>
  ) => {
    deviceStore.updateTheme(newTheme);
  };

  return {
    setTheme,
    theme: deviceStore.theme,
  };
};
