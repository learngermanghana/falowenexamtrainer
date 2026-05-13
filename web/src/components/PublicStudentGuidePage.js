import React, { useEffect } from "react";
import { styles } from "../styles";
import { updatePageMeta } from "../lib/pageMeta";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 10,
};

const PublicStudentGuidePage = () => {
  useEffect(() => {
    const description =
      "Understand Falowen before signup: dashboard tabs, A1 Lesen/Hören design, A2-C1 grammar and workbook structure, and B2/C1 self-learning with AI support for German learners in Ghana and across Africa.";

    updatePageMeta({
      title: "How Falowen Works | Learn German in Ghana & Africa",
      description,
      canonicalPath: "/learn-german-ghana/falowen-guide",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "How Falowen Works for New German Learners",
        description,
        author: { "@type": "Organization", name: "Falowen" },
        publisher: { "@type": "Organization", name: "Falowen" },
      },
    });
  }, []);

  return (
    <main style={{ ...styles.container, maxWidth: 980, display: "grid", gap: 14 }}>
      <section style={{ ...cardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <h1 style={{ margin: 0 }}>Falowen Student Guide (Before You Sign Up)</h1>
        <p style={{ margin: 0, color: "#1f2937", lineHeight: 1.7 }}>
          This page explains how Falowen is structured for new students who want to learn German in Ghana and across Africa.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Dashboard structure</h2>
        <p style={{ margin: 0 }}>Falowen student navigation has five main tabs:</p>
        <ul style={{ margin: 0 }}>
          <li><strong>My Course</strong> (Course Book, Submit, Exam File, Attendance)</li>
          <li><strong>Falowen AI</strong> (Grammar, Writing, Speech, Vocabulary)</li>
          <li><strong>Results</strong></li>
          <li><strong>Discussion</strong></li>
          <li><strong>Account</strong></li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>How A1 is designed</h2>
        <p style={{ margin: 0 }}>
          At A1, the early exam-focused foundation is designed around <strong>Lesen (reading)</strong> and <strong>Hören (listening)</strong>, while building essential grammar and vocabulary for beginners.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>A2 to C1 learning structure</h2>
        <p style={{ margin: 0 }}>
          A2, B1, B2, and C1 follow a similar pattern: each learning unit includes <strong>Grammar</strong> and a <strong>Workbook</strong>.
        </p>
        <p style={{ margin: 0 }}>Each workbook is split into four parts:</p>
        <ul style={{ margin: 0 }}>
          <li>Teil 1</li>
          <li>Teil 2</li>
          <li>Teil 3</li>
          <li>Teil 4</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>B2 and C1 difference</h2>
        <p style={{ margin: 0 }}>
          B2 and C1 are designed as self-learning tracks with AI support. Students practice independently in the app, while tutor support is provided through email.
        </p>
      </section>
    </main>
  );
};

export default PublicStudentGuidePage;
