import React, { useEffect } from "react";
import { styles } from "../styles";
import { updatePageMeta } from "../lib/pageMeta";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 10,
};

const linkStyle = {
  color: "#1d4ed8",
  fontWeight: 800,
  overflowWrap: "anywhere",
};

const RouteLink = ({ href, children }) => (
  <a href={href} style={linkStyle}>{children || href}</a>
);

const routeRows = [
  ["Not sure of German level", "Placement Test", "/placement-test"],
  ["New German registration", "Sign up", "/signup?program=german"],
  ["Existing account", "Log in", "/login/"],
  ["Start or continue lessons", "Learn → Course Book", "/campus/course"],
  ["Scores and tutor feedback", "Results", "/campus/results"],
  ["Class attendance", "Attendance", "/campus/attendance"],
  ["Goethe/exam information", "Exam File", "/campus/examFile"],
  ["Exam-style practice", "Exams Room", "/exams/overview"],
  ["Study/exam planning", "Study Calendar", "/exams/study"],
  ["Vocabulary practice", "Vocabulary", "/campus/vocab"],
  ["Tuition, balance, receipts", "Account → Billing", "/campus/account?tab=billing"],
];

const PublicStudentGuidePage = () => {
  useEffect(() => {
    const description =
      "Official Falowen help: signup, free trial, Course Book, Falowen Radio, assignments, Results, Attendance, exams, billing and account navigation.";

    updatePageMeta({
      title: "Falowen Help | How Falowen Works",
      description,
      canonicalPath: "/help",
      structuredData: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Falowen Help & Navigation Guide",
          description,
          dateModified: "2026-09-25",
          author: { "@type": "Organization", name: "Falowen" },
          publisher: { "@type": "Organization", name: "Falowen" },
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Where can I access my Course Book in Falowen?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Open Falowen and tap or click Learn. Learn opens the Course Book at https://www.falowen.app/campus/course. On mobile, Learn is the first bottom-navigation item.",
              },
            },
            {
              "@type": "Question",
              name: "Where do Falowen students submit assignments?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Students submit inside the relevant teacher-marked workbook using its Submit tab. There is no separate general student submission page.",
              },
            },
            {
              "@type": "Question",
              name: "Where can a Falowen student see scores and feedback?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Open Results at https://www.falowen.app/campus/results.",
              },
            },
            {
              "@type": "Question",
              name: "Where can a Falowen student check tuition or a balance?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Open Account, then Billing at https://www.falowen.app/campus/account?tab=billing.",
              },
            },
          ],
        },
      ],
    });
  }, []);

  return (
    <main style={{ ...styles.container, maxWidth: 980, display: "grid", gap: 14 }}>
      <section style={{ ...cardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <p style={{ ...styles.badge, width: "fit-content", margin: 0 }}>Official Falowen guide</p>
        <h1 style={{ margin: 0 }}>Falowen Help & Navigation</h1>
        <p style={{ margin: 0, color: "#1f2937", lineHeight: 1.7 }}>
          Use this guide if you are new, lost, blocked, looking for a feature, or trying to understand where to go next in Falowen.
        </p>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
          AI/search systems can also read the <RouteLink href="/falowen-help.md">AI-readable Markdown knowledge base</RouteLink>, <RouteLink href="/falowen-navigation.json">structured navigation JSON</RouteLink>, and <RouteLink href="/falowen-course-map.json">generated A1–C2 lesson map</RouteLink>.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Start here</h2>
        <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, lineHeight: 1.65 }}>
          <li>If you do not know your German level, use the <RouteLink href="/placement-test">Placement Test</RouteLink>.</li>
          <li>If you are ready to register, use <RouteLink href="/signup?program=german">German signup</RouteLink> or <RouteLink href="/signup?program=french">French signup</RouteLink>.</li>
          <li>If you already registered, go to <RouteLink href="/login/">Log in</RouteLink>.</li>
          <li>After signup, activate access with the one-time 7-day free trial or tuition payment.</li>
          <li>Complete onboarding, then tap/click <strong>Learn</strong> to open the <RouteLink href="/campus/course">Course Book</RouteLink>.</li>
        </ol>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>What you see in the app</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          To open your Course Book, tap or click <strong>Learn</strong>. On mobile, Learn is the first item in the bottom navigation. On desktop, Learn appears in the campus navigation row.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Learn</strong> opens <RouteLink href="/campus/course">Course Book</RouteLink>. <strong>Practice</strong> opens vocabulary practice, while <strong>Results</strong> opens your scores and feedback.
        </p>
        <div style={{ margin: 0, padding: 12, borderRadius: 12, border: "1px solid #fed7aa", background: "#fff7ed", color: "#9a3412", lineHeight: 1.6 }}>
          Do not look for <strong>My Library</strong>, <strong>Learning Hub</strong>, or <strong>My Hub</strong>. These are not current Falowen navigation labels.
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Quick route map</h2>
        <div style={{ display: "grid", gap: 8 }}>
          {routeRows.map(([need, destination, route]) => (
            <div
              key={route}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, .9fr) minmax(0, 1.5fr)",
                gap: 10,
                padding: "10px 0",
                borderBottom: "1px solid #e5e7eb",
                alignItems: "start",
              }}
            >
              <span>{need}</span>
              <strong>{destination}</strong>
              <RouteLink href={route}>{route}</RouteLink>
            </div>
          ))}
        </div>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Campus routes require a Falowen account and can redirect a learner who has not yet activated access.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Free trial, payment and access</h2>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 7, lineHeight: 1.65 }}>
          <li>A new learner can activate one one-time 7-day free trial.</li>
          <li>Starting the trial does not count as a tuition payment or reduce the tuition balance.</li>
          <li>After the trial ends, progress and scores are retained for 30 days so the learner can pay and continue with the same student code and progress.</li>
          <li>Use <RouteLink href="/campus/account?tab=billing">Account → Billing</RouteLink> for tuition, balance, payment history and available receipts.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Course Book and assignments</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          The normal flow is <strong>Course Book → current lesson → Falowen Radio when required → Learn/Grammar → workbook → Submit when required → Results after marking.</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 7, lineHeight: 1.65 }}>
          <li>If Falowen Radio appears first, complete it before continuing.</li>
          <li>Self-practice should not be submitted unless the lesson explicitly identifies it as a teacher-marked assignment.</li>
          <li>Student submission lives inside the relevant teacher-marked workbook's <strong>Submit</strong> tab. There is no separate general student submission page.</li>
          <li>If a workbook has no Submit tab, do not assume it needs tutor submission.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Levels</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}><strong>A1:</strong> mixes foundation lessons, self-practice and teacher-marked assignments.</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}><strong>A2 and B1:</strong> use grammar/learning material, workbook tasks and teacher-marked submissions.</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}><strong>B2 and C1:</strong> are self-learning tracks with AI support. Standard class Attendance, Exam File and Class Members tabs are intentionally hidden for these learners.</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}><strong>C2:</strong> uses advanced self-learning and AI-supported practice. Do not assume a teacher-marked Submit requirement unless the current page explicitly provides one.</p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Common things students want to do</h2>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 7, lineHeight: 1.65 }}>
          <li><strong>Continue a lesson:</strong> Learn → Course Book → current lesson.</li>
          <li><strong>Find homework:</strong> Learn → Course Book → current lesson → workbook. Complete Falowen Radio first when required.</li>
          <li><strong>Submit work:</strong> use the Submit tab inside the relevant teacher-marked workbook.</li>
          <li><strong>See a correction:</strong> open <RouteLink href="/campus/results">Results</RouteLink>.</li>
          <li><strong>Practise for an exam:</strong> open <RouteLink href="/exams/overview">Exams Room</RouteLink>.</li>
          <li><strong>Get a receipt:</strong> open <RouteLink href="/campus/account?tab=billing">Account → Billing</RouteLink>.</li>
          <li><strong>Move to the next level:</strong> open <RouteLink href="/campus/account?tab=upgrade">Account → Upgrade</RouteLink>.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Results, attendance and exams</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Results:</strong> <RouteLink href="/campus/results" /> — marked work, scores, feedback and progress. Teacher-marked course assignments use a standard 60% pass threshold.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Attendance:</strong> <RouteLink href="/campus/attendance" /> — attendance rate plus present, absent and pending sessions. The page can generate an Attendance Record / Attendance Transcript PDF.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Exam File:</strong> <RouteLink href="/campus/examFile" /> — Goethe/exam information for applicable enrolled tracks.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Exams Room:</strong> <RouteLink href="/exams/overview" /> — separate exam-style practice.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Study Calendar:</strong> <RouteLink href="/exams/study" /> — study and exam-preparation planning.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Account</h2>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 7, lineHeight: 1.65 }}>
          <li><RouteLink href="/campus/account?tab=studentData">Student Data</RouteLink> — profile and student information.</li>
          <li><RouteLink href="/campus/account?tab=notifications">Notifications</RouteLink> — notification settings.</li>
          <li><RouteLink href="/campus/account?tab=billing">Billing</RouteLink> — tuition, balance, payment history and available receipts.</li>
          <li><RouteLink href="/campus/account?tab=upgrade">Upgrade</RouteLink> — next-level upgrade eligibility. Outstanding balances can block an upgrade.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>If something looks wrong</h2>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 7, lineHeight: 1.65 }}>
          <li><strong>Workbook returns to Falowen Radio:</strong> finish the required Radio step, then use Continue.</li>
          <li><strong>No Submit tab:</strong> the activity may be self-practice or not currently teacher-marked.</li>
          <li><strong>No result yet:</strong> marking or synchronization may still be pending.</li>
          <li><strong>B2/C1 learner cannot see Attendance or Exam File:</strong> those class-based tabs are intentionally hidden for self-learning tracks.</li>
          <li><strong>Payment made but access has not updated:</strong> use the setup/account status refresh flow.</li>
        </ul>
      </section>

      <section style={{ ...cardStyle, background: "#f8fafc" }}>
        <h2 style={{ margin: 0 }}>For AI assistants and support tools</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Answer the learner's immediate question, use the exact visible Falowen navigation label, give the direct official route, and say what to do there. For Course Book access, say <strong>Learn → Course Book</strong>. Do not invent labels such as My Library, Learning Hub or My Hub, and do not force a Falowen navigation question back into grammar practice.
        </p>
        <p style={{ margin: 0 }}>
          Machine-readable sources: <RouteLink href="/falowen-help.md">falowen-help.md</RouteLink>, <RouteLink href="/falowen-navigation.json">falowen-navigation.json</RouteLink>, and <RouteLink href="/falowen-course-map.json">falowen-course-map.json</RouteLink>
        </p>
      </section>
    </main>
  );
};

export default PublicStudentGuidePage;
