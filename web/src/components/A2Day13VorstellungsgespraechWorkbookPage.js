import React, { useLayoutEffect, useRef } from "react";
import A2Day13VorstellungsgespraechWorkbookPageLegacy from "./A2Day13VorstellungsgespraechWorkbookPageLegacy";

const DRIVE_FILE_ID = "1iT-0eKLWmEn_ZNdhQ8qiEWh0Dhn-ql4p";
const OLD_RECOMMENDED_VIDEO_ID = "urKBrX5VAYU";
const YOUTUBE_URL = "https://youtu.be/kr9Rj2j-ghw";
const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/kr9Rj2j-ghw?rel=0";
const EMBED_ATTRIBUTE = "data-a2-day13-hoeren-video";

const patchListeningMedia = (root) => {
  if (!root) return;

  const driveLink = root.querySelector(`a[href*="${DRIVE_FILE_ID}"]`);
  if (driveLink) {
    driveLink.href = YOUTUBE_URL;
    driveLink.textContent = "Open Teil 4 Hören video on YouTube";
    const paragraph = driveLink.closest("p");
    if (paragraph?.firstChild?.nodeType === Node.TEXT_NODE) {
      paragraph.firstChild.textContent = "Hören video: ";
    }

    if (paragraph && !root.querySelector(`[${EMBED_ATTRIBUTE}]`)) {
      const iframe = document.createElement("iframe");
      iframe.setAttribute(EMBED_ATTRIBUTE, "true");
      iframe.src = YOUTUBE_EMBED_URL;
      iframe.title = "A2 Day 13 Vorstellungsgespräch Teil 4 Hören video";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.style.width = "100%";
      iframe.style.minHeight = "315px";
      iframe.style.border = "0";
      iframe.style.borderRadius = "10px";
      paragraph.insertAdjacentElement("afterend", iframe);
    }
  }

  const recommendedLink = root.querySelector(`a[href*="${OLD_RECOMMENDED_VIDEO_ID}"]`);
  const recommendedParagraph = recommendedLink?.closest("p");
  if (recommendedParagraph) recommendedParagraph.remove();

  root.querySelectorAll(`iframe[src*="${OLD_RECOMMENDED_VIDEO_ID}"]`).forEach((iframe) => iframe.remove());
};

const patchWritingPrompt = (root) => {
  if (!root) return;
  root.querySelectorAll("li").forEach((item) => {
    if (item.textContent?.trim() === "Was erwarten Sie?") {
      item.textContent = "Fragen Sie nach den Arbeitszeiten, den Aufgaben oder den Weiterbildungsmöglichkeiten.";
    }
  });
};

const patchDay13Workbook = (root) => {
  patchListeningMedia(root);
  patchWritingPrompt(root);
};

const A2Day13VorstellungsgespraechWorkbookPage = () => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    patchDay13Workbook(root);
    const observer = new MutationObserver(() => patchDay13Workbook(root));
    observer.observe(root, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef}>
      <A2Day13VorstellungsgespraechWorkbookPageLegacy />
    </div>
  );
};

export default A2Day13VorstellungsgespraechWorkbookPage;

export const __TESTING__ = {
  patchListeningMedia,
  patchWritingPrompt,
  patchDay13Workbook,
};
