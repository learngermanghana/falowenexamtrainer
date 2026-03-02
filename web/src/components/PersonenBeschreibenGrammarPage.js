import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 10 };

const heroSrc =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80";

const markStyles = {
  dass: {
    background: "#fff3bf",
    padding: "2px 6px",
    borderRadius: 6,
    fontWeight: 700,
  },
  subject: {
    background: "#d0ebff",
    padding: "2px 6px",
    borderRadius: 6,
    fontWeight: 600,
  },
  verb: {
    background: "#d3f9d8",
    padding: "2px 6px",
    borderRadius: 6,
    fontWeight: 700,
  },
  moved: {
    background: "#ffd8a8",
    padding: "2px 6px",
    borderRadius: 6,
    fontWeight: 700,
  },
};

const noteStyle = {
  padding: 12,
  borderRadius: 10,
  background: "#f8f9fa",
  border: "1px solid #e9ecef",
};

const exampleBox = {
  display: "grid",
  gap: 8,
  padding: 12,
  borderRadius: 10,
  background: "#fcfcfc",
  border: "1px solid #e9ecef",
};

const arrowStyle = {
  fontWeight: 700,
  color: "#495057",
};

const Mark = ({ type, children }) => (
  <span style={markStyles[type]}>{children}</span>
);

const ShiftExample = ({ normal, changed, note }) => (
  <div style={exampleBox}>
    <div>
      <strong>Normal sentence:</strong> {normal}
    </div>
    <div style={arrowStyle}>↓ with "dass"</div>
    <div>
      <strong>Changed sentence:</strong> {changed}
    </div>
    <div style={{ fontSize: 14, color: "#495057" }}>{note}</div>
  </div>
);

const MeinungAeussernGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      {/* HEADER */}
      <header style={{ ...styles.card, display: "grid", gap: 12 }}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A2 Grammar: Ich finde • Ich denke • Ich glaube
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>
          Expressing opinions and thoughts in German.
        </p>

        <img
          src={heroSrc}
          alt="Students discussing and sharing opinions"
          style={{
            width: "100%",
            borderRadius: 12,
            maxHeight: 320,
            objectFit: "cover",
          }}
        />
      </header>

      {/* INTRO */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>1) Expressing Opinions in German</h2>
        <p style={{ margin: 0 }}>
          In German, we often use these three expressions to give opinions:
        </p>

        <ul style={{ paddingLeft: 20, margin: 0 }}>
          <li>
            <strong>Ich finde</strong> → personal opinion / evaluation
          </li>
          <li>
            <strong>Ich denke</strong> → logical thought
          </li>
          <li>
            <strong>Ich glaube</strong> → belief or assumption
          </li>
        </ul>
      </section>

      {/* DIFFERENCE */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>2) Meaning Difference</h2>

        <p>
          <strong>Ich finde</strong> → How YOU feel
        </p>
        <ul style={{ paddingLeft: 20 }}>
          <li>Ich finde den Film interessant.</li>
          <li>Ich finde Deutsch spannend.</li>
        </ul>

        <p>
          <strong>Ich denke</strong> → What you think logically
        </p>
        <ul style={{ paddingLeft: 20 }}>
          <li>Ich denke, das ist eine gute Idee.</li>
          <li>Ich denke, er arbeitet heute.</li>
        </ul>

        <p>
          <strong>Ich glaube</strong> → Not 100% sure
        </p>
        <ul style={{ paddingLeft: 20 }}>
          <li>Ich glaube, er kommt später.</li>
          <li>Ich glaube, sie ist krank.</li>
        </ul>
      </section>

      {/* WORD ORDER CHANGE */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>3) What Changes with "dass"?</h2>

        <div style={noteStyle}>
          <p style={{ margin: 0 }}>
            When you use <Mark type="dass">dass</Mark>, the next part becomes a
            subordinate clause. In that clause, the{" "}
            <Mark type="moved">verb moves to the end</Mark>.
          </p>
        </div>

        <ShiftExample
          normal={
            <>
              <Mark type="subject">Der Kurs</Mark> <Mark type="verb">ist</Mark>{" "}
              sehr interessant.
            </>
          }
          changed={
            <>
              Ich finde, <Mark type="dass">dass</Mark>{" "}
              <Mark type="subject">der Kurs</Mark> sehr interessant{" "}
              <Mark type="moved">ist</Mark>.
            </>
          }
          note='The verb "ist" was in the middle before, but with "dass" it goes to the end.'
        />

        <ShiftExample
          normal={
            <>
              <Mark type="subject">Er</Mark> <Mark type="verb">hat</Mark> heute
              keine Zeit.
            </>
          }
          changed={
            <>
              Ich denke, <Mark type="dass">dass</Mark>{" "}
              <Mark type="subject">er</Mark> heute keine Zeit{" "}
              <Mark type="moved">hat</Mark>.
            </>
          }
          note='The verb "hat" shifts to the end of the subordinate clause.'
        />

        <ShiftExample
          normal={
            <>
              <Mark type="subject">Sie</Mark> <Mark type="verb">lebt</Mark> in
              Accra.
            </>
          }
          changed={
            <>
              Ich glaube, <Mark type="dass">dass</Mark>{" "}
              <Mark type="subject">sie</Mark> in Accra{" "}
              <Mark type="moved">lebt</Mark>.
            </>
          }
          note='The verb "lebt" also moves to the end after "dass".'
        />
      </section>

      {/* DASS STRUCTURE */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>4) Using "dass" (Important A2 Rule)</h2>

        <p style={{ margin: 0 }}>
          Structure:
        </p>

        <div style={noteStyle}>
          <strong>
            Ich finde / denke / glaube, <Mark type="dass">dass</Mark> + subject
            + ... + <Mark type="moved">verb at the end</Mark>
          </strong>
        </div>

        <ul style={{ paddingLeft: 20 }}>
          <li>
            Ich finde, <Mark type="dass">dass</Mark>{" "}
            <Mark type="subject">Deutsch</Mark> wichtig{" "}
            <Mark type="verb">ist</Mark>.
          </li>
          <li>
            Ich denke, <Mark type="dass">dass</Mark>{" "}
            <Mark type="subject">Online-Lernen</Mark> effektiv{" "}
            <Mark type="verb">ist</Mark>.
          </li>
          <li>
            Ich glaube, <Mark type="dass">dass</Mark>{" "}
            <Mark type="subject">Lernen</Mark> Zeit{" "}
            <Mark type="verb">braucht</Mark>.
          </li>
        </ul>
      </section>

      {/* MINI MODEL */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>5) Mini Model Text</h2>

        <p style={{ margin: 0, lineHeight: 1.8 }}>
          Ich finde, <Mark type="dass">dass</Mark>{" "}
          <Mark type="subject">Deutsch</Mark> eine schöne Sprache{" "}
          <Mark type="verb">ist</Mark>. <br />
          Ich denke, <Mark type="dass">dass</Mark>{" "}
          <Mark type="subject">regelmäßiges Lernen</Mark> sehr wichtig{" "}
          <Mark type="verb">ist</Mark>. <br />
          Ich glaube, <Mark type="dass">dass</Mark>{" "}
          <Mark type="subject">man</Mark> mit Übung schnell besser{" "}
          <Mark type="verb">wird</Mark>.
        </p>
      </section>

      {/* PRACTICE */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>6) Speaking Practice</h2>

        <p>Complete the sentences:</p>

        <ul style={{ paddingLeft: 20 }}>
          <li>
            Ich finde, <Mark type="dass">dass</Mark> __________{" "}
            <Mark type="verb">.</Mark>
          </li>
          <li>
            Ich denke, <Mark type="dass">dass</Mark> __________{" "}
            <Mark type="verb">.</Mark>
          </li>
          <li>
            Ich glaube, <Mark type="dass">dass</Mark> __________{" "}
            <Mark type="verb">.</Mark>
          </li>
        </ul>
      </section>
    </main>
  );
};

export default memo(MeinungAeussernGrammarPage);
