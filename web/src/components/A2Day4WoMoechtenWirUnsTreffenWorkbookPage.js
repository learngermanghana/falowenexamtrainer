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
    stem: "Was macht der Erzähler am liebsten am Wochenende?",
    options: ["a) in die Berge fahren", "b) faul sein", "c) viel essen", "d) lernen"],
  },
  {
    stem: "Welchen Sport macht er manchmal am Wochenende?",
    options: ["a) Tennis spielen", "b) laufen", "c) wandern", "d) Hockey spielen"],
  },
  {
    stem: "Was macht er gern mit Freunden am Wochenende?",
    options: ["a) schwimmen gehen", "b) faul sein", "c) shoppen", "d) wandern"],
  },
  {
    stem: "Was plant der Erzähler mit den Freunden im Sommer?",
    options: [
      "a) eine Radtour",
      "b) in einen Vergnügungspark fahren",
      "c) Schach spielen",
      "d) zum See fahren und dort im Zelt übernachten",
    ],
  },
  {
    stem: "Welche größeren Pläne hat er in den Sommerferien?",
    options: [
      "a) einen Urlaub am Meer",
      "b) eine Route mit dem Zug durch das ganze Land",
      "c) eine Reise in die nächste Stadt",
      "d) Campen mit Zelt in den Bergen",
    ],
  },
];

const hoerenQuestions = [
  {
    stem: "Wann treffen sich Anna, Ben und Claudia am Samstag?",
    options: ["a) Um 9 Uhr", "b) Um 10 Uhr", "c) Um 11 Uhr"],
  },
  {
    stem: "Was bringt Claudia zum Ausflug mit?",
    options: ["a) Einen Zelt", "b) Einen Rucksack mit Snacks und Getränken", "c) Einen Reiseführer"],
  },
  {
    stem: "Was möchten Ben und Anna im Wald machen?",
    options: ["a) Einen Film schauen", "b) Ein Picknick machen", "c) Eine Wanderung machen"],
  },
  {
    stem: "Was planen sie am Samstagabend?",
    options: [
      "a) Ein Konzert zu besuchen",
      "b) Ein Picknick im Park",
      "c) In einem Restaurant essen und einen Film schauen",
    ],
  },
  {
    stem: "Was wollen sie am Sonntag im Park machen?",
    options: ["a) Spielen und spazieren gehen", "b) Fußball spielen", "c) Fotos machen"],
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

const A2Day4WoMoechtenWirUnsTreffenWorkbookPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 4 Workbook · Wo möchten wir uns treffen?</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          4-part workbook: speaking, writing, reading, and listening for planning meetings with friends.
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
            src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80"
            alt="Friends meeting and discussing plans together"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we&apos;ll engage in group exercises discussing these topics. Following this, I&apos;ll revise the
            questions and invite you to record an audio about yourself.
          </p>

          <h3 style={sectionTitle}>1. Zentrales Thema (Central Topic)</h3>
          <p style={{ margin: 0 }}>
            <strong>Wo möchten wir uns treffen?</strong> (Where would we like to meet?)
          </p>

          <h3 style={sectionTitle}>2. Hauptäste (Main Branches)</h3>
          <ol style={listSpacing}>
            <li>Ort (Place)</li>
            <li>Aktivitäten (Activities)</li>
            <li>Wetter und Jahreszeit (Weather and season)</li>
            <li>Anreise (Arrival/Transport)</li>
            <li>Gruppen oder alleine (With a group or alone)</li>
          </ol>

          <h3 style={sectionTitle}>3. Unteräste (Sub-Branches)</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Ort (Place)</strong>
              <ul style={listSpacing}>
                <li>Café (Cafe)</li>
                <li>Restaurant (Restaurant)</li>
                <li>Park (Park)</li>
                <li>Kino (Cinema)</li>
                <li>Einkaufszentrum (Shopping center)</li>
                <li>Zuhause (At home)</li>
                <li>Museum (Museum)</li>
                <li>Sportplatz (Sports field)</li>
              </ul>
            </li>
            <li>
              <strong>Aktivitäten (Activities)</strong>
              <ul style={listSpacing}>
                <li>Kaffeetrinken (Drinking coffee)</li>
                <li>Spaziergang machen (Taking a walk)</li>
                <li>Film schauen (Watching a movie)</li>
                <li>Essen gehen (Going for a meal)</li>
                <li>Sport treiben (Doing sports)</li>
                <li>Spielen (Playing games)</li>
              </ul>
            </li>
            <li>
              <strong>Wetter und Jahreszeit (Weather and Season)</strong>
              <ul style={listSpacing}>
                <li>Im Sommer (In the summer)</li>
                <li>Im Winter (In the winter)</li>
                <li>Bei sonnigem Wetter (On a sunny day)</li>
                <li>Bei Regen (On a rainy day)</li>
                <li>Frühling oder Herbst (Spring or autumn)</li>
              </ul>
            </li>
            <li>
              <strong>Anreise (Arrival/Transport)</strong>
              <ul style={listSpacing}>
                <li>Zu Fuß (Walking)</li>
                <li>Mit dem Fahrrad (By bike)</li>
                <li>Mit dem Auto (By car)</li>
                <li>Mit den öffentlichen Verkehrsmitteln (By public transport)</li>
                <li>Mit dem Taxi (By taxi)</li>
              </ul>
            </li>
            <li>
              <strong>Gruppen oder alleine (With a group or alone)</strong>
              <ul style={listSpacing}>
                <li>Mit Freunden (With friends)</li>
                <li>Mit der Familie (With family)</li>
                <li>Nur zu zweit (Just the two of us)</li>
                <li>Alleine (Alone)</li>
              </ul>
            </li>
          </ol>

          <h3 style={sectionTitle}>Questions</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Talk for two minutes about where and how you spend time with your friends. Mention your favorite meeting
            place, how often you meet, and what activities you do together. Also, say what is more important to you – the
            place or the activity – and how you handle different interests in friendships. After your talk, your classmates
            will ask you questions.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Aktivitäten · Treffpunkt · Freizeit</strong>
          </p>
          <p style={{ margin: 0 }}>
            <strong>Wo und wie verbringst du am liebsten Zeit mit deinen Freunden?</strong>
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
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Learner writing a formal letter in a workbook"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) (Assignment)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Schreiben Sie einen Brief an Herrn Felix Asadu, in dem Sie ihn zu einem gemeinsamen Wochenende einladen.
          </p>
          <p style={{ margin: 0 }}>In diesem Brief sollten Sie:</p>
          <ol style={listSpacing}>
            <li>Warum Sie ihn einladen (z. B. für ein Treffen oder eine besondere Veranstaltung).</li>
            <li>Fragen, wann er Zeit hat und wo das Treffen stattfinden soll.</li>
            <li>
              Anfragen, ob er etwas Bestimmtes mitbringen möchte (z. B. etwas für ein gemeinsames Abendessen oder eine
              Aktivität).
            </li>
          </ol>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area, not directly on this page.
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
            alt="Reading comprehension practice materials on a table"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0 }}>
            Read the text carefully and submit your answers in the assignment area. <strong>Do not answer directly on this page.</strong>
          </p>

          <h3 style={sectionTitle}>Pläne für die Freizeit</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Für das Wochenende und die Ferien mache ich gern Pläne. An den freien Samstagen und Sonntagen werde ich lange
            schlafen. Dann klingelt der Wecker nicht. Aber ich werde für die Wochenenden nicht zu viel planen, weil ich gern
            faul bin und nichts tue. Aber ich werde vielleicht zum Sport gehen. Manchmal habe ich am Wochenende ein Turnier.
            Diesen Sonntag zum Beispiel werde ich mit meinem Team in eine andere Stadt fahren. Wir werden dort ein Match
            gegen einen anderen Hockeyverein spielen. Das wird bestimmt ein Spaß. Wenn das Wetter schön ist, werde ich
            anschließend mit meinen Freunden schwimmen gehen. In der Nähe gibt es einen See, der wird schon warm genug sein.
            <br />
            <br />
            Wenn ich länger frei habe, mache ich gerne größere Pläne. In den Sommerferien werde ich sehr oft mit meinen
            Freunden unterwegs sein. Wir werden zum See fahren. Dort werden wir im Zelt übernachten und beim Lagerfeuer
            sitzen. Eine oder zwei Wochen möchte ich gerne reisen. Ein Freund wird mich auf der Reise begleiten, wir werden
            mit dem Zug losfahren. Wir planen eine Route durch das ganze Land, von West bis Ost und von Süd bis Nord. Mit
            Rucksäcken und Wanderschuhen werden wir auch in die Berge fahren. Am liebsten würde ich dort in einer Hütte
            übernachten. Wir werden sehen, ob wir das auch schaffen werden. Ein Abenteuer wird es aber ganz bestimmt.
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
            alt="Headphones prepared for listening comprehension practice"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören) · Ein Wochenende mit Freunden planen</h2>
          <p style={{ margin: 0 }}>
            Listen to the audio, then submit your answers in the assignment area (do not answer directly on this page).
          </p>
          <CoursebookAudioPlayer
            url="https://drive.google.com/file/d/11Q9qE9gGyIKgYIqfeVzGyVyw32VfE36P/view?usp=sharing"
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
                Anna, Ben und Claudia planen ihr Wochenende gemeinsam. Sie treffen sich am Samstagvormittag und Claudia
                bringt einen Rucksack mit Snacks und Getränken mit. Ben und Anna möchten im Wald eine Wanderung machen.
                Für den Samstagabend planen sie, in einem Restaurant zu essen und danach einen Film zu schauen. Am Sonntag
                möchten sie im Park spielen und spazieren gehen.
              </p>
            </div>
          )}

          <h3 style={sectionTitle}>Fragen mit möglichen Antworten</h3>
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
            <a href="https://youtu.be/8dX40NXG_gI" target="_blank" rel="noreferrer">
              Freizeit in Deutschland: Aktivitäten und Wochenendpläne (A2)
            </a>
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/8dX40NXG_gI"
            title="Freizeit in Deutschland: Aktivitäten und Wochenendpläne (A2)"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A2Day4WoMoechtenWirUnsTreffenWorkbookPage;
