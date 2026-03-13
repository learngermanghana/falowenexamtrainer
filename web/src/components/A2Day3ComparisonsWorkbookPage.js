import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
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

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const lesenQuestions = [
  {
    stem: "Wie alt ist Anna?",
    options: ["a) 20 Jahre", "b) 25 Jahre", "c) 30 Jahre", "d) 27 Jahre"],
  },
  {
    stem: "Was macht Anna in ihrer Freizeit?",
    options: ["a) Fußball spielen und kochen", "b) Bücher lesen und spazieren gehen", "c) Tanzen und malen", "d) Reisen und Musik hören"],
  },
  {
    stem: "Wo arbeitet Anna?",
    options: ["a) In einer Schule", "b) In einer Tierklinik", "c) In einem Krankenhaus", "d) In einem Café"],
  },
  {
    stem: "Welches Tier hat Anna?",
    options: ["a) Eine Katze", "b) Einen Vogel", "c) Einen Hund", "d) Kein Tier"],
  },
  {
    stem: "Was unterrichtet Max?",
    options: ["a) Deutsch", "b) Mathematik", "c) Geschichte", "d) Englisch"],
  },
  {
    stem: "Was macht Max oft mit seinen Freunden?",
    options: ["a) Fußball spielen", "b) Spazieren gehen", "c) Kino besuchen", "d) Tanzen"],
  },
  {
    stem: "Was unternehmen Anna und Max am Wochenende?",
    options: [
      "a) Sie gehen ins Fitnessstudio",
      "b) Sie machen Ausflüge oder gehen ins Museum",
      "c) Sie bleiben zu Hause",
      "d) Sie besuchen Freunde in Hamburg",
    ],
  },
];

const hoerenQuestions = [
  {
    stem: "Wie alt ist Julia?",
    options: ["a) 24 Jahre", "b) 26 Jahre", "c) 28 Jahre", "d) 30 Jahre"],
  },
  {
    stem: "Was macht Julia beruflich?",
    options: ["a) Köchin", "b) Lehrerin", "c) Architektin", "d) Musikerin"],
  },
  {
    stem: "Wo lebt Tobias?",
    options: ["a) In München", "b) In Frankfurt", "c) In Hamburg", "d) In Berlin"],
  },
  {
    stem: "Was möchte Tobias in Zukunft machen?",
    options: ["a) Ein eigenes Restaurant eröffnen", "b) Musiker werden", "c) Eine Weltreise machen", "d) Lehrer werden"],
  },
  {
    stem: "Was machen Julia und Tobias oft am Wochenende?",
    options: ["a) Sie spielen Gitarre.", "b) Sie kochen gemeinsam mit Sophie.", "c) Sie reisen in die Berge.", "d) Sie gehen ins Kino"],
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

const A2Day3ComparisonsWorkbookPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 3 Workbook · Dinge und Personen vergleichen</h1>
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
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80"
            alt="Learners comparing ideas in a classroom discussion"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Zentrales Thema: <strong>Dinge und Personen vergleichen</strong>.
          </p>

          <h3 style={sectionTitle}>1) Wichtige Strukturen</h3>
          <ul style={listSpacing}>
            <li>Komparativ (+ als): „größer als“, „schneller als“</li>
            <li>Superlativ (+ am/der, die, das -ste): „am schönsten“, „der schnellste“</li>
            <li>Genauso ... wie: „genauso groß wie“</li>
            <li>Nicht so ... wie: „nicht so teuer wie“</li>
          </ul>

          <h3 style={sectionTitle}>2) Vergleichsadjektive</h3>
          <ul style={listSpacing}>
            <li>Bedeutung: Zum Vergleichen von zwei Dingen, Handlungen oder Zuständen.</li>
            <li>Bildung: Adjektiv + -er (z. B. schnell → schneller).</li>
            <li>Bei manchen Adjektiven: mehr oder weniger (z. B. mehr interessant).</li>
          </ul>

          <h3 style={sectionTitle}>3) Vergleichsformen</h3>
          <ul style={listSpacing}>
            <li>Gleichheit: so ... wie („Mein Bruder ist so alt wie ich.“)</li>
            <li>Ungleichheit: ...er ... als („Sie ist größer als ihr Freund.“)</li>
            <li>Superlativ: am -sten („am schnellsten“)</li>
          </ul>

          <h3 style={sectionTitle}>4) Nützliche Ausdrücke</h3>
          <ul style={listSpacing}>
            <li>„... ist besser als ...“</li>
            <li>„... ist genauso ... wie ...“</li>
            <li>„... ist viel ... als ...“</li>
            <li>„Ich finde ... interessanter als ...“</li>
            <li>„Das ist der beste ...“</li>
            <li>„... ist weniger ... als ...“</li>
          </ul>

          <h3 style={sectionTitle}>5) Häufige Fehler</h3>
          <ul style={listSpacing}>
            <li>Adjektiv-Endungen beachten (z. B. „ein schnellerer Wagen“).</li>
            <li>Wortstellung im Vergleich korrekt bilden (z. B. „Mein Hund ist größer als dein Hund.“).</li>
          </ul>

          <h3 style={sectionTitle}>6) Vergleiche von Dingen</h3>
          <p style={{ margin: 0 }}>Handys (Samsung vs. iPhone), Autos (Tesla vs. BMW), Städte (Berlin vs. München), Verkehrsmittel (Bus vs. Fahrrad)</p>
          <ul style={listSpacing}>
            <li>„Ein Tesla ist teurer als ein BMW.“</li>
            <li>„München ist kleiner als Berlin.“</li>
            <li>„Mein Handy ist genauso neu wie dein Handy.“</li>
          </ul>

          <h3 style={sectionTitle}>7) Vergleiche von Personen</h3>
          <p style={{ margin: 0 }}>Alter, Größe, Intelligenz, Stärke (älter/jünger, größer/kleiner, klüger/dümmer, stärker/schwächer)</p>
          <ul style={listSpacing}>
            <li>„Mein Bruder ist älter als ich.“</li>
            <li>„Lisa ist genauso fleißig wie Tom.“</li>
            <li>„Peter ist nicht so sportlich wie Anna.“</li>
          </ul>

          <h3 style={sectionTitle}>8) Vergleiche im Alltag</h3>
          <p style={{ margin: 0 }}>Lebensstil (Stadt vs. Land), Ernährung (Fast Food vs. Hausmannskost), Schulsysteme (Deutschland vs. Nigeria)</p>
          <ul style={listSpacing}>
            <li>„Das Leben in der Stadt ist hektischer als auf dem Land.“</li>
            <li>„Hausmannskost ist gesünder als Fast Food.“</li>
          </ul>

          <h3 style={sectionTitle}>9) Nützliche Wörter + Fragen zum Üben</h3>
          <p style={{ margin: 0 }}>
            Kleine Unterschiede: ein bisschen, etwas, leicht · Große Unterschiede: viel, deutlich, extrem · Gleichheit: genauso,
            ebenso, ähnlich
          </p>
          <ul style={listSpacing}>
            <li>Was ist größer: ein Elefant oder ein Löwe?</li>
            <li>Welches Verkehrsmittel ist umweltfreundlicher: Fahrrad oder Auto?</li>
            <li>Ist Pizza leckerer als Gemüse?</li>
            <li>Wer ist berühmter: Ronaldo oder Messi?</li>
          </ul>
          <p style={{ margin: 0 }}>
            Kannst du zwei Dinge oder Personen vergleichen? Was sind die Unterschiede und Gemeinsamkeiten?
            (größer/kleiner, schneller/langsamer, teurer/billiger, besser/schlechter)
          </p>

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
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80"
            alt="Workbook writing task on a desk"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Assignment</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Anleitung:</strong> Schreibe einen informellen Brief an deinen Klassenkameraden/deine Klassenkameradin.
            Vergleiche in deinem Brief Accra und Kumasi, Pizza und Hamburger sowie Fußball und Tennis. Erkläre, welche der
            beiden Optionen du bevorzugst und warum.
          </p>
          <ol style={listSpacing}>
            <li>
              Vergleiche Accra und Kumasi. Welche Stadt findest du schöner und warum? Beispiel: „Ich finde Kumasi schöner als
              Accra, weil es dort mehr Natur gibt und es ruhiger ist. Accra ist eine große Stadt und oft sehr hektisch.“
            </li>
            <li>
              Welches Essen schmeckt besser: Pizza oder Hamburger? Beispiel: „Ich bevorzuge Pizza, weil ich den Geschmack von
              frischen Zutaten wie Tomaten und Käse mag. Aber Hamburger sind auch lecker und besonders praktisch, wenn man
              etwas Schnelles essen möchte.“
            </li>
            <li>
              Welcher Sport ist spannender: Fußball oder Tennis? Beispiel: „Ich finde Fußball spannender als Tennis, weil das
              Spiel viel schneller und dynamischer ist. Fußballspiele sind oft sehr aufregend!“
            </li>
          </ol>
          <p style={{ margin: 0 }}>
            Am Ende des Briefes: Lade deinen Klassenkameraden/deine Klassenkameradin ein, deine Meinung zu teilen und ein
            Treffen zu planen.
          </p>
          <p style={{ margin: 0 }}>
            Tipp: Beginne mit „Lieber Felix“. Schreibe: „Wie geht es dir? Mir geht es gut. Ich schreibe dir, weil ...“ Verwende
            Konjunktionen wie „denn“, „aber“, „weil“ oder „deshalb“. Schließe mit: „Ich freue mich im Voraus auf deine Antwort.
            Viele Grüße, [Dein Name]“
          </p>
          <p style={{ margin: 0 }}>
            Practice your draft before submission on the writing page: {" "}
            <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">
              Open Writing Practice
            </a>{" "}
            (you can use the Ideas Generator there for support).
          </p>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area (same workflow as usual), not directly on this page.
          </p>
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80"
            alt="German reading exercise and notebook"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen) · Exercise</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit section at
            the bottom of the lesson to send your answers.
          </p>

          <h3 style={sectionTitle}>Text</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Anna ist 25 Jahre alt und wohnt in Berlin, einer lebendigen Großstadt in Deutschland. Sie hat lange, blonde Haare,
            blaue Augen und ein strahlendes Lächeln. Anna arbeitet als Krankenschwester in einem Krankenhaus, wo sie sich um
            ihre Patienten kümmert. Sie liebt ihren Beruf, weil sie gerne anderen Menschen hilft. Ihre Kollegen schätzen sie
            sehr, weil sie immer freundlich und hilfsbereit ist. In ihrer Freizeit liest Anna gerne Romane, vor allem
            Liebesgeschichten, und geht oft in den Park spazieren. Außerdem trifft sie sich regelmäßig mit ihrer besten
            Freundin Lisa, um Kaffee zu trinken oder ins Kino zu gehen. Anna mag auch Tiere und hat einen kleinen Hund namens
            Bruno, den sie oft mit in den Park nimmt. Max ist Annas Freund. Er ist 27 Jahre alt und wohnt auch in Berlin. Er
            hat kurze, braune Haare, grüne Augen und trägt eine Brille. Max ist Lehrer für Mathematik an einer Schule und
            unterrichtet dort Schüler zwischen 12 und 16 Jahren. Seine Schüler mögen ihn, weil er geduldig ist und schwierige
            Themen gut erklären kann. In seiner Freizeit spielt Max gerne Fußball mit seinen Freunden im Park. Er liebt es
            auch, neue Rezepte auszuprobieren und gemeinsam mit Anna oder Freunden zu kochen. Max ist ein humorvoller und
            kreativer Mensch, der immer neue Ideen hat, wie man den Alltag spannender gestalten kann. Am Wochenende
            unternehmen Anna und Max oft etwas zusammen, zum Beispiel Ausflüge in die Natur oder Museumsbesuche in der Stadt.
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
            src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1600&q=80"
            alt="Listening practice with headphones and audio notes"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören) · Exercise</h2>
          <p style={{ margin: 0 }}>
            Note: The audio has been uploaded among the files in this chapter, or you can open this link in your browser.
          </p>
          <CoursebookAudioPlayer
            url="https://drive.google.com/file/d/1aug6j5RPa8-N6_wrVULpEj-7-ActEin1/view?usp=sharing"
            linkLabel="Open Teil 4 audio"
          />
          <p style={{ margin: 0 }}>
            Submit your answers in the assignment area (do not answer directly on this page).
          </p>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
            <input type="checkbox" checked={teacherMode} onChange={(event) => setTeacherMode(event.target.checked)} />
            Teacher mode (show transcript)
          </label>

          {teacherMode && (
            <div style={{ ...questionCardStyle, background: "#fefce8" }}>
              <strong>Transcript (teacher support)</strong>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Julia ist 26 Jahre alt und arbeitet als Architektin. Tobias lebt in Hamburg und spricht über seine Zukunft:
                Er möchte eine Weltreise machen. Am Wochenende verbringen Julia und Tobias gerne Zeit mit ihrer Freundin
                Sophie, und sie kochen oft zusammen.
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

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A2Day3ComparisonsWorkbookPage;
