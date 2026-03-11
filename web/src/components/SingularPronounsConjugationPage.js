import React, { memo, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const sectionStyle = { ...styles.card, display: "grid", gap: 12 };

const tableCellStyle = {
  border: "1px solid #d1d5db",
  padding: 8,
  verticalAlign: "top",
  textAlign: "left",
};

const listStyle = {
  margin: 0,
  paddingLeft: 20,
  display: "grid",
  gap: 6,
};

const exampleBoxStyle = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
};

const imageStyle = {
  width: "100%",
  maxHeight: 340,
  objectFit: "cover",
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  marginTop: 8,
};

const captionStyle = {
  margin: 0,
  fontSize: 14,
  color: "#6b7280",
};

const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 10,
  background: "#ffffff",
};

const answerBoxStyle = {
  background: "#fefce8",
  border: "1px solid #fde68a",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
};

const tipBoxStyle = {
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
};

const successBoxStyle = {
  background: "#ecfdf5",
  border: "1px solid #a7f3d0",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
};

const warningBoxStyle = {
  background: "#fff7ed",
  border: "1px solid #fdba74",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
};

const gridTwoStyle = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
};

const pronounCardStyle = {
  borderRadius: 14,
  padding: 14,
  border: "1px solid #e5e7eb",
  display: "grid",
  gap: 8,
  background: "#ffffff",
};

const optionButtonBaseStyle = {
  width: "100%",
  textAlign: "left",
  borderRadius: 10,
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  cursor: "pointer",
  fontSize: 15,
};

const mobileCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
  background: "#ffffff",
};

const conjugationRows = [
  ["ich", "heiße", "komme", "habe", "arbeite", "bin"],
  ["du", "heißt", "kommst", "hast", "arbeitest", "bist"],
  ["er/sie/es", "heißt", "kommt", "hat", "arbeitet", "ist"],
  ["wir", "heißen", "kommen", "haben", "arbeiten", "sind"],
  ["ihr", "heißt", "kommt", "habt", "arbeitet", "seid"],
  ["sie/Sie", "heißen", "kommen", "haben", "arbeiten", "sind"],
];

const pronouns = [
  "ich (I)",
  "du (you, informal singular)",
  "er (he)",
  "sie (she)",
  "es (it)",
  "wir (we)",
  "ihr (you guys / you all, informal plural)",
  "sie (they)",
  "Sie (you, formal)",
];

const practiceQuestionsWoWoher = [
  {
    id: "wo1",
    question: '1. ______ wohnst du?',
    options: ["A) Wo", "B) Woher", "C) Wie"],
    answer: "A) Wo",
  },
  {
    id: "wo2",
    question: '2. ______ kommst du?',
    options: ["A) Wer", "B) Wo", "C) Woher"],
    answer: "C) Woher",
  },
  {
    id: "wo3",
    question: '3. ______ ist der Bahnhof?',
    options: ["A) Wo", "B) Woher", "C) Was"],
    answer: "A) Wo",
  },
  {
    id: "wo4",
    question: '4. ______ kommt er?',
    options: ["A) Wo", "B) Woher", "C) Wie"],
    answer: "B) Woher",
  },
];

const practiceQuestionsPronouns = [
  {
    id: "pro1",
    question: '1. "We" in German is:',
    options: ["A) ihr", "B) wir", "C) sie"],
    answer: "B) wir",
  },
  {
    id: "pro2",
    question: '2. Formal "you" in German is:',
    options: ["A) du", "B) ihr", "C) Sie"],
    answer: "C) Sie",
  },
  {
    id: "pro3",
    question: '3. "They" in German is:',
    options: ["A) sie", "B) wir", "C) er"],
    answer: "A) sie",
  },
  {
    id: "pro4",
    question: '4. "You guys / you all" in German is:',
    options: ["A) ihr", "B) du", "C) es"],
    answer: "A) ihr",
  },
];

const practiceQuestionsConjugation = [
  {
    id: "con1",
    question: '1. Ich ______ aus Ghana.',
    options: ["A) kommst", "B) komme", "C) kommt"],
    answer: "B) komme",
  },
  {
    id: "con2",
    question: '2. Du ______ Kofi.',
    options: ["A) heißt", "B) heiße", "C) heißt"],
    answer: "A) heißt",
  },
  {
    id: "con3",
    question: '3. Wir ______ Schüler.',
    options: ["A) bin", "B) seid", "C) sind"],
    answer: "C) sind",
  },
  {
    id: "con4",
    question: '4. Er ______ ein Buch.',
    options: ["A) habe", "B) hat", "C) hast"],
    answer: "B) hat",
  },
  {
    id: "con5",
    question: '5. Ihr ______ heute.',
    options: ["A) arbeitet", "B) arbeite", "C) arbeitest"],
    answer: "A) arbeitet",
  },
  {
    id: "con6",
    question: '6. Sie (formal) ______ aus Accra.',
    options: ["A) kommen", "B) kommst", "C) kommt"],
    answer: "A) kommen",
  },
];

const confusingPronounPractice = [
  {
    id: "mix1",
    question: "1. _____ kommt aus Deutschland. (one woman)",
    options: ["A) sie", "B) Sie", "C) ihr"],
    answer: "A) sie",
  },
  {
    id: "mix2",
    question: "2. _____ kommen aus Deutschland. (formal you)",
    options: ["A) sie", "B) Sie", "C) er"],
    answer: "B) Sie",
  },
  {
    id: "mix3",
    question: "3. _____ seid müde. (you guys)",
    options: ["A) ihr", "B) sie", "C) Sie"],
    answer: "A) ihr",
  },
  {
    id: "mix4",
    question: "4. _____ haben ein Auto. (they)",
    options: ["A) sie", "B) du", "C) es"],
    answer: "A) sie",
  },
  {
    id: "mix5",
    question: "5. _____ ist freundlich. (one woman)",
    options: ["A) sie", "B) Sie", "C) wir"],
    answer: "A) sie",
  },
  {
    id: "mix6",
    question: "6. _____ sind mein Lehrer. (formal you)",
    options: ["A) sie", "B) Sie", "C) ihr"],
    answer: "B) Sie",
  },
];

function getOptionStyle({ isSelected, isCorrect, isWrong }) {
  if (isCorrect) {
    return {
      ...optionButtonBaseStyle,
      background: "#ecfdf5",
      border: "1px solid #10b981",
    };
  }

  if (isWrong) {
    return {
      ...optionButtonBaseStyle,
      background: "#fef2f2",
      border: "1px solid #ef4444",
    };
  }

  if (isSelected) {
    return {
      ...optionButtonBaseStyle,
      background: "#eff6ff",
      border: "1px solid #3b82f6",
    };
  }

  return optionButtonBaseStyle;
}

const PracticeBlock = ({ title, subtitle, questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const score = useMemo(() => {
    let total = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answer) total += 1;
    });
    return total;
  }, [questions, selectedAnswers]);

  const allAnswered = questions.every((q) => selectedAnswers[q.id]);

  return (
    <section style={sectionStyle}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      {subtitle ? <p style={{ margin: 0 }}>{subtitle}</p> : null}

      <div style={{ display: "grid", gap: 12 }}>
        {questions.map((item) => {
          const selected = selectedAnswers[item.id];

          return (
            <div key={item.id} style={questionCardStyle}>
              <p style={{ margin: 0, fontWeight: 700 }}>{item.question}</p>

              <div style={{ display: "grid", gap: 8 }}>
                {item.options.map((option) => {
                  const isSelected = selected === option;
                  const isCorrect = selected && option === item.answer;
                  const isWrong = isSelected && selected !== item.answer;

                  return (
                    <button
                      key={option}
                      type="button"
                      style={getOptionStyle({ isSelected, isCorrect, isWrong })}
                      onClick={() =>
                        setSelectedAnswers((prev) => ({
                          ...prev,
                          [item.id]: option,
                        }))
                      }
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {selected ? (
                <div
                  style={
                    selected === item.answer
                      ? successBoxStyle
                      : warningBoxStyle
                  }
                >
                  {selected === item.answer ? (
                    <p style={{ margin: 0 }}>
                      ✅ Correct. Good job.
                    </p>
                  ) : (
                    <>
                      <p style={{ margin: 0 }}>
                        ❌ Not quite.
                      </p>
                      <p style={{ margin: 0 }}>
                        Correct answer: <strong>{item.answer}</strong>
                      </p>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div style={tipBoxStyle}>
        <strong>Your progress</strong>
        <p style={{ margin: 0 }}>
          Score: <strong>{score}</strong> / {questions.length}
        </p>
        <p style={{ margin: 0 }}>
          {allAnswered
            ? "Well done. You can review any question by tapping another answer."
            : "Select one answer for each question to check yourself."}
        </p>
      </div>
    </section>
  );
};

const SingularPronounsConjugationPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          Day 3: Reviewing Pronouns and Verb Conjugation + Introducing Yourself
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>
          Chapter: 1.1 &amp; Kapitel 1.2
        </p>

        <img
          src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80"
          alt="Students learning in a classroom"
          style={imageStyle}
        />

        <p style={captionStyle}>German learning and classroom study</p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Lesson Goal</h2>
        <p style={{ margin: 0 }}>
          In this lesson, students review personal pronouns, practise present
          tense verb forms, and learn the difference between{" "}
          <strong>wo</strong> and <strong>woher</strong>.
        </p>
        <ul style={listStyle}>
          <li>
            Ask where somebody is: <strong>Wo?</strong>
          </li>
          <li>
            Ask where somebody comes from: <strong>Woher?</strong>
          </li>
          <li>Use pronouns correctly in simple German sentences</li>
          <li>Conjugate common verbs in the present tense</li>
          <li>Introduce yourself with short simple sentences</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>
          Grammar Note: Difference Between &quot;wo&quot; and &quot;woher&quot;
        </h2>

        <div style={gridTwoStyle}>
          <div style={exampleBoxStyle}>
            <p style={{ margin: 0 }}>
              <strong>Wo</strong> means <strong>where</strong> and asks about
              location. 📍
            </p>
            <ul style={listStyle}>
              <li>Wo bist du? (Where are you?)</li>
              <li>Wo ist das Buch? (Where is the book?)</li>
              <li>Wo wohnst du? (Where do you live?)</li>
              <li>Wo ist der Bahnhof? (Where is the train station?)</li>
            </ul>
          </div>

          <div style={exampleBoxStyle}>
            <p style={{ margin: 0 }}>
              <strong>Woher</strong> means <strong>from where</strong> and asks
              about origin. 🌍
            </p>
            <ul style={listStyle}>
              <li>Woher kommst du? (Where do you come from?)</li>
              <li>Woher kommt das? (Where does that come from?)</li>
              <li>Woher bist du? (Where are you from?)</li>
              <li>Woher kommt er? (Where does he come from?)</li>
            </ul>
          </div>
        </div>

        <div style={exampleBoxStyle}>
          <strong>Simple idea 💡</strong>
          <p style={{ margin: 0 }}>
            Use <strong>wo</strong> for a place now. Use <strong>woher</strong>{" "}
            for origin or source.
          </p>
        </div>
      </section>

      <PracticeBlock
        title='Quick Practice: "wo" or "woher"?'
        subtitle="Choose the correct question word. This is a short self-check."
        questions={practiceQuestionsWoWoher}
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Notes About Pronouns in German</h2>
        <p style={{ margin: 0 }}>
          In German, pronouns replace nouns in a sentence. In the nominative
          case, the basic personal pronouns are:
        </p>

        <div style={exampleBoxStyle}>
          <ul style={listStyle}>
            {pronouns.map((pronoun) => (
              <li key={pronoun}>{pronoun}</li>
            ))}
          </ul>
        </div>

        <p style={{ margin: 0 }}>
          Important: German has different ways to say <strong>you</strong>.
        </p>

        <div style={gridTwoStyle}>
          <div style={pronounCardStyle}>
            <strong>du</strong>
            <p style={{ margin: 0 }}>you (one person, informal) 🙂</p>
            <p style={{ margin: 0 }}>
              Example: <strong>Du bist müde.</strong>
            </p>
          </div>

          <div style={pronounCardStyle}>
            <strong>ihr</strong>
            <p style={{ margin: 0 }}>
              you guys / you all (more than one person, informal) 👥
            </p>
            <p style={{ margin: 0 }}>
              Example: <strong>Ihr seid müde.</strong>
            </p>
          </div>

          <div style={pronounCardStyle}>
            <strong>Sie</strong>
            <p style={{ margin: 0 }}>you (formal, polite) 👔</p>
            <p style={{ margin: 0 }}>
              Example: <strong>Sie sind müde.</strong>
            </p>
          </div>
        </div>
      </section>

      <section style={{ ...styles.card, display: "grid", gap: 8 }}>
        <h2 style={{ margin: 0 }}>Pronouns Can Change Meaning</h2>

        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
          alt="Students discussing together"
          style={imageStyle}
        />

        <p style={captionStyle}>
          Look at the pronoun and the verb together.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Important Note: sie, Sie and ihr</h2>

        <div style={exampleBoxStyle}>
          <p style={{ margin: 0 }}>
            These words can look similar, but the <strong>verb</strong> helps
            you understand the meaning.
          </p>
        </div>

        <div style={gridTwoStyle}>
          <div style={exampleBoxStyle}>
            <p style={{ margin: 0 }}>
              <strong>sie = she</strong> 👩
            </p>
            <p style={{ margin: 0 }}>
              Use <strong>sie</strong> for <strong>one woman or one girl</strong>.
            </p>
            <p style={{ margin: 0 }}>
              The verb is usually singular like <strong>er / sie / es</strong>.
            </p>
            <ul style={listStyle}>
              <li>
                sie <strong>kommt</strong> aus Ghana. = She comes from Ghana.
              </li>
              <li>
                sie <strong>ist</strong> müde. = She is tired.
              </li>
              <li>
                sie <strong>arbeitet</strong> hier. = She works here.
              </li>
            </ul>
            <p style={{ margin: 0 }}>
              ✅ Clue: if it means one female person, the verb is singular:
              <strong> kommt, ist, hat, arbeitet</strong>
            </p>
          </div>

          <div style={exampleBoxStyle}>
            <p style={{ margin: 0 }}>
              <strong>Sie = you (formal)</strong> 👔
            </p>
            <p style={{ margin: 0 }}>
              Use <strong>Sie</strong> when speaking politely to an adult,
              teacher, stranger, or in formal situations.
            </p>
            <p style={{ margin: 0 }}>
              It is always written with a <strong>capital S</strong>.
            </p>
            <ul style={listStyle}>
              <li>
                Sie <strong>kommen</strong> aus Accra. = You come from Accra.
              </li>
              <li>
                Sie <strong>sind</strong> Herr Müller. = You are Mr. Müller.
              </li>
              <li>
                Sie <strong>haben</strong> ein Auto. = You have a car.
              </li>
            </ul>
            <p style={{ margin: 0 }}>
              ✅ Clue: <strong>Sie</strong> uses plural-style verb forms:
              <strong> kommen, sind, haben, arbeiten</strong>
            </p>
          </div>

          <div style={exampleBoxStyle}>
            <p style={{ margin: 0 }}>
              <strong>sie = they</strong> 👨‍👩‍👧‍👦
            </p>
            <p style={{ margin: 0 }}>
              Use <strong>sie</strong> for <strong>many people</strong>.
            </p>
            <ul style={listStyle}>
              <li>
                sie <strong>kommen</strong> aus Deutschland. = They come from
                Germany.
              </li>
              <li>
                sie <strong>sind</strong> Schüler. = They are students.
              </li>
              <li>
                sie <strong>haben</strong> Zeit. = They have time.
              </li>
            </ul>
            <p style={{ margin: 0 }}>
              ✅ Clue: <strong>sie = they</strong> has the same verb form as{" "}
              <strong>Sie</strong>:
              <strong> kommen, sind, haben, arbeiten</strong>
            </p>
          </div>

          <div style={exampleBoxStyle}>
            <p style={{ margin: 0 }}>
              <strong>ihr = you guys / you all</strong> 👥
            </p>
            <p style={{ margin: 0 }}>
              In simple English, <strong>ihr</strong> means{" "}
              <strong>you guys</strong> or <strong>you all</strong>.
            </p>
            <p style={{ margin: 0 }}>
              Use it when talking to <strong>more than one person</strong>{" "}
              informally.
            </p>
            <ul style={listStyle}>
              <li>
                ihr <strong>kommt</strong> heute. = You guys are coming today.
              </li>
              <li>
                ihr <strong>seid</strong> müde. = You guys are tired.
              </li>
              <li>
                ihr <strong>habt</strong> ein Buch. = You guys have a book.
              </li>
            </ul>
            <p style={{ margin: 0 }}>
              ✅ Clue: <strong>ihr</strong> often uses forms like:
              <strong> kommt, seid, habt, arbeitet</strong>
            </p>
          </div>
        </div>

        <div style={tipBoxStyle}>
          <strong>Teacher Tip 👩‍🏫</strong>
          <p style={{ margin: 0 }}>
            When you see <strong>sie</strong> or <strong>Sie</strong>, do not
            guess quickly. First check the <strong>verb</strong>.
          </p>
          <ul style={listStyle}>
            <li>
              <strong>sie kommt</strong> → probably <strong>she</strong> 👩
            </li>
            <li>
              <strong>sie kommen</strong> → probably <strong>they</strong> 👨‍👩‍👧‍👦
            </li>
            <li>
              <strong>Sie kommen</strong> → <strong>you (formal)</strong> 👔
            </li>
            <li>
              <strong>ihr kommt</strong> → <strong>you guys</strong> 👥
            </li>
          </ul>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Quick Summary Table</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 620 }}>
            <thead>
              <tr>
                <th style={tableCellStyle}>Word</th>
                <th style={tableCellStyle}>Meaning</th>
                <th style={tableCellStyle}>Emoji</th>
                <th style={tableCellStyle}>Verb clue</th>
                <th style={tableCellStyle}>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tableCellStyle}>sie</td>
                <td style={tableCellStyle}>she</td>
                <td style={tableCellStyle}>👩</td>
                <td style={tableCellStyle}>kommt / ist / hat</td>
                <td style={tableCellStyle}>sie kommt aus Kumasi.</td>
              </tr>
              <tr>
                <td style={tableCellStyle}>Sie</td>
                <td style={tableCellStyle}>you (formal)</td>
                <td style={tableCellStyle}>👔</td>
                <td style={tableCellStyle}>kommen / sind / haben</td>
                <td style={tableCellStyle}>Sie kommen aus Accra.</td>
              </tr>
              <tr>
                <td style={tableCellStyle}>sie</td>
                <td style={tableCellStyle}>they</td>
                <td style={tableCellStyle}>👨‍👩‍👧‍👦</td>
                <td style={tableCellStyle}>kommen / sind / haben</td>
                <td style={tableCellStyle}>sie kommen aus Berlin.</td>
              </tr>
              <tr>
                <td style={tableCellStyle}>ihr</td>
                <td style={tableCellStyle}>you guys / you all</td>
                <td style={tableCellStyle}>👥</td>
                <td style={tableCellStyle}>kommt / seid / habt</td>
                <td style={tableCellStyle}>ihr seid hier.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <PracticeBlock
        title="Quick Practice: sie, Sie or ihr?"
        subtitle="Read the verb carefully. The verb helps you know the meaning."
        questions={confusingPronounPractice}
      />

      <PracticeBlock
        title="Quick Practice: Pronouns"
        subtitle='Read carefully because "sie" and "Sie" are different.'
        questions={practiceQuestionsPronouns}
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>
          Grammar Note: &quot;heißen,&quot; &quot;kommen,&quot; &quot;haben,&quot;
          &quot;arbeiten&quot; and &quot;sein&quot;
        </h2>

        <p style={{ margin: 0 }}>
          Verbs change depending on the subject pronoun. This is called{" "}
          <strong>conjugation</strong>.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 760 }}>
            <thead>
              <tr>
                <th style={tableCellStyle}>Pronoun</th>
                <th style={tableCellStyle}>heißen</th>
                <th style={tableCellStyle}>kommen</th>
                <th style={tableCellStyle}>haben</th>
                <th style={tableCellStyle}>arbeiten</th>
                <th style={tableCellStyle}>sein</th>
              </tr>
            </thead>
            <tbody>
              {conjugationRows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={`${row[0]}-${cell}`} style={tableCellStyle}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={tipBoxStyle}>
          <strong>Mobile-friendly review</strong>
          <p style={{ margin: 0 }}>
            On a phone, students can also read the conjugation forms as cards.
          </p>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {conjugationRows.map((row) => (
            <div key={`mobile-${row[0]}`} style={mobileCardStyle}>
              <strong>{row[0]}</strong>
              <p style={{ margin: 0 }}>
                heißen: <strong>{row[1]}</strong>
              </p>
              <p style={{ margin: 0 }}>
                kommen: <strong>{row[2]}</strong>
              </p>
              <p style={{ margin: 0 }}>
                haben: <strong>{row[3]}</strong>
              </p>
              <p style={{ margin: 0 }}>
                arbeiten: <strong>{row[4]}</strong>
              </p>
              <p style={{ margin: 0 }}>
                sein: <strong>{row[5]}</strong>
              </p>
            </div>
          ))}
        </div>

        <div style={exampleBoxStyle}>
          <strong>Examples</strong>
          <ul style={listStyle}>
            <li>Ich heiße Felix. (My name is Felix.)</li>
            <li>Ich komme aus Deutschland. (I come from Germany.)</li>
            <li>Ich habe ein Buch. (I have a book.)</li>
            <li>Ich arbeite als Lehrer. (I work as a teacher.)</li>
            <li>Ich bin glücklich. (I am happy.)</li>
          </ul>
        </div>

        <ul style={listStyle}>
          <li>Regular verbs usually follow a pattern in the present tense.</li>
          <li>
            <strong>sein</strong> is irregular and must be memorized.
          </li>
          <li>The verb form changes with the subject pronoun.</li>
        </ul>
      </section>

      <PracticeBlock
        title="Quick Practice: Verb Conjugation"
        subtitle="Choose the correct verb form for each sentence."
        questions={practiceQuestionsConjugation}
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Mini Speaking / Writing Practice</h2>
        <p style={{ margin: 0 }}>
          Write or say 4 short sentences about yourself.
        </p>

        <div style={exampleBoxStyle}>
          <ul style={listStyle}>
            <li>Ich heiße __________.</li>
            <li>Ich komme aus __________.</li>
            <li>Ich wohne in __________.</li>
            <li>Ich bin __________.</li>
          </ul>
        </div>

        <p style={{ margin: 0 }}>
          Example:
          <br />
          <strong>
            Ich heiße Kojo. Ich komme aus Ghana. Ich wohne in Accra. Ich bin
            Student.
          </strong>
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Answer Key Summary</h2>

        <div style={answerBoxStyle}>
          <strong>wo / woher</strong>
          <ul style={listStyle}>
            <li>1. A) Wo</li>
            <li>2. C) Woher</li>
            <li>3. A) Wo</li>
            <li>4. B) Woher</li>
          </ul>
        </div>

        <div style={answerBoxStyle}>
          <strong>sie / Sie / ihr</strong>
          <ul style={listStyle}>
            <li>1. A) sie</li>
            <li>2. B) Sie</li>
            <li>3. A) ihr</li>
            <li>4. A) sie</li>
            <li>5. A) sie</li>
            <li>6. B) Sie</li>
          </ul>
        </div>

        <div style={answerBoxStyle}>
          <strong>Pronouns</strong>
          <ul style={listStyle}>
            <li>1. B) wir</li>
            <li>2. C) Sie</li>
            <li>3. A) sie</li>
            <li>4. A) ihr</li>
          </ul>
        </div>

        <div style={answerBoxStyle}>
          <strong>Verb Conjugation</strong>
          <ul style={listStyle}>
            <li>1. B) komme</li>
            <li>2. A) heißt</li>
            <li>3. C) sind</li>
            <li>4. B) hat</li>
            <li>5. A) arbeitet</li>
            <li>6. A) kommen</li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default memo(SingularPronounsConjugationPage);
