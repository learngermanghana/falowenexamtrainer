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

const DAY13_AUDIO_KEY = "a1/day-13/day-13.mp3";

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
        ["Teil 1 · Anzeigen", "Read two sets of advertisements and answer questions 1–6."],
        ["Teil 2 · Nachricht", "Read Felix’s message and answer questions 7–9."],
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

const Teil1Content = () => (
  <section style={card} data-a1-day21-weather-teil="1">
    <h2>Teil 1 · Anzeigen</h2>
    <p><b>Instruction:</b> Read each question and choose the correct option.</p>

    <A1ReadingSourceGrid>
      <A1ReadingSourceCard label="Anzeige A" title="Sommerurlaub in Spanien">
        <div>Costa Brava</div>
        <div>1. Juli – 31. August</div>
        <div>25°C – 30°C</div>
        <div>Flug: Berlin, Hamburg, München</div>
        <div>Hotel oder Ferienwohnung</div>
        <div>Strände, Freizeitparks, Märkte</div>
      </A1ReadingSourceCard>
      <A1ReadingSourceCard label="Anzeige B" title="Winterurlaub in Österreich">
        <div>Tirol</div>
        <div>1. Dezember – 31. Januar</div>
        <div>-5°C bis 5°C</div>
        <div>Zug: Frankfurt, Stuttgart, Wien</div>
        <div>Berghütte oder Hotel</div>
        <div>Skifahren, Thermen, Weihnachtsmärkte</div>
      </A1ReadingSourceCard>
    </A1ReadingSourceGrid>

    {[
      "Du möchtest im Sommer an den Strand gehen und warmes Wetter genießen.",
      "Du liebst Skifahren und möchtest Winterurlaub machen.",
      "Du suchst ein Hotel in Spanien für deinen Urlaub.",
    ].map((question, index) => (
      <div key={question} style={questionBox}>
        <b>{index + 1}. {question}</b>
        <div>A. Anzeige A</div>
        <div>B. Anzeige B</div>
      </div>
    ))}

    <A1ReadingSourceGrid>
      <A1ReadingSourceCard label="Anzeige A" title="Arbeiten am Meer in Griechenland">
        <div>Kreta</div>
        <div>Ganzjährig</div>
        <div>Direkt am Strand</div>
        <div>Gastronomie, Tourismus, Hotel</div>
        <div>Flug: Frankfurt, Berlin, Düsseldorf</div>
        <div>Mitarbeiterwohnung</div>
      </A1ReadingSourceCard>
      <A1ReadingSourceCard label="Anzeige B" title="Berufschancen in Kanada">
        <div>Vancouver</div>
        <div>Ganzjährig</div>
        <div>Pazifikküste</div>
        <div>IT, Gesundheit, Bildung</div>
        <div>Firmenwohnung oder eigene Unterkunft</div>
      </A1ReadingSourceCard>
    </A1ReadingSourceGrid>

    {[
      "Du möchtest am Meer arbeiten in der Gastronomie.",
      "Du willst im IT-Bereich arbeiten und in einer multikulturellen Stadt leben.",
      "Du möchtest in Kanada arbeiten und nahe der Pazifikküste leben.",
    ].map((question, index) => (
      <div key={question} style={questionBox}>
        <b>{index + 4}. {question}</b>
        <div>A. Anzeige A</div>
        <div>B. Anzeige B</div>
      </div>
    ))}
  </section>
);

const Teil2Content = () => (
  <section style={card} data-a1-day21-weather-teil="2">
    <h2>Teil 2 · Nachricht</h2>
    <div style={highlight}>
      <p><b>Liebe Freunde,</b></p>
      <p>Ich habe tolle Neuigkeiten! Es gibt spannende Jobangebote im Ausland.</p>
      <p><b>Jobangebot 1:</b> Mallorca (Spanien)</p>
      <p>Jobs: Kellner, Koch, Reinigungskraft • Unterkunft: Hotelzimmer • Wetter: sonnig • Sprachkurs: Spanisch</p>
      <p><b>Jobangebot 2:</b> Toronto (Kanada)</p>
      <p>Jobs: Verkäufer, Büroassistent • Unterkunft: WG/Apartments • multikulturell • Englischkurs</p>
      <p>Liebe Grüße, Felix</p>
    </div>

    {[
      "Wo kannst du im Sommer als Kellner oder Koch arbeiten?",
      "Welche Stadt bietet Englischkurse und Stadtbesichtigungen?",
      "Welche Unterkunft gibt es in Kanada?",
    ].map((question, index) => (
      <div key={question} style={questionBox}>
        <b>{index + 7}. {question}</b>
        <div>A. Option A</div>
        <div>B. Option B</div>
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
        day: 13,
        key: DAY13_AUDIO_KEY,
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
          <b>{index + 1}. {item.stem}</b>
          {item.options.map((option) => <div key={option}>{option}</div>)}
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
