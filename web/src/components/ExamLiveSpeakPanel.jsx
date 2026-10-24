import React, {useCallback,useState} from "react";
import LiveSpeakPage from "./LiveSpeakPage";

// Exam Room voice practice is ungraded. Keep timed mock exam controls separate.
export default function ExamLiveSpeakPanel({
  level, teil, onTeilChange, lockedTeil = "", selectedQuestionId,
  onQuestionChange, questions = [], question = null,
  formatQuestion, compact = false, onActivityChange,
}) {
  const [sessionActive,setSessionActive]=useState(false);
  const [examMode,setExamMode]=useState("guided");
  const handleActivity=useCallback(value=>{setSessionActive(value);onActivityChange?.(value);},[onActivityChange]);
  const supported=["A1","A2","B1","B2","C1","C2"].includes(level);
  const selectedTopic = question?.topicPrompt || question?.text || "Goethe speaking exam practice";
  const examinerTask = question ? {
    id: question.id,
    teil: question.teilLabel || question.teilId || "",
    prompt: question.topicPrompt || question.text || "",
    keywords: question.keywordSubtopic || "",
    hint: question.hint || "",
  } : null;
  return (
    <section aria-label="Goethe AI Examiner speaking practice" style={{background:"#f8fafc",padding:compact?12:20,display:"grid",gap:16}}>
      <header style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}>
        <h2 style={{margin:0,fontSize:compact?20:23,color:"#0f172a"}}>Goethe AI Examiner</h2>
        <strong style={{fontSize:13,color:"#1d4ed8"}}>{level}</strong>
      </header>
      <div style={{
        background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,
        padding:compact?12:15,display:"grid",gap:11,
      }}>
        <div style={{fontSize:14,fontWeight:750,color:"#0f172a"}}>Sprechen – Select a task</div>
        <div style={{display:"grid",gridTemplateColumns:compact?"1fr":"minmax(115px, 1fr) minmax(0, 3fr)",gap:12}}>
          <label style={{display:"grid",gap:5,color:"#334155",fontSize:12,fontWeight:650}}>
            Exam part
            {lockedTeil ? (
              <span style={{border:"1px solid #cbd5e1",borderRadius:9,padding:"11px",background:"#f8fafc"}}>Teil {lockedTeil}</span>
            ) : (
              <select disabled={sessionActive} aria-label="Live conversation exam part" value={teil} onChange={e=>onTeilChange(e.target.value)}
                style={{padding:"10px 11px",minWidth:0,borderRadius:9,border:"1px solid #cbd5e1",background:"#fff"}}>
                <option value="all">All parts</option>
                <option value="1">Teil 1</option>
                <option value="2">Teil 2</option>
                {!["B2","C1","C2"].includes(level) ? <option value="3">Teil 3</option> : null}
              </select>
            )}
          </label>
          <label style={{display:"grid",gap:5,color:"#334155",fontSize:12,fontWeight:650,minWidth:0}}>
            Goethe speaking prompt
            <select aria-label="Live conversation speaking prompt" value={selectedQuestionId}
              onChange={e=>onQuestionChange(e.target.value)} disabled={sessionActive || !questions.length}
              style={{padding:"10px 11px",minWidth:0,width:"100%",borderRadius:9,border:"1px solid #cbd5e1",background:"#fff"}}>
              {questions.length ? questions.map(item=>(
                <option key={item.id} value={item.id}>{formatQuestion(item)}</option>
              )) : <option value="">No prompts for this part</option>}
            </select>
          </label>
        </div>

      </div>
      {supported ? <div role="group" aria-label="Examiner practice style" style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        <button type="button" disabled={sessionActive} aria-pressed={examMode === "guided"} onClick={()=>setExamMode("guided")}>Guided practice</button>
        <button type="button" disabled={sessionActive} aria-pressed={examMode === "simulation"} onClick={()=>setExamMode("simulation")}>Exam simulation</button>
      </div> : null}
      {supported ? <small>Practise the selected exam part. Feedback comes after you finish.</small> : null}
      {examinerTask ? (
        <LiveSpeakPage embedded initialLevel={level}
          practiceTopic={selectedTopic} practiceSource="exam-speaking-practice"
          examTask={examinerTask} examMode={examMode} onActivityChange={handleActivity} />
      ) : <p role="status">Select a speaking task to start your AI Examiner.</p>}

    </section>
  );
}
