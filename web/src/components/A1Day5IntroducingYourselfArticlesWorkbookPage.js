import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const boxBase = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
  display: "grid",
  gap: 8,
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
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  fontSize: 14,
};

const textareaStyle = {
  ...inputStyle,
  minHeight: 110,
  resize: "vertical",
  fontFamily: "inherit",
};

const chipStyle = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid #d1d5db",
  background: "#f9fafb",
  fontSize: 14,
  marginRight: 8,
  marginBottom: 8,
};

const heroImage =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80";

const articleWords = [
  { noun: "Tisch", article: "der", english: "table" },
  { noun: "Auto", article: "das", english: "car" },
  { noun: "Lampe", article: "die", english: "lamp" },
  { noun: "Apfel", article: "der", english: "apple" },
  { noun: "Buch", article: "das", english: "book" },
  { noun: "Katze", article: "die", english: "cat" },
  { noun: "Stuhl", article: "der", english: "chair" },
  { noun: "Haus", article: "das", english: "house" },
  { noun: "Blume", article: "die", english: "flower" },
  { noun: "Hund", article: "der", english: "dog" },
];

const adjectivePairs = [
  ["groß", "klein"],
  ["alt", "neu"],
  ["lang", "kurz"],
  ["schön", "hässlich"],
  ["heiß", "kalt"],
  ["schnell", "langsam"],
  ["laut", "leise"],
  ["teuer", "billig"],
  ["glücklich", "traurig"],
  ["sauber", "schmutzig"],
];

const wWordQuestions = [
  {
    stem: "1. ___ heißt du?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Wie",
    explanation: "Use 'Wie' to ask about a name: Wie heißt du?",
  },
  {
    stem: "2. ___ ist das Buch?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Wo",
    explanation: "Use 'Wo' to ask about location: Wo ist das Buch?",
  },
  {
    stem: "3. ___ wohnt er?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Wo",
    explanation: "Use 'Wo' for place: Wo wohnt er?",
  },
  {
    stem: "4. ___ kommst du?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Woher",
    explanation: "Use 'Woher' for origin: Woher kommst du?",
  },
  {
    stem: "5. ___ ist dein Lehrer?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Wer",
    explanation: "Use 'Wer' for a person: Wer ist dein Lehrer?",
  },
  {
    stem: "6. ___ geht es dir?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Wie",
    explanation: "Use 'Wie' for condition: Wie geht es dir?",
  },
  {
    stem: "7. ___ machst du am Wochenende?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Was",
    explanation: "Use 'Was' for an activity or thing: Was machst du ...?",
  },
  {
    stem: "8. ___ ist das Auto?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Wo",
    explanation: "Use 'Wo' for location.",
  },
  {
    stem: "9. ___ bist du?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Wer",
    explanation: "Use 'Wer' to ask who a person is.",
  },
  {
    stem: "10. ___ kommt sie?",
    options: ["Wer", "Wie", "Was", "Wo", "Woher"],
    answer: "Woher",
    explanation: "Use 'Woher' for origin.",
  },
];

const personalInfoPrompts = [
  { label: "Familienname", starter: "Mein Familienname ist ..." },
  { label: "Vorname", starter: "Mein Vorname ist ..." },
  { label: "Herkunft", starter: "Ich komme aus ..." },
  { label: "Geburtsort", starter: "Ich bin in ... geboren." },
  { label: "Adresse", starter: "Meine Adresse ist ..." },
  { label: "Postleitzahl", starter: "Meine Postleitzahl ist ..." },
  { label: "Familienstand", starter: "Ich bin ledig / verheiratet / geschieden / verwitwet." },
  { label: "Kinder", starter: "Ich habe ... Kinder. / Ich habe keine Kinder." },
  { label: "Alter", starter: "Ich bin ... Jahre alt." },
];

const SectionCard = ({ title, subtitle, children }) => (
  <section style={cardStyle}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {subtitle ? <p style={{ margin: 0, lineHeight: 1.7 }}>{subtitle}</p> : null}
    {children}
  </section>
);

const RevealAnswer = ({ children, buttonLabel = "Show answer" }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button
        type="button"
        style={{ ...styles.secondaryButton, width: "fit-content" }}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "Hide answer" : buttonLabel}
      </button>
      {open ? <div style={successBoxStyle}>{children}</div> : null}
    </div>
  );
};

const A1Day5IntroducingYourselfArticlesWorkbookPage = () => {
  const navigate = useNavigate();

  const [articleInputs, setArticleInputs] = useState(() =>
    articleWords.reduce((acc, item) => {
      acc[item.noun] = "";
      return acc;
    }, {})
  );

  const [wWordSelections, setWWordSelections] = useState(() =>
    wWordQuestions.reduce((acc, item, index) => {
      acc[index] = "";
      return acc;
    }, {})
  );

  const [adjectiveSentences, setAdjectiveSentences] = useState({
    one: "",
    two: "",
    three: "",
  });

  const [dialogueAnswers, setDialogueAnswers] = useState({
    name: "",
    country: "",
    city: "",
    age: "",
  });

  const [aboutMe, setAboutMe] = useState("");

  const articleScore = useMemo(() => {
    return articleWords.filter(
      (item) =>
        articleInputs[item.noun]?.trim().toLowerCase() === item.article.toLowerCase()
    ).length;
  }, [articleInputs]);

  const wWordScore = useMemo(() => {
    return wWordQuestions.filter(
      (question, index) => wWordSelections[index] === question.answer
    ).length;
  }, [wWordSelections]);

  const completedSections = useMemo(() => {
    let count = 0;
    if (articleScore > 0) count += 1;
    if (adjectiveSentences.one || adjectiveSentences.two || adjectiveSentences.three) count += 1;
    if (Object.values(dialogueAnswers).some(Boolean)) count += 1;
    if (wWordScore > 0) count += 1;
    if (aboutMe.trim()) count += 1;
    return count;
  }, [articleScore, adjectiveSentences, dialogueAnswers, wWordScore, aboutMe]);

  const handleArticleChange = (noun, value) => {
    setArticleInputs((prev) => ({ ...prev, [noun]: value }));
  };

  const handleWWordChange = (index, value) => {
    setWWordSelections((prev) => ({ ...prev, [index]: value }));
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...cardStyle, overflow: "hidden", padding: 0 }}>
        <img
          src={heroImage}
          alt="Students learning German together"
          style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
        />
        <div style={{ padding: 16, display: "grid", gap: 12 }}>
          <button
            type="button"
            style={{ ...styles.secondaryButton, width: "fit-content" }}
            onClick={() => navigate("/campus/course")}
          >
            Back to Course
          </button>

          <h1 style={{ ...styles.title, margin: 0 }}>
            A1 · Day 5 Workbook · Introducing Yourself and Articles
          </h1>
          <p style={{ ...styles.subtitle, margin: 0 }}>
            Chapter 1.2 · Interactive self-practice workbook
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this workbook, you will practise articles, adjectives, personal information,
            and German W-questions. Try each exercise first before checking the answers.
          </p>

          <div style={infoBoxStyle}>
            <strong>Progress</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Completed sections: {completedSections}/5
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Article score: {articleScore}/{articleWords.length} · W-word score: {wWordScore}/{wWordQuestions.length}
            </p>
          </div>
        </div>
      </div>

      <SectionCard
        title="Teil 1 · Articles in German"
        subtitle="In German, nouns have gender. Learn every noun together with its article."
      >
        <div style={infoBoxStyle}>
          <strong>Quick rule</strong>
          <div style={{ lineHeight: 1.7 }}>
            <div><strong>der</strong> → masculine</div>
            <div><strong>die</strong> → feminine</div>
            <div><strong>das</strong> → neuter</div>
          </div>
        </div>

        <div style={warningBoxStyle}>
          <strong>Important tip</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Do not learn only the noun. Learn the full pair:
            <strong> der Tisch</strong>, <strong>die Lampe</strong>, <strong>das Haus</strong>.
          </p>
        </div>

        <div style={boxBase}>
          <strong>Vocabulary bank</strong>
          <div>
            {articleWords.map((item) => (
              <span key={item.noun} style={chipStyle}>
                {item.noun} ({item.english})
              </span>
            ))}
          </div>
        </div>

        <div style={boxBase}>
          <strong>Practice: Write the correct article</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Write <strong>der</strong>, <strong>die</strong>, or <strong>das</strong>.
          </p>

          <div style={{ display: "grid", gap: 10 }}>
            {articleWords.map((item) => (
              <label
                key={item.noun}
                style={{
                  display: "grid",
                  gap: 6,
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <strong>{item.noun}</strong>
                <input
                  type="text"
                  value={articleInputs[item.noun]}
                  onChange={(e) => handleArticleChange(item.noun, e.target.value)}
                  placeholder="der / die / das"
                  style={inputStyle}
                />
              </label>
            ))}
          </div>

          <RevealAnswer buttonLabel="Show article answers">
            <div style={{ display: "grid", gap: 6 }}>
              {articleWords.map((item) => (
                <div key={item.noun}>
                  <strong>{item.article}</strong> {item.noun}
                </div>
              ))}
            </div>
          </RevealAnswer>
        </div>

        <div style={boxBase}>
          <strong>Extra practice: Sort the nouns</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Say these aloud and group them by article in your notebook or during class discussion.
          </p>
          <RevealAnswer buttonLabel="Show grouping">
            <div style={{ display: "grid", gap: 10 }}>
              <div><strong>der:</strong> Tisch, Apfel, Stuhl, Hund</div>
              <div><strong>die:</strong> Lampe, Katze, Blume</div>
              <div><strong>das:</strong> Auto, Buch, Haus</div>
            </div>
          </RevealAnswer>
        </div>
      </SectionCard>

      <SectionCard
        title="Teil 2 · Adjectives and Opposites"
        subtitle="Adjectives describe nouns. Use them to say more about a person or thing."
      >
        <div style={boxBase}>
          <strong>Adjective pairs</strong>
          <div style={{ display: "grid", gap: 6 }}>
            {adjectivePairs.map(([left, right]) => (
              <div key={`${left}-${right}`}>
                {left} – {right}
              </div>
            ))}
          </div>
        </div>

        <div style={boxBase}>
          <strong>Model sentences</strong>
          <div style={{ lineHeight: 1.7 }}>
            <div>Der Baum ist groß.</div>
            <div>Das Haus ist klein.</div>
            <div>Die Blume ist schön.</div>
          </div>
        </div>

        <div style={boxBase}>
          <strong>Write your own sentences</strong>
          <label style={{ display: "grid", gap: 6 }}>
            <span>1. Write a sentence with <strong>groß</strong></span>
            <input
              type="text"
              value={adjectiveSentences.one}
              onChange={(e) =>
                setAdjectiveSentences((prev) => ({ ...prev, one: e.target.value }))
              }
              placeholder="Example: Der Hund ist groß."
              style={inputStyle}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>2. Write a sentence with <strong>klein</strong></span>
            <input
              type="text"
              value={adjectiveSentences.two}
              onChange={(e) =>
                setAdjectiveSentences((prev) => ({ ...prev, two: e.target.value }))
              }
              placeholder="Example: Die Katze ist klein."
              style={inputStyle}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>3. Write a sentence with <strong>schön</strong> or <strong>neu</strong></span>
            <input
              type="text"
              value={adjectiveSentences.three}
              onChange={(e) =>
                setAdjectiveSentences((prev) => ({ ...prev, three: e.target.value }))
              }
              placeholder="Example: Das Buch ist neu."
              style={inputStyle}
            />
          </label>

          <RevealAnswer buttonLabel="Show sample sentences">
            <div style={{ lineHeight: 1.7 }}>
              <div>Der Hund ist groß.</div>
              <div>Die Katze ist klein.</div>
              <div>Das Buch ist neu.</div>
            </div>
          </RevealAnswer>
        </div>
      </SectionCard>

      <SectionCard
        title="Teil 3 · Personal Information"
        subtitle="Complete these sentence starters with your own information."
      >
        <div style={boxBase}>
          <strong>Sentence starters</strong>
          <div style={{ display: "grid", gap: 10 }}>
            {personalInfoPrompts.map((item, index) => (
              <div
                key={item.label}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: 12,
                  display: "grid",
                  gap: 6,
                }}
              >
                <strong>
                  {index + 1}. {item.label}
                </strong>
                <span>{item.starter}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={warningBoxStyle}>
          <strong>Common mistakes</strong>
          <div style={{ lineHeight: 1.7 }}>
            <div>✅ Ich bin 25 Jahre alt.</div>
            <div>❌ Ich habe 25 Jahre.</div>
            <div>✅ Ich komme aus Ghana.</div>
            <div>❌ Ich komme von Ghana.</div>
            <div>✅ Ich habe keine Kinder.</div>
            <div>✅ Ich bin ledig.</div>
          </div>
        </div>

        <div style={infoBoxStyle}>
          <strong>Speak aloud</strong>
          <div style={{ lineHeight: 1.7 }}>
            <div>Ich heiße ...</div>
            <div>Ich komme aus ...</div>
            <div>Ich wohne in ...</div>
            <div>Ich bin ... Jahre alt.</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Teil 4 · Mini Dialogue Practice"
        subtitle="Complete this short conversation in German."
      >
        <div style={boxBase}>
          <label style={{ display: "grid", gap: 6 }}>
            <strong>A: Wie heißt du?</strong>
            <input
              type="text"
              value={dialogueAnswers.name}
              onChange={(e) =>
                setDialogueAnswers((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="B: Ich heiße ..."
              style={inputStyle}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <strong>A: Woher kommst du?</strong>
            <input
              type="text"
              value={dialogueAnswers.country}
              onChange={(e) =>
                setDialogueAnswers((prev) => ({ ...prev, country: e.target.value }))
              }
              placeholder="B: Ich komme aus ..."
              style={inputStyle}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <strong>A: Wo wohnst du?</strong>
            <input
              type="text"
              value={dialogueAnswers.city}
              onChange={(e) =>
                setDialogueAnswers((prev) => ({ ...prev, city: e.target.value }))
              }
              placeholder="B: Ich wohne in ..."
              style={inputStyle}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <strong>A: Wie alt bist du?</strong>
            <input
              type="text"
              value={dialogueAnswers.age}
              onChange={(e) =>
                setDialogueAnswers((prev) => ({ ...prev, age: e.target.value }))
              }
              placeholder="B: Ich bin ... Jahre alt."
              style={inputStyle}
            />
          </label>

          <RevealAnswer buttonLabel="Show model dialogue">
            <div style={{ lineHeight: 1.8 }}>
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
        </div>
      </SectionCard>

      <SectionCard
        title="Teil 5 · W-Words"
        subtitle="Choose the correct German question word."
      >
        <div style={infoBoxStyle}>
          <strong>W-Words overview</strong>
          <div style={{ lineHeight: 1.7 }}>
            <div><strong>Wer</strong> – Who</div>
            <div><strong>Wie</strong> – How</div>
            <div><strong>Was</strong> – What</div>
            <div><strong>Wo</strong> – Where</div>
            <div><strong>Woher</strong> – From where</div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {wWordQuestions.map((question, index) => (
            <div key={question.stem} style={boxBase}>
              <strong>{question.stem}</strong>

              <div style={{ display: "grid", gap: 8 }}>
                {question.options.map((option) => {
                  const selected = wWordSelections[index] === option;
                  return (
                    <label
                      key={option}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        border: "1px solid #e5e7eb",
                        borderRadius: 10,
                        padding: 10,
                        background: selected ? "#f9fafb" : "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name={`wq-${index}`}
                        value={option}
                        checked={selected}
                        onChange={() => handleWWordChange(index, option)}
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>

              <RevealAnswer buttonLabel="Show answer">
                <div style={{ lineHeight: 1.7 }}>
                  <div>
                    <strong>Correct answer:</strong> {question.answer}
                  </div>
                  <div>{question.explanation}</div>
                </div>
              </RevealAnswer>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Final Task · Write About Yourself"
        subtitle="Write 6 to 8 sentences about yourself in German."
      >
        <div style={boxBase}>
          <strong>Use these ideas</strong>
          <div style={{ lineHeight: 1.7 }}>
            <div>• Name</div>
            <div>• Country</div>
            <div>• City</div>
            <div>• Age</div>
            <div>• Marital status</div>
            <div>• Children</div>
            <div>• Address</div>
          </div>
        </div>

        <label style={{ display: "grid", gap: 6 }}>
          <strong>My introduction</strong>
          <textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            placeholder="Example: Ich heiße ... Ich komme aus ... Ich wohne in ..."
            style={textareaStyle}
          />
        </label>

        <RevealAnswer buttonLabel="Show sample paragraph">
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            Ich heiße Kojo Mensah. Ich komme aus Ghana. Ich wohne in Accra.
            Ich bin 28 Jahre alt. Ich bin ledig. Ich habe keine Kinder.
            Meine Adresse ist 12 Mango Street. Meine Postleitzahl ist GA-123-4567.
          </p>
        </RevealAnswer>
      </SectionCard>

      <div style={{ ...successBoxStyle, gap: 10 }}>
        <h2 style={{ margin: 0 }}>Self-check</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Check your work before you leave this page.
        </p>
        <div style={{ lineHeight: 1.8 }}>
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
