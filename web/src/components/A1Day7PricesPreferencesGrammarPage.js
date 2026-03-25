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
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 12,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 14,
};

const thTdStyle = {
  border: "1px solid #d1d5db",
  padding: "8px 10px",
  textAlign: "left",
  verticalAlign: "top",
};

const noteCardStyle = {
  padding: 12,
  borderRadius: 12,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const practiceCardStyle = {
  padding: 12,
  borderRadius: 12,
  background: "#fffbeb",
  border: "1px solid #fcd34d",
  display: "grid",
  gap: 8,
};

const A1Day7PricesPreferencesGrammarPage = () => {
  const navigate = useNavigate();
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 640 : false;

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={cardStyle}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>Back to Course</button>

        <div style={{ borderRadius: 14, overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1515165562835-c4c4c69943f2?auto=format&fit=crop&w=1400&q=80"
            alt="Price tags in a market"
            style={{
              width: "100%",
              height: isMobile ? 170 : 260,
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        <h1 style={{ ...styles.title, margin: 0 }}>A1 Day 7 • Asking About Prices and Preferences</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammar notes for <strong>kosten/kostet</strong>, pronouns (<strong>er/sie/es</strong>), and expressing preferences with <strong>gern</strong>, <strong>lieber</strong>, and <strong>mögen</strong>.
        </p>
      </header>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>1) Kosten vs. Kostet</h2>
        <div style={splitGridStyle}>
          <div style={noteCardStyle}>
            <strong>Kostet (singular)</strong>
            <div>Use with one item.</div>
            <div>Wie viel kostet der Apfel?</div>
            <div>Der Apfel kostet 1 Euro.</div>
          </div>
          <div style={noteCardStyle}>
            <strong>Kosten (plural)</strong>
            <div>Use with multiple items.</div>
            <div>Wie viel kosten die Äpfel?</div>
            <div>Die Äpfel kosten 2 Euro.</div>
          </div>
        </div>

        <div style={noteCardStyle}>
          <strong>How to answer</strong>
          <div>Singular: Das kostet 5 Euro.</div>
          <div>Plural: Die kosten 10 Euro.</div>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>2) Pronouns with gender</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thTdStyle}>Gender</th>
              <th style={thTdStyle}>Article</th>
              <th style={thTdStyle}>Pronoun</th>
              <th style={thTdStyle}>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={thTdStyle}>Masculine</td>
              <td style={thTdStyle}>der</td>
              <td style={thTdStyle}>er</td>
              <td style={thTdStyle}>Der Apfel kostet 1 Euro. Er kostet 1 Euro.</td>
            </tr>
            <tr>
              <td style={thTdStyle}>Feminine</td>
              <td style={thTdStyle}>die</td>
              <td style={thTdStyle}>sie</td>
              <td style={thTdStyle}>Die Banane kostet 1 Euro. Sie kostet 1 Euro.</td>
            </tr>
            <tr>
              <td style={thTdStyle}>Neuter</td>
              <td style={thTdStyle}>das</td>
              <td style={thTdStyle}>es</td>
              <td style={thTdStyle}>Das Buch kostet 10 Euro. Es kostet 10 Euro.</td>
            </tr>
            <tr>
              <td style={thTdStyle}>Plural</td>
              <td style={thTdStyle}>die</td>
              <td style={thTdStyle}>sie</td>
              <td style={thTdStyle}>Die Äpfel kosten 2 Euro. Sie kosten 2 Euro.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>3) Gern and Lieber</h2>
        <div style={splitGridStyle}>
          <div style={noteCardStyle}>
            <strong>gern = like doing</strong>
            <div>Ich spiele gern Fußball.</div>
            <div>Er schwimmt gern.</div>
          </div>
          <div style={noteCardStyle}>
            <strong>lieber = prefer</strong>
            <div>Ich spiele gern Fußball, aber ich spiele lieber Basketball.</div>
            <div>Er schwimmt gern, aber er fährt lieber Fahrrad.</div>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>4) Gern vs. Mögen</h2>
        <div style={splitGridStyle}>
          <div style={noteCardStyle}>
            <strong>mögen (verb) + noun</strong>
            <div>Ich mag Pizza.</div>
            <div>Er mag Hunde.</div>
            <div>Wir mögen den Film.</div>
          </div>
          <div style={noteCardStyle}>
            <strong>gern (adverb) + action</strong>
            <div>Ich lese gern.</div>
            <div>Er kocht gern.</div>
            <div>Sie tanzt gern.</div>
          </div>
        </div>

        <div style={noteCardStyle}>
          <strong>Mögen conjugation (Präsens)</strong>
          <div>ich mag • du magst • er/sie/es mag • wir mögen • ihr mögt • sie/Sie mögen</div>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>5) Practice</h2>
        <div style={practiceCardStyle}>
          <strong>A. Fill in: kosten or kostet</strong>
          <div>1. Wie viel ____ der Apfel?</div>
          <div>2. Die Bücher ____ 20 Euro.</div>
          <div>3. Das Eis ____ 2 Euro.</div>
          <div>4. Wie viel ____ die Bananen?</div>
          <div><em>Answers:</em> 1) kostet 2) kosten 3) kostet 4) kosten</div>
        </div>

        <div style={practiceCardStyle}>
          <strong>B. Write answers</strong>
          <div>1. Wie viel kostet der Stuhl? (20 Euro)</div>
          <div>2. Wie viel kosten die Äpfel? (309 Euro)</div>
          <div>3. Wie viel kostet das Auto? (5667 Euro)</div>
        </div>

        <div style={practiceCardStyle}>
          <strong>C. Gern or lieber?</strong>
          <div>1. Ich schwimme ____, aber ich spiele Tennis ____.</div>
          <div>2. Er trinkt Wasser ____, aber er trinkt Cola ____.</div>
          <div><em>Answers:</em> 1) gern, lieber 2) gern, lieber</div>
        </div>

        <div style={practiceCardStyle}>
          <strong>D. Gern or mögen?</strong>
          <div>1. Ich ____ den Film.</div>
          <div>2. Ich gehe ____ ins Kino.</div>
          <div>3. Sie ____ Schokolade.</div>
          <div>4. Er läuft ____.</div>
          <div><em>Answers:</em> 1) mag 2) gern 3) mag 4) gern</div>
        </div>
      </section>
    </main>
  );
};

export default A1Day7PricesPreferencesGrammarPage;
