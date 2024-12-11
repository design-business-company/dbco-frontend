import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function scrollHighlightAnimation(domElements, options = {}) {
  if (!domElements || !domElements.length) {
    console.warn("No elements provided for scroll highlight animation.");
    return;
  }

  const defaultOptions = {
    startOpacity: 0.2,
    endOpacity: 1,
    duration: 1.5,
    scrollStart: "top 50%",
    once: true,
  };

  const config = { ...defaultOptions, ...options };

  Array.from(domElements).forEach((node) => {
    gsap.fromTo(
      node,
      { opacity: config.startOpacity }, // Starting state
      {
        opacity: config.endOpacity,
        duration: config.duration,
        scrollTrigger: {
          trigger: node,
          start: config.scrollStart,
          toggleActions: "play",
          once: config.once,
        },
      }
    );
  });
}
