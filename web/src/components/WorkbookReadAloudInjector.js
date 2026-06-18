import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import ReadAloudControls from "./ReadAloudControls";
import "./A2B1WorkbookGuidance.css";

const READ_ALOUD_MOUNT_CLASS = "falowen-read-aloud-mount";

const normalizeText = (value = "") =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim();

const isVisible = (element) => {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
};

const looksLikeReadingHeading = (text = "") => {
  const value = normalizeText(text).toLowerCase();
  return value.includes("teil 3") && (value.includes("lesen") || value.includes("reading"));
};

const findCardContainer = (heading) => {
  let node = heading?.parentElement;
  while (node && node !== document.body) {
    const hasEnoughContent = node.querySelectorAll("p, h3, strong").length >= 2;
    const cardLike = node.getAttribute("style")?.includes("grid") || node.getAttribute("style")?.includes("gap");
    if (hasEnoughContent && cardLike) return node;
    node = node.parentElement;
  }
  return heading?.parentElement || null;
};

const collectReadingText = (card) => {
  if (!card) return "";

  const contentNodes = Array.from(card.querySelectorAll("h3, p"));
  const parts = [];
  let started = false;

  for (const node of contentNodes) {
    const text = normalizeText(node.textContent || "");
    if (!text) continue;

    const lower = text.toLowerCase();
    if (lower.includes("teil 3") && lower.includes("lesen")) continue;
    if (lower.includes("read the text") || lower.includes("do not answer directly")) continue;
    if (lower.includes("fragen") || lower.includes("mögliche antworten") || lower.includes("possible answers")) break;
    if (lower.includes("reminder:") || lower.includes("submit your final")) break;

    if (node.tagName === "H3") {
      started = true;
      parts.push(text);
      continue;
    }

    if (started || text.length > 80) {
      parts.push(text);
      started = true;
    }
  }

  return parts.join(". ");
};

const mountReadAloud = (card) => {
  if (!card || card.querySelector(`.${READ_ALOUD_MOUNT_CLASS}`)) return null;
  const readingText = collectReadingText(card);
  if (!readingText || readingText.length < 40) return null;

  const mount = document.createElement("div");
  mount.className = READ_ALOUD_MOUNT_CLASS;
  mount.style.margin = "8px 0";

  const image = card.querySelector("img");
  if (image?.nextSibling) {
    image.parentNode.insertBefore(mount, image.nextSibling);
  } else {
    card.insertBefore(mount, card.firstChild);
  }

  const root = createRoot(mount);
  root.render(
    <>
      <p className="workbook-read-aloud-note">
        <strong>Read aloud:</strong> Use the free German voice controls to listen to the text, pause, continue, stop and change speed.
      </p>
      <ReadAloudControls
        title="Read Teil 3 text aloud"
        compact
        getText={() => collectReadingText(card)}
      />
    </>
  );

  return { mount, root };
};

const WorkbookReadAloudInjector = () => {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const mounted = new Map();

    const scan = () => {
      const headings = Array.from(document.querySelectorAll("h2, h3"));
      headings.forEach((heading) => {
        if (!looksLikeReadingHeading(heading.textContent || "")) return;
        if (!isVisible(heading)) return;
        const card = findCardContainer(heading);
        if (!card || mounted.has(card)) return;
        const instance = mountReadAloud(card);
        if (instance) mounted.set(card, instance);
      });
    };

    const observer = new MutationObserver(() => window.requestAnimationFrame(scan));
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class"] });
    const interval = window.setInterval(scan, 1000);
    scan();

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
      mounted.forEach(({ root, mount }) => {
        root.unmount();
        mount.remove();
      });
      mounted.clear();
    };
  }, []);

  return null;
};

export default WorkbookReadAloudInjector;
