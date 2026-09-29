import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 10 };
const paragraph = { margin: 0, lineHeight: 1.78 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.8 };

const GrammarContent = () => (
  <div style={{ display: "grid", gap: 16 }}>
    <header style={card}>
      <h1 style={{ ...styles.title, margin: 0 }}>A2 Day 24 · Einen Urlaub planen</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>
        Grammar: <strong>Reiseziele</strong>, <strong>Verkehrsmittel</strong>, <strong>Unterkunft</strong>, <strong>möchte + Infinitiv</strong> und <strong>weil</strong>.
      </p>
      <p style={paragraph}>
        <strong>Learning goal:</strong> Plan a holiday in connected sentences: say where you are going, how you are travelling,
        where you are staying and why you chose the plan.
      </p>
    </header>

    <section style={card}>
      <h2 style={{ margin: 0 }}>1. Wohin? · nach, in + Akkusativ, an + Akkusativ</h2>
      <p style={paragraph}>
        The preposition changes with the type of destination. For movement toward a destination, ask <strong>Wohin?</strong>
      </p>
      <ul style={list}>
        <li><strong>nach</strong> + city/country without an article: Wir fahren <strong>nach Berlin</strong>. / Ich fliege <strong>nach Deutschland</strong>.</li>
        <li><strong>in + Akkusativ</strong> + country/place with an article: Wir fahren <strong>in die Schweiz</strong>. / Sie fliegt <strong>in die Türkei</strong>.</li>
        <li><strong>an + Akkusativ</strong> + coast/water destination: Wir fahren <strong>an die Ostsee</strong>. / Ich möchte <strong>ans Meer</strong> fahren.</li>
      </ul>
      <p style={paragraph}>
        <strong>Remember:</strong> <em>an das</em> becomes <strong>ans</strong>. Do not say <em>nach Schweiz</em>; say <strong>in die Schweiz</strong>.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>2. Verkehrsmittel · mit + Dativ</h2>
      <p style={paragraph}>
        Use <strong>mit + Dativ</strong> to say how you travel.
      </p>
      <ul style={list}>
        <li>Wir fahren <strong>mit dem Zug</strong>.</li>
        <li>Ich fahre <strong>mit dem Bus</strong> zum Flughafen.</li>
        <li>Sie fährt <strong>mit der Bahn</strong>.</li>
        <li>Wir reisen <strong>mit dem Auto</strong>.</li>
        <li>Ich fliege <strong>mit dem Flugzeug</strong>.</li>
      </ul>
      <p style={paragraph}><strong>Fixed expression:</strong> <strong>zu Fuß</strong>, not <em>mit Fuß</em>.</p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>3. Wohin? vs. Wo? · ins Hotel / im Hotel</h2>
      <p style={paragraph}>
        When there is movement toward a place, use <strong>Akkusativ</strong>. When you are already at the place, use <strong>Dativ</strong>.
      </p>
      <ul style={list}>
        <li><strong>Wohin?</strong> Wir gehen <strong>ins Hotel</strong>. <span style={{ opacity: 0.8 }}>(in das Hotel)</span></li>
        <li><strong>Wo?</strong> Wir übernachten <strong>im Hotel</strong>. <span style={{ opacity: 0.8 }}>(in dem Hotel)</span></li>
        <li>Wir wohnen <strong>in einer Ferienwohnung</strong>.</li>
        <li>Sie übernachten <strong>in einer Pension</strong>.</li>
      </ul>
      <p style={paragraph}>
        <strong>Memory rule:</strong> destination/movement = <strong>Wohin? + Akkusativ</strong>; location = <strong>Wo? + Dativ</strong>.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>4. möchte + Infinitiv</h2>
      <p style={paragraph}>
        Use <strong>möchte / möchten</strong> for wishes and plans. The second verb goes to the end in the infinitive.
      </p>
      <ul style={list}>
        <li>Ich <strong>möchte</strong> im Juli nach Hamburg <strong>fahren</strong>.</li>
        <li>Wir <strong>möchten</strong> ein Hotel <strong>buchen</strong>.</li>
        <li>Ich <strong>möchte</strong> am Meer <strong>schwimmen</strong>.</li>
        <li>Wir <strong>möchten</strong> die Altstadt <strong>besuchen</strong>.</li>
      </ul>
      <p style={paragraph}>
        <strong>Wrong:</strong> Ich möchte fahre nach Berlin. <br />
        <strong>Correct:</strong> Ich möchte nach Berlin <strong>fahren</strong>.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>5. Give a reason with weil</h2>
      <p style={paragraph}>
        Use <strong>weil</strong> to explain why you choose a destination, transport option or accommodation.
        In the <strong>weil</strong>-clause, the conjugated verb goes to the end.
      </p>
      <ul style={list}>
        <li>Wir fahren mit dem Zug, <strong>weil er bequem ist</strong>.</li>
        <li>Ich buche das Hotel, <strong>weil es günstig ist</strong>.</li>
        <li>Wir fahren ans Meer, <strong>weil wir dort schwimmen möchten</strong>.</li>
        <li>Ich reise im August, <strong>weil ich dann Urlaub habe</strong>.</li>
      </ul>
      <p style={paragraph}>
        <strong>Pattern:</strong> Hauptsatz + <strong>weil</strong> + subject + rest + <strong>verb at the end</strong>.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>6. Put the plan together</h2>
      <p style={paragraph}>
        <strong>Example:</strong> Im August möchten wir <strong>in die Schweiz fahren</strong>. Wir reisen <strong>mit dem Zug</strong>.
        Wir möchten <strong>in einem kleinen Hotel übernachten</strong>. Dort möchten wir wandern und die Stadt besuchen.
        Wir wählen dieses Reiseziel, <strong>weil die Landschaft sehr schön ist</strong>.
      </p>
      <p style={paragraph}>
        A strong A2 answer connects <strong>time + destination + transport + accommodation + activity + reason</strong> instead of writing unrelated sentences.
      </p>
    </section>

    <A2MiniLearningBlock
      title="Knowledge Test · Urlaub planen"
      english="Choose the correct destination preposition, transport case, location form and word order before you write your own holiday plan."
      rule="Use nach for cities/countries without an article, in/an + accusative for destinations, mit + dative for transport, dative for a fixed location, the infinitive at the end after möchte, and the conjugated verb at the end after weil."
      examples={[
        "Wir fahren nach Berlin.",
        "Wir fahren in die Schweiz.",
        "Ich möchte ans Meer fahren.",
        "Wir reisen mit dem Zug.",
        "Wir übernachten im Hotel.",
        "Ich buche das Hotel, weil es günstig ist.",
      ]}
      commonMistake="Do not mix destination and location: Wir gehen ins Hotel (Wohin?), but wir übernachten im Hotel (Wo?)."
      questions={[
        { stem: "Im Sommer fahren wir ___ Berlin.", options: ["nach", "in die", "an"], answer: 0, explanation: "Cities use nach." },
        { stem: "Nächstes Jahr fahren wir ___ Schweiz.", options: ["nach", "in die", "zu der"], answer: 1, explanation: "die Schweiz has an article, so use in + accusative: in die Schweiz." },
        { stem: "Wir reisen ___ Zug.", options: ["mit der", "mit dem", "mit den"], answer: 1, explanation: "mit takes dative: der Zug → dem Zug." },
        { stem: "Wir sind schon angekommen. Jetzt übernachten wir ___.", options: ["ins Hotel", "im Hotel", "nach Hotel"], answer: 1, explanation: "Wo? A fixed location uses dative: im Hotel." },
        { stem: "Which sentence is correct?", options: ["Ich möchte besuche Wien.", "Ich möchte Wien besuchen.", "Ich Wien möchte besuchen."], answer: 1, explanation: "After möchte, the infinitive goes to the end." },
        { stem: "Which weil-clause is correct?", options: ["weil das Hotel ist günstig", "weil ist das Hotel günstig", "weil das Hotel günstig ist"], answer: 2, explanation: "In a weil-clause, the conjugated verb goes to the end." },
      ]}
      outputPrompt="Plane einen Urlaub in 6 Sätzen. Nenne Zeitraum, Reiseziel, Verkehrsmittel, Unterkunft, eine Aktivität und einen Grund mit weil."
      starters={[
        "Im ... möchte ich ...",
        "Ich fahre/fliege nach/in/an ...",
        "Ich reise mit ...",
        "Ich übernachte ...",
        "Dort möchte ich ...",
        "Ich wähle dieses Ziel, weil ...",
      ]}
    />
  </div>
);

export default function A2Day24EinenUrlaubPlanenGrammarPage({ embedded = false }) {
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
