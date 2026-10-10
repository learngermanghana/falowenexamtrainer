import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import "./PublicAdmissionsVisitorGuidePage.css";
import { updatePageMeta } from "../lib/pageMeta";
import { loadPublicClasses, slugifyPublicClass } from "../services/publicClassCatalogService";
import { resolveAdmissionsRef, trackAdmissionsEngagement } from "../services/admissionsEngagementService";
import academyProfile from "../data/publicAcademyProfile.json";
import { PUBLIC_MARKETING_FEATURES } from "../data/publicMarketingFeatures";

const card = { ...styles.card, display: "grid", gap: 12, borderRadius: 16 };
const action = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 46,
  padding: "10px 16px",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: 800,
  border: "1px solid #1d4ed8",
};

function formatDate(value) {
  if (!value) return "To be announced";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${String(value).slice(0, 10)}T00:00:00Z`));
}

function formatFee(course) {
  const amount = Number(course?.tuitionGhs || 0);
  return amount > 0 ? `GHS ${amount.toLocaleString("en-GH")}` : "Fee to be confirmed";
}

function formatSchedule(course) {
  if (course?.availability === "always") return "Self-learning · start anytime";
  const rows = Array.isArray(course?.meetingDays) ? course.meetingDays : [];
  if (!rows.length) return "Schedule to be announced";
  return rows.map((slot) => `${slot.day} ${slot.startTime || ""}${slot.endTime ? `–${slot.endTime}` : ""}`).join(" · ");
}

function formatLearningMode(course) {
  if (course?.availability === "always" || course?.isSelfLearning) {
    return "Self-learning in Falowen with flexible study and available tutor support.";
  }
  return "In person in Awoshie, live online, or recorded lesson catch-up when you cannot attend live.";
}

function formatAdmissionsUpdated(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

const publicLinkCopy = {
  blog: { label: "Falowen Blog", description: "German-learning articles and study resources." },
  linkedin: { label: "LinkedIn", description: "School updates and professional background." },
  youtube: { label: "LLEA YouTube", description: "Teacher explanations and German-learning videos." },
  contractAgreement: { label: "Contract agreement", description: "Open the registration and contract agreement page." },
};

const PublicAdmissionsVisitorGuidePage = () => {
  const search = typeof window === "undefined" ? "" : window.location.search;
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const requestedSlug = slugifyPublicClass(params.get("class") || "");
  const engagementRef = useMemo(() => resolveAdmissionsRef(search), [search]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const trackedOpen = useRef(false);

  const selectedClass = useMemo(
    () => classes.find((course) => slugifyPublicClass(course.slug || course.title) === requestedSlug) || null,
    [classes, requestedSlug],
  );

  useEffect(() => {
    const description = "Learn about Learn Language Education Academy, how Falowen supports students, and the class selected for your German-learning enquiry.";
    updatePageMeta({
      title: "About the School & How Falowen Works | Falowen",
      description,
      canonicalPath: "/visitor-guide",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: academyProfile.academyName,
        url: "https://www.falowen.app/visitor-guide",
        description,
      },
    });

    let active = true;
    loadPublicClasses()
      .then((rows) => { if (active) setClasses(rows || []); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (trackedOpen.current || loading) return;
    trackedOpen.current = true;
    trackAdmissionsEngagement({
      ref: engagementRef,
      event: "visitor_guide_open",
      classSlug: selectedClass?.slug || requestedSlug,
      source: "visitor-guide",
      path: window.location.pathname,
    });
  }, [engagementRef, loading, requestedSlug, selectedClass]);

  const classSlug = selectedClass?.slug || requestedSlug;
  const brochureHref = classSlug
    ? `/classes/?class=${encodeURIComponent(classSlug)}&open=1&ref=${encodeURIComponent(engagementRef)}&source=visitor-guide`
    : "/classes/";
  const signupHref = `/signup?program=german${classSlug ? `&class=${encodeURIComponent(classSlug)}` : ""}&ref=${encodeURIComponent(engagementRef)}&source=visitor-guide`;

  const trackClick = (event) => {
    trackAdmissionsEngagement({
      ref: engagementRef,
      event,
      classSlug,
      source: "visitor-guide",
      path: window.location.pathname,
    });
  };

  return (
    <main className="visitor-guide-page" style={{ ...styles.container, maxWidth: 1040, display: "grid", gap: 16, paddingBottom: 48 }}>
      <section className="visitor-guide-hero" style={{ ...card, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <div style={{ color: "#1d4ed8", fontWeight: 900, letterSpacing: ".04em", textTransform: "uppercase", fontSize: 12 }}>
          Admissions · School background
        </div>
        <h1 style={{ margin: 0 }}>{academyProfile.academyName}</h1>
        <p style={{ margin: 0, lineHeight: 1.75, color: "#334155" }}>
          {academyProfile.academyName} combines structured German teaching with Falowen, our digital learning platform.{" "}
          Students receive guided lessons, tutor-marked work, progress tracking and preparation for German-language examinations.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", color: "#334155", fontWeight: 700 }}>
          <span>Established {academyProfile.establishedYear}</span><span>·</span><span>German {academyProfile.germanLevels}</span><span>·</span><span>{academyProfile.examPassHeadline}</span>
        </div>
        {academyProfile.admissionsUpdatedAt ? (
          <div style={{ color: "#64748b", fontSize: 12 }}>
            Fees and admissions information updated {formatAdmissionsUpdated(academyProfile.admissionsUpdatedAt)}.
          </div>
        ) : null}
      </section>

      <section className="visitor-guide-class-card" style={{ ...card, border: "1px solid #bbf7d0", background: "#f0fdf4" }}>
        <div style={{ color: "#166534", fontWeight: 900, fontSize: 12, textTransform: "uppercase", letterSpacing: ".04em" }}>
          {selectedClass ? "Your selected class" : requestedSlug ? "Class information" : "Choose your next step"}
        </div>
        {loading ? (
          <p style={{ margin: 0 }}>Loading current class information…</p>
        ) : selectedClass ? (
          <>
            <h2 style={{ margin: 0 }}>{selectedClass.title}</h2>
            <div className="visitor-guide-class-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
              <div><strong>Start date</strong><div>{formatDate(selectedClass.startDate)}</div></div>
              <div><strong>Course fee</strong><div>{formatFee(selectedClass)}</div></div>
              <div><strong>Learning mode</strong><div>{formatLearningMode(selectedClass)}</div></div>
            </div>
            <div><strong>Schedule</strong><div style={{ marginTop: 4 }}>{formatSchedule(selectedClass)}</div></div>
          </>
        ) : requestedSlug ? (
          <>
            <h2 style={{ margin: 0 }}>This class is no longer in the open catalogue</h2>
            <p style={{ margin: 0, lineHeight: 1.65 }}>
              You can still read about the school below, view currently available classes, or register and ask us to help you choose the right option.
            </p>
          </>
        ) : (
          <>
            <h2 style={{ margin: 0 }}>German learning with Falowen</h2>
            <p style={{ margin: 0 }}>Review the school information below, then browse available classes or register.</p>
          </>
        )}

        <div className="visitor-guide-actions" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a
            href={brochureHref}
            onClick={() => trackClick("brochure_open")}
            style={{ ...action, background: "#fff", color: "#1d4ed8" }}
          >
            {selectedClass ? "View class brochure" : "View available classes"}
          </a>
          <a
            href={signupHref}
            onClick={() => trackClick("registration_click")}
            style={{ ...action, background: "#1d4ed8", color: "#fff" }}
          >
            Register now
          </a>
        </div>
        <a
          className="visitor-guide-all-classes-link"
          href="/classes/"
          onClick={() => trackClick("all_classes_open")}
        >
          View all classes
        </a>
      </section>

      <section style={{ ...card, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, alignItems: "stretch" }}>
          <div style={{ display: "grid", gap: 10, alignContent: "center" }}>
            <div style={{ color: "#1d4ed8", fontWeight: 900, fontSize: 12, textTransform: "uppercase", letterSpacing: ".04em" }}>Visit LLEA</div>
            <h2 style={{ margin: 0 }}>Find the classroom without calling for directions</h2>
            <p style={{ margin: 0, lineHeight: 1.65, color: "#475569" }}>
              In-person classes are held at our Awoshie learning space. Use the exact Google Maps location below for directions.
            </p>
            <strong>{academyProfile.locationLabel}</strong>
            <a href={academyProfile.mapsUrl} target="_blank" rel="noreferrer" style={{ ...action, width: "fit-content", background: "#fff", color: "#1d4ed8" }}>
              Open exact location in Google Maps
            </a>
          </div>
          <figure style={{ margin: 0, display: "grid", gap: 7 }}>
            <img
              src={academyProfile.classroomImage}
              alt="Learn Language Education Academy classroom in Awoshie"
              loading="lazy"
              decoding="async"
              onError={(event) => { event.currentTarget.closest("figure").style.display = "none"; }}
              style={{ width: "100%", height: "100%", minHeight: 220, maxHeight: 340, objectFit: "cover", borderRadius: 14, border: "1px solid #e2e8f0" }}
            />
            <figcaption style={{ color: "#64748b", fontSize: 12, fontWeight: 700 }}>
              LLEA classroom · Awoshie, Accra
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="visitor-guide-marketing" aria-labelledby="visitor-guide-marketing-title">
        <div className="visitor-guide-marketing-heading">
          <span>GERMAN LEARNING THAT FITS YOUR LIFE</span>
          <h2 id="visitor-guide-marketing-title">Four ways to get started with Falowen</h2>
          <p>Find your level, prepare for Goethe-style exams, join a live class or learn at your own pace — with AI and tutor support.</p>
        </div>
        <div className="visitor-guide-marketing-grid">
          {PUBLIC_MARKETING_FEATURES.map((feature) => (
            <article key={feature.key} className="visitor-guide-marketing-card">
              <span className="visitor-guide-marketing-icon" aria-hidden="true">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className="visitor-guide-marketing-actions">
                <a href={feature.key === "self"
                  ? "/signup?program=german&ref=" + encodeURIComponent(engagementRef) + "&source=visitor-guide"
                  : feature.href}
                  onClick={feature.key === "self" ? () => trackClick("registration_click") : undefined}
                >{feature.action} →</a>
                {feature.scheduleHref ? (
                  <a className="visitor-guide-marketing-schedule" href={feature.scheduleHref}>
                    <span aria-hidden="true">🗓</span> {feature.scheduleAction} →
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>The people behind the school</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          {(academyProfile.team || []).map((member) => (
            <article
              key={member.name}
              style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 14, display: "grid", gap: 10, alignContent: "start" }}
            >
              {member.image ? (
                <img
                  src={member.image}
                  alt={`${member.name} · ${member.role}`}
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: 10, background: "#f1f5f9" }}
                />
              ) : null}
              <div>
                <strong>{member.name}</strong>
                {member.relationship ? (
                  <div style={{ marginTop: 5, width: "fit-content", borderRadius: 999, padding: "3px 7px", background: "#f1f5f9", color: "#475569", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".04em" }}>
                    {member.relationship}
                  </div>
                ) : null}
                <div style={{ marginTop: 4, color: "#1d4ed8", fontWeight: 800, fontSize: 13 }}>{member.role}</div>
              </div>
              <p style={{ margin: 0, lineHeight: 1.65, color: "#475569" }}>{member.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Teaching in practice</h2>
        <p style={{ margin: 0, lineHeight: 1.65, color: "#475569" }}>
          A look at live online teaching and guided German instruction at LLEA.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          {(academyProfile.teachingGallery || []).map((item) => (
            <figure key={item.title} style={{ margin: 0, display: "grid", gap: 7 }}>
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", borderRadius: 12, border: "1px solid #e2e8f0" }}
              />
              <figcaption style={{ color: "#475569", fontSize: 13, lineHeight: 1.5 }}>
                <strong style={{ color: "#0f172a" }}>{item.title}</strong> · {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Useful links</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {Object.entries(publicLinkCopy).map(([key, meta]) => {
            const href = academyProfile.links?.[key];
            if (!href) return null;
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer"
                title={meta.description}
                style={{ ...action, minHeight: 40, padding: "8px 12px", background: "#fff", color: "#1d4ed8", fontSize: 13 }}
              >
                {meta.label}
              </a>
            );
          })}
        </div>
      </section>

      <section className="visitor-guide-final-card" style={{ ...card, background: "#f8fafc" }}>
        <h2 style={{ margin: 0 }}>Ready for the next step?</h2>
        <p style={{ margin: 0, lineHeight: 1.65 }}>You can review the class details again or continue directly to registration.</p>
        <div className="visitor-guide-actions" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href={brochureHref} onClick={() => trackClick("brochure_open")} style={{ ...action, background: "#fff", color: "#1d4ed8" }}>
            View class brochure
          </a>
          <a href={signupHref} onClick={() => trackClick("registration_click")} style={{ ...action, background: "#1d4ed8", color: "#fff" }}>
            Register for this class
          </a>
        </div>
      </section>
    </main>
  );
};

export default PublicAdmissionsVisitorGuidePage;
