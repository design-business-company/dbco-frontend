import { ref, onUnmounted } from "vue";
import gsap from "gsap";
import SplitText from "gsap/SplitText";

if (process.client) {
  gsap.registerPlugin(SplitText);
}

export function useSplitText() {
  const splitInstance = ref<SplitText | null>(null);

  const createSplitText = (
    element: Element,
    type: "lines" | "words" | "chars" = "chars"
  ) => {
    // Cleanup previous instance if it exists
    if (splitInstance.value) {
      // splitInstance.value.revert();
    }

    // Create new SplitText instance
    splitInstance.value = new SplitText(element, { type: type });
    return splitInstance.value;
  };

  const clearSplitText = () => {
    if (splitInstance.value) {
      splitInstance.value.revert();
      splitInstance.value = null;
    }
  };

  // Clean up when the component using this composable is unmounted
  onUnmounted(() => {
    clearSplitText();
  });

  return { createSplitText, clearSplitText };
}
