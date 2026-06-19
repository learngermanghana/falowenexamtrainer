import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import SpeakingMindMap from "./SpeakingMindMap";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
  { key: "references", label: "5. Ref" },
];

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 14,
};

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const imageStyle = {
  width: "100%",
  borderRadius: 12,
  maxHeight: 320,
  objectFit: "cover",
};

const infoBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
  background: "#f9fafb",
  display: "grid",
  gap: 8,
};

const questionBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
  background: "#fff",
  display: "grid",
  gap: 8,
};

const miniPresentationCards = [
  {
    title: "Gute Einleitungen",
    phrases: ["Ich möchte kurz über … sprechen.", "Heute geht es um …", "Meiner Meinung nach ist das Thema wichtig, weil …"],
  },
  {
    title: "Verbindungswörter / Connectors",
    phrases: ["und", "oder", "weil", "deshalb"],
  },
  {
    title: "Eigene Meinung ausdrücken",
    phrases: ["Ich finde, dass …", "Ich denke, dass …", "Für mich ist wichtig, dass …"],
  },
  {
    title: "Gute Schlüsse",
    phrases: ["Zum Schluss kann ich sagen, dass …", "Deshalb finde ich …", "Danke fürs Zuhören."],
  },
];

const lesenQuestions = [
  {
    title: "1) Bewerbung (Job Application)",
    prompt:
      "Was sind wichtige Punkte, die man in einem Bewerbungsschreiben erwähnen sollte? Warum sind sie wichtig? (One answer is correct)",
    explanation:
      "In einem Bewerbungsschreiben sollte man seine Qualifikationen und Erfahrungen erwähnen, weil sie die Eignung für die Stelle zeigen. Zusätzlich ist es wichtig, seine Motivation für die Bewerbung darzulegen und persönliche Stärken zu nennen.",
    options: [
      "a) Man sollte seine Hobbys erwähnen, weil sie zeigen, dass man vielseitig interessiert ist.",
      "b) Man sollte seine Gehaltsvorstellungen erwähnen, weil das zeigt, dass man weiß, was man wert ist.",
      "c) Man sollte seine Qualifikationen und Erfahrungen erwähnen, weil sie die Eignung für die Stelle zeigen.",
      "d) Man sollte seinen Familienstand erwähnen, weil das zeigt, dass man Verantwortung übernehmen kann.",
    ],
  },
  {
    title: "2) Vorstellungsgespräch",
    prompt: "Wie bereitet man sich auf ein Vorstellungsgespräch vor? Welche Tipps findest du besonders nützlich? (Two answers are correct)",
    explanation:
      "Man sollte die Firma gründlich recherchieren und häufige Fragen üben. Auch ein passendes Outfit und eine gute Planung des Arbeitswegs helfen, sicher und pünktlich zu sein.",
    options: [
      "a) Man sollte die Firma recherchieren, um gut informiert zu sein.",
      "b) Man sollte den Arbeitsweg üben, um pünktlich zu sein.",
      "c) Man sollte ein schickes Outfit kaufen, um gut auszusehen.",
      "d) Man sollte seine Freunde nach Tipps fragen, weil sie gute Ratschläge geben können.",
    ],
  },
  {
    title: "3) Berufswahl",
    prompt:
      "Welche Faktoren sollte man bei der Wahl eines Berufs berücksichtigen? Warum sind diese Faktoren wichtig? (Two answers are correct)",
    explanation:
      "Wichtige Faktoren sind zum Beispiel die Bezahlung und die Arbeitszeiten. Diese Punkte beeinflussen finanzielle Sicherheit, Work-Life-Balance und die langfristige Zufriedenheit im Beruf.",
    options: [
      "a) Die Bezahlung, weil man finanziell abgesichert sein möchte.",
      "b) Die Arbeitszeiten, weil man eine gute Work-Life-Balance haben möchte.",
      "c) Die Berufserfahrung der Eltern, weil sie gute Vorbilder sein können.",
      "d) Die Entfernung zur Arbeit, weil ein kurzer Arbeitsweg angenehmer ist.",
    ],
  },
  {
    title: "4) Frauensachen (Women's Issues)",
    prompt:
      "Welche Herausforderungen haben Frauen heute im Berufsleben? Nenne konkrete Beispiele und mögliche Lösungen. (Three answers are correct)",
    explanation:
      "Typische Herausforderungen sind geringere Aufstiegschancen, niedrigere Gehälter und die Vereinbarkeit von Beruf und Familie. Lösungen können Frauenquoten, transparente Gehaltsstrukturen und flexible Arbeitszeiten sein.",
    options: [
      "a) Frauen haben oft geringere Aufstiegschancen. Eine Lösung wäre eine Frauenquote.",
      "b) Frauen verdienen häufig weniger als Männer. Transparente Gehaltsstrukturen könnten helfen.",
      "c) Frauen müssen oft Beruf und Familie vereinbaren. Flexible Arbeitszeiten könnten eine Lösung sein.",
      "d) Frauen werden oft bevorzugt eingestellt. Ein faires Auswahlverfahren könnte das ändern.",
    ],
  },
  {
    title: "5) Damals (Back Then)",
    prompt: "Wie war das Leben vor 50 Jahren im Vergleich zu heute? Nenne mindestens drei Unterschiede. (Three answers are correct)",
    explanation:
      "Früher gab es weniger technische Geräte, die Menschen waren oft weniger mobil und die Arbeitszeiten waren häufig länger und härter als heute.",
    options: [
      "a) Es gab weniger technische Geräte im Haushalt.",
      "b) Die Menschen waren weniger mobil und reisten seltener.",
      "c) Es gab mehr Freizeitangebote und Unterhaltungsmöglichkeiten.",
      "d) Die Arbeitszeiten waren länger und härter.",
    ],
  },
];

const hoerenBlocks = [
  {
    title: "Hören 1 · Bewerbung (Job Application)",
    audioLink: "https://drive.google.com/file/d/1BWtDeohvS8Qekv0ZLsexBxqNqFhlwtf3/view?usp=sharing",
    questions: [
      {
        prompt: "1) Was sind wichtige Informationen, die in einem Lebenslauf enthalten sein sollten?",
        options: [
          "a) Die Hobbys des Bewerbers",
          "b) Die beruflichen Qualifikationen und Erfahrungen",
          "c) Die Gehaltsvorstellungen",
          "d) Der Familienstand",
        ],
      },
      {
        prompt: "2) Wie bereitet man sich auf ein Vorstellungsgespräch vor?",
        options: [
          "a) Man übt das Vorstellungsgespräch mit Freunden",
          "b) Man informiert sich über die Firma",
          "c) Man kauft neue Kleidung",
          "d) Man lernt den Arbeitsweg",
        ],
      },
    ],
  },
  {
    title: "Hören 2 · Berufswahl (Career Choice)",
    audioLink: "https://drive.google.com/file/d/1j7PWbKGDh27l0F0A68DNu6swUJYAPRJR/view?usp=sharing",
    questions: [
      {
        prompt: "3) Welche Faktoren sind bei der Wahl eines Berufs wichtig?",
        options: [
          "a) Die Bezahlung",
          "b) Die Arbeitszeiten",
          "c) Die Entfernung zur Arbeit",
          "d) Die Berufserfahrung der Eltern",
        ],
      },
      {
        prompt: "4) Was sind die Vorteile eines Praktikums?",
        options: [
          "a) Man sammelt praktische Erfahrungen",
          "b) Man knüpft Kontakte",
          "c) Man verdient viel Geld",
          "d) Man lernt verschiedene Berufe kennen",
        ],
      },
    ],
  },
  {
    title: "Hören 3 · Frauensachen (Women's Issues)",
    audioLink: "https://drive.google.com/file/d/1EZh08j4vFH4VPfcNPDSv4pWruD9ISg56/view?usp=sharing",
    questions: [
      {
        prompt: "5) Welche Herausforderungen haben Frauen heute im Berufsleben?",
        options: [
          "a) Geringere Aufstiegschancen",
          "b) Höhere Gehälter als Männer",
          "c) Schwierigkeit, Beruf und Familie zu vereinbaren",
          "d) Bevorzugte Einstellungen",
        ],
      },
      {
        prompt: "6) Welche Maßnahmen könnten Frauen im Beruf unterstützen?",
        options: [
          "a) Flexible Arbeitszeiten",
          "b) Frauenquote",
          "c) Transparente Gehaltsstrukturen",
          "d) Strengere Auswahlverfahren",
        ],
      },
    ],
  },
  {
    title: "Hören 4 · Damals (Back Then)",
    audioLink: "https://drive.google.com/file/d/1OfbZTKr9ePe5OqV9GNgE7D3tfoMAPOAD/view?usp=sharing",
    questions: [
      {
        prompt: "7) Wie war das Leben vor 50 Jahren im Vergleich zu heute?",
        options: [
          "a) Es gab weniger technische Geräte im Haushalt",
          "b) Die Menschen reisten häufiger",
          "c) Es gab weniger Freizeitangebote",
          "d) Die Arbeitszeiten waren kürzer",
        ],
      },
      {
        prompt: "8) Welche waren einige der früheren Herausforderungen in Verbindung mit Technologie?",
        options: [
          "a) Sie hatten viele Computer.",
          "b) Sie arbeiteten mehr und hatten weniger Freizeit.",
          "c) Es gab so viele Autos.",
          "d) Sie hatten nicht genug Hausaufgaben zu erledigen.",
        ],
      },
    ],
  },
];

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.secondaryButton,
        borderColor: active ? "#2563eb" : "#d1d5db",
        background: active ? "#eff6ff" : "#fff",
        color: active ? "#1d4ed8" : "#111827",
      }}
    >
      {children}
    </button>
  );
}

const A2Day20TypischeReklamationssituationenWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, margin: 0 }}>A2 · Day 20 Workbook · Typische Reklamationssituationen üben</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 7.20</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          4-part workbook: Sprechen, Schreiben, Lesen und Hören. Complete each Teil and submit your final answers in the
          submission area (not on this page).
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </TabButton>
          ))}
        </div>

        <p style={{ margin: 0, color: "#4b5563" }}>
          Tab {activeIndex + 1} of {tabs.length}
        </p>
      </div>

      <A2B1WorkbookGuidance />

      {activeTab === "sprechen" && (
        <section style={sectionStyle}>
          <img
            src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1600&q=80"
            alt="Customer discussing a complaint with store service staff at a counter"
            loading="lazy"
            style={imageStyle}
          />

          <h2 style={{ margin: 0 }}>Teil 1 · Sprechen (Group Practice)</h2>
          <SpeakingMindMap config={getA2SpeakingMindMap(20)} />
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we&apos;ll engage in group exercises discussing complaints in everyday situations.
          </p>

          <div style={infoBoxStyle}>
            <strong>Zentrales Thema: Reklamieren (Making a Complaint)</strong>
            <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              <li>
                <strong>Gründe für die Reklamation</strong>: falsche Lieferung, defektes Produkt, falsche Größe/Farbe,
                verspätete Lieferung, schlechter Service.
              </li>
              <li>
                <strong>Nützliche Sätze</strong>: „Ich möchte mich beschweren.", „Das Produkt ist kaputt.", „Ich möchte mein
                Geld zurück.", „Könnten Sie das bitte umtauschen?"
              </li>
              <li>
                <strong>Wichtige Unterlagen</strong>: Quittung/Rechnung, Lieferschein, Bestellnummer, Garantieschein.
              </li>
              <li>
                <strong>Mögliche Lösungen</strong>: Umtausch, Reparatur, Erstattung, Gutschein, Preisnachlass.
              </li>
              <li>
                <strong>Reaktion und Service</strong>: Kundendienst kontaktieren, Entschuldigung, klare Anleitung, Bestätigung.
              </li>
              <li>
                <strong>Eigene Erfahrungen</strong>: Hast du schon einmal etwas reklamiert? Was ist passiert?
              </li>
            </ol>
          </div>

          <div style={infoBoxStyle}>
            <strong>Sprechen wie bei einer Mini-Präsentation</strong>
            <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              <li>
                <strong>Einleitung:</strong> Sage kurz, worum es geht.
              </li>
              <li>
                <strong>Hauptteil mit Verbindungswörtern:</strong> Nutze einfache Wörter wie <strong>und</strong>,{" "}
                <strong>oder</strong>, <strong>weil</strong>, <strong>deshalb</strong>.
              </li>
              <li>
                <strong>Beispiel:</strong> Gib eine kurze Situation aus dem Alltag.
              </li>
              <li>
                <strong>Schluss:</strong> Sage deine Meinung oder eine klare Zusammenfassung.
              </li>
            </ol>
          </div>

          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {miniPresentationCards.map((card) => (
              <div key={card.title} style={questionBoxStyle}>
                <strong>{card.title}</strong>
                <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                  {card.phrases.map((phrase) => (
                    <li key={`${card.title}-${phrase}`}>{phrase}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={questionBoxStyle}>
            <strong>📝 Modellantwort (ca. 30–45 Sekunden)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Ich möchte kurz über eine Reklamation sprechen. Letzten Monat habe ich einen Wasserkocher gekauft, aber er war
              nach zwei Tagen kaputt. Ich bin in das Geschäft gegangen und habe die Quittung gezeigt, weil das wichtig war.
              Die Mitarbeiterin war freundlich und hat mir sofort einen neuen Wasserkocher gegeben. Deshalb war ich am Ende
              zufrieden. Zum Schluss kann ich sagen: Guter Service ist sehr wichtig."
            </p>
            <p style={{ margin: 0 }}>
              <strong>Impulsfrage:</strong> Hast du schon einmal etwas reklamieren müssen? Erzähle davon.
            </p>
            <p style={{ margin: 0 }}>
              <strong>Keywords:</strong> Produkt, Problem, Umtausch, Kundendienst.
            </p>
          </div>
          <CourseInlinePracticePanel
            type="speaking"
          />
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={sectionStyle}>
          <h2 style={{ margin: 0 }}>Teil 2 · Schreiben (Formeller Brief)</h2>
          <div style={infoBoxStyle}>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Aufgabe:</strong> Schreiben Sie einen formellen Brief an einen Supermarkt (z. B. „CityMall"), weil ein
              Produkt defekt oder nicht in Ordnung ist.
            </p>
            <p style={{ margin: 0 }}><strong>Berücksichtigen Sie:</strong></p>
            <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              <li>Warum schreiben Sie den Brief?</li>
              <li>Was ist genau das Problem mit dem Produkt?</li>
              <li>Welche Lösung erwarten Sie: Umtausch, Reparatur oder Geld zurück?</li>
            </ol>
          <WorkbookSubmissionReminder />
          </div>
          <CourseInlinePracticePanel
            type="writing"
          />
        </section>
      )}

      {activeTab === "lesen" && (
        <section style={sectionStyle}>
          <h2 style={{ margin: 0 }}>Teil 3 · Lesen (Exercise)</h2>
          {lesenQuestions.map((question) => (
            <div key={question.title} style={questionBoxStyle}>
              <strong>{question.title}</strong>
              <p style={{ margin: 0, lineHeight: 1.7 }}>{question.prompt}</p>
              <p style={{ margin: 0, lineHeight: 1.7, color: "#374151" }}>{question.explanation}</p>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                {question.options.map((option) => (
                  <li key={`${question.title}-${option}`}>{option}</li>
                ))}
              </ul>
            <WorkbookSubmissionReminder />
            </div>
          ))}
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={sectionStyle}>
          <h2 style={{ margin: 0 }}>Teil 4 · Hören (Exercise)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Note: The audio has been uploaded among the files in this chapter. You can also open each link in your browser.
          </p>

          {hoerenBlocks.map((block) => (
            <div key={block.title} style={questionBoxStyle}>
              <strong>{block.title}</strong>
              <a href={block.audioLink} target="_blank" rel="noreferrer">
                Open Audio
              </a>
              {block.questions.map((question) => (
                <div key={`${block.title}-${question.prompt}`} style={{ display: "grid", gap: 6 }}>
                  <p style={{ margin: 0, lineHeight: 1.7 }}>{question.prompt}</p>
                  <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                    {question.options.map((option) => (
                      <li key={`${block.title}-${question.prompt}-${option}`}>{option}</li>
                    ))}
                  </ul>
                </div>
              ))}
            <WorkbookSubmissionReminder />
            </div>
          ))}
        </section>
      )}

      <section
        style={{
          ...styles.card,
          border: "1px solid #bfdbfe",
          background: "#eff6ff",
          display: "grid",
          gap: 10,
        }}
      >
        <h2 style={{ margin: 0 }}>Final Submission</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Submit all answers in the submission area. Do not submit answers directly on this workbook page.
        </p>
        <a
          href="/campus/course?submitWork=1"
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.button, textDecoration: "none", justifySelf: "start" }}
        >
          Open Submission Area
        </a>
      </section>

      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="A2" lesson={{ title: "A2Day20TypischeReklamationssituationen", level: "A2", workbookId: "A2Day20TypischeReklamationssituationen" }} workbookId="A2Day20TypischeReklamationssituationen" />
      )}

    </div>
  );
};

export default A2Day20TypischeReklamationssituationenWorkbookPage;
