import React, { useEffect, useState } from "react";
import { styles } from "../styles";
import { updatePageMeta } from "../lib/pageMeta";
import { loadPublicClasses } from "../services/publicClassCatalogService";

const cardStyle = { ...styles.card, display: "grid", gap: 10 };

function formatDate(value) {
  if (!value) return "Always open";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`));
}

function formatMeetingTimes(course) {
  if (course.availability === "always") return "Self-learning · start anytime";
  if (!course.meetingDays?.length) return "Schedule to be announced";
  return course.meetingDays
    .map((slot) => `${slot.day} · ${slot.startTime}${slot.endTime ? `–${slot.endTime}` : ""}`)
    .join(" · ");
}

const PublicUpcomingClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const description = "Browse Falowen upcoming German classes, meeting times, schedule details, and registration links in one shareable page.";
    updatePageMeta({
      title: "Upcoming German Classes | Falowen",
      description,
      canonicalPath: "/learn-german-ghana/upcoming-classes",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Course",
        name: "Falowen Upcoming German Classes",
        description,
        provider: { "@type": "Organization", name: "Falowen" },
      },
    });
    let active = true;
    loadPublicClasses()
      .then((rows) => { if (active) setClasses(rows); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <main style={{ ...styles.container, maxWidth: 980, display: "grid", gap: 14 }}>
      <section style={{ ...cardStyle, background: "#ecfeff", border: "1px solid #a5f3fc" }}>
        <h1 style={{ margin: 0 }}>Upcoming Falowen Classes</h1>
        <p style={{ margin: 0, color: "#1f2937", lineHeight: 1.7 }}>
          Classes created and updated in Falowen Admin appear here automatically.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Meeting times</h2>
        {loading ? <p>Loading current classes…</p> : classes.length ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={{ textAlign: "left", padding: "8px 4px" }}>Class</th><th style={{ textAlign: "left", padding: "8px 4px" }}>Meeting Time</th><th style={{ textAlign: "left", padding: "8px 4px" }}>Start Date</th></tr></thead>
              <tbody>
                {classes.map((course) => (
                  <tr key={course.id}>
                    <td style={{ borderTop: "1px solid #e5e7eb", padding: "8px 4px" }}><a href={`/classes/${course.slug}/`}>{course.title}</a></td>
                    <td style={{ borderTop: "1px solid #e5e7eb", padding: "8px 4px" }}>{formatMeetingTimes(course)}</td>
                    <td style={{ borderTop: "1px solid #e5e7eb", padding: "8px 4px" }}>{formatDate(course.startDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p>No upcoming class is open for registration right now.</p>}
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Quick links</h2>
        <ul style={{ margin: 0, display: "grid", gap: 8 }}>
          <li><a href="/classes/">View full class details and fees</a></li>
          <li><a href="/placement-test">Take the placement test</a></li>
          <li><a href="/signup/">Create your Falowen account</a></li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>What students get</h2>
        <ul style={{ margin: 0 }}>
          <li>Live classes with instructor-led speaking practice.</li>
          <li>Workbook and grammar support inside the Falowen app.</li>
          <li>Exam-focused training for Goethe pathways.</li>
        </ul>
      </section>
    </main>
  );
};

export default PublicUpcomingClassesPage;
