import React, { useLayoutEffect, useRef } from "react";
import B1Day1TraumweltWorkbookPageLegacy from "./B1Day1TraumweltWorkbookPageLegacy";
import B1EarlyWritingPageCleanup from "./B1EarlyWritingPageCleanup";

const DRIVE_FILE_ID = "1c62CXG6BHBtiGA9FGWLY5Ijj9J59Pa8d";
const YOUTUBE_URL = "https://youtu.be/dZDgNxPWox8";
const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/dZDgNxPWox8?rel=0";

const patchListeningMedia = (root) => {
  if (!root) return;

  const link = root.querySelector(`a[href*="${DRIVE_FILE_ID}"]`);
  if (link) {
    link.href = YOUTUBE_URL;
    link.textContent = "Open Hören video on YouTube";
    const paragraph = link.closest("p");
    if (paragraph?.firstChild?.nodeType === Node.TEXT_NODE) {
      paragraph.firstChild.textContent = "Hören video – ";
    }
  }

  const iframe = root.querySelector(`iframe[src*="${DRIVE_FILE_ID}"]`);
  if (iframe) {
    iframe.src = YOUTUBE_EMBED_URL;
    iframe.title = "Traumwelt Hören video";
    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    );
    iframe.setAttribute("allowfullscreen", "");
    iframe.style.minHeight = "315px";
  }
};

const B1Day1TraumweltWorkbookPage = () => {
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
      <B1Day1TraumweltWorkbookPageLegacy />
      <B1EarlyWritingPageCleanup />
    </div>
  );
};

export default B1Day1TraumweltWorkbookPage;
