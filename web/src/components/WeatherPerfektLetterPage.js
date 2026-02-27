import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
  transition: "transform 180ms ease, box-shadow 180ms ease",
};

const listStyle = { margin: 0, paddingLeft: 20, display: "grid", gap: 8 };

const noteStyle = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.7,
  color: "#374151",
  background: "#f9fafb",
  border: "1px dashed #9ca3af",
  borderRadius: 12,
  padding: 12,
};

const boxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  lineHeight: 1.75,
  background: "white",
};

const chipRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const chip = {
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: 999,
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  fontSize: 13,
  fontWeight: 700,
};

const imgStyle = {
  width: "100%",
  borderRadius: 12,
  marginBottom: 12,
  objectFit: "cover",
  maxHeight: 180, // cleaner UI
  border: "1px solid #e5e7eb",
  transition: "transform 220ms ease",
};

const linkBtn = {
  ...styles.primaryButton,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

const WeatherPerfektLetterPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* subtle animations (no extra libs) */}
      <style>{`
        .falowen-section { animation: falowenFadeUp 420ms ease both; }
        .falowen-section:nth-child(2) { animation-delay: 40ms; }
        .falowen-section:nth-child(3) { animation-delay: 80ms; }
        .falowen-section:nth-child(4) { animation-delay: 120ms; }
        .falowen-section:nth-child(5) { animation-delay: 160ms; }
        .falowen-section:nth-child(6) { animation-delay: 200ms; }
        .falowen-section:nth-child(7) { animation-delay: 240ms; }
        .falowen-section:nth-child(8) { animation-delay: 280ms; }
        @keyframes falowenFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hoverCard:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.08); }
        .hoverImg:hover { transform: scale(1.01); }
      `}</style>

      <button style={styles.secondaryButton} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* INTRO */}
      <section style={cardStyle} className="falowen-section hoverCard">
        <h1 style={{ margin: 0 }}>
          Chapter 13: Weather + Seasons + Dates/Time + Simple Letter Writing (A1)
        </h1>

        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Learn to talk about <strong>weather</strong>, <strong>seasons</strong>,
          and use <strong>im</strong>, <strong>am</strong>, <strong>um</strong>.
          <br />
          Practice simple letters using <strong>weil</strong>.
        </p>

        <div style={chipRow}>
          <span style={chip}>im = months</span>
          <span style={chip}>am = days</span>
          <span style={chip}>um = time</span>
          <span style={chip}>weil = verb at end</span>
        </div>

        {/* ✅ course link requested */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <a
            href="https://www.falowen.app/campus/course/weather-perfekt-letter-13"
            target="_blank"
            rel="noreferrer"
            style={linkBtn}
          >
            Open this course lesson ↗
          </a>
          <span style={{ ...noteStyle, padding: "8px 10px", borderStyle: "solid" }}>
            Tip: Read the lesson, then practice the questions + mini tasks below.
          </span>
        </div>
      </section>

      {/* WEATHER */}
      <section style={cardStyle} className="falowen-section hoverCard">
        <h2 style={{ margin: 0 }}>1) Weather (A1)</h2>

        <img
          src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=70"
          alt="Weather"
          style={imgStyle}
          className="hoverImg"
        />

        <ul style={listStyle}>
          <li>Es regnet.</li>
          <li>Es schneit.</li>
          <li>Es ist kalt / warm / windig.</li>
          <li>Die Sonne scheint.</li>
        </ul>
      </section>

      {/* ✅ NEW: HOW TO ASK ABOUT WEATHER */}
      <section style={cardStyle} className="falowen-section hoverCard">
        <h2 style={{ margin: 0 }}>1.1) How to ask for the weather (A1)</h2>

        <div style={noteStyle}>
          <strong>Simple questions:</strong>
          <div>• Wie ist das Wetter? (How is the weather?)</div>
          <div>• Wie ist das Wetter heute? (How is the weather today?)</div>
          <div>• Wie ist das Wetter in Accra? (…in Accra?)</div>
          <div style={{ marginTop: 10 }}>
            <strong>Follow-up questions:</strong>
            <div>• Regnet es? (Is it raining?)</div>
            <div>• Schneit es? (Is it snowing?)</div>
            <div>• Ist es warm oder kalt? (Is it warm or cold?)</div>
            <div>• Gibt es viel Wind? / Ist es windig? (Is it windy?)</div>
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>Mini dialogue:</strong>
            <div>— Wie ist das Wetter heute?</div>
            <div>— Es ist warm, aber es regnet.</div>
          </div>
        </div>

        <div style={boxStyle}>
          <strong>Quick speaking practice (30 seconds):</strong>
          <ul style={listStyle}>
            <li>Heute ist es … (warm/kalt/windig).</li>
            <li>In Accra ist es …</li>
            <li>Ich mag das Wetter, weil …</li>
          </ul>
        </div>
      </section>

      {/* SEASONS */}
      <section style={cardStyle} className="falowen-section hoverCard">
        <h2 style={{ margin: 0 }}>2) Seasons + Months</h2>

        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=70"
          alt="Seasons"
          style={imgStyle}
          className="hoverImg"
        />

        <div style={boxStyle}>
          <strong>Seasons:</strong>
          <ul style={listStyle}>
            <li>der Frühling</li>
            <li>der Sommer</li>
            <li>der Herbst</li>
            <li>der Winter</li>
          </ul>

          <strong>Months:</strong>
          <p style={{ margin: 0 }}>
            Januar, Februar, März, April, Mai, Juni, Juli, August, September,
            Oktober, November, Dezember
          </p>
        </div>
      </section>

      {/* IM AM UM */}
      <section style={cardStyle} className="falowen-section hoverCard">
        <h2 style={{ margin: 0 }}>3) im / am / um</h2>

        <div style={boxStyle}>
          <ul style={listStyle}>
            <li>Im August fahre ich in den Urlaub.</li>
            <li>Am Montag habe ich einen Termin.</li>
            <li>Um 10 Uhr komme ich.</li>
          </ul>
        </div>
      </section>

      {/* ✅ NEW: PERFECT NOTE (EXACT NOTE AS REQUESTED) */}
      <section style={cardStyle} className="falowen-section hoverCard">
        <h2 style={{ margin: 0 }}>3.1) A1 Grammar Notes: Perfekt (Past Tense)</h2>

        <div style={noteStyle}>
          <strong>Teaching note:</strong> We teach <strong>Perfekt</strong> for A1
          students so you can talk about the past in a simple, correct way.
        </div>

        {/* EXACT NOTE (kept as-is) */}
        <div style={boxStyle}>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
{`A1 Grammar Notes: Perfekt (Past Tense) Statements Using "Haben" and "Sein"
1. Overview of Perfekt
The Perfekt tense is used to talk about actions or events that happened in the past. It is commonly used
in spoken German and is formed with an auxiliary verb (haben or sein) and the past participle of the
main verb.
2. Auxiliary Verbs: "Haben" and "Sein"
• Haben: Used for actions or events that you can control.
• Sein: Used for movements (directional verbs) or changes of state (things you can't control).
3. Forming the Past Participle
• Regular Verbs: Start with "ge-" and end with "-t".
o Example: spielen (to play) → gespielt
• Irregular Verbs: Start with "ge-" and end with "-en".
o Example: sprechen (to speak) → gesprochen
• Separable Verbs: "ge-" is placed in the middle, between the prefix and the verb stem.
o Example: aufräumen (to tidy up) → aufgeräumt
4. Using "Haben" in Perfekt
Most verbs use "haben" as the auxiliary verb. These include:
• Verbs that describe actions you can control.
o Example: Ich habe gespielt. (I played.)
o Example: Er hat gegessen. (He ate.)
5. Using "Sein" in Perfekt
"Sein" is used with:
• Verbs indicating a change of place or state.
o Example: Ich bin gegangen. (I went.)
o Example: Sie ist gefahren. (She drove.)
• Some exceptions include verbs that are neither clearly directional nor state-changing but still use "sein"
(e.g., bleiben - to stay, sein - to be).
6. Examples
• Regular Verbs with "Haben":
o machen (to do/make) → Ich habe gemacht. (I did/made.)
o arbeiten (to work) → Du hast gearbeitet. (You worked.)
• Irregular Verbs with "Haben":
o sehen (to see) → Er hat gesehen. (He saw.)
o schreiben (to write) → Wir haben geschrieben. (We wrote.)
• Directional Verbs with "Sein":
o kommen (to come) → Ihr seid gekommen. (You all came.)
o fahren (to drive/go) → Sie sind gefahren. (They drove/went.)
• Separable Verbs:
o aufräumen (to tidy up) → Ich habe aufgeräumt. (I tidied up.)
o anrufen (to call) → Du hast angerufen. (You called.)`}
          </pre>
        </div>

        {/* small quick practice */}
        <div style={noteStyle}>
          <strong>Small quick practice (2 minutes):</strong>
          <div>Make 6 Perfekt sentences (3 with <strong>haben</strong>, 3 with <strong>sein</strong>):</div>
          <div style={{ marginTop: 8 }}>
            • spielen / lernen / aufräumen <br />
            • gehen / kommen / fahren
          </div>
          <div style={{ marginTop: 8 }}>
            Example: <em>Ich habe gelernt.</em> / <em>Ich bin gegangen.</em>
          </div>
        </div>
      </section>

      {/* PRICE + REQUEST */}
      <section style={cardStyle} className="falowen-section hoverCard">
        <h2 style={{ margin: 0 }}>4) Asking for Price (A1)</h2>

        <img
          src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1600&q=70"
          alt="Payment"
          style={imgStyle}
          className="hoverImg"
        />

        <div style={noteStyle}>
          <strong>Simple price questions:</strong>
          <div>• Wie viel kostet der Kurs?</div>
          <div>• Was kostet der Kurs?</div>

          <div style={{ marginTop: 10 }}>
            <strong>Payment:</strong>
            <div>• Wie kann ich bezahlen?</div>
            <div>• Mit Kreditkarte oder bar?</div>
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>Polite request:</strong>
            <div>• Könnten Sie mir bitte Informationen geben?</div>
            <div>• Könnten Sie mir bitte sagen, wann der Kurs beginnt?</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WeatherPerfektLetterPage;
