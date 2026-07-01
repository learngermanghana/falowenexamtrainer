import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import { STANDARD_WORKBOOK_TABS, WorkbookTabNav, WorkbookTaskCard } from "./StandardWorkbookComponents";
import { styles } from "../styles";

const AUDIO_FILE_ID = "1zLP6fMwvZNYaw_Vb0sHTMhy8-2GeRNca";
const card = { ...styles.card, display: "grid", gap: 14 };
const title = { margin: 0, fontSize: "1.15rem" };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 13, background: "#fff", display: "grid", gap: 7 };

const cityPros = ["Viele Arbeitsmöglichkeiten", "Gute Infrastruktur", "Mehr Freizeitangebote", "Gute Bildung und medizinische Versorgung"];
const cityCons = ["Lärm und Hektik", "Hohe Mieten", "Umweltverschmutzung", "Verkehr und Staus"];
const countryPros = ["Ruhe und Natur", "Mehr Platz", "Günstigere Wohnungen", "Engere Gemeinschaft"];
const countryCons = ["Weniger Arbeitsplätze", "Schlechtere Infrastruktur", "Weniger Freizeitangebote", "Abhängigkeit vom Auto"];

const readingQuestions = [
  ["Welche Wohnart ist besonders bei Familien beliebt?", "A) WG", "B) Einfamilienhaus", "C) Mehrfamilienhaus"],
  ["Was bietet eine Wohnung im Mehrfamilienhaus?", "A) Nur niedrige Kosten", "B) Sehr viel Platz", "C) Privatsphäre und Gemeinschaft"],
  ["Warum sind WGs bei jungen Leuten beliebt?", "A) Sie bieten völlige Privatsphäre", "B) Sie sind günstig", "C) Man wohnt allein"],
  ["Was ist ein Passivhaus?", "A) Ein Haus mit hohem Energieverbrauch", "B) Ein energieeffizientes Haus", "C) Ein billiges Haus"],
  ["Welche Rolle spielt die Lage?", "A) Keine", "B) Eine wichtige", "C) Nur auf dem Land"],
  ["Was schätzen Stadtbewohner?", "A) Mehr Natur", "B) Kurze Wege", "C) Weniger Angebote"],
  ["Welche Wohnform passt zu einem kleinen Budget?", "A) Einfamilienhaus", "B) Luxuswohnung", "C) WG"],
];

const listeningQuestions = [
  ["Was ist ein Vorteil einer WG?", "A) Viel Privatsphäre", "B) Gemeinsame Nutzung", "C) Keine Regeln"],
  ["Warum mögen Familien Einfamilienhäuser?", "A) Wegen niedriger Mieten", "B) Wegen Platz und Privatsphäre", "C) Wegen der Innenstadt"],
  ["Welche Wohnform ist in Städten häufig?", "A) Tiny Houses", "B) Einfamilienhäuser", "C) Mehrfamilienhäuser"],
  ["Welche Wohnform ist umweltfreundlich?", "A) WG", "B) Mehrfamilienhaus", "C) Passivhaus"],
  ["Warum ist ein Mehrfamilienhaus attraktiv?", "A) Hohe Kosten", "B) Privatsphäre und soziale Kontakte", "C) Sehr viel Platz"],
];

const QuestionList = ({ items }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {items.map(([question, ...options], index) => (
      <div key={question} style={box}>
        <strong>{index + 1}. {question}</strong>
        {options.map((option) => <span key={option}>{option}</span>)}
      </div>
    ))}
  </div>
);

const Prepared = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", gap: 8, alignItems: "center", fontWeight: 700 }}>
    <input type="checkbox" checked={checked} onChange={onChange} /> I prepared this part.
  </label>
);

export default function B1Day6StadtOderLandWorkbookPageV2() {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const mark = (key) => (event) => setPrepared((old) => ({ ...old, [key]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 6 · Kapitel 2.6</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Leben in der Stadt oder auf dem Land?</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Choose Teil 1–4, Ref or Submit. Each section starts with the exact task.</p>
        <WorkbookTabNav activeTab={activeTab} onChange={setActiveTab} tabs={STANDARD_WORKBOOK_TABS} ariaLabel="B1 Day 6 workbook sections" />
      </header>

      <A2B1WorkbookGuidance level="B1" />

      {activeTab === "sprechen" && (
        <section style={card}>
          <h2 style={title}>Teil 1 · Sprechen</h2>
          <WorkbookTaskCard eyebrow="Question of the Day · Speaking" title="Wo lebt man besser – in der Stadt oder auf dem Land?" practiceOnly submissionNote="Prepare a 1–2 minute answer. Teil 1 is not submitted.">
            <p style={{ margin: 0 }}>Choose Stadt, Land or Stadtrand. Give two advantages, one disadvantage and your personal reason.</p>
          </WorkbookTaskCard>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            <div style={box}><strong>Stadt · Vorteile</strong><ul style={list}>{cityPros.map((item) => <li key={item}>{item}</li>)}</ul><strong>Nachteile</strong><ul style={list}>{cityCons.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div style={box}><strong>Land · Vorteile</strong><ul style={list}>{countryPros.map((item) => <li key={item}>{item}</li>)}</ul><strong>Nachteile</strong><ul style={list}>{countryCons.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>
          <CourseInlinePracticePanel type="speaking" />
          <Prepared checked={prepared.sprechen} onChange={mark("sprechen")} />
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={card}>
          <h2 style={title}>Teil 2 · Schreiben</h2>
          <WorkbookTaskCard eyebrow="Your assignment · Writing" title="Stadt oder Land – welches ist besser und warum?" submissionNote="Write about 80 words and submit it through Submit.">
            <p style={{ margin: 0 }}>React to Tanja, compare both places and explain your own choice.</p>
          </WorkbookTaskCard>
          <div style={{ ...box, background: "#eff6ff" }}><strong>Tanjas Meinung</strong><p style={{ margin: 0 }}>„Für mich ist das Leben in der Stadt besser, weil dort immer etwas los ist und ich alles schnell erreichen kann.“</p></div>
          <div style={box}><strong>Structure</strong><ol style={list}><li>Einleitung</li><li>Vorteil der Stadt</li><li>Vorteil des Landes</li><li>Eigene Meinung mit Begründung</li><li>Schluss</li></ol></div>
          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <Prepared checked={prepared.schreiben} onChange={mark("schreiben")} />
        </section>
      )}

      {activeTab === "lesen" && (
        <section style={card}>
          <h2 style={title}>Teil 3 · Lesen</h2>
          <WorkbookTaskCard eyebrow="Your assignment · Reading" title="Lesen Sie den Text und beantworten Sie alle sieben Fragen." submissionNote="Submit only answer letters, for example: 1B, 2C, 3A.">
            <p style={{ margin: 0 }}>Read the full text before choosing A, B or C.</p>
          </WorkbookTaskCard>
          <h3 style={{ margin: 0 }}>Verschiedene Wohnarten in Deutschland</h3>
          <p style={{ margin: 0, lineHeight: 1.75 }}>In Deutschland leben Familien oft in Einfamilienhäusern, weil sie dort mehr Platz und Privatsphäre haben. In Städten sind Wohnungen in Mehrfamilienhäusern verbreitet. Sie verbinden einen privaten Wohnbereich mit Kontakt zu Nachbarn.</p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>Wohngemeinschaften sind besonders bei jungen Leuten beliebt, weil die Bewohner Miete und Nebenkosten teilen. Nachhaltige Passivhäuser werden ebenfalls wichtiger, da sie wenig Energie verbrauchen. Auch die Lage ist entscheidend: In der Stadt sind Wege zu Geschäften und Restaurants kurz, während das Land mehr Ruhe und Natur bietet.</p>
          <QuestionList items={readingQuestions} />
          <WorkbookSubmissionReminder />
          <Prepared checked={prepared.lesen} onChange={mark("lesen")} />
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={card}>
          <h2 style={title}>Teil 4 · Hören</h2>
          <WorkbookTaskCard eyebrow="Your assignment · Listening" title="Hören Sie zweimal und beantworten Sie alle fünf Fragen." submissionNote="Submit only answer letters, for example: 1B, 2A, 3C.">
            <p style={{ margin: 0 }}>Listen for WGs, family houses, city apartments and sustainable housing.</p>
          </WorkbookTaskCard>
          <iframe src={`https://drive.google.com/file/d/${AUDIO_FILE_ID}/preview`} title="B1 Day 6 Hören" allow="autoplay" style={{ width: "100%", aspectRatio: "16 / 9", border: 0, borderRadius: 12 }} />
          <QuestionList items={listeningQuestions} />
          <WorkbookSubmissionReminder />
          <Prepared checked={prepared.hoeren} onChange={mark("hoeren")} />
        </section>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="B1" lesson={{ title: "B1Day6StadtOderLand", level: "B1", day: 6, workbookId: "B1Day6StadtOderLand" }} workbookId="B1Day6StadtOderLand" />
      )}

      {activeTab === "submit" && (
        <section style={card}>
          <h2 style={title}>Submit workbook answers</h2>
          <WorkbookTaskCard eyebrow="Final step" title="Submit Teil 2, Teil 3 and Teil 4." submissionNote="Do not submit Teil 1.">
            <p style={{ margin: 0 }}>Paste your writing, reading answers and listening answers below.</p>
          </WorkbookTaskCard>
          <div className="b1-day6-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.b1-day6-submission-page > div > section:first-child { display: none !important; }.b1-day6-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage submissionContext={{ level: "B1", day: 6, assignmentKey: "B1-2.6", canonicalAssignmentKey: "B1-2.6" }} />
          </div>
        </section>
      )}
    </div>
  );
}
