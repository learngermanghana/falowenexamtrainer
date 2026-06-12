import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  db,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "../firebase";
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

const contributionBox = {
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
  borderRadius: 14,
  padding: 12,
  display: "grid",
  gap: 10,
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: 130,
  resize: "vertical",
  lineHeight: 1.55,
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

const LESSON_LEVEL = "A1";
const LESSON_ID = "a1-day-13-revision-numbers-time-prices-statements";
const LESSON_TITLE = "A1 Day 13 — Numbers, Time, Prices and Statements";

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
  { question: "Wie viel kostet das Buch?", object: "das Buch", price: "10 Euro" },
  { question: "Wie viel kostet der Apfel?", object: "der Apfel", price: "2 Euro" },
  { question: "Wie viel kostet die Banane?", object: "die Banane", price: "1 Euro" },
  { question: "Wie viel kostet die Zeitung?", object: "die Zeitung", price: "2,50 Euro" },
  { question: "Wie viel kostet die Tasse?", object: "die Tasse", price: "3 Euro" },
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

const statementChecklist = [
  "one sentence with a number",
  "one sentence with a time",
  "one sentence with a year or birthday",
  "one sentence with a price",
  "one sentence with a day and activity",
];

const safeDocKey = (value = "") =>
  String(value || "")
    .trim()
    .replace(/[\\/]+/g, "-")
    .replace(/\s+/g, "-")
    .toLowerCase() || "unknown-class";

const normalizeTimestamp = (value) => {
  if (!value) return null;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value < 1e12 ? value * 1000 : value;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const formatDateTime = (value) => {
  const ms = normalizeTimestamp(value);
  if (!ms) return "Just now";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Accra",
  }).format(new Date(ms));
};

const getClassName = (studentProfile = {}) =>
  studentProfile?.className ||
  studentProfile?.class_name ||
  studentProfile?.class ||
  studentProfile?.cohort ||
  "";

const getStudentCode = (studentProfile = {}, user = {}) =>
  studentProfile?.studentcode ||
  studentProfile?.studentCode ||
  studentProfile?.student_id ||
  studentProfile?.id ||
  user?.uid ||
  "unknown";

const getDisplayName = (studentProfile = {}, user = {}) =>
  studentProfile?.name || user?.displayName || user?.email || "Student";

const contributionsCollectionRef = (classKey) =>
  collection(db, "group_discussion", LESSON_LEVEL, "classes", classKey, "lessons", LESSON_ID, "contributions");

function PracticeInputSection({ title, subtitle, items, placeholder = "Type your answer..." }) {
  const [inputs, setInputs] = useState({});

  return (
    <section style={section}>
      <div style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        {subtitle ? <p style={{ margin: 0 }}>{subtitle}</p> : null}
      </div>

      {items.map((item, i) => {
        const prompt = Array.isArray(item) ? item[0] : item.question;
        const helper = Array.isArray(item) ? null : `${item.object} · ${item.price}`;

        return (
          <div key={`${prompt}-${i}`} style={card}>
            <strong>{prompt}</strong>
            {helper ? <span style={{ color: "#6b7280", fontSize: 13 }}>Use: {helper}</span> : null}
            <input
              style={inputStyle}
              placeholder={placeholder}
              value={inputs[i] || ""}
              onChange={(e) => setInputs((prev) => ({ ...prev, [i]: e.target.value }))}
            />
          </div>
        );
      })}
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

function StatementContributionSection() {
  const { user, studentProfile } = useAuth();
  const className = getClassName(studentProfile);
  const classKey = useMemo(() => safeDocKey(className), [className]);
  const studentCode = getStudentCode(studentProfile, user);
  const studentDocId = safeDocKey(user?.uid || studentCode);
  const [draft, setDraft] = useState("");
  const [hasEditedDraft, setHasEditedDraft] = useState(false);
  const [contributions, setContributions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    if (!db || !className) return undefined;

    const contributionsQuery = query(contributionsCollectionRef(classKey), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      contributionsQuery,
      (snapshot) => {
        const nextContributions = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            authorName: data.authorName || "Student",
            studentCode: data.studentCode || "",
            text: data.text || "",
            createdAt: data.createdAt || data.createdAtMs || null,
            updatedAt: data.updatedAt || null,
          };
        });

        setContributions(nextContributions);
        setError("");

        const mine = nextContributions.find(
          (item) => item.id === studentDocId || String(item.studentCode || "").toLowerCase() === String(studentCode || "").toLowerCase()
        );

        if (mine?.text && !hasEditedDraft) {
          setDraft(mine.text);
        }
      },
      (err) => {
        console.error("Failed to load class contributions", err);
        setError("Class contributions could not be loaded. Please try again later.");
      }
    );

    return () => unsubscribe();
  }, [classKey, className, hasEditedDraft, studentCode, studentDocId]);

  const handleSave = async () => {
    if (!db) {
      setError("Firebase is not configured. Please try again later.");
      return;
    }

    if (!className) {
      setError("Your class name is missing. Please update your account profile before saving.");
      return;
    }

    const text = draft.trim();
    if (!text) {
      setError("Write your contribution before saving.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSavedMessage("");

    try {
      await setDoc(
        doc(contributionsCollectionRef(classKey), studentDocId),
        {
          level: LESSON_LEVEL,
          className,
          classKey,
          lessonId: LESSON_ID,
          lessonTitle: LESSON_TITLE,
          contributionType: "statement-practice",
          authorName: getDisplayName(studentProfile, user),
          studentCode,
          studentUid: user?.uid || null,
          text,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
          createdAtMs: Date.now(),
        },
        { merge: true }
      );

      setHasEditedDraft(false);
      setSavedMessage("Saved. Your class can now read your contribution below.");
    } catch (err) {
      console.error("Failed to save class contribution", err);
      setError("Your contribution could not be saved. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section style={{ ...section, borderColor: "#86efac", background: "#f7fee7" }}>
      <div style={{ display: "grid", gap: 6 }}>
        <p style={{ margin: 0, color: "#166534", fontWeight: 800 }}>Practical class discussion</p>
        <h2 style={{ margin: 0 }}>Final task: Form your own German statements</h2>
        <p style={{ margin: 0 }}>
          This is not a tutor assignment. Write your contribution and save it for your class discussion.
          Everyone in your class can view the contributions here.
        </p>
      </div>

      <div style={tipBox}>
        <strong>Your contribution should include:</strong>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 4 }}>
          {statementChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div style={infoBox}>
        <strong>Sentence frames you can use — complete them with your own information:</strong>
        <div>Ich habe ______ Bücher.</div>
        <div>Es ist ______ Uhr.</div>
        <div>Ich bin am ______ geboren.</div>
        <div>Das/Der/Die ______ kostet ______ Euro.</div>
        <div>Am ______ gehe/mache/lese/treffe ich ______.</div>
      </div>

      <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
        Your answer box
        <textarea
          style={textareaStyle}
          placeholder="Example: Ich habe zwei Bücher. Es ist halb acht. Ich bin am dritten Juli geboren. Die Tasche kostet zehn Euro. Am Montag gehe ich zur Schule."
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            setHasEditedDraft(true);
            setSavedMessage("");
          }}
        />
      </label>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <button type="button" style={darkBtn} onClick={handleSave} disabled={isSaving || !draft.trim()}>
          {isSaving ? "Saving..." : "Save to class discussion"}
        </button>
        {className ? <span style={{ color: "#166534", fontSize: 13 }}>Class: {className}</span> : null}
      </div>

      {savedMessage ? <div style={{ ...contributionBox, color: "#166534" }}>{savedMessage}</div> : null}
      {error ? <div style={{ ...styles.errorBox, margin: 0 }}>{error}</div> : null}

      <div style={{ display: "grid", gap: 10 }}>
        <h3 style={{ margin: 0 }}>Class contributions</h3>
        {contributions.length === 0 ? (
          <div style={contributionBox}>No contribution yet. Be the first student in your class to share one.</div>
        ) : (
          contributions.map((item) => (
            <article key={item.id} style={contributionBox}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <strong>{item.authorName}</strong>
                <span style={{ color: "#4b5563", fontSize: 12 }}>{formatDateTime(item.updatedAt || item.createdAt)}</span>
              </div>
              <p style={{ margin: 0, whiteSpace: "pre-line", lineHeight: 1.55 }}>{item.text}</p>
            </article>
          ))
        )}
      </div>
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
              This revision page helps you practise practical German for everyday situations.
            </p>
            <button type="button" style={lightBtn} onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>
        </section>

        <section style={section}>
          <h2 style={{ margin: 0 }}>Introduction to the Numbers Practice</h2>
          <p style={{ margin: 0 }}>
            Today, you will revise numbers, time, years, birthdays, prices, and basic word order.
            Type your own answers first. The final task at the bottom is where you share your own German statements with your class.
          </p>
        </section>

        <PracticeInputSection
          title="Practice: Numbers from 1 to 10,000"
          subtitle="Read the numbers out loud in German and type what you think. The model answer is not shown here, so you practise actively."
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
            <div><strong>Useful patterns:</strong></div>
            <div>Es ist ______ Uhr.</div>
            <div>Es ist halb ______.</div>
            <div>Es ist Viertel nach ______.</div>
            <div>Es ist Viertel vor ______.</div>
          </div>
        </section>

        <PracticeInputSection
          title="Time Practice"
          subtitle="Say the time in German. Use the patterns above to help you."
          items={timePracticeItems}
          placeholder="Type the full answer..."
        />

        <section style={section}>
          <h2 style={{ margin: 0 }}>Explanation of Years in German</h2>
          <p style={{ margin: 0 }}>
            In German, the years from 1000 to 1999 are often spoken with
            <strong> hundert</strong>, while years from 2000 onwards are spoken directly.
          </p>

          <div style={infoBox}>
            <div>1100: <span style={{ color: yearPartColor.thousandPart }}>elf</span><span style={{ color: yearPartColor.hundertPart }}>hundert</span></div>
            <div>1453: <span style={{ color: yearPartColor.thousandPart }}>vierzehn</span><span style={{ color: yearPartColor.hundertPart }}>hundert</span><span style={{ color: yearPartColor.restPart }}>dreiundfünfzig</span></div>
            <div>1944: <span style={{ color: yearPartColor.thousandPart }}>neunzehn</span><span style={{ color: yearPartColor.hundertPart }}>hundert</span><span style={{ color: yearPartColor.restPart }}>vierundvierzig</span></div>
          </div>

          <div style={infoBox}>
            <div><strong>For years beyond 1999, you say the number directly:</strong></div>
            <div>2000: <span style={{ color: yearPartColor.post2000Part }}>zweitausend</span></div>
            <div>2010: <span style={{ color: yearPartColor.post2000Part }}>zweitausend</span><span style={{ color: yearPartColor.restPart }}>zehn</span></div>
            <div>2025: <span style={{ color: yearPartColor.post2000Part }}>zweitausend</span><span style={{ color: yearPartColor.restPart }}>fünfundzwanzig</span></div>
          </div>
        </section>

        <PracticeInputSection
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
            <div>"Ich bin" = I am.</div>
            <div>"am" = on the, and the date takes the ending -ten or -sten.</div>
            <div>"geboren" = born, usually at the end of the sentence.</div>
          </div>

          <div style={tipBox}>
            <div><strong>Forming Dates in German</strong></div>
            <div>1–19 → Add "-te" → after "am" it becomes "-ten".</div>
            <div>20 and above → Add "-ste" → after "am" it becomes "-sten".</div>
            <div>Example frame: Ich bin am ______ Mai ______ geboren.</div>
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
            <div>das Buch · der Apfel · der Kaffee · die Banane · die Zeitung · die Tasse</div>
          </div>

          <div style={tipBox}>
            <div><strong>Step 2: Ask and Answer</strong></div>
            <div>A: Wie viel kostet [object]?</div>
            <div>B: [Pronoun] kostet [price] Euro.</div>
          </div>
        </section>

        <PracticeInputSection
          title="Price Question and Answer Practice"
          subtitle="Read the question and write your own full answer."
          items={pricesQaItems}
          placeholder="Write the full answer..."
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
            <div><strong>Sentence Structures:</strong></div>
            <div>1. Subject + Verb + Time + Other Elements</div>
            <div>2. Time + Verb + Subject + Other Elements</div>
          </div>

          <div style={tipBox}>
            <div><strong>Days of the Week in German</strong></div>
            <div>Montag · Dienstag · Mittwoch · Donnerstag · Freitag · Samstag · Sonntag</div>
          </div>

          <div style={infoBox}>
            <div><strong>Activities to Use in Sentences</strong></div>
            <div>kochen · Freunde treffen · Hausaufgaben machen · fernsehen · lesen</div>
            <div>im Park spazieren gehen · zur Schule gehen · arbeiten · Sport treiben · einkaufen gehen</div>
          </div>
        </section>

        <StatementContributionSection />
      </div>
    </div>
  );
}
