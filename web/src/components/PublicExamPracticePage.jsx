import React, { useEffect } from "react";
import { updatePageMeta } from "../lib/pageMeta";
import A1GoetheReadingMockTeil1Preview from "./A1GoetheReadingMockTeil1Preview";
import A2GoetheReadingMockPreview from "./A2GoetheReadingMockPreview";
import { getMockExamsForLevel } from "../data/mockExamCatalog";
import "./PublicExamPracticePage.css";

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
        title: "Goethe B1 Exam Preparation and Mock Tests | Falowen",
        description:
          "Explore B1 full mock exams in Falowen’s student Exam Room; sign in to access complete practice and results.",
        canonicalPath: "/exam-practice/b1",
      },
    };

    const metadata = metadataByLevel[level] || {
      title: "Goethe Exam Practice A1–C2 | Falowen Mocks",
      description:
        "Explore Falowen Goethe-style practice by level: free A1/A2 reading samples, complete A1–B2 mocks for students, C1 reading practice and C2 exam preparation.",
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

  const levels = level === "B1" ? ["B1"] : ["A1", "A2", "B1", "B2", "C1", "C2"];
  const freePath = { A1: "/exam-practice/a1", A2: "/exam-practice/a2" };
  const levelDescription = {
    A1: "Build confidence with a free Lesen sample, then try two complete student mocks.",
    A2: "Start with free Lesen. Progress to Mock 1 or explore the four-section Mock 2 preview.",
    B1: "A complete timed B1 mock is available in the signed-in Exam Room.",
    B2: "Practise the four modules in a complete B2 mock through your student account.",
    C1: "Focused reading practice is available; a complete C1 mock is not yet published.",
    C2: "Explore C2 exam preparation. A complete four-module mock is not yet published.",
  };

  return (
    <main className="public-goethe">
      <div className="public-goethe-shell">
        <nav className="public-goethe-nav" aria-label="Exam preparation navigation">
          <a href="/" className="public-goethe-brand">Falowen <span>Exam Practice</span></a>
          <a href="/login/" className="public-goethe-nav-login">Student sign in <span aria-hidden="true">↗</span></a>
        </nav>
        <header className="public-goethe-hero">
          <div className="public-goethe-hero-content">
            <span className="public-goethe-eyebrow">GOETHE-STYLE EXAM PREPARATION · A1–C2</span>
            <h1>Prepare with purpose.<br /><em>Practise with Falowen.</em></h1>
            <p>Find the right German exam practice for your level. Try public reading samples for free, or sign in for full mock exams, timed sections and your saved results.</p>
            <div className="public-goethe-hero-actions">
              <a href="/exam-practice/a1" className="public-goethe-btn public-goethe-btn-primary">Try free A1 reading <span aria-hidden="true">↗</span></a>
              <a href="/exam-practice/a2" className="public-goethe-btn public-goethe-btn-light">Try free A2 reading</a>
            </div>
            <p className="public-goethe-hero-note">Free samples require no account. Full mock exams require student access.</p>
          </div>
          <div className="public-goethe-hero-panel" aria-label="Exam preparation overview">
            <span className="public-goethe-panel-label">YOUR EXAM JOURNEY</span>
            <div className="public-goethe-panel-number">4 <span>skills</span></div>
            <div className="public-goethe-skills">
              {["Lesen", "Hören", "Schreiben", "Sprechen"].map((skill, index) => (
                <div key={skill}><span>{String(index + 1).padStart(2, "0")}</span><strong>{skill}</strong><span aria-hidden="true">↗</span></div>
              ))}
            </div>
            <p>Build skills, complete mocks and review your performance at your own level.</p>
          </div>
        </header>
        <section className="public-goethe-overview" aria-label="How exam practice works">
          <div><strong>01</strong><span>Choose your level</span><p>From beginner A1 to advanced C2 preparation.</p></div>
          <div><strong>02</strong><span>Select your practice</span><p>Public reading samples or available student mock exams.</p></div>
          <div><strong>03</strong><span>Review your results</span><p>Results and saved attempts are available for supported student exams.</p></div>
        </section>
        <section className="public-goethe-library" aria-labelledby="public-goethe-library-title">
          <div className="public-goethe-section-title"><div><span className="public-goethe-kicker">THE PRACTICE LIBRARY</span><h2 id="public-goethe-library-title">Find your exam level</h2><p>Availability is taken from the current Falowen mock exam catalog, not a fixed list of promised exams.</p></div></div>
          <div className="public-goethe-level-grid">
            {levels.map((examLevel) => {
              const mocks = getMockExamsForLevel(examLevel, { includeCourse: true });
              const full = mocks.filter((mock) => mock.mode === "full" && mock.status === "ready");
              const previews = mocks.filter((mock) => mock.mode === "section-preview" && mock.status === "preview");
              return (
                <article className="public-goethe-level" key={examLevel}>
                  <div className="public-goethe-level-top"><span className="public-goethe-level-chip">{examLevel}</span><span className="public-goethe-level-state">{full.length ? `${full.length} full ${full.length === 1 ? "mock" : "mocks"}` : previews.length ? "Skill practice" : "Preparation"}</span></div>
                  <h3>Goethe-style {examLevel} practice</h3>
                  <p>{levelDescription[examLevel]}</p>
                  <div className="public-goethe-mock-list">
                    {mocks.map((mock) => (
                      <div className="public-goethe-mock" key={mock.id}>
                        <div><strong>{mock.shortTitle || mock.title}</strong><small>{mock.durationLabel} · {mock.status === "ready" ? "Student full mock" : mock.status === "preview" ? "Section practice / preview" : "Not yet published"}</small></div>
                        <span>{mock.status === "ready" ? "Ready" : mock.status === "preview" ? "Preview" : "Planned"}</span>
                      </div>
                    ))}
                  </div>
                  <div className="public-goethe-level-actions">
                    {freePath[examLevel] && <a className="public-goethe-btn public-goethe-btn-outline" href={freePath[examLevel]}>Free Lesen sample</a>}
                    <a className="public-goethe-btn public-goethe-btn-primary" href="/login/">{full.length ? "Access full mocks" : previews.length ? "Open student practice" : "Explore Exam Room"} <span aria-hidden="true">↗</span></a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
        <section className="public-goethe-bottom">
          <div><span className="public-goethe-kicker">FOR FALOWEN STUDENTS</span><h2>Ready for a complete exam experience?</h2><p>Sign in to your Exam Room for eligible timed mock exams, four-skill practice, saved attempts and available marking feedback. Features vary by exam and level.</p></div>
          <a href="/login/" className="public-goethe-btn public-goethe-btn-light">Go to student sign in <span aria-hidden="true">↗</span></a>
        </section>
        <footer className="public-goethe-footer"><span>© Falowen · German exam preparation</span><span>Falowen is independent and is not affiliated with or endorsed by Goethe-Institut.</span></footer>
      </div>
    </main>
  );
}
