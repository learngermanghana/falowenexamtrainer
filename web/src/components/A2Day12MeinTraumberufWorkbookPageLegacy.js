import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import ContextualAssignmentSubmissionPage from "./ContextualAssignmentSubmissionPage";
import { WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import { A2B1GrammarNotesTab } from "./A2B1WorkbookGrammarNotes";
import SpeakingMindMap from "./SpeakingMindMap";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import {
  A2_B1_WORKBOOK_TABS_WITH_GRAMMAR,
  WorkbookTabNav,
} from "./StandardWorkbookComponents";

const tabs = A2_B1_WORKBOOK_TABS_WITH_GRAMMAR;

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

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const lesenQuestions = [
  {
    stem: "Was bedeutet „beglaubigen“?",
    options: [
      "A) Man muss einen Kurs besuchen",
      "B) Man unterschreibt das Dokument",
      "C) Eine Behörde prüft, ob das Dokument echt ist",
      "D) Man kauft ein neues Dokument",
    ],
  },
  {
    stem: "Wo kann man prüfen, ob ein Abschluss in Deutschland gültig ist?",
    options: [
      "A) In der Bibliothek",
      "B) Auf der Internetseite „Anerkennung in Deutschland“",
      "C) Beim Supermarkt",
      "D) Beim Arzt",
    ],
  },
  {
    stem: "Was ist eine gute Quelle für regionale Stellenangebote?",
    options: ["A) Das Fernsehen", "B) Die Zeitung", "C) Die Universität", "D) Der Zoo"],
  },
  {
    stem: "Was ist das BIZ?",
    options: [
      "A) Ein Sprachkurs",
      "B) Ein Ort für Freizeitaktivitäten",
      "C) Berufsinformationszentrum",
      "D) Ein Supermarkt",
    ],
  },
  {
    stem: "Was hilft bei der Arbeitssuche besonders gut?",
    options: ["A) Ein Tanzkurs", "B) Ein Praktikum", "C) Eine Grillparty", "D) Eine Urlaubsreise"],
  },
  {
    stem: "Was gehört NICHT zu den Bewerbungsunterlagen?",
    options: ["A) Ein Lebenslauf", "B) Ein Bewerbungsfoto", "C) Ein Kochrezept", "D) Ein Anschreiben"],
  },
  {
    stem: "Wer bekommt Beratung beim Jugendmigrationsdienst?",
    options: ["A) Kinder unter 10 Jahren", "B) Menschen über 50", "C) Menschen unter 27 Jahren", "D) Nur Männer"],
  },
];

const hoerenQuestions = [
  {
    stem: "Wann beginnt Dr. Müllers Arbeitstag?",
    options: ["A) Um 5:00 Uhr", "B) Um 6:00 Uhr", "C) Um 7:00 Uhr", "D) Um 8:00 Uhr"],
  },
  {
    stem: "Was macht Dr. Müller um 7:00 Uhr?",
    options: [
      "A) Liest die Patientenakten",
      "B) Bereitet sich auf die Visite vor",
      "C) Beginnt die Visite auf der Station",
      "D) Hat eine Besprechung mit Kollegen",
    ],
  },
  {
    stem: "Wann beginnt die Sprechstunde?",
    options: ["A) Um 8:00 Uhr", "B) Um 9:00 Uhr", "C) Um 10:00 Uhr", "D) Um 11:00 Uhr"],
  },
  {
    stem: "Was macht Dr. Müller oft während seiner Mittagspause?",
    options: [
      "A) Isst in Ruhe",
      "B) Führt wichtige Telefonate",
      "C) Geht spazieren",
      "D) Liest ein Buch",
    ],
  },
  {
    stem: "Wann endet Dr. Müllers Arbeitstag selten?",
    options: ["A) Vor 16:00 Uhr", "B) Vor 17:00 Uhr", "C) Vor 18:00 Uhr", "D) Vor 19:00 Uhr"],
  },
];

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const A2Day12MeinTraumberufWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  const submissionContext = {
    level: "A2",
    day: 12,
    assignmentKey: "A2-5.12",
    canonicalAssignmentKey: "A2-5.12",
    workbookId: "A2Day12MeinTraumberuf",
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 12 Workbook · Mein Traumberuf</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Select Grammar, Teil 1–4, Ref or Submit below.
        </p>

        <div style={{ position: "sticky", top: 0, zIndex: 20, padding: 10, margin: "0 -4px", border: "1px solid #bfdbfe", borderRadius: 14, background: "rgba(255,255,255,0.98)", boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)" }}>
          <WorkbookTabNav
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={tabs}
            ariaLabel="A2 Day 12 workbook sections"
          />
        </div>
      </div>

      {activeTab === "grammar" && <div style={card}><A2B1GrammarNotesTab level="A2" day={12} /></div>}

      {activeTab === "sprechen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
            alt="Learners discussing career goals in a classroom"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Prepare one clear answer about your dream job. Open each mind-map branch, practise the sentence, and connect the parts.
          </p>
          <SpeakingMindMap config={getA2SpeakingMindMap(12)} />
          <SpeakingPracticeTimerCard />

          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Learner writing a formal job application email"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 · Assignment: Schreiben</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Aufgabe: Bewerbung um eine Stelle – Fähigkeiten und Fertigkeiten</strong>
          </p>
          <p style={{ margin: 0 }}>
            Sie sind jetzt in Deutschland und möchten sich um eine Arbeitsstelle bewerben. Schreiben Sie eine E-Mail an
            ein Unternehmen, in der Sie:
          </p>
          <ul style={listSpacing}>
            <li>Fragen, ob es noch offene Stellen in der Firma gibt.</li>
            <li>Ihre Fähigkeiten und Fertigkeiten beschreiben, die für den Job relevant sind.</li>
            <li>Fragen nach den Arbeitszeiten und dem Gehalt.</li>
          </ul>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area (same workflow as usual), not directly on this
            page.
          </p>
          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
            alt="Reading worksheet with professional qualification content"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 · Lesen</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit
            section at the bottom of the lesson to send your answers.
          </p>

          <h3 style={sectionTitle}>Zeugnisse und Anerkennung</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In Ihrem Heimatland haben Sie eine Berufsausbildung mit Abschluss, einen Hochschulabschluss oder
            Schulabschluss gemacht? Dann müssen Sie diese Zeugnisse / Dokumente übersetzen und beglaubigen lassen.
            Beglaubigen heißt: Eine offizielle Instanz prüft, ob Ihre Dokumente echt sind. Das macht am besten eine
            Behörde in Ihrem Heimatland. Manchmal ist Ihr Abschluss in Deutschland nicht gültig. Das können Sie schon in
            Ihrem Heimatland prüfen (Anerkennung ausländischer Abschlüsse). Auf der Internetseite „Anerkennung in
            Deutschland“ bekommen Sie mehr Informationen. Sehen Sie sich hierzu auch unsere Infografiken an.
          </p>

          <h3 style={sectionTitle}>Freie Stellen</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Sie haben eine Arbeitserlaubnis? Dann können Sie eine Stelle suchen. Es gibt viele Möglichkeiten: Internet,
            Zeitung, Arbeitsagentur / Jobcenter. In der Zeitung finden Sie meistens nur regionale Stellenangebote, aber
            sie sind aktuell. Im Internet gibt es viele Anzeigen, aber nicht alle sind aktuell. Das Jobcenter berät Sie
            und sucht passende Stellen für Sie. Sie können auch direkt bei einer Firma nachfragen. Manche Stellen sind
            nicht öffentlich ausgeschrieben. Besuchen Sie auch die Internetseite einer Firma (dort findet man manchmal
            freie Stellen) und das BIZ (Berufsinformationszentrum) der Arbeitsagentur. Dort gibt es Stellenanzeigen,
            viele Informationen zum Thema Beruf und Arbeit und Berufsberatung. Im BIZ und beim Jobcenter können Sie auch
            Ihr Profil ins Internet stellen. Ein Praktikum in einer Firma kann ebenfalls nützlich sein: Sie lernen die
            Arbeit kennen und knüpfen Kontakte.
          </p>

          <h3 style={sectionTitle}>Bewerbung</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Die Bewerbung ist der erste Schritt in den Arbeitsmarkt. Sehr wichtig sind die Bewerbungsunterlagen: ein
            Anschreiben (Brief an die Firma), ein gutes Bewerbungsfoto, ein Lebenslauf, Ihre Zeugnisse (auf Deutsch).
            Das BIZ bietet Workshops an: „Bewerbung in Deutschland“ – dort lernt man, wie eine Bewerbung aussieht und wie
            man sich auf das Vorstellungsgespräch vorbereitet. In vielen Städten gibt es Beratungsstellen für Migranten.
            Dort hilft man Ihnen bei der Arbeitssuche und der Bewerbung (siehe Bundesamt für Migration und Flüchtlinge,
            BAMF). Für junge Menschen bis 27 Jahre gibt es bei den Jugendmigrationsdiensten eine spezielle Beratung.
          </p>

          <h3 style={sectionTitle}>Fragen zum Text</h3>
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
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones used for German listening practice"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 · Hören</h2>
          <p style={{ margin: 0 }}>
            Listen to the audio, then submit your answers in the assignment area (do not answer directly on this page).
          </p>
          <p style={{ margin: 0 }}>
            Audio link:{" "}
            <a
              href="https://drive.google.com/file/d/1XqRF0mQZs6UFpPHjEaX7fp7XRS652onL/view?usp=sharing"
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
            <a href="https://youtu.be/w81bsmssGXQ" target="_blank" rel="noreferrer">
              Mein Traumberuf | A2 German Lesson
            </a>
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/w81bsmssGXQ"
            title="Mein Traumberuf | A2 German Lesson"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="A2"
          lesson={{ title: "A2Day12MeinTraumberuf", level: "A2", day: 12, workbookId: "A2Day12MeinTraumberuf" }}
          workbookId="A2Day12MeinTraumberuf"
        />
      )}

      {activeTab === "submit" && (
        <div style={card}>
          <ContextualAssignmentSubmissionPage submissionContext={submissionContext} />
        </div>
      )}
    </div>
  );
};

export default A2Day12MeinTraumberufWorkbookPage;