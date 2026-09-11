import React, { useLayoutEffect, useRef } from "react";
import A2Day13VorstellungsgespraechWorkbookPageLegacy from "./A2Day13VorstellungsgespraechWorkbookPageLegacy";

const DRIVE_FILE_ID = "1iT-0eKLWmEn_ZNdhQ8qiEWh0Dhn-ql4p";
const OLD_RECOMMENDED_VIDEO_ID = "urKBrX5VAYU";
const YOUTUBE_URL = "https://youtu.be/kr9Rj2j-ghw";
const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/kr9Rj2j-ghw?rel=0";
const EMBED_ATTRIBUTE = "data-a2-day13-hoeren-video";

const DAY13_READING_TITLE = "Tipps für ein erfolgreiches Vorstellungsgespräch";
const DAY13_READING_TEXT = "Vor einem Vorstellungsgespräch sollte man sich gut über das Unternehmen informieren. Am Tag des Gesprächs ist es wichtig, pünktlich zu sein und passende Kleidung zu tragen. Zu Beginn begrüßt man die Gesprächspartner freundlich und stellt sich kurz vor. Im Gespräch sollte man klar über seine Erfahrungen, Stärken und beruflichen Ziele sprechen. Es ist auch sinnvoll, eigene Fragen zu den Aufgaben, Arbeitszeiten oder Weiterbildungsmöglichkeiten zu stellen. Nach dem Gespräch kann man sich mit einer kurzen E-Mail bedanken.";
const DAY13_READING_QUESTIONS = [
  {
    stem: "Was sollte man vor dem Vorstellungsgespräch machen?",
    options: ["A) Sich über das Unternehmen informieren", "B) Einen Urlaub buchen", "C) Neue Möbel kaufen", "D) Das Gespräch absagen"],
  },
  {
    stem: "Was ist am Tag des Gesprächs wichtig?",
    options: ["A) Zu spät kommen", "B) Pünktlich sein und passende Kleidung tragen", "C) Nur zuhören", "D) Keine Fragen stellen"],
  },
  {
    stem: "Worüber sollte man im Gespräch sprechen?",
    options: ["A) Nur über Hobbys", "B) Über Erfahrungen, Stärken und berufliche Ziele", "C) Über das Wetter", "D) Über private Probleme"],
  },
  {
    stem: "Welche Fragen kann man dem Arbeitgeber stellen?",
    options: ["A) Fragen zu Aufgaben, Arbeitszeiten oder Weiterbildung", "B) Nur Fragen zum Urlaub", "C) Keine eigenen Fragen", "D) Fragen über andere Bewerber"],
  },
  {
    stem: "Was kann man nach dem Gespräch tun?",
    options: ["A) Eine kurze Dankes-E-Mail schicken", "B) Sofort kündigen", "C) Nicht mehr reagieren", "D) Eine Beschwerde schreiben"],
  },
];

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

const patchReadingContent = (root) => {
  if (!root) return;

  const readingHeading = Array.from(root.querySelectorAll("h3")).find((heading) =>
    heading.textContent?.includes("Kinderbetreuung in Deutschland"),
  );
  if (!readingHeading) return;

  readingHeading.textContent = DAY13_READING_TITLE;
  const readingText = readingHeading.nextElementSibling;
  if (readingText?.tagName === "P") readingText.textContent = DAY13_READING_TEXT;

  const questionsHeading = readingText?.nextElementSibling;
  if (!questionsHeading || questionsHeading.tagName !== "H3") return;

  let questionCard = questionsHeading.nextElementSibling;
  DAY13_READING_QUESTIONS.forEach((question, index) => {
    if (!questionCard) return;
    const nextCard = questionCard.nextElementSibling;
    const strong = questionCard.querySelector("strong");
    if (strong) strong.textContent = `${index + 1}. ${question.stem}`;
    const optionNodes = Array.from(questionCard.querySelectorAll("span"));
    question.options.forEach((option, optionIndex) => {
      if (optionNodes[optionIndex]) optionNodes[optionIndex].textContent = option;
    });
    optionNodes.slice(question.options.length).forEach((node) => node.remove());
    questionCard = nextCard;
  });

  while (questionCard?.querySelector?.("strong")) {
    const nextCard = questionCard.nextElementSibling;
    questionCard.remove();
    questionCard = nextCard;
  }
};

const patchDay13Workbook = (root) => {
  patchListeningMedia(root);
  patchWritingPrompt(root);
  patchReadingContent(root);
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
  patchReadingContent,
  patchDay13Workbook,
};
