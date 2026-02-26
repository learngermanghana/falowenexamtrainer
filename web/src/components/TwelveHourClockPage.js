import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const Section = ({ title, subtitle, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 10 }}>
    <div style={{ display: "grid", gap: 6 }}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      {subtitle ? (
        <p style={{ margin: 0, opacity: 0.9, lineHeight: 1.5 }}>{subtitle}</p>
      ) : null}
    </div>
    {children}
  </section>
);

const Callout = ({ title, children }) => (
  <div
    style={{
      border: "1px solid #d1d5db",
      borderRadius: 12,
      padding: 12,
      background: "#f9fafb",
      display: "grid",
      gap: 8,
    }}
  >
    {title ? <strong>{title}</strong> : null}
    <div style={{ lineHeight: 1.6 }}>{children}</div>
  </div>
);

const MiniTable = ({ rows }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e5e7eb" }}>Time</th>
          <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e5e7eb" }}>German (common)</th>
          <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e5e7eb" }}>Meaning</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, idx) => (
          <tr key={idx}>
            <td style={{ padding: 8, borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>{r[0]}</td>
            <td style={{ padding: 8, borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ fontWeight: 600 }}>{r[1]}</span>
            </td>
            <td style={{ padding: 8, borderBottom: "1px solid #f1f5f9" }}>{r[2]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ChipRow = ({ items }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
    {items.map((t) => (
      <span
        key={t}
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 999,
          padding: "6px 10px",
          fontSize: 13,
          background: "#fff",
        }}
      >
        {t}
      </span>
    ))}
  </div>
);

const normalize = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[“”"]/g, '"')
    .replace(/[’]/g, "'")
    .trim();

const formatHint = (s) => (
  <span style={{ opacity: 0.8, fontSize: 13 }}>
    Tipp: Achte auf <strong>halb</strong> (= 30 Minuten) und dass es oft die <strong>nächste</strong> Stunde benutzt.
  </span>
);

const TwelveHourClockPage = () => {
  const navigate = useNavigate();

  // =========================
  // Practice sets
  // =========================
  const convertToGerman = useMemo(
    () => [
      { time: "01:00", answers: ['ein Uhr', "1 Uhr"], note: "Full hour" },
      { time: "02:00", answers: ["zwei Uhr", "2 Uhr"], note: "Full hour" },
      { time: "01:15", answers: ["viertel nach eins"], note: "Quarter past" },
      { time: "01:30", answers: ["halb zwei"], note: "Half (next hour)" },
      { time: "01:45", answers: ["viertel vor zwei"], note: "Quarter to (next hour)" },
      { time: "01:05", answers: ["fünf nach eins", "5 nach eins"], note: "Minutes after" },
      { time: "01:25", answers: ["fünf vor halb zwei", "5 vor halb zwei"], note: "Before half" },
      { time: "01:35", answers: ["fünf nach halb zwei", "5 nach halb zwei"], note: "After half" },
      { time: "01:50", answers: ["zehn vor zwei", "10 vor zwei"], note: "Minutes to" },
      { time: "06:20", answers: ["zwanzig nach sechs", "20 nach sechs"], note: "Minutes after" },
      { time: "08:40", answers: ["zwanzig vor neun", "20 vor neun"], note: "Minutes to (next hour)" },
    ],
    []
  );

  const convertToDigits = useMemo(
    () => [
      { prompt: "halb zwei", answers: ["01:30", "1:30"], note: "Half uses the next hour" },
      { prompt: "Viertel nach drei", answers: ["03:15", "3:15"], note: "Quarter past" },
      { prompt: "Viertel vor fünf", answers: ["04:45", "4:45"], note: "Quarter to" },
      { prompt: "zehn vor zwei", answers: ["01:50", "1:50"], note: "Ten to two" },
      { prompt: "fünf nach halb neun", answers: ["08:35", "8:35"], note: "Five after half nine" },
      { prompt: "fünf vor halb acht", answers: ["07:25", "7:25"], note: "Five before half eight" },
      { prompt: "zwanzig nach sechs", answers: ["06:20", "6:20"], note: "Twenty past" },
      { prompt: "zwanzig vor neun", answers: ["08:40", "8:40"], note: "Twenty to nine" },
    ],
    []
  );

  const [mode, setMode] = useState("toGerman"); // "toGerman" | "toDigits"
  const activeSet = mode === "toGerman" ? convertToGerman : convertToDigits;

  const [index, setIndex] = useState(0);
  const current = activeSet[index];

  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const resetAttempt = () => {
    setInput("");
    setChecked(false);
    setIsCorrect(false);
    setShowAnswer(false);
  };

  const next = () => {
    const nextIndex = (index + 1) % activeSet.length;
    setIndex(nextIndex);
    resetAttempt();
  };

  const prev = () => {
    const prevIndex = (index - 1 + activeSet.length) % activeSet.length;
    setIndex(prevIndex);
    resetAttempt();
  };

  const check = () => {
    const user = normalize(input);
    const ok = (current.answers || []).some((a) => normalize(a) === user);
    setChecked(true);
    setIsCorrect(ok);
  };

  const reveal = () => setShowAnswer(true);

  const rowsCore = useMemo(
    () => [
      ["1:00", "ein Uhr", "one o’clock"],
      ["1:15", "Viertel nach eins", "quarter past one"],
      ["1:30", "halb zwei", "half (to) two = 1:30"],
      ["1:45", "Viertel vor zwei", "quarter to two"],
      ["1:05", "fünf nach eins", "five past one"],
      ["1:25", "fünf vor halb zwei", "five before half two (1:25)"],
      ["1:35", "fünf nach halb zwei", "five after half two (1:35)"],
      ["1:50", "zehn vor zwei", "ten to two"],
    ],
    []
  );

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 10 }}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <div style={{ display: "grid", gap: 6 }}>
          <h1 style={{ ...styles.title, marginBottom: 0 }}>The 12-Hour Clock System in German</h1>
          <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.6 }}>
            In everyday German (especially spoken German), people often use the <strong>12-hour style</strong> with
            patterns like <strong>halb zwei</strong> (1:30) and <strong>Viertel vor</strong>/<strong>nach</strong>.
            This page gives clear rules, lots of examples, and practice.
          </p>
        </div>

        <Callout title="Big idea (A1-friendly)">
          <div style={{ display: "grid", gap: 8 }}>
            <div>
              <strong>Full hour</strong> is simple: <em>ein Uhr, zwei Uhr, drei Uhr…</em>
            </div>
            <div>
              <strong>Half hour</strong> uses the <strong>next hour</strong>:{" "}
              <em>1:30 = halb zwei</em> (not *halb eins*).
            </div>
            <div>
              <strong>Quarter hour</strong> uses <em>Viertel nach</em> (past) and <em>Viertel vor</em> (to).
            </div>
            {formatHint()}
          </div>
        </Callout>
      </div>

      <Section
        title="1) The 4 core building blocks"
        subtitle="If you learn these four patterns, you can say most times correctly."
      >
        <ChipRow
          items={[
            'Full hour: "X Uhr"',
            'Quarter past: "Viertel nach X"',
            'Half: "halb (next hour)"',
            'Quarter to: "Viertel vor (next hour)"',
          ]}
        />
        <MiniTable rows={rowsCore} />
        <Callout title="Pronunciation tip">
          <div>
            Germans often speak fast. Practice saying times as one “chunk”:
            <ul style={{ margin: "8px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
              <li>
                <strong>halb zwei</strong> (say it smoothly)
              </li>
              <li>
                <strong>Viertel vor zwei</strong>
              </li>
              <li>
                <strong>fünf vor halb zwei</strong>
              </li>
            </ul>
          </div>
        </Callout>
      </Section>

      <Section
        title="2) Minutes around the half hour (the common spoken style)"
        subtitle='These are super common in daily life: "vor halb" and "nach halb".'
      >
        <MiniTable
          rows={[
            ["1:20", "zehn vor halb zwei", "ten before half two (1:20)"],
            ["1:25", "fünf vor halb zwei", "five before half two (1:25)"],
            ["1:30", "halb zwei", "1:30"],
            ["1:35", "fünf nach halb zwei", "five after half two (1:35)"],
            ["1:40", "zehn nach halb zwei", "ten after half two (1:40)"],
          ]}
        />
        <Callout title="Rule you must remember">
          <div>
            When you see <strong>halb</strong>, the hour is the <strong>next hour</strong>.
            <div style={{ marginTop: 6 }}>
              Example: <strong>halb neun</strong> = 8:30 (because it’s “half to nine”).
            </div>
          </div>
        </Callout>
      </Section>

      <Section title="3) Morning / afternoon / evening (AM/PM without AM/PM)">
        <div style={{ display: "grid", gap: 10 }}>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            German usually doesn’t say “AM/PM”. Instead, we add context words:
          </p>
          <MiniTable
            rows={[
              ['8:00', 'acht Uhr morgens', '8:00 in the morning'],
              ['2:00', 'zwei Uhr nachmittags', '2:00 in the afternoon'],
              ['6:00', 'sechs Uhr abends', '6:00 in the evening'],
              ['11:00', 'elf Uhr nachts', '11:00 at night'],
            ]}
          />
          <Callout title="A1 mini-examples (daily routine)">
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
              <li>
                Ich stehe <strong>um sieben Uhr</strong> auf. (I get up at 7:00.)
              </li>
              <li>
                Wir essen <strong>um halb acht</strong> Frühstück. (We eat breakfast at 7:30.)
              </li>
              <li>
                Der Kurs ist <strong>um zwei Uhr nachmittags</strong>. (The course is at 2 pm.)
              </li>
              <li>
                Ich lerne <strong>abends</strong> Deutsch. (I study German in the evening.)
              </li>
            </ul>
          </Callout>
        </div>
      </Section>

      <Section
        title='4) Asking and answering time: "Wann", "um", "von … bis"'
        subtitle="These are the most useful question patterns for A1 conversations."
      >
        <div style={{ display: "grid", gap: 10 }}>
          <Callout title='A) Point in time (specific time) → use "um"'>
            <div style={{ display: "grid", gap: 8 }}>
              <div>
                <strong>Question:</strong> Wann beginnt der Film?
              </div>
              <div>
                <strong>Answer:</strong> Der Film beginnt <strong>um</strong> 20 Uhr. / … <strong>um</strong> acht Uhr abends.
              </div>
              <div style={{ opacity: 0.85 }}>
                Tipp: <strong>um</strong> = “at (a time)”
              </div>
            </div>
          </Callout>

          <Callout title='B) Time range → use "von … bis"'>
            <div style={{ display: "grid", gap: 8 }}>
              <div>
                <strong>Question:</strong> Wann arbeitest du?
              </div>
              <div>
                <strong>Answer:</strong> Ich arbeite <strong>von</strong> 8 <strong>bis</strong> 17 Uhr.
              </div>
              <div style={{ opacity: 0.85 }}>
                Tipp: In spoken German you can also say: <em>von acht bis fünf</em> (context makes it clear).
              </div>
            </div>
          </Callout>

          <Callout title="C) Quick A1 practice sentences">
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
              <li>Wann beginnt der Deutschkurs? — Er beginnt um …</li>
              <li>Wann hast du Zeit? — Ich habe von … bis … Zeit.</li>
              <li>Wann kommst du? — Ich komme um …</li>
            </ul>
          </Callout>
        </div>
      </Section>

      <Section
        title="5) Useful A1 grammar with time (separable verbs + word order)"
        subtitle="Time words are easy — but word order matters. This section gives exam-ready patterns."
      >
        <div style={{ display: "grid", gap: 10 }}>
          <Callout title="Separable verbs (Trennbare Verben): quick rule">
            <div style={{ display: "grid", gap: 8 }}>
              <div>
                A separable verb has a <strong>verb stem</strong> + a <strong>prefix</strong>.
              </div>
              <div>
                <strong>Main clause rule:</strong> verb in position 2, prefix at the end.
              </div>
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 10 }}>
                <strong>Pattern:</strong> Ich + VERB (stem) + … + PREFIX <br />
                <strong>Example:</strong> Ich fange um 8 Uhr <strong>an</strong>.
              </div>
              <MiniTable
                rows={[
                  ["Ich fange um 8 Uhr an.", "anfangen → … an", "I start at 8."],
                  ["Er steht um 7 Uhr auf.", "aufstehen → … auf", "He gets up at 7."],
                  ["Wir laden unsere Freunde ein.", "einladen → … ein", "We invite our friends."],
                  ["Sie holt ihren Bruder ab.", "abholen → … ab", "She picks up her brother."],
                  ["Er bringt einen Kuchen mit.", "mitbringen → … mit", "He brings a cake along."],
                  ["Ich melde mich für den Kurs an.", "anmelden → … an", "I register for the course."],
                  ["Sie kommt morgen zurück.", "zurückkommen → … zurück", "She comes back tomorrow."],
                  ["Wir steigen in den Bus ein.", "einsteigen → … ein", "We get on the bus."],
                ]}
              />
            </div>
          </Callout>

          <Callout title="Separable verbs in common exam tenses">
            <div style={{ display: "grid", gap: 10 }}>
              <div>
                <strong>A) Present (Präsens)</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, display: "grid", gap: 4 }}>
                  <li>Ich fange heute um 8 Uhr an.</li>
                  <li>Er steht jeden Morgen um 7 Uhr auf.</li>
                  <li>Wir laden alle unsere Freunde ein.</li>
                </ul>
              </div>

              <div>
                <strong>B) Perfect (Perfekt)</strong> — very common in speaking/writing
                <div style={{ marginTop: 4, opacity: 0.9 }}>
                  Pattern: <strong>haben/sein + Partizip II</strong>
                </div>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, display: "grid", gap: 4 }}>
                  <li>Ich habe um 8 Uhr angefangen.</li>
                  <li>Er ist um 7 Uhr aufgestanden.</li>
                  <li>Wir haben unsere Freunde eingeladen.</li>
                </ul>
              </div>

              <div>
                <strong>C) Modal verbs</strong> (können, müssen, wollen, dürfen…)
                <div style={{ marginTop: 4, opacity: 0.9 }}>
                  With modal verbs, the separable verb stays together in infinitive at the end.
                </div>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, display: "grid", gap: 4 }}>
                  <li>Ich kann um 8 Uhr anfangen.</li>
                  <li>Er muss um 7 Uhr aufstehen.</li>
                  <li>Wir wollen unsere Freunde einladen.</li>
                </ul>
              </div>
            </div>
          </Callout>

          <Callout title="Questions, negation, and subordinate clauses">
            <div style={{ display: "grid", gap: 10 }}>
              <div>
                <strong>Questions</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, display: "grid", gap: 4 }}>
                  <li>Wann fängst du an?</li>
                  <li>Stehst du jeden Tag um 7 Uhr auf?</li>
                  <li>Bringst du etwas mit?</li>
                </ul>
              </div>
              <div>
                <strong>Negation</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, display: "grid", gap: 4 }}>
                  <li>Ich fange heute nicht um 8 Uhr an.</li>
                  <li>Wir laden unsere Freunde nicht ein.</li>
                  <li>Er bringt keinen Kuchen mit.</li>
                </ul>
              </div>
              <div>
                <strong>Subordinate clause (weil / dass / wenn)</strong>
                <div style={{ marginTop: 4 }}>
                  In subordinate clauses, the verb goes to the end and the separable verb stays together.
                </div>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, display: "grid", gap: 4 }}>
                  <li>Ich bleibe zu Hause, weil ich um 8 Uhr anfange.</li>
                  <li>Ich weiß, dass er seine Freunde einlädt.</li>
                  <li>Wir glauben, dass sie morgen zurückkommt.</li>
                </ul>
              </div>
            </div>
          </Callout>

          <Callout title="Common separable prefixes + mini practice">
            <div style={{ display: "grid", gap: 8 }}>
              <ChipRow
                items={[
                  "an- (start): anfangen, anrufen",
                  "auf- (up/open): aufstehen, aufmachen",
                  "ab- (away/off): abholen, abfahren",
                  "ein- (in): einladen, einsteigen",
                  "mit- (with): mitbringen, mitkommen",
                  "zurück- (back): zurückkommen, zurückfahren",
                ]}
              />
              <div>
                <strong>Quick class practice:</strong>
                <ol style={{ margin: "6px 0 0", paddingLeft: 18, display: "grid", gap: 4 }}>
                  <li>Ich fange um 8 Uhr _____. (an)</li>
                  <li>Er steht jeden Morgen um 7 Uhr _____. (auf)</li>
                  <li>Wir laden unsere Freunde _____. (ein)</li>
                  <li>Rewrite with <em>weil</em>: Er steht um 7 Uhr auf.</li>
                </ol>
              </div>
            </div>
          </Callout>

          <Callout title="Frequency words (immer / oft / manchmal …)">
            <div style={{ display: "grid", gap: 8 }}>
              <ChipRow items={["immer", "oft", "manchmal", "selten", "nie", "fast nie"]} />
              <div style={{ lineHeight: 1.6 }}>
                Simple main clause pattern:
                <div style={{ marginTop: 6 }}>
                  <strong>Ich</strong> stehe <strong>oft</strong> um sieben Uhr auf.
                </div>
                <div style={{ opacity: 0.85, marginTop: 6 }}>
                  Tipp: Frequency words often come after the verb in very simple A1 sentences.
                </div>
              </div>
            </div>
          </Callout>
        </div>
      </Section>

      <Section
        title="6) Practice: Convert times (self-check)"
        subtitle="Type your answer, check, and learn from the correct form."
      >
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              style={{
                ...(mode === "toGerman" ? styles.primaryButton : styles.secondaryButton),
                width: "fit-content",
              }}
              onClick={() => {
                setMode("toGerman");
                setIndex(0);
                resetAttempt();
              }}
            >
              Digits → German
            </button>
            <button
              style={{
                ...(mode === "toDigits" ? styles.primaryButton : styles.secondaryButton),
                width: "fit-content",
              }}
              onClick={() => {
                setMode("toDigits");
                setIndex(0);
                resetAttempt();
              }}
            >
              German → Digits
            </button>

            <div style={{ display: "flex", gap: 8, marginLeft: "auto", flexWrap: "wrap" }}>
              <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={prev}>
                Prev
              </button>
              <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={next}>
                Next
              </button>
            </div>
          </div>

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 12,
              display: "grid",
              gap: 10,
              background: "#fff",
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                Question {index + 1} / {activeSet.length} • {current.note}
              </div>

              {mode === "toGerman" ? (
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  Write in German: <span style={{ opacity: 0.9 }}>{current.time}</span>
                </div>
              ) : (
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  Write in digits (HH:MM): <span style={{ opacity: 0.9 }}>{current.prompt}</span>
                </div>
              )}

              <div style={{ fontSize: 13, opacity: 0.8 }}>{formatHint()}</div>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === "toGerman" ? 'e.g. "halb zwei"' : "e.g. 08:35"}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  outline: "none",
                  fontSize: 15,
                }}
              />

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={{ ...styles.primaryButton, width: "fit-content" }} onClick={check}>
                  Check
                </button>
                <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={reveal}>
                  Show Answer
                </button>
                <button
                  style={{ ...styles.secondaryButton, width: "fit-content" }}
                  onClick={resetAttempt}
                >
                  Reset
                </button>
              </div>

              {checked ? (
                <div
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    background: "#f9fafb",
                    lineHeight: 1.6,
                  }}
                >
                  {isCorrect ? (
                    <div>
                      ✅ <strong>Correct!</strong>
                    </div>
                  ) : (
                    <div>
                      ❌ <strong>Not quite.</strong> Try again or click “Show Answer”.
                    </div>
                  )}
                </div>
              ) : null}

              {showAnswer ? (
                <div
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  <div style={{ marginBottom: 6 }}>
                    <strong>Accepted answer(s):</strong>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
                    {(current.answers || []).map((a) => (
                      <li key={a}>
                        <span style={{ fontWeight: 700 }}>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <Callout title="Extra challenge (speaking)">
            <div style={{ display: "grid", gap: 8 }}>
              <div>Say these out loud 3 times:</div>
              <ChipRow items={["halb neun", "Viertel vor zwei", "fünf vor halb acht", "zehn nach halb fünf"]} />
              <div style={{ opacity: 0.85 }}>
                Goal: no long pauses — speak it like one phrase.
              </div>
            </div>
          </Callout>
        </div>
      </Section>

      <Section
        title="7) Quick worksheet (teacher-ready)"
        subtitle="You can copy these as class questions or homework."
      >
        <div style={{ display: "grid", gap: 10 }}>
          <Callout title="A) Convert to German">
            <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
              <li>07:30</li>
              <li>09:15</li>
              <li>12:45</li>
              <li>18:20</li>
              <li>08:25</li>
              <li>14:35</li>
            </ol>
          </Callout>

          <Callout title="B) Convert to digits (HH:MM)">
            <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
              <li>halb sechs</li>
              <li>Viertel nach vier</li>
              <li>Viertel vor acht</li>
              <li>zehn vor halb drei</li>
              <li>fünf nach halb zehn</li>
              <li>zwanzig vor neun</li>
            </ol>
          </Callout>

          <Callout title='C) Make full sentences (use "um" / "von…bis")'>
            <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
              <li>Film / beginnen / 19:45</li>
              <li>Deutschkurs / sein / 18:00</li>
              <li>arbeiten / 08:00–16:00</li>
              <li>Zeit haben / 14:00–15:30</li>
            </ol>
          </Callout>
        </div>
      </Section>
    </div>
  );
};

export default TwelveHourClockPage;
