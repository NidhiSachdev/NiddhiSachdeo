import gsap from "gsap";

export type CharacterParts = {
  body: SVGGElement;
  leftArm: SVGGElement;
  rightArm: SVGGElement;
  leftLeg: SVGGElement;
  rightLeg: SVGGElement;
  head: SVGGElement;
  shadow: SVGEllipseElement;
};

/**
 * Walk cycle: legs alternate, arms counter-swing, body bobs, shadow squishes.
 * Loops infinitely. Duration ~0.5s per step.
 */
export function createWalkTimeline(parts: CharacterParts): gsap.core.Timeline {
  const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power1.inOut" } });

  tl.to(
    parts.leftLeg,
    { rotation: -22, duration: 0.25 },
    0,
  )
    .to(parts.rightLeg, { rotation: 18, duration: 0.25 }, 0)
    .to(parts.leftArm, { rotation: 20, duration: 0.25 }, 0)
    .to(parts.rightArm, { rotation: -16, duration: 0.25 }, 0)
    .to(parts.body, { y: -3, duration: 0.125 }, 0)
    .to(parts.body, { y: 0, duration: 0.125 }, 0.125)
    .to(parts.head, { rotation: -2, duration: 0.25 }, 0)
    .to(parts.shadow, { attr: { rx: 24 }, opacity: 0.1, duration: 0.25 }, 0)

    .to(parts.leftLeg, { rotation: 18, duration: 0.25 }, 0.25)
    .to(parts.rightLeg, { rotation: -22, duration: 0.25 }, 0.25)
    .to(parts.leftArm, { rotation: -16, duration: 0.25 }, 0.25)
    .to(parts.rightArm, { rotation: 20, duration: 0.25 }, 0.25)
    .to(parts.body, { y: -3, duration: 0.125 }, 0.25)
    .to(parts.body, { y: 0, duration: 0.125 }, 0.375)
    .to(parts.head, { rotation: 2, duration: 0.25 }, 0.25)
    .to(
      parts.shadow,
      { attr: { rx: 28 }, opacity: 0.15, duration: 0.25 },
      0.25,
    );

  return tl;
}

/**
 * Idle: gentle vertical float, subtle arm sway, soft head tilt.
 * Loops infinitely. Duration ~3s.
 */
export function createIdleTimeline(parts: CharacterParts): gsap.core.Timeline {
  const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });

  tl.to(parts.body, { y: -4, duration: 1.5 }, 0)
    .to(parts.head, { y: -2, rotation: 1, duration: 1.5 }, 0)
    .to(parts.leftArm, { rotation: 3, duration: 1.5 }, 0)
    .to(parts.rightArm, { rotation: -3, duration: 1.5 }, 0)
    .to(parts.shadow, { attr: { rx: 26 }, opacity: 0.12, duration: 1.5 }, 0);

  return tl;
}

/**
 * Wave: right arm rises and oscillates. Body tilts slightly. 2 waves then return.
 */
export function createWaveTimeline(parts: CharacterParts): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

  tl.to(parts.rightArm, { rotation: -70, duration: 0.4 }, 0)
    .to(parts.body, { rotation: -3, duration: 0.3 }, 0)
    .to(parts.head, { rotation: 5, duration: 0.3 }, 0)
    .to(parts.rightArm, { rotation: -50, duration: 0.2 }, 0.4)
    .to(parts.rightArm, { rotation: -70, duration: 0.2 }, 0.6)
    .to(parts.rightArm, { rotation: -50, duration: 0.2 }, 0.8)
    .to(parts.rightArm, { rotation: -70, duration: 0.2 }, 1.0)
    .to(parts.rightArm, { rotation: 0, duration: 0.4, ease: "elastic.out(1,0.5)" }, 1.2)
    .to(parts.body, { rotation: 0, duration: 0.3 }, 1.2)
    .to(parts.head, { rotation: 0, duration: 0.3 }, 1.2);

  return tl;
}

/**
 * Talk: subtle scale pulse on body, head bobs, arms gently sway.
 * Loops infinitely.
 */
export function createTalkTimeline(parts: CharacterParts): gsap.core.Timeline {
  const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });

  tl.to(parts.body, { scaleX: 1.01, scaleY: 1.01, y: -2, duration: 0.8 }, 0)
    .to(parts.head, { y: -3, rotation: 1.5, duration: 0.6 }, 0)
    .to(parts.leftArm, { rotation: 5, duration: 0.8 }, 0)
    .to(parts.rightArm, { rotation: -5, duration: 0.8 }, 0)
    .to(
      parts.shadow,
      { attr: { rx: 26 }, opacity: 0.12, duration: 0.8 },
      0,
    );

  return tl;
}

/**
 * Dance easter egg: playful bouncy sequence. Plays once.
 */
export function createDanceTimeline(parts: CharacterParts): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

  // Bounce left
  tl.to(parts.body, { x: -6, rotation: -8, y: -6, duration: 0.2 }, 0)
    .to(parts.leftArm, { rotation: 40, duration: 0.2 }, 0)
    .to(parts.rightArm, { rotation: -60, duration: 0.2 }, 0)
    .to(parts.leftLeg, { rotation: 15, duration: 0.2 }, 0)
    .to(parts.rightLeg, { rotation: -10, duration: 0.2 }, 0)
    .to(parts.head, { rotation: -6, y: -4, duration: 0.2 }, 0)

    // Bounce right
    .to(parts.body, { x: 6, rotation: 8, y: -8, duration: 0.2 }, 0.2)
    .to(parts.leftArm, { rotation: -60, duration: 0.2 }, 0.2)
    .to(parts.rightArm, { rotation: 40, duration: 0.2 }, 0.2)
    .to(parts.leftLeg, { rotation: -10, duration: 0.2 }, 0.2)
    .to(parts.rightLeg, { rotation: 15, duration: 0.2 }, 0.2)
    .to(parts.head, { rotation: 6, y: -4, duration: 0.2 }, 0.2)

    // Bounce center (jump)
    .to(parts.body, { x: 0, rotation: 0, y: -14, duration: 0.2 }, 0.4)
    .to(parts.leftArm, { rotation: -80, duration: 0.2 }, 0.4)
    .to(parts.rightArm, { rotation: 80, duration: 0.2 }, 0.4)
    .to(parts.leftLeg, { rotation: -25, duration: 0.2 }, 0.4)
    .to(parts.rightLeg, { rotation: 25, duration: 0.2 }, 0.4)
    .to(parts.head, { rotation: 0, y: -8, duration: 0.2 }, 0.4)
    .to(parts.shadow, { attr: { rx: 16 }, opacity: 0.05, duration: 0.2 }, 0.4)

    // Land
    .to(parts.body, { y: 0, duration: 0.25, ease: "bounce.out" }, 0.6)
    .to(parts.leftArm, { rotation: 0, duration: 0.3, ease: "elastic.out(1,0.4)" }, 0.6)
    .to(parts.rightArm, { rotation: 0, duration: 0.3, ease: "elastic.out(1,0.4)" }, 0.6)
    .to(parts.leftLeg, { rotation: 0, duration: 0.25, ease: "bounce.out" }, 0.6)
    .to(parts.rightLeg, { rotation: 0, duration: 0.25, ease: "bounce.out" }, 0.6)
    .to(parts.head, { y: 0, duration: 0.25, ease: "bounce.out" }, 0.6)
    .to(
      parts.shadow,
      { attr: { rx: 28 }, opacity: 0.15, duration: 0.25, ease: "bounce.out" },
      0.6,
    );

  return tl;
}
