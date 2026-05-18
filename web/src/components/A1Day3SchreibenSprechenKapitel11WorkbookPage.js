import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const imageStyle = {
  width: "100%",
  borderRadius: 14,
  maxHeight: 280,
  objectFit: "cover",
};

const subCardStyle = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
};

const questionBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 10,
  background: "#fff",
};

const optionButtonStyle = (selected, correct, checked) => ({
  width: "100%",
  textAlign: "left",
  borderRadius: 10,
  border: checked
    ? selected && correct
      ? "1px solid #16a34a"
      : selected && !correct
      ? "1px solid #dc2626"
      : correct
      ? "1px solid #16a34a"
      : "1px solid #d1d5db"
    : selected
    ? "1px solid #2563eb"
    : "1px solid #d1d5db",
  background: checked
    ? selected && correct
      ? "#f0fdf4"
      : selected && !correct
      ? "#fef2f2"
      : correct
      ? "#f0fdf4"
      : "#fff"
    : selected
    ? "#eff6ff"
    : "#fff",
  padding: "10px 12px",
  cursor: "pointer",
  fontSize: "0.98rem",
});

const listStyle = {
  margin: 0,
  paddingLeft: 18,
  lineHeight: 1.7,
};

const simpleGridStyle = {
  display: "grid",
  gap: 10,
};

const vocabGridStyle = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
};

const vocabItemStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 8,
};

const emojiStyle = {
  fontSize: "2rem",
  lineHeight: 1,
};

const wWordQuestions = [
  {
    id: 1,
    stem: "1. ___ ist das?",
    options: ["Was", "Wer", "Wie", "Wo"],
    correct: "Was",
    response: "Was ist das? – Das ist ein Ball.",
  },
  {
    id: 2,
    stem: "2. ___ ist Martin?",
    options: ["Was", "Wer", "Wie", "Wo"],
    correct: "Wo",
    response: "Wo ist Martin? – Martin ist in Ghana.",
  },
  {
    id: 3,
    stem: "3. ___ ist der Ball?",
    options: ["Was", "Wer", "Wie", "Wo"],
    correct: "Wie",
    response: "Wie ist der Ball? – Der Ball ist klein.",
  },
  {
    id: 4,
    stem: "4. ___ ist das?",
    options: ["Was", "Wer", "Wie", "Wo"],
    correct: "Wer",
    response: "Wer ist das? – Das ist Martin.",
  },
  {
    id: 5,
    stem: "5. ___ spielt mit dem Ball?",
    options: ["Was", "Wer", "Wie", "Wo"],
    correct: "Wer",
    response: "Wer spielt mit dem Ball? – Martin spielt mit dem Ball.",
  },
  {
    id: 6,
    stem: "6. ___ heißt du?",
    options: ["Was", "Wer", "Wie", "Wo"],
    correct: "Wie",
    response: "Wie heißt du? – Ich heiße Felix.",
  },
  {
    id: 7,
    stem: "7. ___ wohnt deine Mutter?",
    options: ["Was", "Wer", "Wie", "Wo"],
    correct: "Wo",
    response: "Wo wohnt deine Mutter? – Meine Mutter wohnt in Berlin.",
  },
  {
    id: 8,
    stem: "8. ___ ist dein Job?",
    options: ["Was", "Wer", "Wie", "Wo"],
    correct: "Was",
    response: "Was ist dein Job? – Ich bin Lehrer.",
  },
  {
    id: 9,
    stem: "9. ___ heißt deine Mutter?",
    options: ["Was", "Wer", "Wie", "Wo"],
    correct: "Wie",
    response: "Wie heißt deine Mutter? – Sie heißt Anna.",
  },
];

const scenarios = [
  {
    title: "Scenario 1: Meeting a Friend in the Morning",
    text: "It's 9:00 AM, and you run into a friend at a café. You haven't seen each other in a while, and you want to greet them and ask how they are doing. What would you say?",
    answer: "Guten Morgen! Wie geht's dir?",
  },
  {
    title: "Scenario 2: Greeting a Teacher in the Afternoon",
    text: "It's 2:00 PM, and you meet your teacher in the hallway before class starts. You want to greet them politely and ask how they are. What would you say?",
    answer: "Guten Tag, Herr/Frau [Name]. Wie geht es Ihnen?",
  },
  {
    title: "Scenario 3: Talking to a Neighbor in the Evening",
    text: "It's 6:30 PM, and you see your neighbor outside while you're both taking out the trash. You want to greet them, ask how they are doing, and then say goodbye as you go back inside.",
    answer: "Guten Abend! Wie geht es Ihnen? Auf Wiedersehen!",
  },
  {
    title: "Scenario 4: Greeting a Family Member in the Evening",
    text: "It's 7:00 PM, and you come home from school. You see your family member and want to greet them, ask how their day has been, and tell them goodnight. What would you say?",
    answer: "Hallo! Wie war dein Tag? Gute Nacht!",
  },
];

const spellingWords = [
  { word: "Haus", spelling: "H - A - U - S", pronunciation: "[haʊs]" },
  { word: "Baum", spelling: "B - A - U - M", pronunciation: "[baʊm]" },
  { word: "Hund", spelling: "H - U - N - D", pronunciation: "[hʊnt]" },
  { word: "Buch", spelling: "B - U - C - H", pronunciation: "[buːχ]" },
  { word: "Apfel", spelling: "A - P - F - E - L", pronunciation: "[ˈapfəl]" },
];

const pronunciationWords = [
  "1. Auto – ['ow-toh'] (car)",
  "2. Brot – ['broht'] (bread)",
  "3. Mutter – ['moo-tah'] (mother)",
  "4. Schule – ['shoo-leh'] (school)",
  "5. Freund – ['froint'] (friend)",
  "6. Haus – ['hows'] (house)",
  "7. Wasser – ['vah-ser'] (water)",
  "8. Tisch – ['tish'] (table)",
  "9. Zeit – ['tsyt'] (time)",
  "10. Stadt – ['shtat'] (city)",
  "11. Buch – ['bookh'] (book)",
  "12. Fenster – ['fen-ster'] (window)",
  "13. Hund – ['hoond'] (dog)",
  "14. Katze – ['kaht-seh'] (cat)",
  "15. Baum – ['bowm'] (tree)",
  "16. Lehrer – ['lay-rer'] (teacher)",
  "17. Garten – ['gar-ten'] (garden)",
  "18. Sonne – ['zoh-neh'] (sun)",
  "19. Mond – ['mohnd'] (moon)",
  "20. Blume – ['bloo-meh'] (flower)",
];

const peopleFamily = [
  { article: "der", word: "Mann", meaning: "man", emoji: "👨" },
  { article: "die", word: "Frau", meaning: "woman", emoji: "👩" },
  { article: "das", word: "Kind", meaning: "child", emoji: "🧒" },
  { article: "der", word: "Vater", meaning: "father", emoji: "👨‍👧" },
  { article: "die", word: "Mutter", meaning: "mother", emoji: "👩‍👧" },
  { article: "der", word: "Bruder", meaning: "brother", emoji: "👦" },
  { article: "die", word: "Schwester", meaning: "sister", emoji: "👧" },
  { article: "der", word: "Freund", meaning: "friend (male)", emoji: "🧑" },
  { article: "die", word: "Freundin", meaning: "friend (female)", emoji: "👩" },
];

const places = [
  { article: "das", word: "Haus", meaning: "house", emoji: "🏠" },
  { article: "die", word: "Wohnung", meaning: "apartment", emoji: "🏢" },
  { article: "die", word: "Schule", meaning: "school", emoji: "🏫" },
  { article: "der", word: "Park", meaning: "park", emoji: "🌳" },
  { article: "das", word: "Geschäft", meaning: "store", emoji: "🏪" },
  { article: "die", word: "Stadt", meaning: "city", emoji: "🏙️" },
  { article: "das", word: "Land", meaning: "country", emoji: "🌍" },
];

const objects = [
  { article: "das", word: "Buch", meaning: "book", emoji: "📘" },
  { article: "der", word: "Stuhl", meaning: "chair", emoji: "🪑" },
  { article: "der", word: "Tisch", meaning: "table", emoji: "🛋️" },
  { article: "das", word: "Auto", meaning: "car", emoji: "🚗" },
  { article: "das", word: "Fahrrad", meaning: "bicycle", emoji: "🚲" },
  { article: "der", word: "Computer", meaning: "computer", emoji: "💻" },
  { article: "das", word: "Handy", meaning: "mobile phone", emoji: "📱" },
];

const foodDrink = [
  { article: "das", word: "Brot", meaning: "bread", emoji: "🍞" },
  { article: "der", word: "Apfel", meaning: "apple", emoji: "🍎" },
  { article: "das", word: "Wasser", meaning: "water", emoji: "💧" },
  { article: "die", word: "Milch", meaning: "milk", emoji: "🥛" },
  { article: "der", word: "Kaffee", meaning: "coffee", emoji: "☕" },
  { article: "der", word: "Tee", meaning: "tea", emoji: "🍵" },
  { article: "das", word: "Bier", meaning: "beer", emoji: "🍺" },
];

const verbs = [
  "sein - to be",
  "haben - to have",
  "kommen - to come",
  "gehen - to go",
  "machen - to do/make",
  "essen - to eat",
  "trinken - to drink",
  "lesen - to read",
  "schreiben - to write",
  "sprechen - to speak",
  "hören - to hear/listen",
  "sehen - to see",
  "spielen - to play",
  "arbeiten - to work",
  "wohnen - to live",
];

const VocabularyCard = ({ title, items }) => (
  <div style={subCardStyle}>
    <strong>{title}</strong>
    <div style={vocabGridStyle}>
      {items.map((item) => (
        <div key={`${item.article}-${item.word}`} style={vocabItemStyle}>
          <span style={emojiStyle}>{item.emoji}</span>
          <strong>
            {item.article} {item.word}
          </strong>
          <span>{item.meaning}</span>
        </div>
      ))}
    </div>
  </div>
);

const A1Day3SchreibenSprechenKapitel11WorkbookPage = () => {
  const navigate = useNavigate();
  const [showScenarioAnswers, setShowScenarioAnswers] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [checkedAnswers, setCheckedAnswers] = useState(false);

  const score = useMemo(() => {
    return wWordQuestions.reduce((total, question) => {
      return total + (selectedAnswers[question.id] === question.correct ? 1 : 0);
    }, 0);
  }, [selectedAnswers]);

  const handleSelect = (questionId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleCheckAnswers = () => {
    setCheckedAnswers(true);
  };

  const handleResetAnswers = () => {
    setSelectedAnswers({});
    setCheckedAnswers(false);
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A1 · Day 3 Practice Book · Greetings, Spelling, Vocabulary &amp; W-Words
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>
          This is a practice page only. Read, speak, spell, and practise basic A1 German.
        </p>
      </div>

      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80"
          alt="Students studying and writing in a workbook"
          loading="lazy"
          style={imageStyle}
        />
        <h2 style={{ margin: 0 }}>Teil 1 · Reading / Writing</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Practice greetings, asking “How are you?”, and saying goodbye in German through these scenarios.
        </p>

        {scenarios.map((scenario) => (
          <div key={scenario.title} style={subCardStyle}>
            <strong>{scenario.title}</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>{scenario.text}</p>
            {showScenarioAnswers ? (
              <p style={{ margin: 0, color: "#1f2937", lineHeight: 1.7 }}>
                <strong>Model answer:</strong> {scenario.answer}
              </p>
            ) : (
              <p style={{ margin: 0, color: "#6b7280", fontStyle: "italic" }}>
                Think first before checking the model answer.
              </p>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => setShowScenarioAnswers((prev) => !prev)}
          style={{ ...styles.secondaryButton, width: "fit-content" }}
        >
          {showScenarioAnswers ? "Hide model answers" : "Show model answers"}
        </button>
      </section>

      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
          alt="Notebook and pencil for spelling practice"
          loading="lazy"
          style={imageStyle}
        />
        <h2 style={{ margin: 0 }}>Spelling Practice</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          In this exercise, you will practice spelling common German words and learn how to pronounce each
          letter. Spelling is an important skill that helps you communicate clearly, especially when giving
          your name or writing words.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          You&apos;ll start by spelling five simple German words, listening to how each letter sounds.
          Afterward, you&apos;ll have a chance to spell your own name in German. This will help you get
          comfortable with German letters and pronunciation.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Let&apos;s get started!</p>

        {spellingWords.map((item) => (
          <div key={item.word} style={subCardStyle}>
            <strong>{item.word}</strong>
            <span>
              <strong>Spelling:</strong> {item.spelling}
            </span>
            <span>
              <strong>Pronunciation:</strong> {item.pronunciation}
            </span>
          </div>
        ))}

        <div style={{ ...subCardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <strong>Now, spell your name in German!</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Example:</strong> If your name is "Anna," you would spell it as A - N - N - A.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Pronunciation Tip:</strong> Say each letter clearly and slowly.
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80"
          alt="Students learning pronunciation and vocabulary"
          loading="lazy"
          style={imageStyle}
        />
        <h2 style={{ margin: 0 }}>Basic Vocabulary for A1 German Class</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Welcome to our pronunciation practice session! Today, we&apos;ll focus on getting comfortable
          with how German sounds, which is a key step in becoming more confident in speaking the language.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Pronunciation in German can be different from English, but you&apos;ll get the hang of it with
          practice. We&apos;ll start by practicing some individual words to understand how certain letters
          and sounds are pronounced in German. Then, we&apos;ll move on to sentences that will help you put
          these sounds together more naturally.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Remember, it&apos;s okay to make mistakes—pronunciation takes time to perfect. Just listen
          carefully, repeat after me, and don&apos;t be afraid to try again if you don&apos;t get it right
          the first time. Let&apos;s begin!
        </p>

        <div style={subCardStyle}>
          <strong>Pronunciation Words</strong>
          <div style={simpleGridStyle}>
            {pronunciationWords.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <VocabularyCard title="People and Family" items={peopleFamily} />
        <VocabularyCard title="Places" items={places} />
        <VocabularyCard title="Objects" items={objects} />
        <VocabularyCard title="Food and Drink" items={foodDrink} />

        <div style={subCardStyle}>
          <strong>Verbs</strong>
          <div style={simpleGridStyle}>
            {verbs.map((verb) => (
              <span key={verb}>{verb}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Introducing Yourself</h2>

        <div style={subCardStyle}>
          <strong>1. Name</strong>
          <p style={{ margin: 0 }}>"Ich heiße [Name]."</p>
          <p style={{ margin: 0 }}>Example: "Ich heiße Felix."</p>
        </div>

        <div style={subCardStyle}>
          <strong>2. Country</strong>
          <p style={{ margin: 0 }}>"Ich komme aus [Country]."</p>
          <p style={{ margin: 0 }}>Example: "Ich komme aus Deutschland."</p>
        </div>

        <div style={subCardStyle}>
          <strong>3. Age</strong>
          <p style={{ margin: 0 }}>"Ich bin [Age] Jahre alt."</p>
          <p style={{ margin: 0 }}>Example: "Ich bin 25 Jahre alt."</p>
        </div>

        <div style={subCardStyle}>
          <strong>4. Location</strong>
          <p style={{ margin: 0 }}>"Ich wohne in [City/Location]."</p>
          <p style={{ margin: 0 }}>Example: "Ich wohne in Berlin."</p>
        </div>

        <div style={{ ...subCardStyle, background: "#fefce8", border: "1px solid #fde68a" }}>
          <strong>Combined Introduction</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            "Hallo! Ich heiße Felix. Ich komme aus Deutschland. Ich bin 25 Jahre alt und ich wohne in
            Berlin."
          </p>
        </div>

        <div style={subCardStyle}>
          <strong>Vocabulary List</strong>
          <ul style={listStyle}>
            <li>Name: der Name</li>
            <li>To be called: heißen</li>
            <li>Country: das Land</li>
            <li>To come from: kommen aus</li>
          </ul>
        </div>
      </section>

      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1600&q=80"
          alt="Student learning question words in class"
          loading="lazy"
          style={imageStyle}
        />
        <h2 style={{ margin: 0 }}>Explanation of W-Words and Their Usage</h2>

        <div style={subCardStyle}>
          <strong>1. Was (What)</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Usage:</strong> For objects and things.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Example:</strong> Was ist das? – Das ist ein Ball.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Purpose:</strong> To ask about an object or thing.
          </p>
        </div>

        <div style={subCardStyle}>
          <strong>2. Wo (Where)</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Usage:</strong> For places and positions.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Example:</strong> Wo ist Martin? – Martin ist in Ghana.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Purpose:</strong> To ask about the location or position of someone or something.
          </p>
        </div>

        <div style={subCardStyle}>
          <strong>3. Wie (How)</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Usage:</strong> For states or characteristics.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Example:</strong> Wie ist der Ball? – Der Ball ist klein.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Purpose:</strong> To ask about the condition or characteristic of something.
          </p>
        </div>

        <div style={subCardStyle}>
          <strong>4. Wer (Who)</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Usage:</strong> For people.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Example:</strong> Wer ist das? – Das ist Martin.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Purpose:</strong> To ask about a person.
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Lückentext mit W-Wörtern</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Below are questions that use the German W-Words. Fill in the blanks with the correct W-Word
          (Was, Wer, Wie, Wo). Choose one answer for each question, then check your work.
        </p>

        {wWordQuestions.map((question) => (
          <div key={question.id} style={questionBoxStyle}>
            <strong>{question.stem}</strong>
            <div style={{ display: "grid", gap: 8 }}>
              {question.options.map((option, index) => {
                const selected = selectedAnswers[question.id] === option;
                const correct = question.correct === option;
                const label = String.fromCharCode(65 + index);

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(question.id, option)}
                    style={optionButtonStyle(selected, correct, checkedAnswers)}
                  >
                    {label}) {option}
                  </button>
                );
              })}
            </div>

            {checkedAnswers ? (
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                <strong>Correct answer:</strong> {question.correct}
                <br />
                <strong>Example answer:</strong> {question.response}
              </p>
            ) : null}
          </div>
        ))}

        <div style={{ ...subCardStyle, background: "#f9fafb" }}>
          <strong>Practice Actions</strong>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleCheckAnswers}
              style={{ ...styles.button, width: "fit-content" }}
            >
              Check Answers
            </button>
            <button
              type="button"
              onClick={handleResetAnswers}
              style={{ ...styles.secondaryButton, width: "fit-content" }}
            >
              Reset
            </button>
          </div>

          {checkedAnswers ? (
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Your score:</strong> {score} / {wWordQuestions.length}
            </p>
          ) : (
            <p style={{ margin: 0, color: "#6b7280" }}>
              Answer all questions first, then press Check Answers.
            </p>
          )}

          <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.7 }}>
            Explanation: <strong>Was</strong> asks about things, <strong>Wo</strong> asks about place,
            <strong> Wie</strong> asks about condition or form, and <strong>Wer</strong> asks about people.
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Speaking Practice</h2>
        <div style={{ ...subCardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <strong>Practice about yourself</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Say your own introduction in German using this structure:
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            “Hallo! Ich heiße [Name]. Ich komme aus [Country]. Ich bin [Age] Jahre alt. Ich wohne in
            [City].”
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Discussion Practice</h2>
        <div style={{ ...subCardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <strong>Join the group discussion</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Go to the group discussion page, open <strong>Class Members</strong>, and write your
            introduction using this structure:
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            “Ich heiße [Name]. Ich komme aus [Country]. Ich bin [Age] Jahre alt. Ich wohne in [City].”
          </p>
          <a
            href="https://www.falowen.app/campus/discussion"
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
          >
            Open Group Discussion Page
          </a>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Key Things You Learned Today</h2>
        <div style={{ ...subCardStyle, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
          <span>✔ German greetings</span>
          <span>✔ Asking “How are you?”</span>
          <span>✔ Spelling German words</span>
          <span>✔ Basic pronunciation</span>
          <span>✔ Vocabulary for people, places, objects, food, and drink</span>
          <span>✔ Important W-question words: Was, Wer, Wie, Wo</span>
        </div>
      </section>
    </div>
  );
};

export default A1Day3SchreibenSprechenKapitel11WorkbookPage;
