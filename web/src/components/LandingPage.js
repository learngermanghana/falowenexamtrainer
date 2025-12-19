import React, { useEffect, useState } from "react";
import { styles } from "../styles";

const Highlight = ({ title, description }) => (
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

const LandingPage = ({ onSignUp, onLogin }) => {
  const [latestBlogs, setLatestBlogs] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const loadFeed = async () => {
      try {
        const response = await fetch("https://blog.falowen.app/feed", {
          signal: controller.signal,
        });

        if (!response.ok) return;

        const text = await response.text();
        const parser = new window.DOMParser();
        const xml = parser.parseFromString(text, "application/xml");
        const items = Array.from(xml.querySelectorAll("item"))
          .slice(0, 5)
          .map((item) => ({
            title: item.querySelector("title")?.textContent?.trim(),
            href: item.querySelector("link")?.textContent?.trim(),
          }))
          .filter((item) => item.title && item.href);

        setLatestBlogs(items);
      } catch (error) {
        // Silently ignore feed issues so the page still renders.
      }
    };

    loadFeed();

    return () => controller.abort();
  }, []);

  const highlights = [
    {
      title: "Who we serve",
      description:
        "Falowen is a conversational mobile and web app built for newcomers, professionals, and exam candidates learning German.",
    },
    {
      title: "Blended learning",
      description:
        "Connect daily self-study with structured classroom coaching so every session moves you closer to Goethe exam day.",
    },
    {
      title: "Always exam-ready",
      description:
        "Practice introductions, polite requests, and live Q&A that mirror test conditions while tutors monitor in real time.",
    },
  ];

  const pillars = [
    {
      title: "Exam preparation that feels real",
      copy: "Speaking and writing prompts are modeled after Goethe-style A1–C1 tasks so you rehearse exactly what you will face.",
    },
    {
      title: "Coach-guided chat",
      copy: "Join live-typed German chats during class while tutors keep the conversation flowing and give instant feedback.",
    },
    {
      title: "Personal reminders",
      copy: "Email and Telegram updates include countdowns to your registered exam date plus tailored coaching tips.",
    },
  ];

  const steps = [
    "Start with the Level Check to tailor your everyday, work, or A1–C1 exam pathway.",
    "Follow the Daily Plan with blended self-study and live class chat tasks.",
    "Track progress, get reminders, and arrive at exam day confident and prepared.",
  ];

  const featureList = [
    "Blended learning that links daily practice with structured classroom coaching.",
    "Everyday German for greetings, directions, shopping, and conversations with neighbors.",
    "Work and business German for meetings, emails, and customer conversations.",
    "Realistic exam preparation with A1–C1 style introductions, questions, and polite requests.",
    "Live German chat participation with tutor monitoring and feedback.",
    "Exam reminders, countdowns, and personalized coaching via email and Telegram.",
  ];

  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/lleaghana/" },
    { label: "Facebook", href: "https://web.facebook.com/lleaghana" },
    { label: "YouTube", href: "https://www.youtube.com/@LLEAGhana" },
  ];

  const galleryImages = [
    {
      src: "https://raw.githubusercontent.com/learngermanghana/falowenexamtrainer/main/photos/pexels-akbissue-29558446.jpg",
      alt: "Student practicing German speaking on a mobile phone",
    },
    {
      src: "https://raw.githubusercontent.com/learngermanghana/falowenexamtrainer/main/photos/pexels-ilabappa-19376862.jpg",
      alt: "Group German study session with notebooks",
    },
    {
      src: "https://raw.githubusercontent.com/learngermanghana/falowenexamtrainer/main/photos/pexels-mikhail-nilov-6893950.jpg",
      alt: "Tutor guiding a student through German exercises",
    },
  ];

  const focusOptions = [
    {
      title: "Everyday German",
      copy: "Learn practical phrases for greetings, markets, directions, appointments, and family life.",
    },
    {
      title: "Work & business German",
      copy: "Build confidence for meetings, emails, presentations, and serving customers in German-speaking workplaces.",
    },
    {
      title: "Exam prep A1–C1",
      copy: "Train for Goethe and ÖSD-style tasks with speaking, writing, and listening drills for every level.",
    },
  ];

  return (
    <div
      style={{
        ...styles.container,
        background: "radial-gradient(circle at 10% 20%, #eef2ff 0, #f3f4f6 35%, #f3f4f6 100%)",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 16,
          margin: "0 auto",
          maxWidth: 1080,
        }}
      >
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
              Falowen Exam Coach
            </p>
            <h1 style={{ ...styles.title, fontSize: 32, color: "#ffffff", margin: 0 }}>
              Learn German for daily life, work, or A1–C1 exams.
            </h1>
            <p style={{ ...styles.helperText, color: "#e0e7ff", marginBottom: 4 }}>
              Blended mobile and web learning that lets you pick your focus—practical everyday German, workplace communication,
              or dedicated exam prep—while classroom coaching and live tutor feedback keep you confident.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href="https://api.whatsapp.com/send/?phone=233205706589&text&type=phone_number&app_absent=0"
                style={{ ...styles.primaryButton, textDecoration: "none", display: "inline-block" }}
              >
                Register via WhatsApp
              </a>
              <button style={styles.secondaryButton} onClick={onLogin}>
                I already have an account
              </button>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 6 }}>
              <span style={styles.badge}>Everyday German</span>
              <span style={styles.badge}>Work & business</span>
              <span style={styles.badge}>A1–C1 exam prep</span>
              <span style={styles.badge}>Adaptive Daily Plan</span>
              <span style={styles.badge}>Push reminders</span>
            </div>
          </div>
        </section>

        <section style={{ ...styles.card }}>
          <h2 style={styles.sectionTitle}>Choose your learning focus</h2>
          <p style={styles.helperText}>
            Switch between tracks anytime so your study time matches what you need next—daily life, workplace German, or exam
            day preparation.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            {focusOptions.map((option) => (
              <div key={option.title} style={{ ...styles.uploadCard }}>
                <h3 style={{ ...styles.sectionTitle, marginBottom: 6 }}>{option.title}</h3>
                <p style={{ ...styles.helperText, margin: 0 }}>{option.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ ...styles.card }}>
          <h2 style={styles.sectionTitle}>Key features and functions</h2>
          <p style={styles.helperText}>
            Everything is designed around Goethe exam readiness with blended learning and coach support.
          </p>
          <ul style={{ ...styles.checklist, margin: 0 }}>
            {featureList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            <a
              href="https://api.whatsapp.com/send/?phone=233205706589&text&type=phone_number&app_absent=0"
              style={{ ...styles.primaryButton, textDecoration: "none", display: "inline-block" }}
            >
              Register via WhatsApp
            </a>
            <a
              href="https://register.falowen.app/privacy"
              style={{ ...styles.secondaryButton, textDecoration: "none", display: "inline-block" }}
            >
              Privacy & terms (register.falowen.app)
            </a>
            <a
              href="https://blog.falowen.app"
              style={{ ...styles.secondaryButton, textDecoration: "none", display: "inline-block" }}
            >
              Read Falowen blog
            </a>
          </div>
        </section>

        <section style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {highlights.map((item) => (
            <Highlight key={item.title} title={item.title} description={item.description} />
          ))}
        </section>

        <section style={{ ...styles.card, background: "#111827", color: "#e5e7eb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 2, minWidth: 260 }}>
              <h2 style={{ ...styles.sectionTitle, color: "#fff" }}>Mission & approach</h2>
              <p style={{ ...styles.helperText, color: "#d1d5db" }}>
                Prep should be measurable, motivating, and manageable. We pair short daily sessions, clear weekly goals, and
                personal feedback on every exercise.
              </p>
            </div>
            <div style={{ display: "grid", gap: 10, flex: 1, minWidth: 240 }}>
              {pillars.map((pillar) => (
                <div key={pillar.title} style={{ ...styles.uploadCard, background: "#0f172a", borderColor: "#1f2937" }}>
                  <h3 style={{ ...styles.sectionTitle, color: "#fff", marginBottom: 6 }}>{pillar.title}</h3>
                  <p style={{ ...styles.helperText, color: "#d1d5db", margin: 0 }}>{pillar.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ ...styles.card }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h2 style={styles.sectionTitle}>How it works</h2>
              <p style={styles.helperText}>Get ready in three simple steps:</p>
              <ul style={{ ...styles.checklist, margin: 0 }}>
                {steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
            <div style={{ flex: 1, minWidth: 260, display: "grid", gap: 10 }}>
              <div style={{ ...styles.resultCard, marginTop: 0 }}>
                <h3 style={styles.sectionTitle}>Why start now?</h3>
                <p style={styles.helperText}>
                  Get an early lead, receive a clear plan, and track your progress with every login.
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <a
                    href="https://api.whatsapp.com/send/?phone=233205706589&text&type=phone_number&app_absent=0"
                    style={{ ...styles.primaryButton, padding: "10px 14px", textDecoration: "none", display: "inline-block" }}
                  >
                    Register via WhatsApp
                  </a>
                  <button style={{ ...styles.secondaryButton, padding: "10px 14px" }} onClick={onLogin}>
                    Go to login
                  </button>
                </div>
              </div>
              <div style={{ ...styles.uploadCard }}>
                <h4 style={{ ...styles.sectionTitle, marginBottom: 8 }}>Community facts</h4>
                <ul style={{ ...styles.checklist, margin: 0 }}>
                  <li>98% keep their streaks in the first 14 days.</li>
                  <li>Weekly review with individual writing and speaking tips.</li>
                  <li>Push reminders and email summaries included.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section style={{ ...styles.card }}>
          <h2 style={styles.sectionTitle}>Classroom & practice moments</h2>
          <p style={styles.helperText}>
            Real learners, real preparation: a glimpse of how Falowen keeps German exam coaching conversational and practical.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {galleryImages.map((image) => (
              <div key={image.src} style={{ ...styles.uploadCard, padding: 0, overflow: "hidden" }}>
                <img
                  src={image.src}
                  alt={image.alt}
                  style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                />
              </div>
            ))}
          </div>
        </section>

        <section style={{ ...styles.card }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            <div>
              <h3 style={styles.sectionTitle}>Stay connected</h3>
              <p style={styles.helperText}>Follow learning highlights and class moments.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    style={{ ...styles.secondaryButton, textDecoration: "none", display: "inline-block" }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 style={styles.sectionTitle}>Latest from the blog</h3>
              <p style={styles.helperText}>Fresh tips and updates from blog.falowen.app.</p>
              <ul style={{ ...styles.checklist, margin: 0 }}>
                {(latestBlogs.length > 0 ? latestBlogs : [{ title: "Loading latest posts...", href: "#" }]).map(
                  (post) => (
                    <li key={`${post.title}-${post.href}`}>
                      {post.href !== "#" ? (
                        <a href={post.href} style={{ color: "#1d4ed8", textDecoration: "none" }}>
                          {post.title}
                        </a>
                      ) : (
                        <span>{post.title}</span>
                      )}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <h3 style={styles.sectionTitle}>Privacy & terms</h3>
              <p style={styles.helperText}>
                Review how we handle your data and the service terms before you register.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a href="https://register.falowen.app/privacy" style={{ color: "#1d4ed8", textDecoration: "none" }}>
                  Privacy policy
                </a>
                <a href="https://register.falowen.app/terms" style={{ color: "#1d4ed8", textDecoration: "none" }}>
                  Terms of service
                </a>
                <a href="https://register.falowen.app" style={{ color: "#1d4ed8", textDecoration: "none" }}>
                  Privacy & terms home (register.falowen.app)
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
