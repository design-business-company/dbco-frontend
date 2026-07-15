import { onMounted, onUnmounted, type Ref } from "vue";

/*--------------------------------------------------------
  Tracks a single "Carousel interact" Plausible event per
  component instance (i.e. once per page load) on the first
  real user drag. Embla's `pointerUp` only fires on pointer
  interaction — AutoScroll never emits it.

  If once-per-load proves too coarse, swap the latch for a
  cooldown (e.g. allow re-tracking 10s after the last event).
--------------------------------------------------------*/

export default function useCarouselTracking(
  emblaApi: Ref<any>,
  getProject: () => string
) {
  let hasTracked = false;

  const trackInteract = () => {
    if (hasTracked) return;
    hasTracked = true;
    useTrackEvent("Carousel interact", { props: { project: getProject() } });
  };

  onMounted(() => emblaApi.value?.on("pointerUp", trackInteract));
  onUnmounted(() => emblaApi.value?.off("pointerUp", trackInteract));

  return { trackInteract };
}
