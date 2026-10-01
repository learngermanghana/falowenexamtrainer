import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import { updatePageMeta } from "../lib/pageMeta";
import { loadPublicClasses, slugifyPublicClass } from "../services/publicClassCatalogService";
import { resolveAdmissionsRef, trackAdmissionsEngagement } from "../services/admissionsEngagementService";
import academyProfile from "../data/publicAcademyProfile.json";

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
    <main style={{ ...styles.container, maxWidth: 1040, display: "grid", gap: 16, paddingBottom: 48 }}>
      <section style={{ ...card, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
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
      </section>

      <section style={{ ...card, border: "1px solid #bbf7d0", background: "#f0fdf4" }}>
        <div style={{ color: "#166534", fontWeight: 900, fontSize: 12, textTransform: "uppercase", letterSpacing: ".04em" }}>
          {selectedClass ? "Your selected class" : requestedSlug ? "Class information" : "Choose your next step"}
        </div>
        {loading ? (
          <p style={{ margin: 0 }}>Loading current class information…</p>
        ) : selectedClass ? (
          <>
            <h2 style={{ margin: 0 }}>{selectedClass.title}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
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

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
              onError={(event) => { event.currentTarget.closest("figure").style.display = "none"; }}
              style={{ width: "100%", height: "100%", minHeight: 220, maxHeight: 340, objectFit: "cover", borderRadius: 14, border: "1px solid #e2e8f0" }}
            />
            <figcaption style={{ color: "#64748b", fontSize: 12, fontWeight: 700 }}>
              LLEA classroom · Awoshie, Accra
            </figcaption>
          </figure>
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Why students study with us</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
          {[
            ["Flexible learning", "Learn in person, online or with recorded lessons where available."],
            ["Structured teaching", "Lessons use organised teaching material, grammar support and guided workbook practice."],
            ["Falowen access", "Use Falowen for lessons, assignments, progress tracking, results and learning support."],
            ["Exam preparation", "Course work develops reading, listening, writing and speaking skills for German-language examinations."],
            ["Tutor-marked work", "Teacher-marked assignments give students concrete scores and feedback during the course."],
            ["Progress visibility", "Students can follow attendance, results, learning progress and the next task in one system."],
          ].map(([title, body]) => (
            <article key={title} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
              <strong>{title}</strong>
              <p style={{ margin: "6px 0 0", lineHeight: 1.6, color: "#475569" }}>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>How your course works</h2>
        <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 10, lineHeight: 1.65 }}>
          <li><strong>Orientation:</strong> understand the course structure, Falowen and what is expected before normal lessons begin.</li>
          <li><strong>Classes + Falowen:</strong> attend lessons and use the course material, grammar support and practice in Falowen.</li>
          <li><strong>Assignments + feedback:</strong> complete required work, receive scores and use feedback to improve weak areas.</li>
          <li><strong>Completion + exam preparation:</strong> finish the course, review your progress and continue with focused examination preparation.</li>
        </ol>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>The people behind the school</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          <article style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 14 }}>
            <strong>Felix Asadu · Founder & Director</strong>
            <p style={{ margin: "8px 0 0", lineHeight: 1.65, color: "#475569" }}>
              Founder of Learn Language Education Academy and founder/software developer of Falowen. He studied International Management at IUB in Germany,
              holds a Goethe-Institut B2 German certificate and a TEFL certificate in Teaching English as a Foreign Language.
            </p>
          </article>
          <article style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 14 }}>
            <strong>Catherine Agbleze Etornam · Academic Assistant</strong>
            <p style={{ margin: "8px 0 0", lineHeight: 1.65, color: "#475569" }}>
              University of Ghana graduate in Philosophy with Political Science and holder of a Goethe A2 German certificate.
              She supports prospective and current students with enquiries, onboarding and academic guidance.
            </p>
          </article>
        </div>
      </section>

      <section style={{ ...card, background: "#f8fafc" }}>
        <h2 style={{ margin: 0 }}>Ready for the next step?</h2>
        <p style={{ margin: 0, lineHeight: 1.65 }}>You can review the class details again or continue directly to registration.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
