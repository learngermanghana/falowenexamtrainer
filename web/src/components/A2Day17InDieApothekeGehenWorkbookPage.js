import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";

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
    stem: "Warum ging die Person in die Apotheke?",
    options: ["A) Um neue Medikamente zu kaufen.", "B) Weil sie sich krank fühlte.", "C) Um eine Broschüre abzuholen.", "D) Weil es kalt war."],
  },
  {
    stem: "Was empfahl die Apothekerin gegen Husten?",
    options: ["A) Nasenspray", "B) Hustensaft", "C) Tabletten", "D) Hausmittel"],
  },
  {
    stem: "Wie war der Service in der Apotheke?",
    options: ["A) Unfreundlich", "B) Neutral", "C) Hilfsbereit", "D) Langsam"],
  },
  {
    stem: "Was gab die Apothekerin zusätzlich zu den Medikamenten?",
    options: ["A) Ein Rezept", "B) Broschüren mit Tipps", "C) Eine Rechnung", "D) Ein neues Medikament"],
  },
  {
    stem: "Wie fühlte sich die Person auf dem Heimweg?",
    options: ["A) Schlechter", "B) Unverändert", "C) Besser", "D) Sehr krank"],
  },
  {
    stem: "Wann fühlte sich die Person besser?",
    options: ["A) Sofort nach Einnahme der Medikamente", "B) Nach einigen Stunden", "C) Am nächsten Tag", "D) Eine Woche später"],
  },
  {
    stem: "Was lernt die Person aus dem Besuch in der Apotheke?",
    options: [
      "A) Sie kann sich auf den Rat der Apotheker verlassen.",
      "B) Medikamente sind nicht hilfreich.",
      "C) Apotheker sind unfreundlich.",
      "D) Hausmittel sind die beste Lösung.",
    ],
  },
];

const hoerenQuestions = [
  {
    stem: "Warum ging Anna in die Apotheke?",
    options: ["A) Um Medikamente gegen Husten zu kaufen", "B) Wegen Kopfschmerzen", "C) Um eine Creme zu kaufen", "D) Um Proben zu holen"],
  },
  {
    stem: "Was empfahl die Apothekerin gegen Kopfschmerzen?",
    options: ["A) Aspirin", "B) Paracetamol", "C) Ibuprofen", "D) Nasenspray"],
  },
  {
    stem: "Welches Problem hatte Anna noch?",
    options: ["A) Halsschmerzen", "B) Trockene Haut", "C) Schnupfen", "D) Fieber"],
  },
  {
    stem: "Wie reagierte Anna auf die Empfehlungen der Apothekerin?",
    options: ["A) Sie war skeptisch", "B) Sie war erleichtert", "C) Sie war verwirrt", "D) Sie war unzufrieden"],
  },
  {
    stem: "Was bekam Anna zusätzlich zu den Medikamenten?",
    options: ["A) Ein Rezept", "B) Proben von Produkten", "C) Eine Broschüre", "D) Ein neues Medikament"],
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

const A2Day17InDieApothekeGehenWorkbookPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 17 Workbook · In die Apotheke gehen</h1>
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
            src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1600&q=80"
            alt="Pharmacist speaking with a customer in a pharmacy"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we&apos;ll engage in group exercises discussing these topics.</p>

          <h3 style={sectionTitle}>Ziel (Objective)</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Erstelle eine Brain Map, um folgende Themen zu behandeln: Berufe in der Apotheke, Wortschatz (Symptome &amp;
            Medikamente), Dialog in der Apotheke, Rezepte und Regeln, Tipps &amp; Kultur.
          </p>

          <h3 style={sectionTitle}>Anleitung (Instructions)</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Zentrales Thema:</strong> Schreibe in die Mitte deiner Brain Map: „Beruf: Apotheke“ oder „In die Apotheke
              gehen“.
            </li>
            <li>
              <strong>Hauptzweige (Main Branches):</strong> Zeichne fünf Hauptzweige: (1) Berufe in der Apotheke, (2) Wortschatz
              (Symptome &amp; Medikamente), (3) Dialog in der Apotheke, (4) Rezepte und Regeln, (5) Tipps &amp; Kultur.
            </li>
            <li>
              <strong>Unterzweige (Sub-Branches):</strong> Erweitere jeden Hauptzweig mit passenden Unterthemen, Wortfeldern und
              Beispielsätzen.
            </li>
          </ol>

          <h3 style={sectionTitle}>Beispiel für die Brain Map-Struktur</h3>
          <ul style={listSpacing}>
            <li>
              <strong>A. Berufe in der Apotheke</strong>: Apotheker/in, PKA, PTA; Ausbildung/Aufgaben wie Beratung, Rezeptprüfung,
              Lager, Bestellungen, Salbenherstellung.
            </li>
            <li>
              <strong>B. Wortschatz (Symptome &amp; Medikamente)</strong>: Kopfschmerzen, Halsschmerzen, Fieber, Husten,
              Medikamentenformen (Tabletten, Kapseln, Tropfen, Salbe, Spray) und Begriffe wie rezeptfrei/rezeptpflichtig,
              Packungsbeilage, Dosierung.
            </li>
            <li>
              <strong>C. Dialog in der Apotheke</strong>: Kund*in und Apotheker*in mit höflichen Redemitteln (z. B. „Darf ich Sie
              kurz beraten?“ / „Gute Besserung!").
            </li>
            <li>
              <strong>D. Rezepte und Regeln</strong>: Wann braucht man ein Rezept, Kassenrezept vs. Privatrezept, Öffnungszeiten,
              Altersbeschränkungen, keine Selbstbedienung.
            </li>
            <li>
              <strong>E. Tipps &amp; Kultur</strong>: Strenge Vorschriften in Deutschland, Apotheken-Notdienst,
              Länderunterschiede und Höflichkeitsform „Sie“.
            </li>
          </ul>

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Sprecht außerdem über diese Leitfrage: <strong>Was kaufst du in der Apotheke und wann gehst du dorthin?</strong>
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
          <div style={{ ...questionCardStyle, background: "#ecfeff" }}>
            <strong>Modellantwort (ca. 30–45 Sekunden)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Heute spreche ich über einen Besuch in der Apotheke. Zuerst erkläre ich mein Problem, zum Beispiel: Ich habe Kopfschmerzen oder Husten. Dann frage ich nach einem Medikament, weil ich schnell Hilfe brauche. Außerdem sage ich, ob ich Allergien habe oder andere Medikamente nehme. Zum Beispiel frage ich: Wie oft soll ich die Tabletten nehmen? Zum Schluss bedanke ich mich und lese die Packungsbeilage zu Hause.“
            </p>
          </div>
          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Speaking self-practice confidence check</strong>
            <p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence before class:</p>
            <a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">
              Open speaking self-practice
            </a>
          </div>
          <SpeakingPracticeTimerCard />

          <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>

          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=80"
            alt="Learner writing an email assignment in a notebook"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Assignment</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Neue Aufgabenstellung (A2-Niveau):</strong> Sie möchten ein bestimmtes Medikament kaufen und schreiben
            deswegen einen Brief oder eine E-Mail an eine Apotheke (nicht an den Arzt).
          </p>

          <p style={{ margin: 0 }}><strong>Write about these three points:</strong></p>
          <ol style={listSpacing}>
            <li>
              Beschreiben Sie kurz, warum Sie das Medikament benötigen. Beispiel: „Ich habe seit drei Tagen starke
              Kopfschmerzen...“
            </li>
            <li>
              Fragen Sie nach den Kosten und ob die Versicherung das Medikament übernimmt. Beispiel: „Wie viel kostet das
              Medikament, und zahlt meine Versicherung einen Teil davon?“
            </li>
            <li>
              Fragen Sie nach der richtigen Dosierung oder möglichen Nebenwirkungen. Beispiel: „Könnten Sie mir bitte sagen,
              wie oft ich das Medikament einnehmen soll und ob es Nebenwirkungen gibt?“
            </li>
          </ol>

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
            src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=80"
            alt="Reading exercise text on a desk with glasses"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen) · Exercise</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit section at
            the bottom of the lesson to send your answers.
          </p>

          <h3 style={sectionTitle}>Essay</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Es war ein kalter Wintermorgen, als ich entschied, in die Apotheke zu gehen. Ich fühlte mich seit Tagen krank und
            wusste, dass ich etwas gegen meine Erkältung tun musste. Als ich in die Apotheke kam, begrüßte mich die
            Apothekerin freundlich. Ich erklärte ihr meine Symptome: Husten, Halsschmerzen und eine laufende Nase. Sie
            empfahl mir sofort einen Hustensaft und Tabletten gegen die Halsschmerzen. Außerdem gab sie mir noch Nasenspray,
            das meine verstopfte Nase befreien sollte.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Während sie die Medikamente holte, erzählte sie mir von verschiedenen Hausmitteln, die ebenfalls helfen könnten.
            Ich war beeindruckt von ihrem Wissen und ihrer Freundlichkeit. Nachdem ich bezahlt hatte, gab sie mir noch einige
            Broschüren mit Tipps zur Gesundheit im Winter. Auf dem Heimweg fühlte ich mich schon ein bisschen besser, allein
            durch das Wissen, gut versorgt zu sein.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Zu Hause angekommen, nahm ich sofort die empfohlenen Medikamente ein. Innerhalb weniger Stunden spürte ich eine
            deutliche Verbesserung. Der Hustensaft beruhigte meinen Husten und die Tabletten linderten die Halsschmerzen. Auch
            das Nasenspray war sehr wirksam. Ich war sehr dankbar für die schnelle Hilfe und den guten Rat der Apothekerin.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In den folgenden Tagen setzte ich die Behandlung fort und konnte bald wieder gesund zur Arbeit gehen. Der Besuch
            in der Apotheke hatte sich wirklich gelohnt und ich wusste, dass ich mich in Zukunft immer auf den Rat der
            Apotheker verlassen konnte.
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

          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=1600&q=80"
            alt="Listening practice with headphones and laptop"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören) · Exercise</h2>
          <p style={{ margin: 0 }}>
            Listen to the audio, then submit your answers in the assignment area (do not answer directly on this page).
          </p>
          <p style={{ margin: 0 }}>
            Audio: <a href="https://drive.google.com/file/d/1glr45HegifSYLrz0XpKCFFiAPfUW8RsB/view?usp=sharing" target="_blank" rel="noreferrer">Open Teil 4 audio</a>
          </p>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
            <input type="checkbox" checked={teacherMode} onChange={(event) => setTeacherMode(event.target.checked)} />
            Teacher mode (show transcript)
          </label>

          {teacherMode && (
            <div style={{ ...questionCardStyle, background: "#fefce8" }}>
              <strong>Transcript (teacher support)</strong>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Anna geht wegen Kopfschmerzen in die Apotheke. Die Apothekerin empfiehlt Ibuprofen. Anna erwähnt außerdem
                Schnupfen. Nach der Beratung wirkt Anna erleichtert und bekommt zusätzlich Proben von Produkten.
              </p>
            </div>
          )}

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
            <a href="https://youtu.be/PtrlVtdhPVw" target="_blank" rel="noreferrer">
              In die Apotheke gehen – A2 Lesson Video
            </a>
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/PtrlVtdhPVw"
            title="In die Apotheke gehen – A2 Lesson Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A2Day17InDieApothekeGehenWorkbookPage;
