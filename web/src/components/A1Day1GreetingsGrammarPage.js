import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 12 };

const A1Day1GreetingsGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={cardStyle}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>
        <h1 style={{ ...styles.title, margin: 0 }}>A1 • Basic Greetings, Goodbyes, and How You Are</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Learn formal vs informal greetings, titles, goodbyes, and polite ways to ask how someone is doing.
        </p>
      </header>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>In-app grammar video</h2>
        <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden" }}>
          <iframe
            title="A1 Day 1 Greetings grammar lesson"
            src="https://www.youtube.com/embed/NmaHd9xsGvw"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>1) Formal and Informal Greetings</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>Formal:</strong> Guten Morgen, Guten Tag, Guten Abend.
          </li>
          <li>
            <strong>Informal:</strong> Hallo, Hi.
          </li>
          <li>
            Choose formal forms in professional/new situations and informal forms with friends or peers.
          </li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>2) Titles: Herr and Frau</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>Herr</strong> + last name (for men): Herr Müller.
          </li>
          <li>
            <strong>Frau</strong> + last name (for women): Frau Schmidt.
          </li>
          <li>When you don’t know the last name, you can still politely say: Entschuldigen Sie, Herr… / Frau…</li>
          <li>Or use general polite forms: Entschuldigen Sie, bitte. / Könnten Sie mir helfen?</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>3) Goodbyes</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>Auf Wiedersehen</strong> (formal goodbye)
          </li>
          <li>
            <strong>Tschüss</strong> (informal bye)
          </li>
          <li>
            <strong>Gute Nacht</strong> means <em>Good night</em> and is used when people are going to sleep or parting late at night.
          </li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>4) Asking “How are you?”</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>Wie geht’s?</strong> very casual short form.
          </li>
          <li>
            <strong>Wie geht es dir?</strong> informal (with <strong>du</strong>).
          </li>
          <li>
            <strong>Wie geht es Ihnen?</strong> formal (with <strong>Sie</strong>, capitalized).
          </li>
          <li>Do not mix up dir and Ihnen in one conversation.</li>
        </ul>
        <p style={{ margin: 0 }}>
          Common replies: <strong>Mir geht’s gut</strong>, <strong>Sehr gut</strong>, <strong>So lala</strong>, <strong>Nicht so gut</strong>.
        </p>
        <p style={{ margin: 0 }}>
          Add “and you?” with <strong>Und dir?</strong> (informal) or <strong>Und Ihnen?</strong> (formal).
        </p>
      </section>
    </main>
  );
};

export default A1Day1GreetingsGrammarPage;
