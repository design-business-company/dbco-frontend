import { onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";

export function useGsapPulse(selector) {
  let animations = [];
  let mutationObserver = null;
  let intersectionObservers = [];

  const applyAnimation = (element) => {
    const animation = gsap.to(element, {
      opacity: 0.5,
      repeat: -1,
      yoyo: true,
      duration: 1,
      background: "yellow",
      ease: "power1.inOut",
      paused: true, // Start paused
    });

    animations.push({ element, animation });
    return animation;
  };

  const pauseAnimation = (element) => {
    const anim = animations.find((a) => a.element === element);
    if (anim) anim.animation.pause();
  };

  const playAnimation = (element) => {
    const anim = animations.find((a) => a.element === element);
    if (anim) anim.animation.play();
  };

  const setupIntersectionObserver = (element) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playAnimation(entry.target);
          } else {
            pauseAnimation(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    intersectionObservers.push(observer);
  };

  onMounted(() => {
    const elements = document.querySelectorAll(selector);
    if (elements.length) {
      elements.forEach((element) => {
        applyAnimation(element);
        setupIntersectionObserver(element);
      });
    } else {
      mutationObserver = new MutationObserver(() => {
        const elements = document.querySelectorAll(selector);
        if (elements.length) {
          elements.forEach((element) => {
            applyAnimation(element);
            setupIntersectionObserver(element);
          });
          mutationObserver.disconnect();
        }
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  });

  onUnmounted(() => {
    animations.forEach(({ animation }) => animation.kill());
    intersectionObservers.forEach((observer) => observer.disconnect());
    if (mutationObserver) {
      mutationObserver.disconnect();
    }
  });
}
