import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";

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
    stem: "Was ist eine Kinderkrippe?",
    options: [
      "A) Eine Schule für Kinder ab 6 Jahren",
      "B) Ein Spielplatz für Kinder",
      "C) Ein Ort für kleine Kinder bis 3 Jahre",
      "D) Ein Krankenhaus für Kinder",
    ],
  },
  {
    stem: "Ab wann kann ein Kind in den Kindergarten gehen?",
    options: ["A) Ab 6 Jahren", "B) Ab 2 Jahren", "C) Ab 3 Jahren", "D) Ab 5 Jahren"],
  },
  {
    stem: "Was machen Kinder im Kindergarten?",
    options: [
      "A) Sie arbeiten am Computer",
      "B) Sie machen Hausaufgaben",
      "C) Sie schlafen den ganzen Tag",
      "D) Sie spielen, singen und basteln",
    ],
  },
  {
    stem: "Wie nennt man einen Kindergarten, der den ganzen Tag offen ist?",
    options: ["A) Supermarkt", "B) Kita", "C) Schule", "D) Wohnung"],
  },
  {
    stem: "Was bekommt ein Kind in der Kita zu essen?",
    options: ["A) Frühstück", "B) Eis", "C) Mittagessen", "D) Kuchen"],
  },
  {
    stem: "Wer zahlt mehr für den Kindergarten?",
    options: ["A) Reiche Familien", "B) Alle Familien zahlen gleich", "C) Arme Familien", "D) Die Kinder selbst"],
  },
  {
    stem: "Was passiert, wenn ein Kind schlecht Deutsch spricht?",
    options: [
      "A) Es darf nicht mehr in den Kindergarten",
      "B) Es bekommt Hilfe beim Deutschlernen",
      "C) Es muss eine andere Sprache lernen",
      "D) Es bekommt keinen Platz mehr",
    ],
  },
];

const hoerenQuestions = [
  {
    stem: "Warum ist es wichtig, sich über das Unternehmen zu informieren?",
    options: ["A) Um Produkte zu kaufen", "B) Um Interesse zu zeigen", "C) Um Fragen zu vermeiden", "D) Um Kleidung auszuwählen"],
  },
  {
    stem: "Was ist ein Zeichen von Professionalität und Respekt?",
    options: ["A) Zu spät kommen", "B) Pünktlich sein", "C) Unpassende Kleidung", "D) Leise sprechen"],
  },
  {
    stem: "Warum sollte man dem Arbeitgeber Fragen stellen?",
    options: [
      "A) Um das Gespräch zu verlängern",
      "B) Um Unsicherheit zu zeigen",
      "C) Um Interesse zu zeigen",
      "D) Um die Kleidung zu bewerten",
    ],
  },
  {
    stem: "Welche Art von E-Mail wird nach dem Gespräch empfohlen?",
    options: ["A) Eine Dankes-E-Mail", "B) Eine Beschwerde-E-Mail", "C) Eine Frage-E-Mail", "D) Eine Kündigungs-E-Mail"],
  },
  {
    stem: "Was sollte man während des Gesprächs tun?",
    options: ["A) Unvorbereitet sein", "B) Klar und deutlich sprechen", "C) Nur zuhören", "D) Unpassende Fragen stellen"],
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

const A2Day13VorstellungsgespraechWorkbookPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 13 Workbook · Ein Vorstellungsgespräch</h1>
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
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
            alt="Candidates in a professional job interview setting"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we&apos;ll engage in group exercises on <strong>„Mein Beruf und ich“</strong>.
          </p>

          <h3 style={sectionTitle}>Zentrales Thema: „Mein Beruf und ich“</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Wer bist du?</strong>
              <ul style={listSpacing}>
                <li>Name – „Ich heiße ...“</li>
                <li>Wohnort – „Ich wohne in ...“</li>
                <li>Alter – „Ich bin ... Jahre alt.“</li>
                <li>Interessen – „Ich interessiere mich für ...“</li>
              </ul>
            </li>
            <li>
              <strong>Welche Ausbildung hast du?</strong>
              <ul style={listSpacing}>
                <li>Schulabschluss – „Ich habe meinen Abschluss in ... gemacht.“</li>
                <li>Studium oder Ausbildung – „Ich habe eine Ausbildung als ... gemacht.“</li>
                <li>Zusätzliche Kurse – „Ich habe einen Kurs in ... gemacht.“</li>
              </ul>
            </li>
            <li>
              <strong>Welche Berufserfahrung hast du?</strong>
              <ul style={listSpacing}>
                <li>Praktikum – „Ich habe ein Praktikum bei ... gemacht.“</li>
                <li>Berufserfahrung – „Ich habe ... Jahre als ... gearbeitet.“</li>
                <li>Arbeitsstil – „Ich arbeite gern im Team/allein.“</li>
              </ul>
            </li>
            <li>
              <strong>Welche Fähigkeiten und Qualifikationen hast du?</strong>
              <ul style={listSpacing}>
                <li>Sprachen – „Ich spreche ...“</li>
                <li>Technische Fähigkeiten – „Ich kann mit ... arbeiten.“</li>
                <li>Soziale Fähigkeiten – „Ich bin teamfähig und kommunikativ.“</li>
                <li>Andere Fähigkeiten – „Ich bin kreativ und organisiert.“</li>
              </ul>
            </li>
            <li>
              <strong>Warum möchtest du diesen Job?</strong>
              <ul style={listSpacing}>
                <li>Motivation – „Ich interessiere mich für ...“</li>
                <li>Berufsziel – „Ich möchte in der Zukunft ...“</li>
                <li>Karrierechancen – „Dieser Beruf hat gute Chancen für mich.“</li>
                <li>Neue Erfahrungen – „Ich möchte neue Dinge lernen.“</li>
              </ul>
            </li>
          </ol>

          <div style={{ ...questionCardStyle, background: "#f9fafb" }}>
            <strong>Beispielantwort (Example Answer)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Ich heiße Maria und bin 25 Jahre alt. Ich habe eine Ausbildung als Bürokauffrau gemacht. Ich habe ein
              Praktikum in einem Unternehmen gemacht und arbeite gern im Team. Ich kann gut mit Computern arbeiten und
              spreche Englisch und Deutsch. Ich interessiere mich für Verwaltung und möchte in einem Büro arbeiten.“
            </p>
          </div>

          <h3 style={sectionTitle}>Hauptfrage</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Sie befinden sich in einem Vorstellungsgespräch bei Amazon. Bitte stellen Sie sich vor. Beschreiben Sie, wer
            Sie sind, welche Ausbildung und Berufserfahrung Sie mitbringen, welche Fähigkeiten Sie besitzen und warum Sie
            sich für diese Position bei Amazon interessieren.
          </p>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Schlüsselwörter: Name · Ausbildung · Berufserfahrung · Fähigkeiten · Motivation · Qualifikationen · Interessen ·
            Berufsziel
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
              „Heute spreche ich über ein Vorstellungsgespräch. Zuerst begrüße ich die Person freundlich und stelle mich kurz vor. Dann erkläre ich meine Erfahrung, weil das für die Stelle wichtig ist. Außerdem sage ich, warum ich in der Firma arbeiten möchte. Zum Beispiel kann ich sagen: Ich bin zuverlässig und arbeite gern im Team. Zum Schluss bedanke ich mich für das Gespräch und frage nach dem nächsten Schritt.“
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
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Learner writing a formal job application letter"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 · Assignment: Schreiben</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Thema: Bewerbung um eine Stelle im CityMall Einkaufszentrum</strong>
          </p>
          <p style={{ margin: 0 }}>
            Sie möchten sich bei CityMall Einkaufszentrum um eine Stelle als Verkäufer/in oder
            Kundenservice-Mitarbeiter/in bewerben. Schreiben Sie einen formellen Brief.
          </p>
          <p style={{ margin: 0 }}>Punkte, die Sie beachten sollen:</p>
          <ol style={listSpacing}>
            <li>Warum schreiben Sie den Brief?</li>
            <li>Was sind Ihre Erfahrungen und Stärken?</li>
            <li>Was erwarten Sie?</li>
          </ol>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area (same workflow as usual), not directly on this
            page.
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
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
            alt="Open German reading workbook on a desk"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit
            section at the bottom of the lesson to send your answers.
          </p>

          <h3 style={sectionTitle}>Kinderbetreuung in Deutschland (A2-Niveau)</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In Deutschland gibt es viele Möglichkeiten für kleine Kinder. Wenn Vater und Mutter arbeiten, können sie ihr
            Kind in eine Kinderkrippe bringen. Eine Kinderkrippe ist für Kinder bis 3 Jahre. Es gibt nur wenige Plätze.
            Man muss das Kind früh anmelden. Ab 3 Jahren können Kinder in den Kindergarten gehen. Dort können sie spielen,
            singen, malen und basteln. Im Sommer gehen viele Erzieherinnen mit den Kindern nach draußen. Viele Kindergärten
            helfen auch mit der Sprache. Die Kinder hören Geschichten und machen Sprachspiele. Ein Kindergarten ist eine
            gute Vorbereitung für die Schule. Aber es gibt nicht überall genug Plätze. Man muss das Kind rechtzeitig
            anmelden. Einige Kindergärten sind vormittags offen (z. B. 7–13 Uhr). Andere Kindergärten sind den ganzen Tag
            offen (z. B. 7–17 Uhr). Diese heißen Kitas. In einer Kita bekommt das Kind auch Mittagessen. Die Eltern müssen
            für den Kindergarten Geld bezahlen. Der Preis ist in jedem Bundesland anders. Wer wenig Geld hat, zahlt
            weniger. Wer mehr verdient, zahlt mehr. Private Kindergärten sind teurer als staatliche. In einigen privaten
            Kitas spricht man zwei Sprachen, zum Beispiel Deutsch und Spanisch. Vor der Schule machen viele Kinder einen
            Sprachtest. Wenn ein Kind noch nicht gut Deutsch spricht, bekommt es Hilfe beim Deutschlernen.
          </p>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
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
            src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones beside notes for listening practice"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören)</h2>
          <p style={{ margin: 0 }}>
            Listen to the audio, then submit your answers in the assignment area (do not answer directly on this page).
          </p>
          <p style={{ margin: 0 }}>
            Audio link:{" "}
            <a
              href="https://drive.google.com/file/d/1iT-0eKLWmEn_ZNdhQ8qiEWh0Dhn-ql4p/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Open Teil 4 audio
            </a>
          </p>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
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

          <p style={{ margin: 0 }}>
            Recommended video:{" "}
            <a href="https://youtu.be/urKBrX5VAYU" target="_blank" rel="noreferrer">
              Vorstellungsgespräch führen (A2)
            </a>
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/urKBrX5VAYU"
            title="Vorstellungsgespräch führen (A2)"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A2Day13VorstellungsgespraechWorkbookPage;
