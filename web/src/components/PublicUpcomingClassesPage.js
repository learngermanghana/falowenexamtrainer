import React, { useEffect, useMemo } from "react";
import { styles } from "../styles";
import { updatePageMeta } from "../lib/pageMeta";
import { classCatalog } from "../data/classCatalog";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 10,
};

const formatDate = (isoDate) => {
  if (!isoDate) return "TBD";
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
};

const formatTime = (time24) => {
  if (!time24) return "";
  const [hourRaw, minuteRaw] = String(time24).split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return time24;
  const period = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalizedHour}:${String(minute).padStart(2, "0")} ${period}`;
};

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

  const scheduleRows = useMemo(() => {
    const today = new Date();
    const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

    return Object.entries(classCatalog)
      .map(([track, details]) => ({ track, ...details }))
      .filter((entry) => !entry.isSelfLearning)
      .filter((entry) => {
        if (!entry.startDate) return false;
        const start = new Date(`${entry.startDate}T00:00:00Z`).getTime();
        return Number.isFinite(start) && start >= todayUTC;
      })
      .sort((a, b) => new Date(`${a.startDate}T00:00:00Z`) - new Date(`${b.startDate}T00:00:00Z`))
      .slice(0, 8);
  }, []);

  return (
    <main style={{ ...styles.container, maxWidth: 980, display: "grid", gap: 14 }}>
      <section style={{ ...cardStyle, background: "#ecfeff", border: "1px solid #a5f3fc" }}>
        <h1 style={{ margin: 0 }}>Upcoming Falowen Classes</h1>
        <p style={{ margin: 0, color: "#1f2937", lineHeight: 1.7 }}>
          A public brochure page you can share with parents, students, and partners.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Meeting times</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "8px 4px" }}>Class Track</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "8px 4px" }}>Meeting Time (GMT)</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "8px 4px" }}>Next Start Date</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "8px 4px" }}>Class Schedule</th>
              </tr>
            </thead>
            <tbody>
              {scheduleRows.map((row) => {
                const meetingTime = (row.schedule || [])
                  .map((entry) => `${entry.day} ${formatTime(entry.startTime)}${entry.endTime ? ` - ${formatTime(entry.endTime)}` : ""}`)
                  .join(" · ");

                return (
                  <tr key={row.track}>
                    <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px 4px" }}>{row.track}</td>
                    <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px 4px" }}>{meetingTime || "TBD"}</td>
                    <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px 4px" }}>{formatDate(row.startDate)}</td>
                    <td style={{ borderBottom: "1px solid #f3f4f6", padding: "8px 4px" }}>
                      {row.docUrl ? (
                        <a href={row.docUrl} target="_blank" rel="noreferrer">View schedule</a>
                      ) : (
                        "TBD"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Register</h2>
        <p style={{ margin: 0 }}>
          Ready to join? Start with placement and registration.
        </p>
        <ul style={{ margin: 0, display: "grid", gap: 8 }}>
          <li><a href="/placement-test">Take placement test</a></li>
          <li><a href="/learn-german-ghana">Go to registration page</a></li>
        </ul>
      </section>
    </main>
  );
};

export default PublicUpcomingClassesPage;
