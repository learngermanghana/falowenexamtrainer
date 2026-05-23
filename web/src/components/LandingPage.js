import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { persistInterfaceLanguage } from "../i18n";
import { updatePageMeta } from "../lib/pageMeta";
import LeadCaptureModal from "./LeadCaptureModal";
import { captureLead } from "../services/leadCaptureService";
import { fetchStudentReviewsFromPublishedSheet } from "../services/studentReviewsService";
import { classCatalog } from "../data/classCatalog";

const CLASS_BROCHURE_URL = "/classes/";

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

const formatDateLabel = (dateIso) => {
  if (!dateIso) return "Always open";
  const date = new Date(`${dateIso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return dateIso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

const formatTimeLabel = (time24) => {
  if (!time24) return "";
  const [hourValue, minuteValue] = time24.split(":").map(Number);
  if (!Number.isFinite(hourValue) || !Number.isFinite(minuteValue)) return time24;
  const suffix = hourValue >= 12 ? "pm" : "am";
  const hour = hourValue % 12 || 12;
  return `${hour}:${String(minuteValue).padStart(2, "0")} ${suffix}`;
};

const extractLevelFromClassName = (className) =>
  String(className || "").toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/)?.[1] || "";

const getScheduleLabel = (details) => {
  if (!Array.isArray(details.schedule) || !details.schedule.length) return "Self-learning";
  return details.schedule
    .map((slot) => `${slot.day} ${formatTimeLabel(slot.startTime)}${slot.endTime ? `–${formatTimeLabel(slot.endTime)}` : ""}`)
    .join(" · ");
};

const getUpcomingClassCards = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const normalized = Object.entries(classCatalog).map(([className, details]) => ({
    className,
    details,
    level: extractLevelFromClassName(className),
    startTimeMs: details.startDate ? new Date(`${details.startDate}T00:00:00`).getTime() : Number.POSITIVE_INFINITY,
  }));

  const liveUpcoming = normalized
    .filter(({ details, startTimeMs }) => !details.isSelfLearning && details.availability !== "always" && Number.isFinite(startTimeMs))
    .filter(({ startTimeMs }) => startTimeMs >= today.getTime())
    .sort((a, b) => a.startTimeMs - b.startTimeMs)
    .slice(0, 3);

  if (liveUpcoming.length) return liveUpcoming;

  return normalized
    .filter(({ details }) => details.isSelfLearning || details.availability === "always")
    .slice(0, 2);
};

const UpcomingClassCard = ({ className, details, level }) => (
  <div
    style={{
      border: "1px solid #dbeafe",
      background: "#ffffff",
      borderRadius: 16,
      padding: 14,
      display: "grid",
      gap: 8,
      boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
      <h3 style={{ margin: 0, fontSize: 17, color: "#111827" }}>{className}</h3>
      {level ? (
        <span style={{ ...styles.badge, background: "#dbeafe", color: "#1e40af" }}>{level}</span>
      ) : null}
    </div>
    <p style={{ ...styles.helperText, margin: 0 }}>
      <strong>Starts:</strong> {formatDateLabel(details.orientationDate || details.startDate)}
    </p>
    <p style={{ ...styles.helperText, margin: 0 }}>
      <strong>Meeting:</strong> {getScheduleLabel(details)}
    </p>
    <p style={{ ...styles.helperText, margin: 0 }}>
      Live or online access, Falowen app support, assignments, and class records in one place.
    </p>
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
  const reviewItems = t("landing.reviews.items", { returnObjects: true });
  const [sheetReview, setSheetReview] = useState(null);
  const featuredReview = useMemo(() => {
    if (sheetReview) return sheetReview;
    const fallbackItems = Array.isArray(reviewItems) ? reviewItems : [];
    if (!fallbackItems.length) return null;
    return shuffleArray(fallbackItems)[0] || null;
  }, [reviewItems, sheetReview]);
  const heroBadges = t("landing.heroBadges", { returnObjects: true });
  const howItWorksBenefits = t("landing.howItWorks.benefits", { returnObjects: true });
  const whyStayPoints = t("landing.footer.stayPoints", { returnObjects: true });
  const upcomingClassCards = useMemo(() => getUpcomingClassCards(), []);


  useEffect(() => {
    let mounted = true;
    const sheetUrl = process.env.REACT_APP_STUDENT_REVIEWS_SHEET_CSV_URL || "";

    if (!sheetUrl) {
      setSheetReview(null);
      return undefined;
    }

    const loadSheetReview = async () => {
      try {
        const rows = await fetchStudentReviewsFromPublishedSheet(sheetUrl);
        if (!mounted) return;
        if (!rows.length) {
          setSheetReview(null);
          return;
        }
        const randomReview = rows[Math.floor(Math.random() * rows.length)] || null;
        setSheetReview(randomReview);
      } catch (error) {
        console.error("Failed to load student reviews", error);
        if (!mounted) return;
        setSheetReview(null);
      }
    };

    loadSheetReview();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const title = t("landing.meta.title");
    const description = t("landing.meta.description");

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Falowen",
      url: "https://www.falowen.app/",
      logo: "https://www.falowen.app/logo512.png",
      sameAs: [
        "https://www.instagram.com/lleaghana",
        "https://www.youtube.com/@LLEAGhana",
        "https://web.facebook.com/lleaghana",
      ],
    };

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Falowen language learning tools and upcoming classes",
      serviceType: "Online language learning, live classes, and exam practice",
      provider: {
        "@type": "Organization",
        name: "Falowen",
      },
      areaServed: ["Ghana", "Nigeria"],
      url: "https://www.falowen.app/",
    };

    updatePageMeta({
      title,
      description,
      lang: i18n.language,
      canonicalPath: "/",
      ogType: "website",
      structuredData: [
        { id: "organization", schema: organizationSchema },
        { id: "service", schema: serviceSchema },
      ],
    });
  }, [i18n.language, t]);

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

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href={CLASS_BROCHURE_URL}
                style={{ ...styles.primaryButton, textDecoration: "none", background: "#fbbf24", color: "#111827" }}
              >
                View upcoming classes
              </a>
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
          id="upcoming-classes"
          style={{
            ...styles.card,
            display: "grid",
            gap: 16,
            border: "1px solid #bfdbfe",
            background: "linear-gradient(135deg, #eff6ff, #ffffff 58%, #fffbeb)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "end" }}>
            <div style={{ display: "grid", gap: 6, maxWidth: 680 }}>
              <p style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e40af", margin: 0 }}>
                Upcoming classes
              </p>
              <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Join the next Falowen German class</h2>
              <p style={{ ...styles.helperText, margin: 0, lineHeight: 1.6 }}>
                Send students one clean brochure with the start date, meeting times, generated schedule, and payment link.
                This is better for enquiries than sending many separate messages.
              </p>
            </div>
            <a href={CLASS_BROCHURE_URL} style={{ ...styles.primaryButton, textDecoration: "none", padding: "10px 14px" }}>
              Open class brochure
            </a>
          </div>

          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {upcomingClassCards.map((item) => (
              <UpcomingClassCard
                key={item.className}
                className={item.className}
                details={item.details}
                level={item.level}
              />
            ))}
          </div>
        </section>

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

        {/* Features */}
        <section style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {features.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
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

          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "minmax(240px, 560px)" }}>
            {featuredReview ? (
              <ReviewCard
                key={`${featuredReview.name}-${featuredReview.country}-${featuredReview.level}`}
                name={featuredReview.name}
                country={featuredReview.country}
                level={featuredReview.level}
                stars={featuredReview.stars}
                text={featuredReview.text}
                starLabel={t("landing.reviews.starRating", { count: featuredReview.stars })}
              />
            ) : null}
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

                <div style={{ display: "grid", gap: 8 }}>
                  <a
                    href={CLASS_BROCHURE_URL}
                    style={{ ...styles.primaryButton, padding: "10px 14px", textDecoration: "none", textAlign: "center" }}
                  >
                    View upcoming classes
                  </a>

                  <button
                    type="button"
                    style={{ ...styles.secondaryButton, padding: "10px 14px" }}
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
                      href="mailto:info@falowen.app"
                    >
                      info@falowen.app
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
