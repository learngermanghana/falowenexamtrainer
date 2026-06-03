import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen" },
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
    stem: "Welche Bank hat die längsten Öffnungszeiten?",
    options: ["A) Deutsche Bank", "B) Sparkasse", "C) Volksbank", "D) ING-DiBa"],
  },
  {
    stem: "Welche Bank bietet keine persönlichen Filialen an?",
    options: ["A) Postbank", "B) ING-DiBa", "C) Commerzbank", "D) Sparkasse"],
  },
  {
    stem: "Welche Bank ist zentral gelegen und bietet Beratung für neue Kunden?",
    options: ["A) Sparkasse", "B) Deutsche Bank", "C) Volksbank", "D) Postbank"],
  },
  {
    stem: "Welche Bank hat Filialen in den Vororten?",
    options: ["A) Commerzbank", "B) Deutsche Bank", "C) Volksbank", "D) Sparkasse"],
  },
  {
    stem: "Welche Bank hat die kürzesten Öffnungszeiten?",
    options: ["A) Commerzbank", "B) Postbank", "C) Deutsche Bank", "D) Sparkasse"],
  },
];

const hoerenQuestions = [
  {
    stem: "Welche Dokumente benötigen Sie, um ein Konto zu eröffnen?",
    options: [
      "A) Nur einen Reisepass",
      "B) Reisepass, Meldebescheinigung, Einkommensnachweis",
      "C) Nur einen Einkommensnachweis",
      "D) Keine Dokumente",
    ],
  },
  {
    stem: "Wie lange dauert das Beratungsgespräch?",
    options: ["A) 30 Minuten", "B) Eine Stunde", "C) Zwei Stunden", "D) 15 Minuten"],
  },
  {
    stem: "Wie viele Kontomodelle bietet die Bank an?",
    options: ["A) Zwei", "B) Drei", "C) Vier", "D) Fünf"],
  },
  {
    stem: "Welches Konto ist kostenlos?",
    options: ["A) Basiskonto", "B) Konto mit zusätzlichen Dienstleistungen", "C) Premium-Konto", "D) Geschäftskonto"],
  },
  {
    stem: "Was können Sie tun, um Zeit zu sparen?",
    options: [
      "A) Die Formulare in der Bankfiliale ausfüllen",
      "B) Die Formulare vor dem Termin online ausfüllen",
      "C) Einen Termin absagen",
      "D) Ohne Unterlagen kommen",
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

const A2Day18DieBankAnrufenWorkbookPage = () => {
  const navigate = useNavigate();
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
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 18 Workbook · Die Bank anrufen</h1>
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

      {activeTab === "sprechen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1556742208-999815fca738?auto=format&fit=crop&w=1600&q=80"
            alt="Person calling a bank support line with a notebook open"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we&apos;ll engage in group exercises discussing these topics.</p>

          <h3 style={sectionTitle}>Instructions</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Central Topic:</strong> Write <strong>"Die Bank anrufen"</strong> in the center of your brain map.
            </li>
            <li>
              <strong>Main Branches:</strong> Create five main branches from the central topic:
              <ol style={listSpacing}>
                <li>Grund des Anrufs (Reason for the Call)</li>
                <li>Wichtige Daten (Important Information/Data)</li>
                <li>Wichtige Fragen (Key Questions)</li>
                <li>Nützliche Redemittel (Useful Phrases)</li>
                <li>Weitere Schritte (Next Steps)</li>
              </ol>
            </li>
            <li>
              <strong>Sub-Branches:</strong> Expand each branch with examples, phrases, and possible scenarios.
            </li>
          </ol>

          <h3 style={sectionTitle}>Example Brain Map</h3>
          <ul style={listSpacing}>
            <li>
              <strong>Grund des Anrufs:</strong> Kontostand abfragen, Karte sperren, Überweisung tätigen, Fragen zu Gebühren,
              Termin vereinbaren.
            </li>
            <li>
              <strong>Wichtige Daten:</strong> Kontonummer/IBAN, Name und Adresse, Geburtsdatum, Kundennummer,
              Sicherheitsfragen/Passwort.
            </li>
            <li>
              <strong>Wichtige Fragen:</strong> Wie ist mein Kontostand? Wie kann ich meine Karte sperren? Welche Gebühren
              fallen an? Kann ich ein neues Konto eröffnen? Wie funktioniert das Online-Banking?
            </li>
            <li>
              <strong>Nützliche Redemittel:</strong> Guten Tag, hier spricht ... / Ich rufe an, weil ... / Könnten Sie mir
              bitte helfen? / Vielen Dank für Ihre Hilfe. / Auf Wiederhören!
            </li>
            <li>
              <strong>Weitere Schritte:</strong> Unterlagen schicken, Termin in der Filiale vereinbaren, Online-Banking
              aktivieren, neue Karte beantragen, Kontoauszug prüfen.
            </li>
          </ul>

          <h3 style={sectionTitle}>Speaking Situation</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            You have just landed in Germany and need to open a bank account. You need to call the bank to gather
            information about the process.
          </p>

          <h3 style={sectionTitle}>Ideas and Vocabulary</h3>
          <ul style={listSpacing}>
            <li>Sich vorstellen</li>
            <li>Grund des Anrufs</li>
            <li>Konto eröffnen</li>
            <li>Benötigte Dokumente</li>
            <li>Termin vereinbaren</li>
            <li>Bankfiliale</li>
            <li>Öffnungszeiten</li>
            <li>Beratungsgespräch</li>
          </ul>

          <h3 style={sectionTitle}>Steps for Speaking</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Begrüßung und Vorstellung:</strong> „Guten Tag, mein Name ist [Ihr Name].“ / „Ich bin neu in
              Deutschland und möchte ein Bankkonto eröffnen.“
            </li>
            <li>
              <strong>Grund des Anrufs erklären:</strong> „Ich möchte gerne wissen, welche Dokumente ich dafür benötige.“ /
              „Könnten Sie mir sagen, wie der Prozess abläuft?“
            </li>
            <li>
              <strong>Informationen einholen:</strong> „Welche Arten von Konten bieten Sie an?“ / „Gibt es spezielle Angebote
              für neue Kunden?“
            </li>
            <li>
              <strong>Termin vereinbaren:</strong> „Kann ich einen Termin für ein Beratungsgespräch vereinbaren?“ / „Wann
              haben Sie geöffnet?“
            </li>
            <li>
              <strong>Abschluss:</strong> „Vielen Dank für Ihre Hilfe.“ / „Auf Wiederhören.“
            </li>
          </ol>

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
              „Heute spreche ich darüber, wie man bei der Bank anruft. Zuerst begrüße ich die Person und nenne meinen Namen. Dann erkläre ich mein Problem, weil die Bank klare Informationen braucht. Außerdem frage ich nach einem Termin oder nach Hilfe. Zum Beispiel kann ich sagen: Ich habe eine Frage zu meiner Karte. Zum Schluss wiederhole ich den Termin und bedanke mich freundlich.“
            </p>
          </div>
          <SpeakingPracticeTimerCard />

          <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>

          <CourseInlinePracticePanel
            type="speaking"
            title="Practice speaking on this page"
            description="Open the speaking coach here after reading the task. No new tab is needed."
          />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80"
            alt="Student writing a formal letter for a bank request"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Assignment</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Scenario 2: Resolving Account Issues.</strong> Schreiben Sie einen Brief an Ihre Bank in Ghana.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Sie sind jetzt in Ghana und Ihre Karte wurde gesperrt. Schreiben Sie einen Brief an Ihre Bank in Ghana, in dem
            Sie:
          </p>
          <ol style={listSpacing}>
            <li>fragen, ob Ihre Karte entsperrt werden kann.</li>
            <li>fragen, welche Dokumente oder Informationen dafür benötigt werden.</li>
            <li>fragen, wie lange der Vorgang dauern wird.</li>
          </ol>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Writing guidance before submission</strong>
            <ul style={listSpacing}>
              <li>Use a polite opening and closing suitable for a formal bank letter.</li>
              <li>Organize your letter into short, clear paragraphs for each request point.</li>
              <li>Check verb position and question forms before you submit.</li>
            </ul>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area (same workflow as usual), not directly on this page.
          </p>
          <CourseInlinePracticePanel
            type="writing"
            title="Practice writing on this page"
            description="Write and mark your answer here after studying the task. No new tab is needed."
          />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80"
            alt="Person reading bank offers and comparing services"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen) · Exercise</h2>
          <p style={{ margin: 0 }}>
            Read the ad and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit
            section at the bottom of the lesson to send your answers.
          </p>

          <h3 style={sectionTitle}>Choosing a Bank: Anzeige</h3>
          <ul style={listSpacing}>
            <li>
              <strong>a. Deutsche Bank</strong> — Services: Konto eröffnen, Beratung, Online Banking · Öffnungszeiten: Mo-Fr
              9:00-17:00, Sa 10:00-14:00 · Filialen: Mehrere Standorte in der Stadt
            </li>
            <li>
              <strong>b. Sparkasse</strong> — Services: Konto eröffnen, Kreditkarten, Beratung für neue Kunden ·
              Öffnungszeiten: Mo-Fr 8:00-18:00, Sa 9:00-13:00 · Filialen: Zentral gelegen
            </li>
            <li>
              <strong>c. Commerzbank</strong> — Services: Konto eröffnen, Kreditkarten, Versicherungen · Öffnungszeiten: Mo-Fr
              9:00-16:00 · Filialen: Wenige Standorte
            </li>
            <li>
              <strong>d. Volksbank</strong> — Services: Konto eröffnen, Beratung, Online Banking, Kreditkarten ·
              Öffnungszeiten: Mo-Fr 9:00-18:00, Sa geschlossen · Filialen: In den Vororten
            </li>
            <li>
              <strong>e. Postbank</strong> — Services: Konto eröffnen, Kreditkarten, Sparen · Öffnungszeiten: Mo-Fr 8:00-16:00,
              Sa 10:00-12:00 · Filialen: In der Innenstadt
            </li>
            <li>
              <strong>f. ING-DiBa</strong> — Services: Online Konto eröffnen, Kreditkarten, Beratung telefonisch ·
              Öffnungszeiten: 24/7 Online-Service · Filialen: Keine
            </li>
          </ul>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {lesenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
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
            src="https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&w=1600&q=80"
            alt="Listening practice setup with headphones and laptop"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören) · Exercise</h2>
          <p style={{ margin: 0 }}>
            Listen to the audio, then submit your answers in the assignment area (do not answer directly on this page).
          </p>
          <p style={{ margin: 0 }}>
            Audio:{" "}
            <a
              href="https://drive.google.com/file/d/16SL5aRG9nQnQiu6_YwxDi5qd0bUzNlTM/view?usp=sharing"
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
            Embedded audio preview:
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://drive.google.com/file/d/16SL5aRG9nQnQiu6_YwxDi5qd0bUzNlTM/preview"
            title="Die Bank anrufen - Teil 4 listening audio"
            allow="autoplay"
            allowFullScreen
          />

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A2Day18DieBankAnrufenWorkbookPage;
