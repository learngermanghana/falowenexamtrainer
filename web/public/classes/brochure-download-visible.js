(function () {
  let scheduled = false;

  function injectStyles() {
    if (document.getElementById("brochureDownloadVisibleStyles")) return;
    const style = document.createElement("style");
    style.id = "brochureDownloadVisibleStyles";
    style.textContent = `
      #downloadBrochureButton.brochure-download-cta {
        width: 100%;
        min-height: 50px;
        grid-column: 1;
        font-size: 17px;
      }
    `;
    document.head.appendChild(style);
  }

  function getPreferredAnchor() {
    return (
      document.getElementById("classScheduleCta") ||
      document.getElementById("mainSignupCta") ||
      document.querySelector(".class-main-card .class-body") ||
      document.querySelector(".hero-actions")
    );
  }

  function ensureVisibleDownloadButton() {
    injectStyles();
    const anchor = getPreferredAnchor();
    if (!anchor) return;

    let button = document.getElementById("downloadBrochureButton");
    if (!button) {
      button = document.createElement("button");
      button.id = "downloadBrochureButton";
      button.type = "button";
      button.textContent = "Download brochure";
    }

    button.className = "button amber brochure-download-cta";
    button.hidden = false;
    button.style.display = "inline-flex";

    if (anchor.id === "classScheduleCta" || anchor.id === "mainSignupCta") {
      if (anchor.nextElementSibling !== button) {
        anchor.insertAdjacentElement("afterend", button);
      }
      return;
    }

    if (!anchor.contains(button)) anchor.appendChild(button);
  }

  function scheduleEnsure() {
    if (scheduled) return;
    scheduled = true;
    window.setTimeout(() => {
      scheduled = false;
      ensureVisibleDownloadButton();
    }, 0);
  }

  const observer = new MutationObserver(scheduleEnsure);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener("DOMContentLoaded", ensureVisibleDownloadButton);
  window.addEventListener("load", ensureVisibleDownloadButton);
  [100, 350, 800, 1500, 2600, 4000].forEach((delay) =>
    window.setTimeout(ensureVisibleDownloadButton, delay),
  );
})();
