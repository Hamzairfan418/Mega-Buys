(() => {
  "use strict";

  const revealPage = () => {
    requestAnimationFrame(() => {
      document.documentElement.classList.add("is-ready");
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", revealPage, { once: true });
  } else {
    revealPage();
  }
})();
