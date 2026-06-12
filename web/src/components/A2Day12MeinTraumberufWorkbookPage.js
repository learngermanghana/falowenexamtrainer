import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";

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

const A2Day12MeinTraumberufWorkbookPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 12 Workbook · Mein Traumberuf</h1>
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
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
            alt="Learners discussing career goals in a classroom"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we&apos;ll engage in group exercises discussing <strong>„Mein Traumberuf“</strong>.
          </p>

          <h3 style={sectionTitle}>Instructions · Zentrales Thema: „Mein Traumberuf“</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Was ist dein Traumberuf?</strong>
              <ul style={listSpacing}>
                <li>Interessen und Hobbys – Was macht dir Spaß? (interests and hobbies — what is fun for you?)</li>
                <li>Gehalt – Ist der Beruf gut bezahlt? (salary — is the job well paid?)</li>
                <li>Möglichkeiten – Gibt es viele Jobs? (opportunities — are there many jobs?)</li>
                <li>
                  Beispiele für Traumberufe: Arzt, Lehrer, Musiker, Ingenieur, Koch, Designer, Pilot, Polizist (example dream jobs: doctor, teacher, musician, engineer, cook/chef, designer, pilot, police officer).
                </li>
              </ul>
            </li>
            <li>
              <strong>Wo möchtest du arbeiten?</strong>
              <ul style={listSpacing}>
                <li>Im Büro – Computerarbeit, Meetings (in an office — computer work, meetings)</li>
                <li>Zu Hause – Flexibel, kein Arbeitsweg (at home — flexible, no commute)</li>
                <li>Draußen – Viel Bewegung, frische Luft (outside — lots of movement, fresh air)</li>
                <li>Reisen – Neue Länder sehen, viele Menschen treffen (traveling — seeing new countries, meeting many people)</li>
              </ul>
            </li>
            <li>
              <strong>Arbeitest du lieber allein oder im Team?</strong>
              <ul style={listSpacing}>
                <li>Allein arbeiten – Mehr Konzentration, eigene Entscheidungen (working alone — more concentration, own decisions)</li>
                <li>Im Team arbeiten – Zusammenarbeit, Ideen teilen, Unterstützung (working in a team — cooperation, sharing ideas, support)</li>
                <li>
                  Beispiele für Berufe: Allein (Schriftsteller, Fotograf, Künstler) · Im Team (Arzt, Lehrer,
                  Bauarbeiter, Verkäufer) (examples of jobs: alone — writer, photographer, artist; in a team — doctor, teacher, construction worker, salesperson)
                </li>
              </ul>
            </li>
            <li>
              <strong>Welche Fähigkeiten braucht man?</strong>
              <ul style={listSpacing}>
                <li>
                  Soft Skills: Kommunikation, Teamarbeit, Kreativität, Zeitmanagement, Geduld und Ausdauer (soft skills: communication, teamwork, creativity, time management, patience, and perseverance).
                </li>
                <li>Hard Skills: Computerkenntnisse, Mathematik, handwerkliches Geschick, Sprachen (hard skills: computer skills, mathematics, practical/craft skills, languages).</li>
              </ul>
            </li>
            <li>
              <strong>Warum interessiert dich dieser Beruf?</strong>
              <ul style={listSpacing}>
                <li>Leidenschaft – „Ich liebe Musik, deshalb möchte ich Musiker werden.“ (passion — “I love music, so I want to become a musician.”)</li>
                <li>Zukunftspläne – „Ich möchte Menschen helfen, deshalb werde ich Arzt.“ (future plans — “I want to help people, so I will become a doctor.”)</li>
                <li>Neue Erfahrungen – „Ich möchte reisen und neue Kulturen kennenlernen.“ (new experiences — “I want to travel and get to know new cultures.”)</li>
              </ul>
            </li>
          </ol>

          <div style={{ ...questionCardStyle, background: "#f9fafb" }}>
            <strong>Beispielantwort (Example Answer)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Mein Traumberuf ist Lehrer. Ich liebe Sprachen und möchte Schülern helfen. Ich arbeite gern im Team
              mit Kollegen. Ich brauche gute Kommunikationsfähigkeiten und Geduld. Ich möchte in einer Schule
              arbeiten, weil ich gern mit Menschen bin.“
            </p>
          </div>

          <h3 style={sectionTitle}>Discussion Questions: Thema Beruf (A2)</h3>
          <p style={{ margin: 0 }}>
            Was möchtest du machen, wo möchtest du arbeiten, und arbeitest du lieber allein oder im Team?
          </p>
          <p style={{ margin: 0, color: "#4b5563" }}>Stichwörter: Traumberuf · Arbeitsplatz · Teamarbeit · Interesse</p>

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
              „Heute spreche ich über meinen Traumberuf. Ich möchte gern im Büro arbeiten, weil ich gern organisiere und mit Menschen spreche. Der Beruf soll interessant sein und gute Arbeitszeiten haben. Außerdem möchte ich Deutsch im Beruf benutzen, deshalb übe ich jeden Tag. Zum Beispiel kann ich später E-Mails schreiben und Kunden helfen. Zum Schluss finde ich: Ein guter Beruf passt zu meinen Stärken und macht mir Freude.“
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
    </div>
  );
};

export default A2Day12MeinTraumberufWorkbookPage;
