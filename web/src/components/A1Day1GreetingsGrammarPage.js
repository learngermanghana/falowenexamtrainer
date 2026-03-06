import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "1.1rem",
  fontWeight: 700,
};

const splitGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 12,
};

const formalCardStyle = {
  padding: 14,
  borderRadius: 12,
  background: "#eff6ff",
  border: "1px solid #93c5fd",
  display: "grid",
  gap: 8,
};

const informalCardStyle = {
  padding: 14,
  borderRadius: 12,
  background: "#f0fdf4",
  border: "1px solid #86efac",
  display: "grid",
  gap: 8,
};

const infoCardStyle = {
  padding: 12,
  borderRadius: 12,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const practiceBoxStyle = {
  padding: 14,
  borderRadius: 12,
  background: "#fff7ed",
  border: "1px solid #fdba74",
  display: "grid",
  gap: 8,
};

const pronunciationStyle = {
  padding: 12,
  borderRadius: 12,
  background: "#fefce8",
  border: "1px solid #fde68a",
  display: "grid",
  gap: 6,
};

const exampleStyle = {
  padding: 12,
  borderRadius: 12,
  background: "#faf5ff",
  border: "1px solid #d8b4fe",
  display: "grid",
  gap: 6,
};

const badgeStyle = {
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
};

const A1Day1GreetingsGrammarPage = () => {
  const navigate = useNavigate();
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 640 : false;

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={cardStyle}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <div style={{ borderRadius: 14, overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
            alt="People greeting each other"
            style={{
              width: "100%",
              height: isMobile ? 160 : 240,
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        <h1 style={{ ...styles.title, margin: 0 }}>
          A1 • Basic Greetings, Goodbyes, and How You Are
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Learn simple German greetings, polite titles, goodbyes, and how to
          ask and answer “How are you?”
        </p>
      </header>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>1. Formal and Informal Greetings</h2>
        <p style={{ margin: 0 }}>
          In German, greetings change depending on the situation and the person
          you are talking to.
        </p>

        <div style={splitGridStyle}>
          <div style={formalCardStyle}>
            <span
              style={{ ...badgeStyle, background: "#dbeafe", color: "#1d4ed8" }}
            >
              Formal
            </span>
            <div>
              <strong>Guten Morgen</strong> – Good morning
            </div>
            <div>
              <strong>Guten Tag</strong> – Good day
            </div>
            <div>
              <strong>Guten Abend</strong> – Good evening
            </div>
            <p style={{ margin: 0, fontSize: 14 }}>
              Use these in polite, professional, or first-time situations.
            </p>
          </div>

          <div style={informalCardStyle}>
            <span
              style={{ ...badgeStyle, background: "#dcfce7", color: "#15803d" }}
            >
              Informal
            </span>
            <div>
              <strong>Hallo</strong> – Hello
            </div>
            <div>
              <strong>Hi</strong> – Hi
            </div>
            <p style={{ margin: 0, fontSize: 14 }}>
              Use these with friends, family, classmates, and peers.
            </p>
          </div>
        </div>

        <div style={exampleStyle}>
          <strong>Examples</strong>
          <div>Guten Tag, Frau Müller!</div>
          <div>Hallo, Anna!</div>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>2. Titles: Herr and Frau</h2>
        <p style={{ margin: 0 }}>
          In German, titles help you speak politely in formal situations.
        </p>

        <div style={splitGridStyle}>
          <div style={formalCardStyle}>
            <span
              style={{ ...badgeStyle, background: "#dbeafe", color: "#1d4ed8" }}
            >
              Title
            </span>
            <div>
              <strong>Herr</strong> + last name
            </div>
            <div>
              Example: <strong>Herr Müller</strong>
            </div>
          </div>

          <div style={formalCardStyle}>
            <span
              style={{ ...badgeStyle, background: "#dbeafe", color: "#1d4ed8" }}
            >
              Title
            </span>
            <div>
              <strong>Frau</strong> + last name
            </div>
            <div>
              Example: <strong>Frau Schmidt</strong>
            </div>
          </div>
        </div>

        <div style={infoCardStyle}>
          <h3 style={{ margin: "0 0 8px 0" }}>When you don’t know the last name</h3>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>
              <strong>Entschuldigen Sie, Herr...</strong>
            </li>
            <li>
              <strong>Entschuldigen Sie, Frau...</strong>
            </li>
            <li>
              <strong>Entschuldigen Sie, bitte...</strong>
            </li>
          </ul>
        </div>

        <div style={practiceBoxStyle}>
          <strong>Practice</strong>
          <div>Müller → Herr or Frau?</div>
          <div>Schmidt → Herr or Frau?</div>
          <div>Schneider → Herr or Frau?</div>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>3. Goodbyes</h2>

        <div style={splitGridStyle}>
          <div style={formalCardStyle}>
            <span
              style={{ ...badgeStyle, background: "#dbeafe", color: "#1d4ed8" }}
            >
              Formal
            </span>
            <div>
              <strong>Auf Wiedersehen</strong>
            </div>
            <div>Goodbye</div>
          </div>

          <div style={informalCardStyle}>
            <span
              style={{ ...badgeStyle, background: "#dcfce7", color: "#15803d" }}
            >
              Informal
            </span>
            <div>
              <strong>Tschüss</strong>
            </div>
            <div>Bye</div>
          </div>
        </div>

        <div style={pronunciationStyle}>
          <strong>Pronunciation</strong>
          <div>
            <strong>Auf Wiedersehen</strong> → owf vee-der-zay-en
          </div>
          <div>
            <strong>Tschüss</strong> → chuss
          </div>
        </div>

        <div style={exampleStyle}>
          <strong>Examples</strong>
          <div>Auf Wiedersehen, Herr Müller.</div>
          <div>Tschüss, Anna!</div>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>4. Asking “How are you?”</h2>

        <div style={infoCardStyle}>
          <p style={{ margin: 0 }}>
            <strong>Wie</strong> means <strong>how</strong>.
          </p>
          <p style={{ margin: "8px 0 0 0" }}>
            <strong>Wie geht es?</strong> means <strong>How are you?</strong>
          </p>
        </div>

        <div style={splitGridStyle}>
          <div style={informalCardStyle}>
            <span
              style={{ ...badgeStyle, background: "#dcfce7", color: "#15803d" }}
            >
              Informal
            </span>
            <div>
              <strong>Wie geht’s?</strong>
            </div>
            <div>
              <strong>Wie geht es dir?</strong>
            </div>
          </div>

          <div style={formalCardStyle}>
            <span
              style={{ ...badgeStyle, background: "#dbeafe", color: "#1d4ed8" }}
            >
              Formal
            </span>
            <div>
              <strong>Wie geht es Ihnen?</strong>
            </div>
          </div>
        </div>

        <div style={pronunciationStyle}>
          <strong>Pronunciation</strong>
          <div>
            <strong>Wie geht’s?</strong> → vee gates?
          </div>
          <div>
            <strong>Wie geht es dir?</strong> → vee gate ess deer?
          </div>
          <div>
            <strong>Wie geht es Ihnen?</strong> → vee gate ess ee-nen?
          </div>
        </div>

        <div style={exampleStyle}>
          <strong>Examples</strong>
          <div>Hallo, Tom! Wie geht’s?</div>
          <div>Hallo, Anna! Wie geht es dir?</div>
          <div>Guten Tag, Frau Müller! Wie geht es Ihnen?</div>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>5. Responses</h2>

        <div style={splitGridStyle}>
          <div style={informalCardStyle}>
            <span
              style={{ ...badgeStyle, background: "#dcfce7", color: "#15803d" }}
            >
              Common Answers
            </span>
            <div>
              <strong>Gut</strong> – good
            </div>
            <div>
              <strong>Mir geht’s gut.</strong> – I am well
            </div>
            <div>
              <strong>Sehr gut.</strong> – very good
            </div>
          </div>

          <div style={formalCardStyle}>
            <span
              style={{ ...badgeStyle, background: "#dbeafe", color: "#1d4ed8" }}
            >
              More Answers
            </span>
            <div>
              <strong>So lala.</strong> – so-so
            </div>
            <div>
              <strong>Nicht so gut.</strong> – not so good
            </div>
          </div>
        </div>

        <div style={exampleStyle}>
          <strong>Example conversation</strong>
          <div>A: Wie geht’s?</div>
          <div>B: Gut, danke.</div>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>6. Asking “And you?”</h2>

        <div style={splitGridStyle}>
          <div style={informalCardStyle}>
            <span
              style={{ ...badgeStyle, background: "#dcfce7", color: "#15803d" }}
            >
              Informal
            </span>
            <div>
              <strong>Und dir?</strong>
            </div>
          </div>

          <div style={formalCardStyle}>
            <span
              style={{ ...badgeStyle, background: "#dbeafe", color: "#1d4ed8" }}
            >
              Formal
            </span>
            <div>
              <strong>Und Ihnen?</strong>
            </div>
          </div>
        </div>

        <div style={exampleStyle}>
          <strong>Examples</strong>
          <div>
            Mir geht es gut, danke. <strong>Und dir?</strong>
          </div>
          <div>
            Mir geht es gut, danke. <strong>Und Ihnen?</strong>
          </div>
        </div>

        <div style={practiceBoxStyle}>
          <strong>Practice</strong>
          <div>
            Student A: <strong>Wie geht es dir?</strong>
          </div>
          <div>
            Student B: <strong>Mir geht es gut, danke. Und dir?</strong>
          </div>
          <div style={{ height: 6 }} />
          <div>
            Student A: <strong>Wie geht es Ihnen?</strong>
          </div>
          <div>
            Student B: <strong>Mir geht es gut, danke. Und Ihnen?</strong>
          </div>
        </div>
      </section>
    </main>
  );
};

export default A1Day1GreetingsGrammarPage;
