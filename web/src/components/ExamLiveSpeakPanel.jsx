import React from "react";
import LiveSpeakPage from "./LiveSpeakPage";

// Exam Room voice practice is ungraded. Keep timed mock exam controls separate.
export default function ExamLiveSpeakPanel({
  level, teil, onTeilChange, lockedTeil = "", selectedQuestionId,
  onQuestionChange, questions = [], question = null,
  formatQuestion, compact = false,
}) {
  const selectedTopic = question?.topicPrompt || question?.question || "Goethe speaking exam practice";
  return (
    <section aria-label="Live German speaking conversation" style={{background:"#f8fafc",padding:compact?12:20,display:"grid",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{display:"grid",gap:4}}>
          <p style={{margin:0,fontSize:12,color:"#1d4ed8",fontWeight:800,letterSpacing:".04em",textTransform:"uppercase"}}>
            AI German speaking partner
          </p>
          <h2 style={{margin:0,fontSize:compact?21:24,color:"#0f172a"}}>Speak naturally. Learn as you talk.</h2>
          <p style={{margin:0,maxWidth:620,fontSize:13,lineHeight:1.6,color:"#475569"}}>
            Choose a Goethe topic, listen to the AI and reply aloud.
            Review what the microphone heard before getting a short correction and another German question.
          </p>
        </div>
        <span style={{fontSize:12,fontWeight:700,color:"#1e40af",background:"#dbeafe",padding:"7px 11px",borderRadius:999}}>
          {level} · Free voice pilot
        </span>
      </div>
      <div style={{
        background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,
        padding:compact?12:15,display:"grid",gap:11,
      }}>
        <div style={{fontSize:14,fontWeight:750,color:"#0f172a"}}>Select your speaking topic</div>
        <div style={{display:"grid",gridTemplateColumns:compact?"1fr":"minmax(115px, 1fr) minmax(0, 3fr)",gap:12}}>
          <label style={{display:"grid",gap:5,color:"#334155",fontSize:12,fontWeight:650}}>
            Exam part
            {lockedTeil ? (
              <span style={{border:"1px solid #cbd5e1",borderRadius:9,padding:"11px",background:"#f8fafc"}}>Teil {lockedTeil}</span>
            ) : (
              <select aria-label="Live conversation exam part" value={teil} onChange={e=>onTeilChange(e.target.value)}
                style={{padding:"10px 11px",minWidth:0,borderRadius:9,border:"1px solid #cbd5e1",background:"#fff"}}>
                <option value="all">All parts</option>
                <option value="1">Teil 1</option>
                <option value="2">Teil 2</option>
                <option value="3">Teil 3</option>
              </select>
            )}
          </label>
          <label style={{display:"grid",gap:5,color:"#334155",fontSize:12,fontWeight:650,minWidth:0}}>
            Goethe speaking prompt
            <select aria-label="Live conversation speaking prompt" value={selectedQuestionId}
              onChange={e=>onQuestionChange(e.target.value)} disabled={!questions.length}
              style={{padding:"10px 11px",minWidth:0,width:"100%",borderRadius:9,border:"1px solid #cbd5e1",background:"#fff"}}>
              {questions.length ? questions.map(item=>(
                <option key={item.id} value={item.id}>{formatQuestion(item)}</option>
              )) : <option value="">No prompts for this part</option>}
            </select>
          </label>
        </div>
        <p style={{fontSize:12,color:"#64748b",margin:0,lineHeight:1.5}}>
          Changing the topic prepares your next session. If a conversation is already active,
          it continues with its original topic until you end it.
        </p>
      </div>
      <LiveSpeakPage embedded initialLevel={level}
        practiceTopic={selectedTopic} practiceSource="exam-speaking-practice" />
      <p style={{fontSize:12,lineHeight:1.5,color:"#64748b",margin:0}}>
        This is optional conversational practice, not a timed or graded Goethe mock exam.
        Your Exam Coach results and progress are not changed.
      </p>
    </section>
  );
}
