import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";
import { styles } from "../styles";

const LEVEL = "A1";
const DAY = 18;
const CHAPTER = "12.2";
const FALLBACK_ASSIGNMENT_KEY = "A1-12.2";
const heroImageUrl =
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1800&q=80";

const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 10 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const dativeArticles = [
  "Masculine (der): der → dem",
  "Feminine (die): die → der",
  "Neuter (das): das → dem",
  "Plural (die): die → den (+n to the noun)",
];

const examples = [
  {
    preposition: "mit (with)",
    items: [
      "Ich fahre mit dem Zug. (der Zug → dem Zug)",
      "Ich fahre mit der U-Bahn. (die U-Bahn → der U-Bahn)",
      "Ich fahre mit dem Fahrrad. (das Fahrrad → dem Fahrrad)",
      "Ich fahre mit den Kindern. (die Kinder → den Kindern)",
    ],
  },
  {
    preposition: "bei (at, near, with)",
    items: [
      "Ich bin bei dem Freund. (der Freund → dem Freund)",
      "Ich bin bei der Post. (die Post → der Post)",
      "Ich bin bei dem Krankenhaus. (das Krankenhaus → dem Krankenhaus)",
      "Ich bin bei den Eltern. (die Eltern → den Eltern)",
    ],
  },
  {
    preposition: "zu (to)",
    items: [
      "Ich gehe zu dem Bäcker. (der Bäcker → dem Bäcker)",
      "Ich gehe zu der Schule. (die Schule → der Schule)",
      "Ich gehe zu dem Konzert. (das Konzert → dem Konzert)",
      "Ich gehe zu den Freunden. (die Freunde → den Freunden)",
    ],
  },
];

const grammarPractice = [
  "Ich reise mit dem Auto.",
  "Ich fahre mit dem Fahrrad.",
  "Ich bin bei der Post.",
  "Ich bin bei der Bank.",
  "Ich gehe zu der Schule.",
  "Ich gehe zu dem Park.",
  "Ich reise mit den Kindern.",
  "Ich bin bei dem Krankenhaus.",
  "Ich gehe zu dem Konzert.",
  "Ich gehe zu der Party.",
];

const workbookTasks = [
  "Ich fahre mit ___ Zug. (der Zug)",
  "Sie fährt mit ___ U-Bahn. (die U-Bahn)",
  "Wir sind bei ___ Eltern. (die Eltern)",
  "Er arbeitet bei ___ Bank. (die Bank)",
  "Ich gehe zu ___ Arzt. (der Arzt)",
  "Sie geht zu ___ Schule. (die Schule)",
  "Das Kind fährt mit ___ Fahrrad. (das Fahrrad)",
  "Wir gehen zu ___ Freunden. (die Freunde)",
];

const GrammarNotes = () => (
  <>
    <div style={{ ...styles.card, display: "grid", gap: 8 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 Chapter 12.2: Dative Articles with mit, bei, and zu</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>
        There are several dative prepositions in German, but today we focus only on <strong>mit</strong>, <strong>bei</strong>,
        and <strong>zu</strong>.
      </p>
      <img
        src={heroImageUrl}
        alt="Students learning German in a classroom"
        style={{ width: "100%", height: "clamp(180px, 30vw, 280px)", objectFit: "cover", borderRadius: 12, marginTop: 8 }}
      />
    </div>

    <Section title="Introduction">
      <p style={{ margin: 0 }}>
        In German, the prepositions <strong>mit</strong>, <strong>bei</strong>, and <strong>zu</strong> require the dative case.
        This means the definite and indefinite articles change to their dative forms.
      </p>
    </Section>

    <Section title="Dative articles">
      <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
        {dativeArticles.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </Section>

    <Section title="Examples">
      {examples.map((group) => (
        <div key={group.preposition} style={{ display: "grid", gap: 6 }}>
          <strong>{group.preposition}</strong>
          <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 4 }}>
            {group.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ))}
    </Section>

    <Section title="Tip">
      <p style={{ margin: 0 }}>
        You can contract <strong>zu dem</strong> to <strong>zum</strong> and <strong>zu der</strong> to <strong>zur</strong>.
      </p>
    </Section>

    <Section title="Practice solutions">
      <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 4 }}>
        {grammarPractice.map((item) => <li key={item}>{item}</li>)}
      </ol>
    </Section>
  </>
);

const WorkbookAssignment = ({ openSubmit }) => (
  <>
    <Section title="Teil 1 · Dative articles">
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Complete the sentences with the correct dative article. Write only your final answers in the Submit tab.
      </p>
      <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, lineHeight: 1.7 }}>
        {workbookTasks.map((task) => <li key={task}>{task}</li>)}
      </ol>
    </Section>

    <Section title="Teil 2 · mit, bei oder zu">
      <p style={{ margin: 0 }}>Choose the correct preposition and article.</p>
      <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, lineHeight: 1.7 }}>
        <li>Ich fahre ___ ___ Bus zur Arbeit. (mit / der Bus)</li>
        <li>Wir treffen uns ___ ___ Bahnhof. (bei / der Bahnhof)</li>
        <li>Am Montag gehe ich ___ ___ Ärztin. (zu / die Ärztin)</li>
        <li>Das Kind ist heute ___ ___ Großeltern. (bei / die Großeltern)</li>
        <li>Sie kommt ___ ___ Fahrrad. (mit / das Fahrrad)</li>
        <li>Wir gehen nach dem Kurs ___ ___ Freunden. (zu / die Freunde)</li>
      </ol>
    </Section>

    <Section title="Teil 3 · Schreiben">
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Write six complete German sentences: two with <strong>mit</strong>, two with <strong>bei</strong> and two with
        <strong> zu</strong>. Use at least one masculine, one feminine, one neuter and one plural noun.
      </p>
    </Section>

    <div style={{ ...styles.card, display: "grid", gap: 10, border: "1px solid #bfdbfe", background: "#eff6ff" }}>
      <strong>Finished Kapitel 12.2?</strong>
      <p style={{ margin: 0 }}>Open Submit and send all final answers for tutor marking.</p>
      <button type="button" style={{ ...styles.primaryButton, width: "fit-content" }} onClick={openSubmit}>
        Open Submit Tab
      </button>
    </div>
  </>
);

const DativeArticlesMitBeiZuPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = useMemo(() => new URLSearchParams(location.search || ""), [location.search]);
  const isWorkbook = query.get("view") === "workbook";
  const requestedTab = query.get("workbookTab");
  const [activeTab, setActiveTab] = useState(requestedTab === "submit" ? "submit" : "assignment");

  const assignmentKey = useMemo(() => {
    const assignment = getInlineCourseAssignments(LEVEL, DAY).find(
      (item) => String(item.chapter || "").trim() === CHAPTER
    );
    return assignment?.assignmentKey || FALLBACK_ASSIGNMENT_KEY;
  }, []);

  useEffect(() => {
    setActiveTab(requestedTab === "submit" ? "submit" : "assignment");
  }, [requestedTab]);

  const openTab = (tab) => {
    const next = new URLSearchParams(location.search || "");
    next.set("view", "workbook");
    next.set("workbookTab", tab);
    next.set("assignmentKey", assignmentKey);
    next.set("assignmentId", assignmentKey);
    next.set("level", LEVEL);
    setActiveTab(tab);
    navigate(
      { pathname: location.pathname, search: `?${next.toString()}` },
      {
        replace: true,
        state: {
          ...(location.state || {}),
          level: LEVEL,
          day: DAY,
          assignmentKey,
          assignmentId: assignmentKey,
          canonicalAssignmentKey: assignmentKey,
          inlineCourseSubmission: true,
        },
      }
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isWorkbook) {
    return <div style={{ ...styles.container, display: "grid", gap: 16 }}><GrammarNotes /></div>;
  }

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 10 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, margin: 0 }}>A1 · Day 18 Workbook · Kapitel 12.2</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Dative prepositions with mit, bei and zu · Tutor-marked assignment</p>
        <div role="tablist" aria-label="Kapitel 12.2 workbook tabs" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { key: "assignment", label: "Assignment" },
            { key: "submit", label: "Submit" },
          ].map((tab) => {
            const selected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => openTab(tab.key)}
                style={{
                  ...styles.secondaryButton,
                  background: selected ? "#2563eb" : "#fff",
                  borderColor: selected ? "#2563eb" : "#93c5fd",
                  color: selected ? "#fff" : "#1d4ed8",
                  fontWeight: 800,
                  minWidth: 120,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "assignment" ? (
        <WorkbookAssignment openSubmit={() => openTab("submit")} />
      ) : (
        <Section title={`Submit A1 · Day 18 · Kapitel 12.2 (${assignmentKey})`}>
          <p style={{ margin: 0, color: "#475569" }}>
            This submission is locked to Kapitel 12.2 so your answers are saved under the correct assignment.
          </p>
          <div className="a1-day18-kapitel122-submit-tab">
            <style>{`.a1-day18-kapitel122-submit-tab > div > section:first-child { display: none !important; }
              .a1-day18-kapitel122-submit-tab select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: LEVEL,
                day: DAY,
                assignmentKey,
                canonicalAssignmentKey: assignmentKey,
              }}
            />
          </div>
        </Section>
      )}
    </div>
  );
};

export default DativeArticlesMitBeiZuPage;
