import { gsap } from "gsap";
import { useAppStore } from "~/stores/app";

export default function pageTransitionDefault() {
  // view all available vue hooks here:
  // https://vuejs.org/guide/built-ins/transition.html#javascript-hooks

  return {
    name: "page-default",
    mode: "out-in",
    css: false,
    onBeforeEnter: (el) => {
      gsap.set(el, {
        opacity: 0,
        y: "1rem",
      });
    },
    onEnter: (el, done) => {
      const app = useAppStore();

      gsap.to(el, {
        ease: "expo.out",
        duration: 1,
        delay: 0.5,
        opacity: 1,
        y: 0,
        onComplete: () => {
          app.setRouteIsTransitioning(false);
          done();
        },
      });
    },
    onLeave(el, done) {
      gsap.to(el, {
        ease: "Power2.easeIn",
        duration: 0.4,
        opacity: 0,
        y: "1rem",
        onComplete: done,
      });
    },
  };
}
