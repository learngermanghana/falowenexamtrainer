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

const TwelveHourClockPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>Back to Course</button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>The 12-Hour Clock System in German</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          In everyday German conversation, people often use the 12-hour system. These notes cover common patterns A1 learners need.
        </p>
      </div>

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
        <List
          items={[
            '1:05 = "fünf nach eins" (five past one).',
            '1:25 = "fünf vor halb zwei" (five before half two).',
            '1:35 = "fünf nach halb zwei" (five after half two).',
            '1:50 = "zehn vor zwei" (ten to two).',
          ]}
        />
      </Section>

      <Section title="3) AM and PM Context Words">
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
            'Wann + um + time for a specific point: "Wann beginnt der Film?" → "Der Film beginnt um 20 Uhr."',
            'Wann + von ... bis for a time range: "Wann arbeitest du?" → "Ich arbeite von 8 bis 17 Uhr."',
          ]}
        />
      </Section>

      <Section title="5) Related A1 Grammar for Daily Routines">
        <List
          items={[
            'Separable verbs: "Ich fange um 8 Uhr an." / "Er steht um 7 Uhr auf."',
            'Adverbs of frequency: immer, oft, manchmal, selten, nie, fast nie.',
            'Sentence tip: adverbs of frequency often come after the verb in simple main clauses.',
          ]}
        />
      </Section>
    </div>
  );
};

export default TwelveHourClockPage;
