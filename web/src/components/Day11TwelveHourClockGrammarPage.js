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

const Callout = ({ title, children }) => (
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
    {title ? <strong>{title}</strong> : null}
    {children}
  </div>
);

const Day11TwelveHourClockGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 11: 12-Hour Clock</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Grammar — The 12-Hour Clock System in German</p>
      </div>

      <Section title="1) The 12-hour clock basics">
        <p style={{ margin: 0 }}>
          In German, there are two ways to tell time: the 12-hour clock and the 24-hour clock. Here, we focus on the
          12-hour clock used in everyday conversations.
        </p>
        <h3 style={{ margin: "6px 0 0" }}>Full hours</h3>
        <BulletList
          items={[
            "1:00 — ein Uhr (one o'clock)",
            "2:00 — zwei Uhr (two o'clock)",
            "3:00 — drei Uhr (three o'clock)",
            "4:00 — vier Uhr (four o'clock)",
            "5:00 — fünf Uhr (five o'clock)",
            "6:00 — sechs Uhr (six o'clock)",
            "7:00 — sieben Uhr (seven o'clock)",
            "8:00 — acht Uhr (eight o'clock)",
            "9:00 — neun Uhr (nine o'clock)",
            "10:00 — zehn Uhr (ten o'clock)",
            "11:00 — elf Uhr (eleven o'clock)",
            "12:00 — zwölf Uhr (twelve o'clock)",
          ]}
        />
      </Section>

      <Section title="2) Half hours">
        <Callout title="Note">
          <p style={{ margin: 0 }}>In German, “halb” refers to the next hour.</p>
        </Callout>
        <BulletList
          items={[
            "1:30 — halb zwei",
            "2:30 — halb drei",
            "3:30 — halb vier",
            "4:30 — halb fünf",
            "5:30 — halb sechs",
            "6:30 — halb sieben",
            "7:30 — halb acht",
            "8:30 — halb neun",
            "9:30 — halb zehn",
            "10:30 — halb elf",
            "11:30 — halb zwölf",
            "12:30 — halb eins",
          ]}
        />
      </Section>

      <Section title="3) Quarter hours">
        <h3 style={{ margin: "6px 0 0" }}>Quarter past</h3>
        <BulletList
          items={[
            "1:15 — Viertel nach eins",
            "2:15 — Viertel nach zwei",
            "3:15 — Viertel nach drei",
            "4:15 — Viertel nach vier",
            "5:15 — Viertel nach fünf",
            "6:15 — Viertel nach sechs",
            "7:15 — Viertel nach sieben",
            "8:15 — Viertel nach acht",
            "9:15 — Viertel nach neun",
            "10:15 — Viertel nach zehn",
            "11:15 — Viertel nach elf",
            "12:15 — Viertel nach zwölf",
          ]}
        />
        <h3 style={{ margin: "6px 0 0" }}>Quarter to</h3>
        <BulletList
          items={[
            "1:45 — Viertel vor zwei",
            "2:45 — Viertel vor drei",
            "3:45 — Viertel vor vier",
            "4:45 — Viertel vor fünf",
            "5:45 — Viertel vor sechs",
            "6:45 — Viertel vor sieben",
            "7:45 — Viertel vor acht",
            "8:45 — Viertel vor neun",
            "9:45 — Viertel vor zehn",
            "10:45 — Viertel vor elf",
            "11:45 — Viertel vor zwölf",
            "12:45 — Viertel vor eins",
          ]}
        />
      </Section>

      <Section title="4) Minutes between full and quarter hours">
        <BulletList
          items={[
            "1:05 — fünf nach eins (five past one)",
            "1:10 — zehn nach eins (ten past one)",
            "1:20 — zwanzig nach eins (twenty past one)",
            "1:25 — fünf vor halb zwei (five before half two)",
            "1:35 — fünf nach halb zwei (five after half two)",
            "1:40 — zwanzig vor zwei (twenty to two)",
            "1:50 — zehn vor zwei (ten to two)",
            "1:55 — fünf vor zwei (five to two)",
          ]}
        />
      </Section>

      <Section title="5) AM and PM">
        <p style={{ margin: 0 }}>
          Context is usually enough in German, but you can add time-of-day words when needed.
        </p>
        <BulletList
          items={[
            "8:00 AM — acht Uhr morgens",
            "2:00 PM — zwei Uhr nachmittags",
            "6:00 PM — sechs Uhr abends",
            "11:00 PM — elf Uhr nachts",
          ]}
        />
      </Section>

      <Section title="6) Quick examples">
        <BulletList
          items={[
            "Es ist fünf nach zehn. (10:05)",
            "Es ist Viertel vor acht. (7:45)",
            "Es ist halb vier. (3:30)",
            "Es ist zwanzig nach neun. (9:20)",
          ]}
        />
      </Section>

      <Section title="7) Using “wann” with “um” and “von ... bis”">
        <h3 style={{ margin: "6px 0 0" }}>Wann + um (specific time)</h3>
        <BulletList
          items={[
            "Wann gehst du ins Bett? — Ich gehe um 10 Uhr ins Bett.",
            "Wann beginnt der Film? — Der Film beginnt um 20 Uhr.",
            "Wann treffen wir uns? — Wir treffen uns um 15 Uhr.",
          ]}
        />
        <h3 style={{ margin: "6px 0 0" }}>Wann + von ... bis (time range)</h3>
        <BulletList
          items={[
            "Wann ist das Geschäft geöffnet? — Das Geschäft ist von 9 bis 18 Uhr geöffnet.",
            "Wann arbeitest du? — Ich arbeite von 8 bis 17 Uhr.",
            "Wann hast du Deutschunterricht? — Ich habe Deutschunterricht von 10 bis 11 Uhr.",
          ]}
        />
        <Callout title="Summary">
          <BulletList
            items={[
              "Wann + um + time → specific point in time.",
              "Wann + von + time + bis + time → time interval.",
            ]}
          />
        </Callout>
      </Section>

      <Section title="8) Separable verbs (trennbare Verben)">
        <Callout title="Structure">
          <BulletList items={["Verb stem + separable prefix", "Prefix moves to the end in main clauses."]} />
        </Callout>
        <BulletList
          items={[
            "anfangen — Ich fange um 8 Uhr an.",
            "aufstehen — Er steht jeden Morgen um 7 Uhr auf.",
            "einladen — Wir laden alle unsere Freunde ein.",
            "abholen — Sie holt ihren Bruder von der Schule ab.",
            "mitbringen — Er bringt einen Kuchen zur Party mit.",
            "anmelden — Ich melde mich für den Kurs an.",
            "zurückkommen — Sie kommt morgen aus dem Urlaub zurück.",
            "einsteigen — Wir steigen in den Bus ein.",
          ]}
        />
        <h3 style={{ margin: "6px 0 0" }}>Common separable prefixes</h3>
        <BulletList items={["an-", "auf-", "aus-", "ein-", "mit-", "vor-", "zu-"]} />
      </Section>

      <Section title="9) Adverbs of frequency">
        <BulletList
          items={[
            "Immer (always) — Ich gehe immer um 7 Uhr zur Arbeit.",
            "Selten (seldom/rarely) — Er geht selten ins Kino.",
            "Manchmal (sometimes) — Wir essen manchmal im Restaurant.",
            "Nie (never) — Sie trinkt nie Kaffee.",
            "Fast nie (almost never) — Ich esse fast nie Fast Food.",
          ]}
        />
        <Callout title="Placement tip">
          <p style={{ margin: 0 }}>
            Adverbs of frequency usually come after the verb, but can move to the beginning for emphasis.
          </p>
        </Callout>
      </Section>

      <Section title="10) Using “am” with days of the week">
        <BulletList
          items={[
            "Am Montag habe ich Deutschunterricht.",
            "Am Freitag gehe ich ins Kino.",
            "Am Wochenende besuche ich meine Familie.",
          ]}
        />
        <h3 style={{ margin: "6px 0 0" }}>Useful time words</h3>
        <BulletList
          items={[
            "der Tag — jeden Tag, gestern, heute, morgen, übermorgen",
            "die Woche — diese Woche, nächste Woche, letzte Woche",
            "das Wochenende — am Wochenende, jedes Wochenende",
          ]}
        />
      </Section>

      <Section title="11) Vokabeln (Vocabulary)">
        <h3 style={{ margin: "6px 0 0" }}>12-Stunden-Uhr</h3>
        <BulletList
          items={[
            "Uhr (o'clock)",
            "morgens (in the morning)",
            "mittags (at noon)",
            "nachmittags (in the afternoon)",
            "abends (in the evening)",
            "nachts (at night)",
            "eine Stunde (one hour)",
            "halb (half past)",
            "Viertel nach (quarter past)",
            "Viertel vor (quarter to)",
            "um (at) — z.B., um 8 Uhr",
            "früh (early)",
            "spät (late)",
          ]}
        />
        <h3 style={{ margin: "6px 0 0" }}>Präpositionen der Zeit</h3>
        <BulletList
          items={[
            "um (at) — z.B., um 9 Uhr",
            "am (on) — z.B., am Montag",
            "im (in) — z.B., im Juli",
            "vor (before) — z.B., vor der Schule",
            "nach (after) — z.B., nach der Arbeit",
            "von ... bis (from ... to) — z.B., von 8 bis 10 Uhr",
            "seit (since/for) — z.B., seit 2010",
            "ab (from/as of) — z.B., ab morgen",
          ]}
        />
        <h3 style={{ margin: "6px 0 0" }}>Wochentage</h3>
        <BulletList
          items={[
            "Montag (Monday)",
            "Dienstag (Tuesday)",
            "Mittwoch (Wednesday)",
            "Donnerstag (Thursday)",
            "Freitag (Friday)",
            "Samstag (Saturday)",
            "Sonntag (Sunday)",
            "Wochentag (weekday)",
            "Wochenende (weekend)",
            "heute (today)",
            "morgen (tomorrow)",
            "übermorgen (the day after tomorrow)",
            "gestern (yesterday)",
            "vorgestern (the day before yesterday)",
          ]}
        />
      </Section>
    </div>
  );
};

export default Day11TwelveHourClockGrammarPage;
