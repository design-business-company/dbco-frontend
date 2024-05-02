import { ref, onUnmounted, watch, onMounted, Ref } from "vue";

/*--------------------------------------------------------
  Usage
  --------------------------------------------------------
  import observe from "~/composables/Observer";
  const elObserved = ref({});

  const { isIntersecting } = observe({
    element: elObserved,
    onEnter: () => console.log("Element is intersecting"),
    onLeave: () => console.log("Element is not intersecting"),
  });
--------------------------------------------------------*/

interface ObserveOptions {
  element: Ref<HTMLElement | null>;
  onEnter: () => void;
  onLeave?: () => void;
  once?: boolean;
  options?: IntersectionObserverInit;
}

export default function observe({
  element,
  onEnter,
  onLeave = () => {},
  once = false,
  options = {},
}: ObserveOptions): { isIntersecting: Ref<boolean> } {
  const isIntersecting = ref(false);
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isIntersecting.value = true;
          onEnter();
          if (once && observer) {
            observer.unobserve(entry.target);
          }
        } else {
          isIntersecting.value = false;
          onLeave();
        }
      });
    }, options);

    watch(
      element,
      (newEl, oldEl) => {
        if (observer && newEl) {
          if (oldEl) observer.unobserve(oldEl);
          observer.disconnect();
          observer.observe(newEl);
        }
      },
      { immediate: true }
    );
  });

  onUnmounted(() => {
    if (observer) observer.disconnect();
  });

  return { isIntersecting };
}
