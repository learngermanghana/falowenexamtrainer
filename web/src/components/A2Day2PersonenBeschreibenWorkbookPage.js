import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

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

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const lesenQuestions = [
  {
    stem: "Wie lange arbeitet der Erzähler schon im Büro?",
    options: ["A) Zwei Jahre", "B) Ein Jahr", "C) Drei Monate", "D) Fünf Jahre"],
  },
  {
    stem: "Was ist besonders an Herrn Müllers Arbeitsweise?",
    options: [
      "A) Er kommt immer unpünktlich ins Büro",
      "B) Er ist immer gut gelaunt und organisiert",
      "C) Er ist sehr unorganisiert und chaotisch",
      "D) Er ist nie freundlich zu den Mitarbeitern",
    ],
  },
  {
    stem: "Was trägt Herr Müller normalerweise?",
    options: ["A) Einen Anzug und eine Krawatte", "B) Einen Pullover und Jeans", "C) Einen Anzug und eine Brille", "D) Eine Uniform"],
  },
  {
    stem: "Was macht Herr Müller, wenn die Mitarbeiter Fragen haben?",
    options: [
      "A) Er ignoriert sie",
      "B) Er geht geduldig auf ihre Anliegen ein",
      "C) Er wird ärgerlich",
      "D) Er sagt, dass sie selbst nach Lösungen suchen sollen",
    ],
  },
  {
    stem: "Warum ist es motivierend, mit Herrn Müller zu arbeiten?",
    options: [
      "A) Weil er selten lobt",
      "B) Weil er seine Mitarbeiter regelmäßig lobt",
      "C) Weil er nie mit den Mitarbeitern spricht",
      "D) Weil er die Arbeit nicht ernst nimmt",
    ],
  },
  {
    stem: "Wann kann Herr Müller streng sein?",
    options: [
      "A) Wenn eine Aufgabe nicht rechtzeitig erledigt wird",
      "B) Wenn er sich langweilt",
      "C) Wenn die Mitarbeiter zu viel reden",
      "D) Wenn jemand zu früh nach Hause geht",
    ],
  },
  {
    stem: "Was schätzt der Erzähler an Herrn Müller besonders?",
    options: [
      "A) Dass er immer mit den Mitarbeitern streitet",
      "B) Dass er fair ist und die Leistungen der Mitarbeiter wertschätzt",
      "C) Dass er nie Zeit für die Mitarbeiter hat",
      "D) Dass er seine Aufgaben an andere weitergibt",
    ],
  },
];

const hoerenQuestions = [
  {
    stem: "Warum lernt der Sprecher Deutsch?",
    options: [
      "A) Weil er nach Frankreich ziehen möchte.",
      "B) Weil er in Deutschland arbeiten möchte.",
      "C) Weil er eine deutsche Freundin hat.",
      "D) Weil er Deutsch liebt.",
    ],
  },
  {
    stem: "Welche Methoden benutzt der Sprecher zum Lernen?",
    options: [
      "A) Nur Bücher lesen.",
      "B) Nur Filme schauen.",
      "C) Sprachkurse, Online-Apps und das Üben mit Freunden.",
      "D) Nur Musik hören.",
    ],
  },
  {
    stem: "Wie oft übt der Sprecher Deutsch?",
    options: ["A) Jeden Tag eine Stunde.", "B) Einmal pro Woche.", "C) Einmal im Monat.", "D) Nie."],
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

const A2Day2PersonenBeschreibenWorkbookPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 2 Workbook · Personen beschreiben</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          4-part workbook: speaking, writing, reading, and listening practice focused on describing people.
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
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
            alt="Group conversation practice in class"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we engage in group exercises discussing these topics. Following this, your teacher will revise
            the questions and invite you to write a brief essay about yourself.
          </p>

          <h3 style={sectionTitle}>Äste und Unterpunkte</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Äußeres Erscheinungsbild (Physical Appearance)</strong>
              <ul style={listSpacing}>
                <li>Körpergröße: groß, klein, mittelgroß (tall, short, average height)</li>
                <li>Haarfarbe und Frisur: blond, braun, schwarz, rot; lang, kurz, lockig, glatt</li>
                <li>Augenfarbe: blau, grün, braun, grau</li>
                <li>Besondere Merkmale: Brille, Bart, Sommersprossen, Tätowierungen, Piercings</li>
                <li>Adjektive: schlank, kräftig, attraktiv, sportlich</li>
              </ul>
            </li>
            <li>
              <strong>Kleidung (Clothing)</strong>
              <ul style={listSpacing}>
                <li>Alltag: T-Shirt, Jeans, Pullover</li>
                <li>Formal: Anzug, Kleid, Rock, Bluse</li>
                <li>Farben: rot, blau, grün, schwarz, weiß</li>
                <li>Adjektive: modisch, lässig, elegant, ordentlich</li>
              </ul>
            </li>
            <li>
              <strong>Charakter und Persönlichkeit (Character and Personality)</strong>
              <ul style={listSpacing}>
                <li>Positive Eigenschaften: freundlich, lustig, kreativ, offen, pünktlich, ehrlich, hilfsbereit, geduldig, optimistisch</li>
                <li>Negative Eigenschaften: unfreundlich, unpünktlich, launisch, stur, pessimistisch, unordentlich</li>
              </ul>
            </li>
            <li>
              <strong>Alter und Herkunft (Age and Origin)</strong>
              <ul style={listSpacing}>
                <li>Alter: jung, mittelalt, alt; „Er ist 20 Jahre alt.“</li>
                <li>Herkunft: Land (Deutschland, Ghana, Frankreich), Stadt (Berlin, Accra, Paris)</li>
              </ul>
            </li>
            <li>
              <strong>Hobbys und Interessen (Hobbies and Interests)</strong>
              <ul style={listSpacing}>
                <li>Sport: Fußball, Tennis, Laufen</li>
                <li>Kunst: Malen, Musik, Tanzen</li>
                <li>Bücher lesen, reisen</li>
                <li>Adjektive: aktiv, kreativ, musikalisch, sportlich</li>
              </ul>
            </li>
            <li>
              <strong>Beziehungen (Relationships)</strong>
              <ul style={listSpacing}>
                <li>Familie: verheiratet, ledig, geschieden; Mutter, Vater, Bruder, Schwester</li>
                <li>Freundeskreis: „Sie ist eine gute Freundin.“ / „Wir kennen uns seit zwei Jahren.“</li>
                <li>Adjektive: zuverlässig, humorvoll, gesellig, respektvoll</li>
              </ul>
            </li>
          </ol>

          <h3 style={sectionTitle}>Sprachliche Hilfen (Language Support)</h3>
          <ul style={listSpacing}>
            <li>
              <strong>Einleitung:</strong> „Ich möchte dir eine Person beschreiben, die ...“ / „Diese Person ist sehr wichtig für
              mich, weil ...“
            </li>
            <li>
              <strong>Hauptteil:</strong> „Außerdem hat sie ...“ / „Zum Beispiel trägt er oft ...“ / „Er ist genauso freundlich wie
              meine Mutter.“ / „Sie ist größer als ich.“
            </li>
            <li>
              <strong>Schluss:</strong> „Zusammenfassend kann man sagen, dass diese Person wirklich besonders ist.“
            </li>
          </ul>

          <h3 style={sectionTitle}>Diskussionsfrage</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Kannst du eine Person beschreiben? Wie sieht sie aus und was für ein Mensch ist sie?
          </p>
          <ul style={listSpacing}>
            <li>Aussehen (groß, klein, Haare, Augenfarbe)</li>
            <li>Charakter (freundlich, lustig, ruhig)</li>
            <li>Kleidung</li>
            <li>Besondere Merkmale (Brille, Bart, Schmuck)</li>
          </ul>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Speaking self-practice confidence check</strong>
            <p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence before class:</p>
            <a
              href="https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec"
              target="_blank"
              rel="noreferrer"
            >
              Open speaking self-practice
            </a>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is only for group discussion and has no assignment submission. Assignments start from Teil 2, Teil 3, and
            Teil 4.
          </p>

          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Learner writing a formal letter in a notebook"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Exercise</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Anleitung:</strong> Schreibe einen Brief an Felix und erzähle ihm von deinem Chef oder deiner Chefin.
          </p>
          <p style={{ margin: 0 }}>Nutze die folgenden drei Punkte, um den Brief zu schreiben:</p>
          <ol style={listSpacing}>
            <li>Warum schreibst du?</li>
            <li>Beschreibe deinen Chef / deine Chefin (Aussehen, Persönlichkeit, Verhalten).</li>
            <li>Was gefällt dir an deinem Chef / deiner Chefin, und was könnte besser sein?</li>
          </ol>

          <h3 style={sectionTitle}>Tipps</h3>
          <ul style={listSpacing}>
            <li>Beginne mit „Lieber Felix“.</li>
            <li>Schreibe: „Wie geht es dir? Ich schreibe dir, weil ...“</li>
            <li>Verwende Konjunktionen wie „denn“, „aber“, „weil“ oder „deshalb“.</li>
            <li>Schließe mit: „Ich freue mich im Voraus auf deine Antwort. Viele Grüße, [Dein Name]“</li>
          </ul>

          <p style={{ margin: 0 }}>
            <strong>Beispielanfang:</strong> Lieber Felix, wie geht es dir? Ich schreibe dir, weil ich dir von meinem Chef erzählen
            möchte. Er ist ...
          </p>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area (same workflow as usual), not directly on this page.
          </p>
          <p style={{ margin: 0 }}>
            Practice your draft before submission on the writing page: {" "}
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
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80"
            alt="Reading comprehension workbook on desk"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit section at
            the bottom of the lesson to send your answers.
          </p>

          <h3 style={sectionTitle}>Text</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Ich arbeite seit einem Jahr in einem kleinen Büro in der Stadtmitte. Mein Chef, Herr Müller, ist etwa 45 Jahre alt.
            Er ist ein sehr organisierter und motivierter Mensch. Jeden Morgen kommt er immer pünktlich ins Büro und begrüßt
            alle freundlich. Herr Müller trägt meistens einen Anzug und eine Brille. Er hat kurze, braune Haare und ist immer
            gut gelaunt. Er ist sehr freundlich, aber auch sehr anspruchsvoll, wenn es um die Arbeit geht. Besonders gut finde
            ich, dass er immer Zeit für uns hat, wenn wir Fragen oder Probleme haben. Er geht geduldig auf unsere Anliegen ein
            und erklärt alles sehr klar. Er möchte, dass wir uns ständig verbessern, aber er ist dabei nie unhöflich oder zu
            streng. Er lobt uns oft, wenn wir gute Arbeit leisten, was sehr motivierend ist. Ab und zu kann Herr Müller aber
            auch sehr streng sein, besonders wenn eine Aufgabe nicht rechtzeitig erledigt wird. Er erwartet von uns, dass wir
            unsere Aufgaben mit höchster Genauigkeit erledigen, und ist sehr darauf bedacht, dass wir unsere Ziele erreichen.
            Trotzdem habe ich viel Respekt vor ihm, weil er fair ist und die Leistungen seiner Mitarbeiter wertschätzt. Ich
            arbeite gerne mit Herrn Müller zusammen, weil er immer respektvoll mit uns umgeht und viel Wert auf Zusammenarbeit
            legt. Außerdem sorgt er dafür, dass wir in einem angenehmen Arbeitsumfeld arbeiten, was für mich sehr wichtig ist.
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
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones prepared for listening comprehension"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören)</h2>
          <p style={{ margin: 0 }}>
            Note: The audio has been uploaded among the files in this chapter, or you can open the link below.
          </p>
          <p style={{ margin: 0 }}>
            Audio link: {" "}
            <a
              href="https://drive.google.com/file/d/1SIFA08DquWp-dU86pi7pHC6eElF_39I9/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Open Teil 4 audio
            </a>
          </p>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
            <input type="checkbox" checked={teacherMode} onChange={(event) => setTeacherMode(event.target.checked)} />
            Teacher mode (show transcript)
          </label>

          {teacherMode && (
            <div style={{ ...questionCardStyle, background: "#fefce8" }}>
              <strong>Transcript (teacher support)</strong>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Der Sprecher erklärt, dass er Deutsch lernt, weil er in Deutschland arbeiten möchte. Er nutzt mehrere Methoden:
                Sprachkurse, Online-Apps und das Üben mit Freunden. Außerdem sagt er, dass er jeden Tag eine Stunde Deutsch
                übt.
              </p>
            </div>
          )}

          <h3 style={sectionTitle}>Hörverstehen Fragen</h3>
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
            Recommended video: {" "}
            <a href="https://youtu.be/Tor-mPRS3j4" target="_blank" rel="noreferrer">
              Deutsch lernen (A2) | Nicos Weg | Folge 10: Personen beschreiben
            </a>
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/Tor-mPRS3j4"
            title="Deutsch lernen (A2) | Nicos Weg | Folge 10: Personen beschreiben"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <p style={{ margin: 0, color: "#4b5563" }}>
            Please submit your listening answers in the assignment submission area, not directly on this page.
          </p>

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A2Day2PersonenBeschreibenWorkbookPage;
