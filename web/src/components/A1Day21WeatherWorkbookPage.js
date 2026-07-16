import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
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

const tabButtonStyle = (selected, submit = false) => ({
  ...styles.secondaryButton,
  background: selected ? (submit ? "#166534" : "#2563eb") : submit ? "#ecfdf5" : "#ffffff",
  borderColor: submit ? "#86efac" : selected ? "#2563eb" : "#93c5fd",
  color: selected ? "#ffffff" : submit ? "#166534" : "#1d4ed8",
  flex: "1 1 120px",
  fontWeight: 900,
  minHeight: 44,
  padding: "9px 14px",
});

const Day21SectionNavigation = ({ activeTab, onSelect }) => (
  <section
    aria-label="A1 Day 21 workbook navigation"
    style={{
      ...styles.card,
      border: "2px solid #2563eb",
      background: "linear-gradient(135deg, #dbeafe 0%, #ffffff 74%)",
      marginBottom: 0,
      padding: 12,
      position: "sticky",
      top: 8,
      zIndex: 35,
    }}
  >
    <div
      role="tablist"
      aria-label="A1 Day 21 Overview, Teil and Submit navigation"
      style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
    >
      {DAY21_WORKBOOK_TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.key}
          style={tabButtonStyle(activeTab === tab.key, tab.submit)}
          onClick={() => onSelect(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </section>
);

const WeatherOverview = ({ onOpenTeil }) => (
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
        ["teil-1", "Teil 1 · Anzeigen", "Read two sets of advertisements and answer questions 1–6."],
        ["teil-2", "Teil 2 · Nachricht", "Read Felix’s message and answer questions 7–9."],
        ["teil-3", "Teil 3 · Schreiben", "Write the requested email using weather as the reason."],
      ].map(([key, title, description]) => (
        <div key={key} style={questionBox}>
          <strong>{title}</strong>
          <p style={{ margin: 0, lineHeight: 1.6 }}>{description}</p>
          <button
            type="button"
            style={{ ...styles.secondaryButton, width: "fit-content" }}
            onClick={() => onOpenTeil(key)}
          >
            Open {title.split(" · ")[0]}
          </button>
        </div>
      ))}
    </section>
  </div>
);

const Teil1Content = () => (
  <section style={card} data-a1-day21-weather-teil="1">
    <h2>Teil 1 · Anzeigen</h2>
    <p>
      <b>Instruction:</b> Read each question and choose the correct option.
    </p>

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
      <p>
        Jobs: Kellner, Koch, Reinigungskraft • Unterkunft: Hotelzimmer • Wetter: sonnig •
        Sprachkurs: Spanisch
      </p>
      <p><b>Jobangebot 2:</b> Toronto (Kanada)</p>
      <p>
        Jobs: Verkäufer, Büroassistent • Unterkunft: WG/Apartments • multikulturell •
        Englischkurs
      </p>
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
      <p>
        Schreiben Sie eine E-Mail an Bina. Sie hat Sie zur Hochzeit eingeladen, aber Sie können
        nicht kommen.
      </p>
      <ul>
        <li>Warum schreiben Sie?</li>
        <li>Warum können Sie nicht kommen? (Wetter-Grund)</li>
        <li>Was schlagen Sie vor?</li>
      </ul>
      <p style={{ marginBottom: 6 }}>
        <strong>Introduction tip (canceling an exam appointment):</strong>{" "}
        Always use this reason when canceling an exam appointment: Ich schreibe Ihnen, weil ich den
        Termin absagen möchte.
      </p>
      <p style={{ marginBottom: 6 }}>
        <strong>Request tip (English):</strong> Use this request: Könnten wir einen anderen Termin
        vereinbaren?
      </p>
      <p style={{ marginBottom: 0 }}>
        <strong>Body tip:</strong> Schreiben Sie im Hauptteil über das Wetter (z. B. starker Regen,
        Sturm oder Schnee) als Grund.
      </p>
    </div>
  </section>
);

const resolveActiveTab = (search = "") => {
  const requested = new URLSearchParams(search || "").get("workbookTab") || "overview";
  return DAY21_WORKBOOK_TABS.some((tab) => tab.key === requested) ? requested : "overview";
};

const A1Day21WeatherWorkbookPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = useMemo(() => resolveActiveTab(location.search), [location.search]);

  const openTab = (tabKey) => {
    const nextSearch = new URLSearchParams(location.search || "");
    nextSearch.set("workbookTab", tabKey);
    nextSearch.set("assignmentKey", DAY21_ASSIGNMENT_KEY);
    nextSearch.set("assignmentId", DAY21_ASSIGNMENT_KEY);
    nextSearch.set("level", "A1");

    navigate(
      { pathname: location.pathname, search: `?${nextSearch.toString()}` },
      {
        replace: true,
        state: {
          ...(location.state || {}),
          level: "A1",
          day: 21,
          assignmentKey: DAY21_ASSIGNMENT_KEY,
          assignmentId: DAY21_ASSIGNMENT_KEY,
          canonicalAssignmentKey: DAY21_ASSIGNMENT_KEY,
          inlineCourseSubmission: true,
        },
      },
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigation = <Day21SectionNavigation activeTab={activeTab} onSelect={openTab} />;
  const activeContent = activeTab === "teil-1"
    ? <Teil1Content />
    : activeTab === "teil-2"
      ? <Teil2Content />
      : activeTab === "teil-3"
        ? <Teil3Content />
        : <WeatherOverview onOpenTeil={openTab} />;

  return (
    <div data-a1-day21-sectioned-workbook="true">
      <style>{`
        [data-a1-day21-sectioned-workbook="true"]
        [aria-label="A1 · Day 21 Workbook · Weather workbook tabs"] {
          display: none !important;
        }
      `}</style>
      {activeTab === "submit" ? navigation : null}
      <A1TutorMarkedWorkbookShell
        day={21}
        chapter="13"
        fallbackAssignmentKey={DAY21_ASSIGNMENT_KEY}
        title="A1 · Day 21 Workbook · Weather"
        subtitle="Kapitel 13 · Tutor-marked Lesen & Schreiben assignment"
        assignmentIntro="Use Overview, complete Teil 1, Teil 2 and Teil 3 separately, then open Submit and send your final answers to your tutor."
        submitTitle="Submit A1 · Day 21 · Kapitel 13"
        submitDescription="This submission is locked to A1-13. Submit your reading answers and final writing task for tutor marking."
      >
        {activeTab !== "submit" ? (
          <div style={{ display: "grid", gap: 16 }} data-a1-day21-weather-workbook-content="true">
            {navigation}
            {activeContent}
          </div>
        ) : null}
      </A1TutorMarkedWorkbookShell>
    </div>
  );
};

export { DAY21_WORKBOOK_TABS, resolveActiveTab };
export default A1Day21WeatherWorkbookPage;
