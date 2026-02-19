import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const sectionStyle = { ...styles.card, display: "grid", gap: 10 };

const FormingBasicStatementsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Forming Basic Statements in German (A1 Level)</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Day 8 Grammar: Countries and Languages (Chapter 4)
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Assignment Focus</h2>
        <p style={{ margin: 0 }}>
          <strong>schon mal, noch nie; irregular verbs; man vs Mann.</strong>
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Past Tense for haben and sein</h2>
        <p style={{ margin: 0 }}>Main tenses (names only): Präsens, Perfekt, Präteritum, Plusquamperfekt, Futur I, Futur II.</p>
        <p style={{ margin: 0 }}>Today we focus on Präsens and Präteritum for <em>haben</em> and <em>sein</em>.</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Ich habe einen Stadtplan. / Ich hatte einen Stadtplan.</li>
          <li>Ich bin in Berlin. / Ich war in Berlin.</li>
          <li>Gestern hatte ich keinen Stadtplan.</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>schon mal and noch nie</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li><strong>schon mal</strong> = ever before / at least once before (positive experience).</li>
          <li><strong>noch nie</strong> = never until now (negative experience).</li>
          <li>Position: usually in the middle, after the verb.</li>
        </ul>
        <p style={{ margin: 0 }}><strong>Perfekt:</strong> Bist du schon mal ... gewesen? / Ich bin noch nie ... gewesen.</p>
        <p style={{ margin: 0 }}><strong>Präteritum:</strong> Warst du schon mal ...? / Ich war noch nie in Deutschland.</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Location Statements with liegen</h2>
        <p style={{ margin: 0 }}>Use <em>liegen</em> to describe location:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Berlin liegt im Osten von Deutschland.</li>
          <li>Köln liegt im Westen von Deutschland.</li>
          <li>München liegt im Süden von Deutschland.</li>
          <li>Hamburg liegt im Norden von Deutschland.</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>wo, woher, wohin</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li><strong>wo</strong> = where (location): Wo bist du? → Ich bin in der Schule.</li>
          <li><strong>woher</strong> = where from (origin): Woher kommst du? → Ich komme aus Ghana.</li>
          <li><strong>wohin</strong> = where to (direction): Wohin fliegst du? → Ich fliege nach Deutschland.</li>
        </ul>
        <p style={{ margin: 0 }}>
          Use <em>nach</em> for most cities/countries without article, but <em>in</em> + article for places like <em>die USA</em>.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Irregular Verbs with Vowel Change</h2>
        <p style={{ margin: 0 }}>In du and er/sie/es forms, these verbs change vowel:</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>nehmen: du <strong>nimmst</strong>, er <strong>nimmt</strong></li>
          <li>sprechen: du <strong>sprichst</strong>, er <strong>spricht</strong></li>
          <li>essen: du <strong>isst</strong>, er <strong>isst</strong></li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>man vs Mann</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li><strong>man</strong> (pronoun) = one / people in general. Example: Man kann hier gut essen.</li>
          <li><strong>Mann</strong> (noun) = adult male person. Example: Der Mann ist Lehrer.</li>
          <li>With verbs: Er/Sie/Es/<strong>man isst</strong>.</li>
        </ul>
      </div>
    </div>
  );
};

export default FormingBasicStatementsPage;
