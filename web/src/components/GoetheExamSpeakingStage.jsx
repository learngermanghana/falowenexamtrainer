import React from "react";

const subtle = { color:"#64748b",fontSize:12,margin:0 };
const action = {
  border:"1px solid #cbd5e1",borderRadius:10,background:"#fff",
  color:"#1e293b",fontWeight:650,padding:"10px 14px",cursor:"pointer",
};
const promptCard = {border:"1px solid #dbeafe",background:"#f0f6ff",borderRadius:16,padding:"clamp(15px, 4vw, 23px)"};

// A focused examiner viewport. LiveSpeakPage owns recording, review and API calls.
export default function GoetheExamSpeakingStage({
  session, level, topic, messages = [], progress, time,
  recording, recordingSeconds, busy, audioPlaying,
  lastAudio, onReplay, pending, recognizedText, onTextChange,
  uncertain, studentAudioUrl, onConfirm, onRetry,
  onRecord, onStopRecording, onFinish, onEnd, feedbackBusy, expired,
  errorMessage,
}) {
  const answered = Number(progress?.answered) || 0;
  const total = Number(progress?.maxAnswers) || 3;
  const complete = Boolean(progress?.complete);
  const lastExaminer = [...messages].reverse().find(message => message.role === "assistant");
  const currentQuestion = lastExaminer?.text || topic || session?.examTask?.prompt || "";
  const transcript = messages.filter(message => message.role === "user");
  const examPart = session?.examTask?.teil || "Sprechen";
  const stageText = recording ? "Recording your answer" :
    pending ? "Check your recorded German" :
    busy || feedbackBusy ? "Processing your answer" :
    audioPlaying ? "Examiner speaking" :
    complete ? "Task complete · View your feedback" :
    "Your turn to speak";

  return (
    <section aria-label="Goethe AI speaking task" data-exam-speaking-stage="true"
      style={{display:"grid",gap:15,minWidth:0}}>
      <header style={{display:"grid",gap:11}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <div style={{display:"grid",gap:3}}>
            <span style={{fontSize:11,fontWeight:800,letterSpacing:".04em",color:"#1d4ed8",textTransform:"uppercase"}}>
              {level} · {examPart} · Speaking practice
            </span>
            <h2 style={{fontSize:20,margin:0,color:"#0f172a"}}>{topic || "Goethe speaking task"}</h2>
          </div>
          <time style={{fontSize:21,fontWeight:800,color:expired?"#b91c1c":"#1e40af",fontVariantNumeric:"tabular-nums"}} aria-label="Time remaining">{time}</time>
        </div>
        <div aria-label={"Spoken answers " + answered + " of " + total} style={{display:"flex",gap:6,alignItems:"center"}}>
          {Array.from({length:total},(_,index)=>(
            <span key={index} style={{
              height:6,flex:1,borderRadius:99,background:index<answered?"#2563eb":"#dbeafe",
            }} />
          ))}
        </div>
        <p style={{...subtle}}>Answer {Math.min(answered+1,total)} of {total} · Feedback when you finish</p>
      </header>

      <div style={promptCard}>
        <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}>
          <span aria-hidden="true" style={{fontSize:20}}>🔊</span>
          <strong style={{fontSize:14,color:"#1e40af"}}>AI Examiner</strong>
        </div>
        <p lang="de" aria-live="polite" style={{
          margin:0,color:"#0f172a",fontWeight:600,fontSize:"clamp(17px, 3.7vw, 21px)",lineHeight:1.65,
        }}>
          {currentQuestion || "Die mündliche Prüfung beginnt gleich."}
        </p>
        {lastAudio ? (
          <button type="button" style={{...action,marginTop:14,background:"transparent",borderColor:"#93c5fd"}}
            disabled={busy || recording} onClick={onReplay}>▶ Listen again</button>
        ) : null}
      </div>

      {pending ? (
        <div role="group" aria-label="Review German speech recognition"
          style={{display:"grid",gap:10,padding:15,background:"#fff7ed",border:"1px solid #fdba74",borderRadius:14}}>
          <strong>Is this what you said?</strong>
          {uncertain ? <p style={subtle}>The recording was unclear. You can listen, edit or try again.</p> : null}
          <textarea lang="de" rows={3} aria-label="Review your spoken German"
            value={recognizedText} maxLength={600} onChange={event=>onTextChange(event.target.value)}
            style={{fontSize:16,boxSizing:"border-box",width:"100%",padding:12,borderRadius:10,border:"1px solid #cbd5e1"}}/>
          {studentAudioUrl ? <audio src={studentAudioUrl} controls aria-label="Listen to your own recording" style={{width:"100%"}}/> : null}
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button type="button" style={{...action,background:"#2563eb",color:"#fff",borderColor:"#2563eb"}}
              onClick={onConfirm} disabled={busy || expired || recognizedText.trim().length<2}>Confirm answer</button>
            <button type="button" style={action} onClick={onRetry} disabled={busy}>Record again</button>
          </div>
        </div>
      ) : (
        <div style={{display:"grid",justifyItems:"center",gap:10,padding:"16px 5px"}}>
          <p role="status" style={{margin:0,color:"#334155",fontWeight:700,textAlign:"center"}}>{stageText}</p>
          <button type="button" aria-label={recording?"Stop recording":"Record your answer"}
            onClick={recording?onStopRecording:onRecord}
            disabled={busy || feedbackBusy || expired || complete}
            style={{
              width:76,height:76,borderRadius:"50%",display:"grid",placeItems:"center",
              fontSize:29,color:"#fff",background:recording?"#b91c1c":"#2563eb",
              border:"5px solid "+(recording?"#fee2e2":"#dbeafe"),
              cursor:busy||expired||complete?"not-allowed":"pointer",
              opacity:busy||expired||complete?0.55:1,
            }}>{recording?"■":"🎤"}</button>
          <p style={subtle}>{recording ? recordingSeconds + "s · Tap to stop" :
            complete ? "You have answered all questions in this task." :
            expired ? "Time is up. Finish the task to review your answers." :
            "Tap the microphone, speak in German, then stop."}</p>
        </div>
      )}

      {busy || feedbackBusy ? <p role="status" style={{...subtle,textAlign:"center"}}>Preparing your response…</p> : null}
      {errorMessage ? <p role="alert" style={{margin:0,padding:11,borderRadius:10,background:"#fef2f2",color:"#991b1b"}}>{errorMessage}</p> : null}

      {transcript.length ? (
        <details style={{border:"1px solid #e2e8f0",borderRadius:12,padding:12}}>
          <summary style={{cursor:"pointer",fontWeight:650,fontSize:13}}>Review your answers ({transcript.length})</summary>
          <div style={{display:"grid",gap:9,paddingTop:10}}>
            {transcript.map((item,index)=>(
              <p key={index} style={{padding:10,margin:0,background:"#f8fafc",borderRadius:8,fontSize:13,lineHeight:1.6}} lang="de">
                <strong>Answer {index+1}:</strong> {item.text}
              </p>
            ))}
          </div>
        </details>
      ) : null}

      <div style={{display:"flex",flexWrap:"wrap",gap:9,alignItems:"center"}}>
        <button type="button" style={{...action,background:"#0f376a",color:"#fff",borderColor:"#0f376a"}}
          onClick={onFinish} disabled={busy||recording||Boolean(pending)||feedbackBusy||!transcript.length}>
          {feedbackBusy?"Preparing feedback…":"Finish task & view feedback"}
        </button>
        <button type="button" style={action} onClick={onEnd} disabled={busy||feedbackBusy||recording}>
          End task
        </button>
      </div>
    </section>
  );
}
