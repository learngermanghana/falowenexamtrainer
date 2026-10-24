import React, { memo } from "react";
import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
  border: "1px solid #dbeafe",
  borderRadius: 16,
};

const pairCard = {
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 7,
};

const prepositions = ["an", "auf", "hinter", "in", "neben", "über", "unter", "vor", "zwischen"];

const articleRows = [
  ["der", "dem", "den"],
  ["die", "der", "die"],
  ["das", "dem", "das"],
  ["die (Plural)", "den (+n)", "die"],
];

const shortcutRows = [
  ["in dem", "im", "Wo? · Dativ", "in dem Café → im Café"],
  ["in das", "ins", "Wohin? · Akkusativ", "in das Café → ins Café"],
  ["an dem", "am", "Wo? · Dativ", "an dem Meer → am Meer"],
  ["an das", "ans", "Wohin? · Akkusativ", "an das Meer → ans Meer"],
];

const examples = [
  {
    noun: "das Café",
    woFull: "Wir treffen uns in dem Café.",
    woShort: "Wir treffen uns im Café.",
    wohinFull: "Wir gehen in das Café.",
    wohinShort: "Wir gehen ins Café.",
    change: "dem → das",
  },
  {
    noun: "der Park",
    woFull: "Wir sind in dem Park.",
    woShort: "Wir sind im Park.",
    wohinFull: "Wir gehen in den Park.",
    wohinShort: "Wir gehen in den Park.",
    change: "dem → den",
  },
  {
    noun: "der See",
    woFull: "Wir warten an dem See.",
    woShort: "Wir warten am See.",
    wohinFull: "Wir fahren an den See.",
    wohinShort: "Wir fahren an den See.",
    change: "dem → den",
  },
  {
    noun: "das Meer",
    woFull: "Wir sind an dem Meer.",
    woShort: "Wir sind am Meer.",
    wohinFull: "Wir fahren an das Meer.",
    wohinShort: "Wir fahren ans Meer.",
    change: "dem → das",
  },
  {
    noun: "der Markt",
    woFull: "Wir treffen uns auf dem Markt.",
    woShort: "Wir treffen uns auf dem Markt.",
    wohinFull: "Wir gehen auf den Markt.",
    wohinShort: "Wir gehen auf den Markt.",
    change: "dem → den",
  },
];

const WoTreffenUnsGrammarPage = () => (
  <div style={{ display: "grid", gap: 14 }}>
    <section style={{ ...card, background: "#f8fbff" }}>
      <div>
        <div style={{ fontWeight: 900, color: "#1d4ed8" }}>A2 · Grammar</div>
        <h2 style={{ margin: "4px 0 0" }}>Wo? oder Wohin?</h2>
      </div>

      <p style={{ margin: 0, lineHeight: 1.75 }}>
        Do not memorise <strong>im, ins, am</strong> and <strong>ans</strong> as separate words first.
        Start with the <strong>full preposition + article</strong>, decide the case, and only then use the short form.
      </p>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={pairCard}>
          <strong>Wo? = Where?</strong>
          <span>Something is located at a place → <strong>Dativ</strong>.</span>
          <span><strong>Wo treffen wir uns?</strong> — Wir treffen uns <strong>in dem Café</strong> → <strong>im Café</strong>.</span>
        </div>

        <div style={pairCard}>
          <strong>Wohin? = Where to?</strong>
          <span>The destination changes: someone or something goes to a place → <strong>Akkusativ</strong>.</span>
          <span><strong>Wohin gehen wir?</strong> — Wir gehen <strong>in das Café</strong> → <strong>ins Café</strong>.</span>
        </div>
      </div>

    </section>

    <section style={card}>
      <h3 style={{ margin: 0 }}>1. First know the article</h3>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        The noun already has a gender: <strong>der Park</strong>, <strong>der See</strong>, <strong>der Markt</strong>,
        {" "}<strong>das Café</strong>, <strong>das Meer</strong>. The question <strong>Wo? / Wohin?</strong> changes the case,
        and the case changes the article.
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: 9, border: "1px solid #e2e8f0", textAlign: "left" }}>Basic article</th>
              <th style={{ padding: 9, border: "1px solid #e2e8f0", textAlign: "left" }}>Wo? · Dativ</th>
              <th style={{ padding: 9, border: "1px solid #e2e8f0", textAlign: "left" }}>Wohin? · Akkusativ</th>
            </tr>
          </thead>
          <tbody>
            {articleRows.map(([base, dative, accusative]) => (
              <tr key={base}>
                <td style={{ padding: 9, border: "1px solid #e2e8f0" }}><strong>{base}</strong></td>
                <td style={{ padding: 9, border: "1px solid #e2e8f0" }}>{dative}</td>
                <td style={{ padding: 9, border: "1px solid #e2e8f0" }}>{accusative}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <strong>What actually changes?</strong>
        <span><strong>der Park</strong> → in <strong>dem</strong> Park / in <strong>den</strong> Park</span>
        <span><strong>das Café</strong> → in <strong>dem</strong> Café / in <strong>das</strong> Café</span>
        <span><strong>der See</strong> → an <strong>dem</strong> See / an <strong>den</strong> See</span>
        <span><strong>das Meer</strong> → an <strong>dem</strong> Meer / an <strong>das</strong> Meer</span>
      </div>
    </section>

    <section style={card}>
      <h3 style={{ margin: 0 }}>2. Then learn the short forms</h3>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        German often combines the preposition and article. The meaning does not change; it is simply a shorter form.
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: 9, border: "1px solid #e2e8f0", textAlign: "left" }}>Full form</th>
              <th style={{ padding: 9, border: "1px solid #e2e8f0", textAlign: "left" }}>Short form</th>
              <th style={{ padding: 9, border: "1px solid #e2e8f0", textAlign: "left" }}>Used for</th>
              <th style={{ padding: 9, border: "1px solid #e2e8f0", textAlign: "left" }}>Example</th>
            </tr>
          </thead>
          <tbody>
            {shortcutRows.map(([full, short, use, example]) => (
              <tr key={full}>
                <td style={{ padding: 9, border: "1px solid #e2e8f0" }}>{full}</td>
                <td style={{ padding: 9, border: "1px solid #e2e8f0" }}><strong>{short}</strong></td>
                <td style={{ padding: 9, border: "1px solid #e2e8f0" }}>{use}</td>
                <td style={{ padding: 9, border: "1px solid #e2e8f0" }}>{example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 12, padding: 12, lineHeight: 1.75 }}>
        <strong>Why “am See” but not “ans See”?</strong>
        <br />
        <strong>der See</strong> is masculine. Akkusativ is <strong>den See</strong>, so we say <strong>an den See</strong>.
        <br />
        <strong>das Meer</strong> is neuter. Akkusativ is <strong>das Meer</strong>, so <strong>an das Meer</strong> can become <strong>ans Meer</strong>.
      </div>
    </section>

    <section style={card}>
      <h3 style={{ margin: 0 }}>3. Wechselpräpositionen</h3>
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
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        These are called <strong>Wechselpräpositionen</strong> because they can take either Dativ or Akkusativ.
        The preposition itself usually stays the same; the <strong>article shows the case change</strong>.
        Important: movement alone does not automatically mean Akkusativ. Ask whether the sentence answers <strong>Wo?</strong> or <strong>Wohin?</strong>.
      </p>
    </section>

    <section style={card}>
      <h3 style={{ margin: 0 }}>4. See the full form before the shortcut</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {examples.map(({ noun, woFull, woShort, wohinFull, wohinShort, change }) => (
          <div key={noun} style={pairCard}>
            <strong>{noun}</strong>
            <div>
              <strong>Wo? · Dativ:</strong> {woFull}
              {woFull !== woShort ? <><br /><span>Short form: <strong>{woShort}</strong></span></> : null}
            </div>
            <div>
              <strong>Wohin? · Akkusativ:</strong> {wohinFull}
              {wohinFull !== wohinShort ? <><br /><span>Short form: <strong>{wohinShort}</strong></span></> : null}
            </div>
            <div style={{ color: "#475569" }}>
              Article change: <strong>{change}</strong>
            </div>
          </div>
        ))}
      </div>

      <div style={{ border: "1px solid #bbf7d0", background: "#f0fdf4", borderRadius: 12, padding: 12, lineHeight: 1.75 }}>
        <strong>Decision routine:</strong> noun article → ask <strong>Wo?</strong> or <strong>Wohin?</strong> → choose Dativ or Akkusativ → choose the full article → use a short form if German has one.
      </div>
    </section>
  </div>
);

export default memo(WoTreffenUnsGrammarPage);
