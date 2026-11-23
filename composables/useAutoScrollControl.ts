import { ref, watch, type Ref } from "vue";
import { useDeviceStore } from "~/stores/device";

/**
 * Shared play/stop/toggle logic for embla AutoScroll carousels (WCAG 2.2.2 +
 * prefers-reduced-motion). Components call `play()`/`stop()` from their
 * in-view Observer callbacks and wire `toggle()`/`playing` to a
 * <CarouselPauseButton>.
 *
 * - `prefers-reduced-motion` users never get auto-scroll started for them
 *   (pair with `playOnInit: false` on the AutoScroll plugin) but may opt in
 *   explicitly via the pause/play button.
 * - An explicit pause survives the carousel leaving/re-entering the viewport.
 * - `playing` tracks user-facing intent, not transient hover/focus stops.
 * - Pass `emblaApi` so the plugin's own resumes can be vetoed: with
 *   `stopOnInteraction: false` it restarts itself after a drag settles and
 *   on mouseleave, with no knowledge of a user pause. While `playing` is
 *   false those restarts are cancelled, so a paused carousel that is dragged
 *   and thrown glides to a stop and stays paused.
 */
export function useAutoScrollControl(
  getInstance: () => any,
  emblaApi?: Ref<any>
) {
  const deviceStore = useDeviceStore();

  const playing = ref(false);
  const userStopped = ref(false); // paused via the button
  const userStarted = ref(false); // started via the button (overrides reduced-motion)

  const play = () => {
    const instance = getInstance();
    if (!instance) return;
    if (userStopped.value) return;
    if (deviceStore.userMotionReduced && !userStarted.value) return;

    // Set before instance.play(): the veto below reads it synchronously
    // from the plugin's autoScroll:play event.
    playing.value = true;
    if (!instance.isPlaying()) instance.play();
  };

  const stop = () => {
    const instance = getInstance();
    if (!instance) return;

    if (instance.isPlaying()) instance.stop();
    playing.value = false;
  };

  const toggle = () => {
    if (playing.value) {
      userStopped.value = true;
      userStarted.value = false;
      stop();
    } else {
      userStopped.value = false;
      userStarted.value = true;
      play();
    }
  };

  // The plugin emits autoScroll:play before it marks itself active, so the
  // stop has to wait a microtask (it still lands before the plugin's
  // start timer fires).
  const vetoUnwantedPlay = () => {
    if (playing.value) return;
    queueMicrotask(() => {
      if (!playing.value) getInstance()?.stop();
    });
  };

  if (emblaApi) {
    watch(
      emblaApi,
      (api, _prev, onCleanup) => {
        if (!api) return;
        api.on("autoScroll:play", vetoUnwantedPlay);
        onCleanup(() => api.off("autoScroll:play", vetoUnwantedPlay));
      },
      { immediate: true }
    );
  }

  return { playing, play, stop, toggle };
}
