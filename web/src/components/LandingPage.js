import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { persistInterfaceLanguage } from "../i18n";
import { updatePageMeta } from "../lib/pageMeta";
import LeadCaptureModal from "./LeadCaptureModal";
import { captureLead } from "../services/leadCaptureService";

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

const shuffleArray = (items) => {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const ReviewCard = ({ stars = 5, name, country, level, text, starLabel }) => (
  <div
    style={{
      border: "1px solid #e5e7eb",
      borderRadius: 14,
      padding: 12,
      background: "#ffffff",
      display: "grid",
      gap: 8,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
      <div style={{ fontWeight: 900, color: "#111827" }}>{name}</div>
      <div style={{ fontSize: 13, color: "#111827", opacity: 0.85 }}>
        {country} · {level}
      </div>
    </div>

    <div aria-label={starLabel} style={{ letterSpacing: 1 }}>
      {"★★★★★☆☆☆☆☆".slice(5 - stars, 10 - stars)}
    </div>

    <p style={{ ...styles.helperText, margin: 0, lineHeight: 1.6 }}>{text}</p>
  </div>
);

const UpdateCard = ({ title, description, tag }) => (
  <div
    style={{
      border: "1px solid #e5e7eb",
      borderRadius: 14,
      padding: 14,
      background: "#ffffff",
      display: "grid",
      gap: 8,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <h3 style={{ margin: 0, fontSize: 16, color: "#111827" }}>{title}</h3>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          padding: "4px 8px",
          borderRadius: 999,
          background: "#e0e7ff",
          color: "#1e3a8a",
        }}
      >
        {tag}
      </span>
    </div>
    <p style={{ ...styles.helperText, margin: 0, lineHeight: 1.6 }}>{description}</p>
  </div>
);

const LandingPage = ({ onSignUp, onLogin, program, onProgramSelect }) => {
  const { t, i18n } = useTranslation();
  const [leadCaptureConfig, setLeadCaptureConfig] = useState({
    open: false,
    cta: "",
    nextUrl: "",
  });
  const leadCaptureTitle = useMemo(() => {
    if (leadCaptureConfig.cta === "Placement test") {
      return "Before you start the placement test";
    }
    if (leadCaptureConfig.cta === "Talk to us") {
      return "Talk to us";
    }
    return "Get started";
  }, [leadCaptureConfig.cta]);
  const leadCaptureSubtitle = useMemo(() => {
    if (leadCaptureConfig.cta === "Placement test") {
      return "Share your details so we can guide you after your results.";
    }
    return "Share a few details and our team will follow up with the best next step.";
  }, [leadCaptureConfig.cta]);
  const programOptions = useMemo(
    () => ({
      german: t("landing.programs.german", { returnObjects: true }),
      french: t("landing.programs.french", { returnObjects: true }),
    }),
    [t]
  );
  const resolvedInterfaceLanguage = i18n.resolvedLanguage || i18n.language;
  const interfaceLanguageOptions = useMemo(
    () => [
      { value: "en", label: t("interfaceLanguages.en") },
      { value: "de", label: t("interfaceLanguages.de") },
      { value: "fr", label: t("interfaceLanguages.fr") },
    ],
    [t]
  );
  const resolvedProgram = programOptions[program] ? program : "german";
  const selectedProgram = programOptions[resolvedProgram];
  const features = t("landing.features", { returnObjects: true });
  const quickLinks = t("landing.quickLinks", { returnObjects: true });
  const socialLinks = t("landing.socialLinks", { returnObjects: true });
  const signupSteps = t("landing.howItWorks.steps", {
    returnObjects: true,
    language: selectedProgram.shortLabel,
  });
  const updates = t("landing.updates.items", { returnObjects: true });
  const reviewItems = t("landing.reviews.items", { returnObjects: true });
  const featuredReviews = useMemo(() => shuffleArray(reviewItems).slice(0, 6), [reviewItems]);
  const heroBadges = t("landing.heroBadges", { returnObjects: true });
  const howItWorksBenefits = t("landing.howItWorks.benefits", { returnObjects: true });
  const programComparisonGermanPoints = t("landing.programComparison.germanPoints", { returnObjects: true });
  const programComparisonFrenchPoints = t("landing.programComparison.frenchPoints", { returnObjects: true });
  const whyStayPoints = t("landing.footer.stayPoints", { returnObjects: true });

  useEffect(() => {
    const title = t("landing.meta.title");
    const description = t("landing.meta.description");

    updatePageMeta({ title, description, lang: i18n.language });
  }, [i18n.language, t]);

  // Tip: for best performance, move these to web/public/photos and use "/photos/..."
  const photos = [
    {
      url: "https://github.com/learngermanghana/falowenexamtrainer/blob/main/photos/pexels-julia-m-cameron-4145153.jpg?raw=1",
      caption: t("landing.photos.0.caption"),
    },
    {
      url: "https://github.com/learngermanghana/falowenexamtrainer/blob/main/photos/pexels-mart-production-8473001.jpg?raw=1",
      caption: t("landing.photos.1.caption"),
    },
  ];

  const handleProgramSelect = (nextProgram) => {
    onProgramSelect?.(nextProgram);
  };

  const handleInterfaceLanguageChange = (language) => {
    i18n.changeLanguage(language);
    persistInterfaceLanguage(language);
  };

  const openLeadCapture = (cta, nextUrl = "") => {
    setLeadCaptureConfig({ open: true, cta, nextUrl });
  };

  const handleLeadSubmit = (payload) => {
    captureLead({
      ...payload,
      source: "landing_page",
      cta: leadCaptureConfig.cta,
    });
    if (leadCaptureConfig.nextUrl) {
      window.location.href = leadCaptureConfig.nextUrl;
    }
  };

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
              {t("landing.badge")}
            </p>

            <h1 style={{ ...styles.title, fontSize: 32, color: "#ffffff", margin: 0 }}>
              {t("landing.heroTitle")}
            </h1>

            <p style={{ ...styles.helperText, color: "#e0e7ff", margin: 0, lineHeight: 1.6 }}>
              {t("landing.heroSubtitle")}
            </p>

            {/* ✅ Keep main CTAs only here */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={styles.primaryButton} onClick={() => onSignUp(resolvedProgram)}>
                {t("landing.cta.join", { language: selectedProgram.shortLabel })}
              </button>
              <button type="button" style={styles.secondaryButton} onClick={onLogin}>
                {t("landing.cta.login")}
              </button>
              <a
                href="https://play.google.com/store/apps/details?id=com.falowen.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...styles.secondaryButton, textDecoration: "none" }}
              >
                {t("landing.cta.getApp")}
              </a>

              <a
                href="#how-it-works"
                style={{ color: "#e0e7ff", fontWeight: 700, textDecoration: "none", alignSelf: "center" }}
              >
                {t("landing.cta.seeHow")}
              </a>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
              {heroBadges.map((badge) => (
                <span key={badge} style={styles.badge}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </header>

        <section
          style={{
            ...styles.card,
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            alignItems: "center",
          }}
        >
          <div style={{ display: "grid", gap: 8 }}>
            <h2 style={styles.sectionTitle}>{t("landing.languageChooser.title")}</h2>
            <p style={{ ...styles.helperText, margin: 0 }}>{t("landing.languageChooser.subtitle")}</p>
            <p style={{ ...styles.helperText, margin: 0 }}>{t("landing.languageChooser.interfaceNote")}</p>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <div
              style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
              role="group"
              aria-label={t("landing.languageChooser.ariaLabel")}
            >
              <button
                type="button"
                onClick={() => handleProgramSelect("german")}
                aria-pressed={resolvedProgram === "german"}
                aria-label={t("landing.languageChooser.optionAria", { language: programOptions.german.shortLabel })}
                style={{
                  ...(resolvedProgram === "german" ? styles.primaryButton : styles.secondaryButton),
                  padding: "10px 14px",
                }}
              >
                {t("landing.languageChooser.studyGerman")}
              </button>
              <button
                type="button"
                onClick={() => handleProgramSelect("french")}
                aria-pressed={resolvedProgram === "french"}
                aria-label={t("landing.languageChooser.optionAria", { language: programOptions.french.shortLabel })}
                style={{
                  ...(resolvedProgram === "french" ? styles.primaryButton : styles.secondaryButton),
                  padding: "10px 14px",
                }}
              >
                {t("landing.languageChooser.studyFrench")}
              </button>
            </div>
            <div style={{ ...styles.helperText, margin: 0 }}>
              {t("landing.languageChooser.current", { language: selectedProgram.shortLabel })}
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 700 }}>{t("interfaceLanguage.label")}</div>
              <div
                style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                role="group"
                aria-label={t("interfaceLanguage.ariaLabel")}
              >
                {interfaceLanguageOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInterfaceLanguageChange(option.value)}
                    aria-pressed={resolvedInterfaceLanguage === option.value}
                    aria-label={t("interfaceLanguage.optionAria", { language: option.label })}
                    style={{
                      ...(resolvedInterfaceLanguage === option.value ? styles.primaryButton : styles.secondaryButton),
                      padding: "8px 12px",
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div style={{ ...styles.helperText, margin: 0 }}>{t("interfaceLanguage.helper")}</div>
            </div>
          </div>
        </section>

        <section
          style={{
            ...styles.card,
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            alignItems: "stretch",
          }}
          aria-labelledby="program-comparison-title"
        >
          <div style={{ display: "grid", gap: 8 }}>
            <h2 id="program-comparison-title" style={styles.sectionTitle}>
              {t("landing.programComparison.title")}
            </h2>
            <p style={{ ...styles.helperText, margin: 0 }}>{t("landing.programComparison.subtitle")}</p>
          </div>

          <div
            style={{ ...styles.card, marginBottom: 0, background: "#f8fafc" }}
            aria-label={t("landing.programComparison.germanTitle")}
          >
            <h3 style={{ margin: "0 0 6px 0" }}>{t("landing.programComparison.germanTitle")}</h3>
            <p style={{ ...styles.helperText, marginBottom: 10 }}>{programOptions.german.focus}</p>
            <ul style={styles.checklist}>
              {programComparisonGermanPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div
            style={{ ...styles.card, marginBottom: 0, background: "#f9fafb" }}
            aria-label={t("landing.programComparison.frenchTitle")}
          >
            <h3 style={{ margin: "0 0 6px 0" }}>{t("landing.programComparison.frenchTitle")}</h3>
            <p style={{ ...styles.helperText, marginBottom: 10 }}>{programOptions.french.focus}</p>
            <ul style={styles.checklist}>
              {programComparisonFrenchPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </section>

        <section
          style={{
            ...styles.card,
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            alignItems: "center",
            background: "linear-gradient(135deg, #ffffff, #f1f5f9)",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "grid", gap: 8 }}>
            <h2 style={{ ...styles.sectionTitle, marginBottom: 4 }}>
              If you don&apos;t know your level, take this placement test.
            </h2>
            <p style={{ ...styles.helperText, margin: 0 }}>
              It only takes a few minutes and gives you a suggested CEFR level before you sign up.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src="https://github.com/learngermanghana/falowenexamtrainer/blob/main/photos/pexels-lagosfoodbank-9090820.jpg?raw=1"
              alt="Student reviewing a placement test"
              style={{
                width: "100%",
                maxWidth: 360,
                borderRadius: 16,
                boxShadow: "0 12px 24px rgba(15, 23, 42, 0.15)",
                objectFit: "cover",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="/placement-test"
              style={{ ...styles.primaryButton, textDecoration: "none" }}
            >
              Open placement test
            </a>
            <a href="#how-it-works" style={{ ...styles.secondaryButton, textDecoration: "none" }}>
              See how it works
            </a>
          </div>
        </section>

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
            <h2 style={styles.sectionTitle}>{t("landing.path.title")}</h2>
            <p style={{ ...styles.helperText, margin: 0 }}>{t("landing.path.subtitle")}</p>
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
            <div style={{ fontWeight: 900, color: "#111827" }}>
              {t("landing.path.newLearner.title", { language: selectedProgram.shortLabel })}
            </div>
            <p style={{ ...styles.helperText, margin: 0 }}>
              {t("landing.path.newLearner.description", { language: selectedProgram.shortLabel })}
            </p>
            <button
              type="button"
              style={{ ...styles.primaryButton, padding: "10px 12px" }}
              onClick={() => onSignUp(resolvedProgram)}
            >
              {t("landing.path.newLearner.cta", { language: selectedProgram.shortLabel })}
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
            <div style={{ fontWeight: 900, color: "#111827" }}>{t("landing.path.examReady.title")}</div>
            <p style={{ ...styles.helperText, margin: 0 }}>{t("landing.path.examReady.description")}</p>
            <button type="button" style={{ ...styles.secondaryButton, padding: "10px 12px" }} onClick={onLogin}>
              {t("landing.path.examReady.cta")}
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
            <h2 style={styles.sectionTitle}>{t("landing.howItWorks.title")}</h2>
            <p style={{ ...styles.helperText, marginBottom: 0 }}>{t("landing.howItWorks.subtitle")}</p>

            {/* ✅ No repeated login/signup buttons here */}
            <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
              {howItWorksBenefits.map((benefit) => (
                <div key={benefit} style={{ ...styles.helperText, margin: 0 }}>
                  {benefit}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onSignUp(resolvedProgram)}
              style={{
                color: "#1d4ed8",
                fontWeight: 900,
                textDecoration: "none",
                marginTop: 8,
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {t("landing.howItWorks.cta", { language: selectedProgram.shortLabel })}
            </button>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {signupSteps.map((step, idx) => (
              <StepCard key={step.title} index={idx + 1} title={step.title} description={step.description} />
            ))}
          </div>
        </section>

        {/* Self-learning ad */}
        <section
          style={{
            ...styles.card,
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            alignItems: "center",
            background: "linear-gradient(135deg, #ffffff, #eef2ff)",
            border: "1px solid #e0e7ff",
          }}
        >
          <div style={{ display: "grid", gap: 10 }}>
            <h2 style={styles.sectionTitle}>{t("landing.selfLearning.title")}</h2>
            <p style={{ ...styles.helperText, margin: 0, lineHeight: 1.6 }}>{t("landing.selfLearning.description")}</p>
            <button type="button" style={{ ...styles.primaryButton, width: "fit-content" }} onClick={onLogin}>
              {t("landing.selfLearning.cta")}
            </button>
          </div>
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid #e5e7eb",
              boxShadow: "0 16px 32px rgba(15, 23, 42, 0.15)",
              background: "#fff",
            }}
          >
            <img
              src="https://github.com/learngermanghana/falowen-blog/blob/main/photos/b2c1_ad_final.jpg?raw=1"
              alt={t("landing.selfLearning.imageAlt")}
              loading="lazy"
              style={{ width: "100%", display: "block" }}
            />
          </div>
        </section>

        {/* Features */}
        <section style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {features.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
          ))}
        </section>

        {/* Updates */}
        <section style={{ ...styles.card, display: "grid", gap: 12 }}>
          <div>
            <h2 style={styles.sectionTitle}>{t("landing.updates.title")}</h2>
            <p style={{ ...styles.helperText, margin: 0 }}>{t("landing.updates.subtitle")}</p>
          </div>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {updates.map((item) => (
              <UpdateCard key={item.title} title={item.title} description={item.description} tag={item.tag} />
            ))}
          </div>
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

        {/* Student Reviews */}
        <section style={{ ...styles.card, display: "grid", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h2 style={styles.sectionTitle}>{t("landing.reviews.title")}</h2>
              <p style={{ ...styles.helperText, margin: 0 }}>{t("landing.reviews.subtitle")}</p>
            </div>
          </div>

          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {featuredReviews.map((r) => (
              <ReviewCard
                key={`${r.name}-${r.country}-${r.level}`}
                name={r.name}
                country={r.country}
                level={r.level}
                stars={r.stars}
                text={r.text}
                starLabel={t("landing.reviews.starRating", { count: r.stars })}
              />
            ))}
          </div>
        </section>

        {/* Dark CTA */}
        <section style={{ ...styles.card, background: "#111827", color: "#e5e7eb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 2, minWidth: 260 }}>
              <h2 style={{ ...styles.sectionTitle, color: "#fff" }}>{t("landing.darkCta.title")}</h2>
              <p style={{ ...styles.helperText, color: "#d1d5db", lineHeight: 1.65 }}>
                {t("landing.darkCta.subtitle")}
              </p>
            </div>

            <div style={{ display: "grid", gap: 10, flex: 1, minWidth: 240 }}>
              <div style={{ ...styles.uploadCard, background: "#0f172a", borderColor: "#1f2937" }}>
                <h3 style={{ ...styles.sectionTitle, color: "#fff", marginBottom: 6 }}>{t("landing.darkCta.ctaTitle")}</h3>
                <p style={{ ...styles.helperText, color: "#d1d5db", marginBottom: 10 }}>
                  {t("landing.darkCta.ctaSubtitle")}
                </p>

                {/* ✅ Keep one strong CTA here */}
                <div style={{ display: "grid", gap: 8 }}>
                  <button
                    type="button"
                    style={{ ...styles.primaryButton, padding: "10px 14px" }}
                    onClick={() => onSignUp(resolvedProgram)}
                  >
                    {t("landing.darkCta.ctaJoin", { language: selectedProgram.shortLabel })}
                  </button>

                  <button
                    type="button"
                    onClick={onLogin}
                    style={{
                      color: "#a5b4fc",
                      fontWeight: 900,
                      textDecoration: "none",
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {t("landing.darkCta.ctaLogin")}
                  </button>
                </div>
              </div>

              <div style={{ ...styles.uploadCard, background: "#0f172a", borderColor: "#1f2937" }}>
                <h4 style={{ ...styles.sectionTitle, color: "#fff", marginBottom: 8 }}>{t("landing.darkCta.contactTitle")}</h4>
                <ul style={{ ...styles.checklist, margin: 0, color: "#d1d5db", lineHeight: 1.6 }}>
                  <li>
                    <button
                      type="button"
                      onClick={() => openLeadCapture("Talk to us")}
                      style={{
                        ...styles.secondaryButton,
                        padding: "6px 10px",
                        fontSize: 12,
                        color: "#e2e8f0",
                        borderColor: "#64748b",
                        background: "transparent",
                      }}
                    >
                      Talk to us
                    </button>
                  </li>
                  <li>
                    {t("landing.darkCta.contactPhone")}
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
                    {t("landing.darkCta.contactEmail")}
                    <a
                      style={{ color: "#a5b4fc", marginLeft: 6, textDecoration: "none", fontWeight: 700 }}
                      href="mailto:learngermanghana@gmail.com"
                    >
                      learngermanghana@gmail.com
                    </a>
                  </li>
                  <li>{t("landing.darkCta.contactChat")}</li>
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
            <h3 style={styles.sectionTitle}>{t("landing.footer.quickLinksTitle")}</h3>
            <div style={{ display: "grid", gap: 8 }}>
              {quickLinks.map((l) => (
                <ResourceLink key={l.label} label={l.label} href={l.href} />
              ))}
            </div>
          </div>

          <div>
            <h3 style={styles.sectionTitle}>{t("landing.footer.followTitle")}</h3>
            <div style={{ display: "grid", gap: 8 }}>
              {socialLinks.map((l) => (
                <ResourceLink key={l.label} label={l.label} href={l.href} />
              ))}
            </div>
          </div>

          <div>
            <h3 style={styles.sectionTitle}>{t("landing.footer.stayTitle")}</h3>
            <ul style={{ ...styles.checklist, margin: 0, lineHeight: 1.6 }}>
              {whyStayPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
      <LeadCaptureModal
        isOpen={leadCaptureConfig.open}
        onClose={() => setLeadCaptureConfig({ open: false, cta: "", nextUrl: "" })}
        onSubmit={handleLeadSubmit}
        title={leadCaptureTitle}
        subtitle={leadCaptureSubtitle}
        submitLabel={leadCaptureConfig.cta === "Placement test" ? "Continue to test" : "Send details"}
        closeOnSubmit={Boolean(leadCaptureConfig.nextUrl)}
      />
    </main>
  );
};

export default LandingPage;
