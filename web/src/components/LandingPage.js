import React from "react";
import { styles } from "../styles";

const FeatureCard = ({ title, description }) => (
  <div
    style={{
      ...styles.card,
      border: "1px solid #e0e7ff",
      background: "linear-gradient(180deg, #ffffff, #f8fafc)",
      height: "100%",
    }}
  >
    <h3 style={{ ...styles.sectionTitle, marginBottom: 8 }}>{title}</h3>
    <p style={{ ...styles.helperText, marginBottom: 0 }}>{description}</p>
  </div>
);

const ResourceLink = ({ label, href }) => (
  <a
    href={href}
    style={{ color: "#1d4ed8", textDecoration: "none", fontWeight: 600, fontSize: 14 }}
    target="_blank"
    rel="noreferrer"
  >
    {label}
  </a>
);

const LandingPage = ({ onSignUp, onLogin }) => {
  const features = [
    {
      title: "Blended Learning Model",
      description:
        "Connect daily mobile or laptop practice with structured face-to-face classroom sessions for steady progress.",
    },
    {
      title: "Tutor Integration",
      description:
        "Speaking and writing tasks you complete independently are reviewed by human tutors during live classes.",
    },
    {
      title: "Live Interactive Chat",
      description:
        "Join a live German chat during class with real-time monitoring and feedback from a tutor while you type.",
    },
  ];

  const quickLinks = [
    { label: "About us", href: "https://register.falowen.app/#about-us" },
    { label: "Privacy policy", href: "https://register.falowen.app/#privacy-policy" },
    { label: "Contact", href: "https://register.falowen.app/#contact" },
    { label: "Terms of service", href: "https://register.falowen.app/#terms-of-service" },
    { label: "FAQ", href: "https://register.falowen.app/#faq" },
    { label: "Blog", href: "https://blog.falowen.app/feed" },
  ];

  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/lleaghana" },
    { label: "YouTube", href: "https://www.youtube.com/@LLEAGhana" },
    { label: "Facebook", href: "https://web.facebook.com/lleaghana" },
  ];

  const photos = [
    {
      title: "Exam Preparation",
      description:
        "Practice polite requests, questions, opinions, and full conversations with exam-style prompts tailored for Goethe and Telc formats.",
    },
    {
      title: "24/7 Resource Access",
      description:
        "Vocabulary practice, live AI integration, and round-the-clock learning materials keep you on track whenever you study.",
    },
  ];

  const quickLinks = [
    { label: "About us", href: "https://register.falowen.app/#about-us" },
    { label: "Privacy policy", href: "https://register.falowen.app/#privacy-policy" },
    { label: "Contact", href: "https://register.falowen.app/#contact" },
    { label: "Terms of service", href: "https://register.falowen.app/#terms-of-service" },
    { label: "FAQ", href: "https://register.falowen.app/#faq" },
    { label: "Blog", href: "https://blog.falowen.app/feed" },
  ];

  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/lleaghana" },
    { label: "YouTube", href: "https://www.youtube.com/@LLEAGhana" },
    { label: "Facebook", href: "https://web.facebook.com/lleaghana" },
  ];

  const photos = [
    {
      url: "https://github.com/learngermanghana/falowenexamtrainer/blob/main/photos/pexels-julia-m-cameron-4145153.jpg?raw=1",
      caption: "Guided practice sessions with classmates and tutors.",
    },
    {
      url: "https://github.com/learngermanghana/falowenexamtrainer/blob/main/photos/pexels-mart-production-8473001.jpg?raw=1",
      caption: "Hands-on writing and speaking drills for every level.",
    },
  ];

  return (
    <div
      style={{
        ...styles.container,
        background: "radial-gradient(circle at 10% 20%, #eef2ff 0, #f3f4f6 35%, #f3f4f6 100%)",
      }}
    >
      <div style={{ display: "grid", gap: 16, margin: "0 auto", maxWidth: 1100 }}>
        <section
          style={{
            ...styles.card,
            background: "linear-gradient(135deg, #1d4ed8, #1e3a8a)",
            color: "#ffffff",
            border: "1px solid #1d4ed8",
            boxShadow: "0 18px 36px rgba(37, 99, 235, 0.28)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ ...styles.badge, alignSelf: "flex-start", background: "#c7d2fe", color: "#1e3a8a" }}>
              Falowen · Launched 2025
            </p>
            <h1 style={{ ...styles.title, fontSize: 32, color: "#ffffff", margin: 0 }}>
              Conversation-focused German learning built in Ghana.
            </h1>
            <p style={{ ...styles.helperText, color: "#e0e7ff", marginBottom: 4 }}>
              Falowen is a conversation-focused German language learning application launched in 2025 by Ghanaian educators.
              It bridges the gap between classroom coaching and independent daily practice for students preparing for German certification exams.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button style={styles.primaryButton} onClick={onSignUp}>
                Sign up for free
              </button>
              <button style={styles.secondaryButton} onClick={onLogin}>
                I already have an account
              </button>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 6 }}>
              <span style={styles.badge}>Daily practice + live classes</span>
              <span style={styles.badge}>Tutor-reviewed exercises</span>
              <span style={styles.badge}>Exam-style simulations</span>
            </div>
          </div>
        </section>

        <section style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {features.map((item) => (
            <FeatureCard key={item.title} title={item.title} description={item.description} />
          ))}
        </section>

        <section style={{ ...styles.card, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {photos.map((photo) => (
            <div key={photo.url} style={{ display: "grid", gap: 8 }}>
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 12,
                  boxShadow: "0 10px 24px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <p style={{ ...styles.helperText, margin: 0 }}>{photo.caption}</p>
            </div>
          ))}
        </section>

        <section style={{ ...styles.card, background: "#111827", color: "#e5e7eb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 2, minWidth: 260 }}>
              <h2 style={{ ...styles.sectionTitle, color: "#fff" }}>How Falowen supports your exam goals</h2>
              <p style={{ ...styles.helperText, color: "#d1d5db" }}>
                The platform includes realistic examination tasks designed for polite requests, questions, and confident conversation building.
                Daily mobile practice pairs with tutor-led classroom sessions so you get feedback exactly when you need it.
              </p>
            </div>
            <div style={{ display: "grid", gap: 10, flex: 1, minWidth: 240 }}>
              <div style={{ ...styles.uploadCard, background: "#0f172a", borderColor: "#1f2937" }}>
                <h3 style={{ ...styles.sectionTitle, color: "#fff", marginBottom: 6 }}>Ready to start?</h3>
                <p style={{ ...styles.helperText, color: "#d1d5db", marginBottom: 10 }}>
                  Create your profile to access the Daily Plan, join live chats, and unlock exam resources.
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button style={{ ...styles.primaryButton, padding: "10px 14px" }} onClick={onSignUp}>
                    Create account
                  </button>
                  <button style={{ ...styles.secondaryButton, padding: "10px 14px" }} onClick={onLogin}>
                    Go to login
                  </button>
                </div>
              </div>
              <div style={{ ...styles.uploadCard, background: "#0f172a", borderColor: "#1f2937" }}>
                <h4 style={{ ...styles.sectionTitle, color: "#fff", marginBottom: 8 }}>Stay connected</h4>
                <ul style={{ ...styles.checklist, margin: 0, color: "#d1d5db" }}>
                  <li>
                    WhatsApp: <a style={{ color: "#a5b4fc" }} href="https://wa.me/233205706589">+233 20 570 6589</a>
                  </li>
                  <li>
                    Email: <a style={{ color: "#a5b4fc" }} href="mailto:learngermanghana.com">learngermanghana.com</a>
                  </li>
                  <li>Live chat during classes with tutor monitoring and feedback.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section style={{ ...styles.card, display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div>
            <h3 style={styles.sectionTitle}>Quick links</h3>
            <div style={{ display: "grid", gap: 8 }}>
              {quickLinks.map((link) => (
                <ResourceLink key={link.label} label={link.label} href={link.href} />
              ))}
            </div>
          </div>
          <div>
            <h3 style={styles.sectionTitle}>Follow Falowen</h3>
            <div style={{ display: "grid", gap: 8 }}>
              {socialLinks.map((link) => (
                <ResourceLink key={link.label} label={link.label} href={link.href} />
              ))}
            </div>
          </div>
          <div>
            <h3 style={styles.sectionTitle}>Why learners stay</h3>
            <ul style={{ ...styles.checklist, margin: 0 }}>
              <li>Blended learning keeps class time productive.</li>
              <li>Coaches review every submitted speaking and writing task.</li>
              <li>24/7 access to vocabulary practice and live AI partners.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
