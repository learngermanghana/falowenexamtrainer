import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 12 };
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

const WeatherPerfektLetterPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <button style={styles.secondaryButton} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* INTRO */}
      <section style={cardStyle}>
        <h1 style={{ margin: 0 }}>Chapter 13: Weather + Seasons + Dates/Time + Simple Letter Writing (A1)</h1>
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          This chapter helps you talk about <strong>weather</strong>, <strong>seasons</strong>, and use{" "}
          <strong>im</strong> (months), <strong>am</strong> (days/dates), <strong>um</strong> (time).
          <br />
          You also learn A1 connectors with a focus on <strong>weil</strong> for simple letter reasons
          (Urlaub, appointment cancelling).
        </p>

        <div style={chipRow}>
          <span style={chip}>im = months</span>
          <span style={chip}>am = days / dates</span>
          <span style={chip}>um = time</span>
          <span style={chip}>weil = reason (verb at the end)</span>
        </div>
      </section>

      {/* 1) WEATHER WORDS + ASKING */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>1) Weather words (A1) + How to ask</h2>

        <ul style={listStyle}>
          <li>Es regnet. (It is raining.)</li>
          <li>Es schneit. (It is snowing.)</li>
          <li>Es ist windig. (It is windy.)</li>
          <li>Es ist kalt. (It is cold.)</li>
          <li>Es ist warm. (It is warm.)</li>
          <li>Es ist heiß. (It is hot.)</li>
          <li>Die Sonne scheint. (The sun is shining.)</li>
        </ul>

        <div style={noteStyle}>
          <strong>Ask about the weather (simple A1 questions):</strong>
          <div>• Wie ist das Wetter?</div>
          <div>• Regnet es?</div>
          <div>• Schneit es?</div>
          <div>• Ist es kalt / warm / windig?</div>
          <div style={{ marginTop: 8 }}>
            <strong>Short answers:</strong>
            <div>• Ja, es regnet. / Nein, es regnet nicht.</div>
            <div>• Ja, es ist kalt. / Nein, es ist nicht kalt.</div>
          </div>
        </div>
      </section>

      {/* 2) SEASONS + MONTHS */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>2) Seasons in German (Jahreszeiten) + Months</h2>

        <div style={boxStyle}>
          <p style={{ margin: 0 }}>
            <strong>Die Jahreszeiten (seasons):</strong>
          </p>
          <ul style={listStyle}>
            <li>
              <strong>der Frühling</strong> (spring)
            </li>
            <li>
              <strong>der Sommer</strong> (summer)
            </li>
            <li>
              <strong>der Herbst</strong> (autumn)
            </li>
            <li>
              <strong>der Winter</strong> (winter)
            </li>
          </ul>

          <p style={{ margin: "10px 0 0" }}>
            <strong>Months (Monate):</strong> Januar, Februar, März, April, Mai, Juni, Juli, August, September,
            Oktober, November, Dezember
          </p>
        </div>

        <div style={noteStyle}>
          <strong>Simple season sentences (A1):</strong>
          <div>• Im Sommer ist es oft heiß.</div>
          <div>• Im Winter ist es oft kalt.</div>
          <div>• Im Frühling ist es manchmal windig.</div>
          <div>• Im Herbst regnet es oft.</div>
        </div>
      </section>

      {/* 3) IM / AM / UM */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>3) im / am / um (A1)</h2>

        <div style={boxStyle}>
          <p style={{ margin: 0 }}>
            <strong>im</strong> = with months / seasons (in)
          </p>
          <ul style={listStyle}>
            <li>im Januar</li>
            <li>im August</li>
            <li>im Sommer</li>
            <li>im Winter</li>
          </ul>

          <p style={{ margin: "10px 0 0" }}>
            <strong>am</strong> = with days / dates (on)
          </p>
          <ul style={listStyle}>
            <li>am Montag</li>
            <li>am Dienstag</li>
            <li>am 3. März</li>
            <li>am 10. August</li>
          </ul>

          <p style={{ margin: "10px 0 0" }}>
            <strong>um</strong> = with time (at)
          </p>
          <ul style={listStyle}>
            <li>um 8 Uhr</li>
            <li>um 14 Uhr</li>
            <li>um 9:30 Uhr</li>
          </ul>
        </div>

        <div style={noteStyle}>
          <strong>Full example sentences:</strong>
          <div>• Im August fahre ich in den Urlaub.</div>
          <div>• Am Montag habe ich einen Termin.</div>
          <div>• Um 10 Uhr komme ich.</div>
          <div style={{ marginTop: 8 }}>
            <strong>Mini pattern you can copy:</strong>
            <div>• Im + Monat … / Am + Tag/Datum … / Um + Uhrzeit …</div>
          </div>
        </div>
      </section>

      {/* 4) CONNECTORS (UND/ABER/WEIL) but only WEIL examples */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>4) Simple A1 connectors (focus: weil)</h2>

        <ul style={listStyle}>
          <li>
            <strong>und</strong>: Ich komme heute nicht, <strong>und</strong> ich schreibe Ihnen.
          </li>
          <li>
            <strong>aber</strong>: Ich möchte kommen, <strong>aber</strong> es regnet stark.
          </li>
        </ul>

        <div style={noteStyle}>
          <strong>Important: “weil” = because</strong>
          <div>✅ With <strong>weil</strong>, the <strong>verb goes to the end</strong>.</div>
          <div style={{ marginTop: 8 }}>
            <strong>Only “weil” examples (A1):</strong>
            <div>• Ich komme heute nicht, weil es regnet.</div>
            <div>• Ich kann nicht zum Strand gehen, weil es regnet.</div>
            <div>• Ich fahre nicht ans Meer, weil es windig ist.</div>
            <div>• Ich bleibe zu Hause, weil es kalt ist.</div>
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>Strand &amp; Meer (simple A1):</strong>
            <div>• der Strand = beach</div>
            <div>• das Meer = sea</div>
            <div style={{ marginTop: 6 }}>
              <strong>Useful verbs:</strong>
              <div>• zum Strand gehen</div>
              <div>• ans Meer fahren</div>
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>Letter tip:</strong> Use <strong>weil</strong> to give one clear reason.
            <div>Example idea: “Ich schreibe Ihnen, weil …”</div>
          </div>
        </div>
      </section>

      {/* 5) LETTER STEPS: TERMIN ABSAGEN */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>5) Letter steps: Termin absagen (A1)</h2>

        <ol style={listStyle}>
          <li>
            <strong>Greeting:</strong> Sehr geehrte Damen und Herren,
          </li>
          <li>
            <strong>Cancel:</strong> Ich möchte den Termin absagen.
          </li>
          <li>
            <strong>Reason (weil + verb at end):</strong> Ich kann heute nicht kommen, weil es regnet.
          </li>
          <li>
            <strong>Request a new appointment:</strong> Können wir einen neuen Termin machen?
          </li>
          <li>
            <strong>Polite ending:</strong> Ich freue mich auf Ihre Antwort. Mit freundlichen Grüßen
          </li>
        </ol>

        <div style={boxStyle}>
          <p style={{ margin: 0 }}>
            <strong>Mini sample (formal):</strong>
          </p>
          <p style={{ margin: "10px 0 0" }}>Sehr geehrte Damen und Herren,</p>
          <p style={{ margin: "10px 0 0" }}>
            ich möchte den Termin absagen, weil es heute stark regnet.
          </p>
          <p style={{ margin: "10px 0 0" }}>Können wir einen neuen Termin für nächste Woche machen?</p>
          <p style={{ margin: "10px 0 0" }}>Ich freue mich auf Ihre Antwort.</p>
          <p style={{ margin: "10px 0 0" }}>
            Mit freundlichen Grüßen <br />
            [Ihr Name]
          </p>
        </div>
      </section>

      {/* 6) LETTER SAMPLE: URLAUB + WEATHER */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>6) Letter sample: Urlaub + weather reason (A1)</h2>

        <div style={noteStyle}>
          <strong>Goal:</strong> Students learn to connect <strong>Urlaub</strong> with <strong>im/am/um</strong> and
          give one simple reason using <strong>weil</strong>.
          <div style={{ marginTop: 8 }}>
            <strong>Key word:</strong> der Urlaub = vacation/holiday
          </div>
        </div>

        <div style={boxStyle}>
          <p style={{ margin: 0 }}>
            <strong>Sample letter (A1 – simple):</strong>
          </p>

          <p style={{ margin: "10px 0 0" }}>Sehr geehrte Damen und Herren,</p>

          <p style={{ margin: "10px 0 0" }}>
            ich schreibe Ihnen, weil ich im August im Urlaub bin.
          </p>

          <p style={{ margin: "10px 0 0" }}>
            Ich kann am Montag um 10 Uhr nicht kommen, weil es regnet.
          </p>

          <p style={{ margin: "10px 0 0" }}>
            Können wir einen neuen Termin machen?
          </p>

          <p style={{ margin: "10px 0 0" }}>
            Ich freue mich auf Ihre Antwort.
          </p>

          <p style={{ margin: "10px 0 0" }}>
            Mit freundlichen Grüßen <br />
            [Ihr Name]
          </p>
        </div>
      </section>

      {/* 7) W-WORDS + BASIC VERBS + REQUESTS */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>7) Question words + Haben / Essen / Kaufen + Polite request</h2>

        <div style={boxStyle}>
          <p style={{ margin: 0 }}>
            <strong>W-Fragen (A1):</strong>
          </p>
          <ul style={listStyle}>
            <li>
              <strong>Wo?</strong> (Where?) — Wo ist der Strand?
            </li>
            <li>
              <strong>Was?</strong> (What?) — Was essen Sie?
            </li>
            <li>
              <strong>Wie?</strong> (How?) — Wie ist das Wetter?
            </li>
            <li>
              <strong>Wann?</strong> (When?) — Wann ist der Termin?
            </li>
          </ul>

          <p style={{ margin: "10px 0 0" }}>
            <strong>Useful verbs:</strong>
          </p>
          <ul style={listStyle}>
            <li>
              <strong>haben</strong>: Ich habe einen Termin.
            </li>
            <li>
              <strong>essen</strong>: Ich esse gern Reis.
            </li>
            <li>
              <strong>kaufen</strong>: Ich kaufe Brot.
            </li>
          </ul>
        </div>

        <div style={noteStyle}>
          <strong>Polite request (A1): “Könnten Sie …?”</strong>
          <div>✅ Rule: In the request, the <strong>main verb goes to the end</strong>.</div>

          <div style={{ marginTop: 8 }}>
            <strong>Examples:</strong>
            <div>• Könnten Sie mir bitte helfen?</div>
            <div>• Könnten Sie mir einen neuen Termin geben?</div>
            <div>• Könnten Sie mir sagen, wann der Termin ist?</div>
            <div>• Könnten Sie mir sagen, wo der Strand ist?</div>
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>Weather connection (usable in letters):</strong>
            <div>• Könnten Sie mir bitte einen neuen Termin geben, weil es regnet?</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>
              (Yes, it’s simple A1. Later you can learn more elegant options, but this is fine for now.)
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WeatherPerfektLetterPage;
