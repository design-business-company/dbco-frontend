import { onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";

export function useGsapWave(selector) {
  let animations = [];
  let mutationObserver = null;
  let intersectionObservers = [];

  const { createSplitText, clearSplitText } = useSplitText();

  const applyAnimation = (element) => {
    const splitTextInstance = createSplitText(element);

    const animation = gsap.fromTo(
      splitTextInstance.chars,
      { scaleY: 1 },
      {
        scaleY: 2,
        stagger: {
          each: 0.2,
          yoyo: true,
        },
        duration: 0.4,
        repeat: -1,
        yoyo: true,
        ease: "power5.inOut",
        paused: true, // Start paused
      }
    );

    animations.push({ element, animation });
    return animation;
  };

  const pauseAnimation = (element) => {
    const anim = animations.find((a) => a.element === element);
    if (anim) anim.animation.pause();
    console.log("paused");
  };

  const playAnimation = (element) => {
    const anim = animations.find((a) => a.element === element);
    if (anim) anim.animation.play();
    console.log("play");
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
    clearSplitText();
  });
}
