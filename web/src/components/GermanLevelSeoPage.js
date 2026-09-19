import React, { useEffect } from "react";
import { styles } from "../styles";
import { updatePageMeta } from "../lib/pageMeta";

const LEVEL_COPY = {
  A1: {
    summary: "Build a beginner foundation for introductions, numbers, time, daily routines, shopping, directions, health and simple everyday communication.",
    grammar: ["present tense and verb position", "articles and basic cases", "questions and negation", "modal verbs and separable verbs"],
    writing: "short messages, forms, invitations and simple personal emails",
    speaking: "introductions, asking and answering everyday questions, requests and simple role-play",
    exam: "basic reading, listening, writing and speaking tasks with clear response patterns",
  },
  A2: {
    summary: "Move from basic survival German to connected everyday communication about housing, work, travel, health, plans and personal experiences.",
    grammar: ["Perfekt and past narration", "two-case prepositions", "relative clauses", "connectors and sentence linking"],
    writing: "informal and formal emails, requests, complaints and short connected texts",
    speaking: "small talk, comparisons, appointments, problem-solving and everyday discussions",
    exam: "structured Lesen, Hören, Schreiben and Sprechen practice with tutor-marked work",
  },
  B1: {
    summary: "Develop independent communication for work, study and daily life while learning to explain experiences, opinions, reasons and plans in connected German.",
    grammar: ["subordinate clauses and connectors", "relative clauses and case control", "purpose and contrast structures", "adjective and verb patterns"],
    writing: "personal and formal emails, experience reports and short opinion texts",
    speaking: "presenting experiences, giving reasons, making suggestions and responding to viewpoints",
    exam: "B1-style reading, listening, writing and speaking tasks with feedback and progress tracking",
  },
  B2: {
    summary: "Build precise, flexible German for education, work and public topics such as environment, housing, migration, travel, technology and society.",
    grammar: ["nominalisation and advanced sentence linking", "contrast and concession", "relative clauses with prepositions", "comparison and argument structures"],
    writing: "formal complaints, structured opinions, reports and argument-based responses",
    speaking: "presentations, discussion, comparison, justification and solution-focused communication",
    exam: "exam-focused Lesen, Hören, Schreiben and Sprechen practice with topic-matched grammar and collocations",
  },
  C1: {
    summary: "Develop advanced academic and professional German with precise argumentation, synthesis, register control and complex grammar.",
    grammar: ["advanced passive and modal structures", "concessive and adversative linking", "Konjunktiv and reported speech", "complex nominal and clause structures"],
    writing: "structured Stellungnahmen, formal correspondence and advanced argumentation",
    speaking: "balanced viewpoints, presentations, counterarguments and nuanced discussion",
    exam: "high-level exam practice across reading, listening, writing and speaking with detailed feedback",
  },
  C2: {
    summary: "Refine near-native control of German through precise reformulation, synthesis, register, argumentation and demanding Goethe-style tasks.",
    grammar: ["Umformung and structural reformulation", "nominalisation and dense syntax", "register and stylistic precision", "advanced connectors and meaning preservation"],
    writing: "complex reformulation, synthesis, formal writing and highly precise argumentation",
    speaking: "nuanced discussion, spontaneous response, presentation and register-sensitive communication",
    exam: "C2-style transformation, writing, reading, listening and speaking practice with strict task ownership",
  },
};

const LEVELS = Object.keys(LEVEL_COPY);

const card = {
  ...styles.card,
  borderRadius: 18,
  padding: "clamp(16px, 3vw, 24px)",
};

const Chip = ({ children }) => (
  <span style={{ display: "inline-flex", padding: "6px 10px", borderRadius: 999, background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1e3a8a", fontSize: 12, fontWeight: 800 }}>
    {children}
  </span>
);

const SeoCard = ({ title, children }) => (
  <section style={{ ...card, display: "grid", gap: 9 }}>
    <h2 style={{ margin: 0, color: "#0f172a", fontSize: 20 }}>{title}</h2>
    {children}
  </section>
);

export default function GermanLevelSeoPage({ level = "A1", mode = "course", onSignUp, onLogin }) {
  const normalizedLevel = String(level || "").toUpperCase();
  const content = LEVEL_COPY[normalizedLevel] || LEVEL_COPY.A1;
  const isExam = mode === "exam";
  const levelPath = `/learn-german-${normalizedLevel.toLowerCase()}`;
  const examPath = `/goethe-${normalizedLevel.toLowerCase()}-preparation`;
  const canonicalPath = isExam ? examPath : levelPath;

  useEffect(() => {
    const title = isExam
      ? `Goethe ${normalizedLevel} Exam Preparation | German ${normalizedLevel} Practice | Falowen`
      : `German ${normalizedLevel} Course Online | ${normalizedLevel} Lessons & Practice | Falowen`;
    const description = isExam
      ? `Prepare for German ${normalizedLevel} exams with Falowen: structured reading, listening, writing and speaking practice, detailed grammar, tutor feedback and progress tracking.`
      : `Learn German ${normalizedLevel} online with Falowen. Study structured lessons, grammar, vocabulary, listening, writing, speaking, tutor-marked assignments and exam preparation.`;

    const provider = {
      "@type": "EducationalOrganization",
      "@id": "https://www.falowen.app/#organization",
      name: "Falowen",
      url: "https://www.falowen.app/",
      logo: "https://www.falowen.app/logo512.png",
    };

    const primarySchema = isExam
      ? {
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: `German ${normalizedLevel} exam preparation with Falowen`,
          url: `https://www.falowen.app${canonicalPath}`,
          description,
          educationalLevel: normalizedLevel,
          learningResourceType: "German exam preparation",
          inLanguage: ["de", "en"],
          provider,
        }
      : {
          "@context": "https://schema.org",
          "@type": "Course",
          name: `Falowen German ${normalizedLevel} Course`,
          url: `https://www.falowen.app${canonicalPath}`,
          description,
          educationalLevel: normalizedLevel,
          inLanguage: ["de", "en"],
          provider,
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: ["online", "blended"],
          },
        };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `What do I learn at German ${normalizedLevel} level on Falowen?`,
          acceptedAnswer: { "@type": "Answer", text: content.summary },
        },
        {
          "@type": "Question",
          name: `Does Falowen include ${normalizedLevel} exam preparation?`,
          acceptedAnswer: { "@type": "Answer", text: `Yes. Falowen combines structured ${normalizedLevel} learning with reading, listening, writing and speaking practice, tutor feedback and progress tracking.` },
        },
        {
          "@type": "Question",
          name: `Can I study German ${normalizedLevel} online?`,
          acceptedAnswer: { "@type": "Answer", text: "Yes. Falowen supports online learning with course-book lessons, practice tasks, recorded teaching, live-class support where available, and self-learning tools." },
        },
      ],
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Falowen", item: "https://www.falowen.app/" },
        { "@type": "ListItem", position: 2, name: isExam ? "German exam preparation" : "German courses", item: "https://www.falowen.app/learn-german-ghana" },
        { "@type": "ListItem", position: 3, name: isExam ? `${normalizedLevel} exam preparation` : `German ${normalizedLevel}`, item: `https://www.falowen.app${canonicalPath}` },
      ],
    };

    updatePageMeta({
      title,
      description,
      canonicalPath,
      ogType: "website",
      structuredData: [
        { id: "level-primary", schema: primarySchema },
        { id: "level-faq", schema: faqSchema },
        { id: "level-breadcrumb", schema: breadcrumbSchema },
      ],
    });
  }, [canonicalPath, content.summary, isExam, normalizedLevel]);

  return (
    <main style={{ ...styles.container, maxWidth: 1080, display: "grid", gap: 16, paddingBottom: 64 }}>
      <section style={{ ...card, display: "grid", gap: 13, color: "#ffffff", background: "linear-gradient(135deg,#172554,#1d4ed8 58%,#2563eb)", border: "1px solid #1d4ed8" }}>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          <Chip>German {normalizedLevel}</Chip>
          <Chip>{isExam ? "Exam preparation" : "Structured course"}</Chip>
          <Chip>Reading · Listening · Writing · Speaking</Chip>
        </div>
        <h1 style={{ margin: 0, fontSize: "clamp(30px, 6vw, 48px)", lineHeight: 1.05 }}>
          {isExam ? `German ${normalizedLevel} exam preparation with Falowen` : `Learn German ${normalizedLevel} online with Falowen`}
        </h1>
        <p style={{ margin: 0, color: "#dbeafe", lineHeight: 1.75, maxWidth: 820 }}>{content.summary}</p>
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
          <button type="button" style={styles.primaryButton} onClick={() => onSignUp?.("german")}>Start German {normalizedLevel}</button>
          <a href="/placement-test" style={{ ...styles.secondaryButton, textDecoration: "none", background: "#ffffff" }}>Take the placement test</a>
          <button type="button" style={{ ...styles.secondaryButton, background: "#ffffff" }} onClick={onLogin}>Log in</button>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 12 }}>
        <SeoCard title="Grammar you build">
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.75, color: "#334155" }}>{content.grammar.map((item) => <li key={item}>{item}</li>)}</ul>
        </SeoCard>
        <SeoCard title="Writing">
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>{content.writing}.</p>
        </SeoCard>
        <SeoCard title="Speaking">
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>{content.speaking}.</p>
        </SeoCard>
        <SeoCard title="Exam practice">
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>{content.exam}.</p>
        </SeoCard>
      </section>

      <SeoCard title="What Falowen adds to the course">
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.75 }}>
          Falowen combines a structured Course Book with detailed grammar teaching, vocabulary and collocations, Falowen Radio listening practice,
          workbook tasks, tutor-marked assignments, live-class support, attendance and progress tracking, results, transcripts and guided next-level progression.
        </p>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {["Course Book", "Detailed grammar", "Falowen Radio", "Tutor feedback", "Progress tracking", "Exam practice", "Study Buddy"].map((item) => <Chip key={item}>{item}</Chip>)}
        </div>
      </SeoCard>

      {isExam ? (
        <SeoCard title={`Prepare for ${normalizedLevel} tasks, not just vocabulary lists`}>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.75 }}>
            Practice is organised around task instructions, response structure and the language needed to complete the task. Writing and speaking work can be reviewed,
            while objective reading and listening tasks are linked to the correct assessment structure for the level.
          </p>
          <p style={{ margin: 0, color: "#64748b", fontSize: 12, lineHeight: 1.6 }}>
            Falowen is an independent learning platform and is not affiliated with or endorsed by Goethe-Institut.
          </p>
        </SeoCard>
      ) : (
        <SeoCard title={`Continue from ${normalizedLevel} into the next level`}>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.75 }}>
            Students can review the next level from the Course Book, then use Falowen's existing Account upgrade and payment flow when they are ready to continue.
          </p>
        </SeoCard>
      )}

      <SeoCard title="Explore more German levels">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {LEVELS.map((item) => (
            <a key={item} href={`/learn-german-${item.toLowerCase()}`} style={{ ...styles.secondaryButton, textDecoration: "none" }}>
              German {item}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {LEVELS.map((item) => (
            <a key={item} href={`/goethe-${item.toLowerCase()}-preparation`} style={{ ...styles.secondaryButton, textDecoration: "none" }}>
              {item} exam preparation
            </a>
          ))}
        </div>
      </SeoCard>
    </main>
  );
}
