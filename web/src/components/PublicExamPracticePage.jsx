import React, { useEffect } from "react";
import { updatePageMeta } from "../lib/pageMeta";
import A1GoetheReadingMockTeil1Preview from "./A1GoetheReadingMockTeil1Preview";
import A2GoetheReadingMockPreview from "./A2GoetheReadingMockPreview";

const cardStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 20,
  background: "#ffffff",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
};

const actionStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 16px",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: 700,
  background: "#0f172a",
  color: "#ffffff",
};

export default function PublicExamPracticePage({ level = "" }) {
  useEffect(() => {
    const metadataByLevel = {
      A1: {
        title: "Free Goethe A1 Exam Practice – Lesen | Falowen",
        description:
          "Practise free Goethe-style A1 exam Lesen tasks with Falowen. No login required. Work through realistic reading questions and get an instant score.",
        canonicalPath: "/exam-practice/a1",
      },
      A2: {
        title: "Free Goethe A2 Exam Practice – Lesen | Falowen",
        description:
          "Practise free Goethe-style A2 exam Lesen tasks with Falowen. Complete 20 reading questions across four parts and get an instant score.",
        canonicalPath: "/exam-practice/a2",
      },
      B1: {
        title: "Goethe B1 Exam Practice Coming Soon | Falowen",
        description:
          "Falowen public Goethe-style B1 exam practice is coming soon. B1 students can continue using the full Exam Room after signing in.",
        canonicalPath: "/exam-practice/b1",
      },
    };

    const metadata = metadataByLevel[level] || {
      title: "Free Goethe Exam Practice A1 & A2 | Falowen",
      description:
        "Practise free Goethe-style German exam tasks by level with Falowen. Public A1 and A2 Lesen practice is available without login, with more levels planned.",
      canonicalPath: "/exam-practice",
    };

    const provider = {
      "@type": "EducationalOrganization",
      name: "Falowen",
      url: "https://www.falowen.app/",
    };
    const structuredData =
      level === "A1" || level === "A2"
        ? {
            id: "public-goethe-practice",
            schema: {
              "@context": "https://schema.org",
              "@type": "LearningResource",
              name: `Free Goethe ${level} exam practice – Lesen`,
              url: `https://www.falowen.app${metadata.canonicalPath}`,
              description: metadata.description,
              educationalLevel: level,
              learningResourceType: "Practice test",
              isAccessibleForFree: true,
              inLanguage: ["de", "en"],
              teaches: `German ${level} exam reading practice`,
              provider,
            },
          }
        : {
            id: "public-goethe-practice",
            schema: {
              "@context": "https://schema.org",
              "@type": level === "B1" ? "WebPage" : "CollectionPage",
              name: metadata.title,
              url: `https://www.falowen.app${metadata.canonicalPath}`,
              description: metadata.description,
              isAccessibleForFree: true,
              provider,
            },
          };

    updatePageMeta({
      ...metadata,
      lang: "en",
      structuredData,
    });
  }, [level]);

  if (level === "A1") return <A1GoetheReadingMockTeil1Preview publicMode />;
  if (level === "A2") return <A2GoetheReadingMockPreview publicMode />;

  if (level === "B1") {
    return (
      <main style={{ minHeight: "100vh", background: "#f8fafc", padding: "32px 16px 56px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <section style={{ ...cardStyle, padding: 28 }}>
            <p style={{ margin: 0, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: "#64748b" }}>
              Falowen Exam Practice
            </p>
            <h1 style={{ margin: "8px 0 10px", fontSize: "clamp(2rem, 7vw, 3.2rem)", lineHeight: 1.05 }}>
              Goethe B1 public exam practice is coming soon
            </h1>
            <p style={{ margin: 0, color: "#475569", fontSize: 17, lineHeight: 1.6 }}>
              We have not published a complete public-ready B1 mock yet. B1 students can continue practising inside the full Falowen Exam Room.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
              <a href="/exam-practice" style={actionStyle}>Back to free A1 & A2 practice</a>
              <a href="/login/" style={{ ...actionStyle, background: "#ffffff", color: "#0f172a", border: "1px solid #cbd5e1" }}>
                Student sign in
              </a>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", padding: "32px 16px 56px" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", display: "grid", gap: 22 }}>
        <header style={{ ...cardStyle, padding: 28 }}>
          <p style={{ margin: 0, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: "#2563eb" }}>
            Falowen Exam Practice
          </p>
          <h1 style={{ margin: "8px 0 10px", fontSize: "clamp(2rem, 7vw, 3.5rem)", lineHeight: 1.02 }}>
            Free Goethe A1 & A2 exam practice
          </h1>
          <p style={{ margin: 0, maxWidth: 760, color: "#475569", fontSize: 17, lineHeight: 1.6 }}>
            Practise Goethe-style German exam tasks by level without signing in. Start with A1 or A2 Lesen, get an instant score, then use the full Falowen Exam Room when you need complete mocks, Schreiben, Sprechen and saved progress.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
            <a href="/exam-practice/a1" style={actionStyle}>Start A1 free practice</a>
            <a href="/exam-practice/a2" style={actionStyle}>Start A2 free practice</a>
            <a href="/login/" style={{ ...actionStyle, background: "#ffffff", color: "#0f172a", border: "1px solid #cbd5e1" }}>
              Student sign in
            </a>
          </div>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          <article style={cardStyle}>
            <span style={{ fontWeight: 800, color: "#2563eb" }}>A1</span>
            <h2 style={{ margin: "8px 0" }}>Goethe A1 Lesen · Teil 1</h2>
            <p style={{ color: "#475569", lineHeight: 1.55 }}>
              Five realistic reading questions with instant scoring. No account required.
            </p>
            <a href="/exam-practice/a1" style={actionStyle}>Try A1 free</a>
          </article>

          <article style={cardStyle}>
            <span style={{ fontWeight: 800, color: "#2563eb" }}>A2</span>
            <h2 style={{ margin: "8px 0" }}>Goethe A2 Lesen · 4 parts</h2>
            <p style={{ color: "#475569", lineHeight: 1.55 }}>
              Twenty questions across four reading parts with an instant final score.
            </p>
            <a href="/exam-practice/a2" style={actionStyle}>Try A2 free</a>
          </article>

          <article style={{ ...cardStyle, opacity: 0.78 }}>
            <span style={{ fontWeight: 800, color: "#64748b" }}>B1</span>
            <h2 style={{ margin: "8px 0" }}>Public practice coming soon</h2>
            <p style={{ color: "#475569", lineHeight: 1.55 }}>
              B1 remains inside the student Exam Room until a complete public-ready mock is available.
            </p>
            <span style={{ fontWeight: 700, color: "#64748b" }}>Coming soon</span>
          </article>
        </section>

        <section style={{ ...cardStyle, background: "#eff6ff" }}>
          <h2 style={{ marginTop: 0 }}>What stays inside the student Exam Room?</h2>
          <p style={{ marginBottom: 0, color: "#334155", lineHeight: 1.6 }}>
            Full mock history, saved attempts, detailed Schreiben feedback, Sprechen assessment, readiness tracking and the complete exam library remain student features. Public practice never changes course progress or official Falowen results.
          </p>
        </section>

        <footer style={{ color: "#64748b", fontSize: 13, lineHeight: 1.5 }}>
          Falowen is an independent learning platform and is not affiliated with or endorsed by Goethe-Institut.
        </footer>
      </div>
    </main>
  );
}
