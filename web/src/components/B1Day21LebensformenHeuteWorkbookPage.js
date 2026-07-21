import React, { useEffect } from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
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
  writing: {
    title: "Welche Lebensform ist heute am besten – Familie, Wohngemeinschaft oder Singleleben?",
    instructions: "Reagieren Sie auf Maras Meinung. Vergleichen Sie die Lebensformen, nennen Sie Vor- und Nachteile und begründen Sie Ihre eigene Meinung.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Student writing an opinion about modern living arrangements",
    sourceTitle: "Meinung von Mara",
    sourceText: "Heute gibt es viele verschiedene Lebensformen, und jede hat ihre Vorteile. Ich finde, dass die beste Lebensform von der persönlichen Situation abhängt. In einer Familie hat man oft viel Unterstützung und Nähe. In einer Wohngemeinschaft lebt man mit anderen zusammen und kann Kosten teilen. Das Singleleben bietet dagegen viel Freiheit und Unabhängigkeit. Dennoch kann es manchmal auch einsam sein. Ich denke, dass jeder selbst entscheiden sollte, welche Lebensform am besten zu ihm passt. Was denken Sie darüber?",
    taskPoints: [
      "Fassen Sie Maras Meinung kurz zusammen.",
      "Vergleichen Sie Familie, WG und Singleleben.",
      "Nennen Sie mindestens einen Vorteil und einen Nachteil.",
      "Geben Sie ein persönliches Beispiel oder beschreiben Sie die Situation in Ihrem Heimatland.",
      "Formulieren Sie einen klaren Schluss.",
    ],
    supportStructure: ["Einleitung zum Thema", "Reaktion auf Maras Meinung", "Vergleich mit Gründen und Beispiel", "Eigene Meinung", "Kurzer Schluss"],
    vocabulary: ["zusammenleben", "Kosten teilen", "unabhängig sein", "Unterstützung bekommen", "Privatsphäre haben", "sich einsam fühlen"],
  },
  reading: {
    title: "Lesen Sie den Text und beantworten Sie alle fünf Fragen.",
    instructions: "Read the complete text first. Then choose one answer, A–D, for every question.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Reading about a family living in different places",
    text: {
      title: "Andrea Müller: Familie an verschiedenen Orten",
      paragraphs: [
        "Mein Name ist Andrea Müller und meine Familie lebt nicht gemeinsam an einem Ort, sondern ist über mehrere Bundesländer innerhalb Deutschlands verstreut. Ursprünglich komme ich aus Nordrhein-Westfalen und habe in Köln studiert. Nach Abschluss des Studiums fand ich jedoch nicht gleich eine Arbeit, die mir zusagte, und so entschied ich mich, zunächst einmal ins Ausland zu gehen und Erfahrungen zu sammeln.",
        "Ich lebte zwei Jahre lang in den Niederlanden, wo es mir sehr gut gefiel und ich sowohl meine Englischkenntnisse verbessern als auch die niederländische Sprache als neue Fremdsprache hinzulernen konnte. Mit dieser internationalen Berufserfahrung und den erweiterten Sprachkenntnissen fand ich eine Anstellung in Hessen.",
        "Dort lernte ich auch meinen Mann kennen, der ursprünglich aus Bayern stammt. Wir heirateten und bekamen zwei Söhne. In Hessen haben wir uns inzwischen einen größeren Kreis an Freunden und Bekannten aufgebaut, unsere Familien leben jedoch noch immer größtenteils in Nordrhein-Westfalen und Bayern. Hinzu kommt, dass meine fünf Geschwister ebenfalls nicht in Nordrhein-Westfalen sesshaft geworden sind, sondern über die gesamte Bundesrepublik Deutschland verstreut leben.",
        "Nur bei größeren Familienfesten und Geburtstagen sehen wir uns alle. Ich würde sehr gern in der Nähe meiner Eltern leben, da diese mittlerweile auch ziemlich alt sind und sicherlich bald Unterstützung benötigen. Auch unsere Kinder vermissen die Großeltern und Verwandten oft.",
        "Unsere mittelfristige Perspektive ist es daher, für meinen Mann und mich in der nächsten Zeit Arbeitsstellen und ein Haus in Nordrhein-Westfalen zu finden.",
      ],
      questions: [
        { stem: "Warum ging Frau Müller ins Ausland?", options: ["A) Sie wollte Urlaub machen.", "B) Sie wollte Auslandserfahrung sammeln.", "C) Sie wollte ihre Eltern besuchen.", "D) Sie wollte einen Mann kennenlernen."] },
        { stem: "In welchem Land sammelte Frau Müller Auslandserfahrungen?", options: ["A) Niederlande", "B) Hessen", "C) Nordrhein-Westfalen", "D) Österreich"] },
        { stem: "Hat Frau Müller Kinder?", options: ["A) Ja, einen Sohn und eine Tochter.", "B) Nein.", "C) Ja, einen Sohn.", "D) Ja, zwei Söhne."] },
        { stem: "Hat Frau Müller Geschwister?", options: ["A) Nein.", "B) Ja, zwei Brüder.", "C) Das steht nicht im Text.", "D) Ja, fünf Geschwister."] },
        { stem: "Warum möchte Frau Müller wieder nach Nordrhein-Westfalen umziehen?", options: ["A) Weil ihr Mann aus Nordrhein-Westfalen ist.", "B) Weil sie arbeitslos ist.", "C) Weil ihre Eltern dort wohnen.", "D) Weil ihre Geschwister dort wohnen."] },
      ],
    },
  },
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
      <Day21WritingVideoInjector />
    </div>
  );
}
