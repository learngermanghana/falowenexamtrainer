import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

const pageWrap = {
  ...styles.container,
  display: "grid",
  gap: 18,
  paddingBottom: 32,
};

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 14,
  padding: 16,
};

const boxBase = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 14,
  display: "grid",
  gap: 10,
  background: "#fff",
};

const infoBoxStyle = {
  ...boxBase,
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
};

const warningBoxStyle = {
  ...boxBase,
  border: "1px solid #fde68a",
  background: "#fffbeb",
};

const successBoxStyle = {
  ...boxBase,
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
};

const inputStyle = {
  width: "100%",
  minHeight: 48,
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  fontSize: 16,
  lineHeight: 1.4,
  boxSizing: "border-box",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: 140,
  resize: "vertical",
  fontFamily: "inherit",
};

const chipWrapStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const chipStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid #d1d5db",
  background: "#f9fafb",
  fontSize: 14,
  lineHeight: 1.3,
};

const primaryActionStyle = {
  ...styles.secondaryButton,
  width: "100%",
  minHeight: 48,
  borderRadius: 12,
  fontSize: 15,
};

const heroImage =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80";

const articleWords = [
  { noun: "Tisch", article: "der", english: "table", gender: "masculine" },
  { noun: "Auto", article: "das", english: "car", gender: "neuter" },
  { noun: "Lampe", article: "die", english: "lamp", gender: "feminine" },
  { noun: "Apfel", article: "der", english: "apple", gender: "masculine" },
  { noun: "Buch", article: "das", english: "book", gender: "neuter" },
  { noun: "Katze", article: "die", english: "cat", gender: "feminine" },
  { noun: "Stuhl", article: "der", english: "chair", gender: "masculine" },
  { noun: "Haus", article: "das", english: "house", gender: "neuter" },
  { noun: "Blume", article: "die", english: "flower", gender: "feminine" },
  { noun: "Hund", article: "der", english: "dog", gender: "masculine" },
];

const sentenceReorderPhrases = [
  "heisse, ich, Anna (Statement)",
  "kommen, woher, Sie (Question)",
  "bin, ich, Jahre alt, 25 (Statement)",
  "aus, komme, ich, Deutschland (Statement)",
  "ist, mein, Telefonnummer, 123456789 (Statement)",
  "Entschuldigung, heißen, Sie, wie (Question)",
  "wie, dir, es, geht (Question)",
  "wie, Ihnen, es, geht (Question)",
  "mir, gut, es, geht (Statement)",
  "geht, mir, gut, es (Statement)",
  "du, wohnst, wo (Question)",
];

const adjectivePairs = [
  ["groß", "klein", "big / tall", "small / short"],
  ["alt", "neu", "old", "new"],
  ["lang", "kurz", "long", "short"],
  ["schön", "hässlich", "beautiful", "ugly"],
  ["heiß", "kalt", "hot", "cold"],
  ["schnell", "langsam", "fast", "slow"],
  ["laut", "leise", "loud", "quiet"],
  ["teuer", "billig", "expensive", "cheap"],
  ["glücklich", "traurig", "happy", "sad"],
  ["sauber", "schmutzig", "clean", "dirty"],
];

const wWordQuestions = [
  {
    stem: "1. ___ heißt du?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Wie",
    explanation: "Use „Wie“ to ask about a name.",
    englishHint: "How are you called? / What is your name?",
  },
  {
    stem: "2. ___ ist das Buch?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Wo",
    explanation: "Use „Wo“ to ask about a place.",
    englishHint: "Where is the book?",
  },
  {
    stem: "3. ___ wohnt er?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Wo",
    explanation: "Use „Wo“ for location.",
    englishHint: "Where does he live?",
  },
  {
    stem: "4. ___ kommst du?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Woher",
    explanation: "Use „Woher“ for origin.",
    englishHint: "Where do you come from?",
  },
  {
    stem: "5. ___ ist dein Lehrer?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Wer",
    explanation: "Use „Wer“ for a person.",
    englishHint: "Who is your teacher?",
  },
  {
    stem: "6. ___ geht es dir?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Wie",
    explanation: "Use „Wie“ for condition.",
    englishHint: "How are you?",
  },
  {
    stem: "7. ___ machst du am Wochenende?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Was",
    explanation: "Use „Was“ for an action or thing.",
    englishHint: "What do you do at the weekend?",
  },
  {
    stem: "8. ___ ist das Auto?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Wo",
    explanation: "Use „Wo“ for location.",
    englishHint: "Where is the car?",
  },
  {
    stem: "9. ___ bist du?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Wer",
    explanation: "Use „Wer“ to ask who a person is.",
    englishHint: "Who are you?",
  },
  {
    stem: "10. ___ kommt sie?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Woher",
    explanation: "Use „Woher“ for origin.",
    englishHint: "Where does she come from?",
  },
];

const personalInfoPrompts = [
  { label: "Familienname", english: "family name / surname", starter: "Mein Familienname ist ...", starterEnglish: "My family name is ..." },
  { label: "Vorname", english: "first name", starter: "Mein Vorname ist ...", starterEnglish: "My first name is ..." },
  { label: "Herkunft", english: "origin", starter: "Ich komme aus ...", starterEnglish: "I come from ..." },
  { label: "Geburtsort", english: "place of birth", starter: "Ich bin in ... geboren.", starterEnglish: "I was born in ..." },
  { label: "Adresse", english: "address", starter: "Meine Adresse ist ...", starterEnglish: "My address is ..." },
  { label: "Postleitzahl", english: "postal code / ZIP code", starter: "Meine Postleitzahl ist ...", starterEnglish: "My postal code is ..." },
  { label: "Familienstand", english: "marital status", starter: "Ich bin ledig / verheiratet / geschieden / verwitwet.", starterEnglish: "I am single / married / divorced / widowed." },
  { label: "Kinder", english: "children", starter: "Ich habe ... Kinder. / Ich habe keine Kinder.", starterEnglish: "I have ... children. / I do not have any children." },
  { label: "Alter", english: "age", starter: "Ich bin ... Jahre alt.", starterEnglish: "I am ... years old." },
];

const SectionCard = ({ title, subtitle, children }) => (
  <section style={cardStyle}>
    <div style={{ display: "grid", gap: 6 }}>
      <h2 style={{ margin: 0, fontSize: 22 }}>{title}</h2>
      {subtitle ? (
        <p style={{ margin: 0, lineHeight: 1.7, color: "#4b5563" }}>{subtitle}</p>
      ) : null}
    </div>
    {children}
  </section>
);

const RevealAnswer = ({ children, buttonLabel = "Show answer" }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <button
        type="button"
        style={primaryActionStyle}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "Hide answer" : buttonLabel}
      </button>
      {open ? <div style={successBoxStyle}>{children}</div> : null}
    </div>
  );
};

const MobileSectionLabel = ({ children }) => (
  <div
    style={{
      fontSize: 13,
      fontWeight: 700,
      color: "#1d4ed8",
      letterSpacing: 0.2,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

const A1Day5IntroducingYourselfArticlesWorkbookPage = () => {

  const [articlePractice, setArticlePractice] = useState("");

  const [wWordSelections, setWWordSelections] = useState(() =>
    wWordQuestions.reduce((acc, _, index) => {
      acc[index] = "";
      return acc;
    }, {})
  );

  const [adjectivePractice, setAdjectivePractice] = useState("");

  const [dialoguePractice, setDialoguePractice] = useState("");
  const [sentenceReorderAnswer, setSentenceReorderAnswer] = useState("");

  const [aboutMe, setAboutMe] = useState("");

  const articleScore = useMemo(() => {
    return articleWords.filter((item) => articlePractice.toLowerCase().includes(`${item.article} ${item.noun}`.toLowerCase())).length;
  }, [articlePractice]);

  const wWordScore = useMemo(() => {
    return wWordQuestions.filter(
      (question, index) => wWordSelections[index] === question.answer
    ).length;
  }, [wWordSelections]);

  const completedSections = useMemo(() => {
    let count = 0;
    if (articlePractice.trim()) count += 1;
    if (adjectivePractice.trim()) count += 1;
    if (dialoguePractice.trim()) count += 1;
    if (Object.values(wWordSelections).some(Boolean)) count += 1;
    if (aboutMe.trim()) count += 1;
    if (sentenceReorderAnswer.trim()) count += 1;
    return count;
  }, [articlePractice, adjectivePractice, dialoguePractice, wWordSelections, aboutMe, sentenceReorderAnswer]);

  const handleWWordChange = (index, value) => {
    setWWordSelections((prev) => ({ ...prev, [index]: value }));
  };

  return (
    <div style={pageWrap}>
      <div style={{ ...cardStyle, overflow: "hidden", padding: 0 }}>
        <img
          src={heroImage}
          alt="Students learning German together"
          style={{
            width: "100%",
            height: "clamp(180px, 30vw, 240px)",
            objectFit: "cover",
            display: "block",
          }}
        />

        <div style={{ padding: 16, display: "grid", gap: 12 }}>
          <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

          <MobileSectionLabel>A1 · Day 5</MobileSectionLabel>

          <h1 style={{ ...styles.title, margin: 0, lineHeight: 1.25 }}>
            Introducing Yourself and Articles
          </h1>

          <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.6 }}>
            Chapter 1.2 · Interactive workbook
          </p>

          <div style={infoBoxStyle}>
            <strong>Progress</strong>
            <div style={{ lineHeight: 1.7 }}>
              <div>Completed sections: {completedSections}/6</div>
              <div>Articles: {articleScore}/{articleWords.length}</div>
              <div>W-words: {wWordScore}/{wWordQuestions.length}</div>
            </div>
          </div>
        </div>
      </div>

      <SectionCard
        title="Teil 1 · Articles"
        subtitle="Learn each noun together with der, die, or das."
      >
        <div style={infoBoxStyle}>
          <strong>Quick guide</strong>
          <div style={{ lineHeight: 1.8 }}>
            <div><strong>der</strong> = masculine</div>
            <div><strong>die</strong> = feminine</div>
            <div><strong>das</strong> = neuter</div>
          </div>
        </div>

        <div style={warningBoxStyle}>
          <strong>Tip</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Do not learn only the noun. Learn the full pair:
            <strong> der Tisch</strong>, <strong>die Lampe</strong>, <strong>das Haus</strong>.
          </p>
        </div>

        <div style={boxBase}>
          <strong>Vocabulary bank</strong>
          <div style={chipWrapStyle}>
            {articleWords.map((item) => (
              <span key={item.noun} style={chipStyle}>
                {item.noun} ({item.english})
              </span>
            ))}
          </div>
        </div>

        <div style={boxBase}>
          <strong>Write the correct article</strong>
          <p style={{ margin: 0, lineHeight: 1.7, color: "#4b5563" }}>Type der, die, or das. Then add if each noun is masculine, feminine, or neuter.</p>

          <textarea value={articlePractice} onChange={(e) => setArticlePractice(e.target.value)} placeholder="Example:\nder Tisch - masculine\ndas Auto - neuter\ndie Lampe - feminine" style={textareaStyle} />

          <RevealAnswer buttonLabel="Show article answers">
            <div style={{ display: "grid", gap: 8, lineHeight: 1.7 }}>
              {articleWords.map((item) => (
                <div key={item.noun}>
                  <strong>{item.article}</strong> {item.noun} - {item.gender}
                </div>
              ))}
            </div>
          </RevealAnswer>
        </div>
      </SectionCard>

      <SectionCard
        title="Teil 2 · Adjectives"
        subtitle="Use simple adjectives to describe people and things."
      >
        <div style={boxBase}>
          <strong>Adjective pairs</strong>
          <div style={{ display: "grid", gap: 8 }}>
            {adjectivePairs.map(([left, right, leftEnglish, rightEnglish]) => (
              <div key={`${left}-${right}`} style={{ padding: "6px 0" }}>
                <strong>{left}</strong> ({leftEnglish}) – <strong>{right}</strong> ({rightEnglish})
              </div>
            ))}
          </div>
        </div>

        <div style={boxBase}>
          <strong>Examples</strong>
          <div style={{ lineHeight: 1.8 }}>
            <div>Der Baum ist groß.</div>
            <div>Das Haus ist klein.</div>
            <div>Die Blume ist schön.</div>
          </div>
        </div>

        <div style={boxBase}>
          <strong>Write your own sentences</strong>

          <textarea value={adjectivePractice} onChange={(e) => setAdjectivePractice(e.target.value)} placeholder="Write 3-5 adjective sentences here..." style={textareaStyle} />
        </div>
      </SectionCard>

      <SectionCard
        title="Teil 3 · Personal Information"
        subtitle="Complete the German sentence starters with your own details."
      >
        <div style={{ display: "grid", gap: 12 }}>
          {personalInfoPrompts.map((item, index) => (
            <div
              key={item.label}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 14,
                display: "grid",
                gap: 6,
                background: "#fff",
              }}
            >
              <strong>{index + 1}. {item.label} <span style={{ color: "#6b7280", fontWeight: 500 }}>({item.english})</span></strong>
              <span style={{ lineHeight: 1.7 }}>{item.starter}</span>
              <span style={{ lineHeight: 1.7, color: "#4b5563" }}>{item.starterEnglish}</span>
            </div>
          ))}
        </div>

        <div style={warningBoxStyle}>
          <strong>Common mistakes</strong>
          <div style={{ lineHeight: 1.8 }}>
            <div>✅ Ich bin 25 Jahre alt.</div>
            <div>❌ Ich habe 25 Jahre.</div>
            <div>✅ Ich komme aus Ghana.</div>
            <div>❌ Ich komme von Ghana.</div>
            <div>✅ Ich habe keine Kinder.</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Teil 4 · Mini Dialogue"
        subtitle="Complete the short conversation."
      >
        <div style={infoBoxStyle}>
          <strong>Quick note: W-questions</strong>
          <div style={{ lineHeight: 1.8 }}>
            <div>Use W-words to ask for more information.</div>
            <div><strong>Rule:</strong> W-word + verb + subject</div>
            <div><strong>Wie</strong> = how</div>
            <div><strong>Woher</strong> = from where</div>
            <div><strong>Wo</strong> = where</div>
          </div>
        </div>

        <textarea value={dialoguePractice} onChange={(e) => setDialoguePractice(e.target.value)} placeholder="Write the full mini dialogue here..." style={textareaStyle} />

        <div style={warningBoxStyle}>
          <strong>A1 statement rule</strong>
          <div style={{ lineHeight: 1.8 }}>
            <div>Subject first.</div>
            <div>Verb in position 2.</div>
            <div>Time then place.</div>
            <div>Capital letter first.</div>
          </div>
        </div>

        <RevealAnswer buttonLabel="Show model dialogue">
          <div style={{ lineHeight: 1.9 }}>
            <div><strong>A:</strong> Wie heißt du?</div>
            <div><strong>B:</strong> Ich heiße Ama.</div>
            <div><strong>A:</strong> Woher kommst du?</div>
            <div><strong>B:</strong> Ich komme aus Ghana.</div>
            <div><strong>A:</strong> Wo wohnst du?</div>
            <div><strong>B:</strong> Ich wohne in Accra.</div>
            <div><strong>A:</strong> Wie alt bist du?</div>
            <div><strong>B:</strong> Ich bin 24 Jahre alt.</div>
          </div>
        </RevealAnswer>
      </SectionCard>

      <SectionCard title="Teil 6 · Scrambled Sentences" subtitle="Rearrange the words to form correct German sentences and mark each as statement or question.">
        <div style={infoBoxStyle}>
          <strong>Instructions</strong>
          <div style={{ lineHeight: 1.8 }}>
            <div>1. Statements: Subject + Verb + Other elements (Ich heiße Anna.)</div>
            <div>2. W-questions: W-word + Verb + Pronoun (Woher kommen Sie?)</div>
          </div>
        </div>
        <div style={boxBase}>
          <strong>Rearrange these phrases</strong>
          <div style={{ lineHeight: 1.8 }}>
            {sentenceReorderPhrases.map((phrase, index) => <div key={phrase}>{index + 1}. {phrase}</div>)}
          </div>
        </div>
        <textarea value={sentenceReorderAnswer} onChange={(e) => setSentenceReorderAnswer(e.target.value)} placeholder="Write all corrected sentences here..." style={textareaStyle} />
        <RevealAnswer buttonLabel="Show scrambled sentence answers">
          <div style={{ lineHeight: 1.8 }}>
            <div>1. Ich heiße Anna. (Statement)</div>
            <div>2. Woher kommen Sie? (Question)</div>
            <div>3. Ich bin 25 Jahre alt. (Statement)</div>
            <div>4. Ich komme aus Deutschland. (Statement)</div>
            <div>5. Meine Telefonnummer ist 123456789. (Statement)</div>
            <div>6. Entschuldigung, wie heißen Sie? (Question)</div>
            <div>7. Wie geht es dir? (Question)</div>
            <div>8. Wie geht es Ihnen? (Question)</div>
            <div>9. Es geht mir gut. (Statement)</div>
            <div>10. Mir geht es gut. (Statement)</div>
            <div>11. Wo wohnst du? (Question)</div>
          </div>
        </RevealAnswer>
      </SectionCard>

      <SectionCard
        title="Teil 5 · W-Words"
        subtitle="Choose the correct question word."
      >
        <div style={infoBoxStyle}>
          <strong>W-Words</strong>
          <div style={{ lineHeight: 1.8 }}>
            <div><strong>Wer</strong> – Who</div>
            <div><strong>Wie</strong> – How</div>
            <div><strong>Was</strong> – What</div>
            <div><strong>Wo</strong> – Where</div>
            <div><strong>Woher</strong> – Where ... from / from where</div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          {wWordQuestions.map((question, index) => (
            <div key={question.stem} style={boxBase}>
              <strong style={{ fontSize: 16, lineHeight: 1.6 }}>{question.stem}</strong>
              <div style={{ color: "#4b5563", lineHeight: 1.7 }}>
                <strong>English hint:</strong> {question.englishHint}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {question.options.map((option) => {
                  const selected = wWordSelections[index] === option;

                  return (
                    <label
                      key={option}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        border: "1px solid #e5e7eb",
                        borderRadius: 999,
                        padding: "10px 14px",
                        background: selected ? "#eff6ff" : "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name={`wq-${index}`}
                        value={option}
                        checked={selected}
                        onChange={() => handleWWordChange(index, option)}
                        style={{ transform: "scale(1.1)" }}
                      />
                      <span style={{ fontSize: 15 }}>{option}</span>
                    </label>
                  );
                })}
              </div>

              <RevealAnswer buttonLabel="Show answer">
                <div style={{ lineHeight: 1.8 }}>
                  <div><strong>Correct answer:</strong> {question.answer}</div>
                  <div>{question.explanation}</div>
                </div>
              </RevealAnswer>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Final Task · Write About Yourself"
        subtitle="Write 6 to 8 sentences in German."
      >
        <div style={boxBase}>
          <strong>Use these ideas</strong>
          <div style={{ lineHeight: 1.8 }}>
            <div>• Name</div>
            <div>• Country</div>
            <div>• City</div>
            <div>• Age</div>
            <div>• Marital status</div>
            <div>• Children</div>
            <div>• Address</div>
          </div>
        </div>

        <label style={{ display: "grid", gap: 8 }}>
          <strong>My introduction</strong>
          <textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            placeholder="Ich heiße ... Ich komme aus ... Ich wohne in ..."
            style={textareaStyle}
          />
        </label>

        <RevealAnswer buttonLabel="Show sample paragraph">
          <p style={{ margin: 0, lineHeight: 1.9 }}>
            Ich heiße Kojo Mensah. Ich komme aus Ghana. Ich wohne in Accra.
            Ich bin 28 Jahre alt. Ich bin ledig. Ich habe keine Kinder.
            Meine Adresse ist 12 Mango Street.
          </p>
        </RevealAnswer>
      </SectionCard>

      <div style={{ ...successBoxStyle, gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Self-check</h2>
        <div style={{ lineHeight: 1.9 }}>
          <div>□ I can use <strong>der, die, das</strong>.</div>
          <div>□ I can describe things with simple adjectives.</div>
          <div>□ I can answer basic personal questions in German.</div>
          <div>□ I can use <strong>Wer, Wie, Was, Wo, Woher</strong>.</div>
          <div>□ I can write a short self-introduction.</div>
        </div>
      </div>
    </div>
  );
};

export default A1Day5IntroducingYourselfArticlesWorkbookPage;
