import React, { useEffect, useLayoutEffect } from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";
import {
  getWritingVideoResource,
  getYouTubeEmbedUrl,
} from "../data/writingVideoResources";

const WRITING_VIDEO_ATTRIBUTE = "data-b1-day21-writing-video";

const Day21WritingVideoInjector = () => {
  useEffect(() => {
    const resource = getWritingVideoResource("B1", 21);
    const embedUrl = getYouTubeEmbedUrl(resource?.url);
    if (!resource || !embedUrl) return undefined;

    const root = document.getElementById("root") || document.body;

    const mountVideo = () => {
      const existing = root.querySelector(`[${WRITING_VIDEO_ATTRIBUTE}]`);
      const writingSection = Array.from(root.querySelectorAll("section")).find((section) => {
        const heading = String(section.querySelector("h2")?.textContent || "").toLowerCase();
        return heading.includes("teil 2") && heading.includes("schreiben");
      });

      if (!writingSection) {
        existing?.remove();
        return false;
      }

      if (existing && writingSection.contains(existing)) return true;
      existing?.remove();

      const card = document.createElement("div");
      card.setAttribute(WRITING_VIDEO_ATTRIBUTE, "true");
      card.setAttribute("aria-label", "B1 Day 21 writing explanation video");
      Object.assign(card.style, {
        display: "grid",
        gap: "12px",
        border: "1px solid #bfdbfe",
        borderRadius: "16px",
        padding: "14px",
        background: "#eff6ff",
      });

      const badge = document.createElement("span");
      badge.textContent = "Writing Video · Essay Ideas";
      Object.assign(badge.style, {
        width: "fit-content",
        borderRadius: "999px",
        padding: "5px 10px",
        background: "#dbeafe",
        color: "#1e3a8a",
        fontSize: ".82rem",
        fontWeight: "800",
      });
      card.appendChild(badge);

      const heading = document.createElement("h3");
      heading.textContent = resource.title;
      Object.assign(heading.style, { margin: "0", color: "#1e3a8a" });
      card.appendChild(heading);

      const description = document.createElement("p");
      description.textContent = resource.description;
      Object.assign(description.style, {
        margin: "0",
        color: "#475569",
        lineHeight: "1.7",
      });
      card.appendChild(description);

      const frameWrap = document.createElement("div");
      Object.assign(frameWrap.style, {
        position: "relative",
        width: "100%",
        paddingTop: "56.25%",
        borderRadius: "14px",
        overflow: "hidden",
        background: "#0f172a",
      });

      const iframe = document.createElement("iframe");
      iframe.title = resource.title;
      iframe.src = embedUrl;
      iframe.loading = "lazy";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      Object.assign(iframe.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        border: "0",
      });
      frameWrap.appendChild(iframe);
      card.appendChild(frameWrap);

      const anchor = writingSection.querySelector('[data-course-inline-practice="writing"]');
      if (anchor) writingSection.insertBefore(card, anchor);
      else writingSection.appendChild(card);
      return true;
    };

    mountVideo();
    const observer = new MutationObserver(mountVideo);
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      root.querySelector(`[${WRITING_VIDEO_ATTRIBUTE}]`)?.remove();
    };
  }, []);

  return null;
};

const Day21NoListeningTabGuard = () => {
  useLayoutEffect(() => {
    const root = document.querySelector('[data-b1-day21-no-listening="true"]');
    if (!root) return undefined;

    const hideTeil4Tab = () => {
      const tab = root.querySelector('[role="tab"][aria-label="Teil 4"]');
      if (!tab) return;
      tab.hidden = true;
      tab.setAttribute("aria-hidden", "true");
      tab.tabIndex = -1;
    };

    hideTeil4Tab();
    const observer = new MutationObserver(hideTeil4Tab);
    observer.observe(root, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
};

export const B1_DAY21_HAS_TEIL4 = false;

const config = {
  day: 21,
  chapter: "7.21",
  assignmentKey: "B1-7.21",
  workbookId: "B1Day21LebensformenHeute",
  title: "Lebensformen heute",
  subtitle: "This workbook contains Teil 1, Teil 2 and Teil 3 only. There is no Teil 4 for this lesson.",
  heroImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "People discussing modern living arrangements",
  speaking: {
    question: "Welche Lebensform findest du am besten – Familie, Wohngemeinschaft oder Singleleben? Warum?",
    instructions: "Beschreibe mehrere Lebensformen, nenne Vor- und Nachteile und erkläre, welche Lebensform gut oder nicht gut zu dir passt.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Friends discussing family, shared flats and single life",
    ideaTitle: "Brain Map: Lebensformen heute",
    ideaIntro: "Use these notes as an idea bank. You do not need to answer every point separately.",
    ideaGroups: [
      { title: "Familie", items: ["Traditionelle Familie", "Alleinerziehende Eltern", "Patchworkfamilien", "Rollenverteilung", "Nähe und Unterstützung"] },
      { title: "Wohngemeinschaft (WG)", items: ["Studenten-WG", "Kosten teilen", "Gemeinschaft", "Privatsphäre", "Konflikte und Organisation"] },
      { title: "Singleleben", items: ["Unabhängigkeit", "Selbstverwirklichung", "Flexible Lebensgestaltung", "Allein entscheiden", "Mögliche Einsamkeit"] },
      { title: "Neue Lebensformen", items: ["Fernbeziehungen", "Wohnen auf Zeit", "Co-Parenting", "Gleichgeschlechtliche Partnerschaften", "Mehrgenerationenwohnen"] },
    ],
    discussionQuestions: [
      "Was ist dir wichtiger: Freiheit, Nähe, Sicherheit oder niedrige Kosten?",
      "Welche Lebensform ist in deinem Heimatland besonders verbreitet?",
      "Welche Probleme können beim Zusammenleben entstehen?",
      "Kann sich die passende Lebensform im Laufe des Lebens verändern?",
    ],
    answerStructure: [
      "Einleitung: Heute gibt es viele verschiedene Lebensformen.",
      "Familie, WG und Singleleben kurz beschreiben.",
      "Vor- und Nachteile miteinander vergleichen.",
      "Die Situation im Heimatland oder ein persönliches Beispiel nennen.",
      "Die eigene Entscheidung begründen und zusammenfassen.",
    ],
    usefulPhrases: [
      "Meiner Meinung nach …",
      "Einerseits …, andererseits …",
      "Ein Vorteil/Nachteil ist, dass …",
      "Für mich passt … am besten, weil …",
      "Obwohl …, finde ich …",
    ],
  },
  writing: getB1WritingTask(21),
  reading: getB1ReadingTask(21),
  submitListening: false,
  submitTitle: "Submit Teil 2 and Teil 3.",
  submitNote: "Teil 1 is group practice. There is no Teil 4 in this workbook.",
  submitInstructions: "Paste your final 80–100 word opinion text and your five reading answer letters into the form below.",
  submitWritingDescription: "Paste your final 80–100 word opinion text.",
  submitReadingDescription: "Paste your five reading answer letters.",
};

export default function B1Day21LebensformenHeuteWorkbookPage() {
  return (
    <div data-b1-day21-no-listening="true">
      <style>{`
        [data-b1-day21-no-listening="true"] [role="tab"][aria-label="Teil 4"] {
          display: none !important;
        }
        [data-b1-day21-no-listening="true"] [data-workbook-tab-navigation] > p {
          display: none !important;
        }
      `}</style>
      <div
        data-b1-day21-no-teil4-notice="true"
        role="note"
        style={{
          width: "min(calc(100% - 24px), 960px)",
          margin: "12px auto 0",
          border: "1px solid #f59e0b",
          borderRadius: 14,
          padding: 12,
          background: "#fffbeb",
          color: "#92400e",
          fontWeight: 800,
          lineHeight: 1.55,
          boxSizing: "border-box",
        }}
      >
        This workbook has Teil 1 · Sprechen, Teil 2 · Schreiben and Teil 3 · Lesen. There is no Teil 4 · Hören for this lesson.
      </div>
      <B1StandardWorkbookPage config={config} />
      <Day21NoListeningTabGuard />
      <Day21WritingVideoInjector />
    </div>
  );
}
