(() => {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let frameId = 0;
  let startTime = performance.now();
  let isVisible = !document.hidden;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const revealPage = () => {
    requestAnimationFrame(() => {
      root.classList.add("is-ready");
    });
  };

  const setPointerTarget = (clientX, clientY) => {
    const normalizedX = clientX / window.innerWidth - 0.5;
    const normalizedY = clientY / window.innerHeight - 0.5;

    targetX = clamp(normalizedX * 0.52, -0.26, 0.26);
    targetY = clamp(normalizedY * 0.36, -0.18, 0.18);
  };

  const render = (time) => {
    if (!isVisible) {
      return;
    }

    currentX += (targetX - currentX) * 0.022;
    currentY += (targetY - currentY) * 0.022;

    const elapsed = (time - startTime) / 1000;
    const ambientX = Math.sin(elapsed * 0.09) * 0.14;
    const ambientY = Math.cos(elapsed * 0.068) * 0.095;

    root.style.setProperty("--pointer-x", currentX.toFixed(4));
    root.style.setProperty("--pointer-y", currentY.toFixed(4));
    root.style.setProperty("--ambient-x", ambientX.toFixed(4));
    root.style.setProperty("--ambient-y", ambientY.toFixed(4));

    frameId = requestAnimationFrame(render);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", revealPage, { once: true });
  } else {
    revealPage();
  }

  if (reducedMotion.matches) {
    return;
  }

  if (precisePointer.matches) {
    window.addEventListener("pointermove", (event) => {
      setPointerTarget(event.clientX, event.clientY);
    }, { passive: true });

    window.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
    }, { passive: true });
  }

  document.addEventListener("visibilitychange", () => {
    isVisible = !document.hidden;

    if (!isVisible) {
      cancelAnimationFrame(frameId);
      return;
    }

    startTime = performance.now();
    frameId = requestAnimationFrame(render);
  });

  frameId = requestAnimationFrame(render);
})();
