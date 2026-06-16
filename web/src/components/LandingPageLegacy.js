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
const PLACEMENT_TEST_URL = "/placement-test";
const REVIEW_SLIDE_MS = 4500;
const DEFAULT_STUDENT_REVIEWS_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5Nm-MLJkw3TeOht5ROELvFumVS9X8-ke_npLoOuF3W-zrF0v9xjk_Upzv4umQCocD5xtFaMRJQh6Z/pubhtml";

const asArray = (value) => (Array.isArray(value) ? value : []);

const truncateText = (text = "", maxLength = 150) => {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trim()}…`;
};

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

const HeroVisual = () => (
  <div
    aria-label="Falowen student dashboard preview"
    style={{
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: 22,
      padding: 16,
      minHeight: 230,
      display: "grid",
      alignContent: "center",
      gap: 12,
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
    }}
  >
    <div
      style={{
        background: "#ffffff",
        color: "#111827",
        borderRadius: 18,
        padding: 14,
        display: "grid",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div>
          <p style={{ ...styles.helperText, margin: 0 }}>Today in Falowen</p>
          <strong style={{ fontSize: 18 }}>A1 German practice</strong>
        </div>
        <span style={{ ...styles.badge, background: "#dcfce7", color: "#166534" }}>Live</span>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ border: "1px solid #dbeafe", borderRadius: 14, padding: 10, background: "#eff6ff" }}>
          <strong>📘 Course lesson</strong>
          <p style={{ ...styles.helperText, margin: "4px 0 0" }}>Watch, practise, and submit your workbook task.</p>
        </div>
        <div style={{ border: "1px solid #fef3c7", borderRadius: 14, padding: 10, background: "#fffbeb" }}>
          <strong>🗣️ Exam warm-up</strong>
          <p style={{ ...styles.helperText, margin: "4px 0 0" }}>Short speaking and writing tasks with tutor feedback.</p>
        </div>
        <div style={{ border: "1px solid #dcfce7", borderRadius: 14, padding: 10, background: "#f0fdf4" }}>
          <strong>✅ Progress tracking</strong>
          <p style={{ ...styles.helperText, margin: "4px 0 0" }}>Scores, attendance, and exam readiness in one place.</p>
        </div>
      </div>
    </div>
  </div>
);

const SignupJourneyVisual = () => {
  const steps = [
    { icon: "🧭", title: "Check your level", text: "Use the free placement test if you are not sure." },
    { icon: "🏫", title: "Choose your class", text: "Pick a cohort from the class brochure." },
    { icon: "📱", title: "Start learning", text: "Use Course Book, live class links, and assignments." },
    { icon: "✅", title: "Get feedback", text: "Tutor comments and progress tracking guide you." },
  ];

  return (
    <div
      style={{
        marginTop: 16,
        border: "1px solid #bfdbfe",
        borderRadius: 18,
        padding: 14,
        background: "linear-gradient(135deg, #eff6ff, #ffffff)",
        display: "grid",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <strong style={{ color: "#111827" }}>Your Falowen path</strong>
        <span style={{ ...styles.badge, background: "#dbeafe", color: "#1e40af" }}>Simple journey</span>
      </div>
      <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        {steps.map((step, index) => (
          <div
            key={step.title}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              padding: 10,
              background: "#ffffff",
              display: "grid",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span aria-hidden>{step.icon}</span>
              <strong style={{ fontSize: 13 }}>{index + 1}. {step.title}</strong>
            </div>
            <p style={{ ...styles.helperText, margin: 0, fontSize: 13 }}>{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

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
      minHeight: 132,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
      <div style={{ fontWeight: 900, color: "#111827" }}>{name}</div>
      <div style={{ fontSize: 13, color: "#111827", opacity: 0.85 }}>
        {[country, level].filter(Boolean).join(" · ")}
      </div>
    </div>

    <div aria-label={starLabel} style={{ letterSpacing: 1 }}>
      {"★★★★★☆☆☆☆☆".slice(5 - stars, 10 - stars)}
    </div>

    <p style={{ ...styles.helperText, margin: 0, lineHeight: 1.6 }}>{truncateText(text, 150)}</p>
  </div>
);

const PlacementPromptCard = () => (
  <section
    style={{
      ...styles.card,
      display: "grid",
      gap: 16,
      border: "1px solid #fde68a",
      background: "linear-gradient(135deg, #fffbeb, #ffffff 60%, #eff6ff)",
    }}
  >
    <div style={{ display: "grid", gap: 8 }}>
      <p style={{ ...styles.badge, width: "fit-content", background: "#fef3c7", color: "#92400e", margin: 0 }}>
        Free level check
      </p>
      <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Don’t know your level yet?</h2>
      <p style={{ ...styles.helperText, margin: 0, lineHeight: 1.6 }}>
        Try our free placement test first. After you finish, use your suggested level to choose the right class from the Falowen class brochure.
      </p>
    </div>
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <a href={PLACEMENT_TEST_URL} style={{ ...styles.primaryButton, textDecoration: "none" }}>
        Take free placement test
      </a>
      <a href={CLASS_BROCHURE_URL} style={{ ...styles.secondaryButton, textDecoration: "none" }}>
        Choose a class
      </a>
    </div>
  </section>
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
  const [sheetReviews, setSheetReviews] = useState([]);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const leadCaptureTitle = useMemo(() => {
    if (leadCaptureConfig.cta === "Placement test") return "Before you start the placement test";
    if (leadCaptureConfig.cta === "Talk to us") return "Talk to us";
    return "Get started";
  }, [leadCaptureConfig.cta]);

  const leadCaptureSubtitle = useMemo(() => {
    if (leadCaptureConfig.cta === "Placement test") return "Share your details so we can guide you after your results.";
    return "Share a few details and our team will follow up with the best next step.";
  }, [leadCaptureConfig.cta]);

  const programOptions = useMemo(
    () => ({
      german: t("landing.programs.german", { returnObjects: true }),
      french: t("landing.programs.french", { returnObjects: true }),
    }),
    [t]
  );
  const resolvedProgram = programOptions[program] ? program : "german";
  const selectedProgram = programOptions[resolvedProgram] || { shortLabel: "German" };
  const resolvedInterfaceLanguage = i18n.resolvedLanguage || i18n.language;
  const interfaceLanguageOptions = useMemo(
    () => [
      { value: "en", label: t("interfaceLanguages.en") },
      { value: "de", label: t("interfaceLanguages.de") },
      { value: "fr", label: t("interfaceLanguages.fr") },
    ],
    [t]
  );

  const features = asArray(t("landing.features", { returnObjects: true }));
  const quickLinks = asArray(t("landing.quickLinks", { returnObjects: true }));
  const socialLinks = asArray(t("landing.socialLinks", { returnObjects: true }));
  const signupSteps = asArray(t("landing.howItWorks.steps", { returnObjects: true, language: selectedProgram.shortLabel }));
  const reviewItems = asArray(t("landing.reviews.items", { returnObjects: true }));
  const fallbackReviews = useMemo(() => shuffleArray(reviewItems), [reviewItems]);
  const visibleReviews = sheetReviews.length ? sheetReviews : fallbackReviews;
  const featuredReview = visibleReviews.length ? visibleReviews[activeReviewIndex % visibleReviews.length] : null;
  const howItWorksBenefits = asArray(t("landing.howItWorks.benefits", { returnObjects: true }));
  const whyStayPoints = asArray(t("landing.footer.stayPoints", { returnObjects: true }));
  const upcomingClassCards = useMemo(() => getUpcomingClassCards(), []);

  useEffect(() => {
    let mounted = true;
    const sheetUrl = process.env.REACT_APP_STUDENT_REVIEWS_SHEET_CSV_URL || DEFAULT_STUDENT_REVIEWS_SHEET_URL;

    const loadSheetReviews = async () => {
      try {
        const rows = await fetchStudentReviewsFromPublishedSheet(sheetUrl);
        if (!mounted) return;
        setSheetReviews(Array.isArray(rows) ? rows : []);
        setActiveReviewIndex(0);
      } catch (error) {
        console.error("Failed to load student reviews", error);
        if (!mounted) return;
        setSheetReviews([]);
      }
    };

    loadSheetReviews();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (visibleReviews.length <= 1) return undefined;
    const intervalId = window.setInterval(() => {
      setActiveReviewIndex((current) => (current + 1) % visibleReviews.length);
    }, REVIEW_SLIDE_MS);
    return () => window.clearInterval(intervalId);
  }, [visibleReviews.length]);

  useEffect(() => {
    const title = t("landing.meta.title");
    const description = t("landing.meta.description");

    updatePageMeta({
      title,
      description,
      lang: i18n.language,
      canonicalPath: "/",
      ogType: "website",
      structuredData: [
        {
          id: "organization",
          schema: {
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
          },
        },
        {
          id: "service",
          schema: {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Falowen language learning tools and upcoming classes",
            serviceType: "Online language learning, live classes, and exam practice",
            provider: { "@type": "Organization", name: "Falowen" },
            areaServed: ["Ghana", "Nigeria"],
            url: "https://www.falowen.app/",
          },
        },
      ],
    });
  }, [i18n.language, t]);

  const handleProgramSelect = (nextProgram) => onProgramSelect?.(nextProgram);

  const handleInterfaceLanguageChange = (language) => {
    i18n.changeLanguage(language);
    persistInterfaceLanguage(language);
  };

  const openLeadCapture = (cta, nextUrl = "") => {
    setLeadCaptureConfig({ open: true, cta, nextUrl });
  };

  const handleLeadSubmit = (payload) => {
    captureLead({ ...payload, source: "landing_page", cta: leadCaptureConfig.cta });
    if (leadCaptureConfig.nextUrl) window.location.href = leadCaptureConfig.nextUrl;
  };

  return (
    <main
      style={{
        ...styles.container,
        background: "radial-gradient(circle at 10% 20%, #eef2ff 0, #f3f4f6 35%, #f3f4f6 100%)",
      }}
    >
      <div style={{ display: "grid", gap: 16, margin: "0 auto", maxWidth: 1100 }}>
        <header
          style={{
            ...styles.card,
            background: "linear-gradient(135deg, #1d4ed8, #1e3a8a)",
            color: "#ffffff",
            border: "1px solid #1d4ed8",
            boxShadow: "0 18px 36px rgba(37, 99, 235, 0.28)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ ...styles.badge, alignSelf: "flex-start", background: "#c7d2fe", color: "#1e3a8a" }}>
                {t("landing.badge")}
              </p>
              <h1 style={{ ...styles.title, fontSize: 32, color: "#ffffff", margin: 0 }}>{t("landing.heroTitle")}</h1>
              <p style={{ ...styles.helperText, color: "#e0e7ff", margin: 0, lineHeight: 1.6 }}>{t("landing.heroSubtitle")}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href={CLASS_BROCHURE_URL} style={{ ...styles.primaryButton, textDecoration: "none", background: "#fbbf24", color: "#111827" }}>
                  View upcoming classes
                </a>
                <button type="button" style={styles.primaryButton} onClick={() => onSignUp(resolvedProgram)}>
                  {t("landing.cta.join", { language: selectedProgram.shortLabel })}
                </button>
                <a href={PLACEMENT_TEST_URL} style={{ ...styles.secondaryButton, textDecoration: "none" }}>
                  Free placement test
                </a>
                <button type="button" style={styles.secondaryButton} onClick={onLogin}>
                  {t("landing.cta.login")}
                </button>
                <a href="https://play.google.com/store/apps/details?id=com.falowen.app" target="_blank" rel="noopener noreferrer" style={{ ...styles.secondaryButton, textDecoration: "none" }}>
                  {t("landing.cta.getApp")}
                </a>
              </div>
            </div>
            <HeroVisual />
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
              <p style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e40af", margin: 0 }}>Upcoming classes</p>
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
              <UpcomingClassCard key={item.className} className={item.className} details={item.details} level={item.level} />
            ))}
          </div>
        </section>

        <PlacementPromptCard />

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
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }} role="group" aria-label={t("landing.languageChooser.ariaLabel")}>
              <button type="button" onClick={() => handleProgramSelect("german")} aria-pressed={resolvedProgram === "german"} style={{ ...(resolvedProgram === "german" ? styles.primaryButton : styles.secondaryButton), padding: "10px 14px" }}>
                {t("landing.languageChooser.studyGerman")}
              </button>
              <button type="button" onClick={() => handleProgramSelect("french")} aria-pressed={resolvedProgram === "french"} style={{ ...(resolvedProgram === "french" ? styles.primaryButton : styles.secondaryButton), padding: "10px 14px" }}>
                {t("landing.languageChooser.studyFrench")}
              </button>
            </div>
            <div style={{ ...styles.helperText, margin: 0 }}>{t("landing.languageChooser.current", { language: selectedProgram.shortLabel })}</div>
            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 700 }}>{t("interfaceLanguage.label")}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} role="group" aria-label={t("interfaceLanguage.ariaLabel")}>
                {interfaceLanguageOptions.map((option) => (
                  <button key={option.value} type="button" onClick={() => handleInterfaceLanguageChange(option.value)} aria-pressed={resolvedInterfaceLanguage === option.value} style={{ ...(resolvedInterfaceLanguage === option.value ? styles.primaryButton : styles.secondaryButton), padding: "8px 12px" }}>
                    {option.label}
                  </button>
                ))}
              </div>
              <div style={{ ...styles.helperText, margin: 0 }}>{t("interfaceLanguage.helper")}</div>
            </div>
          </div>
        </section>

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
                <div key={benefit} style={{ ...styles.helperText, margin: 0 }}>{benefit}</div>
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
            <SignupJourneyVisual />
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {signupSteps.map((step, idx) => (
              <StepCard key={step.title} index={idx + 1} title={step.title} description={step.description} />
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {features.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
          ))}
        </section>

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
                key={`${featuredReview.id || featuredReview.name}-${activeReviewIndex}`}
                name={featuredReview.name}
                country={featuredReview.country}
                level={featuredReview.level}
                stars={featuredReview.stars}
                text={featuredReview.text}
                starLabel={t("landing.reviews.starRating", { count: featuredReview.stars })}
              />
            ) : null}
            {visibleReviews.length > 1 ? (
              <div style={{ display: "flex", gap: 6, alignItems: "center" }} aria-label="Review slider indicators">
                {visibleReviews.slice(0, 6).map((review, index) => (
                  <button
                    key={review.id || `${review.name}-${index}`}
                    type="button"
                    aria-label={`Show review ${index + 1}`}
                    onClick={() => setActiveReviewIndex(index)}
                    style={{
                      width: activeReviewIndex % visibleReviews.length === index ? 22 : 8,
                      height: 8,
                      borderRadius: 999,
                      border: "none",
                      background: activeReviewIndex % visibleReviews.length === index ? "#2563eb" : "#d1d5db",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section style={{ ...styles.card, background: "#111827", color: "#e5e7eb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 2, minWidth: 260 }}>
              <h2 style={{ ...styles.sectionTitle, color: "#fff" }}>{t("landing.darkCta.title")}</h2>
              <p style={{ ...styles.helperText, color: "#d1d5db", lineHeight: 1.65 }}>{t("landing.darkCta.subtitle")}</p>
            </div>
            <div style={{ display: "grid", gap: 10, flex: 1, minWidth: 240 }}>
              <div style={{ ...styles.uploadCard, background: "#0f172a", borderColor: "#1f2937" }}>
                <h3 style={{ ...styles.sectionTitle, color: "#fff", marginBottom: 6 }}>{t("landing.darkCta.ctaTitle")}</h3>
                <p style={{ ...styles.helperText, color: "#d1d5db", marginBottom: 10 }}>{t("landing.darkCta.ctaSubtitle")}</p>
                <div style={{ display: "grid", gap: 8 }}>
                  <a href={CLASS_BROCHURE_URL} style={{ ...styles.primaryButton, padding: "10px 14px", textDecoration: "none", textAlign: "center" }}>View upcoming classes</a>
                  <a href={PLACEMENT_TEST_URL} style={{ ...styles.secondaryButton, padding: "10px 14px", textDecoration: "none", textAlign: "center" }}>Take placement test</a>
                  <button type="button" style={{ ...styles.secondaryButton, padding: "10px 14px" }} onClick={() => onSignUp(resolvedProgram)}>
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
                    <button type="button" onClick={() => openLeadCapture("Talk to us")} style={{ ...styles.secondaryButton, padding: "6px 10px", fontSize: 12, color: "#e2e8f0", borderColor: "#64748b", background: "transparent" }}>
                      Talk to us
                    </button>
                  </li>
                  <li>
                    {t("landing.darkCta.contactPhone")}
                    <a style={{ color: "#a5b4fc", marginLeft: 6, textDecoration: "none", fontWeight: 700 }} href="https://wa.me/233205706589" target="_blank" rel="noopener noreferrer">+233 20 570 6589</a>
                  </li>
                  <li>
                    {t("landing.darkCta.contactEmail")}
                    <a style={{ color: "#a5b4fc", marginLeft: 6, textDecoration: "none", fontWeight: 700 }} href="mailto:info@falowen.app">info@falowen.app</a>
                  </li>
                  <li>{t("landing.darkCta.contactChat")}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <footer style={{ ...styles.card, display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div>
            <h3 style={styles.sectionTitle}>{t("landing.footer.quickLinksTitle")}</h3>
            <div style={{ display: "grid", gap: 8 }}>
              {quickLinks.map((l) => <ResourceLink key={l.label} label={l.label} href={l.href} />)}
            </div>
          </div>
          <div>
            <h3 style={styles.sectionTitle}>{t("landing.footer.followTitle")}</h3>
            <div style={{ display: "grid", gap: 8 }}>
              {socialLinks.map((l) => <ResourceLink key={l.label} label={l.label} href={l.href} />)}
            </div>
          </div>
          <div>
            <h3 style={styles.sectionTitle}>{t("landing.footer.stayTitle")}</h3>
            <ul style={{ ...styles.checklist, margin: 0, lineHeight: 1.6 }}>
              {whyStayPoints.map((point) => <li key={point}>{point}</li>)}
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
