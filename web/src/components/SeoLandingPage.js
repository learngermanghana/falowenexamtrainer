import React, { useEffect } from "react";
import { styles } from "../styles";

const SectionCard = ({ children, style }) => (
  <section
    style={{
      ...styles.card,
      display: "grid",
      gap: 12,
      ...style,
    }}
  >
    {children}
  </section>
);

const Pill = ({ children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 12px",
      borderRadius: 999,
      background: "#eef2ff",
      border: "1px solid #c7d2fe",
      color: "#312e81",
      fontWeight: 700,
      fontSize: 12,
    }}
  >
    {children}
  </span>
);

const HighlightCard = ({ title, description }) => (
  <div
    style={{
      border: "1px solid #e5e7eb",
      borderRadius: 14,
      padding: 16,
      background: "#ffffff",
      display: "grid",
      gap: 8,
      boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
    }}
  >
    <h3 style={{ margin: 0, fontSize: 16, color: "#111827" }}>{title}</h3>
    <p style={{ margin: 0, fontSize: 13, color: "#4b5563", lineHeight: 1.6 }}>{description}</p>
  </div>
);

const SeoLandingPage = ({ onSignUp, onLogin }) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Learn German in Ghana & Nigeria | Falowen";

    const descriptionContent =
      "Falowen offers German lessons in Ghana and Nigeria with live classes, tutor feedback, and exam-focused practice. Join a cohort to learn German the right way.";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    const previousDescription = meta.getAttribute("content");
    meta.setAttribute("content", descriptionContent);

    const schema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "Falowen",
      description:
        "German language training in Ghana and Nigeria with live classes, tutor feedback, and exam preparation.",
      areaServed: ["Ghana", "Nigeria"],
      url: "https://falowen.app/learn-german-ghana",
      sameAs: [
        "https://www.instagram.com/lleaghana",
        "https://www.youtube.com/@LLEAGhana",
        "https://web.facebook.com/lleaghana",
      ],
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.title = previousTitle;
      if (previousDescription !== null) {
        meta.setAttribute("content", previousDescription);
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const highlights = [
    {
      title: "Local support in Ghana & Nigeria",
      description:
        "Falowen works with learners in Ghana and Nigeria, so schedules, payment support, and communication are built for West Africa.",
    },
    {
      title: "Exam-ready German training",
      description:
        "We focus on speaking, writing, and vocabulary tasks that mirror Goethe-style exams so you feel confident on test day.",
    },
    {
      title: "Tutor feedback that keeps you improving",
      description:
        "Submit your writing or speaking tasks and get tutor feedback during live sessions to correct mistakes early.",
    },
  ];

  const steps = [
    "Pick your level (A1, A2, B1) and preferred schedule.",
    "Join a cohort and get onboarding support from our team.",
    "Complete daily practice tasks on your phone or laptop.",
    "Attend live classes and receive tutor feedback.",
    "Prepare confidently for certification exams or relocation goals.",
  ];

  const faq = [
    {
      question: "Is Falowen available in Ghana and Nigeria?",
      answer:
        "Yes. Falowen supports learners in Ghana and Nigeria with live online classes, WhatsApp support, and flexible schedules.",
    },
    {
      question: "What level of German do you teach?",
      answer:
        "We teach beginner to intermediate levels (A1 to B1), with structured practice for speaking, writing, and vocabulary.",
    },
    {
      question: "Do I need prior German knowledge?",
      answer:
        "No. Beginners can start at A1 and follow the cohort learning plan with guided lessons and practice.",
    },
  ];

  return (
    <main
      style={{
        ...styles.container,
        maxWidth: 1120,
        background: "radial-gradient(circle at 20% 10%, #eef2ff 0, #f8fafc 40%, #f9fafb 100%)",
      }}
    >
      <div style={{ display: "grid", gap: 16 }}>
        <SectionCard
          style={{
            background: "linear-gradient(135deg, #1d4ed8, #1e3a8a)",
            color: "#ffffff",
            border: "1px solid #1d4ed8",
          }}
        >
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <Pill>German lessons in Ghana</Pill>
              <Pill>German lessons in Nigeria</Pill>
              <Pill>Exam preparation</Pill>
            </div>
            <h1 style={{ margin: 0, fontSize: 34 }}>
              Falowen: The right place to learn German in Ghana and Nigeria.
            </h1>
            <p style={{ margin: 0, fontSize: 15, color: "#e0e7ff", lineHeight: 1.7 }}>
              Falowen helps learners across Ghana and Nigeria gain real German fluency with live classes, tutor feedback,
              and daily practice. Build speaking confidence, improve writing, and prepare for German certification exams.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={styles.primaryButton} onClick={onSignUp}>
                Join a cohort
              </button>
              <button type="button" style={styles.secondaryButton} onClick={onLogin}>
                Log in
              </button>
            </div>
          </div>
        </SectionCard>

        <SectionCard style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {highlights.map((item) => (
            <HighlightCard key={item.title} title={item.title} description={item.description} />
          ))}
        </SectionCard>

        <SectionCard style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <div style={{ display: "grid", gap: 10 }}>
            <h2 style={{ ...styles.sectionTitle, marginBottom: 0 }}>Why Falowen stands out</h2>
            <p style={{ margin: 0, fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>
              We combine structured German lessons with instructor feedback. You will practice real-life conversation,
              exam-style tasks, and daily vocabulary. Our learning system is built to support busy learners in Ghana and
              Nigeria who want results quickly.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <Pill>Live Zoom classes</Pill>
              <Pill>WhatsApp support</Pill>
              <Pill>Weekly tutor reviews</Pill>
              <Pill>Flexible schedules</Pill>
            </div>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>What you will practice</h3>
            <ul style={{ ...styles.checklist, marginTop: 0 }}>
              <li>German speaking drills and role-play scenarios.</li>
              <li>Writing letters, emails, and exam responses.</li>
              <li>Vocabulary for daily life, work, and travel.</li>
              <li>Pronunciation coaching with tutor feedback.</li>
            </ul>
          </div>
        </SectionCard>

        <SectionCard style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div style={{ display: "grid", gap: 10 }}>
            <h2 style={{ ...styles.sectionTitle, marginBottom: 0 }}>How to start learning German</h2>
            <p style={{ margin: 0, fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>
              Follow a clear, step-by-step learning plan. Our cohorts are designed for beginners and intermediate learners
              who want practical progress.
            </p>
          </div>
          <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8, color: "#374151", fontSize: 13 }}>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard>
          <h2 style={{ ...styles.sectionTitle, marginBottom: 0 }}>Frequently asked questions</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {faq.map((item) => (
              <div key={item.question} style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 15, color: "#111827" }}>{item.question}</h3>
                <p style={{ margin: "6px 0 0", fontSize: 13, color: "#4b5563", lineHeight: 1.6 }}>{item.answer}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard style={{ background: "#0f172a", color: "#e5e7eb" }}>
          <div style={{ display: "grid", gap: 10 }}>
            <h2 style={{ ...styles.sectionTitle, color: "#ffffff", marginBottom: 0 }}>
              Ready to learn German with Falowen?
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: "#cbd5f5", lineHeight: 1.7 }}>
              We help learners in Ghana and Nigeria build confidence in German. Join a cohort or contact our team for the
              next available class.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={styles.primaryButton} onClick={onSignUp}>
                Join a cohort
              </button>
              <a
                href="https://wa.me/233205706589"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...styles.secondaryButton,
                  textDecoration: "none",
                  color: "#e5e7eb",
                  borderColor: "#94a3b8",
                  background: "transparent",
                }}
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </SectionCard>
      </div>
    </main>
  );
};

export default SeoLandingPage;
