import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import SpeakingMindMap from "./SpeakingMindMap";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";

const tabs = [
  { key: "sprechen", label: "Teil 1" },
  { key: "schreiben", label: "Teil 2" },
  { key: "lesen", label: "Teil 3" },
  { key: "hoeren", label: "Teil 4" },
  { key: "references", label: "Ref" },
  { key: "submit", label: "Submit" },
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
    phrases: [
      "Ich möchte kurz über … sprechen.",
      "Heute geht es um …",
      "Meiner Meinung nach ist das Thema wichtig, weil …",
    ],
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
    prompt:
      "Wie bereitet man sich auf ein Vorstellungsgespräch vor? Welche Tipps findest du besonders nützlich? (Two answers are correct)",
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
    prompt:
      "Wie war das Leben vor 50 Jahren im Vergleich zu heute? Nenne mindestens drei Unterschiede. (Three answers are correct)",
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

const hoerenQuestions = [
  {
    prompt: "1. Warum bringt Laura den Wasserkocher zurück?",
    options: [
      "A) Er ist zu teuer",
      "B) Er funktioniert nicht",
      "C) Er ist zu groß",
      "D) Er gefällt ihr nicht",
    ],
  },
  {
    prompt: "2. Was bringt Laura als Kaufnachweis mit?",
    options: [
      "A) Eine Rechnung vom Arzt",
      "B) Eine Kundenkarte",
      "C) Den Kassenbon",
      "D) Einen Brief",
    ],
  },
  {
    prompt: "3. Was bietet der Verkäufer Laura an?",
    options: [
      "A) Einen Rabatt",
      "B) Eine Reparatur in einem Jahr",
      "C) Einen Umtausch oder eine Rückerstattung",
      "D) Einen Gutschein für Essen",
    ],
  },
  {
    prompt: "4. Welches Problem gibt es mit der Jacke?",
    options: [
      "A) Sie hat die falsche Farbe",
      "B) Sie ist beschädigt",
      "C) Sie hat die falsche Größe",
      "D) Sie kommt zu spät",
    ],
  },
  {
    prompt: "5. Was bittet Laura den Kundenservice zu schicken?",
    options: [
      "A) Einen Retourenschein",
      "B) Eine neue Rechnung",
      "C) Einen Katalog",
      "D) Einen Rabattcode",
    ],
  },
];

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.secondaryButton,
        borderColor: active ? "#2563eb" : "#d1d5db",
        background: active ? "#2563eb" : "#fff",
        color: active ? "#fff" : "#1d4ed8",
        fontWeight: 800,
        flex: "0 0 auto",
        minWidth: 74,
      }}
    >
      {children}
    </button>
  );
}

const A2Day20WorkbookContent = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const activeIndex = useMemo(
    () => tabs.findIndex((tab) => tab.key === activeTab),
    [activeTab]
  );

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, margin: 0 }}>
          A2 · Day 20 Workbook · Typische Reklamationssituationen üben
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 7.20</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Follow Teil 1–4 in order, check Ref when needed, and submit your final answers through the Submit tab.
        </p>

        <img
          src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1600&q=80"
          alt="Customer discussing a product complaint with service staff"
          loading="lazy"
          style={{ ...imageStyle, maxHeight: 260 }}
        />

        <div
          role="tablist"
          aria-label="A2 Day 20 workbook sections"
          style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}
        >
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              active={tab.key === activeTab}
              onClick={() => setActiveTab(tab.key)}
            >
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
                <strong>Gründe für die Reklamation:</strong> falsche Lieferung, defektes Produkt, falsche Größe oder Farbe, verspätete Lieferung und schlechter Service.
              </li>
              <li>
                <strong>Nützliche Sätze:</strong> „Ich möchte mich beschweren.", „Das Produkt ist kaputt.", „Ich möchte mein Geld zurück." und „Könnten Sie das bitte umtauschen?"
              </li>
              <li>
                <strong>Wichtige Unterlagen:</strong> Quittung, Rechnung, Lieferschein, Bestellnummer und Garantieschein.
              </li>
              <li>
                <strong>Mögliche Lösungen:</strong> Umtausch, Reparatur, Erstattung, Gutschein oder Preisnachlass.
              </li>
              <li>
                <strong>Reaktion und Service:</strong> Kundendienst kontaktieren, sich entschuldigen, eine klare Anleitung geben und die Lösung bestätigen.
              </li>
              <li>
                <strong>Eigene Erfahrungen:</strong> Hast du schon einmal etwas reklamiert? Was ist passiert?
              </li>
            </ol>
          </div>

          <div style={infoBoxStyle}>
            <strong>Sprechen wie bei einer Mini-Präsentation</strong>
            <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              <li><strong>Einleitung:</strong> Sage kurz, worum es geht.</li>
              <li><strong>Hauptteil:</strong> Nutze und, oder, weil und deshalb.</li>
              <li><strong>Beispiel:</strong> Gib eine kurze Alltagssituation.</li>
              <li><strong>Schluss:</strong> Sage deine Meinung oder fasse die Lösung zusammen.</li>
            </ol>
          </div>

          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {miniPresentationCards.map((item) => (
              <div key={item.title} style={questionBoxStyle}>
                <strong>{item.title}</strong>
                <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                  {item.phrases.map((phrase) => (
                    <li key={`${item.title}-${phrase}`}>{phrase}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={questionBoxStyle}>
            <strong>📝 Modellantwort (ca. 30–45 Sekunden)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Ich möchte kurz über eine Reklamation sprechen. Letzten Monat habe ich einen Wasserkocher gekauft, aber er war nach zwei Tagen kaputt. Ich bin in das Geschäft gegangen und habe die Quittung gezeigt, weil das wichtig war. Die Mitarbeiterin war freundlich und hat mir sofort einen neuen Wasserkocher gegeben. Deshalb war ich am Ende zufrieden. Zum Schluss kann ich sagen: Guter Service ist sehr wichtig."
            </p>
            <p style={{ margin: 0 }}>
              <strong>Impulsfrage:</strong> Hast du schon einmal etwas reklamieren müssen? Erzähle davon.
            </p>
            <p style={{ margin: 0 }}>
              <strong>Keywords:</strong> Produkt, Problem, Umtausch, Kundendienst.
            </p>
          </div>

          <CourseInlinePracticePanel type="speaking" />
          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is group practice only and has no assignment submission.
          </p>
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={sectionStyle}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Learner writing a formal complaint letter"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={{ margin: 0 }}>Teil 2 · Schreiben (Formeller Brief)</h2>
          <div style={infoBoxStyle}>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Aufgabe:</strong> Schreiben Sie einen formellen Brief an einen Supermarkt, weil ein Produkt defekt oder nicht in Ordnung ist.
            </p>
            <p style={{ margin: 0 }}><strong>Berücksichtigen Sie:</strong></p>
            <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              <li>Warum schreiben Sie den Brief?</li>
              <li>Was ist genau das Problem mit dem Produkt?</li>
              <li>Welche Lösung erwarten Sie: Umtausch, Reparatur oder Geld zurück?</li>
            </ol>
          </div>
          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
        </section>
      )}

      {activeTab === "lesen" && (
        <section style={sectionStyle}>
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
            alt="Learner reading workbook questions"
            loading="lazy"
            style={imageStyle}
          />
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
            </div>
          ))}
          <WorkbookSubmissionReminder />
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={sectionStyle}>
          <img
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80"
            alt="Learner listening to a German complaint dialogue"
            loading="lazy"
            style={imageStyle}
          />

          <h2 style={{ margin: 0 }}>Teil 4 · Hören (Exercise)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Sieh das Video zweimal. Lies zuerst alle Fragen und achte besonders auf den Wasserkocher, den Kaufnachweis, die angebotene Lösung, die Jacke und den Retourenschein.
          </p>

          <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
            <iframe
              src="https://www.youtube.com/embed/pH1X3E7vOao?rel=0"
              title="A2 Day 20 Hören · Typische Reklamationssituationen"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: 0,
                borderRadius: 12,
              }}
            />
          </div>

          <a
            href="https://youtu.be/pH1X3E7vOao"
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.secondaryButton, textDecoration: "none", width: "fit-content" }}
          >
            Open Hören video on YouTube
          </a>

          <h3 style={{ margin: 0 }}>Fragen und mögliche Antworten</h3>
          <div style={{ display: "grid", gap: 12 }}>
            {hoerenQuestions.map((question) => (
              <div key={question.prompt} style={questionBoxStyle}>
                <strong>{question.prompt}</strong>
                <ol
                  type="A"
                  style={{ margin: 0, paddingLeft: 24, lineHeight: 1.8 }}
                >
                  {question.options.map((option) => (
                    <li key={`${question.prompt}-${option}`} style={{ listStyle: "none" }}>
                      {option}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <WorkbookSubmissionReminder />
        </section>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="A2"
          lesson={{
            title: "A2Day20TypischeReklamationssituationen",
            level: "A2",
            workbookId: "A2Day20TypischeReklamationssituationen",
          }}
          workbookId="A2Day20TypischeReklamationssituationen"
        />
      )}

      {activeTab === "submit" && (
        <section
          style={{
            ...styles.card,
            border: "1px solid #bfdbfe",
            background: "#eff6ff",
            display: "grid",
            gap: 10,
          }}
        >
          <h2 style={{ margin: 0 }}>Submit Workbook</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Submit the required answers for Schreiben, Lesen and Hören after completing Teil 1–4.
          </p>
          <WorkbookSubmissionReminder />
          <a
            href="/campus/course?submitWork=1"
            style={{ ...styles.primaryButton, textDecoration: "none", justifySelf: "start" }}
          >
            Open submission area
          </a>
        </section>
      )}
    </div>
  );
};

const A2Day20TypischeReklamationssituationenWorkbookPage = () => (
  <RadioFirstWorkbookGate level="A2" day={20}>
    <A2Day20WorkbookContent />
  </RadioFirstWorkbookGate>
);

export default A2Day20TypischeReklamationssituationenWorkbookPage;
