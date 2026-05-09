import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 12 };

const section = {
  ...styles.card,
  display: "grid",
  gap: 14,
};

const infoBox = {
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 6,
};

const yearPartColor = {
  thousandPart: "#2563eb",
  hundertPart: "#7c3aed",
  restPart: "#ea580c",
  post2000Part: "#059669",
};

const tipBox = {
  border: "1px solid #fde68a",
  background: "#fffbeb",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 6,
};

const answerBox = {
  border: "1px solid #d1d5db",
  borderRadius: 10,
  padding: 10,
  background: "#ecfdf5",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
};

const lightBtn = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
};

const darkBtn = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #111827",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
};

const heroCard = {
  ...styles.card,
  padding: 0,
  overflow: "hidden",
};

const heroImage =
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=80";

const numbersItems = [
  ["56", "sechsundfünfzig"],
  ["248", "zweihundertachtundvierzig"],
  ["1,234", "eintausendzweihundertvierunddreißig"],
  ["3,452", "dreitausendvierhundertzweiundfünfzig"],
  ["4,560", "viertausendfünfhundertsechzig"],
  ["5,678", "fünftausendsechshundertachtundsiebzig"],
  ["6,789", "sechstausendsiebenhundertneunundachtzig"],
  ["7,890", "siebentausendachthundertneunzig"],
  ["9,999", "neuntausendneunhundertneunundneunzig"],
];

const timePracticeItems = [
  ["2:15", "Es ist Viertel nach zwei."],
  ["5:45", "Es ist Viertel vor sechs."],
  ["7:30", "Es ist halb acht."],
  ["10:10", "Es ist zehn nach zehn."],
  ["8:20", "Es ist zwanzig nach acht."],
];

const yearPracticeItems = [
  ["1453", "vierzehnhundertdreiundfünfzig"],
  ["1944", "neunzehnhundertvierundvierzig"],
  ["1999", "neunzehnhundertneunundneunzig"],
  ["2000", "zweitausend"],
  ["2010", "zweitausendzehn"],
  ["2025", "zweitausendfünfundzwanzig"],
  ["2030", "zweitausenddreißig"],
];

const birthdayMcqItems = [
  {
    prompt: "12.05.1995",
    correct: 1,
    options: [
      "Ich bin am zwölf Mai neunzehnhundertfünfundneunzig geboren.",
      "Ich bin am zwölften Mai neunzehnhundertfünfundneunzig geboren.",
      "Ich bin geboren am zwölften Mai neunzehnhundertfünfundneunzig.",
    ],
  },
  {
    prompt: "03.07.1980",
    correct: 0,
    options: [
      "Ich bin am dritten Juli neunzehnhundertachtzig geboren.",
      "Ich bin am drei Juli neunzehnhundertachtzig geboren.",
      "Ich bin geboren am dritten Juli neunzehnhundertachtzig.",
    ],
  },
  {
    prompt: "01.01.2001",
    correct: 1,
    options: [
      "Ich bin am ein Januar zweitausendeins geboren.",
      "Ich bin am ersten Januar zweitausendeins geboren.",
      "Ich bin geboren am ersten Januar zweitausendeins.",
    ],
  },
];

const pricesQaItems = [
  {
    question: "Wie viel kostet das Buch?",
    answer: "Es kostet zehn Euro.",
  },
  {
    question: "Wie viel kostet der Apfel?",
    answer: "Er kostet zwei Euro.",
  },
  {
    question: "Wie viel kostet die Banane?",
    answer: "Sie kostet einen Euro.",
  },
  {
    question: "Wie viel kostet die Zeitung?",
    answer: "Sie kostet zwei Euro fünfzig.",
  },
  {
    question: "Wie viel kostet die Tasse?",
    answer: "Sie kostet drei Euro.",
  },
];

const kostetKostenMcqItems = [
  {
    prompt: "Wie viel kostet die Zeitung?",
    correct: 0,
    options: [
      "Sie kostet zwei Euro fünfzig.",
      "Sie kosten zwei Euro fünfzig.",
      "Er kostet zwei Euro fünfzig.",
    ],
  },
  {
    prompt: "Wie viel kosten die Bücher?",
    correct: 1,
    options: [
      "Sie kostet zwanzig Euro.",
      "Sie kosten zwanzig Euro.",
      "Er kostet zwanzig Euro.",
    ],
  },
];

const wordOrderBuildItems = [
  {
    prompt: "Ich / gehe / am Montag / zur Schule",
    answer: "Ich gehe am Montag zur Schule.",
  },
  {
    prompt: "Am Dienstag / treibe / ich / Sport",
    answer: "Am Dienstag treibe ich Sport.",
  },
  {
    prompt: "Ich / koche / am Mittwoch",
    answer: "Ich koche am Mittwoch.",
  },
  {
    prompt: "Am Donnerstag / mache / ich / Hausaufgaben",
    answer: "Am Donnerstag mache ich Hausaufgaben.",
  },
  {
    prompt: "Ich / lese / am Freitag",
    answer: "Ich lese am Freitag.",
  },
  {
    prompt: "Am Samstag / treffe / ich / Freunde",
    answer: "Am Samstag treffe ich Freunde.",
  },
  {
    prompt: "Ich / gehe / am Sonntag / im Park spazieren",
    answer: "Ich gehe am Sonntag im Park spazieren.",
  },
];

const wordOrderMcqItems = [
  {
    prompt: "Choose the correct sentence.",
    correct: 0,
    options: [
      "Ich gehe am Montag zur Schule.",
      "Ich am Montag gehe zur Schule.",
      "Am Montag ich gehe zur Schule.",
    ],
  },
  {
    prompt: "Choose the correct sentence.",
    correct: 1,
    options: [
      "Am Dienstag ich treibe Sport.",
      "Am Dienstag treibe ich Sport.",
      "Am Dienstag Sport treibe ich.",
    ],
  },
  {
    prompt: "Choose the correct sentence.",
    correct: 2,
    options: [
      "Am Freitag ich lese.",
      "Ich am Freitag lese.",
      "Ich lese am Freitag.",
    ],
  },
];

function RevealPractice({ title, subtitle, items, placeholder = "Type your answer..." }) {
  const [show, setShow] = useState({});
  const [inputs, setInputs] = useState({});

  return (
    <section style={section}>
      <div style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        {subtitle ? <p style={{ margin: 0 }}>{subtitle}</p> : null}
      </div>

      {items.map(([q, a], i) => (
        <div key={`${q}-${i}`} style={card}>
          <strong>{q}</strong>

          <input
            style={inputStyle}
            placeholder={placeholder}
            value={inputs[i] || ""}
            onChange={(e) => setInputs((prev) => ({ ...prev, [i]: e.target.value }))}
          />

          <button
            type="button"
            style={lightBtn}
            onClick={() => setShow((prev) => ({ ...prev, [i]: !prev[i] }))}
          >
            {show[i] ? "Hide answer" : "Show answer"}
          </button>

          {show[i] ? <div style={answerBox}>{a}</div> : null}
        </div>
      ))}
    </section>
  );
}

function QaRevealSection({ title, subtitle, items }) {
  const [show, setShow] = useState({});

  return (
    <section style={section}>
      <div style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        {subtitle ? <p style={{ margin: 0 }}>{subtitle}</p> : null}
      </div>

      {items.map((item, i) => (
        <div key={i} style={card}>
          <strong>{item.question}</strong>

          <button
            type="button"
            style={lightBtn}
            onClick={() => setShow((prev) => ({ ...prev, [i]: !prev[i] }))}
          >
            {show[i] ? "Hide answer" : "Show answer"}
          </button>

          {show[i] ? <div style={answerBox}>{item.answer}</div> : null}
        </div>
      ))}
    </section>
  );
}

function McqSection({ title, subtitle, items }) {
  const [selected, setSelected] = useState({});
  const [checked, setChecked] = useState({});

  return (
    <section style={section}>
      <div style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        {subtitle ? <p style={{ margin: 0 }}>{subtitle}</p> : null}
      </div>

      {items.map((item, qi) => (
        <div key={qi} style={card}>
          <strong>{item.prompt}</strong>

          {item.options.map((opt, oi) => {
            const isCorrect = checked[qi] && oi === item.correct;
            const isWrong = checked[qi] && selected[qi] === oi && oi !== item.correct;

            return (
              <button
                key={oi}
                type="button"
                style={{
                  ...lightBtn,
                  textAlign: "left",
                  background: isCorrect ? "#dcfce7" : isWrong ? "#fee2e2" : "#fff",
                }}
                onClick={() => setSelected((prev) => ({ ...prev, [qi]: oi }))}
              >
                {String.fromCharCode(65 + oi)}. {opt}
              </button>
            );
          })}

          <button
            type="button"
            style={darkBtn}
            onClick={() => setChecked((prev) => ({ ...prev, [qi]: true }))}
          >
            Check answer
          </button>
        </div>
      ))}
    </section>
  );
}

function BuildSentenceSection({ title, subtitle, items }) {
  const [show, setShow] = useState({});
  const [inputs, setInputs] = useState({});

  return (
    <section style={section}>
      <div style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        {subtitle ? <p style={{ margin: 0 }}>{subtitle}</p> : null}
      </div>

      {items.map((item, i) => (
        <div key={i} style={card}>
          <strong>{item.prompt}</strong>

          <input
            style={inputStyle}
            placeholder="Write the correct sentence..."
            value={inputs[i] || ""}
            onChange={(e) => setInputs((prev) => ({ ...prev, [i]: e.target.value }))}
          />

          <button
            type="button"
            style={lightBtn}
            onClick={() => setShow((prev) => ({ ...prev, [i]: !prev[i] }))}
          >
            {show[i] ? "Hide answer" : "Show answer"}
          </button>

          {show[i] ? <div style={answerBox}>{item.answer}</div> : null}
        </div>
      ))}
    </section>
  );
}

export default function A1RevisionOriginalContentPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrap}>
      <div style={styles.page}>
        <section style={heroCard}>
          <img
            src={heroImage}
            alt="German revision lesson"
            style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
          />
          <div style={{ padding: 18, display: "grid", gap: 8 }}>
            <h1 style={{ margin: 0 }}>A1 Revision — Numbers, Time, Years, Birthdays, Prices, and Word Order</h1>
            <p style={{ margin: 0 }}>
              This revision page helps you practice practical German for everyday situations.
            </p>
            <button type="button" style={lightBtn} onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>
        </section>

        <section style={section}>
          <h2 style={{ margin: 0 }}>Introduction to the Numbers Practice</h2>
          <p style={{ margin: 0 }}>
            Hello, dear students! Today, we will practice our number skills in German.
            We will read different numbers out loud in German to ensure we understand
            and can use them correctly. Numbers are an important part of the language
            and help us in many situations, such as shopping, describing age, or
            dealing with money.
          </p>
        </section>

        <RevealPractice
          title="Practice: Numbers from 1 to 10,000"
          subtitle="Read the numbers out loud in German. You can type first, then reveal the answer."
          items={numbersItems}
          placeholder="Type the number in German..."
        />

        <section style={section}>
          <h2 style={{ margin: 0 }}>Practice: Asking for the Time in German</h2>

          <div style={infoBox}>
            <div><strong>🕒 Wie spät ist es?</strong></div>
            <div><strong>✅ Key Question:</strong> Wie spät ist es? – What time is it?</div>
            <div><strong>🗣️ Other Way to Ask:</strong> Wie viel Uhr ist es?</div>
          </div>

          <div style={tipBox}>
            <div><strong>💬 Example Answers:</strong></div>
            <div>Es ist ein Uhr.</div>
            <div>Es ist drei Uhr.</div>
            <div>Es ist halb vier.</div>
            <div>Es ist Viertel nach zwei.</div>
            <div>Es ist Viertel vor sechs.</div>
          </div>

          <div style={infoBox}>
            <div><strong>🕰️ Tips:</strong></div>
            <div>In German, the 12-hour clock and the 24-hour clock are both used.</div>
            <div>For informal speech, the 12-hour clock is common.</div>
            <div>"Uhr" is always used after the hour number when telling time.</div>
          </div>
        </section>

        <RevealPractice
          title="Time Practice"
          subtitle="Say the time in German."
          items={timePracticeItems}
          placeholder="Type the full answer..."
        />

        <section style={section}>
          <h2 style={{ margin: 0 }}>Explanation of Years in German</h2>
          <p style={{ margin: 0 }}>
            In German, the years from 1000 to 1999 are typically spoken with
            <strong> hundert</strong>, while years from 2000 onwards are spoken differently.
          </p>

          <div style={infoBox}>
            <div>1100: <span style={{ color: yearPartColor.thousandPart }}>elf</span><span style={{ color: yearPartColor.hundertPart }}>hundert</span></div>
            <div>1234: <span style={{ color: yearPartColor.thousandPart }}>zwölf</span><span style={{ color: yearPartColor.hundertPart }}>hundert</span><span style={{ color: yearPartColor.restPart }}>vierunddreißig</span></div>
            <div>1356: <span style={{ color: yearPartColor.thousandPart }}>dreizehn</span><span style={{ color: yearPartColor.hundertPart }}>hundert</span><span style={{ color: yearPartColor.restPart }}>sechsundfünfzig</span></div>
            <div>1365: <span style={{ color: yearPartColor.thousandPart }}>dreizehn</span><span style={{ color: yearPartColor.hundertPart }}>hundert</span><span style={{ color: yearPartColor.restPart }}>fünfundsechzig</span></div>
            <div>1453: <span style={{ color: yearPartColor.thousandPart }}>vierzehn</span><span style={{ color: yearPartColor.hundertPart }}>hundert</span><span style={{ color: yearPartColor.restPart }}>dreiundfünfzig</span></div>
            <div>1544: <span style={{ color: yearPartColor.thousandPart }}>fünfzehn</span><span style={{ color: yearPartColor.hundertPart }}>hundert</span><span style={{ color: yearPartColor.restPart }}>vierundvierzig</span></div>
            <div>1644: <span style={{ color: yearPartColor.thousandPart }}>sechzehn</span><span style={{ color: yearPartColor.hundertPart }}>hundert</span><span style={{ color: yearPartColor.restPart }}>vierundvierzig</span></div>
            <div>1744: <span style={{ color: yearPartColor.thousandPart }}>siebzehn</span><span style={{ color: yearPartColor.hundertPart }}>hundert</span><span style={{ color: yearPartColor.restPart }}>vierundvierzig</span></div>
            <div>1844: <span style={{ color: yearPartColor.thousandPart }}>achtzehn</span><span style={{ color: yearPartColor.hundertPart }}>hundert</span><span style={{ color: yearPartColor.restPart }}>vierundvierzig</span></div>
            <div>1944: <span style={{ color: yearPartColor.thousandPart }}>neunzehn</span><span style={{ color: yearPartColor.hundertPart }}>hundert</span><span style={{ color: yearPartColor.restPart }}>vierundvierzig</span></div>
          </div>

          <div style={tipBox}>
            <div>
              For example, the year <strong>1999</strong> is said as{" "}
              <strong>neunzehnhundertneunundneunzig</strong>.
            </div>
          </div>

          <div style={infoBox}>
            <div><strong>For years beyond 1999, you say the number directly:</strong></div>
            <div>2000: <span style={{ color: yearPartColor.post2000Part }}>zweitausend</span></div>
            <div>2010: <span style={{ color: yearPartColor.post2000Part }}>zweitausend</span><span style={{ color: yearPartColor.restPart }}>zehn</span></div>
            <div>2025: <span style={{ color: yearPartColor.post2000Part }}>zweitausend</span><span style={{ color: yearPartColor.restPart }}>fünfundzwanzig</span></div>
            <div>2030: <span style={{ color: yearPartColor.post2000Part }}>zweitausend</span><span style={{ color: yearPartColor.restPart }}>dreißig</span></div>
          </div>
        </section>

        <RevealPractice
          title="Year Practice"
          subtitle="Say the year in German."
          items={yearPracticeItems}
          placeholder="Type the year in German..."
        />

        <section style={section}>
          <h2 style={{ margin: 0 }}>Explaining “Ich bin am ... geboren.” in German</h2>
          <p style={{ margin: 0 }}>
            In German, when stating your birthdate, you use the structure:
            <strong> Ich bin am [date] geboren.</strong>
          </p>

          <div style={infoBox}>
            <div><strong>1️⃣ Understanding the Grammar</strong></div>
            <div>"Ich bin" = "I am" (part of the present perfect tense, used for past events).</div>
            <div>"am" = "on the" (short for "an dem", which triggers the dative case).</div>
            <div>[Date] = The date in its ordinal form.</div>
            <div>"geboren" = "born" (past participle, always at the end of the sentence).</div>
          </div>

          <div style={tipBox}>
            <div><strong>2️⃣ Forming Dates in German</strong></div>
            <div>1–19 → Add "-te"</div>
            <div>20 and above → Add "-ste"</div>
            <div>After "am", the ordinal number takes a dative ending:</div>
            <div>✔ "-te" changes to "-ten"</div>
            <div>✔ "-ste" changes to "-sten"</div>
          </div>

          <div style={infoBox}>
            <div><strong>3️⃣ Examples of Saying Your Birthday</strong></div>
            <div>
              12.05.1995 → Ich bin am zwölften Mai neunzehnhundertfünfundneunzig geboren.
            </div>
            <div>
              03.07.1980 → Ich bin am dritten Juli neunzehnhundertachtzig geboren.
            </div>
          </div>

          <div style={tipBox}>
            <div><strong>4️⃣ Common Mistakes to Avoid</strong></div>
            <div>❌ Ich bin am drei Juli geboren.</div>
            <div>✔ Ich bin am dritten Juli geboren.</div>
            <div>❌ Ich bin geboren am ersten Januar.</div>
            <div>✔ Ich bin am ersten Januar geboren.</div>
          </div>
        </section>

        <McqSection
          title="Birthday Practice"
          subtitle="Choose the correct sentence."
          items={birthdayMcqItems}
        />

        <section style={section}>
          <h2 style={{ margin: 0 }}>Practice: Asking and Saying Prices in German</h2>

          <div style={infoBox}>
            <div><strong>Step 1: Practice with Objects</strong></div>
            <div>das Buch</div>
            <div>der Apfel</div>
            <div>der Kaffee</div>
            <div>die Banane</div>
            <div>die Zeitung</div>
            <div>die Tasse</div>
          </div>

          <div style={tipBox}>
            <div><strong>Step 2: Ask and Answer</strong></div>
            <div>A: Wie viel kostet [object]?</div>
            <div>B: [Pronoun] kostet [price] Euro.</div>
          </div>

          <div style={infoBox}>
            <div><strong>Examples:</strong></div>
            <div>Wie viel kostet das Buch? → Es kostet zehn Euro.</div>
            <div>Wie viel kostet der Apfel? → Er kostet zwei Euro.</div>
            <div>Wie viel kostet die Banane? → Sie kostet einen Euro.</div>
          </div>
        </section>

        <QaRevealSection
          title="Price Question and Answer Practice"
          subtitle="Read the question. Then reveal the model answer."
          items={pricesQaItems}
        />

        <section style={section}>
          <h2 style={{ margin: 0 }}>Understanding “kostet” vs. “kosten”</h2>

          <div style={infoBox}>
            <div><strong>kostet</strong> → Use when talking about one item.</div>
            <div>Wie viel kostet die Zeitung?</div>
            <div>Sie kostet zwei Euro fünfzig.</div>
          </div>

          <div style={tipBox}>
            <div><strong>kosten</strong> → Use when talking about multiple items.</div>
            <div>Wie viel kosten die Bücher?</div>
            <div>Sie kosten zwanzig Euro.</div>
          </div>
        </section>

        <McqSection
          title="kostet vs. kosten Practice"
          subtitle="Choose the correct answer."
          items={kostetKostenMcqItems}
        />

        <section style={section}>
          <h2 style={{ margin: 0 }}>Sentence Building with Days and Activities</h2>

          <div style={infoBox}>
            <div><strong>Instructions:</strong></div>
            <div>1. Use either sentence structure 1 or 2.</div>
            <div>2. Arrange the sentences based on the chosen rule.</div>
            <div>3. Use only the given activities and add the pronoun and day.</div>
            <div>4. Do not add any extra words.</div>
          </div>

          <div style={tipBox}>
            <div><strong>Sentence Structures:</strong></div>
            <div>1⃣ Subject + Verb + Time + Other Elements</div>
            <div>2⃣ Time + Verb + Subject + Other Elements</div>
          </div>

          <div style={infoBox}>
            <div><strong>Days of the Week in German</strong></div>
            <div>Montag · Dienstag · Mittwoch · Donnerstag · Freitag · Samstag · Sonntag</div>
          </div>

          <div style={infoBox}>
            <div><strong>Pronouns to Pick From</strong></div>
            <div>ich · du · er · sie · es · wir · ihr · sie/Sie</div>
          </div>

          <div style={tipBox}>
            <div><strong>Activities to Use in Sentences</strong></div>
            <div>kochen</div>
            <div>Freunde treffen</div>
            <div>Hausaufgaben machen</div>
            <div>fernsehen</div>
            <div>lesen</div>
            <div>im Park spazieren gehen</div>
            <div>zur Schule gehen</div>
            <div>arbeiten</div>
            <div>Sport treiben</div>
            <div>einkaufen gehen</div>
          </div>

          <div style={infoBox}>
            <div><strong>Examples for Practice</strong></div>
            <div>Ich gehe am Montag zur Schule.</div>
            <div>Am Dienstag treibe ich Sport.</div>
          </div>

          <div style={tipBox}>
            <div>
              <strong>Your Turn:</strong> Remember to pay attention to the word order.
              In German, when you start a sentence with a time expression like
              “Am Montag”, the verb must come immediately after.
            </div>
          </div>
        </section>

        <BuildSentenceSection
          title="Arrange the Sentence"
          subtitle="Put the words in the correct order."
          items={wordOrderBuildItems}
        />

        <McqSection
          title="Word Order Practice"
          subtitle="Choose the correct sentence."
          items={wordOrderMcqItems}
        />
      </div>
    </div>
  );
}
