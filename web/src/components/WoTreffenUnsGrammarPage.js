import React, { memo } from "react";
import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 10,
  border: "1px solid #dbeafe",
  borderRadius: 16,
};

const pairCard = {
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 6,
};

const prepositions = ["an", "auf", "hinter", "in", "neben", "über", "unter", "vor", "zwischen"];

const articleRows = [
  ["der", "dem", "den"],
  ["die", "der", "die"],
  ["das", "dem", "das"],
  ["die (Plural)", "den (+n)", "die"],
];

const examples = [
  ["Wir treffen uns im Café.", "Wir gehen ins Café."],
  ["Wir sind im Park.", "Wir gehen in den Park."],
  ["Wir warten am See.", "Wir fahren an den See."],
  ["Wir treffen uns auf dem Markt.", "Wir gehen auf den Markt."],
];

const WoTreffenUnsGrammarPage = () => (
  <div style={{ display: "grid", gap: 14 }}>
    <section style={{ ...card, background: "#f8fbff" }}>
      <div>
        <div style={{ fontWeight: 900, color: "#1d4ed8" }}>A2 · Grammar</div>
        <h2 style={{ margin: "4px 0 0" }}>Wo? oder Wohin?</h2>
      </div>

      <p style={{ margin: 0, lineHeight: 1.7 }}>
        These prepositions can use <strong>Dativ</strong> or <strong>Akkusativ</strong>.
        First decide: <strong>location</strong> or <strong>movement to a place</strong>?
      </p>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={pairCard}>
          <strong>Wo? = Where?</strong>
          <span>Location / position → <strong>Dativ</strong></span>
          <span><strong>Wo treffen wir uns?</strong> — Wir treffen uns <strong>im Café</strong>.</span>
        </div>

        <div style={pairCard}>
          <strong>Wohin? = Where to?</strong>
          <span>Movement / destination → <strong>Akkusativ</strong></span>
          <span><strong>Wohin gehen wir?</strong> — Wir gehen <strong>ins Café</strong>.</span>
        </div>
      </div>

      <p style={{ margin: 0, lineHeight: 1.7 }}>
        <strong>Important for today:</strong> <em>Wir treffen uns ...</em> answers <strong>Wo?</strong>,
        so use the location form: <strong>im Park, im Café, am Bahnhof, vor dem Kino</strong>.
      </p>
    </section>

    <section style={card}>
      <h3 style={{ margin: 0 }}>Wechselpräpositionen</h3>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {prepositions.map((item) => (
          <span
            key={item}
            style={{
              border: "1px solid #bfdbfe",
              borderRadius: 999,
              padding: "5px 9px",
              background: "#eff6ff",
              fontWeight: 700,
            }}
          >
            {item}
          </span>
        ))}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: 9, border: "1px solid #e2e8f0", textAlign: "left" }}>Article</th>
              <th style={{ padding: 9, border: "1px solid #e2e8f0", textAlign: "left" }}>Wo? · Dativ</th>
              <th style={{ padding: 9, border: "1px solid #e2e8f0", textAlign: "left" }}>Wohin? · Akkusativ</th>
            </tr>
          </thead>
          <tbody>
            {articleRows.map(([base, dative, accusative]) => (
              <tr key={base}>
                <td style={{ padding: 9, border: "1px solid #e2e8f0" }}>{base}</td>
                <td style={{ padding: 9, border: "1px solid #e2e8f0" }}><strong>{dative}</strong></td>
                <td style={{ padding: 9, border: "1px solid #e2e8f0" }}><strong>{accusative}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ margin: 0, color: "#475569" }}>
        Short forms: <strong>im = in dem</strong> · <strong>ins = in das</strong> ·
        {" "}<strong>am = an dem</strong> · <strong>ans = an das</strong>
      </p>
    </section>

    <section style={card}>
      <h3 style={{ margin: 0 }}>See the difference</h3>
      <div style={{ display: "grid", gap: 8 }}>
        {examples.map(([wo, wohin]) => (
          <div key={wo} style={pairCard}>
            <div><strong>Wo?</strong> {wo}</div>
            <div><strong>Wohin?</strong> {wohin}</div>
          </div>
        ))}
      </div>

      <div style={{ border: "1px solid #bbf7d0", background: "#f0fdf4", borderRadius: 12, padding: 12, lineHeight: 1.7 }}>
        <strong>Remember:</strong> no change of place → <strong>Wo? + Dativ</strong>.
        Movement to a destination → <strong>Wohin? + Akkusativ</strong>.
      </div>
    </section>
  </div>
);

export default memo(WoTreffenUnsGrammarPage);
