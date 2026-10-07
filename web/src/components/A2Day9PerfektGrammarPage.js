import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 10 };
const paragraph = { margin: 0, lineHeight: 1.78 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.8 };
const grid = { display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" };
const miniCard = { border: "1px solid #dbe3ea", borderRadius: 12, padding: 14, background: "#fff", display: "grid", gap: 6 };

const GrammarContent = () => (
  <div style={{ display: "grid", gap: 16 }} data-a2-day9-real-grammar-notes="true">
    <header style={card}>
      <h1 style={{ ...styles.title, margin: 0 }}>A2 Day 9 · Urlaub</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>
        Grammar: <strong>Perfekt</strong> for talking about holidays and completed past events.
      </p>
      <p style={paragraph}>
        <strong>Learning goal:</strong> Say where you went, how you travelled, what you did and what happened,
        using <strong>haben/sein + Partizip II</strong> with correct word order.
      </p>
    </header>

    <section style={card}>
      <h2 style={{ margin: 0 }}>1. The basic Perfekt structure</h2>
      <p style={paragraph}>
        In spoken German, the <strong>Perfekt</strong> is the normal tense for many completed past events.
        It has two parts: a conjugated form of <strong>haben</strong> or <strong>sein</strong> and a
        <strong> Partizip II</strong>.
      </p>
      <div style={grid}>
        <div style={miniCard}>
          <strong>haben + Partizip II</strong>
          <span>Ich <strong>habe</strong> ein Hotel <strong>gebucht</strong>.</span>
          <span>Wir <strong>haben</strong> die Altstadt <strong>besucht</strong>.</span>
        </div>
        <div style={miniCard}>
          <strong>sein + Partizip II</strong>
          <span>Wir <strong>sind</strong> nach Berlin <strong>gefahren</strong>.</span>
          <span>Der Zug <strong>ist</strong> spät <strong>angekommen</strong>.</span>
        </div>
      </div>
      <p style={paragraph}>
        <strong>Word order:</strong> the conjugated auxiliary is normally in <strong>position 2</strong>.
        The Partizip II usually goes to the <strong>end</strong>.
      </p>
      <ul style={list}>
        <li>Ich <strong>habe</strong> am Samstag ein Hotel <strong>gebucht</strong>.</li>
        <li>Am Samstag <strong>habe</strong> ich ein Hotel <strong>gebucht</strong>.</li>
        <li>Wir <strong>sind</strong> am Morgen nach Hamburg <strong>gefahren</strong>.</li>
      </ul>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>2. When do we use haben?</h2>
      <p style={paragraph}>
        Use <strong>haben</strong> with most verbs, especially activities and verbs that take an object.
        For holiday stories, many common actions use <strong>haben</strong>.
      </p>
      <div style={grid}>
        {[
          ["buchen", "Wir haben ein Zimmer gebucht."],
          ["besuchen", "Wir haben ein Museum besucht."],
          ["machen", "Ich habe viele Fotos gemacht."],
          ["essen", "Wir haben im Hotel gegessen."],
          ["kaufen", "Ich habe Souvenirs gekauft."],
          ["sehen", "Wir haben die Berge gesehen."],
        ].map(([verb, example]) => (
          <div key={verb} style={miniCard}><strong>{verb}</strong><span>{example}</span></div>
        ))}
      </div>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>3. When do we use sein?</h2>
      <p style={paragraph}>
        Use <strong>sein</strong> mainly with verbs that express movement from one place to another or a change of state.
        A few very common verbs such as <strong>bleiben</strong> also use sein.
      </p>
      <div style={grid}>
        {[
          ["fahren → gefahren", "Wir sind nach München gefahren."],
          ["fliegen → geflogen", "Sie ist nach Spanien geflogen."],
          ["gehen → gegangen", "Wir sind am Abend spazieren gegangen."],
          ["kommen → gekommen", "Meine Freunde sind später gekommen."],
          ["ankommen → angekommen", "Der Zug ist um 18 Uhr angekommen."],
          ["bleiben → geblieben", "Wir sind drei Tage im Hotel geblieben."],
        ].map(([verb, example]) => (
          <div key={verb} style={miniCard}><strong>{verb}</strong><span>{example}</span></div>
        ))}
      </div>
      <p style={paragraph}>
        <strong>Important:</strong> not every verb connected with travel automatically takes sein.
        <em> ein Hotel buchen</em>, <em>ein Museum besuchen</em> and <em>Fotos machen</em> still use <strong>haben</strong>.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>4. How to form the Partizip II</h2>
      <div style={grid}>
        <div style={miniCard}>
          <strong>Regular verbs: ge- + stem + -t</strong>
          <span>machen → <strong>gemacht</strong></span>
          <span>kaufen → <strong>gekauft</strong></span>
          <span>reisen → <strong>gereist</strong></span>
        </div>
        <div style={miniCard}>
          <strong>Irregular verbs: learn the form</strong>
          <span>fahren → <strong>gefahren</strong></span>
          <span>sehen → <strong>gesehen</strong></span>
          <span>essen → <strong>gegessen</strong></span>
          <span>nehmen → <strong>genommen</strong></span>
        </div>
        <div style={miniCard}>
          <strong>Separable verbs: prefix + ge + verb</strong>
          <span>ankommen → <strong>angekommen</strong></span>
          <span>einkaufen → <strong>eingekauft</strong></span>
          <span>abfahren → <strong>abgefahren</strong></span>
        </div>
        <div style={miniCard}>
          <strong>No ge- with inseparable prefixes</strong>
          <span>besuchen → <strong>besucht</strong></span>
          <span>bezahlen → <strong>bezahlt</strong></span>
          <span>verlieren → <strong>verloren</strong></span>
        </div>
        <div style={miniCard}>
          <strong>-ieren verbs: no ge-</strong>
          <span>reservieren → <strong>reserviert</strong></span>
          <span>fotografieren → <strong>fotografiert</strong></span>
          <span>organisieren → <strong>organisiert</strong></span>
        </div>
      </div>
      <p style={paragraph}>
        Common inseparable prefixes include <strong>be-, emp-, ent-, er-, ge-, miss-, ver-, zer-</strong>.
        These verbs normally do not add <strong>ge-</strong> in the Partizip II.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>5. Questions about a past holiday</h2>
      <p style={paragraph}>
        In a yes/no question, the auxiliary comes first. In a W-question, the question word comes first,
        then the auxiliary.
      </p>
      <ul style={list}>
        <li><strong>Bist</strong> du nach Berlin <strong>gefahren</strong>?</li>
        <li><strong>Hast</strong> du ein Hotel <strong>gebucht</strong>?</li>
        <li>Wo <strong>bist</strong> du <strong>gewesen</strong>?</li>
        <li>Was <strong>hast</strong> du dort <strong>gemacht</strong>?</li>
        <li>Mit wem <strong>bist</strong> du <strong>gereist</strong>?</li>
        <li>Wie lange <strong>seid</strong> ihr dort <strong>geblieben</strong>?</li>
      </ul>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>6. Tell the holiday story in a clear order</h2>
      <p style={paragraph}>
        A good A2 answer is easier to understand when you organise events with time words:
        <strong> zuerst, dann, danach, später, am Abend, am nächsten Tag, am Ende</strong>.
      </p>
      <p style={paragraph}>
        <strong>Example:</strong> Letztes Jahr <strong>bin ich nach Hamburg gefahren</strong>.
        Zuerst <strong>habe ich im Hotel eingecheckt</strong>. Danach <strong>habe ich die Stadt besichtigt</strong>.
        Am Abend <strong>bin ich in ein Restaurant gegangen</strong>. Am nächsten Tag
        <strong> habe ich eine Hafenrundfahrt gemacht</strong>. Am Ende <strong>bin ich müde, aber glücklich nach Hause gefahren</strong>.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>7. Typical mistakes to avoid</h2>
      <ul style={list}>
        <li>
          <strong>Wrong:</strong> Ich habe nach Berlin gefahren. · <strong>Correct:</strong> Ich bin nach Berlin gefahren.
        </li>
        <li>
          <strong>Wrong:</strong> Wir sind ein Museum besucht. · <strong>Correct:</strong> Wir haben ein Museum besucht.
        </li>
        <li>
          <strong>Wrong:</strong> Ich habe gebucht gestern ein Zimmer. · <strong>Correct:</strong> Ich habe gestern ein Zimmer gebucht.
        </li>
        <li>
          <strong>Wrong:</strong> Ich habe gereserviert. · <strong>Correct:</strong> Ich habe reserviert.
        </li>
        <li>
          <strong>Wrong:</strong> Wir haben angekommen. · <strong>Correct:</strong> Wir sind angekommen.
        </li>
      </ul>
    </section>

    <A2MiniLearningBlock
      title="Knowledge Test · Perfekt im Urlaub"
      english="Choose the correct auxiliary, past participle and word order for a short holiday story."
      rule="Perfekt = haben/sein in position 2 + Partizip II at the end. Most verbs use haben; many movement/change verbs and bleiben use sein."
      examples={[
        "Ich habe ein Hotel gebucht.",
        "Wir sind nach Berlin gefahren.",
        "Am Abend haben wir gut gegessen.",
        "Der Zug ist spät angekommen.",
      ]}
      commonMistake="Do not choose sein simply because the topic is travel. Use sein for verbs such as fahren, fliegen, gehen, kommen and ankommen; use haben with buchen, besuchen, machen and many other activities."
      questions={[
        {
          stem: "Ich ___ nach Hamburg gefahren.",
          options: ["habe", "bin", "werde"],
          answer: 1,
          explanation: "fahren with movement from one place to another uses sein: ich bin gefahren.",
        },
        {
          stem: "Wir ___ ein Museum besucht.",
          options: ["haben", "sind", "werden"],
          answer: 0,
          explanation: "besuchen uses haben: wir haben besucht.",
        },
        {
          stem: "machen → Partizip II",
          options: ["gemacht", "gemachen", "machtge"],
          answer: 0,
          explanation: "Regular verb: ge- + mach + -t = gemacht.",
        },
        {
          stem: "reservieren → Partizip II",
          options: ["gereserviert", "reserviert", "reservieren"],
          answer: 1,
          explanation: "Verbs ending in -ieren do not take ge-: reserviert.",
        },
        {
          stem: "ankommen → Partizip II",
          options: ["geankommt", "angekommen", "angekommt"],
          answer: 1,
          explanation: "Separable verb: an + ge + kommen = angekommen.",
        },
        {
          stem: "Welche Wortstellung ist richtig?",
          options: [
            "Am Samstag ich habe ein Hotel gebucht.",
            "Am Samstag habe ich ein Hotel gebucht.",
            "Am Samstag habe gebucht ich ein Hotel.",
          ],
          answer: 1,
          explanation: "With a time phrase first, the auxiliary stays in position 2: Am Samstag habe ich … gebucht.",
        },
        {
          stem: "Welche Frage ist richtig?",
          options: [
            "Wo du bist gewesen?",
            "Wo bist du gewesen?",
            "Wo gewesen bist du?",
          ],
          answer: 1,
          explanation: "W-question: question word + conjugated auxiliary + subject + … + participle.",
        },
        {
          stem: "Wir ___ drei Tage im Hotel geblieben.",
          options: ["haben", "sind", "werden"],
          answer: 1,
          explanation: "bleiben is a common verb that uses sein in the Perfekt: wir sind geblieben.",
        },
      ]}
      outputPrompt="Erzähle in 5–6 Sätzen von deinem letzten Urlaub oder Wochenende. Benutze mindestens zwei Verben mit haben, zwei mit sein und Zeitwörter wie zuerst, dann oder danach."
      starters={[
        "Letztes Jahr bin ich ...",
        "Zuerst habe ich ...",
        "Danach sind wir ...",
        "Am Abend habe ich ...",
        "Am nächsten Tag sind wir ...",
      ]}
    />
  </div>
);

export default function A2Day9PerfektGrammarPage({ embedded = false }) {
  if (embedded) return <GrammarContent />;

  return (
    <main style={styles.pageWrap}>
      <div style={{ ...styles.container, display: "grid", gap: 16 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <GrammarContent />
      </div>
    </main>
  );
}
