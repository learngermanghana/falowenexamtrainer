import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import {
  STANDARD_WORKBOOK_TABS,
  WorkbookTabNav,
  WorkbookTaskCard,
} from "./StandardWorkbookComponents";

const card = { ...styles.card, display: "grid", gap: 12 };
const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 6,
};
const imageStyle = { width: "100%", borderRadius: 10, maxHeight: 270, objectFit: "cover" };

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: { border: "#bfdbfe", background: "#eff6ff", color: "#1e3a8a" },
    green: { border: "#bbf7d0", background: "#f0fdf4", color: "#166534" },
  };
  const selected = tones[tone] || tones.blue;
  return (
    <div style={{ border: `1px solid ${selected.border}`, background: selected.background, color: selected.color, borderRadius: 12, padding: 14, lineHeight: 1.7 }}>
      {children}
    </div>
  );
};

const wohnungBrainMapBranches = [
  { title: "Wohnungsarten", items: ["Mietwohnung", "Eigentumswohnung", "WG", "Einzimmerwohnung", "Mehrfamilienhaus"] },
  { title: "Methoden der Wohnungssuche", items: ["Online-Portale", "Zeitungsanzeigen", "Immobilienmakler", "persönliche Kontakte", "Aushänge"] },
  { title: "Wichtige Kriterien", items: ["Miete und Nebenkosten", "Kaution", "Lage", "Größe und Ausstattung", "Haustiere"] },
  { title: "Besichtigung und Vertrag", items: ["Termin vereinbaren", "Fragen stellen", "Mängel kontrollieren", "Vertrag prüfen", "Kündigungsfrist"] },
  { title: "Einzug und Kompromisse", items: ["Umzug planen", "Möbel organisieren", "Nachbarn kennenlernen", "sich anmelden", "flexibel bleiben"] },
];

const lesenQuestions = [
  ["1. Warum ist die Wohnungssuche in Großstädten schwierig?", "A) Wegen der vielen Neubauten", "B) Wegen des Mangels an bezahlbarem Wohnraum", "C) Wegen der hohen Gehälter"],
  ["2. Was führt zu einer geringeren Chance auf eine Zusage?", "A) Hohe Nachfrage nach Wohnungen", "B) Geringe Anzahl von Vermietern", "C) Zentrale Lage"],
  ["3. Warum kaufen Investoren Wohnungen auf?", "A) Um sie zu renovieren", "B) Um sie als Ferienwohnungen oder Luxusapartments zu nutzen", "C) Um sie günstig zu vermieten"],
  ["4. Welche Maßnahmen ergreift die Politik?", "A) Erhöhung der Mieten", "B) Mietpreisbremse und Neubauprogramme", "C) Schließung von Altbauwohnungen"],
  ["5. Welche Eigenschaft ist bei der Wohnungssuche wichtig?", "A) Geduld und Flexibilität", "B) Hohes Einkommen", "C) Zentralität der Wohnung"],
];

const hoerenQuestions = [
  ["1. Wie hoch ist die Miete?", "A) 850 Euro", "B) 950 Euro", "C) 1050 Euro"],
  ["2. Was kosten die Nebenkosten?", "A) 100 Euro", "B) 150 Euro", "C) 200 Euro"],
  ["3. Ist die Wohnung möbliert?", "A) Ja", "B) Nein", "C) Teilweise"],
  ["4. Welche Haustiere sind erlaubt?", "A) Hunde", "B) Kleine Haustiere", "C) Keine Haustiere"],
  ["5. Was sagt der Vermieter über die Verkehrsanbindung?", "A) Keine öffentlichen Verkehrsmittel", "B) U-Bahn und mehrere Bushaltestellen", "C) Nur eine Bushaltestelle"],
];

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {questions.map(([stem, ...options]) => (
      <div key={stem} style={questionCardStyle}>
        <strong>{stem}</strong>
        {options.map((option) => <span key={option}>{option}</span>)}
      </div>
    ))}
  </div>
);

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

export default function B1Day4WohnungSuchenWorkbookPage() {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const setPreparedFor = (key) => (event) => setPrepared((old) => ({ ...old, [key]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 4 · Kapitel 2.4</span>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Wohnung suchen – Workbook</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Select Teil 1–4 below. Each section begins with the exact question or assignment you must complete.
        </p>
        <img src="https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80" alt="Wohnungen in einer Großstadt" loading="lazy" style={imageStyle} />
        <NoteBox>
          <strong>Grammar focus:</strong> sowohl … als auch, nicht nur … sondern auch, zwar … aber, einerseits … andererseits, entweder … oder und weder … noch.
        </NoteBox>
        <WorkbookTabNav activeTab={activeTab} onChange={setActiveTab} tabs={STANDARD_WORKBOOK_TABS} ariaLabel="B1 Day 4 workbook sections" />
      </div>

      <A2B1WorkbookGuidance level="B1" />

      {activeTab === "sprechen" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <WorkbookTaskCard
            eyebrow="Question of the Day · Speaking"
            title="Welche Methode ist bei der Wohnungssuche erfolgreicher: Online-Portale oder persönliche Kontakte?"
            practiceOnly
            submissionNote="Prepare a 1–2 minute answer for class. Teil 1 is not submitted."
          >
            <p style={{ margin: 0 }}>
              Vergleichen Sie beide Methoden, nennen Sie mindestens einen Vorteil und einen Nachteil und geben Sie ein konkretes Beispiel. Verwenden Sie mindestens zwei zweiteilige Konnektoren.
            </p>
          </WorkbookTaskCard>
          <p style={{ margin: 0, color: "#475569" }}>The cards below are supporting ideas, not separate questions.</p>
          <div style={{ display: "grid", gap: 10 }}>
            {wohnungBrainMapBranches.map((branch) => (
              <div key={branch.title} style={questionCardStyle}>
                <strong>{branch.title}</strong>
                <ul style={listSpacing}>{branch.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
          <NoteBox tone="green">Beispiel: „Sowohl Online-Portale als auch persönliche Kontakte können hilfreich sein, aber persönliche Kontakte sind oft schneller.“</NoteBox>
          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </section>
      ) : null}

      {activeTab === "schreiben" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Writing"
            title="Schreiben Sie Ihre Meinung: Wohnung suchen und persönliche Kontakte."
            submissionNote="Write approximately 80 words and submit your final text through the Submit tab."
          >
            <ol style={listSpacing}>
              <li>Führen Sie kurz in das Thema ein.</li>
              <li>Sagen Sie, ob persönliche Kontakte hilfreich sind.</li>
              <li>Nennen Sie einen Vorteil persönlicher Kontakte.</li>
              <li>Nennen Sie einen Vorteil oder Nachteil von Online-Portalen.</li>
              <li>Geben Sie ein Beispiel und formulieren Sie einen Schluss.</li>
            </ol>
          </WorkbookTaskCard>
          <NoteBox tone="green">Verwenden Sie mindestens zwei zweiteilige Konnektoren.</NoteBox>
          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </section>
      ) : null}

      {activeTab === "lesen" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 3 · Lesen (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Reading"
            title="Lesen Sie den Text und beantworten Sie alle fünf Fragen."
            submissionNote="Submit only the answer letters in this format: 1B, 2A, 3C ..."
          >
            <p style={{ margin: 0 }}>Read the complete text first. Then choose one answer, A–C, for every question.</p>
          </WorkbookTaskCard>
          <h3 style={sectionTitle}>Die Herausforderungen der Wohnungssuche in Großstädten</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In vielen Großstädten Deutschlands ist bezahlbarer Wohnraum knapp. Die Mieten steigen, und viele Interessenten bewerben sich um dieselbe Wohnung. Dadurch haben Menschen mit geringerem Einkommen oft schlechtere Chancen.</p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>Zusätzlich kaufen Investoren Wohnungen und nutzen sie als Ferienwohnungen oder Luxusapartments. Die Politik reagiert mit Mietpreisbremse und Neubauprogrammen. Trotzdem brauchen Wohnungssuchende Zeit, Geduld und Flexibilität.</p>
          <h3 style={sectionTitle}>Questions</h3>
          <QuestionList questions={lesenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </section>
      ) : null}

      {activeTab === "hoeren" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 4 · Hören (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Listening"
            title="Hören Sie das Gespräch zweimal und beantworten Sie alle fünf Fragen."
            submissionNote="Submit only the answer letters in this format: 1A, 2B, 3C ..."
          >
            <p style={{ margin: 0 }}>Read the questions first. Listen for rent, additional costs, furniture, pets and public transport.</p>
          </WorkbookTaskCard>
          <iframe src="https://www.youtube.com/embed/Gijr5NHNJ_o?rel=0" title="B1 Wohnung suchen – Teil 4 Hören" style={{ width: "100%", aspectRatio: "16 / 9", border: 0, borderRadius: 10 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
          <h3 style={sectionTitle}>Questions</h3>
          <QuestionList questions={hoerenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </section>
      ) : null}

      {activeTab === "references" ? (
        <WorkbookReferenceAnswers level="B1" lesson={{ title: "B1Day4WohnungSuchen", level: "B1", day: 4, workbookId: "B1Day4WohnungSuchen" }} workbookId="B1Day4WohnungSuchen" />
      ) : null}

      {activeTab === "submit" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Submit workbook answers</h2>
          <WorkbookTaskCard eyebrow="Final step" title="Submit Teil 2, Teil 3 and Teil 4." submissionNote="Do not submit Teil 1.">
            <p style={{ margin: 0 }}>Paste your final opinion text, five reading answer letters and five listening answer letters into the form below.</p>
          </WorkbookTaskCard>
          <div className="b1-day4-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.b1-day4-submission-page > div > section:first-child { display: none !important; }
            .b1-day4-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage submissionContext={{ level: "B1", day: 4, assignmentKey: "B1-2.4", canonicalAssignmentKey: "B1-2.4" }} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
