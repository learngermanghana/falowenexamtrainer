import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 10 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const List = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const Note = ({ children }) => (
  <div
    style={{
      background: "#f7f8ff",
      borderLeft: "4px solid #5468ff",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 14,
    }}
  >
    {children}
  </div>
);

const TwelveHourClockPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>The 12-Hour Clock System in German</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          This is your first full introduction to telling time in German. Read the notes in order and say each example out
          loud. It is completely normal if this feels new at first.
        </p>
      </div>

      <Section title="How to Read Time in German (Beginner Overview)">
        <p style={{ margin: 0 }}>
          German uses both a 12-hour and a 24-hour clock. In daily speaking, the 12-hour clock is very common. You will
          hear patterns like <em>nach</em> (past), <em>vor</em> (to), and <em>halb</em> (half to the next hour).
        </p>
        <Note>
          <strong>Important:</strong> <em>halb zwei</em> means 1:30 (half <strong>to</strong> two), not 2:30.
        </Note>
      </Section>

      <Section title="1) Full, Half, and Quarter Hours">
        <List
          items={[
            "Full hours: ein Uhr, zwei Uhr, drei Uhr ... zwölf Uhr.",
            'Half hour uses the next hour: 1:30 = "halb zwei", 2:30 = "halb drei".',
            'Quarter past: "Viertel nach" + hour (1:15 = Viertel nach eins).',
            'Quarter to: "Viertel vor" + next hour (1:45 = Viertel vor zwei).',
          ]}
        />
      </Section>

      <Section title="2) Minutes Around the Half Hour">
        <p style={{ margin: 0 }}>For times that are not full/quarter hours, German often uses minute phrases around the current or next hour.</p>
        <List
          items={[
            '1:05 = "fünf nach eins" (five past one).',
            '1:25 = "fünf vor halb zwei" (five before half two).',
            '1:35 = "fünf nach halb zwei" (five after half two).',
            '1:40 = "zwanzig vor zwei" (twenty to two).',
            '1:50 = "zehn vor zwei" (ten to two).',
          ]}
        />
      </Section>

      <Section title="3) AM and PM Context Words">
        <p style={{ margin: 0 }}>
          German often uses context instead of saying AM/PM directly. Add these words when you want to be very clear:
        </p>
        <List
          items={[
            'morgens (morning): "acht Uhr morgens"',
            'nachmittags (afternoon): "zwei Uhr nachmittags"',
            'abends (evening): "sechs Uhr abends"',
            'nachts (night): "elf Uhr nachts"',
          ]}
        />
      </Section>

      <Section title='4) Asking Time with "wann", "um", and "von ... bis"'>
        <List
          items={[
            'Wann + um + time = one specific point: "Wann beginnt der Film?" → "Der Film beginnt um 20 Uhr."',
            'Wann + von ... bis = time range: "Wann arbeitest du?" → "Ich arbeite von 8 bis 17 Uhr."',
            'More practice: "Wann gehst du ins Bett?" → "Ich gehe um 10 Uhr ins Bett."',
          ]}
        />
      </Section>

      <Section title="5) Separable Verbs (Trennbare Verben) — Expanded Beginner Notes">
        <p style={{ margin: 0 }}>
          Separable verbs have two parts: a verb stem and a prefix. In a normal main sentence, the stem is conjugated in
          position 2 and the prefix moves to the end.
        </p>
        <Note>
          <strong>Structure in main clauses:</strong> Subject + conjugated stem + ... + prefix<br />
          Example: <em>Ich fange um 8 Uhr an.</em>
        </Note>
        <List
          items={[
            'anfangen (to begin): "Ich fange um 8 Uhr an."',
            'aufstehen (to get up): "Er steht jeden Morgen um 7 Uhr auf."',
            'einladen (to invite): "Wir laden alle unsere Freunde ein."',
            'abholen (to pick up): "Sie holt ihren Bruder von der Schule ab."',
            'mitbringen (to bring along): "Er bringt einen Kuchen zur Party mit."',
            'anmelden (to register): "Ich melde mich für den Kurs an."',
            'zurückkommen (to come back): "Sie kommt morgen aus dem Urlaub zurück."',
            'einsteigen (to get in/get on): "Wir steigen in den Bus ein."',
          ]}
        />
        <p style={{ margin: 0 }}>
          Common separable prefixes: <em>an-</em>, <em>auf-</em>, <em>aus-</em>, <em>ein-</em>, <em>mit-</em>, <em>vor-</em>, <em>zu-</em>, <em>zurück-</em>.
        </p>
        <p style={{ margin: 0 }}>
          Beginner tip: when listening, wait for the last word in the sentence. That final prefix often gives the full meaning.
        </p>
      </Section>

      <Section title="6) Adverbs of Frequency for Time and Routine">
        <p style={{ margin: 0 }}>Use these words to describe how often an action happens:</p>
        <List
          items={[
            'immer (always): "Ich gehe immer um 7 Uhr zur Arbeit."',
            'oft (often): "Wir lernen oft abends."',
            'manchmal (sometimes): "Manchmal gehe ich am Wochenende wandern."',
            'selten (rarely): "Er geht selten ins Kino."',
            'nie / fast nie (never / almost never): "Sie trinkt nie Kaffee." / "Ich esse fast nie Fast Food."',
          ]}
        />
      </Section>
    </div>
  );
};

export default TwelveHourClockPage;
