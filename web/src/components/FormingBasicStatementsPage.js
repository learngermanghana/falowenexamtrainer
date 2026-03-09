import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
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

const ImageBreak = ({ src, alt, title, subtitle }) => (
  <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{
        width: "100%",
        height: "clamp(180px, 28vw, 300px)",
        objectFit: "cover",
        display: "block",
      }}
    />
    <div style={{ padding: 14, display: "grid", gap: 4 }}>
      <div style={{ fontWeight: 900, fontSize: 18 }}>{title}</div>
      <div style={{ opacity: 0.9, lineHeight: 1.6 }}>{subtitle}</div>
    </div>
  </div>
);

const TableScroll = ({ caption, children }) => (
  <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
    <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 560 }}>
      {caption ? (
        <caption style={{ textAlign: "left", paddingBottom: 10, fontWeight: 800 }}>
          {caption}
        </caption>
      ) : null}
      {children}
    </table>
  </div>
);

const Choice = ({ children }) => (
  <div
    style={{
      border: "1px solid #d1d5db",
      borderRadius: 12,
      padding: 12,
      background: "#fff",
      lineHeight: 1.6,
    }}
  >
    {children}
  </div>
);

const MCQCard = ({ number, question, options }) => (
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
        <Choice key={index}>{option}</Choice>
      ))}
    </div>
  </div>
);

const MCQSection = ({ title, instruction, questions }) => (
  <section style={sectionStyle}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    <div style={softBox}>{instruction}</div>
    <div style={{ display: "grid", gap: 14 }}>
      {questions.map((q, idx) => (
        <MCQCard
          key={idx}
          number={idx + 1}
          question={q.question}
          options={q.options}
        />
      ))}
    </div>
  </section>
);

const FormingBasicStatementsPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 10 }}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A1 Practice Book – Day 8
        </h1>
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
          In A1, students should first learn to <strong>recognize</strong> these forms.
          They do not need very long grammar explanations yet. The goal is to see the
          pattern and use simple sentences correctly.
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
          Two very important verbs in German are <strong>sein</strong> (to be) and{" "}
          <strong>haben</strong> (to have).
          <br />
          <br />
          In the present:
          <br />
          <strong>ich bin</strong>, <strong>ich habe</strong>
          <br />
          In the simple past:
          <br />
          <strong>ich war</strong>, <strong>ich hatte</strong>
        </div>

        <TableScroll caption="Conjugation comparison">
          <thead>
            <tr>
              <th style={thStyle}>Pronoun</th>
              <th style={thStyle}>sein (Präsens)</th>
              <th style={thStyle}>sein (Präteritum)</th>
              <th style={thStyle}>haben (Präsens)</th>
              <th style={thStyle}>haben (Präteritum)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>ich</td>
              <td style={tdStyle}>bin</td>
              <td style={tdStyle}>war</td>
              <td style={tdStyle}>habe</td>
              <td style={tdStyle}>hatte</td>
            </tr>
            <tr>
              <td style={tdStyle}>du</td>
              <td style={tdStyle}>bist</td>
              <td style={tdStyle}>warst</td>
              <td style={tdStyle}>hast</td>
              <td style={tdStyle}>hattest</td>
            </tr>
            <tr>
              <td style={tdStyle}>er / sie / es</td>
              <td style={tdStyle}>ist</td>
              <td style={tdStyle}>war</td>
              <td style={tdStyle}>hat</td>
              <td style={tdStyle}>hatte</td>
            </tr>
            <tr>
              <td style={tdStyle}>wir</td>
              <td style={tdStyle}>sind</td>
              <td style={tdStyle}>waren</td>
              <td style={tdStyle}>haben</td>
              <td style={tdStyle}>hatten</td>
            </tr>
            <tr>
              <td style={tdStyle}>ihr</td>
              <td style={tdStyle}>seid</td>
              <td style={tdStyle}>wart</td>
              <td style={tdStyle}>habt</td>
              <td style={tdStyle}>hattet</td>
            </tr>
            <tr>
              <td style={tdStyle}>sie / Sie</td>
              <td style={tdStyle}>sind</td>
              <td style={tdStyle}>waren</td>
              <td style={tdStyle}>haben</td>
              <td style={tdStyle}>hatten</td>
            </tr>
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
        instruction="Choose the correct verb form."
        questions={[
          {
            question: "Ich ___ heute in Accra.",
            options: ["A. bin", "B. war", "C. hatte"],
          },
          {
            question: "Gestern ich ___ in Kumasi.",
            options: ["A. bin", "B. war", "C. habe"],
          },
          {
            question: "Wir ___ heute Unterricht.",
            options: ["A. haben", "B. hatten", "C. sind"],
          },
          {
            question: "Letzte Woche wir ___ keinen Unterricht.",
            options: ["A. haben", "B. sind", "C. hatten"],
          },
        ]}
      />

      <ImageBreak
        src={imgLiegen}
        alt="Map and city landscape"
        title="liegen = to be located"
        subtitle="Now we learn how to say where a city is."
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>liegen = to be located</h2>

        <div style={softBox}>
          We use <strong>liegen</strong> to say where a city or place is located.
          <br />
          <br />
          First learn the four direction words:
          <br />
          <strong>der Osten</strong> = east
          <br />
          <strong>der Westen</strong> = west
          <br />
          <strong>der Süden</strong> = south
          <br />
          <strong>der Norden</strong> = north
        </div>

        <div style={noteBox}>
          <strong>Main question:</strong> <em>Wo liegt ... ?</em>
          <br />
          This means: <strong>Where is ... located?</strong>
        </div>

        <TableScroll caption="Examples with translation">
          <tbody>
            <tr>
              <td style={tdStyle}>Berlin liegt im Osten von Deutschland.</td>
              <td style={tdStyle}>Berlin is in the east of Germany.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Köln liegt im Westen von Deutschland.</td>
              <td style={tdStyle}>Cologne is in the west of Germany.</td>
            </tr>
            <tr>
              <td style={tdStyle}>München liegt im Süden von Deutschland.</td>
              <td style={tdStyle}>Munich is in the south of Germany.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Hamburg liegt im Norden von Deutschland.</td>
              <td style={tdStyle}>Hamburg is in the north of Germany.</td>
            </tr>
          </tbody>
        </TableScroll>
      </section>

      <MCQSection
        title="Practice 2"
        instruction="Choose the correct answer."
        questions={[
          {
            question: "Wo liegt Berlin?",
            options: [
              "A. Berlin liegt im Osten von Deutschland.",
              "B. Berlin liegt im Norden von Deutschland.",
              "C. Berlin liegt im Süden von Deutschland.",
            ],
          },
          {
            question: "Wo liegt Hamburg?",
            options: [
              "A. Hamburg liegt im Westen von Deutschland.",
              "B. Hamburg liegt im Norden von Deutschland.",
              "C. Hamburg liegt im Osten von Deutschland.",
            ],
          },
          {
            question: "What does 'Wo liegt München?' mean?",
            options: [
              "A. Where does Munich come from?",
              "B. Where is Munich located?",
              "C. Where is Munich going?",
            ],
          },
        ]}
      />

      <ImageBreak
        src={imgWo}
        alt="Travel signs"
        title="wo, woher, wohin"
        subtitle="These three question words are very important in A1."
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>wo, woher, wohin</h2>

        <div style={softBox}>
          These three question words are very important:
          <br />
          <br />
          <strong>wo</strong> = where (location)
          <br />
          <strong>woher</strong> = where from (origin)
          <br />
          <strong>wohin</strong> = where to (direction)
        </div>

        <TableScroll caption="Meaning and use">
          <thead>
            <tr>
              <th style={thStyle}>Word</th>
              <th style={thStyle}>Meaning</th>
              <th style={thStyle}>Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>wo</td>
              <td style={tdStyle}>where</td>
              <td style={tdStyle}>location</td>
            </tr>
            <tr>
              <td style={tdStyle}>woher</td>
              <td style={tdStyle}>where from</td>
              <td style={tdStyle}>origin</td>
            </tr>
            <tr>
              <td style={tdStyle}>wohin</td>
              <td style={tdStyle}>where to</td>
              <td style={tdStyle}>direction / destination</td>
            </tr>
          </tbody>
        </TableScroll>

        <TableScroll caption="Useful patterns with translation">
          <tbody>
            <tr>
              <td style={tdStyle}>Wo bist du? – Ich bin in der Schule.</td>
              <td style={tdStyle}>Where are you? – I am at school.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Woher kommst du? – Ich komme aus Ghana.</td>
              <td style={tdStyle}>Where are you from? – I come from Ghana.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Wohin fährst du? – Ich fahre nach Berlin.</td>
              <td style={tdStyle}>Where are you going? – I am going to Berlin.</td>
            </tr>
          </tbody>
        </TableScroll>
      </section>

      <MCQSection
        title="Practice 3"
        instruction="Choose the correct question word or meaning."
        questions={[
          {
            question: "___ kommst du?",
            options: ["A. Wo", "B. Woher", "C. Wohin"],
          },
          {
            question: "___ gehst du heute?",
            options: ["A. Wohin", "B. Woher", "C. Wo"],
          },
          {
            question: "What does 'Wo bist du?' mean?",
            options: [
              "A. Where are you?",
              "B. Where do you come from?",
              "C. Where are you going?",
            ],
          },
        ]}
      />

      <ImageBreak
        src={imgNachIn}
        alt="Airport travel scene"
        title="nach vs in"
        subtitle="Now we learn when to use nach and when to use in + article."
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>nach vs in</h2>

        <div style={softBox}>
          Easy A1 rule:
          <br />
          <br />
          Use <strong>nach</strong> for cities and countries with <strong>no article</strong>.
          <br />
          Example: <strong>nach Ghana</strong>, <strong>nach Deutschland</strong>,{" "}
          <strong>nach Berlin</strong>
          <br />
          <br />
          Use <strong>in + article</strong> for countries that have an article.
          <br />
          Example: <strong>in die Schweiz</strong>, <strong>in die USA</strong>,{" "}
          <strong>in den Iran</strong>
        </div>

        <div style={noteBox}>
          <strong>Why?</strong>
          <br />
          Some countries do not use an article: <strong>Deutschland</strong>,{" "}
          <strong>Ghana</strong>, <strong>Italien</strong>.
          <br />
          So we say <strong>nach Deutschland</strong>, <strong>nach Ghana</strong>.
          <br />
          <br />
          Some countries use an article: <strong>die Schweiz</strong>,{" "}
          <strong>die Türkei</strong>, <strong>die USA</strong>, <strong>der Iran</strong>.
          <br />
          So we say <strong>in die Schweiz</strong>, <strong>in den Iran</strong>.
        </div>

        <TableScroll caption="Direction: wohin?">
          <thead>
            <tr>
              <th style={thStyle}>No article → nach</th>
              <th style={thStyle}>With article → in + article</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Ich fliege nach Deutschland.</td>
              <td style={tdStyle}>Ich fliege in die Schweiz.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Wir fahren nach Italien.</td>
              <td style={tdStyle}>Wir reisen in die USA.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Sie fährt nach Ghana.</td>
              <td style={tdStyle}>Er fährt in den Iran.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Ich fahre nach Berlin.</td>
              <td style={tdStyle}>Wir fahren in die Türkei.</td>
            </tr>
          </tbody>
        </TableScroll>
      </section>

      <MCQSection
        title="Practice 4"
        instruction="Choose the correct form."
        questions={[
          {
            question: "Ich fliege ___ Deutschland.",
            options: ["A. nach", "B. in die", "C. aus"],
          },
          {
            question: "Wir reisen ___ Schweiz.",
            options: ["A. nach", "B. in die", "C. aus der"],
          },
          {
            question: "Er fährt ___ Iran.",
            options: ["A. in den", "B. nach", "C. aus dem"],
          },
          {
            question: "Sie fährt ___ Accra.",
            options: ["A. in die", "B. nach", "C. aus"],
          },
        ]}
      />

      <ImageBreak
        src={imgIrregular}
        alt="Notebook and grammar study"
        title="Irregular verbs with vowel change"
        subtitle="Some verbs change their vowel in du and er/sie/es."
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Irregular verbs with vowel change</h2>

        <div style={softBox}>
          German vowels are:
          <br />
          <strong>a, e, i, o, u</strong>
          <br />
          <br />
          In some verbs, the vowel changes in the <strong>du</strong> form and
          in the <strong>er / sie / es</strong> form.
          <br />
          <br />
          Example:
          <br />
          <strong>ich fahre</strong> → <strong>du fährst</strong>
          <br />
          <strong>ich spreche</strong> → <strong>du sprichst</strong>
        </div>

        <TableScroll caption="Common vowel changes">
          <thead>
            <tr>
              <th style={thStyle}>Verb</th>
              <th style={thStyle}>ich</th>
              <th style={thStyle}>du</th>
              <th style={thStyle}>er / sie / es</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>fahren</td>
              <td style={tdStyle}>fahre</td>
              <td style={tdStyle}>fährst</td>
              <td style={tdStyle}>fährt</td>
            </tr>
            <tr>
              <td style={tdStyle}>sprechen</td>
              <td style={tdStyle}>spreche</td>
              <td style={tdStyle}>sprichst</td>
              <td style={tdStyle}>spricht</td>
            </tr>
            <tr>
              <td style={tdStyle}>essen</td>
              <td style={tdStyle}>esse</td>
              <td style={tdStyle}>isst</td>
              <td style={tdStyle}>isst</td>
            </tr>
            <tr>
              <td style={tdStyle}>nehmen</td>
              <td style={tdStyle}>nehme</td>
              <td style={tdStyle}>nimmst</td>
              <td style={tdStyle}>nimmt</td>
            </tr>
          </tbody>
        </TableScroll>
      </section>

      <MCQSection
        title="Practice 5"
        instruction="Choose the correct verb form."
        questions={[
          {
            question: "Du ___ nach Berlin. (fahren)",
            options: ["A. fahre", "B. fährst", "C. fährt"],
          },
          {
            question: "Er ___ Deutsch. (sprechen)",
            options: ["A. sprichst", "B. sprechen", "C. spricht"],
          },
          {
            question: "Sie ___ Pizza. (essen)",
            options: ["A. isst", "B. essen", "C. esst"],
          },
          {
            question: "Du ___ den Bus. (nehmen)",
            options: ["A. nimmst", "B. nimmt", "C. nehme"],
          },
        ]}
      />

      <ImageBreak
        src={imgManMann}
        alt="A man standing outdoors"
        title="man vs Mann"
        subtitle="These two words look similar, but they are not the same."
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>man vs Mann</h2>

        <div style={warningBox}>
          <strong>Common mistake:</strong> <em>man</em> is a pronoun, so it is
          written with a small letter.
          <br />
          <em>Mann</em> is a noun, so it is written with a capital letter.
          <br />
          <br />
          Correct: <strong>Man spricht hier Deutsch.</strong>
          <br />
          Not correct: <strong>Mann spricht hier Deutsch.</strong>
        </div>

        <div style={softBox}>
          <strong>Difference:</strong>
          <br />
          <strong>man</strong> = people in general
          <br />
          <strong>Mann</strong> = a man
          <br />
          <br />
          Example:
          <br />
          <strong>Man kann hier gut essen.</strong> = People can eat well here.
          <br />
          <strong>Der Mann ist Lehrer.</strong> = The man is a teacher.
        </div>

        <TableScroll caption="A1 examples with translation">
          <tbody>
            <tr>
              <td style={tdStyle}>Man spricht hier Deutsch.</td>
              <td style={tdStyle}>People speak German here.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Der Mann heißt Simon.</td>
              <td style={tdStyle}>The man’s name is Simon.</td>
            </tr>
          </tbody>
        </TableScroll>

        <TableScroll caption="Conjugation with man (using essen)">
          <tbody>
            <tr>
              <td style={tdStyle}>ich esse</td>
            </tr>
            <tr>
              <td style={tdStyle}>du isst</td>
            </tr>
            <tr>
              <td style={tdStyle}>er / sie / es / man isst</td>
            </tr>
            <tr>
              <td style={tdStyle}>wir essen</td>
            </tr>
            <tr>
              <td style={tdStyle}>ihr esst</td>
            </tr>
            <tr>
              <td style={tdStyle}>sie / Sie essen</td>
            </tr>
          </tbody>
        </TableScroll>
      </section>

      <MCQSection
        title="Practice 6"
        instruction="Choose the correct word."
        questions={[
          {
            question: "___ spricht hier Deutsch.",
            options: ["A. Mann", "B. man", "C. Männer"],
          },
          {
            question: "Der ___ kommt aus Berlin.",
            options: ["A. man", "B. Mann", "C. spricht"],
          },
          {
            question: "In Deutschland spricht ___ Deutsch.",
            options: ["A. man", "B. Mann", "C. Männer"],
          },
        ]}
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Final mixed practice</h2>
        <div style={softBox}>
          Choose the best answer.
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <MCQCard
            number={1}
            question="Wo liegt Berlin?"
            options={[
              "A. Berlin liegt im Osten von Deutschland.",
              "B. Berlin kommt aus Deutschland.",
              "C. Berlin fährt nach Deutschland.",
            ]}
          />
          <MCQCard
            number={2}
            question="___ kommst du?"
            options={["A. Wo", "B. Woher", "C. Wohin"]}
          />
          <MCQCard
            number={3}
            question="Ich fliege ___ Deutschland."
            options={["A. nach", "B. in die", "C. aus"]}
          />
          <MCQCard
            number={4}
            question="Du ___ nach Berlin. (fahren)"
            options={["A. fährst", "B. fahre", "C. fährt"]}
          />
          <MCQCard
            number={5}
            question="___ spricht hier Deutsch."
            options={["A. Mann", "B. man", "C. Männer"]}
          />
        </div>
      </section>
    </main>
  );
};

export default memo(FormingBasicStatementsPage);
