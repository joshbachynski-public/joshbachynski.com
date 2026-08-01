(function () {
  "use strict";

  const reel = document.querySelector("[data-reel]");
  const playButton = document.querySelector("[data-play-reel]");

  if (reel && playButton) {
    playButton.addEventListener("click", () => {
      const iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/afLeRi9k1hw?start=0&end=76&autoplay=1&rel=0&modestbranding=1";
      iframe.title = "Josh Bachynski on Search with Candour — 76-second excerpt";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      reel.replaceChildren(iframe);
    });
  }

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const target = document.querySelector(button.dataset.copy);
      if (!target) return;
      const original = button.textContent;
      await navigator.clipboard.writeText(target.textContent.trim());
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1800);
    });
  });

  const printButton = document.querySelector("[data-print]");
  if (printButton) printButton.addEventListener("click", () => window.print());
})();
