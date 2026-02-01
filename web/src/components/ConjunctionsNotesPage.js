import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const Section = ({ title, children }) => (
  <div style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </div>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const ConjunctionsNotesPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Notes on Using Conjunctions in A1 German Letters</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Conjunctions connect clauses or sentences, making your writing clearer, more coherent, and smoother to read.
        </p>
      </div>

      <Section title="Introduction to Conjunctions">
        <p style={{ margin: 0 }}>
          In German, common A1 conjunctions include <strong>denn</strong>, <strong>weil</strong>, <strong>deshalb</strong>,
          and the phrases <strong>ich möchte wissen, ob</strong>, <strong>wann</strong>, and <strong>wo</strong>. Use them
          to explain reasons, show results, or ask politely for information.
        </p>
      </Section>

      <Section title="Conjunctions and Their Usage">
        <div style={{ display: "grid", gap: 8 }}>
          <h3 style={{ margin: 0 }}>1. Denn (because)</h3>
          <BulletList
            items={[
              "Type: Coordinating conjunction (does NOT change word order).",
              "Structure: Main Clause + , denn + Subject + Verb + ...",
              "Usage: Provides a reason or explanation.",
              "Example: Ich schreibe dir, denn ich habe gute Nachrichten.",
            ]}
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <h3 style={{ margin: 0 }}>2. Weil (because)</h3>
          <BulletList
            items={[
              "Type: Subordinating conjunction (conjugated verb moves to the end; with a modal verb, the main verb comes before the modal verb).",
              "Structure without modal verb: Main Clause + , weil + Subject + ... + Verb.",
              "Structure with modal verb: Main Clause + , weil + Subject + ... + Main Verb + Modal Verb.",
              "Usage: Provides a reason or explanation.",
              "Example (no modal): Ich schreibe dir, weil ich gute Nachrichten habe.",
              "Example (modal): Ich gehe nach Hause, weil ich schlafen möchte.",
            ]}
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <h3 style={{ margin: 0 }}>3. Deshalb (therefore)</h3>
          <BulletList
            items={[
              "Type: Adverbial conjunction (verb follows immediately).",
              "Structure: Main Clause + , deshalb + Verb + Subject + ...",
              "Usage: Indicates a result or conclusion.",
              "Example: Ich habe gute Nachrichten, deshalb schreibe ich dir.",
            ]}
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <h3 style={{ margin: 0 }}>4. Ich möchte wissen, ob / wann / wo</h3>
          <BulletList
            items={[
              "Type: Phrase introducing indirect questions (verb moves to the end).",
              "Structure: Ich möchte wissen, ob / wann / wo + Subject + ... + Verb.",
              "Usage: Requesting information politely.",
              "Example: Ich möchte wissen, ob du morgen Zeit hast.",
              "Example: Ich möchte wissen, wann der Zug ankommt.",
              "Example: Ich möchte wissen, wo die Post ist.",
            ]}
          />
        </div>
      </Section>

      <Section title="Difference Between Denn and Weil">
        <BulletList
          items={[
            "Denn does not change word order; it connects two main clauses.",
            "Example: Ich gehe nicht ins Kino, denn ich habe keine Zeit.",
            "Weil moves the verb to the end of the clause.",
            "Example: Ich gehe nicht ins Kino, weil ich keine Zeit habe.",
          ]}
        />
      </Section>

      <Section title="Practice Exercise: Rearrange Using Conjunctions">
        <p style={{ margin: 0 }}>Use the appropriate conjunction to connect the sentences into one coherent sentence.</p>
        <div style={{ display: "grid", gap: 10 }}>
          <div>
            <h4 style={{ margin: "8px 0" }}>1. Denn (because)</h4>
            <BulletList
              items={[
                "Ich kann nicht kommen. Ich bin krank.",
                "Wir gehen heute ins Kino. Es gibt einen neuen Film.",
                "Sie bleibt zu Hause. Sie hat viel zu tun.",
              ]}
            />
          </div>
          <div>
            <h4 style={{ margin: "8px 0" }}>2. Weil (because)</h4>
            <BulletList
              items={[
                "Ich bleibe zu Hause. Ich bin müde.",
                "Er kommt später. Er muss noch arbeiten.",
                "Wir fahren nach Berlin. Wir wollen dort Freunde besuchen.",
              ]}
            />
          </div>
          <div>
            <h4 style={{ margin: "8px 0" }}>3. Deshalb (therefore)</h4>
            <BulletList
              items={[
                "Es regnet. Wir bleiben drinnen.",
                "Sie ist sehr beschäftigt. Sie kann nicht kommen.",
                "Ich habe die Prüfung bestanden. Ich bin sehr glücklich.",
              ]}
            />
          </div>
          <div>
            <h4 style={{ margin: "8px 0" }}>4. Ich möchte wissen, ob</h4>
            <BulletList
              items={[
                "Du hast morgen Zeit.",
                "Ihr kommt am Wochenende zu Besuch.",
                "Sie kann ihm helfen.",
              ]}
            />
          </div>
        </div>
      </Section>

      <Section title="Solutions">
        <div style={{ display: "grid", gap: 10 }}>
          <div>
            <h4 style={{ margin: "8px 0" }}>1. Denn (because)</h4>
            <BulletList
              items={[
                "Ich kann nicht kommen, denn ich bin krank.",
                "Wir gehen heute ins Kino, denn es gibt einen neuen Film.",
                "Sie bleibt zu Hause, denn sie hat viel zu tun.",
              ]}
            />
          </div>
          <div>
            <h4 style={{ margin: "8px 0" }}>2. Weil (because)</h4>
            <BulletList
              items={[
                "Ich bleibe zu Hause, weil ich müde bin.",
                "Er kommt später, weil er noch arbeiten muss.",
                "Wir fahren nach Berlin, weil wir dort Freunde besuchen wollen.",
              ]}
            />
          </div>
          <div>
            <h4 style={{ margin: "8px 0" }}>3. Deshalb (therefore)</h4>
            <BulletList
              items={[
                "Es regnet, deshalb bleiben wir drinnen.",
                "Sie ist sehr beschäftigt, deshalb kann sie nicht kommen.",
                "Ich habe die Prüfung bestanden, deshalb bin ich sehr glücklich.",
              ]}
            />
          </div>
          <div>
            <h4 style={{ margin: "8px 0" }}>4. Ich möchte wissen, ob</h4>
            <BulletList
              items={[
                "Ich möchte wissen, ob du morgen Zeit hast.",
                "Wir möchten wissen, ob ihr am Wochenende zu Besuch kommt.",
                "Er möchte wissen, ob sie ihm helfen kann.",
              ]}
            />
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ConjunctionsNotesPage;
