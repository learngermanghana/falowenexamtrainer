import React, { memo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 14,
};

const chipStyle = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: 999,
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  fontSize: 13,
  fontWeight: 700,
};

const softBox = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 14,
  background: "#f8fafc",
  lineHeight: 1.7,
};

const noteBox = {
  border: "1px solid #bfdbfe",
  borderRadius: 14,
  padding: 14,
  background: "#eff6ff",
  lineHeight: 1.7,
};

const warningBox = {
  border: "1px solid #fecaca",
  background: "#fff1f2",
  borderLeft: "6px solid #ef4444",
  borderRadius: 12,
  padding: 14,
  lineHeight: 1.7,
};

const thStyle = {
  border: "1px solid #d1d5db",
  padding: 10,
  textAlign: "left",
  background: "#f9fafb",
  verticalAlign: "top",
};

const tdStyle = {
  border: "1px solid #d1d5db",
  padding: 10,
  verticalAlign: "top",
  lineHeight: 1.6,
};

const imageStyle = {
  width: "100%",
  height: "clamp(180px, 28vw, 300px)",
  objectFit: "cover",
  display: "block",
};

const heroMain =
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80";
const imgLiegen =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80";
const imgWo =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80";
const imgNachIn =
  "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1400&q=80";
const imgIrregular =
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80";
const imgManMann =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1400&q=80";

const vowelChangeRows = [
  ["fahren", "fahre", "fährst", "fährt", "fahren", "fahrt", "fahren"],
  ["sprechen", "spreche", "sprichst", "spricht", "sprechen", "sprecht", "sprechen"],
  ["essen", "esse", "isst", "isst", "essen", "esst", "essen"],
  ["nehmen", "nehme", "nimmst", "nimmt", "nehmen", "nehmt", "nehmen"],
];

const ImageBreak = ({ src, alt, title, subtitle }) => (
  <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
    <img src={src} alt={alt} loading="lazy" style={imageStyle} />
    <div style={{ padding: 14, display: "grid", gap: 4 }}>
      <div style={{ fontWeight: 900, fontSize: 18 }}>{title}</div>
      <div style={{ opacity: 0.9, lineHeight: 1.6 }}>{subtitle}</div>
    </div>
  </div>
);

const TableScroll = ({ caption, minWidth = 560, children }) => (
  <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
    <table style={{ borderCollapse: "collapse", width: "100%", minWidth }}>
      {caption ? (
        <caption style={{ textAlign: "left", paddingBottom: 10, fontWeight: 800 }}>
          {caption}
        </caption>
      ) : null}
      {children}
    </table>
  </div>
);

const Choice = ({ children, isSelected, isCorrect, isWrong, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      border: isCorrect
        ? "2px solid #16a34a"
        : isWrong
          ? "2px solid #dc2626"
          : isSelected
            ? "2px solid #2563eb"
            : "1px solid #d1d5db",
      borderRadius: 12,
      padding: 12,
      background: isCorrect ? "#dcfce7" : isWrong ? "#fee2e2" : isSelected ? "#dbeafe" : "#fff",
      lineHeight: 1.6,
      textAlign: "left",
      cursor: "pointer",
      font: "inherit",
      width: "100%",
    }}
    aria-pressed={isSelected}
  >
    {children}
  </button>
);

const MCQCard = ({ number, question, options, correctIndex }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const hasSelection = selectedOption !== null;
  const isCorrect = hasSelection && selectedOption === correctIndex;

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 14,
        background: "#fff",
        display: "grid",
        gap: 12,
      }}
    >
      <div
        style={{
          border: "1px solid #dbeafe",
          borderRadius: 14,
          padding: 14,
          background: "#eff6ff",
          fontWeight: 800,
          lineHeight: 1.6,
        }}
      >
        {number}. {question}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {options.map((option, index) => (
          <Choice
            key={option}
            isSelected={selectedOption === index}
            isCorrect={hasSelection && index === correctIndex}
            isWrong={hasSelection && selectedOption === index && selectedOption !== correctIndex}
            onClick={() => setSelectedOption(index)}
          >
            {option}
          </Choice>
        ))}
      </div>

      {hasSelection ? (
        <div
          style={{
            borderRadius: 12,
            padding: "10px 12px",
            fontWeight: 700,
            background: isCorrect ? "#ecfdf5" : "#fff1f2",
            border: isCorrect ? "1px solid #86efac" : "1px solid #fecaca",
            color: isCorrect ? "#166534" : "#991b1b",
          }}
        >
          {isCorrect ? "✅ Correct answer." : `❌ Wrong answer. Correct answer: ${options[correctIndex]}`}
        </div>
      ) : null}
    </div>
  );
};

const MCQSection = ({ title, instruction, questions }) => (
  <section style={sectionStyle}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    <div style={softBox}>{instruction}</div>
    <div style={{ display: "grid", gap: 14 }}>
      {questions.map((q, idx) => (
        <MCQCard
          key={`${title}-${idx}`}
          number={idx + 1}
          question={q.question}
          options={q.options}
          correctIndex={q.correctIndex}
        />
      ))}
    </div>
  </section>
);

const FormingBasicStatementsPage = () => {
  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 10 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 Practice Book – Day 8</h1>
        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>
          Topic: countries, cities, direction words, and simple past forms with{" "}
          <strong>sein</strong> and <strong>haben</strong>.
        </p>
      </header>

      <ImageBreak
        src={heroMain}
        alt="Students learning grammar"
        title="Today’s lesson"
        subtitle="Today we practise where a city is, where someone comes from, where someone is going, and how to understand present and past with sein and haben."
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Lesson at a glance</h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <span style={chipStyle}>Präsens = Present</span>
          <span style={chipStyle}>Perfekt = Present Perfect</span>
          <span style={chipStyle}>Präteritum = Simple Past</span>
          <span style={chipStyle}>Futur = Future</span>
        </div>

        <div style={softBox}>
          <strong>Important:</strong> Today we focus on <strong>Präteritum</strong>.
          <br />
          <br />
          In A1, students should first learn to <strong>recognize</strong> these forms. They do not need very long grammar explanations yet.
        </div>

        <TableScroll caption="German tense names with English translation">
          <thead>
            <tr>
              <th style={thStyle}>German</th>
              <th style={thStyle}>English</th>
              <th style={thStyle}>Easy meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Präsens</td>
              <td style={tdStyle}>Present</td>
              <td style={tdStyle}>I live / I am</td>
            </tr>
            <tr>
              <td style={tdStyle}>Perfekt</td>
              <td style={tdStyle}>Present Perfect</td>
              <td style={tdStyle}>I have lived / I have gone</td>
            </tr>
            <tr>
              <td style={tdStyle}>Präteritum</td>
              <td style={tdStyle}>Simple Past</td>
              <td style={tdStyle}>I lived / I was / I had</td>
            </tr>
            <tr>
              <td style={tdStyle}>Futur</td>
              <td style={tdStyle}>Future</td>
              <td style={tdStyle}>I will live / I will go</td>
            </tr>
          </tbody>
        </TableScroll>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>sein and haben: present and past</h2>

        <div style={softBox}>
          Two very important verbs in German are <strong>sein</strong> (to be) and <strong>haben</strong> (to have).
          <br />
          <br />
          In the present: <strong>ich bin</strong> = I am, <strong>ich habe</strong> = I have
          <br />
          In the simple past: <strong>ich war</strong> = I was, <strong>ich hatte</strong> = I had
        </div>

        <TableScroll caption="Conjugation comparison">
          <thead>
            <tr>
              <th style={thStyle}>Pronoun</th>
              <th style={thStyle}>sein (Präsens)</th>
              <th style={thStyle}>sein (Präteritum)</th>
              <th style={thStyle}>haben (Präsens)</th>
              <th style={thStyle}>haben (Präteritum)</th>
              <th style={thStyle}>English</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["ich", "bin", "war", "habe", "hatte", "I am / I was / I have / I had"],
              ["du", "bist", "warst", "hast", "hattest", "you are / you were / you have / you had"],
              ["er / sie / es", "ist", "war", "hat", "hatte", "he/she/it is / was / has / had"],
              ["wir", "sind", "waren", "haben", "hatten", "we are / were / have / had"],
              ["ihr", "seid", "wart", "habt", "hattet", "you all are / were / have / had"],
              ["sie / Sie", "sind", "waren", "haben", "hatten", "they are / were / have / had; you are / were / have / had (formal)"],
            ].map((row) => (
              <tr key={row[0]}>
                {row.map((cell) => <td key={cell} style={tdStyle}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </TableScroll>

        <div style={noteBox}>
          <strong>Examples:</strong>
          <br />
          Heute <strong>bin</strong> ich in der Schule.
          <br />
          Gestern <strong>war</strong> ich in der Schule.
          <br />
          Heute <strong>habe</strong> ich Unterricht.
          <br />
          Gestern <strong>hatte</strong> ich Unterricht.
        </div>
      </section>

      <MCQSection
        title="Practice 1"
        instruction="Choose the correct verb form. Remember: time word first, verb second. Example: Gestern war ich ..."
        questions={[
          { question: "Ich ___ heute in Accra.", options: ["A. bin", "B. war", "C. hatte"], correctIndex: 0 },
          { question: "Gestern ___ ich in Kumasi.", options: ["A. bin", "B. war", "C. habe"], correctIndex: 1 },
        ]}
      />

      <ImageBreak src={imgLiegen} alt="Map and city landscape" title="liegen = to be located" subtitle="Now we learn how to say where a city is." />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>liegen = to be located</h2>
        <div style={softBox}>
          We use <strong>liegen</strong> to say where a city or place is located. First learn the four direction words: <strong>der Osten</strong> = east, <strong>der Westen</strong> = west, <strong>der Süden</strong> = south, <strong>der Norden</strong> = north.
        </div>
        <div style={noteBox}>
          <strong>Main question:</strong> <em>Wo liegt ... ?</em>
          <br />
          This means: <strong>Where is ... located?</strong>
        </div>
        <TableScroll caption="Examples with translation">
          <tbody>
            <tr><td style={tdStyle}>Berlin liegt im Osten von Deutschland.</td><td style={tdStyle}>Berlin is in the east of Germany.</td></tr>
            <tr><td style={tdStyle}>Köln liegt im Westen von Deutschland.</td><td style={tdStyle}>Cologne is in the west of Germany.</td></tr>
            <tr><td style={tdStyle}>München liegt im Süden von Deutschland.</td><td style={tdStyle}>Munich is in the south of Germany.</td></tr>
            <tr><td style={tdStyle}>Hamburg liegt im Norden von Deutschland.</td><td style={tdStyle}>Hamburg is in the north of Germany.</td></tr>
          </tbody>
        </TableScroll>
      </section>

      <MCQSection
        title="Practice 2"
        instruction="Choose the correct answer."
        questions={[
          { question: "Wo liegt Berlin?", options: ["A. Berlin liegt im Osten von Deutschland.", "B. Berlin liegt im Norden von Deutschland.", "C. Berlin liegt im Süden von Deutschland."], correctIndex: 0 },
          { question: "Wo liegt Hamburg?", options: ["A. Hamburg liegt im Westen von Deutschland.", "B. Hamburg liegt im Norden von Deutschland.", "C. Hamburg liegt im Osten von Deutschland."], correctIndex: 1 },
          { question: "What does 'Wo liegt München?' mean?", options: ["A. Where does Munich come from?", "B. Where is Munich located?", "C. Where is Munich going?"], correctIndex: 1 },
        ]}
      />

      <ImageBreak src={imgWo} alt="Travel signs" title="wo, woher, wohin" subtitle="These three question words are very important in A1." />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>wo, woher, wohin</h2>
        <div style={softBox}>
          <strong>wo</strong> = where (location), <strong>woher</strong> = where from (origin), <strong>wohin</strong> = where to (direction / destination).
        </div>
        <TableScroll caption="Useful patterns with translation">
          <tbody>
            <tr><td style={tdStyle}>Wo bist du? – Ich bin in der Schule.</td><td style={tdStyle}>Where are you? – I am at school.</td></tr>
            <tr><td style={tdStyle}>Woher kommst du? – Ich komme aus Ghana.</td><td style={tdStyle}>Where are you from? – I come from Ghana.</td></tr>
            <tr><td style={tdStyle}>Wohin fährst du? – Ich fahre nach Berlin.</td><td style={tdStyle}>Where are you going? – I am going to Berlin.</td></tr>
          </tbody>
        </TableScroll>
      </section>

      <MCQSection
        title="Practice 3"
        instruction="Choose the correct question word or meaning."
        questions={[
          { question: "___ kommst du?", options: ["A. Wo", "B. Woher", "C. Wohin"], correctIndex: 1 },
          { question: "___ gehst du heute?", options: ["A. Wohin", "B. Woher", "C. Wo"], correctIndex: 0 },
          { question: "What does 'Wo bist du?' mean?", options: ["A. Where are you?", "B. Where do you come from?", "C. Where are you going?"], correctIndex: 0 },
        ]}
      />

      <ImageBreak src={imgNachIn} alt="Airport travel scene" title="nach vs in" subtitle="Now we learn when to use nach and when to use in + article." />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>nach vs in</h2>
        <div style={softBox}>
          Use <strong>nach</strong> for cities and countries with no article: <strong>nach Ghana</strong>, <strong>nach Deutschland</strong>, <strong>nach Berlin</strong>. Use <strong>in + article</strong> for countries with an article: <strong>in die Schweiz</strong>, <strong>in die USA</strong>, <strong>in den Iran</strong>.
        </div>
        <TableScroll caption="Direction: wohin?">
          <thead>
            <tr><th style={thStyle}>No article → nach</th><th style={thStyle}>With article → in + article</th></tr>
          </thead>
          <tbody>
            <tr><td style={tdStyle}>Ich fliege nach Deutschland.</td><td style={tdStyle}>Ich fliege in die Schweiz.</td></tr>
            <tr><td style={tdStyle}>Wir fahren nach Italien.</td><td style={tdStyle}>Wir reisen in die USA.</td></tr>
            <tr><td style={tdStyle}>Sie fährt nach Ghana.</td><td style={tdStyle}>Er fährt in den Iran.</td></tr>
            <tr><td style={tdStyle}>Ich fahre nach Berlin.</td><td style={tdStyle}>Wir fahren in die Türkei.</td></tr>
          </tbody>
        </TableScroll>
      </section>

      <MCQSection
        title="Practice 4"
        instruction="Choose the correct form."
        questions={[
          { question: "Ich fliege ___ Deutschland.", options: ["A. nach", "B. in die", "C. aus"], correctIndex: 0 },
          { question: "Wir reisen ___ Schweiz.", options: ["A. nach", "B. in die", "C. aus der"], correctIndex: 1 },
          { question: "Er fährt ___ Iran.", options: ["A. in den", "B. nach", "C. aus dem"], correctIndex: 0 },
          { question: "Sie fährt ___ Accra.", options: ["A. in die", "B. nach", "C. aus"], correctIndex: 1 },
        ]}
      />

      <ImageBreak src={imgIrregular} alt="Notebook and grammar study" title="Irregular verbs with vowel change" subtitle="Some verbs change their vowel in du and er/sie/es, but the table now shows all pronouns." />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Irregular verbs with vowel change</h2>
        <div style={softBox}>
          German vowels are <strong>a, e, i, o, u</strong>. In some verbs, the vowel changes mainly in the <strong>du</strong> form and in the <strong>er / sie / es</strong> form. The other pronouns still help students see the full pattern.
          <br />
          <br />
          Example: <strong>ich fahre</strong> → <strong>du fährst</strong> → <strong>er fährt</strong>
          <br />
          <br />
          At A1, remember this simple pattern: <strong>a</strong> often changes to <strong>ä</strong> in the second and third person singular, for example <strong>du fährst</strong> and <strong>er fährt</strong>. The vowel <strong>e</strong> often changes to <strong>i</strong> or <strong>ie</strong>, for example <strong>du sprichst</strong> / <strong>er spricht</strong> and <strong>du liest</strong> / <strong>er liest</strong>.
        </div>

        <TableScroll caption="Common vowel changes" minWidth={760}>
          <thead>
            <tr>
              <th style={thStyle}>Verb</th>
              <th style={thStyle}>ich</th>
              <th style={thStyle}><strong>du</strong></th>
              <th style={thStyle}><strong>er / sie / es</strong></th>
              <th style={thStyle}>wir</th>
              <th style={thStyle}>ihr</th>
              <th style={thStyle}>sie / Sie</th>
            </tr>
          </thead>
          <tbody>
            {vowelChangeRows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) => (
                  <td key={`${row[0]}-${index}`} style={tdStyle}>
                    {index === 2 || index === 3 ? <strong>{cell}</strong> : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </TableScroll>
      </section>

      <MCQSection
        title="Practice 5"
        instruction="Choose the correct verb form. Here, Sie means she, not they and not formal you."
        questions={[
          { question: "Du ___ nach Berlin. (fahren)", options: ["A. fahre", "B. fährst", "C. fährt"], correctIndex: 1 },
          { question: "Er ___ Deutsch. (sprechen)", options: ["A. sprichst", "B. sprechen", "C. spricht"], correctIndex: 2 },
          { question: "Sie (she, not they or formal you) ___ Pizza. (essen)", options: ["A. isst", "B. essen", "C. esst"], correctIndex: 0 },
          { question: "Du ___ den Bus. (nehmen)", options: ["A. nimmst", "B. nimmt", "C. nehme"], correctIndex: 0 },
        ]}
      />

      <ImageBreak src={imgManMann} alt="A man standing outdoors" title="man vs Mann" subtitle="These two words look similar, but they are not the same." />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>man vs Mann</h2>
        <div style={warningBox}>
          <strong>Common mistake:</strong> <em>man</em> is a pronoun, so it is written with a small letter. <em>Mann</em> is a noun, so it is written with a capital letter.
          <br />
          Correct: <strong>Man spricht hier Deutsch.</strong>
          <br />
          Not correct: <strong>Mann spricht hier Deutsch.</strong>
        </div>
        <div style={softBox}>
          <strong>man</strong> = someone / people in general (pronoun)
          <br />
          <strong>Mann</strong> = a man (noun)
          <br />
          <strong>Man kann hier gut essen.</strong> = People can eat well here.
          <br />
          <strong>Der Mann ist Lehrer.</strong> = The man is a teacher.
        </div>
        <TableScroll caption="Conjugation with man (using essen)">
          <tbody>
            <tr><td style={tdStyle}>ich esse</td></tr>
            <tr><td style={tdStyle}>du isst</td></tr>
            <tr><td style={tdStyle}>er / sie / es / man isst</td></tr>
            <tr><td style={tdStyle}>wir essen</td></tr>
            <tr><td style={tdStyle}>ihr esst</td></tr>
            <tr><td style={tdStyle}>sie / Sie essen</td></tr>
          </tbody>
        </TableScroll>
      </section>

      <MCQSection
        title="Practice 6"
        instruction="Choose the correct word."
        questions={[
          { question: "___ spricht hier Deutsch.", options: ["A. Mann", "B. man", "C. Männer"], correctIndex: 1 },
          { question: "Der ___ kommt aus Berlin.", options: ["A. man", "B. Mann", "C. spricht"], correctIndex: 1 },
          { question: "In Deutschland spricht ___ Deutsch.", options: ["A. man", "B. Mann", "C. Männer"], correctIndex: 0 },
        ]}
      />
    </main>
  );
};

export default memo(FormingBasicStatementsPage);
