import React, { useLayoutEffect, useRef } from "react";
import A2Day12MeinTraumberufWorkbookPageLegacy from "./A2Day12MeinTraumberufWorkbookPageLegacy";

// Navigation is rendered directly inside the workbook component, matching the working A2 Day 1 structure.
const DRIVE_FILE_ID = "1XqRF0mQZs6UFpPHjEaX7fp7XRS652onL";
const OLD_RECOMMENDED_VIDEO_ID = "w81bsmssGXQ";
const YOUTUBE_URL = "https://youtu.be/VGzHSjn3O-A";
const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/VGzHSjn3O-A?rel=0";
const EMBED_ATTRIBUTE = "data-a2-day12-hoeren-video";

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

    if (!root.querySelector(`[${EMBED_ATTRIBUTE}]`)) {
      const iframe = document.createElement("iframe");
      iframe.setAttribute(EMBED_ATTRIBUTE, "true");
      iframe.src = YOUTUBE_EMBED_URL;
      iframe.title = "A2 Day 12 Mein Traumberuf Teil 4 Hören video";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.style.width = "100%";
      iframe.style.minHeight = "315px";
      iframe.style.border = "0";
      iframe.style.borderRadius = "10px";
      paragraph.insertAdjacentElement("afterend", iframe);
    }
  }

  const oldRecommendedLink = root.querySelector(`a[href*="${OLD_RECOMMENDED_VIDEO_ID}"]`);
  const oldRecommendedParagraph = oldRecommendedLink?.closest("p");
  if (oldRecommendedParagraph) oldRecommendedParagraph.remove();

  root.querySelectorAll(`iframe[src*="${OLD_RECOMMENDED_VIDEO_ID}"]`).forEach((iframe) => iframe.remove());
};

const A2Day12MeinTraumberufWorkbookPage = () => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    patchListeningMedia(root);
    const observer = new MutationObserver(() => patchListeningMedia(root));
    observer.observe(root, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef}>
      <A2Day12MeinTraumberufWorkbookPageLegacy />
    </div>
  );
};

export default A2Day12MeinTraumberufWorkbookPage;