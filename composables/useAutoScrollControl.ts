import { computed, onMounted, ref, watch, type Ref } from "vue";
import { useDeviceStore } from "~/stores/device";

/**
 * Single owner of whether an embla AutoScroll carousel is scrolling (WCAG
 * 2.2.2 + prefers-reduced-motion). Components report what happens to them;
 * this decides whether the plugin runs.
 *
 * - `playing` is the user-facing intent and drives <CarouselPauseButton>:
 *   true unless the user paused it, or prefers reduced motion and hasn't
 *   opted in via the button. It does NOT change when the carousel leaves
 *   the viewport or is held for keyboard focus, so the label only changes
 *   on a click (or once on mount for reduced-motion users).
 * - `setInView()` is wired to the in-view Observer; `hold()`/`release()`
 *   pause for keyboard focus. Both are transient and never touch `playing`.
 * - The carousel scrolls only while `playing && inView && !held`.
 * - With `stopOnInteraction: false` the plugin restarts itself after a drag
 *   settles and on mouseleave, knowing none of the above. Those restarts
 *   are cancelled whenever the carousel shouldn't be running, so a paused
 *   carousel that is dragged and thrown glides to a stop and stays paused.
 *   Use `playOnInit: false` and `stopOnInteraction: false` on the plugin so
 *   this stays the only thing deciding.
 * - A restart that arrives mid-drag or mid-throw (the mouse leaving while
 *   the carousel is still gliding) is deferred until the glide finishes,
 *   instead of cutting it off.
 */
export function useAutoScrollControl(
  getInstance: () => any,
  emblaApi: Ref<any>
) {
  const deviceStore = useDeviceStore();

  const userStopped = ref(false); // paused via the button
  const userStarted = ref(false); // started via the button (overrides reduced-motion)
  const inView = ref(false);
  const held = ref(false);

  // Reduced motion is only known on the client. Reading it after mount
  // keeps the server-rendered label and the hydrated one identical.
  const mounted = ref(false);
  onMounted(() => {
    mounted.value = true;
  });

  const playing = computed(() => {
    if (userStopped.value) return false;
    if (mounted.value && deviceStore.userMotionReduced) return userStarted.value;
    return true;
  });

  const shouldRun = () => playing.value && inView.value && !held.value;

  const sync = () => {
    const instance = getInstance();
    // The plugin throws if asked to play before embla has initialised it.
    if (!instance || !emblaApi.value) return;

    if (shouldRun()) {
      // Never start under the pointer: the plugin's hover pause is in
      // force (and it would ignore a drag); its mouseleave restarts it.
      if (!instance.isPlaying() && !hovered()) instance.play();
    } else if (instance.isPlaying()) {
      instance.stop();
    }
  };

  const setInView = (value: boolean) => {
    inView.value = value;
    sync();
  };

  const hold = () => {
    held.value = true;
    sync();
  };

  const release = () => {
    held.value = false;
    sync();
  };

  const toggle = () => {
    const pause = playing.value;
    userStopped.value = pause;
    userStarted.value = !pause;
    sync();
  };

  // True while the user is dragging or a thrown carousel is still gliding
  // to its landing point. Only meaningful while the plugin is stopped (its
  // own scroll body keeps target and location equal).
  // The glide counts as finished a few px short of its target: by then it
  // has slowed below auto-scroll speed, and waiting for a full stop adds a
  // visible dead beat before the hand-off.
  const GLIDE_DONE_PX = 3;

  const midThrow = () => {
    const engine = emblaApi.value?.internalEngine();
    if (!engine) return false;
    return (
      engine.dragHandler.pointerDown() ||
      Math.abs(engine.target.get() - engine.location.get()) > GLIDE_DONE_PX
    );
  };

  // The plugin pauses on hover by itself and restarts on mouseleave, so a
  // deferred restart must not fire under the pointer. Touch has no hover.
  const hovered = () =>
    window.matchMedia("(hover: hover)").matches &&
    !!emblaApi.value?.rootNode().matches(":hover");

  let deferred = false;
  let deferTimer: ReturnType<typeof setTimeout> | undefined;

  const resumeAfterThrow = () => {
    clearTimeout(deferTimer);
    deferTimer = setTimeout(() => {
      if (midThrow()) return resumeAfterThrow();
      deferred = false;
      sync();
    }, 100);
  };

  // Every start goes through here, the plugin's own and ours. The plugin
  // emits autoScroll:play before it marks itself active, so the stop has to
  // wait a microtask (it still lands before the plugin's start timer fires).
  const vetoUnwantedPlay = () => {
    if (shouldRun() && !midThrow()) return;

    if (shouldRun()) {
      deferred = true;
      resumeAfterThrow();
    }

    queueMicrotask(() => {
      if (!shouldRun() || deferred) getInstance()?.stop();
    });
  };

  watch(
    emblaApi,
    (api, _prev, onCleanup) => {
      if (!api) return;

      api.on("autoScroll:play", vetoUnwantedPlay);
      // A resize re-inits embla, which tears the plugin down and (with
      // playOnInit: false) leaves it stopped.
      api.on("reInit", sync);
      onCleanup(() => {
        clearTimeout(deferTimer);
        api.off("autoScroll:play", vetoUnwantedPlay);
        api.off("reInit", sync);
      });

      // Covers an Observer entry that fired before embla was ready.
      sync();
    },
    { immediate: true }
  );

  // Reduced-motion preference resolving or changing after mount.
  watch(playing, sync);

  return { playing, setInView, hold, release, toggle };
}
