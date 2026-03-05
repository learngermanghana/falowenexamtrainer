import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen (Group Practice No assignment)" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
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

const listStyle = {
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

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const lesenQuestions = [
  {
    stem: "Warum ist die Friseurin zufrieden mit ihrer Arbeit?",
    options: [
      "a) Sie arbeitet in Teilzeit.",
      "b) Sie ist selbstständig und verdient mehr.",
      "c) Sie hat einen neuen Chef.",
      "d) Sie muss keine Kunden bedienen.",
    ],
  },
  {
    stem: "Warum bleiben viele Kunden bei ihrem Friseursalon?",
    options: [
      "a) Weil sie keine andere Wahl haben.",
      "b) Weil der Salon am billigsten ist.",
      "c) Weil der Service und die Beratung gut sind.",
      "d) Weil sie dort arbeiten.",
    ],
  },
  {
    stem: "Was macht die Familie von Robert Schmidt für den Umweltschutz?",
    options: [
      "a) Sie nutzt immer das Auto.",
      "b) Sie trennt Müll und spart Energie.",
      "c) Sie kauft viele neue Geräte.",
      "d) Sie wirft alles in den gleichen Müll.",
    ],
  },
  {
    stem: "Was passiert in der Wohnung, wenn niemand zu Hause ist?",
    options: [
      "a) Die Heizung wird auf 25 Grad gestellt.",
      "b) Alle Lichter bleiben an.",
      "c) Die Familie stellt die Heizung auf 18 Grad und schaltet Geräte aus.",
      "d) Die Türen bleiben offen.",
    ],
  },
  {
    stem: "Was bieten die Verbraucherzentralen an?",
    options: [
      "a) Friseurdienstleistungen",
      "b) Beratung zu Konsum, Verträgen und Ernährung",
      "c) Fahrstunden",
      "d) Sportkurse",
    ],
  },
  {
    stem: "Wie werden die Verbraucherzentralen finanziert?",
    options: ["a) Nur durch Spenden", "b) Nur durch Mitgliedsbeiträge", "c) Durch den Staat und Kundenzahlungen", "d) Durch Werbung"],
  },
  {
    stem: "Was ist im Internet bei den Verbraucherzentralen kostenlos erhältlich?",
    options: ["a) Kinokarten", "b) Broschüren mit Informationen", "c) Reisen ins Ausland", "d) Elektronische Geräte"],
  },
];

const hoerenQuestions = [
  {
    stem: "Was ist laut Hinweis die wichtigste Aufgabe im Hörteil?",
    options: [
      "A) Die Antworten direkt auf dieser Seite abzugeben",
      "B) Die Hörverstehen-Antworten selbst zu kontrollieren",
      "C) Die Aufgaben nur im Unterricht zu besprechen",
      "D) Nur das Video einmal anzusehen",
    ],
  },
  {
    stem: "Welche Teile werden offiziell von der Schule bewertet?",
    options: [
      "A) Nur Hören",
      "B) Nur Sprechen",
      "C) Lesen und Schreiben",
      "D) Alle vier Teile gleich",
    ],
  },
  {
    stem: "Was wird für den Hörteil besonders gebraucht?",
    options: [
      "A) Motivation und Selbstdisziplin",
      "B) Ein gedrucktes Arbeitsheft",
      "C) Gruppenbewertung durch Mitschüler",
      "D) Keine Vorbereitung",
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

const B1Day25OnlineShoppingRightsRisksWorkbookPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sprechen");
  const [teacherMode, setTeacherMode] = useState(false);
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
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 · Chapter 8.25 Workbook · Online einkaufen – Rechte und Risiken</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Rechte und Risiken beim Online-Shopping besprechen.</p>

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
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1600&q=80"
            alt="People shopping online using digital devices"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we&apos;ll engage in group exercises discussing these topics.</p>

          <h3 style={sectionTitle}>Zentrales Thema: Online einkaufen – Rechte und Risiken</h3>
          <ol style={listStyle}>
            <li>
              <strong>Gründe für Online-Shopping</strong>
              <ul style={listStyle}>
                <li>Bequemlichkeit: rund um die Uhr einkaufen</li>
                <li>Große Auswahl an Produkten</li>
                <li>Preisvergleiche möglich</li>
                <li>Lieferung nach Hause</li>
                <li>Oft günstiger als im Laden</li>
              </ul>
            </li>
            <li>
              <strong>Typische Produkte beim Online-Kauf</strong>
              <ul style={listStyle}>
                <li>Kleidung</li>
                <li>Elektronik (z. B. Handys, Laptops)</li>
                <li>Bücher</li>
                <li>Lebensmittel</li>
                <li>Möbel und Haushaltsartikel</li>
              </ul>
            </li>
            <li>
              <strong>Rechte beim Online-Kauf</strong>
              <ul style={listStyle}>
                <li>Widerrufsrecht (14 Tage Rückgaberecht ohne Grund)</li>
                <li>Rücksendung möglich</li>
                <li>Geld-zurück-Garantie</li>
                <li>Informationspflicht des Verkäufers (z. B. Preis, Lieferzeit)</li>
                <li>Garantie auf Produkte</li>
              </ul>
            </li>
            <li>
              <strong>Risiken und Probleme</strong>
              <ul style={listStyle}>
                <li>Falsche oder beschädigte Ware</li>
                <li>Lange Lieferzeiten</li>
                <li>Betrügerische Webseiten (Fake-Shops)</li>
                <li>Datenschutzprobleme (unsichere Bezahlung)</li>
                <li>Schwierige Rückgabe, besonders bei Auslandsbestellungen</li>
              </ul>
            </li>
            <li>
              <strong>Sichere Online-Shops erkennen</strong>
              <ul style={listStyle}>
                <li>Gütesiegel (z. B. Trusted Shops, TÜV)</li>
                <li>Kundenbewertungen lesen</li>
                <li>Impressum prüfen</li>
                <li>HTTPS (sichere Verbindung)</li>
                <li>Bezahlmethoden: PayPal, Rechnung, Kreditkarte</li>
              </ul>
            </li>
            <li>
              <strong>Nützliche Redemittel</strong>
              <ul style={listStyle}>
                <li>„Ich möchte die Ware zurückgeben.“</li>
                <li>„Das Produkt ist beschädigt angekommen.“</li>
                <li>„Ich habe etwas anderes bestellt.“</li>
                <li>„Wie funktioniert die Rücksendung?“</li>
                <li>„Ich möchte mein Geld zurück.“</li>
                <li>„Könnten Sie mir bitte eine neue Ware schicken?“</li>
              </ul>
            </li>
            <li>
              <strong>Tipps für sicheres Online-Shopping</strong>
              <ul style={listStyle}>
                <li>Nur bei bekannten Anbietern bestellen</li>
                <li>Zahlungsbestätigung aufbewahren</li>
                <li>Preise vergleichen</li>
                <li>Rückgabebedingungen lesen</li>
                <li>Niemals persönliche Daten per E-Mail weitergeben</li>
              </ul>
            </li>
          </ol>

          <h3 style={sectionTitle}>Gemeinsam etwas planen</h3>
          <p style={{ margin: 0 }}>
            <strong>„Online einkaufen – Rechte und Risiken“</strong>
          </p>
          <p style={{ margin: 0 }}>Plant gemeinsam einen Online-Einkauf. Nutzt dabei diese Struktur:</p>
          <ul style={listStyle}>
            <li>Was wollt ihr online kaufen? (z. B. Kleidung, Elektronik, Möbel)</li>
            <li>Wo kauft ihr ein? (Welche Webseite oder App?)</li>
            <li>Wie bezahlt ihr? (z. B. mit Karte, PayPal, auf Rechnung)</li>
            <li>Was macht ihr, wenn etwas nicht stimmt? (z. B. Rückgabe, Reklamation, Kundenservice kontaktieren)</li>
          </ul>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Speaking self-practice confidence check</strong>
            <p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence before class:</p>
            <a
              href="https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec"
              target="_blank"
              rel="noreferrer"
            >
              Open speaking self-practice
            </a>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is only for group discussion and has no assignment submission. Assignments start from Teil 2, Teil 3, and
            Teil 4.
          </p>
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Formal writing and customer service communication setup"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 - Assignment: Schreiben</h2>
          <p style={{ margin: 0 }}>
            <strong>Aufgabe – B1 Schreiben (Formeller Brief)</strong>
          </p>
          <p style={{ margin: 0 }}>
            <strong>Situation:</strong> Sie haben online ein Handy gekauft. Nach der Lieferung haben Sie bemerkt, dass das Display
            kaputt war. Deshalb haben Sie es zurückgeschickt.
          </p>
          <p style={{ margin: 0 }}>Schreiben Sie einen formellen Brief an den Kundenservice und erwähnen Sie dabei auch:</p>
          <ul style={listStyle}>
            <li>Wann Sie das Handy gekauft haben</li>
            <li>Was genau das Problem war</li>
            <li>Wann Sie das Handy zurückgeschickt haben</li>
            <li>Was Sie jetzt erwarten</li>
          </ul>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area (same workflow as usual), not directly on this page.
          </p>
          <p style={{ margin: 0 }}>
            Practice your draft before submission on the writing page:{" "}
            <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">
              Open Writing Practice
            </a>{" "}
            (you can use the Ideas Generator there for support).
          </p>
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
            alt="Reading comprehension practice on a desk"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 – Lesen</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit section at
            the bottom of the lesson to send your answers.
          </p>
          <h3 style={sectionTitle}>Essay: Selbstständigkeit, Umweltschutz und Verbraucherberatung in Deutschland</h3>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            Ich habe einen eigenen Friseursalon. Ein großer Vorteil daran ist, dass ich endlich gut Geld verdienen kann. Früher,
            als ich angestellt war, war mein Gehalt sehr niedrig. Jetzt ist das anders. Ich kann selbst entscheiden, welche
            Dienstleistungen ich anbiete, und bin unabhängig. Viele Kunden bleiben mir treu, obwohl es in Kaufhäusern oft
            günstigere Angebote gibt. Das liegt daran, dass wir auf gute Beratung achten und uns viel Zeit für die Kunden
            nehmen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            Ein Problem in meiner Arbeit ist die Konkurrenz. Ein weiteres Problem ist die Sozialversicherung. Als
            Selbstständige muss ich keine Rentenversicherung haben, aber ich habe freiwillig eine abgeschlossen. Auch wenn ich
            später vielleicht nicht viel Rente bekomme, habe ich dadurch eine gewisse Sicherheit. Insgesamt bin ich sehr
            zufrieden mit meiner Selbstständigkeit.
          </p>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            In meiner Familie spielt auch der Umweltschutz eine wichtige Rolle. Wir fahren mit dem Fahrrad oder mit
            öffentlichen Verkehrsmitteln, wenn wir einkaufen gehen. Außerdem achten wir darauf, möglichst wenig Müll zu
            produzieren. Wir kaufen Produkte mit wenig Verpackung und trennen den Müll richtig. Ich habe das Gefühl, dass die
            Menschen heute umweltbewusster sind als früher. Auch wir sparen Energie in der Wohnung: Wir heizen nur die Zimmer,
            die wir benutzen, und schalten das Licht und elektrische Geräte aus, wenn wir das Haus verlassen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            Wenn man Fragen rund um das Thema Konsum hat, kann man sich in Deutschland an die Verbraucherzentralen wenden. Es
            gibt ungefähr 200 Beratungsstellen in allen Bundesländern. Die Mitarbeiter dort helfen bei Fragen zu Kaufverträgen,
            Krediten, Gewinnspielen, Versicherungen oder auch beim Wechsel des Stromanbieters. Sie informieren auch über
            Lebensmittel und gesunde Ernährung. Die Verbraucherzentralen werden vom Staat unterstützt, aber trotzdem müssen
            Kunden für manche Beratungen etwas bezahlen. Einfache Informationen sind oft kostenlos. Im Internet gibt es viele
            Broschüren, die man gratis herunterladen kann.
          </p>
          <h3 style={sectionTitle}>Fragen (Multiple Choice – 1 richtige Antwort pro Frage)</h3>
          {lesenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>
                {index + 1}. {question.stem}
              </strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones for listening comprehension practice"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören) (Exercise)</h2>
          <p style={{ margin: 0 }}>
            Please note that this is a Goethe-standard Hörverstehen (listening comprehension) test, and the answers are
            provided in the YouTube video. You are responsible for checking your own answers. The only parts that will be
            officially evaluated by the school are Lesen (reading) and Schreiben (writing). You must mark your own
            Hörverstehen results. This process will require a lot of motivation and self-discipline on your part to be
            effective. Thank you, and good luck!
          </p>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final answers in the assignment submission area (same workflow as usual), not directly on this page.
          </p>
          <p style={{ margin: 0 }}>
            Recommended video link:{" "}
            <a href="https://youtu.be/iyydRu3oY4I?list=PLg78ckjpHfZy1W9NOddmHPfv0temfRI9X" target="_blank" rel="noreferrer">
              https://youtu.be/iyydRu3oY4I?list=PLg78ckjpHfZy1W9NOddmHPfv0temfRI9X
            </a>
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/iyydRu3oY4I?list=PLg78ckjpHfZy1W9NOddmHPfv0temfRI9X"
            title="Goethe Hörverstehen practice"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
            <input type="checkbox" checked={teacherMode} onChange={(event) => setTeacherMode(event.target.checked)} />
            Teacher mode (show transcript support)
          </label>

          {teacherMode && (
            <div style={{ ...questionCardStyle, background: "#fefce8" }}>
              <strong>Teacher support transcript note</strong>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                This Hörverstehen activity uses the video answer key. In teacher mode, guide learners to listen in two rounds:
                first for global meaning, then for key details. Emphasize self-checking discipline and accuracy in marking.
              </p>
            </div>
          )}

          <h3 style={sectionTitle}>Check questions before self-marking</h3>
          {hoerenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>
                {index + 1}. {question.stem}
              </strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default B1Day25OnlineShoppingRightsRisksWorkbookPage;
