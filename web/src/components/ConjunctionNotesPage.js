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

const ConjunctionNotesPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Conjunctions in A1 German Letters</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Use these notes to connect sentences clearly and politely when writing letters.
        </p>
      </div>

      <Section title="Introduction to Conjunctions">
        <p style={{ margin: 0 }}>
          Conjunctions connect clauses or sentences to make your writing clearer, more coherent, and smoother to read.
          In A1 German, common conjunctions include <em>denn</em>, <em>weil</em>, <em>deshalb</em>, and the phrases{" "}
          <em>ich möchte wissen, ob</em>, <em>wann</em>, and <em>wo</em>.
        </p>
      </Section>

      <Section title="Conjunctions and Their Usage">
        <h3 style={{ margin: 0 }}>1. Denn (because)</h3>
        <BulletList
          items={[
            "Type: Coordinating conjunction (does not change word order).",
            "Structure: Main clause + , denn + subject + verb + ...",
            "Usage: Gives a reason or explanation.",
            "Example: Ich schreibe dir, denn ich habe gute Nachrichten. (I am writing to you because I have good news.)",
          ]}
        />

        <h3 style={{ margin: 0 }}>2. Weil (because)</h3>
        <BulletList
          items={[
            "Type: Subordinating conjunction (the conjugated verb moves to the end).",
            "Structure without modal verb: Main clause + , weil + subject + ... + verb.",
            "Structure with modal verb: Main clause + , weil + subject + ... + main verb + modal verb.",
            "Usage: Gives a reason or explanation.",
          ]}
        />
        <BulletList
          items={[
            "Example without modal verb: Ich schreibe dir, weil ich gute Nachrichten habe.",
            "Example with modal verb: Ich gehe nach Hause, weil ich schlafen möchte.",
          ]}
        />

        <h3 style={{ margin: 0 }}>3. Deshalb (therefore)</h3>
        <BulletList
          items={[
            "Type: Adverbial conjunction (verb follows immediately).",
            "Structure: Main clause + , deshalb + verb + subject + ...",
            "Usage: Shows a result or conclusion.",
            "Example: Ich habe gute Nachrichten, deshalb schreibe ich dir.",
          ]}
        />

        <h3 style={{ margin: 0 }}>4. Ich möchte wissen, ob / wann / wo</h3>
        <BulletList
          items={[
            "Type: Phrase for indirect questions (verb moves to the end).",
            "Structure: Ich möchte wissen, ob / wann / wo + subject + ... + verb.",
            "Usage: Ask for information or clarification politely.",
            "Example: Ich möchte wissen, ob du morgen Zeit hast.",
            "Example: Ich möchte wissen, wann der Zug ankommt.",
            "Example: Ich möchte wissen, wo die Post ist.",
          ]}
        />
      </Section>

      <Section title="Difference Between Denn and Weil">
        <BulletList
          items={[
            "Denn does not change the word order and connects two main clauses.",
            "Example: Ich gehe nicht ins Kino, denn ich habe keine Zeit.",
            "Weil changes the word order by sending the conjugated verb to the end.",
            "Example: Ich gehe nicht ins Kino, weil ich keine Zeit habe.",
          ]}
        />
      </Section>

      <Section title="Practice Exercise: Rearrange Using Conjunctions">
        <h3 style={{ margin: 0 }}>1. Denn (because)</h3>
        <BulletList
          items={[
            "Ich kann nicht kommen. Ich bin krank.",
            "Wir gehen heute ins Kino. Es gibt einen neuen Film.",
            "Sie bleibt zu Hause. Sie hat viel zu tun.",
          ]}
        />

        <h3 style={{ margin: 0 }}>2. Weil (because)</h3>
        <BulletList
          items={[
            "Ich bleibe zu Hause. Ich bin müde.",
            "Er kommt später. Er muss noch arbeiten.",
            "Wir fahren nach Berlin. Wir wollen dort Freunde besuchen.",
          ]}
        />

        <h3 style={{ margin: 0 }}>3. Deshalb (therefore)</h3>
        <BulletList
          items={[
            "Es regnet. Wir bleiben drinnen.",
            "Sie ist sehr beschäftigt. Sie kann nicht kommen.",
            "Ich habe die Prüfung bestanden. Ich bin sehr glücklich.",
          ]}
        />

        <h3 style={{ margin: 0 }}>4. Ich möchte wissen, ob</h3>
        <BulletList
          items={[
            "Du hast morgen Zeit.",
            "Ihr kommt am Wochenende zu Besuch.",
            "Sie kann ihm helfen.",
          ]}
        />
      </Section>

      <Section title="Solutions">
        <h3 style={{ margin: 0 }}>1. Denn (because)</h3>
        <BulletList
          items={[
            "Ich kann nicht kommen, denn ich bin krank.",
            "Wir gehen heute ins Kino, denn es gibt einen neuen Film.",
            "Sie bleibt zu Hause, denn sie hat viel zu tun.",
          ]}
        />

        <h3 style={{ margin: 0 }}>2. Weil (because)</h3>
        <BulletList
          items={[
            "Ich bleibe zu Hause, weil ich müde bin.",
            "Er kommt später, weil er noch arbeiten muss.",
            "Wir fahren nach Berlin, weil wir dort Freunde besuchen wollen.",
          ]}
        />

        <h3 style={{ margin: 0 }}>3. Deshalb (therefore)</h3>
        <BulletList
          items={[
            "Es regnet, deshalb bleiben wir drinnen.",
            "Sie ist sehr beschäftigt, deshalb kann sie nicht kommen.",
            "Ich habe die Prüfung bestanden, deshalb bin ich sehr glücklich.",
          ]}
        />

        <h3 style={{ margin: 0 }}>4. Ich möchte wissen, ob</h3>
        <BulletList
          items={[
            "Ich möchte wissen, ob du morgen Zeit hast.",
            "Wir möchten wissen, ob ihr am Wochenende zu Besuch kommt.",
            "Er möchte wissen, ob sie ihm helfen kann.",
          ]}
        />
      </Section>
    </div>
  );
};

export default ConjunctionNotesPage;
