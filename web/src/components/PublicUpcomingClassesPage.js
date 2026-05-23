import React, { useEffect } from "react";
import { styles } from "../styles";
import { updatePageMeta } from "../lib/pageMeta";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 10,
};

const scheduleRows = [
  { track: "A1 Beginner", meetingTime: "Mondays & Wednesdays · 7:00 PM GMT", startDate: "June 3, 2026" },
  { track: "A2 Intermediate", meetingTime: "Tuesdays & Thursdays · 7:00 PM GMT", startDate: "June 4, 2026" },
  { track: "B1 Exam Prep", meetingTime: "Saturdays · 10:00 AM GMT", startDate: "June 6, 2026" },
];

const PublicUpcomingClassesPage = () => {
  useEffect(() => {
    const description =
      "Browse Falowen upcoming German classes, meeting times, schedule details, and registration links in one shareable page.";

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
  }, []);

  return (
    <main style={{ ...styles.container, maxWidth: 980, display: "grid", gap: 14 }}>
      <section style={{ ...cardStyle, background: "#ecfeff", border: "1px solid #a5f3fc" }}>
        <h1 style={{ margin: 0 }}>Upcoming Falowen Classes</h1>
        <p style={{ margin: 0, color: "#1f2937", lineHeight: 1.7 }}>
          A simple public brochure page you can share with parents, students, and partners.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Meeting times</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "8px 4px" }}>Class Track</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "8px 4px" }}>Meeting Time</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "8px 4px" }}>Next Start Date</th>
              </tr>
            </thead>
            <tbody>
              {scheduleRows.map((row) => (
                <tr key={row.track}>
                  <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px 4px" }}>{row.track}</td>
                  <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px 4px" }}>{row.meetingTime}</td>
                  <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px 4px" }}>{row.startDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Quick links</h2>
        <ul style={{ margin: 0, display: "grid", gap: 8 }}>
          <li>
            <a href="https://falowen.com/learn-german-ghana/falowen-guide" target="_blank" rel="noreferrer">
              Class overview and student guide
            </a>
          </li>
          <li>
            <a href="https://falowen.com/placement-test" target="_blank" rel="noreferrer">
              Class schedule and placement test
            </a>
          </li>
          <li>
            <a href="mailto:hello@falowen.com?subject=Register%20for%20Falowen%20German%20Class">
              Register now (email Falowen)
            </a>
          </li>
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
