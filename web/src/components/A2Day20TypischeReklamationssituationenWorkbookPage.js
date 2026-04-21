import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
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

const lesenQuestions = [
  {
    title: "1) Bewerbung (Job Application)",
    prompt: "Was sind wichtige Punkte, die man in einem Bewerbungsschreiben erwähnen sollte? (One answer is correct)",
    options: [
      "a) Man sollte seine Hobbys erwähnen, weil sie zeigen, dass man vielseitig interessiert ist.",
      "b) Man sollte seine Gehaltsvorstellungen erwähnen, weil das zeigt, dass man weiß, was man wert ist.",
      "c) Man sollte seine Qualifikationen und Erfahrungen erwähnen, weil sie die Eignung für die Stelle zeigen.",
      "d) Man sollte seinen Familienstand erwähnen, weil das zeigt, dass man Verantwortung übernehmen kann.",
    ],
  },
  {
    title: "2) Vorstellungsgespräch",
    prompt: "Wie bereitet man sich auf ein Vorstellungsgespräch vor? (Two answers are correct)",
    options: [
      "a) Man sollte die Firma recherchieren, um gut informiert zu sein.",
      "b) Man sollte den Arbeitsweg üben, um pünktlich zu sein.",
      "c) Man sollte ein schickes Outfit kaufen, um gut auszusehen.",
      "d) Man sollte seine Freunde nach Tipps fragen, weil sie gute Ratschläge geben können.",
    ],
  },
  {
    title: "3) Berufswahl",
    prompt: "Welche Faktoren sollte man bei der Wahl eines Berufs berücksichtigen? (Two answers are correct)",
    options: [
      "a) Die Bezahlung, weil man finanziell abgesichert sein möchte.",
      "b) Die Arbeitszeiten, weil man eine gute Work-Life-Balance haben möchte.",
      "c) Die Berufserfahrung der Eltern, weil sie gute Vorbilder sein können.",
      "d) Die Entfernung zur Arbeit, weil ein kurzer Arbeitsweg angenehmer ist.",
    ],
  },
  {
    title: "4) Frauensachen (Women's Issues)",
    prompt: "Welche Herausforderungen haben Frauen heute im Berufsleben? (Three answers are correct)",
    options: [
      "a) Frauen haben oft geringere Aufstiegschancen. Eine Lösung wäre eine Frauenquote.",
      "b) Frauen verdienen häufig weniger als Männer. Transparente Gehaltsstrukturen könnten helfen.",
      "c) Frauen müssen oft Beruf und Familie vereinbaren. Flexible Arbeitszeiten könnten eine Lösung sein.",
      "d) Frauen werden oft bevorzugt eingestellt. Ein faires Auswahlverfahren könnte das ändern.",
    ],
  },
  {
    title: "5) Damals (Back Then)",
    prompt: "Wie war das Leben vor 50 Jahren im Vergleich zu heute? (Three answers are correct)",
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sprechen");

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

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

      {activeTab === "sprechen" && (
        <section style={sectionStyle}>
          <img
            src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1600&q=80"
            alt="Customer discussing a complaint with store service staff at a counter"
            loading="lazy"
            style={imageStyle}
          />

          <h2 style={{ margin: 0 }}>Teil 1 · Sprechen (Group Practice)</h2>
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

          <div style={questionBoxStyle}>
            <strong>📝 Beispielantwort</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Ich habe einmal online Schuhe bestellt, aber sie waren zu klein. Ich habe den Kundenservice kontaktiert und
              sie haben mir schnell eine neue Größe geschickt. Das war ein guter Service."
            </p>
            <p style={{ margin: 0 }}>
              <strong>Impulsfrage:</strong> Hast du schon einmal etwas reklamieren müssen? Erzähle davon.
            </p>
            <p style={{ margin: 0 }}>
              <strong>Keywords:</strong> Produkt, Problem, Umtausch, Kundendienst.
            </p>
          </div>
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
          </div>
        </section>
      )}

      {activeTab === "lesen" && (
        <section style={sectionStyle}>
          <h2 style={{ margin: 0 }}>Teil 3 · Lesen (Exercise)</h2>
          {lesenQuestions.map((question) => (
            <div key={question.title} style={questionBoxStyle}>
              <strong>{question.title}</strong>
              <p style={{ margin: 0, lineHeight: 1.7 }}>{question.prompt}</p>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                {question.options.map((option) => (
                  <li key={`${question.title}-${option}`}>{option}</li>
                ))}
              </ul>
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
          href="https://www.falowen.app/campus/submit"
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.button, textDecoration: "none", justifySelf: "start" }}
        >
          Open Submission Area
        </a>
      </section>
    </div>
  );
};

export default A2Day20TypischeReklamationssituationenWorkbookPage;
