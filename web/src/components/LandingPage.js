import React from "react";
import { styles } from "../styles";

const FeatureCard = ({ icon, title, description }) => (
  <div
    style={{
      ...styles.card,
      border: "1px solid #e0e7ff",
      background: "linear-gradient(180deg, #ffffff, #f8fafc)",
      height: "100%",
      display: "grid",
      gap: 8,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span aria-hidden style={{ fontSize: 18 }}>
        {icon}
      </span>
      <h3 style={{ ...styles.sectionTitle, margin: 0 }}>{title}</h3>
    </div>
    <p style={{ ...styles.helperText, margin: 0 }}>{description}</p>
  </div>
);

const ResourceLink = ({ label, href }) => (
  <a
    href={href}
    style={{ color: "#1d4ed8", textDecoration: "none", fontWeight: 600, fontSize: 14 }}
    target="_blank"
    rel="noopener noreferrer"
  >
    {label}
  </a>
);

const StepCard = ({ index, title, description }) => (
  <div
    style={{
      border: "1px solid #e5e7eb",
      borderRadius: 14,
      padding: 12,
      background: "#f9fafb",
      display: "grid",
      gap: 6,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: "#dbeafe",
          color: "#1e40af",
          display: "grid",
          placeItems: "center",
          fontWeight: 900,
        }}
      >
        {index}
      </div>
      <h4 style={{ margin: 0, fontSize: 15, color: "#111827" }}>{title}</h4>
    </div>
    <p style={{ ...styles.helperText, margin: 0 }}>{description}</p>
  </div>
);

const PhotoCard = ({ url, caption }) => (
  <div style={{ display: "grid", gap: 8 }}>
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 14,
        boxShadow: "0 10px 24px rgba(0, 0, 0, 0.10)",
        border: "1px solid #e5e7eb",
        background: "#fff",
      }}
    >
      <img
        src={url}
        alt={caption}
        loading="lazy"
        style={{
          width: "100%",
          aspectRatio: "16 / 10",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
    <p style={{ ...styles.helperText, margin: 0 }}>{caption}</p>
  </div>
);

const LandingPage = ({ onSignUp, onLogin }) => {
  const features = [
    {
      icon: "📱",
      title: "Daily practice + live classes",
      description: "Practice on your phone or laptop daily, then apply it in tutor-led classroom sessions.",
    },
    {
      icon: "👩🏽‍🏫",
      title: "Tutor-reviewed submissions",
      description: "Your speaking and writing tasks are reviewed and discussed during live classes.",
    },
    {
      icon: "🗣️",
      title: "Exam-style training",
      description: "Work with realistic exam tasks that build confidence for A1–B1 certification.",
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

  // Tip: for best performance, consider moving these images to web/public/photos
  // and using "/photos/..." instead of GitHub raw URLs.
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

  const signupSteps = [
    {
      title: "Open the sign-up form",
      description: "Click “Join a cohort” to start your application.",
    },
    {
      title: "Fill in your details",
      description: "Share your name, contact info, and learning goals so we place you correctly.",
    },
    {
      title: "Choose your level/class",
      description: "Select the cohort you want (e.g., A1/A2/B1) based on schedule and availability.",
    },
    {
      title: "Complete payment to unlock access",
      description: "After selecting your cohort, complete payment to unlock full access to the course tools.",
    },
    {
      title: "Get onboarding support",
      description: "We follow up with your welcome checklist, class links, and next steps.",
    },
  ];

  return (
    <main
      style={{
        ...styles.container,
        background: "radial-gradient(circle at 10% 20%, #eef2ff 0, #f3f4f6 35%, #f3f4f6 100%)",
      }}
    >
      <div style={{ display: "grid", gap: 16, margin: "0 auto", maxWidth: 1100 }}>
        {/* Hero */}
        <header
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
              Falowen · Exam Coach
            </p>

            <h1 style={{ ...styles.title, fontSize: 32, color: "#ffffff", margin: 0 }}>
              Conversation-focused German learning built in Ghana.
            </h1>

            <p style={{ ...styles.helperText, color: "#e0e7ff", margin: 0, lineHeight: 1.6 }}>
              Falowen helps students prepare for German certification exams with daily practice, tutor feedback, and
              structured live classes.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={styles.primaryButton} onClick={onSignUp}>
                Join a cohort
              </button>
              <button type="button" style={styles.secondaryButton} onClick={onLogin}>
                Log in
              </button>

              <a
                href="#how-it-works"
                style={{
                  color: "#e0e7ff",
                  fontWeight: 700,
                  textDecoration: "none",
                  alignSelf: "center",
                }}
              >
                See how it works ↓
              </a>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
              <span style={styles.badge}>Daily practice</span>
              <span style={styles.badge}>Tutor feedback</span>
              <span style={styles.badge}>Live classes</span>
              <span style={styles.badge}>Exam simulations</span>
            </div>
          </div>
        </header>

        {/* Choose your path */}
        <section
          style={{
            ...styles.card,
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            alignItems: "stretch",
          }}
        >
          <div style={{ display: "grid", gap: 8 }}>
            <h2 style={styles.sectionTitle}>Choose your path</h2>
            <p style={{ ...styles.helperText, margin: 0 }}>
              New learner or exam-focused? Pick the option that matches your next step.
            </p>
          </div>

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              padding: 12,
              background: "#ffffff",
              display: "grid",
              gap: 10,
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ fontWeight: 900, color: "#111827" }}>I’m new to German</div>
            <p style={{ ...styles.helperText, margin: 0 }}>Join the next cohort and start from the right level (A1+).</p>
            <button type="button" style={styles.primaryButton} onClick={onSignUp}>
              Join a cohort
            </button>
          </div>

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              padding: 12,
              background: "#ffffff",
              display: "grid",
              gap: 10,
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ fontWeight: 900, color: "#111827" }}>I’m preparing for exams</div>
            <p style={{ ...styles.helperText, margin: 0 }}>Log in to practice speaking and writing with exam tasks.</p>
            <button type="button" style={styles.secondaryButton} onClick={onLogin}>
              Log in
            </button>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          style={{
            ...styles.card,
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 8 }}>
            <h2 style={styles.sectionTitle}>How to sign up and start learning</h2>
            <p style={{ ...styles.helperText, marginBottom: 0 }}>
              Complete your application, pick a cohort, then unlock access with payment. After that, you’ll get your
              onboarding checklist and class links.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={styles.primaryButton} onClick={onSignUp}>
                Join a cohort
              </button>
              <button type="button" style={styles.secondaryButton} onClick={onLogin}>
                Log in
              </button>
            </div>

            <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
              <div style={{ ...styles.helperText, margin: 0 }}>
                ✅ You’ll get: daily practice tools, tutor feedback, and live class support.
              </div>
              <div style={{ ...styles.helperText, margin: 0 }}>
                ✅ Best for: students preparing for Goethe-style speaking and writing tasks.
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {signupSteps.map((step, idx) => (
              <StepCard key={step.title} index={idx + 1} title={step.title} description={step.description} />
            ))}
          </div>
        </section>

        {/* Features */}
        <section style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {features.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
          ))}
        </section>

        {/* Photos */}
        <section
          style={{
            ...styles.card,
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {photos.map((p) => (
            <PhotoCard key={p.url} url={p.url} caption={p.caption} />
          ))}
        </section>

        {/* Dark CTA */}
        <section style={{ ...styles.card, background: "#111827", color: "#e5e7eb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 2, minWidth: 260 }}>
              <h2 style={{ ...styles.sectionTitle, color: "#fff" }}>How Falowen supports your exam goals</h2>
              <p style={{ ...styles.helperText, color: "#d1d5db", lineHeight: 1.65 }}>
                Falowen trains the exact skills you need for exam success: polite requests, correct questions, and confident
                conversation. Practice daily, then get tutor feedback during live classes.
              </p>
            </div>

            <div style={{ display: "grid", gap: 10, flex: 1, minWidth: 240 }}>
              <div style={{ ...styles.uploadCard, background: "#0f172a", borderColor: "#1f2937" }}>
                <h3 style={{ ...styles.sectionTitle, color: "#fff", marginBottom: 6 }}>Ready to start?</h3>
                <p style={{ ...styles.helperText, color: "#d1d5db", marginBottom: 10 }}>
                  Create your profile to access practice tools, class schedules, and tutor feedback.
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button type="button" style={{ ...styles.primaryButton, padding: "10px 14px" }} onClick={onSignUp}>
                    Join a cohort
                  </button>
                  <button type="button" style={{ ...styles.secondaryButton, padding: "10px 14px" }} onClick={onLogin}>
                    Log in
                  </button>
                </div>
              </div>

              <div style={{ ...styles.uploadCard, background: "#0f172a", borderColor: "#1f2937" }}>
                <h4 style={{ ...styles.sectionTitle, color: "#fff", marginBottom: 8 }}>Stay connected</h4>
                <ul style={{ ...styles.checklist, margin: 0, color: "#d1d5db", lineHeight: 1.6 }}>
                  <li>
                    Call or WhatsApp:
                    <a
                      style={{ color: "#a5b4fc", marginLeft: 6, textDecoration: "none", fontWeight: 700 }}
                      href="https://wa.me/233205706589"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +233 20 570 6589
                    </a>
                  </li>
                  <li>
                    Email:
                    <a
                      style={{ color: "#a5b4fc", marginLeft: 6, textDecoration: "none", fontWeight: 700 }}
                      href="mailto:sedifexbiz@gmail.com"
                    >
                      sedifexbiz@gmail.com
                    </a>
                  </li>
                  <li>Live chat during classes with tutor monitoring and feedback.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <footer
          style={{
            ...styles.card,
            display: "grid",
            gap: 14,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          <div>
            <h3 style={styles.sectionTitle}>Quick links</h3>
            <div style={{ display: "grid", gap: 8 }}>
              {quickLinks.map((l) => (
                <ResourceLink key={l.label} label={l.label} href={l.href} />
              ))}
            </div>
          </div>

          <div>
            <h3 style={styles.sectionTitle}>Follow Falowen</h3>
            <div style={{ display: "grid", gap: 8 }}>
              {socialLinks.map((l) => (
                <ResourceLink key={l.label} label={l.label} href={l.href} />
              ))}
            </div>
          </div>

          <div>
            <h3 style={styles.sectionTitle}>Why learners stay</h3>
            <ul style={{ ...styles.checklist, margin: 0, lineHeight: 1.6 }}>
              <li>Blended learning keeps class time productive.</li>
              <li>Tutors review and guide your speaking + writing practice.</li>
              <li>Exam-style tasks help you build confidence quickly.</li>
            </ul>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default LandingPage;
