<template>
  <div class="theme-switcher" ref="themePickerRef">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useTheme } from "~/composables/useTheme";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const { setTheme } = useTheme();

// Global theme stack to track the current and previous themes
const themeStack = ref([]);

const props = defineProps({
  theme: {
    type: String,
    required: false,
  },
  backgroundPrimary: {
    type: Object,
    required: false,
  },
  foregroundPrimary: {
    type: Object,
    required: false,
  },
  accentPrimary: {
    type: Object,
    required: false,
  },
  settings: {
    type: Object,
    required: false,
    default: () => ({
      percent: 50,
    }),
  },
});

const themePickerRef = ref(null);

let scrollTriggerInstance; // Reference to the ScrollTrigger instance for cleanup

onMounted(() => {
  const processedTheme = {
    theme: props.theme,
    backgroundPrimary: props.backgroundPrimary,
    foregroundPrimary: props.foregroundPrimary,
    accentPrimary: props.accentPrimary,
  };

  console.log(themePickerRef.value);
  nextTick(() => {
    // Create the GSAP animation with ScrollTrigger
    scrollTriggerInstance = gsap.from(themePickerRef.value, {
      scrollTrigger: {
        trigger: themePickerRef.value,
        start: `top ${props.settings.percent}%`, // Start when the top of the element is at 20% of the viewport height
        end: `bottom ${props.settings.percent}%`,
        toggleActions: "play none none none",
        markers: true, // Enable markers for debugging
        onEnter: () => {
          themeStack.value.push(processedTheme);
          setTheme(processedTheme);
          console.log("onenter");
        },
        onLeave: () => {
          themeStack.value.pop();
          if (themeStack.value.length > 0) {
            setTheme(themeStack.value[themeStack.value.length - 1]);
            console.log("onleave");
          }
        },
        onEnterBack: () => {
          themeStack.value.push(processedTheme);
          setTheme(processedTheme);
        },
        onLeaveBack: () => {
          themeStack.value.pop();
          if (themeStack.value.length > 0) {
            setTheme(themeStack.value[themeStack.value.length - 1]);
          }
        },
      },
    });
  });
});

onUnmounted(() => {
  // Kill the ScrollTrigger instance to clean up
  scrollTriggerInstance.scrollTrigger?.kill();
});
</script>

<!-- <style lang="scss">
.theme-switcher {
  top: 0;
  width: 1px;
  height: 1px;
  padding: 0;
  margin-top: -1px;
}
</style> -->
