import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const Callout = ({ children }) => (
  <div
    style={{
      background: "#f8fafc",
      borderLeft: "4px solid #6366f1",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 14,
      display: "grid",
      gap: 6,
    }}
  >
    {children}
  </div>
);

const GreetingsGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 1: Greetings</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 0.1 — Greetings, Goodbyes, and How You Are.</p>
      </div>

      <Section title="1) Formal and Informal Greetings">
        <Callout>
          <strong>Introduction</strong>
          <p style={{ margin: 0 }}>
            In German, greetings change depending on formality. Choose a formal or informal greeting based on the person
            and the situation.
          </p>
        </Callout>
        <h3 style={{ margin: "6px 0 0" }}>Formal greetings</h3>
        <BulletList
          items={[
            "Guten Morgen (Good morning) — use until midday; polite in formal situations.",
            "Guten Tag (Good day) — used from midday to early evening; formal daytime greeting.",
            "Guten Abend (Good evening) — used after ~6 PM in formal settings.",
          ]}
        />
        <h3 style={{ margin: "6px 0 0" }}>Informal greetings</h3>
        <BulletList
          items={[
            "Hallo (Hello) — casual, any time of day among friends/family.",
            "Hi (Hi) — informal, common among younger people or friends.",
          ]}
        />
      </Section>

      <Section title="2) Titles: Mr. and Miss">
        <Callout>
          <strong>Introduction</strong>
          <p style={{ margin: 0 }}>
            Titles show respect in formal contexts. Use them before a person&apos;s last name.
          </p>
        </Callout>
        <BulletList items={["Herr (Mr.) — Herr Müller", "Frau (Miss/Mrs.) — Frau Schmidt"]} />
        <h3 style={{ margin: "6px 0 0" }}>Quick activity</h3>
        <BulletList items={["Müller (Herr or Frau?)", "Schmidt (Herr or Frau?)", "Schneider (Herr or Frau?)"]} />
      </Section>

      <Section title="3) When you don’t know the last name">
        <p style={{ margin: 0 }}>
          In shops, restaurants, or on the street, you can still speak politely without a last name.
        </p>
        <BulletList
          items={[
            "Use Herr or Frau alone: Entschuldigen Sie, Herr... / Entschuldigen Sie, Frau...",
            "Use polite phrases: Entschuldigen Sie, bitte... / Könnten Sie mir helfen?",
          ]}
        />
        <Callout>
          <strong>Note</strong>
          <p style={{ margin: 0 }}>
            German doesn&apos;t use “mister/madam” like English. Instead, use Herr/Frau or a polite sentence with Sie.
          </p>
        </Callout>
      </Section>

      <Section title="4) Goodbyes">
        <BulletList
          items={[
            "Auf Wiedersehen (Goodbye) — formal, implies you will see the person again.",
            "Tschüss (Bye) — relaxed, informal, for friends/family.",
          ]}
        />
        <Callout>
          <strong>Pronunciation</strong>
          <BulletList items={["Auf Wiedersehen → /aʊf ˈviːdɐˌzeːən/", "Tschüss → /tʃʏs/"]} />
        </Callout>
      </Section>

      <Section title="5) Introducing “Wie geht es ...?”">
        <BulletList
          items={[
            "wie = how",
            "geht = goes (from gehen)",
            "es = it",
            "Wie geht es? → “How is it?” (natural: “How are you?”)",
          ]}
        />
        <h3 style={{ margin: "6px 0 0" }}>Formal vs informal</h3>
        <BulletList items={["Wie geht es Ihnen? (formal)", "Wie geht es dir? (informal)"]} />
      </Section>

      <Section title="6) Wie geht’s vs. Wie geht es dir vs. Wie geht es Ihnen">
        <BulletList
          items={[
            "Wie geht’s? — very casual, use with friends/classmates.",
            "Wie geht es dir? — informal, one person you know well.",
            "Wie geht es Ihnen? — formal, polite and professional.",
          ]}
        />
        <Callout>
          <strong>Key points</strong>
          <BulletList
            items={[
              "geht’s = contraction of geht es",
              "dir = only with du (informal)",
              "Ihnen = only with Sie (formal, capitalized)",
            ]}
          />
        </Callout>
      </Section>

      <Section title="7) Responses to “Wie geht es ...?”">
        <BulletList
          items={[
            "Mir geht es gut. (I’m doing well.)",
            "Mir geht es sehr gut. (I’m doing very well.)",
            "Mir geht es nicht so gut. (I’m not doing so well.)",
            "Mir geht es schlecht. (I’m doing badly.)",
            "So lala. (So-so.)",
          ]}
        />
      </Section>

      <Section title="8) Asking “And you?”">
        <BulletList
          items={[
            "Informal: Und dir?",
            "Formal: Und Ihnen?",
            "Example: Mir geht es gut, danke. Und dir? / Und Ihnen?",
          ]}
        />
        <Callout>
          <strong>Reminder</strong>
          <p style={{ margin: 0 }}>Never mix dir and Ihnen in the same conversation.</p>
        </Callout>
      </Section>
    </div>
  );
};

export default GreetingsGrammarPage;
