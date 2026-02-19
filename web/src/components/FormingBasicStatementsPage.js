import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const sectionStyle = { ...styles.card, display: "grid", gap: 10 };

const FormingBasicStatementsPage = () => {
  const navigate = useNavigate();
  const grammarbookResourceViewerUrl = "/campus/course/resource-viewer?label=Grammarbook&url=https%3A%2F%2Fwww.falowen.app%2Fcampus%2Fcourse%2Fforming-basic-statements-german-a1-day-8";

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
        <p style={{ margin: 0 }}>
          Goal: form short statements and questions about experience, location, and movement with clear word order.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Open the Grammarbook in-app</h2>
        <p style={{ margin: 0 }}>
          Use the in-app viewer for zoom controls when text looks too small.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            style={{ ...styles.secondaryButton, width: "fit-content" }}
            onClick={() => navigate(grammarbookResourceViewerUrl)}
          >
            Open Grammarbook viewer
          </button>
          <a href="https://www.falowen.app/campus/course/resource-viewer?label=Grammarbook&url=https%3A%2F%2Fwww.falowen.app%2Fcampus%2Fcourse%2Fforming-basic-statements-german-a1-day-8" target="_blank" rel="noreferrer">
            Open direct URL
          </a>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Past Tense for haben and sein</h2>
        <p style={{ margin: 0 }}>Main tenses (names only): Präsens, Perfekt, Präteritum, Plusquamperfekt, Futur I, Futur II.</p>
        <p style={{ margin: 0 }}>
          How they connect: Präsens = now, Perfekt/Präteritum = past, Plusquamperfekt = earlier past,
          Futur I/Futur II = future.
        </p>
        <p style={{ margin: 0 }}>Today we focus only on Präteritum forms of <em>haben</em> and <em>sein</em>.</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li><strong>haben</strong>: ich hatte, du hattest, er/sie/es hatte, wir hatten, ihr hattet, sie/Sie hatten.</li>
          <li><strong>sein</strong>: ich war, du warst, er/sie/es war, wir waren, ihr wart, sie/Sie waren.</li>
          <li>Ich hatte keinen Stadtplan. / Ich war in Berlin.</li>
        </ul>
        <p style={{ margin: 0 }}><strong>Mini pattern:</strong> Subject + verb + information. Example: <em>Ich war gestern krank.</em></p>
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
        <p style={{ margin: 0 }}>
          Connection for this lesson: we use <strong>schon mal</strong> and <strong>noch nie</strong> with Präteritum of
          <em> sein</em> (<em>war/warst/waren</em>) to ask and answer about life experiences.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Bist du schon mal in Accra gewesen? – Ja, ich bin schon mal in Accra gewesen.</li>
          <li>Warst du schon mal in Wien? – Nein, ich war noch nie in Wien.</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Location Statements with liegen</h2>
        <p style={{ margin: 0 }}>Use <em>liegen</em> to describe location:</p>
        <p style={{ margin: 0 }}>
          Conjugation: ich liege, du liegst, er/sie/es liegt, wir liegen, ihr liegt, sie/Sie liegen.
        </p>
        <p style={{ margin: 0 }}>
          Why both forms? <strong>Ost</strong> is a direction/name; <strong>im Osten</strong> means “in the east” (region, location).
        </p>
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
        <p style={{ margin: 0 }}>
          Country tip: <em>nach</em> Deutschland, nach Ghana, nach Frankreich (no article);
          but <em>in</em> die Schweiz (feminine), in die Türkei (feminine), in den Irak (masculine),
          in den Sudan (masculine), in das Iran (neuter, usually: in den Iran in modern usage), in die USA (plural).
        </p>
        <p style={{ margin: 0 }}>
          How to know country gender: learn each country with its article from a dictionary/list. Many are neuter with no article,
          but some are fixed with article. We will practise adjective declension with these forms later.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Wo wohnst du? – Ich wohne in Kumasi.</li>
          <li>Woher kommt er? – Er kommt aus der Schweiz.</li>
          <li>Wohin fahrt ihr morgen? – Wir fahren in die USA.</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Irregular Verbs with Vowel Change</h2>
        <p style={{ margin: 0 }}>In du and er/sie/es forms, these verbs change vowel:</p>
        <p style={{ margin: 0 }}>
          German vowels: a, e, i, o, u, ä, ö, ü. Common changes: <strong>e → i/ie</strong> and <strong>a → ä</strong>.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>nehmen: du <strong>nimmst</strong>, er <strong>nimmt</strong></li>
          <li>sprechen: du <strong>sprichst</strong>, er <strong>spricht</strong></li>
          <li>essen: du <strong>isst</strong>, er <strong>isst</strong></li>
          <li>fahren: du <strong>fährst</strong>, er <strong>fährt</strong></li>
          <li>laufen: du <strong>läufst</strong>, er <strong>läuft</strong></li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>man vs Mann</h2>
        <p style={{ margin: 0 }}>
          Personal pronouns: ich, du, er, sie, es, wir, ihr, sie, Sie.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li><strong>man</strong> (pronoun) = one / people in general. Example: Man kann hier gut essen.</li>
          <li><strong>Mann</strong> (noun) = adult male person. Example: Der Mann ist Lehrer.</li>
          <li><strong>man</strong> uses the same verb form family as <strong>er/sie/es</strong>: <strong>man ist</strong>, <strong>man hat</strong>, <strong>man geht</strong>.</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>In-App Self-Check Questions</h2>
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
          <li>
            Build a sentence with <em>noch nie</em> about a country.
            <br />
            <strong>Check:</strong> Ich war noch nie in Spanien.
          </li>
          <li>
            Answer: <em>Woher kommst du?</em> and <em>Wohin fährst du morgen?</em>
            <br />
            <strong>Check:</strong> Ich komme aus Ghana. Ich fahre morgen nach Deutschland.
          </li>
          <li>
            Write one sentence with <em>man</em> and one with <em>Mann</em>.
            <br />
            <strong>Check:</strong> In Berlin spricht man Deutsch. / Der Mann kommt aus Österreich.
          </li>
          <li>
            Complete with Präteritum of <em>sein</em>: „___ du schon mal in Wien?“
            <br />
            <strong>Check:</strong> Warst.
          </li>
          <li>
            Choose correctly: „Berlin liegt im ___ von Deutschland.“
            <br />
            <strong>Check:</strong> Osten.
          </li>
          <li>
            Choose article + preposition: „Wir fliegen ___ Schweiz.“
            <br />
            <strong>Check:</strong> in die Schweiz.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default FormingBasicStatementsPage;
