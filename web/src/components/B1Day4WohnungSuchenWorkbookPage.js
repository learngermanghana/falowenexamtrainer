import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import CoursebookAudioPlayer from "./CoursebookAudioPlayer";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen (Group Practice No assignment)" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
  { key: "references", label: "5. Ref" },
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

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: { border: "#bfdbfe", background: "#eff6ff", color: "#1e3a8a" },
    green: { border: "#bbf7d0", background: "#f0fdf4", color: "#166534" },
    amber: { border: "#fde68a", background: "#fffbeb", color: "#92400e" },
  };
  const selected = tones[tone] || tones.blue;

  return (
    <div
      style={{
        border: `1px solid ${selected.border}`,
        background: selected.background,
        color: selected.color,
        borderRadius: 12,
        padding: 14,
        lineHeight: 1.7,
      }}
    >
      {children}
    </div>
  );
};

const lesenQuestions = [
  {
    stem: "1. Warum ist die Wohnungssuche in Großstädten schwierig?",
    options: [
      "A) Wegen der vielen Neubauten",
      "B) Wegen des Mangels an bezahlbarem Wohnraum",
      "C) Wegen der hohen Gehälter",
    ],
  },
  {
    stem: "2. Was führt zu einer geringeren Chance auf eine Zusage?",
    options: [
      "A) Hohe Nachfrage nach Wohnungen",
      "B) Geringe Anzahl von Vermietern",
      "C) Zentrale Lage",
    ],
  },
  {
    stem: "3. Warum kaufen Investoren Wohnungen auf?",
    options: [
      "A) Um sie zu renovieren",
      "B) Um sie als Ferienwohnungen oder Luxusapartments zu nutzen",
      "C) Um sie günstig zu vermieten",
    ],
  },
  {
    stem: "4. Welche Maßnahmen ergreift die Politik?",
    options: [
      "A) Erhöhung der Mieten",
      "B) Einführung der Mietpreisbremse und Neubauprogramme",
      "C) Schließung von Altbauwohnungen",
    ],
  },
  {
    stem: "5. Warum bevorzugen Familien mit Kindern bestimmte Wohnungen?",
    options: [
      "A) Wegen der Nähe zu Schulen und Kindergärten",
      "B) Wegen der größeren Wohnungsgröße",
      "C) Wegen der besseren Verkehrsanbindung",
    ],
  },
  {
    stem: "6. Welche Eigenschaft ist laut dem Text bei der Wohnungssuche wichtig?",
    options: [
      "A) Geduld und Flexibilität",
      "B) Hohes Einkommen",
      "C) Zentralität der Wohnung",
    ],
  },
  {
    stem: "7. Was lässt sich zusammenfassend über die Wohnungssuche sagen?",
    options: [
      "A) Sie ist einfach und schnell erledigt.",
      "B) Sie erfordert Zeit und Geduld.",
      "C) Sie ist nur für Investoren interessant.",
    ],
  },
];

const hoerenQuestions = [
  {
    stem: "1. Wie hoch ist die Miete?",
    options: ["A) 850 Euro", "B) 950 Euro", "C) 1050 Euro"],
  },
  {
    stem: "2. Was kosten die Nebenkosten?",
    options: ["A) 100 Euro", "B) 150 Euro", "C) 200 Euro"],
  },
  {
    stem: "3. Ist die Wohnung möbliert?",
    options: ["A) Ja", "B) Nein", "C) Teilweise"],
  },
  {
    stem: "4. Welche Haustiere sind erlaubt?",
    options: ["A) Hunde", "B) Kleine Haustiere", "C) Keine Haustiere"],
  },
  {
    stem: "5. Was sagt der Vermieter über die Verkehrsanbindung?",
    options: [
      "A) Es gibt keine öffentlichen Verkehrsmittel in der Nähe.",
      "B) Es gibt eine U-Bahn-Station und mehrere Bushaltestellen in der Nähe.",
      "C) Es gibt nur eine Bushaltestelle in der Nähe.",
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

const B1Day4WohnungSuchenWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);
  const setPreparedFor = (tabKey) => (event) =>
    setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          B1 · Day 4 Workbook · Wohnung suchen (Übung) 2.4
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Beschreibe Wohnungsmöglichkeiten, vergleiche Suchmethoden und begründe deine Meinung mit klaren B1-Strukturen.
        </p>

        <NoteBox>
          <strong>Grammar focus:</strong> zweiteilige Konnektoren – <em>sowohl … als auch, nicht nur … sondern auch, zwar … aber, einerseits … andererseits, entweder … oder</em> und <em>weder … noch</em>.
        </NoteBox>

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
            src="https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80"
            alt="Wohnungen in einer Großstadt"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />

          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Tauscht euch in der Gruppe über Wohnungssuche, Wohnformen, wichtige Kriterien und mögliche Kompromisse aus.
          </p>

          <h3 style={sectionTitle}>Zentrales Thema</h3>
          <p style={{ margin: 0 }}>
            <strong>Wohnung suchen</strong>
          </p>

          <h3 style={sectionTitle}>Wortschatzfelder</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Wohnungsarten</strong>
              <ul style={listSpacing}>
                <li>Mietwohnung</li>
                <li>Eigentumswohnung</li>
                <li>WG / Wohngemeinschaft</li>
                <li>Einzimmerwohnung</li>
                <li>Mehrfamilienhaus</li>
              </ul>
            </li>
            <li>
              <strong>Wohnungssuche</strong>
              <ul style={listSpacing}>
                <li>Online-Portale</li>
                <li>Zeitungsanzeigen</li>
                <li>Immobilienmakler</li>
                <li>Mundpropaganda</li>
                <li>Aushänge in Supermärkten</li>
              </ul>
            </li>
            <li>
              <strong>Kriterien und Anforderungen</strong>
              <ul style={listSpacing}>
                <li>Mietpreis, Kaution und Nebenkosten</li>
                <li>Lage und Verkehrsanbindung</li>
                <li>Einkaufsmöglichkeiten</li>
                <li>Wohnungsgröße und Ausstattung</li>
                <li>Haustiere erlaubt?</li>
              </ul>
            </li>
            <li>
              <strong>Besichtigung und Vertrag</strong>
              <ul style={listSpacing}>
                <li>Besichtigungstermin vereinbaren</li>
                <li>Fragen stellen</li>
                <li>Mietvertrag prüfen</li>
                <li>Kündigungsfrist</li>
                <li>Mieterschutz</li>
              </ul>
            </li>
            <li>
              <strong>Einzug und Einrichtung</strong>
              <ul style={listSpacing}>
                <li>Umzug planen und Möbel kaufen</li>
                <li>Nachbarn kennenlernen</li>
                <li>sich beim Einwohnermeldeamt anmelden</li>
                <li>Internet und Strom anmelden</li>
              </ul>
            </li>
          </ol>

          <NoteBox tone="green">
            <strong>Hauptfrage für die Diskussion:</strong><br />
            Welche Methode ist bei der Wohnungssuche erfolgreicher: Online-Portale oder persönliche Kontakte? Begründe deine Meinung, nenne Vor- und Nachteile und gib ein konkretes Beispiel.
          </NoteBox>

          <h3 style={sectionTitle}>Weitere Diskussionsfragen</h3>
          <ul style={listSpacing}>
            <li>Welche drei Kriterien sind für dich bei einer Wohnung unverzichtbar?</li>
            <li>Welche Kompromisse würdest du bei einer schwierigen Wohnungssuche eingehen?</li>
            <li>Welche Vor- und Nachteile hat eine WG im Vergleich zu einer eigenen Wohnung?</li>
            <li>Welche Fragen sollte man bei einer Besichtigung unbedingt stellen?</li>
            <li>Ist eine zentrale Lage wichtiger als eine günstige Miete?</li>
          </ul>

          <h3 style={sectionTitle}>B1-Sprechstruktur</h3>
          <ol style={listSpacing}>
            <li><strong>Meinung:</strong> Meiner Meinung nach …</li>
            <li><strong>Begründung:</strong> Der wichtigste Grund dafür ist, dass …</li>
            <li><strong>Beispiel:</strong> Ein gutes Beispiel dafür ist …</li>
            <li><strong>Gegenseite:</strong> Einerseits …, andererseits …</li>
            <li><strong>Schluss:</strong> Deshalb würde ich …</li>
          </ol>

          <NoteBox tone="amber">
            Verwende in deiner Antwort mindestens zwei zweiteilige Konnektoren. Sprich 60 bis 90 Sekunden und entwickle deine Idee über einen einzelnen Satz hinaus.
          </NoteBox>

          <SpeakingPracticeTimerCard storageKey="b1-day4-sprechen-group-practice" />
          <CourseInlinePracticePanel type="speaking" />

          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is group practice only and has no assignment submission.
          </p>
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Studentin schreibt einen Meinungsbeitrag"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />

          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Thema: <strong>Wohnung suchen und persönliche Kontakte</strong>
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Sie haben im Fernsehen eine Diskussionssendung zum Thema „Wohnung suchen und persönliche Kontakte“ gesehen.
            Im Online-Gästebuch der Sendung finden Sie folgende Meinung:
          </p>

          <div style={questionCardStyle}>
            <strong>Tanja:</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Ich finde es wichtig, dass man bei der Wohnungssuche persönliche Kontakte nutzt. Heute suchen jedoch viele Menschen online und haben dabei oft keinen direkten Kontakt zu Vermietern oder möglichen Mitbewohnern. Meiner Meinung nach kann das die Wohnungssuche schwieriger machen, weil persönliche Empfehlungen häufig hilfreicher sind als anonyme Online-Anzeigen.“
            </p>
          </div>

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Schreiben Sie nun Ihre Meinung zum Thema. Schreiben Sie circa <strong>80 Wörter</strong>.
          </p>

          <h3 style={sectionTitle}>Schreibplan</h3>
          <ol style={listSpacing}>
            <li>Führen Sie kurz in das Thema ein.</li>
            <li>Sagen Sie klar, ob Sie Tanjas Meinung zustimmen.</li>
            <li>Nennen Sie mindestens einen Vorteil persönlicher Kontakte.</li>
            <li>Nennen Sie mindestens einen Vorteil oder Nachteil von Online-Portalen.</li>
            <li>Geben Sie ein Beispiel oder eine persönliche Erfahrung.</li>
            <li>Formulieren Sie einen klaren Schluss.</li>
          </ol>

          <NoteBox tone="green">
            <strong>Sprachziel:</strong> Verwenden Sie mindestens zwei verschiedene zweiteilige Konnektoren, zum Beispiel:<br />
            „Sowohl Online-Portale als auch persönliche Kontakte können hilfreich sein.“<br />
            „Online-Portale bieten zwar viele Anzeigen, aber die Konkurrenz ist groß.“
          </NoteBox>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Writing practice before submission</strong>
            <CourseInlinePracticePanel type="writing" />
          </div>

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
            alt="Lesetext und Notizen"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />

          <h2 style={sectionTitle}>Teil 3 · Lesen (Exercise)</h2>
          <h3 style={sectionTitle}>Die Herausforderungen der Wohnungssuche in Großstädten</h3>

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In vielen Großstädten Deutschlands wird die Wohnungssuche zu einer echten Herausforderung. Es gibt viele Gründe dafür, warum es schwierig ist, eine passende Wohnung zu finden. Einer der Hauptgründe ist der Mangel an bezahlbarem Wohnraum. Besonders in beliebten Vierteln sind die Mieten in den letzten Jahren stark gestiegen. Viele Menschen müssen sich daher mit kleineren Wohnungen oder mit einer Wohnung in weniger zentraler Lage zufriedengeben.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Ein weiteres Problem ist die hohe Nachfrage nach Wohnungen. In Städten wie Berlin, München oder Hamburg gibt es mehr Wohnungssuchende als verfügbare Wohnungen. Dies führt dazu, dass sich viele Interessenten um dieselbe Wohnung bewerben, was die Chancen auf eine Zusage reduziert. Oft entscheiden sich Vermieter für Bewerber mit höherem Einkommen oder einem sicheren Arbeitsplatz.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Hinzu kommt der Konkurrenzdruck durch Investoren. Viele Wohnungen werden von Investoren aufgekauft und anschließend als Ferienwohnungen oder Luxusapartments genutzt. Dadurch wird der Markt für normale Mieter zusätzlich verkleinert. Die Politik versucht, mit Maßnahmen wie der Mietpreisbremse und Neubauprogrammen gegenzusteuern, doch die Wirkung dieser Maßnahmen ist umstritten.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Neben diesen äußeren Faktoren spielen persönliche Umstände eine wichtige Rolle. Wer zum Beispiel auf eine bestimmte Wohnungsgröße oder Ausstattung angewiesen ist, hat es oft schwerer, etwas Passendes zu finden. Familien mit Kindern bevorzugen häufig Wohnungen in der Nähe von Schulen und Kindergärten, während junge Berufstätige oft eine Wohnung in der Nähe ihres Arbeitsplatzes suchen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Zusammenfassend lässt sich sagen, dass die Wohnungssuche in Großstädten eine komplexe Aufgabe ist, die viel Zeit und Geduld erfordert. Es ist wichtig, flexibel zu bleiben und gegebenenfalls Kompromisse einzugehen, um eine passende Wohnung zu finden.
          </p>

          <h3 style={sectionTitle}>Multiple-Choice Questions</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {lesenQuestions.map((question) => (
              <div key={question.stem} style={questionCardStyle}>
                <strong>{question.stem}</strong>
                {question.options.map((option) => (
                  <span key={option}>{option}</span>
                ))}
              </div>
            ))}
          </div>

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80"
            alt="Lernende Person hört einen Wohnungstext"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />

          <h2 style={sectionTitle}>Teil 4 · Hören (Exercise)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Hören Sie das Gespräch über eine Wohnung zweimal. Lesen Sie zuerst die Fragen und achten Sie besonders auf Miete, Nebenkosten, Möblierung, Haustiere und Verkehrsanbindung.
          </p>

          <CoursebookAudioPlayer
            url="https://drive.google.com/file/d/1zErUZFGcTIUw_I3aasDXM2VlAoPfKsBP/view?usp=sharing"
            linkLabel="Open listening audio"
          />

          <h3 style={sectionTitle}>Multiple-Choice Questions</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {hoerenQuestions.map((question) => (
              <div key={question.stem} style={questionCardStyle}>
                <strong>{question.stem}</strong>
                {question.options.map((option) => (
                  <span key={option}>{option}</span>
                ))}
              </div>
            ))}
          </div>

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="B1"
          lesson={{ title: "B1Day4WohnungSuchen", level: "B1", workbookId: "B1Day4WohnungSuchen" }}
          workbookId="B1Day4WohnungSuchen"
        />
      )}
    </div>
  );
};

export default B1Day4WohnungSuchenWorkbookPage;
