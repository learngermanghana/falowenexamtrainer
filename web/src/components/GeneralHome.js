import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const progressBar = {
  width: "100%",
  height: 10,
  borderRadius: 999,
  background: "rgba(255,255,255,0.25)",
  overflow: "hidden",
};

const GeneralHome = ({ onSelectArea }) => {
  const navigate = useNavigate();

  return (
    <div className="home-page" style={{ display: "grid", gap: 16 }}>
      <section className="welcome-banner" style={{ ...styles.card, marginBottom: 0 }}>
        <div>
          <p className="welcome-eyebrow">Welcome back</p>
          <h2 className="welcome-title">Felix Asadu, your campus is ready</h2>
          <p className="welcome-description">
            Personalised tips, attendance, and assignments for A1 Hamburg Klasse—jump straight into the
            space you need today.
          </p>
          <div className="welcome-actions">
            <button type="button" className="white-chip-button">Keep your streak alive</button>
            <button type="button" className="white-chip-button" onClick={() => navigate("/coursebook")}>Open class materials</button>
            <button type="button" className="white-chip-button warning">Not ready</button>
          </div>
        </div>

        <aside className="floating-progress-card">
          <p>Course Progress</p>
          <strong>66%</strong>
          <span>20 days left</span>
        </aside>
      </section>

      <section className="metrics-grid">
        <article className="metric-card blue-border">
          <p>Attendance</p>
          <h3>13 <span>sessions</span></h3>
          <small>13 hours total</small>
        </article>

        <article className="metric-card yellow-card yellow-border">
          <p>Next recommendation</p>
          <h3 className="small-title">Day 1: Chapter 0.1 — Greetings</h3>
          <small>You will learn to greet others in German and ask about people&apos;s well-being.</small>
        </article>

        <article className="metric-card gray-border">
          <p>Missed items</p>
          <h3>None</h3>
          <small>Missed items are only those before your last fully completed day.</small>
        </article>

        <article className="metric-card red-card red-border">
          <p>Failed Items</p>
          <h3>None</h3>
          <small>Revisit failed tasks to keep momentum.</small>
        </article>
      </section>

      <section className="weekly-progress" style={styles.card}>
        <div>
          <h3>This Week&apos;s Progress</h3>
          <p>1 assignments, 1 attempts, 0 retries, 0-day streak</p>
        </div>
        <button type="button" className="outline-button">↗ View leaderboard</button>
      </section>

      <section className="navigation-grid">
        <article className="nav-card">
          <div className="nav-card-hero indigo-gradient">
            <div className="bar-chart-icon" aria-hidden="true">
              <span style={{ height: "82%" }} />
              <span style={{ height: "56%" }} />
              <span style={{ height: "92%" }} />
              <span style={{ height: "68%" }} />
              <span style={{ height: "52%" }} />
            </div>
            <h3>Campus</h3>
            <p>Daily classes, assignments, and AI helpers</p>
          </div>

          <div className="nav-card-body">
            <div className="badge-row">
              <span className="badge badge-green">Start here</span>
              <span className="badge">Daily work</span>
            </div>
            <ul>
              <li>✓ Course book access, assignment submission, and results.</li>
              <li>✓ Grammar Q&amp;A, Speech Trainer, and original writing coach.</li>
              <li>✓ Group discussion and account settings.</li>
            </ul>
            <button type="button" className="solid-button" onClick={() => navigate("/coursebook")}>
              Enter Campus
            </button>
          </div>
        </article>

        <article className="nav-card">
          <div className="nav-card-hero blue-gradient">
            <div className="exam-icon-row" aria-hidden="true">
              <span>📄</span>
              <span>✅</span>
            </div>
            <h3>Exams Room</h3>
            <p>Mock speaking, writing, and exam resources</p>
          </div>

          <div className="nav-card-body">
            <div className="badge-row">
              <span className="badge badge-blue">Exam mode</span>
            </div>
            <ul>
              <li>✓ Speaking practice prompts organised by level.</li>
              <li>✓ Schreiben trainer with timed letters and idea generation.</li>
              <li>✓ Goethe Lesen/Hören links and quick exam-day reminders.</li>
            </ul>
            <button type="button" className="solid-button exams" onClick={() => onSelectArea("exams")}>
              Go to Exams Room
            </button>
          </div>
        </article>
      </section>

      <section className="live-class-card" style={styles.card}>
        <div className="live-header">
          <h3>Live class access</h3>
          <span className="badge badge-green">Zoom ready</span>
        </div>

        <div className="live-grid">
          <div>
            <h4>Your class</h4>
            <select style={styles.select} defaultValue="A1 Hamburg Klasse">
              <option>A1 Hamburg Klasse</option>
            </select>
            <p>Thursday: 18:00-19:00 · Friday: 18:00-19:00 · Saturday: 8:00-9:00</p>
          </div>

          <div>
            <h4>Zoom meeting</h4>
            <button type="button" className="outline-button full">🎥 Join Zoom Meeting</button>
            <p>Meeting ID: 688 690 0916 · Passcode: german</p>
            <h4>Course docs</h4>
            <a href="/coursebook">↗ Open class materials</a>
          </div>

          <div>
            <h4>Timeline</h4>
            <div className="timeline-card">
              <strong>20 days left</strong>
              <p>66% done</p>
              <div style={progressBar}><div className="progress-fill" /></div>
              <span>20 days until graduation</span>
            </div>
            <h4>CLASS DATES</h4>
            <p>Jan 30, 2026 — Mar 27, 2026</p>
          </div>
        </div>

        <div className="next-live-class">
          <div>
            <h4>🕒 Next live class</h4>
            <p>Thursday, Mar 12, 2026 · 18:00-19:00 (GMT, Ghana)</p>
          </div>
          <button type="button" className="outline-button">🗓 Add to calendar</button>
        </div>

        <button type="button" className="outline-button">⬇ Download calendar (.ics)</button>
      </section>

      <section style={styles.card}>
        <h3>Latest blog</h3>
        <article className="blog-card">
          <h4>New on Falowen: Placement Test for Learners Who Don&apos;t Know Their Level</h4>
          <a href="https://blog.falowen.app" target="_blank" rel="noreferrer">Read on blog</a>
        </article>
      </section>
    </div>
  );
};

export default GeneralHome;
