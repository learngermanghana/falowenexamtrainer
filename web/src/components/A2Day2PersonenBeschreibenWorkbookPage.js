import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CoursebookAudioPlayer from "./CoursebookAudioPlayer";

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
const phraseGridStyle = {
  display: "grid",
  gap: 10,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
                <li>Haarfarbe und Frisur: blond, braun, schwarz, rot; lang, kurz, lockig, glatt (hair color and hairstyle: blonde, brown, black, red; long, short, curly, straight)</li>
                <li>Augenfarbe: blau, grün, braun, grau (eye color: blue, green, brown, gray)</li>
                <li>Besondere Merkmale: Brille, Bart, Sommersprossen, Tätowierungen, Piercings (special features: glasses, beard, freckles, tattoos, piercings)</li>
                <li>Adjektive: schlank, kräftig, attraktiv, sportlich (adjectives: slim, strong, attractive, athletic)</li>
              </ul>
            </li>
            <li>
              <strong>Kleidung (Clothing)</strong>
              <ul style={listSpacing}>
                <li>Alltag: T-Shirt, Jeans, Pullover (everyday: T-shirt, jeans, sweater)</li>
                <li>Formal: Anzug, Kleid, Rock, Bluse (formal: suit, dress, skirt, blouse)</li>
                <li>Farben: rot, blau, grün, schwarz, weiß (colors: red, blue, green, black, white)</li>
                <li>Adjektive: modisch, lässig, elegant, ordentlich (adjectives: fashionable, casual, elegant, tidy)</li>
              </ul>
            </li>
            <li>
              <strong>Charakter und Persönlichkeit (Character and Personality)</strong>
              <ul style={listSpacing}>
                <li>Positive Eigenschaften: freundlich, lustig, kreativ, offen, pünktlich, ehrlich, hilfsbereit, geduldig, optimistisch (positive traits: friendly, funny, creative, open-minded, punctual, honest, helpful, patient, optimistic)</li>
                <li>Negative Eigenschaften: unfreundlich, unpünktlich, launisch, stur, pessimistisch, unordentlich (negative traits: unfriendly, unpunctual, moody, stubborn, pessimistic, messy)</li>
              </ul>
            </li>
            <li>
              <strong>Alter und Herkunft (Age and Origin)</strong>
              <ul style={listSpacing}>
                <li>Alter: jung, mittelalt, alt; „Er ist 20 Jahre alt.“ (age: young, middle-aged, old; “He is 20 years old.”)</li>
                <li>Herkunft: Land (Deutschland, Ghana, Frankreich), Stadt (Berlin, Accra, Paris) (origin: country (Germany, Ghana, France), city (Berlin, Accra, Paris))</li>
              </ul>
            </li>
            <li>
              <strong>Hobbys und Interessen (Hobbies and Interests)</strong>
              <ul style={listSpacing}>
                <li>Sport: Fußball, Tennis, Laufen (sports: football/soccer, tennis, running)</li>
                <li>Kunst: Malen, Musik, Tanzen (arts: painting, music, dancing)</li>
                <li>Bücher lesen, reisen (reading books, traveling)</li>
                <li>Adjektive: aktiv, kreativ, musikalisch, sportlich (adjectives: active, creative, musical, athletic)</li>
              </ul>
            </li>
            <li>
              <strong>Beziehungen (Relationships)</strong>
              <ul style={listSpacing}>
                <li>Familie: verheiratet, ledig, geschieden; Mutter, Vater, Bruder, Schwester (family: married, single, divorced; mother, father, brother, sister)</li>
                <li>Freundeskreis: „Sie ist eine gute Freundin.“ / „Wir kennen uns seit zwei Jahren.“ (friends: “She is a good friend.” / “We have known each other for two years.”)</li>
                <li>Adjektive: zuverlässig, humorvoll, gesellig, respektvoll (adjectives: reliable, humorous, sociable, respectful)</li>
              </ul>
            </li>
          </ol>

          <h3 style={sectionTitle}>Sprechen wie bei einer Mini-Präsentation</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Nutze diese einfache Struktur: <strong>Einleitung → Hauptteil mit Verbindungswörtern → Beispiel → Schluss</strong>.
          </p>
          <ol style={listSpacing}>
            <li>
              <strong>Einleitung:</strong> Stelle kurz die Person vor (Name, Alter, Beziehung zu dir).
            </li>
            <li>
              <strong>Hauptteil mit Verbindungswörtern:</strong> Beschreibe Aussehen, Charakter und Kleidung mit einfachen
              Konnektoren.
            </li>
            <li>
              <strong>Beispiel:</strong> Nenne eine konkrete Situation aus dem Alltag.
            </li>
            <li>
              <strong>Schluss:</strong> Sage deine Meinung in 1–2 Sätzen und beende klar.
            </li>
          </ol>

          <div style={phraseGridStyle}>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>1) Gute Einleitungen</strong>
              <ul style={listSpacing}>
                <li>„Heute beschreibe ich eine Person aus meinem Alltag.“</li>
                <li>„Ich möchte über eine Person sprechen, die ich sehr gut kenne.“</li>
                <li>„In meiner kurzen Präsentation geht es um meinen Freund / meine Freundin.“</li>
              </ul>
            </div>

            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>2) Verbindungswörter / Connectors</strong>
              <ul style={listSpacing}>
                <li>
                  <strong>und</strong>, <strong>oder</strong>, <strong>auch</strong>
                </li>
                <li>
                  <strong>weil</strong>, <strong>deshalb</strong>
                </li>
                <li>
                  <strong>zuerst</strong>, <strong>dann</strong>, <strong>danach</strong>, <strong>am Ende</strong>
                </li>
                <li>
                  <strong>zum Beispiel</strong>, <strong>außerdem</strong>
                </li>
              </ul>
            </div>

            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>3) Eigene Meinung ausdrücken</strong>
              <ul style={listSpacing}>
                <li>„Ich finde, dass sie sehr freundlich ist.“</li>
                <li>„Meiner Meinung nach ist er sehr hilfsbereit.“</li>
                <li>„Für mich ist diese Person wichtig, weil sie immer zuhört.“</li>
              </ul>
            </div>

            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>4) Gute Schlüsse</strong>
              <ul style={listSpacing}>
                <li>„Zusammenfassend kann ich sagen, dass sie eine tolle Person ist.“</li>
                <li>„Am Ende möchte ich sagen: Ich lerne viel von ihm.“</li>
                <li>„Danke fürs Zuhören.“</li>
              </ul>
            </div>
          </div>

          <div style={{ ...questionCardStyle, background: "#ecfeff" }}>
            <strong>Modellantwort (ca. 30–45 Sekunden)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Heute beschreibe ich meine Freundin Sara. Sie ist 26 Jahre alt und kommt aus Spanien. <strong>Zuerst</strong>
              möchte ich ihr Aussehen beschreiben: Sie hat lange, braune Haare und grüne Augen, <strong>und</strong> sie trägt
              oft Jeans <strong>oder</strong> ein Kleid. Sie ist sehr freundlich, <strong>deshalb</strong> spricht jeder gern
              mit ihr. <strong>Zum Beispiel</strong> hilft sie mir, wenn ich im Büro Stress habe. Ich finde sie toll,
              <strong>weil</strong> sie immer positiv bleibt. <strong>Am Ende</strong> kann ich sagen: Sara ist eine sehr
              wichtige Person in meinem Leben.“
            </p>
          </div>

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
              href="https://www.falowen.app/campus/speech"
              target="_blank"
              rel="noreferrer"
            >
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
          <CoursebookAudioPlayer
            url="https://drive.google.com/file/d/1SIFA08DquWp-dU86pi7pHC6eElF_39I9/view?usp=sharing"
            linkLabel="Open Teil 4 audio"
          />

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
