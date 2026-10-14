import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { backendUrl } from "../services/aiClient";
import { styles } from "../styles";
import { liveSpeakSessionContext, isDifferentLiveSpeakSessionContext } from "../lib/liveSpeakSessionContext";
import GoetheExamSpeakingStage from "./GoetheExamSpeakingStage";
import GoetheExamSpeakingResults from "./GoetheExamSpeakingResults";

const MAX_RECORDING_SECONDS = 20;
const MAX_AUDIO_BYTES = 350000;
const shell = { ...styles.card, padding: "clamp(16px, 4vw, 28px)", borderRadius: 18 };
const friendlyTime = (value) => {
  const seconds = Math.max(0, Math.ceil(value / 1000));
  return String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0");
};
const toBase64 = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error("Unable to read the recording."));
  reader.onload = () => resolve(String(reader.result || "").split(",")[1] || "");
  reader.readAsDataURL(blob);
});
const voiceTypes = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm", "audio/ogg"];

export default function LiveSpeakPage({ embedded = false, initialLevel = "", practiceTopic = "", practiceSource = "", examTask = null }) {
  const { idToken, studentProfile } = useAuth();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [session, setSession] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [messages, setMessages] = useState([]);
  const [examFeedback, setExamFeedback] = useState("");
  const [examReport, setExamReport] = useState(null);
  const [finishedExamContext, setFinishedExamContext] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [feedbackBusy, setFeedbackBusy] = useState(false);
  const [pending, setPending] = useState(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [studentAudioUrl, setStudentAudioUrl] = useState("");
  const recordedUrlRef = useRef(null);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceReady, setVoiceReady] = useState(false);
  const recorderRef = useRef(null);
  const mediaRef = useRef(null);
  const recordingTicker = useRef(null);
  const recordingStarted = useRef(0);
  const voiceRef = useRef(null);
  const requestBusy = useRef(false);
  const mounted = useRef(true);
  const level = String(studentProfile?.level || "A2").toUpperCase();
  const contextualLevel = String(initialLevel || "").toUpperCase();
  const fixedLevel = embedded && /^(A1|A2|B1|B2|C1|C2)$/.test(contextualLevel) ? contextualLevel : "";
  const safeLevel = fixedLevel || selectedLevel || (/^(A1|A2|B1|B2|C1|C2)$/.test(level) ? level : "A2");
  const examinerEntry = embedded && practiceSource === "exam-speaking-practice";
  const Container = embedded ? "section" : "main";
  const requestedContext = { level: safeLevel, topic: practiceTopic, source: practiceSource };
  // Status also carries the saved context while the learner is yet to resume.
  const savedSession = session || details?.activeSession || null;
  const displayContext = liveSpeakSessionContext(savedSession, requestedContext);
  const hasChangedContext = isDifferentLiveSpeakSessionContext(savedSession, requestedContext);
  const examinerSession = session?.source === "exam-speaking-practice";
  const recordedAnswers = messages.filter(item => item.role === "user").map(item => item.text).filter(Boolean);
  const examStageProgress = session?.examProgress || {
    answered:recordedAnswers.length, maxAnswers:safeLevel==="A1"||safeLevel==="A2"?3:4,
    complete:recordedAnswers.length>=(safeLevel==="A1"||safeLevel==="A2"?3:4),
  };

  const api = useCallback(async (path, method = "GET", body = undefined) => {
    const headers = { Authorization: "Bearer " + idToken };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    const result = await fetch(backendUrl + path, {
      method, headers, body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await result.json().catch(() => ({}));
    if (!result.ok) {
      const err = new Error(data.error || "Live Speak is temporarily unavailable.");
      err.code = data.code;
      throw err;
    }
    return data;
  }, [idToken]);

  const refresh = useCallback(async () => {
    if (!idToken) { setLoading(false); return; }
    try {
      const info = await api("/live-speak/status");
      if (mounted.current) setDetails(info);
    } catch (err) {
      if (mounted.current) setErrorMessage(err.message);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [api, idToken]);

  useEffect(() => {
    mounted.current = true;
    refresh();
    return () => {
      mounted.current = false;
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      mediaRef.current?.getTracks().forEach(track => track.stop());
      if (recordingTicker.current) clearInterval(recordingTicker.current);
      voiceRef.current?.pause();
      if (recordedUrlRef.current) URL.revokeObjectURL(recordedUrlRef.current);
    };
  }, [refresh]);

  useEffect(() => {
    if (!session) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [session]);

  const stopAudio = () => {
    voiceRef.current?.pause();
    voiceRef.current = null;
    setVoiceReady(false);
    setAudioPlaying(false);
  };

  const playVoice = async (base64) => {
    stopAudio();
    const audio = new Audio("data:audio/mpeg;base64," + base64);
    voiceRef.current = audio;
    audio.onended = () => { if (voiceRef.current === audio) setAudioPlaying(false); };
    audio.onpause = () => { if (voiceRef.current === audio) setAudioPlaying(false); };
    setVoiceReady(true);
    try { await audio.play(); setAudioPlaying(!audio.paused); } catch (_err) {
      setNotice("Your device blocked automatic playback. Tap Play AI voice to hear the reply.");
    }
  };
  const [lastAudio, setLastAudio] = useState("");

  const sendTurn = async (currentSession, payload) => {
    if (requestBusy.current || !currentSession) return;
    requestBusy.current = true;
    setBusy(true);
    setErrorMessage("");
    try {
      const history = messages.slice(-6).map(msg => ({ role: msg.role, text: msg.text }));
      const result = await api("/live-speak/session/turn", "POST", {
        sessionId: currentSession.sessionId, history, ...payload,
      });
      if (!mounted.current) return;
      if (result.needsConfirmation) {
        setPending({pendingId:result.pendingId,sessionId:currentSession.sessionId,uncertain:Boolean(result.uncertain)});
        setRecognizedText(result.transcript);
        setNotice(result.uncertain ? "The recording was unclear. Please listen, correct the transcript, or record again." :
          "Check what the AI heard before the tutor responds.");
        return;
      }
      setMessages(old => [
        ...old,
        ...(result.transcript ? [{role:"user",text:result.transcript}] : []),
        {role:"assistant",text:result.reply},
      ]);
      setLastAudio(result.audioBase64);
      await playVoice(result.audioBase64);
    } catch (err) {
      if (mounted.current) setErrorMessage(err.message);
    } finally {
      requestBusy.current = false;
      if (mounted.current) setBusy(false);
    }
  };

  const confirmTranscript = async () => {
    if (!pending || !session || requestBusy.current || busy) return;
    const text = recognizedText.trim();
    if (text.length < 2 || text.length > 600) {
      setErrorMessage("Check the German transcript (2–600 characters) before continuing.");
      return;
    }
    requestBusy.current = true;
    setBusy(true);
    setErrorMessage("");
    try {
      const history = messages.slice(-6).map(msg => ({role:msg.role,text:msg.text}));
      const result = await api("/live-speak/session/confirm", "POST", {
        sessionId:session.sessionId,pendingId:pending.pendingId,transcript:text,history,
      });
      if (!mounted.current) return;
      setMessages(old => [...old,{role:"user",text:result.transcript},{role:"assistant",text:result.reply}]);
      if (result.examProgress) setSession(previous => previous?.sessionId === session.sessionId
        ? {...previous, examProgress:result.examProgress} : previous);
      setPending(null);
      setRecognizedText("");
      setLastAudio(result.audioBase64);
      setNotice("");
      await playVoice(result.audioBase64);
    } catch (err) {
      if (mounted.current) {
        setErrorMessage(err.message);
        if (err.code === "transcript_missing") setPending(null);
      }
    } finally {
      requestBusy.current = false;
      if (mounted.current) setBusy(false);
    }
  };

  const clearRecording = () => {
    if (recordedUrlRef.current) URL.revokeObjectURL(recordedUrlRef.current);
    recordedUrlRef.current = null;
    setStudentAudioUrl("");
  };
  const retryTranscript = () => {
    setPending(null);
    setRecognizedText("");
    setNotice("Record your answer again. The AI will not correct the previous transcript.");
    clearRecording();
  };

  const startSession = async () => {
    if (busy || session) return;
    setBusy(true);
    setErrorMessage("");
    try {
      // One-click practice. The server still verifies credits and global cost caps.
      if (details?.pilotAvailable && !details?.activeSession && Number(details.remaining) <= 0) {
        await api("/live-speak/pilot/claim", "POST", {});
      }
      const result = await api("/live-speak/session/start", "POST", {level:safeLevel, topic:practiceTopic, source:practiceSource, examTask:examinerEntry ? examTask : null});
      setSession(result);
      setExamFeedback("");
      setExamReport(null);
      setFinishedExamContext(null);
      setPending(null);
      clearRecording();
      if (!result.resumed) {
        setMessages([]);
        setLastAudio("");
      }
      setNow(Date.now());
      setBusy(false);
      if (!result.resumed) await sendTurn(result, {intro:true});
      else setNotice(
        isDifferentLiveSpeakSessionContext(result, {level:safeLevel,topic:practiceTopic,source:practiceSource})
          ? "Your existing voice session is still using its original topic and level. End it before starting a conversation on the newly selected topic."
          : "Your ongoing speaking session has resumed. Continue speaking German."
      );
      refresh();
    } catch (err) {
      setErrorMessage(err.message);
      setBusy(false);
      refresh();
    }
  };

  const endSession = async () => {
    if (!session) return;
    stopAudio();
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    const existing = session;
    setSession(null);
    setPending(null);
    clearRecording();
    setNotice(examinerSession ? "The examiner task was ended without feedback." : "Your conversation has ended. Review your corrections and phrases below.");
    try { await api("/live-speak/session/end", "POST", { sessionId: existing.sessionId }); }
    catch (_error) { /* The server expiry and quotas still apply. */ }
    refresh();
  };

  const finishExamTask = async () => {
    if (!examinerSession || !session || pending || busy || feedbackBusy || !recordedAnswers.length || recording) return;
    setFeedbackBusy(true);
    setErrorMessage("");
    try {
      const result = await api("/live-speak/session/exam-feedback", "POST", {
        sessionId: session.sessionId, answers: recordedAnswers,
      });
      if (!mounted.current) return;
      stopAudio();
      setExamFeedback(result.feedback);
      setExamReport(result.report || null);
      setFinishedExamContext({level:session.level || safeLevel,topic:session.topic || practiceTopic});
      setSession(null);
      setNotice("");
      await refresh();
    } catch (err) {
      if (mounted.current) setErrorMessage(err.message);
    } finally {
      if (mounted.current) setFeedbackBusy(false);
    }
  };

  const startRecording = async () => {
    if (!session || busy || recording || pending || now >= Date.parse(session.expiresAt)) return;
    setErrorMessage("");
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setErrorMessage("Audio recording is not supported on this browser. Use a recent Chrome or Safari version.");
      return;
    }
    try {
      stopAudio();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation:true, noiseSuppression:true, channelCount:1 },
      });
      mediaRef.current = stream;
      const mime = voiceTypes.find(type => MediaRecorder.isTypeSupported(type)) || "";
      const recorder = new MediaRecorder(stream, mime ? {mimeType:mime} : undefined);
      recorderRef.current = recorder;
      const chunks = [];
      recorder.ondataavailable = event => { if (event.data?.size) chunks.push(event.data); };
      recorder.onstop = async () => {
        if (!mounted.current) return;
        if (recordingTicker.current) clearInterval(recordingTicker.current);
        setRecording(false);
        setRecordingSeconds(0);
        stream.getTracks().forEach(track => track.stop());
        mediaRef.current = null;
        const seconds = (Date.now() - recordingStarted.current) / 1000;
        if (seconds < 1.5) { setErrorMessage("Speak for at least two seconds."); return; }
        const blob = new Blob(chunks, { type:recorder.mimeType || "audio/webm" });
        if (!blob.size || blob.size > MAX_AUDIO_BYTES) {
          setErrorMessage("Recording is too large. Try a shorter sentence.");
          return;
        }
        try {
          clearRecording();
          const playableUrl = URL.createObjectURL(blob);
          recordedUrlRef.current = playableUrl;
          setStudentAudioUrl(playableUrl);
          const audioBase64 = await toBase64(blob);
          await sendTurn(session, {intro:false, audioBase64, mimeType:blob.type});
        } catch (err) { setErrorMessage(err.message); }
      };
      recordingStarted.current = Date.now();
      recorder.start(500);
      setRecording(true);
      setRecordingSeconds(0);
      recordingTicker.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - recordingStarted.current) / 1000);
        setRecordingSeconds(elapsed);
        if ((elapsed >= MAX_RECORDING_SECONDS || Date.now() >= Date.parse(session.expiresAt)) &&
          recorder.state === "recording") recorder.stop();
      }, 300);
    } catch (err) {
      mediaRef.current?.getTracks().forEach(track => track.stop());
      setErrorMessage(err?.message || "Microphone permission was denied.");
    }
  };
  const stopRecording = () => { if (recorderRef.current?.state === "recording") recorderRef.current.stop(); };

  const timeRemaining = session ? Math.max(0, Date.parse(session.expiresAt) - now) : 0;
  const expired = Boolean(session) && timeRemaining <= 0;
  const sessionsAvailable = (Number(details?.remaining) > 0 || Boolean(details?.activeSession)) && !details?.capReached;
  return (
    <Container data-live-speak-context={embedded ? "embedded-practice" : "standalone"}
      style={embedded
        ? { display:"grid", gap:12, maxWidth:"100%", minWidth:0, padding:"8px 0" }
        : { ...styles.container, maxWidth:940, paddingBottom:65, display:"grid", gap:16 }}>
      {!embedded ? <Link to="/" style={{ color:"#1d4ed8", fontWeight:700, textDecoration:"none" }}>← Back to Falowen</Link> : null}
      {!embedded ? (
        <header style={{...shell,background:"linear-gradient(135deg,#132f67,#145b8f)",color:"#fff"}}>
          <h1 style={{margin:0,color:"#fff",fontSize:27}}>German speaking practice</h1>
        </header>
      ) : null}

      {loading ? <p role="status" style={{margin:0,color:"#64748b",fontSize:13}}>Preparing speaking practice…</p> : null}
      {!loading && details && !details.enabled ? (
        <p role="status" style={{margin:0,color:"#64748b"}}>Speaking practice is temporarily unavailable.</p>
      ) : null}

      {details?.enabled && !session && !(examinerEntry && examFeedback) ? (
        <div style={{display:"grid",gap:9,minWidth:0}}>
          {hasChangedContext ? (
            <p role="status" style={{margin:0,padding:"9px 11px",border:"1px solid #fbbf24",borderRadius:9,background:"#fffbeb",color:"#92400e",fontSize:13}}>
              Current task: {displayContext.topic || "the previous topic"} ({displayContext.level}).
              Finish this session to change topics.
            </p>
          ) : null}
          {!fixedLevel ? <label style={{display:"grid",gap:5,maxWidth:215,fontSize:13,color:"#334155"}}>
            Level
            <select value={safeLevel} onChange={e=>setSelectedLevel(e.target.value)}
              style={{padding:"10px 12px",border:"1px solid #cbd5e1",borderRadius:10,background:"#fff"}}>
              {["A1","A2","B1","B2","C1","C2"].map(option=><option key={option} value={option}>{option}</option>)}
            </select>
          </label> : null}
          {details.capReached ? (
            <p role="status" style={{margin:0,color:"#64748b",fontSize:13}}>Speaking practice is temporarily unavailable.</p>
          ) : (sessionsAvailable || details.pilotAvailable) ? (
            <div>
              <button type="button" style={styles.primaryButton} onClick={startSession} disabled={busy}>
                {busy ? "Starting…" : details.activeSession ? "Resume speaking" : examinerEntry ? "Start AI Examiner" : "Start speaking"}
              </button>
            </div>
          ) : (
            <p role="status" style={{margin:0,color:"#64748b",fontSize:13}}>
              Speaking practice is currently unavailable for this account.
            </p>
          )}
        </div>
      ) : null}

      {session && examinerSession ? (
        <GoetheExamSpeakingStage
          session={session} level={displayContext.level} topic={displayContext.topic}
          messages={messages} progress={examStageProgress} time={friendlyTime(timeRemaining)}
          recording={recording} recordingSeconds={recordingSeconds} busy={busy}
          audioPlaying={audioPlaying} expired={expired} feedbackBusy={feedbackBusy}
          lastAudio={lastAudio} onReplay={()=>playVoice(lastAudio)}
          pending={pending} recognizedText={recognizedText} onTextChange={setRecognizedText}
          uncertain={Boolean(pending?.uncertain)} studentAudioUrl={studentAudioUrl}
          onConfirm={confirmTranscript} onRetry={retryTranscript}
          onRecord={startRecording} onStopRecording={stopRecording}
          onFinish={finishExamTask} onEnd={endSession} errorMessage={errorMessage}
        />
      ) : session ? (
        <section style={{ ...shell, display:"grid", gap:14 }}>
          <header style={{display:"flex",gap:12,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>
            <div>
              <h2 style={{margin:0,fontSize:20}}>{examinerSession ? "AI Examiner" : "Speaking practice"} · {displayContext.level}</h2>
              {hasChangedContext ? <p role="status" style={{margin:"5px 0",color:"#92400e",fontSize:13}}>
                Current task: {displayContext.topic || "the previous topic"}. Finish it to change topics.
              </p> : null}
            </div>
            <strong style={{fontSize:24,color:expired?"#b91c1c":"#145b8f"}} aria-live="off">{friendlyTime(timeRemaining)}</strong>
          </header>
          <div aria-live="polite" style={{display:"grid",gap:10,maxHeight:430,overflowY:"auto"}}>
            {messages.map((message,i) => (
              <div key={i} style={{background:message.role==="assistant"?"#eff6ff":"#f0fdf4",borderRadius:14,padding:13,marginLeft:message.role==="user"?30:0,marginRight:message.role==="assistant"?30:0}}>
                <strong>{message.role==="assistant"?(examinerSession?"AI Examiner":"AI German tutor"):"You"}</strong>
                <p style={{margin:"7px 0 0",lineHeight:1.65}} lang="de">{message.text}</p>
              </div>
            ))}
            {busy ? <p>{pending ? "Preparing the next examiner/tutor response…" : "Processing your German recording…"}</p> : null}
          </div>
          {lastAudio && voiceReady ? <button type="button" style={styles.secondaryButton} onClick={()=>playVoice(lastAudio)}>▶ Play AI voice again</button> : null}
          {pending ? <div role="group" aria-label="Review German speech recognition"
            style={{background:"#fff7ed",border:"1px solid #fdba74",padding:14,borderRadius:12,display:"grid",gap:10}}>
            <strong>Did Falowen hear you correctly?</strong>
            {pending.uncertain ? <p style={{margin:0,fontSize:13}}>Audio unclear—check the words or record again.</p> : null}
            <label style={{display:"grid",gap:5}}>
              <span>What I said (you can edit this)</span>
              <textarea lang="de" rows={3} value={recognizedText} maxLength={600}
                onChange={event=>setRecognizedText(event.target.value)}
                style={{border:"1px solid #cbd5e1",borderRadius:10,padding:10,fontSize:16}}/>
            </label>
            {studentAudioUrl ? <audio controls src={studentAudioUrl} aria-label="Listen to your own recording" style={{width:"100%"}} /> : null}
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button type="button" style={styles.primaryButton}
                disabled={busy || expired || recognizedText.trim().length < 2}
                onClick={confirmTranscript}>Confirm answer</button>
              <button type="button" style={styles.secondaryButton}
                disabled={busy} onClick={retryTranscript}>Record again</button>
            </div>
          </div> : null}
          {expired ? <p role="status">Your five-minute session has ended. Your corrections remain visible here.</p> : null}
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button type="button" style={styles.primaryButton}
              onClick={recording?stopRecording:startRecording}
              disabled={busy || expired || Boolean(pending)}>
              {recording ? "■ Stop & send (" + recordingSeconds + "s)" : "🎤 Speak German"}
            </button>
            {examinerSession ? (
              <button type="button" style={styles.secondaryButton} onClick={finishExamTask}
                disabled={feedbackBusy || busy || recording || Boolean(pending) || !recordedAnswers.length}>
                {feedbackBusy ? "Preparing feedback…" : "Finish task & see feedback"}
              </button>
            ) : null}
            <button type="button" style={styles.secondaryButton} onClick={endSession} disabled={feedbackBusy}>
              {examinerSession ? "End without feedback" : "End session"}
            </button>
          </div>

        </section>
      ) : null}

      {examFeedback ? (
        <GoetheExamSpeakingResults report={examReport} feedback={examFeedback}
          level={finishedExamContext?.level || safeLevel}
          task={finishedExamContext?.topic || practiceTopic}
          onNewTask={()=>{
            setExamFeedback("");
            setExamReport(null);
            setFinishedExamContext(null);
            setMessages([]);
            setLastAudio("");
          }} />
      ) : null}
      {notice ? <p role="status" style={{...shell,background:"#eff6ff",margin:0}}>{notice}</p> : null}
      {!examinerSession && errorMessage ? <p role="alert" style={{...shell,background:"#fef2f2",color:"#991b1b",margin:0}}>{errorMessage}</p> : null}

    </Container>
  );
}
