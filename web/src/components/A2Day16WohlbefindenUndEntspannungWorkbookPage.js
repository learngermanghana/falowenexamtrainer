import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen" },
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
    stem: "Welche Anzeige informiert über einen Kochkurs für gesunde Ernährung?",
    options: ["A) Anzeige A", "B) Anzeige C", "C) Anzeige D", "D) Anzeige F"],
  },
  {
    stem: "Wo kann man einen Rabatt für eine Jahresmitgliedschaft im Fitnessstudio bekommen?",
    options: ["A) Anzeige B", "B) Anzeige A", "C) Anzeige E", "D) Anzeige C"],
  },
  {
    stem: "Wer bietet Physiotherapie speziell für Rückenschmerzen an?",
    options: ["A) Anzeige D", "B) Anzeige E", "C) Anzeige B", "D) Anzeige F"],
  },
  {
    stem: "Welche Anzeige ist für eine Laufgruppe im Stadtpark?",
    options: ["A) Anzeige A", "B) Anzeige C", "C) Anzeige F", "D) Anzeige D"],
  },
  {
    stem: "Wo kann man einen Yoga-Kurs für Anfänger besuchen?",
    options: ["A) Anzeige A", "B) Anzeige B", "C) Anzeige E", "D) Anzeige D"],
  },
];

const hoerenQuestions = [
  {
    stem: "Was wird als ein einfacher Anfang für eine gesunde Ernährung empfohlen?",
    options: ["A) Mehr Fleisch essen", "B) Mehr Obst und Gemüse essen", "C) Mehr Fast Food essen", "D) Keine Veränderung"],
  },
  {
    stem: "Wie lange sollte man täglich mindestens gehen oder sich bewegen?",
    options: ["A) 10 Minuten", "B) 20 Minuten", "C) 30 Minuten", "D) 60 Minuten"],
  },
  {
    stem: "Was kann motivierend sein, um fit zu bleiben?",
    options: ["A) Der Besuch eines Fitnessstudios", "B) Mehr zu schlafen", "C) Mehr Fernsehen schauen", "D) Süßigkeiten essen"],
  },
  {
    stem: "Warum ist der regelmäßige Besuch beim Arzt wichtig?",
    options: ["A) Um neue Rezepte zu bekommen", "B) Um Krankheiten frühzeitig zu erkennen", "C) Um Medikamente zu kaufen", "D) Um Sport zu vermeiden"],
  },
  {
    stem: "Welche Sportarten werden im Text als motivierend erwähnt?",
    options: ["A) Yoga und Pilates", "B) Schwimmen und Laufen", "C) Tanzen und Radfahren", "D) Tennis und Golf"],
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

const A2Day16WohlbefindenUndEntspannungWorkbookPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 16 Workbook · Wohlbefinden und Entspannung</h1>
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
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80"
            alt="People meditating together for well-being and relaxation"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we&apos;ll engage in group exercises discussing these topics.
          </p>

          <h3 style={sectionTitle}>Zentrales Thema: „Wohlbefinden, Entspannung &amp; Gesundheit“</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Körperliches Wohlbefinden (Physical Well-being)</strong>
              <ul style={listSpacing}>
                <li>Gesunde Ernährung: Obst, Gemüse, viel Wasser trinken</li>
                <li>Bewegung: Sport treiben, spazieren gehen, Yoga machen</li>
                <li>Schlaf: Genug schlafen, früher ins Bett gehen</li>
                <li>Wellness: Massagen, Sauna, heiße Bäder</li>
              </ul>
            </li>
            <li>
              <strong>Mentales Wohlbefinden (Mental Well-being)</strong>
              <ul style={listSpacing}>
                <li>Entspannung: Meditation, Atemübungen, Ruhe genießen</li>
                <li>Hobbys: Lesen, Musik hören, kreativ sein</li>
                <li>Digitale Auszeit: Weniger Zeit am Handy, soziale Medien pausieren</li>
                <li>Freunde &amp; Familie: Gespräche führen, lachen, Zeit zusammen verbringen</li>
              </ul>
            </li>
            <li>
              <strong>Krankheiten &amp; Symptome (Illnesses &amp; Symptoms)</strong>
              <ul style={listSpacing}>
                <li>Krankheiten: Erkältung, Grippe, Kopfschmerzen, Bauchschmerzen, Fieber, Husten</li>
                <li>Symptome: Halsschmerzen, Schnupfen, Schwindel, Übelkeit, Müdigkeit</li>
              </ul>
            </li>
            <li>
              <strong>Beim Arzt (At the Doctor&apos;s)</strong>
              <ul style={listSpacing}>
                <li>Termin machen: „Ich möchte einen Termin vereinbaren.“</li>
                <li>Gespräch beim Arzt: „Was fehlt Ihnen?", „Ich habe Kopfschmerzen."</li>
                <li>Untersuchung &amp; Diagnose: „Wir machen einen Bluttest.", „Sie brauchen ein Rezept."</li>
              </ul>
            </li>
            <li>
              <strong>Körperteile (Parts of the Body)</strong>
              <ul style={listSpacing}>
                <li>Kopf, Hals, Bauch, Rücken</li>
                <li>Arm, Hand, Finger</li>
                <li>Bein, Fuß, Zehen</li>
                <li>Auge, Nase, Ohr</li>
              </ul>
            </li>
            <li>
              <strong>Gesunde Lebensweise (Healthy Living)</strong>
              <ul style={listSpacing}>
                <li>Ernährung: Viel Gemüse und Obst essen, ausreichend Wasser trinken</li>
                <li>Sport &amp; Bewegung: Joggen, Yoga, Schwimmen, Spazierengehen</li>
                <li>Entspannung: Genug schlafen, Stress abbauen</li>
                <li>Regelmäßige Vorsorgeuntersuchungen: Arztbesuche nicht vergessen</li>
              </ul>
            </li>
            <li>
              <strong>Medizin &amp; Heilmittel (Medicine &amp; Remedies)</strong>
              <ul style={listSpacing}>
                <li>Verschreibungspflichtige Medikamente: Antibiotika, Schmerzmittel</li>
                <li>Freiverkäufliche Medikamente: Nasenspray, Hustensaft, Halstabletten</li>
                <li>Hausmittel: Kräutertee, Inhalieren, Ingwer mit Honig</li>
              </ul>
            </li>
            <li>
              <strong>Freizeit &amp; Stressbewältigung (Leisure &amp; Coping with Stress)</strong>
              <ul style={listSpacing}>
                <li>Musik &amp; Kunst: Instrument spielen, malen, tanzen</li>
                <li>Lesen &amp; Filme: Bücher lesen, Filme oder Serien schauen</li>
                <li>Natur genießen: Wandern, am Strand entspannen, Gartenarbeit</li>
                <li>Spiele &amp; Unterhaltung: Videospiele, Brettspiele, Sport</li>
              </ul>
            </li>
            <li>
              <strong>Eigene Meinung (Own Opinion)</strong>
              <ul style={listSpacing}>
                <li>Was machst du, um dich zu entspannen?</li>
                <li>Wie wichtig ist Gesundheit für dich?</li>
                <li>Wie verbringst du deine Freizeit?</li>
                <li>Hast du schon einmal eine Krankheit gehabt? Wie hast du dich gefühlt?</li>
              </ul>
            </li>
          </ol>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>💬 Frage des Tages</strong>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              Was machen Sie für Ihr Wohlbefinden, Ihre Entspannung und Ihre Gesundheit?
            </p>
            <p style={{ margin: 0 }}>
              <strong>Vier Schlüsselwörter:</strong> Sport · Schlaf · gesunde Ernährung · Freizeit
            </p>
          </div>
          <SpeakingPracticeTimerCard />

          <div style={questionCardStyle}>
            <strong>📝 Beispielantwort</strong>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              „Wenn ich gestresst bin, höre ich Musik und lese ein Buch. Ich gehe auch oft spazieren, um frische Luft zu
              bekommen. Gesundheit ist mir sehr wichtig, deshalb esse ich viel Obst und Gemüse. Wenn ich krank bin, trinke
              ich Kräutertee und schlafe viel.“
            </p>
          </div>

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
          <div style={{ ...questionCardStyle, background: "#ecfeff" }}>
            <strong>Modellantwort (ca. 30–45 Sekunden)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Heute spreche ich über Wohlbefinden und Entspannung. Für mich ist Ruhe wichtig, weil ich nach der Arbeit oft müde bin. Ich gehe spazieren, höre Musik oder trinke Tee. Außerdem schlafe ich genug, deshalb fühle ich mich besser. Zum Beispiel mache ich am Abend mein Handy aus und lese zehn Minuten. Zum Schluss finde ich: Kleine Pausen sind wichtig für Körper und Kopf.“
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
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80"
            alt="Person writing an email to a doctor"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Aufgabenstellung (A2-Niveau):</strong> Sie möchten einen Arzt wegen Ihrer Gesundheit kontaktieren.
            Schreiben Sie einen Brief oder eine E-Mail an den Arzt.
          </p>
          <ol style={listSpacing}>
            <li>Fragen Sie nach einem Termin (z. B. wann Sie kommen können).</li>
            <li>Fragen Sie nach den Kosten oder ob Ihre Versicherung die Behandlung abdeckt.</li>
            <li>Fragen Sie nach möglichen Untersuchungen oder Behandlungen, die der Arzt vorschlägt.</li>
          </ol>

          <div style={{ ...questionCardStyle, background: "#f9fafb" }}>
            <strong>Writing guidance before submission</strong>
            <ul style={listSpacing}>
              <li>Nutzen Sie eine höfliche Anrede und nennen Sie den Grund Ihrer Nachricht direkt am Anfang.</li>
              <li>Beantworten Sie alle drei Aufgabenpunkte mit klaren, kurzen A2-Sätzen.</li>
              <li>Schließen Sie die Nachricht höflich ab und unterschreiben Sie mit Ihrem Namen.</li>
            </ul>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area (not on this workbook page).
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
            src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1600&q=80"
            alt="Student reading practice ads in a workbook"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 · Lesen (Exercise)</h2>
          <p style={{ margin: 0 }}>
            Aufgabe: Wählen Sie die richtige Anzeige aus, die zu den folgenden Fragen passt. <strong>Do not answer directly on
            this page.</strong>
          </p>

          <h3 style={sectionTitle}>Anzeigen</h3>
          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Anzeige A</strong>
            <span>Yoga-Kurs für Anfänger (Mo/Do 18:00–19:00), kostenlos mit Anmeldung.</span>
            <span>Kontakt: yoga@fit.de · 030-987654321</span>
          </div>
          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Anzeige B</strong>
            <span>Fitnessstudio Mitgliedschaft mit 20% Rabatt auf Jahresmitgliedschaften.</span>
            <span>Adresse: Hauptstraße 12 · 030-123456789</span>
          </div>
          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Anzeige C</strong>
            <span>Gesunde Ernährung Kochkurs, jeden Samstag um 10:00 Uhr.</span>
            <span>Kontakt: kochkurs@gesund.de · www.gesund-kochen.de</span>
          </div>
          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Anzeige D</strong>
            <span>Zahnarztpraxis Dr. Müller: Zahnreinigung, Vorsorge, Behandlungen.</span>
            <span>Mo–Fr 8:00–18:00 · Zahnstraße 5 · 030-123456</span>
          </div>
          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Anzeige E</strong>
            <span>Physiotherapiezentrum Gesund für Rückenschmerzen, Sportverletzungen u. a.</span>
            <span>Kontakt: physiotherapie@gesund.de · 030-654321987</span>
          </div>
          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Anzeige F</strong>
            <span>Laufgruppe im Stadtpark, Sonntag 9:00 Uhr am Haupteingang.</span>
            <span>Kontakt: laufgruppe@gesund.de</span>
          </div>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {lesenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your answers in the assignment submission area (not on this workbook page).
          </p>

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?auto=format&fit=crop&w=1600&q=80"
            alt="Learner doing listening practice with headphones"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 · Hören (Exercise)</h2>
          <p style={{ margin: 0 }}>
            Audio: <a href="https://drive.google.com/file/d/1xexwu1sM-Prp_2iyhBbY7UP-91gJ1S5G/view?usp=sharing" target="_blank" rel="noreferrer">Open Teil 4 audio</a>
          </p>
          <p style={{ margin: 0 }}>Listen carefully, then submit your final answers in the assignment submission area.</p>

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
            Recommended video: <a href="https://youtu.be/r4se8KuS8cA" target="_blank" rel="noreferrer">Wohlbefinden und Entspannung 6.16</a>
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/r4se8KuS8cA"
            title="Wohlbefinden und Entspannung 6.16"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your answers in the assignment submission area (not on this workbook page).
          </p>

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="A2" lesson={{ title: "A2Day16WohlbefindenUndEntspannung", level: "A2", workbookId: "A2Day16WohlbefindenUndEntspannung" }} workbookId="A2Day16WohlbefindenUndEntspannung" />
      )}

    </div>
  );
};

export default A2Day16WohlbefindenUndEntspannungWorkbookPage;
