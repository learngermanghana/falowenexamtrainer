import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen (Group Practice No assignment)" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
  { key: "references", label: "Teil 5 · Reference Answers" },
];

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.1rem",
};

const listSpacing = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.7,
};

const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 6,
};

const phraseGridStyle = { display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" };

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const lesenQuestions = [
  {
    stem: "Was hat das Konsumverhalten in den letzten Jahrzehnten stark verändert?",
    options: [
      "A) Der Anstieg von lokalen Märkten",
      "B) Die Zunahme von Online-Shopping und Werbung",
      "C) Die Reduzierung von Plastikverbrauch",
      "D) Keine Veränderung",
    ],
  },
  {
    stem: "Warum kaufen viele Menschen Dinge, die sie nicht brauchen?",
    options: [
      "A) Weil sie gut informiert sind",
      "B) Wegen der ständigen Verfügbarkeit und einfachen Bestellung",
      "C) Weil sie auf faire Handelsbedingungen achten",
      "D) Weil es keine Werbung gibt",
    ],
  },
  {
    stem: "Was wird immer wichtiger für Verbraucher?",
    options: ["A) Mehr Plastik zu verwenden", "B) Nachhaltiger Konsum", "C) Mehr Dinge online zu kaufen", "D) Billigprodukte"],
  },
  {
    stem: "Welche Veränderungen sind notwendig, um die Umwelt zu schützen?",
    options: [
      "A) Mehr Plastik verwenden",
      "B) Weniger Plastik verwenden und lokale Produkte kaufen",
      "C) Mehr Produkte aus dem Ausland kaufen",
      "D) Häufiger spontan einkaufen",
    ],
  },
  {
    stem: "Welche Herausforderungen gibt es beim Konsumverhalten?",
    options: [
      "A) Gute Arbeitsbedingungen in allen Fabriken",
      "B) Umweltverschmutzung und schlechte Arbeitsbedingungen",
      "C) Hohe Preise für Konsumgüter",
      "D) Zu wenige Produkte",
    ],
  },
  {
    stem: "Was sollen Verbraucher tun, um bewusste Entscheidungen zu treffen?",
    options: ["A) Sich gut informieren", "B) Nur online einkaufen", "C) So viel wie möglich kaufen", "D) Werbung ignorieren"],
  },
  {
    stem: "Wie wird das Konsumverhalten im Text beschrieben?",
    options: [
      "A) Als einfaches Thema",
      "B) Als komplexes Thema mit positiven und negativen Auswirkungen",
      "C) Als völlig negatives Thema",
      "D) Als unwichtiges Thema",
    ],
  },
];

const hoerenQuestions = [
  {
    stem: "Was bietet Online-Shopping den Verbrauchern?",
    options: [
      "A) Hohe Preise",
      "B) Bequeme Möglichkeit, Produkte nach Hause zu bestellen",
      "C) Weniger Auswahl",
      "D) Nur lokale Produkte",
    ],
  },
  {
    stem: "Was ist ein Nachteil des Online-Shoppings?",
    options: [
      "A) Geringe Anzahl von Rücksendungen",
      "B) Hohe Anzahl von Rücksendungen und Umweltbelastung",
      "C) Niedrige Preise",
      "D) Schnellere Lieferung",
    ],
  },
  {
    stem: "Worauf müssen Verbraucher beim Online-Kauf achten?",
    options: [
      "A) Auf vertrauenswürdige Websites und Schutz persönlicher Daten",
      "B) Auf hohe Preise",
      "C) Auf schnelle Lieferung",
      "D) Auf möglichst viele Werbeangebote",
    ],
  },
  {
    stem: "Wo sollten die Produkte, die online gekauft werden, herkommen?",
    options: [
      "A) Aus nachhaltigen Quellen und fairen Bedingungen",
      "B) Aus dem Ausland",
      "C) Aus teuren Geschäften",
      "D) Ohne Herkunftsnachweis",
    ],
  },
  {
    stem: "Wie hat das Internet den Konsum verändert?",
    options: [
      "A) Es hat den Konsum eingeschränkt",
      "B) Es hat den Konsum revolutioniert und neue Möglichkeiten geschaffen",
      "C) Es hat keine großen Veränderungen gebracht",
      "D) Es hat nur stationäre Läden gestärkt",
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

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const A2Day19EinkaufenWoUndWieWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);

  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 19 Workbook · Einkaufen? Wo und wie?</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          4-part workbook: group speaking, writing, reading and listening practice.
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
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1600&q=80"
            alt="People shopping in a modern supermarket aisle"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we&apos;ll engage in group exercises discussing these topics.</p>

          <h3 style={sectionTitle}>Instructions</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Central Topic:</strong> Write <strong>&quot;Konsumverhalten&quot;</strong> in the center of your brain map.
            </li>
            <li>
              <strong>Main Branches:</strong> Create five main branches from the central topic:
              <ul style={listSpacing}>
                <li>Einkaufsmöglichkeiten (Shopping Options)</li>
                <li>Einkaufsgewohnheiten (Shopping Habits)</li>
                <li>Nachhaltigkeit und Konsum (Sustainability and Consumption)</li>
                <li>Bezahlen und Rabatte (Payments and Discounts)</li>
                <li>Produkte und Dienstleistungen (Products and Services)</li>
              </ul>
            </li>
            <li>
              <strong>Sub-Branches:</strong> Expand each branch with examples and phrases.
            </li>
          </ol>

          <h3 style={sectionTitle}>Example Brain Map</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Einkaufsmöglichkeiten (Shopping Options)</strong>
              <ul style={listSpacing}>
                <li>Supermärkte: Lidl, Aldi, Edeka (supermarkets)</li>
                <li>Einkaufszentren: Mall of Berlin, Skyline Plaza (shopping centers)</li>
                <li>Online-Shopping: Amazon, Zalando (online shopping)</li>
                <li>Wochenmärkte: Gemüse, Obst, Brot (weekly markets: vegetables, fruit, bread)</li>
                <li>Second-Hand-Läden: Kleidung, Bücher (second-hand shops: clothes, books)</li>
              </ul>
            </li>
            <li>
              <strong>Einkaufsgewohnheiten (Shopping Habits)</strong>
              <ul style={listSpacing}>
                <li>Geplantes Einkaufen: Einkaufszettel (planned shopping: shopping list)</li>
                <li>Spontane Käufe (spontaneous purchases)</li>
                <li>Großeinkauf: Einmal pro Woche (big weekly shop: once per week)</li>
                <li>Tagesbedarf kaufen: Brot, Milch (buying daily needs: bread, milk)</li>
              </ul>
            </li>
            <li>
              <strong>Nachhaltigkeit und Konsum (Sustainability and Consumption)</strong>
              <ul style={listSpacing}>
                <li>Wiederverwendbare Taschen (reusable bags)</li>
                <li>Plastik vermeiden (avoid plastic)</li>
                <li>Regionale Produkte kaufen (buy regional products)</li>
                <li>Weniger kaufen, mehr reparieren (buy less, repair more)</li>
                <li>Fair Trade-Produkte (fair-trade products)</li>
              </ul>
            </li>
            <li>
              <strong>Bezahlen und Rabatte (Payments and Discounts)</strong>
              <ul style={listSpacing}>
                <li>Bar bezahlen (pay in cash)</li>
                <li>Mit Karte bezahlen (pay by card)</li>
                <li>Online-Bezahlung (online payment)</li>
                <li>Rabattaktionen: Black Friday, Sommerschlussverkauf (discount campaigns: Black Friday, summer sale)</li>
                <li>Kundenkarten (customer loyalty cards)</li>
              </ul>
            </li>
            <li>
              <strong>Produkte und Dienstleistungen (Products and Services)</strong>
              <ul style={listSpacing}>
                <li>Lebensmittel: Brot, Milch, Gemüse (groceries: bread, milk, vegetables)</li>
                <li>Kleidung: Hosen, T-Shirts, Jacken (clothing: trousers/pants, T-shirts, jackets)</li>
                <li>Elektronik: Smartphones, Fernseher (electronics: smartphones, televisions)</li>
                <li>Dienstleistungen: Friseur, Autoreparatur (services: hairdresser, car repair)</li>
              </ul>
            </li>
          </ol>

          <h3 style={sectionTitle}>Speaking Prompt</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Wie kaufst du ein und worauf achtest du beim Einkaufen? Nutze diese Wörter in deinem Beitrag: <strong>Einkaufen</strong>,{" "}
            <strong>Geld</strong>, <strong>Supermarkt</strong>, <strong>Angebot</strong>.
          </p>

          <h3 style={sectionTitle}>Sprechen wie bei einer Mini-Präsentation</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Nutze diese einfache Struktur: <strong>Einleitung → Hauptteil mit Verbindungswörtern → Beispiel → Schluss</strong>.
            So wird aus kurzen Wörtern eine klare Antwort mit guten Sätzen.
          </p>
          <div style={{ ...questionCardStyle, background: "#ecfeff" }}>
            <strong>Schnelle Struktur für 30–45 Sekunden</strong>
            <ol style={listSpacing}>
              <li><strong>Einleitung:</strong> Thema nennen und einen ersten Satz sagen.</li>
              <li><strong>Hauptteil:</strong> zwei oder drei Punkte mit einfachen Connectors verbinden.</li>
              <li><strong>Beispiel:</strong> ein kurzes Beispiel aus deinem Leben geben.</li>
              <li><strong>Schluss:</strong> deine Meinung kurz zusammenfassen.</li>
            </ol>
          </div>
          <div style={phraseGridStyle}>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Gute Einleitungen</strong>
              <ul style={listSpacing}>
                <li>„Heute spreche ich über …“</li>
                <li>„Ich möchte kurz etwas über … sagen.“</li>
                <li>„Mein Thema ist …“</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Verbindungswörter / Connectors</strong>
              <ul style={listSpacing}>
                <li><strong>und</strong> · „Ich fahre Bus und ich gehe zu Fuß.“</li>
                <li><strong>oder</strong> · „Ich nehme den Zug oder den Bus.“</li>
                <li><strong>weil</strong> · „Das ist gut, weil es einfach ist.“</li>
                <li><strong>deshalb</strong> · „Ich habe wenig Zeit, deshalb plane ich gut.“</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Eigene Meinung ausdrücken</strong>
              <ul style={listSpacing}>
                <li>„Ich finde … gut, weil …“</li>
                <li>„Für mich ist … wichtig.“</li>
                <li>„Meiner Meinung nach ist … praktisch.“</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Gute Schlüsse</strong>
              <ul style={listSpacing}>
                <li>„Zum Schluss kann ich sagen: …“</li>
                <li>„Deshalb finde ich … gut.“</li>
                <li>„Das ist meine Meinung. Danke fürs Zuhören.“</li>
              </ul>
            </div>
          </div>

          <SpeakingPracticeTimerCard />

          <div style={{ ...questionCardStyle, background: "#ecfeff" }}>
            <strong>Modellantwort (ca. 30–45 Sekunden)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Heute spreche ich über Einkaufen. Ich kaufe oft im Supermarkt ein, weil es dort viele Produkte gibt. Manchmal kaufe ich auch online, deshalb spare ich Zeit. Aber im Geschäft kann ich die Ware sehen und Fragen stellen. Zum Beispiel kaufe ich Lebensmittel im Supermarkt und Kleidung manchmal online. Zum Schluss finde ich: Beide Möglichkeiten sind gut, aber es kommt auf die Situation an.“
            </p>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>

          <CourseInlinePracticePanel
            type="speaking"
          />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80"
            alt="Person writing an invitation email at a desk"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Assignment</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Writing Task: Einladung zum Einkaufen</strong>
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Sie möchten einen Freund oder eine Freundin zum Einkaufen einladen, weil Sie gemeinsam Möbel für Ihre neue Wohnung
            auswählen möchten. Schreiben Sie eine E-Mail an Ihren Freund oder Ihre Freundin.
          </p>
          <ol style={listSpacing}>
            <li>Laden Sie ihn/sie zum Einkaufen ein und erklären Sie den Grund.</li>
            <li>Schlagen Sie vor, wann und wo Sie sich treffen können.</li>
            <li>Bitten Sie um seine/ihre Meinung zu Ihrer Idee.</li>
          </ol>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Writing guidance before submission</strong>
            <ul style={listSpacing}>
              <li>Start with a friendly greeting and clearly state your invitation purpose.</li>
              <li>Use time and place details in complete sentences (wann? wo?).</li>
              <li>End by politely asking for your friend&apos;s opinion and confirmation.</li>
            </ul>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area (same workflow as usual), not directly on this page.
          </p>
          <CourseInlinePracticePanel
            type="writing"
          />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
            alt="Learner reading a long German text with notes"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen) · Exercise</h2>
          <p style={{ margin: 0 }}>
            Read the essay and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit section
            at the bottom of the lesson to send your answers.
          </p>

          <h3 style={sectionTitle}>Essay: Konsumverhalten in der modernen Gesellschaft</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Konsumverhalten hat sich in den letzten Jahrzehnten stark verändert. Mit der Zunahme von Online-Shopping und Werbung
            sind die Menschen mehr als je zuvor dazu verleitet, Dinge zu kaufen, die sie nicht wirklich brauchen. Ein Grund
            dafür ist die ständige Verfügbarkeit von Produkten und die einfache Bestellung über das Internet.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Nachhaltiger Konsum wird jedoch immer wichtiger. Viele Verbraucher achten darauf, weniger Plastik zu verwenden,
            lokale Produkte zu kaufen und auf faire Handelsbedingungen zu achten. Diese Veränderungen sind notwendig, um die
            Umwelt zu schützen und soziale Gerechtigkeit zu fördern.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Dennoch gibt es immer noch viele Herausforderungen. Die Produktion von Konsumgütern verursacht oft
            Umweltverschmutzung, und die Arbeitsbedingungen in einigen Fabriken sind schlecht. Es ist daher wichtig, dass
            Verbraucher gut informiert sind und bewusste Entscheidungen treffen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Insgesamt ist das Konsumverhalten ein komplexes Thema, das sowohl positive als auch negative Auswirkungen hat. Es
            liegt an jedem Einzelnen, wie er oder sie mit Konsum umgeht und welche Prioritäten gesetzt werden.
          </p>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {lesenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80"
            alt="Student using headphones for German listening practice"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören) · Exercise</h2>
          <p style={{ margin: 0 }}>
            Listen to the audio, then submit your answers in the assignment area (do not answer directly on this page).
          </p>
          <p style={{ margin: 0 }}>
            Audio link:{" "}
            <a
              href="https://drive.google.com/file/d/1OsT5j6Y7a-rMdB0HlRJJ98gTgSvxm_LB/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Open Teil 4 audio
            </a>
          </p>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {hoerenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <p style={{ margin: 0 }}>
            Recommended video:{" "}
            <a href="https://youtu.be/TOTK1yohCTg" target="_blank" rel="noreferrer">
              Einkaufen? Wo und wie?
            </a>
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/TOTK1yohCTg"
            title="Einkaufen? Wo und wie?"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="A2" lesson={{ title: "A2Day19EinkaufenWoUndWie", level: "A2", workbookId: "A2Day19EinkaufenWoUndWie" }} workbookId="A2Day19EinkaufenWoUndWie" />
      )}

    </div>
  );
};

export default A2Day19EinkaufenWoUndWieWorkbookPage;
