import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function scrollFadeOnEnter(domElements, options = {}) {
  const defaultOptions = {
    startOpacity: 0,
    endOpacity: 1,
    fadeOutOpacity: 0,
    duration: 1,
    ease: "power2.easeOut",
    scrollStart: "top 100%",
    scrollEnd: "bottom 0%",
    once: false,
  };

  const config = { ...defaultOptions, ...options };

  Array.from(domElements).forEach((node) => {
    gsap.fromTo(
      node,
      { opacity: config.startOpacity },
      {
        opacity: config.endOpacity,
        duration: config.duration,
        ease: config.ease,
        scrollTrigger: {
          trigger: node,
          start: config.scrollStart,
          end: config.scrollEnd,
          toggleActions: "play reverse play reverse",
          onEnter: () => {
            // Fade-in animation
            gsap.to(node, {
              opacity: config.endOpacity,
              duration: config.duration,
            });
          },
          onLeave: () => {
            // Fade-out animation
            gsap.to(node, {
              opacity: config.fadeOutOpacity,
              duration: config.duration,
            });
          },
          onEnterBack: () => {
            // Fade-in when scrolling back up
            gsap.to(node, {
              opacity: config.endOpacity,
              duration: config.duration,
            });
          },
          onLeaveBack: () => {
            // Fade-out when scrolling out backwards
            gsap.to(node, {
              opacity: config.fadeOutOpacity,
              duration: config.duration,
            });
          },
          once: config.once, // Trigger only once if true
        },
      }
    );
  });
}
