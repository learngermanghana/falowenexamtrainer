import React, { useEffect, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

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
const LESSON_TITLE = "A1 Day 13 — Statements and Questions with Time, Numbers and Prices";


const numberReviewItems = [
  { id:"n56", prompt:"56", answer:"sechsundfünfzig", compact:true },
  { id:"n248", prompt:"248", answer:"zweihundertachtundvierzig", compact:true },
  { id:"n1234", prompt:"1,234", answer:"eintausendzweihundertvierunddreißig", compact:true },
  { id:"n5678", prompt:"5,678", answer:"fünftausendsechshundertachtundsiebzig", compact:true },
];
const daysReviewItems = [
  { prompt:"Heute ist Dienstag. Welcher Tag ist morgen?", answer:1,
    options:["Montag","Mittwoch","Donnerstag","Freitag"] },
  { prompt:"How do you say 'on Friday' in German?", answer:2,
    options:["um Freitag","in Freitag","am Freitag","an Freitag"] },
];
const timeReviewItems = [
  { id:"t730", prompt:"7:30", answer:"Es ist halb acht.", accepted:["halb acht"] },
  { id:"t545", prompt:"5:45", answer:"Es ist Viertel vor sechs.", accepted:["Viertel vor sechs"] },
];
const priceReviewItems = [
  { id:"pbook", prompt:"Das Buch kostet 12 Euro. Write the question asking how much the book costs.",
    answer:"Wie viel kostet das Buch?", accepted:["Was kostet das Buch?"] },
  { id:"ppaper", prompt:"Wie viel kostet die Zeitung? (2,50 Euro). Write a complete answer.",
    answer:"Die Zeitung kostet zwei Euro fünfzig.",
    accepted:["Sie kostet zwei Euro fünfzig.","Die Zeitung kostet 2,50 Euro.","Sie kostet 2,50 Euro.",
    "Die Zeitung kostet zwei Euro und fünfzig Cent.","Sie kostet zwei Euro und fünfzig Cent."] },
];
const priceVerbReviewItems = [
  { prompt:"Wie viel kosten die Bücher? (20 Euro) Choose the correct reply.", answer:1,
    options:["Sie kostet zwanzig Euro.","Sie kosten zwanzig Euro.",
      "Es kostet zwanzig Euro.","Er kosten zwanzig Euro."] },
];
const groupTaskChecklist = [
  "Write three original statements using days, time, numbers or prices.",
  "Write three W-questions (Wann, Wie viel, Wie viele or Um wie viel Uhr).",
  "Write two yes/no questions beginning with the verb.",
  "Use the verb in position 2 for statements and W-questions, and position 1 for yes/no questions.",
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


const normalizeDay13ReviewAnswer = (value = "", compact = false) => {
  const normalized = String(value || "").toLocaleLowerCase("de-DE")
    .replace(/ß/g, "ss").replace(/[.!?;:]/g, "").replace(/[-–]/g, "")
    .replace(/\s+/g, compact ? "" : " ").trim();
  return normalized;
};

function ShortAnswerSection({ title, description, items }) {
  const [answers, setAnswers] = useState({});
  const [checks, setChecks] = useState({});
  return (
    <div style={{ display:"grid", gap:12 }} aria-label={title}>
      <h3 style={{ margin:0, fontSize:18 }}>{title}</h3>
      {description ? <p style={{ margin:0, color:"#475569" }}>{description}</p> : null}
      {items.map((item,i) => {
        const value=answers[item.id] || "";
        const accepted=[item.answer, ...(item.accepted || [])];
        const correct=accepted.some(answer => normalizeDay13ReviewAnswer(answer,item.compact) === normalizeDay13ReviewAnswer(value,item.compact));
        return (
          <div key={item.id} style={card}>
            <label htmlFor={"day13-"+item.id} style={{fontWeight:700}}>{i+1}. {item.prompt}</label>
            <input id={"day13-"+item.id} style={inputStyle} autoComplete="off"
              value={value} placeholder="Write your answer in German..."
              onChange={event => {
                setAnswers(previous => ({...previous, [item.id]:event.target.value}));
                setChecks(previous => ({...previous, [item.id]:false}));
              }} />
            <button type="button" style={{...lightBtn,justifySelf:"start"}}
              disabled={!value.trim()} onClick={() => setChecks(previous => ({...previous,[item.id]:true}))}>Check answer</button>
            {checks[item.id] ? <p role="status" style={{margin:0,color:correct?"#166534":"#9a3412"}}>
              {correct ? "✓ Correct!" : "Not quite. Model answer: "+item.answer}
            </p> : null}
          </div>
        );
      })}
    </div>
  );
}

function ChoiceReviewSection({ title, items }) {
  const [selected,setSelected] = useState({});
  const [checks,setChecks] = useState({});
  return (
    <div style={{display:"grid",gap:12}} aria-label={title}>
      <h3 style={{margin:0,fontSize:18}}>{title}</h3>
      {items.map((item,qi) => (
        <fieldset key={item.prompt} style={{...card,minWidth:0,borderRadius:12}}>
          <legend style={{padding:"0 5px",fontWeight:700}}>{qi+1}. {item.prompt}</legend>
          {item.options.map((option,index) => (
            <label key={option} style={{display:"flex",gap:9,alignItems:"flex-start",cursor:"pointer"}}>
              <input type="radio" name={title+"-"+qi} value={index}
                checked={selected[qi] === index} onChange={()=>{
                  setSelected(previous=>({...previous,[qi]:index}));
                  setChecks(previous=>({...previous,[qi]:false}));
                }} />
              <span>{String.fromCharCode(65+index)}. {option}</span>
            </label>
          ))}
          <button type="button" style={{...lightBtn,justifySelf:"start"}}
            disabled={selected[qi] === undefined}
            onClick={() => setChecks(previous=>({...previous,[qi]:true}))}>Check answer</button>
          {checks[qi] ? <p role="status" style={{margin:0,color:selected[qi] === item.answer?"#166534":"#9a3412"}}>
            {selected[qi] === item.answer ? "✓ Correct!" : "Not quite. Correct answer: "+item.options[item.answer]}
          </p> : null}
        </fieldset>
      ))}
    </div>
  );
}

const sentenceBuilderTasks = [
  {type:"Statement",hint:"The German course starts at 6 p.m.",words:["18 Uhr.","beginnt","Der Deutschkurs","um"],answer:["Der Deutschkurs","beginnt","um","18 Uhr."],rule:"The conjugated verb beginnt is in position 2."},
  {type:"Statement",hint:"I learn German on Monday.",words:["am Montag","Deutsch.","Ich","lerne"],answer:["Ich","lerne","am Montag","Deutsch."],rule:"The subject is first; the conjugated verb is second."},
  {type:"Statement",hint:"On Friday I work at 9 a.m.",words:["ich","Am Freitag","um neun Uhr.","arbeite"],answer:["Am Freitag","arbeite","ich","um neun Uhr."],rule:"Am Freitag is one time phrase in position 1. The verb is still second."},
  {type:"Statement",hint:"The book costs 20 euros.",words:["20 Euro.","Das Buch","kostet"],answer:["Das Buch","kostet","20 Euro."],rule:"Das Buch is singular, so use kostet."},
  {type:"W-question",hint:"When does the German course start?",words:["der Deutschkurs?","Wann","beginnt"],answer:["Wann","beginnt","der Deutschkurs?"],rule:"W-question: question word, conjugated verb, subject."},
  {type:"W-question",hint:"How much does the book cost?",words:["das Buch?","Wie viel","kostet"],answer:["Wie viel","kostet","das Buch?"],rule:"Wie viel is the question phrase; kostet follows."},
  {type:"W-question",hint:"What time do you have German class?",words:["du","Deutschunterricht?","hast","Um wie viel Uhr"],answer:["Um wie viel Uhr","hast","du","Deutschunterricht?"],rule:"Um wie viel Uhr asks for the clock time."},
  {type:"W-question",hint:"How many books do you have?",words:["Bücher","Wie viele","du?","hast"],answer:["Wie viele","Bücher","hast","du?"],rule:"Wie viele asks about countable plural objects."},
  {type:"Yes/no question",hint:"Does the course start at 6 p.m.?",words:["der Kurs","um 18 Uhr?","Beginnt"],answer:["Beginnt","der Kurs","um 18 Uhr?"],rule:"Yes/no questions begin with the conjugated verb."},
  {type:"Yes/no question",hint:"Does the book cost 20 euros?",words:["20 Euro?","Kostet","das Buch"],answer:["Kostet","das Buch","20 Euro?"],rule:"Put Kostet before das Buch."},
  {type:"Yes/no question",hint:"Do you have time on Monday?",words:["am Montag","du","Zeit?","Hast"],answer:["Hast","du","am Montag","Zeit?"],rule:"Hast + du + time phrase + object."},
  {type:"Yes/no question",hint:"Do the books cost 30 euros?",words:["die Bücher","30 Euro?","Kosten"],answer:["Kosten","die Bücher","30 Euro?"],rule:"The plural subject die Bücher needs kosten."},
];
const responsePracticeTasks = [
  {question:"Wann beginnt der Deutschkurs?",choices:["Er kostet 20 Euro.","Er beginnt um 18 Uhr.","Ich bin 20 Jahre alt."],correct:1,tip:"Wann asks when something happens."},
  {question:"Wie viel kostet das Buch?",choices:["Das Buch kostet 15 Euro.","Am Dienstag.","Um 9 Uhr."],correct:0,tip:"Wie viel kostet asks for a price."},
  {question:"Beginnt der Kurs um 18 Uhr?",choices:["Zwanzig Euro.","Am Freitag.","Ja, er beginnt um 18 Uhr."],correct:2,tip:"A yes/no question can be answered with Ja or Nein."},
  {question:"Wie viele Bücher hast du?",choices:["Ich habe drei Bücher.","Es ist halb acht.","Das Buch kostet zehn Euro."],correct:0,tip:"Wie viele asks how many countable items there are."},
];
const grammarStrip = {display:"flex",gap:6,flexWrap:"wrap",alignItems:"stretch"};
const grammarCell = (background) => ({background,borderRadius:9,padding:"12px 14px",display:"grid",gap:3,minWidth:110,flex:"1 1 110px"});
function SentencePattern({title,description,parts}) {
  return <div style={{...card,border:"1px solid #dbeafe"}}>
    <strong>{title}</strong><p style={{margin:0,color:"#475569"}}>{description}</p>
    <div style={grammarStrip}>{parts.map((part,index)=><div key={index} style={grammarCell(part.color)}>
      <small style={{color:"#334155"}}>{part.label}</small><strong>{part.word}</strong>
    </div>)}</div>
  </div>;
}
function SentenceBuilderSection() {
  const [answers,setAnswers]=useState({});
  const [checks,setChecks]=useState({});
  const correctCount=sentenceBuilderTasks.filter((task,index)=>JSON.stringify((answers[index]||[]).map(item=>item.word))===JSON.stringify(task.answer)).length;
  return <section style={section} data-a1-day13-section="sentence-builder">
    <div style={{color:"#1d4ed8",fontSize:13,fontWeight:800}}>GUIDED PRACTICE · 12 TASKS</div>
    <h2 style={{margin:0}}>5. Sätze und Fragen bauen · Sentence Builder</h2>
    <p style={{margin:0,color:"#475569"}}>Tap the word tiles in order. Check each answer and use the grammar hint to correct any mistakes. You can remove a tile or reset the sentence.</p>
    <div style={{...infoBox,background:"#f8fafc"}}><strong>Progress: {correctCount} of {sentenceBuilderTasks.length} correctly built</strong>
      <div style={{height:8,background:"#dbeafe",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:(correctCount/sentenceBuilderTasks.length*100)+"%",background:"#2563eb"}}/></div>
    </div>
    {sentenceBuilderTasks.map((task,index)=>{
      const selected=answers[index]||[];
      const remaining=task.words.map((word,i)=>({word,i})).filter(({i})=>!selected.some(item=>item.i===i));
      const correct=JSON.stringify(selected.map(item=>item.word))===JSON.stringify(task.answer);
      return <div key={index} style={{...card,border:"1px solid #e2e8f0"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <strong>{index+1}. {task.type}</strong><small style={{color:"#475569"}}>{task.hint}</small>
        </div>
        <div style={{...grammarStrip,minHeight:45}}>
          {selected.length ? selected.map((item,pos)=><button key={item.i} type="button" style={{...lightBtn,background:"#dbeafe",borderColor:"#93c5fd"}} aria-label={"Remove "+item.word}
            onClick={()=>{setAnswers(old=>({...old,[index]:selected.filter((_,i)=>i!==pos)}));setChecks(old=>({...old,[index]:false}));}}>{item.word} ×</button>) :
            <span style={{color:"#64748b"}}>Your sentence appears here…</span>}
        </div>
        <div style={grammarStrip}>{remaining.map(({word,i})=><button key={i} type="button" style={lightBtn}
          onClick={()=>{setAnswers(old=>({...old,[index]:[...selected,{word,i}]}));setChecks(old=>({...old,[index]:false}));}}>{word} +</button>)}</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button type="button" style={darkBtn} disabled={selected.length!==task.words.length}
            onClick={()=>setChecks(old=>({...old,[index]:true}))}>Check answer</button>
          <button type="button" style={lightBtn} onClick={()=>{setAnswers(old=>({...old,[index]:[]}));setChecks(old=>({...old,[index]:false}));}}>Reset</button>
        </div>
        {checks[index] ? <div role="status" style={{...tipBox,borderColor:correct?"#bbf7d0":"#fde68a",background:correct?"#f0fdf4":"#fffbeb"}}>
          <strong style={{color:correct?"#166534":"#9a3412"}}>{correct?"✓ Richtig!":"Try again. Hint:"}</strong>
          <span>{task.rule}</span>
        </div> : null}
      </div>;
    })}
  </section>;
}
function ResponsePracticeSection() {
  const [answers,setAnswers]=useState({});
  const [checked,setChecked]=useState({});
  return <section style={section} data-a1-day13-section="response-practice">
    <h2 style={{margin:0}}>6. Fragen beantworten · Choose a Response</h2>
    <p style={{margin:0,color:"#475569"}}>Read each question and choose the answer that makes sense.</p>
    {responsePracticeTasks.map((task,index)=><fieldset key={index} style={{...card,minWidth:0}}>
      <legend style={{fontWeight:700}}>{index+1}. {task.question}</legend>
      {task.choices.map((choice,choiceIndex)=><label key={choice} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
        <input type="radio" name={"day13-response-"+index} checked={answers[index]===choiceIndex}
          onChange={()=>{setAnswers(old=>({...old,[index]:choiceIndex}));setChecked(old=>({...old,[index]:false}));}}/>
        <span>{choice}</span>
      </label>)}
      <button type="button" style={{...lightBtn,justifySelf:"start"}} disabled={answers[index]===undefined}
        onClick={()=>setChecked(old=>({...old,[index]:true}))}>Check answer</button>
      {checked[index] ? <p role="status" style={{margin:0,color:answers[index]===task.correct?"#166534":"#9a3412"}}>
        {answers[index]===task.correct?"✓ Correct!":task.tip}
      </p>:null}
    </fieldset>)}
  </section>;
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
          contributionType: "sentence-building-statements-and-questions",
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
      <div style={{display:"grid",gap:6}}>
        <p style={{margin:0,color:"#166534",fontWeight:800}}>Part 7 · Self-practice · Optional class sharing</p>
        <h2 style={{margin:0}}>Your Own Statements and Questions</h2>
        <p style={{margin:0}}>
          Write three statements, three W-questions and two yes/no questions using numbers, time, days or prices.
          Optionally save them to the existing class discussion so classmates can read them.
          This is not a tutor-marked assignment.
        </p>
      </div>
      <div style={tipBox}>
        <strong>Ideas for your own sentences</strong>
        <div><strong>Days:</strong> Montag · Dienstag · Mittwoch · Donnerstag · Freitag · Samstag · Sonntag</div>
        <div><strong>Activities:</strong> Deutsch lernen · zur Schule gehen · arbeiten · Musik hören · Sport treiben · einkaufen gehen</div>
        <div><strong>Examples:</strong> Der Kurs beginnt um 18 Uhr. · Wann beginnt der Kurs? · Beginnt der Kurs um 18 Uhr?</div>
      </div>
      <div style={infoBox}>
        <strong>Your self-practice checklist</strong>
        <ul style={{margin:0,paddingLeft:20,display:"grid",gap:4}}>
          {groupTaskChecklist.map(item=><li key={item}>{item}</li>)}
        </ul>
      </div>
      <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
        Your answer box
        <textarea
          style={textareaStyle}
          placeholder="3 statements:\n1. Der Kurs beginnt um 18 Uhr.\n\n3 W-questions:\n1. Wann beginnt der Kurs?\n\n2 yes/no questions:\n1. Beginnt der Kurs um 18 Uhr?"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            setHasEditedDraft(true);
            setSavedMessage("");
          }}
        />
      </label>

      <div data-a1-live-discussion-controls="true" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <button type="button" style={darkBtn} onClick={handleSave} disabled={isSaving || !draft.trim()}>
          {isSaving ? "Saving..." : "Save to class discussion"}
        </button>
        {className ? <span style={{ color: "#166534", fontSize: 13 }}>Class: {className}</span> : null}
      </div>

      {savedMessage ? <div style={{ ...contributionBox, color: "#166534" }}>{savedMessage}</div> : null}
      {error ? <div style={{ ...styles.errorBox, margin: 0 }}>{error}</div> : null}

      <div data-a1-live-contributions="true" style={{ display: "grid", gap: 10 }}>
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
  return (
    <div style={styles.pageWrap}>
      <div style={{ ...styles.page, display:"grid", gap:16 }}>
        <section style={{ ...section, background:"#f8fafc" }} aria-label="Day 13 revision introduction">
          <div style={{color:"#1d4ed8",fontSize:13,fontWeight:800}}>A1 Day 13 · Learn, build, ask and respond</div>
          <h2 style={{margin:0}}>Sätze und Fragen bilden · Time, Numbers and Prices</h2>
          <p style={{margin:0,color:"#475569",lineHeight:1.7}}>
            First, answer 11 short questions to check what you already know.
            Then learn how to build German statements and write four sentences of your own.
          </p>
          <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:10}}>
            <span style={{fontSize:13,color:"#475569"}}>11 revision questions · 3 sentence patterns · 12 word builders · 4 responses · self-practice</span>
            <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
          </div>
        </section>
        <section style={section} data-a1-day13-section="numbers">
          <h2 style={{margin:0}}>1. Zahlen · Numbers</h2>
          <ShortAnswerSection title="Numbers check" description="Write these four numbers in German words. Check each answer." items={numberReviewItems}/>
        </section>
        <section style={section} data-a1-day13-section="days-time">
          <h2 style={{margin:0}}>2. Tage und Uhrzeit · Days and Time</h2>
          <p style={{margin:0,color:"#475569"}}>Check the day of the week, how to say 'on Friday' and two common clock times.</p>
          <ChoiceReviewSection title="Days of the week" items={daysReviewItems}/>
          <ShortAnswerSection title="Tell the time" description="Write the time naturally in German." items={timeReviewItems}/>
        </section>
        <section style={section} data-a1-day13-section="prices">
          <h2 style={{margin:0}}>3. Preise · Asking About Prices</h2>
          <p style={{margin:0,color:"#475569"}}>Practise asking for a price, giving a full answer and choosing kostet or kosten.</p>
          <ShortAnswerSection title="Ask and answer" items={priceReviewItems}/>
          <ChoiceReviewSection title="kostet oder kosten?" items={priceVerbReviewItems}/>
        </section>
        <section style={section} data-a1-day13-section="statement-formation">
          <div style={{color:"#1d4ed8",fontSize:13,fontWeight:800}}>NEW GRAMMAR SKILL</div>
          <h2 style={{margin:0}}>4. Satzbildung · How to Form a Statement</h2>
          <p style={{margin:0,lineHeight:1.7}}>
            In a normal German main-clause statement, the <strong>conjugated verb stays in position 2</strong>.
            You can begin the sentence with the subject or with a time expression.
          </p>
          <div style={infoBox}>
            <strong>Pattern A · Subject first</strong>
            <div>Ich <strong style={{color:"#1d4ed8"}}>lerne</strong> am Montag Deutsch.</div>
            <div style={{color:"#475569",fontSize:13}}>Subject (Ich) → Verb (lerne) → Time (am Montag) → Other information (Deutsch)</div>
          </div>
          <div style={infoBox}>
            <strong>Pattern B · Time first</strong>
            <div>Am Montag <strong style={{color:"#1d4ed8"}}>lerne</strong> ich Deutsch.</div>
            <div style={{color:"#475569",fontSize:13}}>Time phrase (Am Montag) → Verb (lerne) → Subject (ich) → Other information (Deutsch)</div>
          </div>
          <div style={tipBox}>
            <strong>Remember: the verb stays second.</strong>
            <div>"Am Montag" counts as one time phrase, so the verb follows it immediately.</div>
            <div><strong>Another example:</strong> Um acht Uhr <strong>gehe</strong> ich zur Schule.</div>
            <div><strong>Useful verb forms:</strong> ich lerne · ich gehe · ich spiele · ich arbeite</div>
          </div>
        </section>
        <section style={section} data-a1-day13-section="question-formation">
          <h2 style={{margin:0}}>Statements, W-questions and Yes/No Questions</h2>
          <SentencePattern title="Statement · Aussagesatz" description="The conjugated verb stays in position 2." parts={[
            {label:"Position 1 · Subject",word:"Der Kurs",color:"#dbeafe"},
            {label:"Position 2 · Verb",word:"beginnt",color:"#dcfce7"},
            {label:"More information",word:"um 18 Uhr.",color:"#fef3c7"}
          ]}/>
          <SentencePattern title="W-question · W-Frage" description="Question word + conjugated verb + subject." parts={[
            {label:"Question word",word:"Wann",color:"#dbeafe"},
            {label:"Verb",word:"beginnt",color:"#dcfce7"},
            {label:"Subject",word:"der Kurs?",color:"#fef3c7"}
          ]}/>
          <SentencePattern title="Yes/no question · Ja/Nein-Frage" description="Start with the conjugated verb. Answer with Ja or Nein." parts={[
            {label:"Position 1 · Verb",word:"Beginnt",color:"#dcfce7"},
            {label:"Position 2 · Subject",word:"der Kurs",color:"#dbeafe"},
            {label:"More information",word:"um 18 Uhr?",color:"#fef3c7"}
          ]}/>
          <div style={tipBox}><strong>Time and price language</strong>
            <span><strong>um</strong> + time: um 18 Uhr · <strong>am</strong> + day: am Montag</span>
            <span><strong>Wann?</strong> When? · <strong>Um wie viel Uhr?</strong> What time? · <strong>Wie viel?</strong> How much? · <strong>Wie viele?</strong> How many?</span>
            <span><strong>kostet</strong> = singular: Das Buch kostet 20 Euro. · <strong>kosten</strong> = plural: Die Bücher kosten 30 Euro.</span>
          </div>
        </section>
        <SentenceBuilderSection/>
        <ResponsePracticeSection/>
        <StatementContributionSection/>
      </div>
    </div>
  );
}
