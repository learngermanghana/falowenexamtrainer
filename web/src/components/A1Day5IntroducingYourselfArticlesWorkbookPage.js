import React, { useEffect, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import PersonalInformationContributionBox from "./PersonalInformationContributionBox";
import { getDiscussionLesson } from "../utils/discussionLessons";
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

const successBoxStyle = {
  ...boxBase,
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
};

const textareaStyle = {
  ...styles.textArea,
  width: "100%",
  minHeight: 180,
  boxSizing: "border-box",
  fontFamily: "inherit",
  fontSize: 16,
  lineHeight: 1.6,
};

const heroImage =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80";

const genderOptions = ["masculine", "feminine", "neuter"];

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

const personalInfoPrompts = [
  ["Familienname", "Mein Familienname ist …"],
  ["Vorname", "Mein Vorname ist …"],
  ["Herkunft", "Ich komme aus …"],
  ["Geburtsort", "Ich bin in … geboren."],
  ["Adresse", "Meine Adresse ist …"],
  ["Postleitzahl", "Meine Postleitzahl ist …"],
  ["Telefonnummer", "Meine Telefonnummer ist …"],
  ["Familienstand", "Ich bin ledig / verheiratet / geschieden / verwitwet."],
  ["Kinder", "Ich habe … Kinder. / Ich habe keine Kinder."],
  ["Alter", "Ich bin … Jahre alt."],
];

const wWordQuestions = [
  { stem: "1. ___ heißt du?", options: ["Wer", "Wie", "Was", "Wo", "Woher"], answer: "Wie", explanation: "Use Wie to ask about a name.", englishHint: "What is your name?" },
  { stem: "2. ___ ist das Buch?", options: ["Wer", "Wie", "Was", "Wo", "Woher"], answer: "Wo", explanation: "Use Wo to ask about a place.", englishHint: "Where is the book?" },
  { stem: "3. ___ wohnt er?", options: ["Wer", "Wie", "Was", "Wo", "Woher"], answer: "Wo", explanation: "Use Wo for location.", englishHint: "Where does he live?" },
  { stem: "4. ___ kommst du?", options: ["Wer", "Wie", "Was", "Wo", "Woher"], answer: "Woher", explanation: "Use Woher for origin.", englishHint: "Where do you come from?" },
  { stem: "5. ___ ist dein Lehrer?", options: ["Wer", "Wie", "Was", "Wo", "Woher"], answer: "Wer", explanation: "Use Wer for a person.", englishHint: "Who is your teacher?" },
  { stem: "6. ___ geht es dir?", options: ["Wer", "Wie", "Was", "Wo", "Woher"], answer: "Wie", explanation: "Use Wie for condition.", englishHint: "How are you?" },
  { stem: "7. ___ machst du am Wochenende?", options: ["Wer", "Wie", "Was", "Wo", "Woher"], answer: "Was", explanation: "Use Was for an action or thing.", englishHint: "What do you do at the weekend?" },
  { stem: "8. ___ ist das Auto?", options: ["Wer", "Wie", "Was", "Wo", "Woher"], answer: "Wo", explanation: "Use Wo for location.", englishHint: "Where is the car?" },
  { stem: "9. ___ bist du?", options: ["Wer", "Wie", "Was", "Wo", "Woher"], answer: "Wer", explanation: "Use Wer to ask who a person is.", englishHint: "Who are you?" },
  { stem: "10. ___ kommt sie?", options: ["Wer", "Wie", "Was", "Wo", "Woher"], answer: "Woher", explanation: "Use Woher for origin.", englishHint: "Where does she come from?" },
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

const sentenceAnswers = [
  "Ich heiße Anna. (Statement)",
  "Woher kommen Sie? (Question)",
  "Ich bin 25 Jahre alt. (Statement)",
  "Ich komme aus Deutschland. (Statement)",
  "Meine Telefonnummer ist 123456789. (Statement)",
  "Entschuldigung, wie heißen Sie? (Question)",
  "Wie geht es dir? (Question)",
  "Wie geht es Ihnen? (Question)",
  "Es geht mir gut. (Statement)",
  "Mir geht es gut. (Statement)",
  "Wo wohnst du? (Question)",
];

const SectionCard = ({ title, subtitle, children }) => (
  <section style={cardStyle}>
    <div style={{ display: "grid", gap: 6 }}>
      <h2 style={{ margin: 0, fontSize: 22 }}>{title}</h2>
      {subtitle ? <p style={{ margin: 0, lineHeight: 1.7, color: "#4b5563" }}>{subtitle}</p> : null}
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
        style={{ ...styles.secondaryButton, width: "100%", minHeight: 48, borderRadius: 12 }}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Hide answer" : buttonLabel}
      </button>
      {open ? <div style={successBoxStyle}>{children}</div> : null}
    </div>
  );
};

export default function A1Day5IntroducingYourselfArticlesWorkbookPage() {
  const [articleGenderSelections, setArticleGenderSelections] = useState({});
  const [wWordSelections, setWWordSelections] = useState(() =>
    wWordQuestions.reduce((answers, _, index) => ({ ...answers, [index]: "" }), {})
  );
  const [sentenceDraft, setSentenceDraft] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("a1-day5-scrambled-sentences") || "";
  });
  const [saveStatus, setSaveStatus] = useState("saved");

  const discussionLesson = useMemo(
    () => getDiscussionLesson({ level: "A1", day: 5, chapter: "1.3" }),
    []
  );

  const articleScore = useMemo(
    () => articleWords.filter((item) => articleGenderSelections[item.noun] === item.gender).length,
    [articleGenderSelections]
  );

  const wWordScore = useMemo(
    () => wWordQuestions.filter((question, index) => wWordSelections[index] === question.answer).length,
    [wWordSelections]
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    setSaveStatus("saving");
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem("a1-day5-scrambled-sentences", sentenceDraft);
        setSaveStatus("saved");
      } catch (error) {
        console.error("Could not save A1 Day 5 scrambled-sentence draft", error);
        setSaveStatus("error");
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [sentenceDraft]);

  const saveStatusText =
    saveStatus === "saving"
      ? "Saving…"
      : saveStatus === "error"
        ? "Could not save on this device. Copy your answers before leaving."
        : "✓ Saved on this device";

  const saveStatusColor =
    saveStatus === "saving" ? "#92400e" : saveStatus === "error" ? "#b91c1c" : "#166534";

  return (
    <div style={pageWrap}>
      <header style={{ ...cardStyle, overflow: "hidden", padding: 0 }}>
        <img
          src={heroImage}
          alt="Students learning German together"
          style={{ width: "100%", height: "clamp(180px, 30vw, 240px)", objectFit: "cover", display: "block" }}
        />
        <div style={{ padding: 16, display: "grid", gap: 12 }}>
          <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase" }}>A1 · Day 5</div>
          <h1 style={{ ...styles.title, margin: 0, lineHeight: 1.25 }}>Personal Information, Articles, Adjectives and W-Questions</h1>
          <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 1.3 · Interactive workbook</p>
          <p style={{ margin: 0, color: "#4b5563" }}>Articles · Adjectives · Personal information · Dialogues · W-questions · Sentence building</p>
          <div style={infoBoxStyle}>
            <strong>Progress</strong>
            <div style={{ lineHeight: 1.7 }}>
              <div>Article genders: {articleScore}/{articleWords.length}</div>
              <div>W-words: {wWordScore}/{wWordQuestions.length}</div>
              <div>Your introduction in Teil 3 is saved to your class profile and class discussion.</div>
              <div>Your scrambled-sentence practice is autosaved in Teil 6.</div>
            </div>
          </div>
        </div>
      </header>

      <SectionCard title="Teil 1 · Articles" subtitle="Choose whether each noun is masculine, feminine, or neuter.">
        <div style={infoBoxStyle}>
          <strong>Quick guide</strong>
          <div style={{ lineHeight: 1.8 }}>
            <div><strong>der</strong> = masculine</div>
            <div><strong>die</strong> = feminine</div>
            <div><strong>das</strong> = neuter</div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {articleWords.map((item, index) => {
            const selectedGender = articleGenderSelections[item.noun];
            const isCorrect = selectedGender === item.gender;

            return (
              <div key={item.noun} style={boxBase}>
                <strong style={{ fontSize: 17 }}>
                  {index + 1}. {item.article} {item.noun} <span style={{ color: "#64748b", fontWeight: 500 }}>({item.english})</span>
                </strong>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {genderOptions.map((gender) => {
                    const isSelected = selectedGender === gender;
                    const selectedCorrectly = isSelected && gender === item.gender;
                    const selectedIncorrectly = isSelected && gender !== item.gender;

                    return (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => setArticleGenderSelections((current) => ({ ...current, [item.noun]: gender }))}
                        style={{
                          ...styles.secondaryButton,
                          padding: "9px 12px",
                          borderRadius: 999,
                          background: selectedCorrectly ? "#dcfce7" : selectedIncorrectly ? "#fee2e2" : isSelected ? "#eff6ff" : "#fff",
                          borderColor: selectedCorrectly ? "#22c55e" : selectedIncorrectly ? "#ef4444" : "#cbd5e1",
                          color: selectedCorrectly ? "#166534" : selectedIncorrectly ? "#991b1b" : "#0f172a",
                          fontWeight: 700,
                        }}
                      >
                        {gender}
                      </button>
                    );
                  })}
                </div>
                {selectedGender ? (
                  <div
                    role="status"
                    style={{
                      padding: "9px 11px",
                      borderRadius: 10,
                      background: isCorrect ? "#f0fdf4" : "#fff7ed",
                      color: isCorrect ? "#166534" : "#9a3412",
                      fontWeight: 700,
                    }}
                  >
                    {isCorrect
                      ? `✓ Correct — ${item.article} means ${item.gender}.`
                      : `Try again. Look at the article “${item.article}”.`}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Teil 2 · Adjectives" subtitle="Use simple adjectives to describe people and things.">
        <div style={boxBase}>
          <strong>Adjective pairs</strong>
          <div style={{ display: "grid", gap: 8 }}>
            {adjectivePairs.map(([left, right, leftEnglish, rightEnglish]) => (
              <div key={`${left}-${right}`}><strong>{left}</strong> ({leftEnglish}) – <strong>{right}</strong> ({rightEnglish})</div>
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
        <p style={{ margin: 0, color: "#4b5563" }}>Say 3–5 short adjective sentences aloud.</p>
      </SectionCard>

      <SectionCard title="Teil 3 · Personal Information" subtitle="Schreibe eine kurze Vorstellung mit 6–8 Sätzen.">
        <div style={{ ...infoBoxStyle, gap: 8 }}>
          {personalInfoPrompts.map(([label, starter], index) => (
            <div key={label} style={{ lineHeight: 1.6 }}>
              <strong>{index + 1}. {label}:</strong> {starter}
            </div>
          ))}
        </div>
        <PersonalInformationContributionBox
          lessonId={discussionLesson.id}
          lessonLabel={discussionLesson.label}
        />
      </SectionCard>

      <SectionCard title="Teil 4 · Mini Dialogue" subtitle="Read and practise the short conversation.">
        <div style={infoBoxStyle}>
          <strong>W-question rule</strong>
          <div>W-word + verb + subject</div>
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

      <SectionCard title="Teil 5 · W-Words" subtitle="Choose the correct question word.">
        <div style={infoBoxStyle}>
          <strong>Wer · Wie · Was · Wo · Woher</strong>
          <div>Who · How · What · Where · Where from</div>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          {wWordQuestions.map((question, index) => (
            <div key={question.stem} style={boxBase}>
              <strong>{question.stem}</strong>
              <div style={{ color: "#4b5563" }}><strong>English hint:</strong> {question.englishHint}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {question.options.map((option) => (
                  <label key={option} style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid #e5e7eb", borderRadius: 999, padding: "10px 14px" }}>
                    <input
                      type="radio"
                      name={`wq-${index}`}
                      checked={wWordSelections[index] === option}
                      onChange={() => setWWordSelections((current) => ({ ...current, [index]: option }))}
                    />
                    {option}
                  </label>
                ))}
              </div>
              <RevealAnswer>
                <div><strong>Correct answer:</strong> {question.answer}</div>
                <div>{question.explanation}</div>
              </RevealAnswer>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Teil 6 · Scrambled Sentences" subtitle="Rearrange the words to form correct German sentences and mark each as a statement or question.">
        <div style={infoBoxStyle}>
          <strong>Instructions</strong>
          <div style={{ lineHeight: 1.8 }}>
            <div>1. Statements: Subject + Verb + Other elements.</div>
            <div>2. W-questions: W-word + Verb + Pronoun.</div>
          </div>
        </div>
        <div style={boxBase}>
          <strong>Rearrange these phrases</strong>
          <div style={{ lineHeight: 1.8 }}>
            {sentenceReorderPhrases.map((phrase, index) => <div key={phrase}>{index + 1}. {phrase}</div>)}
          </div>
        </div>
        <label style={{ display: "grid", gap: 8 }}>
          <strong>Your corrected sentences</strong>
          <textarea
            value={sentenceDraft}
            onChange={(event) => {
              setSaveStatus("saving");
              setSentenceDraft(event.target.value);
            }}
            placeholder={"1. Ich heiße Anna. (Statement)\n2. Woher kommen Sie? (Question)\n..."}
            style={textareaStyle}
          />
          <span
            role="status"
            aria-live="polite"
            style={{ color: saveStatusColor, fontSize: 13, fontWeight: 700 }}
          >
            {saveStatusText}
          </span>
        </label>
        <RevealAnswer buttonLabel="Show scrambled sentence answers">
          <div style={{ display: "grid", gap: 6 }}>
            {sentenceAnswers.map((answer, index) => <div key={answer}>{index + 1}. {answer}</div>)}
          </div>
        </RevealAnswer>
      </SectionCard>

      <div style={successBoxStyle}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Self-check</h2>
        <div style={{ lineHeight: 1.9 }}>
          <div>□ I can identify masculine, feminine and neuter nouns.</div>
          <div>□ I can describe things with simple adjectives.</div>
          <div>□ I can answer basic personal questions in German.</div>
          <div>□ I can use Wer, Wie, Was, Wo and Woher.</div>
          <div>□ I can write a short self-introduction.</div>
          <div>□ I can build statements and W-questions in the correct order.</div>
        </div>
      </div>
    </div>
  );
}
