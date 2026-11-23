import { onBeforeUnmount } from "vue";

/**
 * Marks elements with `is-near` while they are in or close to the viewport.
 *
 * Used by the content-block switchboards so the theme's text-colour fade only
 * runs in blocks that can actually be seen (see `.block:not(.is-near)` in
 * assets/styles/reset.scss for why).
 *
 * Usage: `const trackBlock = useNearViewport()` and `:ref="trackBlock"` on
 * each element (works inside v-for).
 */
export default function useNearViewport(rootMargin = "25% 0px") {
  let observer: IntersectionObserver | null = null;

  const track = (el: unknown) => {
    if (!import.meta.client || !(el instanceof Element)) return;

    observer ??= new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-near", entry.isIntersecting);
        });
      },
      { rootMargin }
    );

    observer.observe(el);
  };

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;
  });

  return track;
}
