import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen (Group Practice No assignment)" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
  { key: "references", label: "5. Ref" },
];

const lesenQuestions = [
  {
    stem: "Erst durch den Anruf bemerkte Susanne das Fehlen ihrer Brieftasche.",
    options: ["A) Richtig", "B) Falsch"],
  },
  {
    stem: "Susanne glaubte, die Brieftasche beim Bezahlen vergessen zu haben.",
    options: ["A) Richtig", "B) Falsch"],
  },
  {
    stem: "Der Finder hatte die Brieftasche ins Fundbüro gebracht.",
    options: ["A) Richtig", "B) Falsch"],
  },
  {
    stem: "Die Telefonnummer der Bank war in der Brieftasche.",
    options: ["A) Richtig", "B) Falsch"],
  },
  {
    stem: "In Susannes Brieftasche fehlte nichts.",
    options: ["A) Richtig", "B) Falsch"],
  },
  {
    stem: "Susanne konnte dem Finder persönlich für seine Ehrlichkeit danken.",
    options: ["A) Richtig", "B) Falsch"],
  },
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

const tabImageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 260,
  objectFit: "cover",
};

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

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

const B1Day20WieWirdManWorkbookPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 · Day 20 Workbook · Wie wird man ...?</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Chapter 6.20 · Ausbildung und Qualifikationen im Beruf.
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
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
            alt="Group of learners discussing career paths"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 1 (Beruf kennen) (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we will engage in group discussions about the topic <strong>Wie wird man ...?</strong>
            Following the discussion, questions can be rephrased for assignment preparation.
          </p>

          <h3 style={sectionTitle}>📝 Zentrales Thema: Wie wird man ...?</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Beliebte Berufe</strong>: Arzt/Ärztin, Ingenieur/in, Lehrer/in, Kaufmann/Kauffrau, Handwerker/in,
              Künstler/in, IT-Spezialist/in.
            </li>
            <li>
              <strong>Ausbildung &amp; Studium</strong>: Schule und Abschluss, Universität/Fachhochschule,
              Berufsausbildung/Lehre, praktische Erfahrung/Praktikum.
            </li>
            <li>
              <strong>Wichtige Qualifikationen</strong>: Soft Skills (Teamarbeit, Kommunikation, Kreativität), Hard Skills
              (Technik, Sprachen, IT) und Zertifikate/Diplome.
            </li>
            <li>
              <strong>Karriereweg</strong>: Schulabschluss → Ausbildung/Studium → Berufseinstieg → Weiterbildung →
              Karriereaufstieg.
            </li>
            <li>
              <strong>Herausforderungen und Chancen</strong>: lange Ausbildungszeiten, Kosten, Arbeitsmarkt,
              Aufstiegsmöglichkeiten.
            </li>
          </ol>

          <h3 style={sectionTitle}>Fragen zum Nachdenken</h3>
          <ul style={listSpacing}>
            <li>Welcher Beruf interessiert dich und warum?</li>
            <li>Welche Ausbildung oder Qualifikationen brauchst du für deinen Traumberuf?</li>
            <li>Was ist wichtiger: Erfahrung oder Ausbildung?</li>
            <li>Glaubst du, dass lebenslanges Lernen wichtig ist?</li>
          </ul>

          <h3 style={sectionTitle}>Hauptfrage</h3>
          <p style={{ margin: 0 }}>
            Welche Ausbildung und Qualifikationen sind für deinen Beruf wichtig?
          </p>
          <p style={{ margin: 0 }}>Nutze diese Struktur für deine mündliche Antwort:</p>
          <ol style={listSpacing}>
            <li>Begrüßung und Vorstellung des Themas</li>
            <li>Inhalt und Struktur</li>
            <li>Persönliche Erfahrung</li>
            <li>Situation in deinem Heimatland</li>
            <li>Vor- und Nachteile</li>
          </ol>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is only for group discussion and has no assignment submission. Assignments start from Teil 2, Teil 3,
            and Teil 4.
          </p>

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
            alt="Writing practice for discussing qualifications and career success"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Aufgabe:</strong> „Sind Ausbildung und Qualifikationen wichtig für den Beruf? Schreiben Sie Ihre Meinung."
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Felix:</strong> „Eine gute Ausbildung hilft, einen guten Job zu finden. Ich stimme dem zu, denn mit
            Qualifikationen hat man bessere Chancen auf dem Arbeitsmarkt. Dennoch sind auch Erfahrung und persönliche
            Fähigkeiten wichtig. Ich finde, dass man immer weiterlernen sollte, um erfolgreich zu sein. Was denken Sie
            darüber?"
          </p>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Writing guidance before submission</strong>
            <p style={{ margin: 0 }}>
              Plan your opinion clearly, include examples from real life, and compare Ausbildung with Erfahrung in a balanced
              way. You can use the Ideas Generator for support before you submit.
            </p>
          </div>

          <p style={{ margin: 0 }}>
            Submit your final writing in the assignment submission area, not directly on this page.
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
            src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1600&q=80"
            alt="Reading comprehension activity with notebook and text"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0 }}>
            Read the text and complete the true/false task in the assignment submission area. <strong>Do not answer
            directly on this page.</strong>
          </p>

          <h3 style={sectionTitle}>SusannesAlltagsBlog.at</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Donnerstag, den 23. Juni</strong>
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Was mir heute passiert ist, das glaubt mir keiner: Als ich zu Mittag nichts ahnend in der Küche beim Kochen
            stand, läutete mein Handy. Eine Frauenstimme erklärte mir, dass meine Brieftasche in der Bankfiliale abgegeben
            worden war und ich sie dort abholen könnte. Mir wurde ganz heiß – mir war noch gar nicht aufgefallen, dass sie
            fehlte. Und ich hatte ja auch noch relativ viel Bargeld eingesteckt!
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Schnell holte ich meine Handtasche hervor und suchte nach der Brieftasche. Es stimmte! Auch nach längerem
            Kramen in der Tasche konnte ich sie nicht finden. Mein Geld war tatsächlich verschwunden! Ich machte mich also
            auf den Weg zur Bank und überlegte, wo ich meine Brieftasche liegen gelassen hatte: Sicherlich im Supermarkt an
            der Kasse. Jedenfalls kam ich bei der Bank an und war schon gespannt darauf zu erfahren, wo meine Brieftasche
            gefunden worden war und natürlich, ob etwas fehlte. Die Bankangestellte teilte mir mit, dass ein junger Mann die
            Brieftasche abgegeben hatte.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Er hatte sie auf dem Parkplatz vor dem Supermarkt gefunden und wollte sie eigentlich ins Fundbüro bringen – wie
            man es in so einem Fall eben macht. Der Weg dorthin war für ihn zu weit und so suchte er nach einer anderen
            Möglichkeit, mir die Brieftasche zurückzugeben. Das muss man sich einmal vorstellen: Er war so clever, dass er
            auf der Bankomatkarte nach meinem und dem Namen meiner Bank suchte ... Die Bank würde ja die Kontaktdaten zu
            meinem Namen haben und könnte mich so anrufen. Er fuhr in die nächste Filiale meiner Bank und dank der
            Computervernetzung der Filialen konnte meine Telefonnummer schnell herausgefunden werden.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Da stand ich nun mit meiner Brieftasche, die mir beim Verlassen des Supermarktes aus der Handtasche gerutscht
            sein muss. Zum Glück war alles noch da! Ich bin sooo froh, dass diese Episode so gut ausgegangen ist.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Nun weiß ich leider gar nicht, wie ich dem ehrlichen Finder danken kann. Vielleicht liest er ja diesen
            Blogeintrag oder es liest ihn jemand, dem er die Geschichte erzählt hat: „Vielen, vielen Dank, lieber Finder!"
          </p>

          <h3 style={sectionTitle}>Aussagen (Richtig oder Falsch)</h3>
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
            src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1600&q=80"
            alt="Listening practice with headphones and laptop"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            This is a Goethe-standard Hören task. The answers are provided in the video. You are responsible for
            self-checking your own Hören results. The school officially evaluates only Lesen and Schreiben.
          </p>
          <p style={{ margin: 0 }}>
            Listen and check your answers using the provided video. Then submit in the assignment submission area where
            required, not directly on this page.
          </p>
          <p style={{ margin: 0 }}>
            Recommended video link:{" "}
            <a href="https://youtu.be/fMCYUVNYc9U" target="_blank" rel="noreferrer">
              Open Teil 4 video
            </a>
          </p>

          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/fMCYUVNYc9U"
            title="Goethe-standard Hören test"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="B1" lesson={{ title: "B1Day20WieWirdMan", level: "B1", workbookId: "B1Day20WieWirdMan" }} workbookId="B1Day20WieWirdMan" />
      )}

    </div>
  );
};

export default B1Day20WieWirdManWorkbookPage;
