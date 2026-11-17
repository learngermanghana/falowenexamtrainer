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


const groupTaskChecklist = [
  "Write two original statements about time or prices.",
  "Write two W-questions (Wann or Wie viel).",
  "Write one yes/no question beginning with the verb.",
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


const sentenceBuilderTasks = [
  {type:"Statement",hint:"The German course starts at 6 p.m.",words:["18 Uhr.","beginnt","Der Deutschkurs","um"],answer:["Der Deutschkurs","beginnt","um","18 Uhr."],rule:"The conjugated verb beginnt is in position 2."},
  {type:"Statement",hint:"I learn German on Monday.",words:["am Montag","Deutsch.","Ich","lerne"],answer:["Ich","lerne","am Montag","Deutsch."],rule:"The subject is first; the conjugated verb is second."},
  {type:"Statement",hint:"The book costs 20 euros.",words:["20 Euro.","Das Buch","kostet"],answer:["Das Buch","kostet","20 Euro."],rule:"Das Buch is singular, so use kostet."},
  {type:"W-question",hint:"When does the German course start?",words:["der Deutschkurs?","Wann","beginnt"],answer:["Wann","beginnt","der Deutschkurs?"],rule:"W-question: question word, conjugated verb, subject."},
  {type:"W-question",hint:"How much does the book cost?",words:["das Buch?","Wie viel","kostet"],answer:["Wie viel","kostet","das Buch?"],rule:"Wie viel is the question phrase; kostet follows."},
  {type:"Yes/no question",hint:"Does the course start at 6 p.m.?",words:["der Kurs","um 18 Uhr?","Beginnt"],answer:["Beginnt","der Kurs","um 18 Uhr?"],rule:"Yes/no questions begin with the conjugated verb."},
];
const responsePracticeTasks = [
  {question:"Wann beginnt der Deutschkurs?",choices:["Er kostet 20 Euro.","Er beginnt um 18 Uhr.","Ich bin 20 Jahre alt."],correct:1,tip:"Wann asks when something happens."},
  {question:"Wie viel kostet das Buch?",choices:["Das Buch kostet 15 Euro.","Am Dienstag.","Um 9 Uhr."],correct:0,tip:"Wie viel kostet asks for a price."},
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
  const [taskIndex,setTaskIndex]=useState(0);
  const [answers,setAnswers]=useState({});
  const [checks,setChecks]=useState({});
  const task=sentenceBuilderTasks[taskIndex];
  const selected=answers[taskIndex]||[];
  const correct=JSON.stringify(selected.map(item=>item.word))===JSON.stringify(task.answer);
  const completed=sentenceBuilderTasks.filter((entry,index)=>checks[index] && JSON.stringify((answers[index]||[]).map(item=>item.word))===JSON.stringify(entry.answer)).length;
  return <section style={section} data-a1-day13-section="sentence-builder">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap"}}>
      <h2 style={{margin:0}}>2. Build statements and questions</h2>
      <strong style={{color:"#2563eb"}}>{taskIndex+1} / {sentenceBuilderTasks.length}</strong>
    </div>
    <p style={{margin:0,color:"#475569"}}>Tap the words in order, then check your answer.</p>
    <div style={{height:7,background:"#dbeafe",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:(completed/sentenceBuilderTasks.length*100)+"%",background:"#2563eb"}}/></div>
    <div style={{...infoBox,background:"#f8fafc"}}>
      <strong>{task.type}</strong>
      <span>{task.hint}</span>
    </div>
    <div style={{...grammarStrip,minHeight:45}}>
      {selected.length ? selected.map((item,pos)=><button key={item.i} type="button" style={{...lightBtn,background:"#dbeafe",borderColor:"#93c5fd"}} aria-label={"Remove "+item.word}
        onClick={()=>{setAnswers(old=>({...old,[taskIndex]:selected.filter((_,i)=>i!==pos)}));setChecks(old=>({...old,[taskIndex]:false}));}}>{item.word} ×</button>) :
        <span style={{color:"#64748b"}}>Build your sentence here…</span>}
    </div>
    <div style={grammarStrip}>{task.words.map((word,i)=>({word,i})).filter(({i})=>!selected.some(item=>item.i===i)).map(({word,i})=><button key={i} type="button" style={lightBtn}
      onClick={()=>{setAnswers(old=>({...old,[taskIndex]:[...selected,{word,i}]}));setChecks(old=>({...old,[taskIndex]:false}));}}>{word} +</button>)}</div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      <button type="button" style={darkBtn} disabled={selected.length!==task.words.length} onClick={()=>setChecks(old=>({...old,[taskIndex]:true}))}>Check answer</button>
      <button type="button" style={lightBtn} onClick={()=>{setAnswers(old=>({...old,[taskIndex]:[]}));setChecks(old=>({...old,[taskIndex]:false}));}}>Reset</button>
    </div>
    {checks[taskIndex] ? <p role="status" style={{margin:0,color:correct?"#166534":"#9a3412"}}>
      <strong>{correct?"✓ Richtig!":"Try again."}</strong> {task.rule}
    </p> : null}
    <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
      <button type="button" style={lightBtn} disabled={taskIndex===0} onClick={()=>setTaskIndex(i=>i-1)}>Previous</button>
      <button type="button" style={lightBtn} disabled={taskIndex===sentenceBuilderTasks.length-1} onClick={()=>setTaskIndex(i=>i+1)}>Next →</button>
    </div>
  </section>;
}
function ResponsePracticeSection() {
  const [answers,setAnswers]=useState({});
  const [checked,setChecked]=useState({});
  return <section style={section} data-a1-day13-section="response-practice">
    <h2 style={{margin:0}}>3. Fragen beantworten · Choose a Response</h2>
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
        <p style={{margin:0,color:"#166534",fontWeight:800}}>Part 4 · Self-practice · Optional class sharing</p>
        <h2 style={{margin:0}}>Your Own Statements and Questions</h2>
        <p style={{margin:0}}>
          Write two statements, two W-questions and one yes/no question using time or prices.
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
          placeholder="2 statements:\n1. Der Kurs beginnt um 18 Uhr.\n\n2 W-questions:\n1. Wann beginnt der Kurs?\n\n1 yes/no question:\n1. Beginnt der Kurs um 18 Uhr?"
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
            Learn how to form German statements, W-questions and yes/no questions using familiar time and price examples.
          </p>
          <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:10}}>
            <span style={{fontSize:13,color:"#475569"}}>3 sentence patterns · 6 word builders · 2 responses · short writing task</span>
            <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
          </div>
        </section>
        <section style={section} data-a1-day13-section="question-formation">
          <h2 style={{margin:0}}>1. The three German sentence patterns</h2>
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
        <details style={{...section,padding:0,overflow:"hidden"}}><summary style={{cursor:"pointer",padding:16,fontWeight:700}}>4. Try it yourself · Optional class sharing</summary><div style={{padding:12}}><StatementContributionSection/></div></details>
      </div>
    </div>
  );
}
