/**
 * media-chrome (inside @mux/mux-player) logs
 * "Media Chrome: No style sheet found on style tag of …"
 * whenever its elements handle attributes while not yet connected to the
 * document. Vue always sets attributes before inserting an element, so every
 * client-side navigation to a page with videos emits a burst of these.
 *
 * The condition is benign — media-chrome falls back to a no-op and restyles
 * once connected — and it still exists in the latest media-chrome (4.19.x),
 * so we filter this one exact message. Remove if upstream ever stops warning.
 */
export default defineNuxtPlugin(() => {
  const warn = console.warn.bind(console);

  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].startsWith("Media Chrome: No style sheet found")
    ) {
      return;
    }

    warn(...args);
  };
});
