import React, { useState } from "react";
import A1TutorMarkedWorkbookShell, { WorkbookSection } from "./A1TutorMarkedWorkbookShell";
import { A1ReadingSourceCard, A1ReadingSourceGrid } from "./A1TutorMarkedReadingLayout";
import A1CourseBookLetterPracticePanel from "./A1CourseBookLetterPracticePanel";
import { useAuth } from "../context/AuthContext";
import { fetchA1AudioPlaybackUrl } from "../services/a1AudioService";
import { styles } from "../styles";

const DAY21_ASSIGNMENT_KEY = "A1-13";
const DAY21_WORKBOOK_TABS = Object.freeze([
  { key: "overview", label: "Overview" },
  { key: "teil-1", label: "Teil 1" },
  { key: "teil-2", label: "Teil 2" },
  { key: "teil-3", label: "Teil 3" },
  { key: "teil-4", label: "Teil 4" },
  { key: "submit", label: "Submit", submit: true },
]);

const headerImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80";

const DAY21_AUDIO_KEY = "a1/day-21/day-21.mp3";

const DAY13_LISTENING_QUESTIONS = Object.freeze([
  {
    stem: "Wie ist das Wetter heute?",
    options: ["A. Es ist warm und sonnig.", "B. Es ist kalt und es regnet.", "C. Es ist windig und warm."],
  },
  {
    stem: "Wie ist das Wetter am Dienstag?",
    options: ["A. Es ist sonnig und warm.", "B. Es regnet stark.", "C. Es ist kalt und windig."],
  },
  {
    stem: "Wie warm ist es am Dienstag?",
    options: ["A. 12 Grad", "B. 20 Grad", "C. 30 Grad"],
  },
  {
    stem: "Wann gehen Anna und Tom in den Park?",
    options: ["A. Dienstag um 15:30 Uhr", "B. Mittwoch um 10:00 Uhr", "C. Donnerstag um 19:00 Uhr"],
  },
  {
    stem: "Wann hat Anna den Arzttermin?",
    options: ["A. Dienstag um 15:30 Uhr", "B. Mittwoch um 10:00 Uhr", "C. Donnerstag um 19:00 Uhr"],
  },
  {
    stem: "Wann essen Anna und Tom im Restaurant?",
    options: ["A. Dienstag um 19:00 Uhr", "B. Mittwoch um 19:00 Uhr", "C. Donnerstag um 19:00 Uhr"],
  },
]);


const card = {
  ...styles.card,
  display: "grid",
  gap: 14,
};

const questionBox = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
  background: "#fff",
  display: "grid",
  gap: 8,
};

const highlight = {
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  borderRadius: 12,
  padding: 14,
};

const WeatherOverview = () => (
  <div style={{ display: "grid", gap: 16 }} data-a1-day21-weather-overview="true">
    <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
      <img
        src={headerImage}
        alt="Sunny travel destination"
        style={{ width: "100%", height: 200, objectFit: "cover" }}
      />
      <div style={{ padding: 16, display: "grid", gap: 8 }}>
        <div style={{ border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 12, padding: 12, lineHeight: 1.65 }}>
          <strong>Finish Strong · Controlled Mock · 35 minutes</strong>
          <p style={{ margin: "6px 0 0" }}>
            This is one of your final A1 challenges. Prepare before you start, then work independently: read carefully, manage your time and write the 35–50 word email from memory. Mark My Letter is locked while the timer is running.
          </p>
        </div>
        <h2 style={{ margin: 0 }}>A1 Day 21 · Kapitel 13 Assignment Overview</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Complete each section separately. Use Teil 1 for advertisements, Teil 2 for the message,
          Teil 3 for the final writing task and Teil 4 for listening. Open Submit only after all four parts are finished.
        </p>
      </div>
    </div>

    <section style={card}>
      <h2 style={{ margin: 0 }}>Workbook sections</h2>
      {[
        ["Teil 1 · Anzeigen", "Read five weather situations and choose Text A or Text B."],
        ["Teil 2 · Nachricht", "Read the Radio ND2 weather report and answer five Richtig/Falsch questions."],
        ["Teil 3 · Schreiben", "Write the requested email using weather as the reason."],
        ["Teil 4 · Hören", "Listen to Anna’s message and answer six multiple-choice questions."],
      ].map(([title, description]) => (
        <div key={title} style={questionBox}>
          <strong>{title}</strong>
          <p style={{ margin: 0, lineHeight: 1.6 }}>{description}</p>
        </div>
      ))}
    </section>
  </div>
);

const weatherSituations = [
  {
    "prompt": "Sie möchten heute draußen im See schwimmen gehen. Sie suchen schönes, heißes Sommerwetter.",
    "textA": "Wetter heute: Starker Regen und kalter Wind bei 12 Grad. Ziehen Sie eine warme Jacke an!",
    "textB": "Wetter heute: Viel Sonnenschein und 28 Grad! Perfekt für den Strand und das Schwimmbad."
  },
  {
    "prompt": "Es ist Winter. Sie möchten mit Ihren Kindern im Schnee spielen und einen Schneemann bauen.",
    "textA": "Wetterbericht: Schnee und Kälte im Süden! Am Wochenende ideal zum Skifahren und Spielen im Schnee.",
    "textB": "Wetterbericht: Viel Sonne und milde 15 Grad im Westen. Kein Schnee in Sicht."
  },
  {
    "prompt": "Sie möchten morgen ein Picknick im Park machen. Sie suchen einen Tag, an dem es nicht regnet und die Sonne scheint.",
    "textA": "Wetter morgen: Den ganzen Tag trocken und sonnig. Keine Wolken bei 22 Grad.",
    "textB": "Wetter morgen: Am Nachmittag dunkle Wolken und starker Regen. Vergessen Sie den Regenschirm nicht!"
  },
  {
    "prompt": "Sie müssen morgen früh mit dem Auto zur Arbeit fahren. Sie möchten wissen, ob die Straßen gefährlich (Eis/Frost) sind.",
    "textA": "Achtung Autofahrer: Heute Nacht Frost und Glatteis auf den Straßen. Fahren Sie bitte vorsichtig und langsam!",
    "textB": "Schönes Frühlingswetter: Milde 18 Grad und trocken. Gute Fahrt!"
  },
  {
    "prompt": "Es regnet diese Woche jeden Tag. Sie möchten einen Schutz gegen den Regen kaufen.",
    "textA": "Supermarkt Angebot: Große Sonnenschirme für den Garten – heute nur 15 Euro!",
    "textB": "Wetter-Shop: Praktische Regenschirme – klein, windfest und 100 % wasserdicht."
  }
];

const weatherStatements = [
  "Am Samstag ist das Wetter im Norden warm und sonnig.",
  "Am Samstag braucht man im Süden keinen Regenschirm.",
  "Am Sonntag regnet es den ganzen Tag.",
  "Am Sonntag gibt es viel Wind.",
  "Ab Montag wird das Wetter wieder wärmer."
];

const Teil1Content = () => (
  <section style={card} data-a1-day21-weather-teil="1">
    <h2>Teil 1 · Anzeigen</h2>
    <p>Lesen Sie die Situationen (1–5) und die zwei Texte (A und B). Welcher Text passt? Wählen Sie a oder b.</p>
    {weatherSituations.map((item, index) => (
      <div key={item.prompt} style={questionBox}>
        <h3 style={{ margin: 0 }}>Situation {index + 1}</h3>
        <strong>{index + 1}. {item.prompt}</strong>
        <A1ReadingSourceGrid>
          <A1ReadingSourceCard label="Text A"><p style={{ margin: 0 }}>{item.textA}</p></A1ReadingSourceCard>
          <A1ReadingSourceCard label="Text B"><p style={{ margin: 0 }}>{item.textB}</p></A1ReadingSourceCard>
        </A1ReadingSourceGrid>
        <p style={{ margin: 0 }}>Welcher Text passt?</p>
        <p style={{ margin: 0 }}>a) Text A</p>
        <p style={{ margin: 0 }}>b) Text B</p>
      </div>
    ))}
  </section>
);

const Teil2Content = () => (
  <section style={card} data-a1-day21-weather-teil="2">
    <h2>Teil 2 · Nachricht</h2>
    <p>Lesen Sie den Wetterbericht aus dem Radio. Sind die Aussagen (1–5) Richtig (R) oder Falsch (F)?</p>
    <A1ReadingSourceCard label="Radio-Wetterbericht" title="Radio ND2 – Der Wetterbericht für das Wochenende">
      <p>Guten Tag, liebe Hörerinnen und Hörer! Hier ist das Wetter für Samstag und Sonntag.</p>
      <p>Am Samstag ist das Wetter im Norden sehr schön: Die Sonne scheint den ganzen Tag und es wird warm bis 24 Grad. Im Süden ist es kälter (nur 12 Grad) und am Nachmittag gibt es starken Regen. Vergessen Sie dort Ihren Regenschirm nicht!</p>
      <p>Am Sonntag wird es überall sehr windig und viele Wolken sind am Himmel. Es regnet aber nicht mehr und die Temperaturen liegen bei 18 Grad.</p>
      <p>Achtung: Ab Montag wird es wieder richtig kalt mit Schnee im ganzen Land.</p>
    </A1ReadingSourceCard>
    {weatherStatements.map((statement, index) => (
      <div key={statement} style={questionBox}>
        <strong>{index + 1}. {statement}</strong>
        <p style={{ margin: 0 }}>Richtig</p>
        <p style={{ margin: 0 }}>Falsch</p>
      </div>
    ))}
  </section>
);

const Teil3Content = () => (
  <section style={card} data-a1-day21-weather-teil="3">
    <h2>Teil 3 · Schreiben</h2>
    <div style={highlight}>
      <p>Schreiben Sie eine E-Mail an Bina. Sie hat Sie zur Hochzeit eingeladen, aber Sie können nicht kommen.</p>
      <ul>
        <li>Warum schreiben Sie?</li>
        <li>Warum können Sie nicht kommen? (Wetter-Grund)</li>
        <li>Was schlagen Sie vor?</li>
      </ul>
      <p style={{ marginBottom: 6 }}>
        <strong>Introduction tip:</strong>{" "}
        This is an informal email to Bina. A clear opening is: <strong>Ich schreibe dir, weil ich leider nicht zu deiner Hochzeit kommen kann.</strong>
      </p>
      <p style={{ marginBottom: 6 }}>
        <strong>Suggestion tip:</strong>{" "}
        End with a simple suggestion, for example: <strong>Vielleicht können wir uns nächste Woche treffen.</strong>
      </p>
      <p style={{ marginBottom: 0 }}>
        <strong>Weather tip:</strong> Give one concrete weather reason in the main part, for example <strong>starker Regen</strong>, <strong>ein Sturm</strong> or <strong>viel Schnee</strong>.
      </p>
    </div>
    <A1CourseBookLetterPracticePanel
      title="Mark My Weather Letter"
      description="Write or paste your E-Mail to Bina here. Falowen will mark it and explain the corrections before you copy the improved version to Submit."
      taskId="A1-13-teil-3-weather-letter"
      taskTitle="Weather reason email to Bina"
      taskContext="email to Bina declining a wedding invitation with a weather reason and suggesting another time"
      letterType="informal"
      promptType="email"
      placeholder={"Liebe Bina,\n\nich schreibe dir, weil ...\n\nLiebe Grüße\n..."}
      minimumWords={35}
      maximumWords={50}
      assignmentKey={DAY21_ASSIGNMENT_KEY}
      workbookId="A1-13-weather-workbook"
      day={21}
      chapter="13"
      lessonId="A1-day-21-chapter-13"
    />
  </section>
);


const Teil4Content = () => {
  const { idToken } = useAuth();
  const [audioUrl, setAudioUrl] = useState("");
  const [audioError, setAudioError] = useState("");
  const [loadingAudio, setLoadingAudio] = useState(false);

  const loadAudio = async () => {
    if (audioUrl || loadingAudio) return;
    setLoadingAudio(true);
    setAudioError("");
    try {
      const playback = await fetchA1AudioPlaybackUrl({
        day: 21,
        key: DAY21_AUDIO_KEY,
        idToken,
      });
      setAudioUrl(playback.url);
    } catch (error) {
      setAudioError(error?.response?.data?.error || error?.message || "Audio could not be loaded.");
    } finally {
      setLoadingAudio(false);
    }
  };

  return (
    <section style={card} data-a1-day21-weather-teil="4">
      <h2>Teil 4 · Hören</h2>
      <div style={highlight}>
        <p style={{ marginTop: 0 }}>
          <b>Instruction:</b> Listen to Anna’s message twice. Choose A, B or C for each question.
          Pay attention to the weather, days and appointment times.
        </p>
        {!audioUrl ? (
          <button type="button" onClick={loadAudio} disabled={loadingAudio} style={{ justifySelf: "start" }}>
            {loadingAudio ? "Audio wird geladen …" : "Hören starten"}
          </button>
        ) : (
          <audio controls preload="metadata" src={audioUrl} style={{ width: "100%" }}>
            Ihr Browser unterstützt dieses Audio nicht.
          </audio>
        )}
        {audioError ? <p style={{ margin: 0, color: "#b91c1c" }}>{audioError}</p> : null}
      </div>

      {DAY13_LISTENING_QUESTIONS.map((item, index) => (
        <div key={item.stem} style={questionBox}>
          <strong>{index + 1}. {item.stem}</strong>
        {item.options.map((option) => <span key={option}>{option}</span>)}
        </div>
      ))}
    </section>
  );
};

const resolveActiveTab = (search = "") => {
  const requested = new URLSearchParams(search || "").get("workbookTab") || "overview";
  return DAY21_WORKBOOK_TABS.some((tab) => tab.key === requested) ? requested : "overview";
};

const A1Day21WeatherWorkbookPage = () => (
  <A1TutorMarkedWorkbookShell
    day={21}
    chapter="13"
    fallbackAssignmentKey={DAY21_ASSIGNMENT_KEY}
    title="A1 · Day 21 Workbook · Weather"
    subtitle="Kapitel 13 · Tutor-marked Lesen, Schreiben & Hören assignment"
    assignmentIntro="Use Overview, then complete Teil 1, Teil 2, Teil 3 and Teil 4 independently inside the controlled mock. Submit your own work first; use Mark My Letter later when review is unlocked."
    submitTitle="Submit A1 · Day 21 · Kapitel 13"
    submitDescription="Submit your reading answers, final writing task and Teil 4 listening answers for tutor marking."
  >
    <WeatherOverview />
    <WorkbookSection sectionKey="teil-1"><Teil1Content /></WorkbookSection>
    <WorkbookSection sectionKey="teil-2"><Teil2Content /></WorkbookSection>
    <WorkbookSection sectionKey="teil-3"><Teil3Content /></WorkbookSection>
    <WorkbookSection sectionKey="teil-4"><Teil4Content /></WorkbookSection>
  </A1TutorMarkedWorkbookShell>
);

export { DAY21_WORKBOOK_TABS, resolveActiveTab };
export default A1Day21WeatherWorkbookPage;
