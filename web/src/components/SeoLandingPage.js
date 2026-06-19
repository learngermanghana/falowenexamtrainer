import React, { useEffect, useState } from "react";
import { styles } from "../styles";
import { updatePageMeta } from "../lib/pageMeta";
import LeadCaptureModal from "./LeadCaptureModal";
import { captureLead } from "../services/leadCaptureService";

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

const faq = [
  {
    question: "Is Falowen available in Ghana, Nigeria, Sierra Leone, and wider Africa?",
    answer:
      "Yes. Falowen supports German learners in Ghana, Nigeria, Sierra Leone, and other African countries with online cohorts, self-learning options, WhatsApp support, and flexible schedules.",
  },
  {
    question: "What level of German do you teach?",
    answer:
      "Falowen supports German learners from A1 to C1 with live classes, self-learning tracks, recorded teacher videos, workbooks, grammar support, exam preparation, and AI-assisted practice.",
  },
  {
    question: "Do I need prior German knowledge?",
    answer:
      "No. Beginners can start at A1, while continuing learners can join the right A2, B1, B2, or C1 path after placement guidance.",
  },
];

const seoCountryPaths = {
  "/learn-german-ghana": "Ghana",
  "/learn-german-nigeria": "Nigeria",
  "/learn-german-sierra-leone": "Sierra Leone",
  "/learn-german-africa": "Africa",
};

const coreFeatures = [
  "German levels A1, A2, B1, B2, and C1",
  "Falowen Radio listening practice",
  "AI grammar video support",
  "Teacher-recorded lesson videos",
  "Improved workbooks and grammar notes",
  "Attendance tracking and progress records",
  "Exam preparation for speaking, writing, reading, and listening",
  "Study Buddy with AI support",
];

const SeoLandingPage = ({ onSignUp, onLogin, market = "Ghana" }) => {
  const [leadCaptureOpen, setLeadCaptureOpen] = useState(false);

  const handleLeadSubmit = (payload) => {
    captureLead({ ...payload, source: "seo_landing", cta: "Talk to us" });
  };

  useEffect(() => {
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "/learn-german-ghana";
    const canonicalPath = seoCountryPaths[currentPath] ? currentPath : "/learn-german-ghana";
    const marketLabel = market || seoCountryPaths[canonicalPath] || "Ghana";
    const descriptionContent =
      `Learn German in ${marketLabel} with Falowen: A1 to C1 courses, live and recorded teacher lessons, AI grammar videos, Falowen Radio, workbooks, attendance tracking, exam prep, and an AI Study Buddy.`;

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Falowen",
      url: "https://www.falowen.app/learn-german-ghana",
      logo: "https://www.falowen.app/logo512.png",
      sameAs: [
        "https://www.instagram.com/lleaghana",
        "https://www.youtube.com/@LLEAGhana",
        "https://web.facebook.com/lleaghana",
      ],
      areaServed: ["Ghana", "Nigeria", "Sierra Leone", "Africa"],
    };

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "German language lessons and exam preparation",
      provider: {
        "@type": "Organization",
        name: "Falowen",
      },
      serviceType: "German language training",
      areaServed: ["Ghana", "Nigeria", "Sierra Leone", "Africa"],
      url: `https://www.falowen.app${canonicalPath}`,
      audience: {
        "@type": "Audience",
        audienceType: "German language learners in Africa",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Falowen German learning features",
        itemListElement: coreFeatures.map((feature) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: feature,
          },
        })),
      },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/OnlineOnly",
      },
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    };

    updatePageMeta({
      title: `Learn German in ${marketLabel} & Africa | A1-C1 German Classes | Falowen`,
      description: descriptionContent,
      canonicalPath,
      ogType: "website",
      structuredData: [
        { id: "organization", schema: organizationSchema },
        { id: "service", schema: serviceSchema },
        { id: "faq", schema: faqSchema },
      ],
    });
  }, [market]);

  const highlights = [
    {
      title: "Local support in Ghana, Nigeria & Sierra Leone",
      description:
        "Falowen works with learners in Ghana, Nigeria, Sierra Leone, and across Africa, so schedules, payment support, and communication are built for West African learners.",
    },
    {
      title: "Exam-ready German training",
      description:
        "We support A1 to C1 German with speaking, writing, reading, listening, attendance tracking, and exam-style tasks so you feel confident on test day.",
    },
    {
      title: "Tutor feedback that keeps you improving",
      description:
        "Use teacher-recorded videos, improved workbook and grammar lessons, Falowen Radio, AI grammar videos, and the AI Study Buddy to correct mistakes early.",
    },
  ];

  const steps = [
    "Pick your level (A1, A2, B1, B2, or C1) and preferred schedule.",
    "Join a cohort and get onboarding support from our team.",
    "Complete daily practice tasks on your phone or laptop.",
    "Attend live classes and receive tutor feedback.",
    "Prepare confidently for certification exams or relocation goals.",
  ];

  const faqBotQuestions = [
    "How do I enroll and get access to Falowen?",
    "Do online, in-person, self-learning, or recorded lectures cost the same?",
    "How can I pay for a class?",
    "What is the class duration and contract access period?",
    "Where can I download receipts, results, and attendance?",
    "How will I receive my assignment results?",
    "Do I get weekly progress summaries?",
    "What if I have payment or access issues?",
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
              <Pill>German lessons in Sierra Leone</Pill>
              <Pill>A1 to C1 German</Pill>
              <Pill>Exam preparation</Pill>
            </div>
            <h1 style={{ margin: 0, fontSize: 34 }}>
              Falowen: Learn German in Ghana, Nigeria, Sierra Leone, and across Africa.
            </h1>
            <p style={{ margin: 0, fontSize: 15, color: "#e0e7ff", lineHeight: 1.7 }}>
              Falowen helps learners across Ghana, Nigeria, Sierra Leone, and Africa gain real German fluency from A1 to C1.
              Study with live classes, teacher-recorded videos, Falowen Radio, AI grammar video support, improved workbooks,
              attendance tracking, exam preparation, and a Study Buddy with AI.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={styles.primaryButton} onClick={() => onSignUp("german")}>
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
              We combine structured German lessons with instructor feedback, recorded teacher videos, AI grammar support,
              Falowen Radio listening practice, improved workbooks, and exam preparation. Our learning system is built to
              support busy learners in Ghana, Nigeria, Sierra Leone, and wider Africa who want results quickly.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <Pill>Live Zoom classes</Pill>
              <Pill>Teacher-recorded videos</Pill>
              <Pill>Falowen Radio</Pill>
              <Pill>AI grammar video</Pill>
              <Pill>Attendance tracking</Pill>
              <Pill>Study Buddy with AI</Pill>
            </div>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>What you will practice</h3>
            <ul style={{ ...styles.checklist, marginTop: 0 }}>
              <li>German speaking drills and role-play scenarios.</li>
              <li>Writing letters, emails, and exam responses.</li>
              <li>Vocabulary for daily life, work, and travel.</li>
              <li>Pronunciation coaching with tutor feedback.</li>
              <li>AI-supported grammar review and teacher-recorded revision videos.</li>
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

        <SectionCard style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <div style={{ display: "grid", gap: 8 }}>
            <h2 style={{ ...styles.sectionTitle, marginBottom: 0 }}>Explore assessments, tools, and the blog</h2>
            <p style={{ margin: 0, fontSize: 13, color: "#334155", lineHeight: 1.7 }}>
              Move between our placement assessment, exam practice tools, and latest blog articles to build a complete
              study flow.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <a href="/placement-test" style={{ ...styles.secondaryButton, textDecoration: "none" }}>
                Take placement assessment
              </a>
              <a href="/exams/overview" style={{ ...styles.secondaryButton, textDecoration: "none" }}>
                Open exam tools
              </a>
              <a
                href="https://blog.falowen.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...styles.secondaryButton, textDecoration: "none" }}
              >
                Read Falowen blog
              </a>
            </div>
          </div>
        </SectionCard>

        <SectionCard style={{ background: "#f8fafc" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <h2 style={{ ...styles.sectionTitle, marginBottom: 6 }}>Falowen FAQ bot</h2>
              <p style={{ margin: 0, fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>
                New here? Ask the FAQ bot quick questions about enrollment, payments, certificates, or support. You can
                also chat with our team on WhatsApp for immediate help.
              </p>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              <label htmlFor="faq-bot-input" style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>
                Ask a quick question
              </label>
              <input
                id="faq-bot-input"
                type="text"
                placeholder="Type a question like “How do I enroll?”"
                style={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  padding: "12px 14px",
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {faqBotQuestions.map((question) => (
                <span
                  key={question}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                    color: "#1f2937",
                  }}
                >
                  {question}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={styles.primaryButton} onClick={() => onSignUp("german")}>
                Enroll now
              </button>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={() => setLeadCaptureOpen(true)}
              >
                Talk to us
              </button>
            </div>
            <a
              href="https://wa.me/233205706589"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: "#1f2937", textDecoration: "none", fontWeight: 600 }}
            >
              Prefer WhatsApp? +233 20 570 6589
            </a>
          </div>
        </SectionCard>

        <SectionCard style={{ background: "#0f172a", color: "#e5e7eb" }}>
          <div style={{ display: "grid", gap: 10 }}>
            <h2 style={{ ...styles.sectionTitle, color: "#ffffff", marginBottom: 0 }}>
              Ready to learn German with Falowen?
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: "#cbd5f5", lineHeight: 1.7 }}>
              We help learners in Ghana, Nigeria, Sierra Leone, and across Africa build confidence in German. Join a cohort or contact our team for the
              next available class.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={styles.primaryButton} onClick={() => onSignUp("german")}>
                Join a cohort
              </button>
              <button
                type="button"
                onClick={() => setLeadCaptureOpen(true)}
                style={{
                  ...styles.secondaryButton,
                  color: "#e5e7eb",
                  borderColor: "#94a3b8",
                  background: "transparent",
                }}
              >
                Talk to us
              </button>
            </div>
          </div>
        </SectionCard>
      </div>
      <LeadCaptureModal
        isOpen={leadCaptureOpen}
        onClose={() => setLeadCaptureOpen(false)}
        onSubmit={handleLeadSubmit}
        title="Talk to us"
        subtitle="Share a few details and our team will follow up with the best next step."
        submitLabel="Send details"
      />
    </main>
  );
};

export default SeoLandingPage;
