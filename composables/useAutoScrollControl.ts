import { ref } from "vue";
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
 */
export function useAutoScrollControl(getInstance: () => any) {
  const deviceStore = useDeviceStore();

  const playing = ref(false);
  const userStopped = ref(false); // paused via the button
  const userStarted = ref(false); // started via the button (overrides reduced-motion)

  const play = () => {
    const instance = getInstance();
    if (!instance) return;
    if (userStopped.value) return;
    if (deviceStore.userMotionReduced && !userStarted.value) return;

    if (!instance.isPlaying()) instance.play();
    playing.value = true;
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

  return { playing, play, stop, toggle };
}
