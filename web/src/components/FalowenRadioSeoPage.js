import React, { useEffect } from "react";
import { updatePageMeta } from "../lib/pageMeta";
import { styles } from "../styles";

const PAGE_URL = "https://www.falowen.app/falowen-radio";
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@LLEAGhana";
const YOUTUBE_SUBSCRIBE_URL = "https://www.youtube.com/@LLEAGhana?sub_confirmation=1";

const faqItems = [
  {
    question: "What is Falowen Radio?",
    answer:
      "Falowen Radio is a German-listening learning feature built into the Falowen A1-C1 course book. Each episode matches a lesson topic and prepares students for the speaking, grammar and workbook activities that follow.",
  },
  {
    question: "Is Falowen Radio a traditional radio station?",
    answer:
      "No. Falowen Radio is not a commercial broadcast, news or entertainment radio station. It is an educational listening stage inside the Falowen German course book.",
  },
  {
    question: "How does Falowen Radio help German learners?",
    answer:
      "It trains learners to understand natural, real-world spoken German by exposing them to pronunciation, rhythm, connected speech and lesson vocabulary in context before they complete course-book tasks.",
  },
  {
    question: "Where can I watch Falowen Radio and Falowen German lessons?",
    answer:
      "Falowen students access level-matched episodes inside their course book. Selected episodes and German-learning videos are also published on the LLEA Ghana YouTube channel.",
  },
];

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
  borderRadius: 18,
};

const linkButtonStyle = {
  ...styles.primaryButton,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  width: "fit-content",
};

const secondaryLinkStyle = {
  ...styles.secondaryButton,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  width: "fit-content",
};

export default function FalowenRadioSeoPage() {
  useEffect(() => {
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "@id": "https://www.falowen.app/#organization",
      name: "Falowen",
      url: "https://www.falowen.app/",
      logo: "https://www.falowen.app/logo512.png",
      sameAs: [YOUTUBE_CHANNEL_URL],
    };

    const courseSchema = {
      "@context": "https://schema.org",
      "@type": "Course",
      "@id": "https://www.falowen.app/falowen-radio#course",
      name: "Falowen German Course Book A1-C1",
      description:
        "A structured German course book that combines Falowen Radio listening warm-ups with speaking, grammar, vocabulary, writing and workbook practice.",
      provider: {
        "@id": "https://www.falowen.app/#organization",
      },
      educationalLevel: ["A1", "A2", "B1", "B2", "C1"],
      inLanguage: ["de", "en"],
    };

    const learningResourceSchema = {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      "@id": "https://www.falowen.app/falowen-radio#learning-resource",
      name: "Falowen Radio",
      alternateName: [
        "Falowen Radio German Listening Practice",
        "Falowen German Radio",
        "Falowen Course Book Listening Warm-up",
      ],
      url: PAGE_URL,
      description:
        "Falowen Radio is a German-listening learning feature integrated into the Falowen A1-C1 course book. Level-matched episodes help students understand natural spoken German before speaking, grammar and workbook tasks.",
      learningResourceType: [
        "German listening practice",
        "Course-book audio and video",
        "Listening comprehension warm-up",
      ],
      educationalUse: [
        "Listening comprehension",
        "Pronunciation practice",
        "Vocabulary in context",
        "Preparation for speaking and workbook activities",
      ],
      educationalLevel: ["A1", "A2", "B1", "B2", "C1"],
      teaches: [
        "Understanding natural spoken German",
        "German pronunciation and rhythm",
        "German vocabulary in context",
        "Real-world German listening comprehension",
      ],
      inLanguage: ["de", "en"],
      isPartOf: {
        "@id": "https://www.falowen.app/falowen-radio#course",
      },
      provider: {
        "@id": "https://www.falowen.app/#organization",
      },
      sameAs: [YOUTUBE_CHANNEL_URL],
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    };

    updatePageMeta({
      title: "Falowen Radio | German Listening Inside the Falowen Course Book",
      description:
        "Falowen Radio is German listening practice built into the Falowen A1-C1 course book, helping learners understand natural spoken German before lesson tasks.",
      canonicalPath: "/falowen-radio",
      lang: "en",
      ogType: "website",
      structuredData: [
        { id: "falowen-radio-organization", schema: organizationSchema },
        { id: "falowen-radio-course", schema: courseSchema },
        { id: "falowen-radio-learning-resource", schema: learningResourceSchema },
        { id: "falowen-radio-faq", schema: faqSchema },
      ],
    });
  }, []);

  return (
    <main
      style={{
        ...styles.container,
        maxWidth: 1040,
        display: "grid",
        gap: 18,
        paddingTop: 24,
        paddingBottom: 48,
        background: "linear-gradient(180deg, #eef2ff 0%, #f8fafc 38%, #ffffff 100%)",
      }}
    >
      <section
        style={{
          ...cardStyle,
          padding: "clamp(22px, 5vw, 42px)",
          color: "#ffffff",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #7c3aed 100%)",
          border: "1px solid #4338ca",
        }}
      >
        <span style={{ fontWeight: 900, letterSpacing: ".08em", textTransform: "uppercase", fontSize: 12 }}>
          German listening inside the Falowen course book
        </span>
        <h1 style={{ margin: 0, fontSize: "clamp(2rem, 7vw, 3.8rem)", lineHeight: 1.05 }}>
          What is Falowen Radio?
        </h1>
        <p style={{ margin: 0, maxWidth: 820, fontSize: "clamp(1rem, 2.5vw, 1.2rem)", lineHeight: 1.75, color: "#e0e7ff" }}>
          Falowen Radio is a level-matched German listening feature built directly into the Falowen A1-C1 course book. It helps learners understand natural, real-world German before they continue to speaking, grammar, vocabulary, writing and workbook practice.
        </p>
        <p style={{ margin: 0, maxWidth: 820, lineHeight: 1.7, color: "#ddd6fe", fontWeight: 700 }}>
          It is not a traditional broadcast, news or entertainment radio station. It is part of the Falowen learning method.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <a href={YOUTUBE_SUBSCRIBE_URL} target="_blank" rel="noreferrer" style={linkButtonStyle}>
            ▶ Subscribe on YouTube
          </a>
          <a href="/learn-german-ghana" style={secondaryLinkStyle}>
            Explore Falowen German courses
          </a>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>How Falowen Radio is integrated into the course book</h2>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#475569" }}>
          Falowen Radio is not a separate activity that students must search for. It appears inside the lesson flow and is connected to the topic being studied that day.
        </p>
        <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 10, lineHeight: 1.65 }}>
          <li><strong>Open the lesson:</strong> the student enters the assigned A1, A2, B1, B2 or C1 course-book lesson.</li>
          <li><strong>Listen first:</strong> Falowen Radio introduces the lesson topic through natural German speech and vocabulary in context.</li>
          <li><strong>Train the ear:</strong> the student listens for pronunciation, rhythm, connected speech and meaning instead of translating every word.</li>
          <li><strong>Continue learning:</strong> the same topic then moves into speaking, grammar, vocabulary, writing and workbook tasks.</li>
          <li><strong>Review when needed:</strong> selected Falowen Radio episodes and German lessons are available through the LLEA Ghana YouTube channel.</li>
        </ol>
      </section>

      <section style={{ ...cardStyle, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div style={{ display: "grid", gap: 8 }}>
          <span style={{ fontSize: 30 }}>🎧</span>
          <h2 style={{ margin: 0, fontSize: 18 }}>Understand natural German</h2>
          <p style={{ margin: 0, lineHeight: 1.65, color: "#475569" }}>
            Learners hear how German sounds at natural speed, including pronunciation, sentence rhythm and words joining together in everyday speech.
          </p>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <span style={{ fontSize: 30 }}>📘</span>
          <h2 style={{ margin: 0, fontSize: 18 }}>Connected to each lesson</h2>
          <p style={{ margin: 0, lineHeight: 1.65, color: "#475569" }}>
            Episodes are selected for the current course-book topic, so listening prepares the learner for the exercises that follow instead of becoming random entertainment.
          </p>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <span style={{ fontSize: 30 }}>🗣️</span>
          <h2 style={{ margin: 0, fontSize: 18 }}>Prepare for real conversations</h2>
          <p style={{ margin: 0, lineHeight: 1.65, color: "#475569" }}>
            Regular listening builds confidence for live classes, speaking tasks, travel, work, study and communication with German speakers.
          </p>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Falowen Radio on YouTube</h2>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#475569" }}>
          Subscribe to the official LLEA Ghana YouTube channel for selected Falowen Radio episodes, teacher explanations, grammar videos and German-learning support.
        </p>
        <a href={YOUTUBE_SUBSCRIBE_URL} target="_blank" rel="noreferrer" style={linkButtonStyle}>
          Subscribe to LLEA Ghana
        </a>
        <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer" style={{ color: "#1d4ed8", fontWeight: 800, width: "fit-content" }}>
          Visit youtube.com/@LLEAGhana
        </a>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Frequently asked questions</h2>
        <div style={{ display: "grid", gap: 14 }}>
          {faqItems.map((item) => (
            <article key={item.question} style={{ display: "grid", gap: 6, paddingBottom: 12, borderBottom: "1px solid #e2e8f0" }}>
              <h3 style={{ margin: 0, fontSize: 17 }}>{item.question}</h3>
              <p style={{ margin: 0, lineHeight: 1.7, color: "#475569" }}>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
