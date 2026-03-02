import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 10 };

const PersonenBeschreibenGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 2 Grammar Notes: Personen beschreiben (1.2)</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Focus: interrogative clauses (W-Fragen) and subordinate clauses (Nebensätze).
        </p>
      </header>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>1) Interrogative clauses (W-Fragen)</h2>
        <p style={{ margin: 0 }}>
          In direct questions, the verb is usually in position 2.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Wie heißt sie? (What is her name?)</li>
          <li>Woher kommt er? (Where does he come from?)</li>
          <li>Wie sieht dein Freund aus? (What does your friend look like?)</li>
          <li>Was macht sie in ihrer Freizeit? (What does she do in her free time?)</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>2) Subordinate clauses with weil and dass</h2>
        <p style={{ margin: 0 }}>
          In subordinate clauses, the conjugated verb goes to the end.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Sie ist freundlich, weil sie immer hilft.</li>
          <li>Ich finde, dass er sehr ruhig ist.</li>
          <li>Wir mögen sie, weil sie humorvoll ist.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>3) Useful speaking pattern</h2>
        <p style={{ margin: 0 }}>
          <strong>Das ist ... / Er-Sie ist ... / Ich denke, dass ... / weil ...</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Das ist meine Schwester. Sie ist sehr offen.</li>
          <li>Ich denke, dass sie sehr geduldig ist.</li>
          <li>Ich rede gern mit ihr, weil sie gut zuhört.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>4) Mini model text</h2>
        <p style={{ margin: 0 }}>
          Das ist mein Freund Karim. Wie sieht er aus? Er ist groß und sportlich. Ich finde, dass er sehr freundlich
          ist, weil er anderen immer hilft. Woher kommt er? Er kommt aus Marokko und lebt jetzt in Berlin.
        </p>
      </section>
    </main>
  );
};

export default memo(PersonenBeschreibenGrammarPage);
