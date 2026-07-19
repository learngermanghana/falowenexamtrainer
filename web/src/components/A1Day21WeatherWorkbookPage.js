import React from "react";
import A1TutorMarkedWorkbookShell, { WorkbookSection } from "./A1TutorMarkedWorkbookShell";
import A1CourseBookLetterPracticePanel from "./A1CourseBookLetterPracticePanel";
import { styles } from "../styles";

const DAY21_ASSIGNMENT_KEY = "A1-13";
const DAY21_WORKBOOK_TABS = Object.freeze([
  { key: "overview", label: "Overview" },
  { key: "teil-1", label: "Teil 1" },
  { key: "teil-2", label: "Teil 2" },
  { key: "teil-3", label: "Teil 3" },
  { key: "submit", label: "Submit", submit: true },
]);

const headerImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80";

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

const adBox = {
  border: "1px solid #d1d5db",
  borderRadius: 12,
  padding: 14,
  background: "#f9fafb",
  display: "grid",
  gap: 6,
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
        <h2 style={{ margin: 0 }}>A1 Day 21 · Kapitel 13 Assignment Overview</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Complete each section separately. Use Teil 1 for advertisements, Teil 2 for the message,
          and Teil 3 for the final writing task. Open Submit only after all three parts are finished.
        </p>
      </div>
    </div>

    <section style={card}>
      <h2 style={{ margin: 0 }}>Workbook sections</h2>
      {[
        ["Teil 1 · Anzeigen", "Read two sets of advertisements and answer questions 1–6."],
        ["Teil 2 · Nachricht", "Read Felix’s message and answer questions 7–9."],
        ["Teil 3 · Schreiben", "Write the requested email using weather as the reason."],
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

    <div style={card}>
      <h3>Anzeige A</h3>
      <div style={adBox}>
        <b>Sommerurlaub in Spanien</b>
        <div>📍 Costa Brava</div>
        <div>📅 1. Juli – 31. August</div>
        <div>☀️ 25°C – 30°C</div>
        <div>✈️ Flug: Berlin, Hamburg, München</div>
        <div>🏨 Hotel oder Ferienwohnung</div>
        <div>🎡 Strände, Freizeitparks, Märkte</div>
      </div>

      <h3>Anzeige B</h3>
      <div style={adBox}>
        <b>Winterurlaub in Österreich</b>
        <div>📍 Tirol</div>
        <div>📅 1. Dezember – 31. Januar</div>
        <div>❄️ -5°C bis 5°C</div>
        <div>🚆 Zug: Frankfurt, Stuttgart, Wien</div>
        <div>🏔️ Berghütte oder Hotel</div>
        <div>⛷️ Skifahren, Thermen, Weihnachtsmärkte</div>
      </div>
    </div>

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

    <div style={card}>
      <h3>Anzeige A</h3>
      <div style={adBox}>
        <b>Arbeiten am Meer in Griechenland</b>
        <div>📍 Kreta</div>
        <div>📅 Ganzjährig</div>
        <div>🌊 Direkt am Strand</div>
        <div>💼 Gastronomie, Tourismus, Hotel</div>
        <div>✈️ Flug: Frankfurt, Berlin, Düsseldorf</div>
        <div>🏠 Mitarbeiterwohnung</div>
      </div>

      <h3>Anzeige B</h3>
      <div style={adBox}>
        <b>Berufschancen in Kanada</b>
        <div>📍 Vancouver</div>
        <div>📅 Ganzjährig</div>
        <div>🌊 Pazifikküste</div>
        <div>💻 IT, Gesundheit, Bildung</div>
        <div>🏠 Firmenwohnung oder eigene Unterkunft</div>
      </div>
    </div>

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
        <strong>Introduction tip (canceling an exam appointment):</strong>{" "}
        Always use this reason when canceling an exam appointment: Ich schreibe Ihnen, weil ich den Termin absagen möchte.
      </p>
      <p style={{ marginBottom: 6 }}>
        <strong>Request tip (English):</strong> Use this request: Könnten wir einen anderen Termin vereinbaren?
      </p>
      <p style={{ marginBottom: 0 }}>
        <strong>Body tip:</strong> Schreiben Sie im Hauptteil über das Wetter (z. B. starker Regen, Sturm oder Schnee) als Grund.
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
    subtitle="Kapitel 13 · Tutor-marked Lesen & Schreiben assignment"
    assignmentIntro="Use Overview, complete Teil 1, Teil 2 and Teil 3 separately, check your writing with Mark My Letter, then open Submit and send your final answers to your tutor."
    submitTitle="Submit A1 · Day 21 · Kapitel 13"
    submitDescription="This submission is locked to A1-13. Submit your reading answers and final writing task for tutor marking."
  >
    <WeatherOverview />
    <WorkbookSection sectionKey="teil-1"><Teil1Content /></WorkbookSection>
    <WorkbookSection sectionKey="teil-2"><Teil2Content /></WorkbookSection>
    <WorkbookSection sectionKey="teil-3"><Teil3Content /></WorkbookSection>
  </A1TutorMarkedWorkbookShell>
);

export { DAY21_WORKBOOK_TABS, resolveActiveTab };
export default A1Day21WeatherWorkbookPage;
