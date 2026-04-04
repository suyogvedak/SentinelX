import { animate } from "animejs";

export const pulse = (el: HTMLElement) =>
  animate(el, {
    scale: [1, 1.05, 1],
    duration: 900,
    easing: "easeInOutSine",
    loop: true,
  });

export const float = (el: HTMLElement) =>
  animate(el, {
    translateY: [0, -20],
    direction: "alternate",
    easing: "easeInOutSine",
    duration: 3000,
    loop: true,
  });
