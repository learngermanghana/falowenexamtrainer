import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const heroImage =
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80";

const sectionTitleStyle = {
  margin: 0,
  fontSize: "1.1rem",
  fontWeight: 700,
};

const listStyle = {
  margin: 0,
  paddingLeft: 18,
  display: "grid",
  gap: 6,
};

const tableWrapStyle = {
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 14,
  minWidth: 620,
};

const cellStyle = {
  border: "1px solid #d1d5db",
  padding: "8px 10px",
  textAlign: "left",
  verticalAlign: "top",
};

const A1Day9NominativeAccusativeGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={cardStyle}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <img
          src={heroImage}
          alt="Students studying German grammar together"
          style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 12 }}
        />
        <h1 style={{ ...styles.title, margin: 0 }}>A1 Day 9 • Nominative and Accusative Cases</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          In-app grammar notes for <strong>German plurals</strong> and the core idea of German{" "}
          <strong>cases as a family system</strong> (Nominativ, Akkusativ, Dativ, Genitiv).
        </p>
        <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>Header image source: Unsplash</p>
      </header>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>1) German plurals (quick guide)</h2>
        <ul style={listStyle}>
          <li>German nouns can have different plural endings, so plural forms should be learned with each noun.</li>
          <li>Plural nouns do not have grammatical gender, and the definite article is always <strong>die</strong>.</li>
          <li>
            With negation in plural, use <strong>keine</strong> (for example: <strong>keine Bücher</strong>).
          </li>
          <li>
            Quick English bridge: <strong>definite article</strong> means <strong>"the"</strong> (specific thing),
            while <strong>indefinite article</strong> means <strong>"a / an"</strong> (one non-specific thing).
          </li>
        </ul>

        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Type</th>
                <th style={cellStyle}>Masculine</th>
                <th style={cellStyle}>Feminine</th>
                <th style={cellStyle}>Neuter</th>
                <th style={cellStyle}>Plural</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cellStyle}>Definite articles ("the")</td>
                <td style={cellStyle}>der</td>
                <td style={cellStyle}>die</td>
                <td style={cellStyle}>das</td>
                <td style={cellStyle}>die</td>
              </tr>
              <tr>
                <td style={cellStyle}>Indefinite / negation ("a / an" / "no")</td>
                <td style={cellStyle}>ein</td>
                <td style={cellStyle}>eine</td>
                <td style={cellStyle}>ein</td>
                <td style={cellStyle}>keine</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul style={listStyle}>
          <li>Der Hund → Die Hunde | Ich sehe den Hund. / Ich sehe die Hunde.</li>
          <li>Das Buch → Die Bücher | Ich lese das Buch. / Ich lese die Bücher.</li>
          <li>Die Blume → Die Blumen | Ich kaufe die Blume. / Ich kaufe die Blumen.</li>
          <li>Ein Apfel → Keine Äpfel | Ich habe einen Apfel. / Ich habe keine Äpfel.</li>
        </ul>
        <p style={{ margin: 0 }}>
          Teaching note for next chapter: when students understand <strong>the</strong> vs{" "}
          <strong>a / an</strong>, it becomes much easier to teach possessive determiners like{" "}
          <strong>mein / meine</strong> ("my"), <strong>dein / deine</strong> ("your"), and{" "}
          <strong>sein / seine</strong> ("his"), because they follow similar article patterns.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>2) The big idea: German cases are like a family of classes</h2>
        <p style={{ margin: 0 }}>
          Think of German cases as <strong>four related classes</strong>: <strong>Nominativ</strong>,{" "}
          <strong>Akkusativ</strong>, <strong>Dativ</strong>, and <strong>Genitiv</strong>. Each class has its own
          article forms (der, die, das, den, dem, des ...).
        </p>
        <ul style={listStyle}>
          <li>
            Step 1: identify the sentence role first (subject, direct object, etc.), then choose the correct article.
          </li>
          <li>
            Step 2: remember that article changes are normal in German: <strong>der</strong> can become{" "}
            <strong>den</strong>, <strong>dem</strong>, or <strong>des</strong> depending on case.
          </li>
          <li>
            For now, focus on <strong>Nominativ + Akkusativ</strong>. We will introduce Dativ and Genitiv gradually.
          </li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>3) Nominative case (Der Nominativ)</h2>
        <p style={{ margin: 0 }}>
          Use nominative for the <strong>subject</strong> (who/what does the action). A beginner tip: with{" "}
          <strong>sein</strong> and <strong>werden</strong>, you often get a subject + description pattern (no direct
          object).
        </p>
        <ul style={listStyle}>
          <li>Der Mann ist nett.</li>
          <li>Die Frau arbeitet.</li>
          <li>Das Kind spielt.</li>
          <li>Das ist ein Haus. / Er wird Lehrer.</li>
        </ul>
        <p style={{ margin: 0 }}>
          Quick tip: if your sentence is mainly <strong>subject + verb + description</strong>, it is usually
          nominative-focused.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>4) Accusative case (Der Akkusativ)</h2>
        <p style={{ margin: 0 }}>
          Use accusative for the <strong>direct object</strong> (the person or thing directly affected by the action).
        </p>
        <p style={{ margin: 0 }}>
          First-time learner tip: accusative sentences are often <strong>subject + verb + noun (object)</strong>.
        </p>

        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Accusative articles</th>
                <th style={cellStyle}>Masculine</th>
                <th style={cellStyle}>Feminine</th>
                <th style={cellStyle}>Neuter</th>
                <th style={cellStyle}>Plural</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cellStyle}>Definite</td>
                <td style={cellStyle}>den</td>
                <td style={cellStyle}>die</td>
                <td style={cellStyle}>das</td>
                <td style={cellStyle}>die</td>
              </tr>
              <tr>
                <td style={cellStyle}>Indefinite / negation</td>
                <td style={cellStyle}>einen</td>
                <td style={cellStyle}>eine</td>
                <td style={cellStyle}>ein</td>
                <td style={cellStyle}>keine</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul style={listStyle}>
          <li>Ich habe den Hund.</li>
          <li>Sie kauft die Blume.</li>
          <li>Er isst das Brot.</li>
          <li>Wir treffen die Freunde.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>5) Helpful verb tips for beginners</h2>
        <ul style={listStyle}>
          <li>
            <strong>Nominative focus:</strong> sein, werden (often no direct object, but a description/complement)
          </li>
          <li>
            <strong>Accusative object verbs:</strong> haben, sehen, finden, kaufen, nehmen, brauchen, essen, trinken,
            hören, lesen
          </li>
        </ul>
        <p style={{ margin: 0 }}>
          Tip: first find the verb, then identify who does the action (subject = nominative) and who/what receives the
          action (direct object = accusative).
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>6) What comes next</h2>
        <p style={{ margin: 0 }}>
          Great start. Keep practicing nominative and accusative first. Later, we add <strong>Dativ</strong> and{" "}
          <strong>Genitiv</strong> so you can build more complete German sentences confidently.
        </p>
      </section>
    </main>
  );
};

export default A1Day9NominativeAccusativeGrammarPage;
