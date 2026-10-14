import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { backendUrl } from "../services/aiClient";
import GoetheExamTaskCard from "./GoetheExamTaskCard";
import { examinerTaskPreview } from "../lib/examinerTaskPreview";
import { styles } from "../styles";
import { liveSpeakSessionContext, isDifferentLiveSpeakSessionContext } from "../lib/liveSpeakSessionContext";

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

export default function LiveSpeakPage({ embedded = false, initialLevel = "", practiceTopic = "", practiceSource = "", examTask = null, examMode = "guided", onActivityChange }) {
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
  const [feedbackBusy, setFeedbackBusy] = useState(false);
  const [pending, setPending] = useState(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [recognitionCorrection,setRecognitionCorrection]=useState(false);
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
  const recordingStarting = useRef(false);
  const [localRetry, setLocalRetry] = useState(false);
  const mounted = useRef(true);
  const level = String(studentProfile?.level || "A2").toUpperCase();
  const contextualLevel = String(initialLevel || "").toUpperCase();
  const fixedLevel = embedded && /^(A1|A2|B1|B2|C1|C2)$/.test(contextualLevel) ? contextualLevel : "";
  const safeLevel = fixedLevel || selectedLevel || (/^(A1|A2|B1|B2|C1|C2)$/.test(level) ? level : "A2");
  const examinerEntry = embedded && practiceSource === "exam-speaking-practice";
  const Container = embedded ? "section" : "main";
  const supportedExaminer=examinerEntry && ["A1","A2","B1"].includes(safeLevel);
  const taskPreview=supportedExaminer ? examinerTaskPreview(safeLevel,examTask,examMode) : null;
  const simulation=session?.examFlow?.mode === "simulation";
  const requestedContext = { level: safeLevel, topic: practiceTopic, source: practiceSource, examTask, examMode };
  // Status also carries the saved context while the learner is yet to resume.
  const savedSession = session || details?.activeSession || null;
  const displayContext = liveSpeakSessionContext(savedSession, requestedContext);
  const hasChangedContext = isDifferentLiveSpeakSessionContext(savedSession, requestedContext);
  const examinerSession = session?.source === "exam-speaking-practice";
  const taskReady = examinerSession && (session.taskReady || Number(session.answeredTurns) >= (session.answerLimit || 2));
  const recordedAnswers = messages.filter(item => item.role === "user").map(item => item.text).filter(Boolean);

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
      if (mounted.current) {
        setDetails(info);
        if (examinerEntry && info.lastExamResult) {
          setExamFeedback(info.lastExamResult.feedback || "");
          if (!info.activeSession) setMessages(info.lastExamResult.messages || []);
        }
      }
    } catch (err) {
      if (mounted.current) setErrorMessage(err.message);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [api, idToken, examinerEntry]);

  useEffect(() => {
    mounted.current = true;
    refresh();
    return () => {
      mounted.current = false;
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.onstop = null;
        recorderRef.current.stop();
      }
      mediaRef.current?.getTracks().forEach(track => track.stop());
      if (recordingTicker.current) clearInterval(recordingTicker.current);
      voiceRef.current?.pause();
      if (recordedUrlRef.current) URL.revokeObjectURL(recordedUrlRef.current);
    };
  }, [refresh]);

  useEffect(()=>{onActivityChange?.(Boolean(session) || recording || busy);},[onActivityChange,session,recording,busy]);
  useEffect(()=>()=>onActivityChange?.(false),[onActivityChange]);

  useEffect(() => {
    if (!session) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [session]);

  const stopAudio = () => {
    voiceRef.current?.pause();
    voiceRef.current = null;
    setVoiceReady(false);
  };

  const playVoice = async (base64) => {
    stopAudio();
    if (!base64) return;
    const audio = new Audio("data:audio/mpeg;base64," + base64);
    voiceRef.current = audio;
    setVoiceReady(true);
    try { await audio.play(); } catch (_err) {
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
        setPending({pendingId:result.pendingId,sessionId:currentSession.sessionId,transcript:result.transcript,uncertain:Boolean(result.uncertain)});
        setRecognizedText(result.transcript);
        setRecognitionCorrection(false);
        setNotice(result.uncertain ? "The recording was unclear. Please listen, correct the transcript, or record again." :
          "Check what the AI heard before the tutor responds.");
        return;
      }
      setMessages(old => [
        ...old,
        ...(result.transcript ? [{role:"user",text:result.transcript}] : []),
        {role:"assistant",speaker:result.speaker || result.examFlow?.step?.role || "examiner",text:result.reply},
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
    if (text.length < 2 || text.length > (session.maxTranscriptChars || 600)) {
      setErrorMessage("Check the German transcript before continuing.");
      return;
    }
    requestBusy.current = true;
    setBusy(true);
    setErrorMessage("");
    try {
      const history = messages.slice(-6).map(msg => ({role:msg.role,text:msg.text}));
      const result = await api("/live-speak/session/confirm", "POST", {
        sessionId:session.sessionId,pendingId:pending.pendingId,transcript:text,history,recognitionCorrection,
      });
      if (!mounted.current) return;
      setMessages(old => [...old,{role:"user",text:result.transcript},{role:"assistant",speaker:result.speaker || result.examFlow?.step?.role || "examiner",text:result.reply}]);
      setSession(old => old ? {...old, answeredTurns:(Number(old.answeredTurns) || 0)+1, taskReady:Boolean(result.taskReady), maxRecordingSeconds:result.maxRecordingSeconds || 20,maxTranscriptChars:result.maxTranscriptChars || old.maxTranscriptChars,...(result.examFlow ? {examFlow:result.examFlow} : {})} : old);
      setPending(null);
      setRecognizedText("");
      setLastAudio(result.audioBase64);
      setNotice("");
      await playVoice(result.audioBase64);
    } catch (err) {
      if (mounted.current) {
        setErrorMessage(err.message);
        if (err.code === "transcript_missing") setPending(null);
        if (examinerSession) {
          // A response can be lost after the answer has already been saved.
          try {
            const info = await api("/live-speak/status");
            const restored = info.activeSession;
            if (mounted.current && restored?.sessionId === session.sessionId) {
              setSession(restored);
              setMessages(restored.messages || []);
              setPending(restored.pending || null);
              setRecognizedText(restored.pending?.transcript || "");
            }
          } catch (_restoreError) { /* Resume can recover saved text later. */ }
        }
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
    if (busy || session || recording || recordingStarting.current) return;
    if (supportedExaminer && !details?.activeSession && details?.examinerFlowVersion !== 1) {
      setErrorMessage("Examiner practice is temporarily unavailable. Please try again shortly.");
      return;
    }
    setBusy(true);
    setErrorMessage("");
    try {
      // One-click practice. The server still verifies credits and global cost caps.
      if (details?.pilotAvailable && !details?.activeSession && Number(details.remaining) <= 0) {
        await api("/live-speak/pilot/claim", "POST", {});
      }
      const result = await api("/live-speak/session/start", "POST", {level:safeLevel, topic:practiceTopic, source:practiceSource, examTask:examinerEntry ? examTask : null,...(supportedExaminer ? {examinerFlowVersion:1,examMode} : {})});
      setSession(result);
      setLocalRetry(false);
      setExamFeedback("");
      setRecognitionCorrection(false);
      setPending(result.pending || null);
      setRecognizedText(result.pending?.transcript || "");
      if (result.resumed) {
        setMessages(result.messages || []);
        setLastAudio("");
      }
      clearRecording();
      if (!result.resumed) {
        setMessages([]);
        setLastAudio("");
      }
      setNow(Date.now());
      setBusy(false);
      if (!result.resumed) await sendTurn(result, {intro:true});
      else setNotice(
        isDifferentLiveSpeakSessionContext(result, {level:safeLevel,topic:practiceTopic,source:practiceSource,examTask,examMode})
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
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.onstop = null;
      recorderRef.current.stop();
    }
    mediaRef.current?.getTracks().forEach(track => track.stop());
    if (recordingTicker.current) clearInterval(recordingTicker.current);
    setRecording(false);
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
    if (!examinerSession || !session || pending || busy || feedbackBusy || !recordedAnswers.length || recording || requestBusy.current) return;
    requestBusy.current = true;
    setFeedbackBusy(true);
    setErrorMessage("");
    try {
      const result = await api("/live-speak/session/exam-feedback", "POST", {
        sessionId: session.sessionId,
      });
      if (!mounted.current) return;
      stopAudio();
      setExamFeedback(result.feedback);
      setSession(null);
      setNotice("Exam practice complete. Feedback is based on your reviewed transcripts, not a pronunciation assessment.");
      await refresh();
    } catch (err) {
      if (mounted.current) setErrorMessage(err.message);
    } finally {
      requestBusy.current = false;
      if (mounted.current) setFeedbackBusy(false);
    }
  };

  const startRecording = async (localOnly = false) => {
    if (recordingStarting.current || busy || feedbackBusy || recording || pending) return;
    if (!localOnly && (!session || taskReady || now >= Date.parse(session.expiresAt))) return;
    if (localOnly && !examFeedback) return;
    setErrorMessage("");
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setErrorMessage("Audio recording is not supported on this browser. Use a recent Chrome or Safari version.");
      return;
    }
    recordingStarting.current = true;
    try {
      stopAudio();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation:true, noiseSuppression:true, channelCount:1 },
      });
      if (!mounted.current) { stream.getTracks().forEach(track => track.stop()); return; }
      mediaRef.current = stream;
      const mime = voiceTypes.find(type => MediaRecorder.isTypeSupported(type)) || "";
      const recorder = new MediaRecorder(stream, {audioBitsPerSecond:24000, ...(mime ? {mimeType:mime} : {})});
      recorderRef.current = recorder;
      const chunks = [];
      let recordedBytes = 0;
      recorder.ondataavailable = event => {
        if (!event.data?.size) return;
        chunks.push(event.data);
        recordedBytes += event.data.size;
        // Browsers may ignore the requested bitrate. Leave container/final-chunk
        // headroom and send the answer already recorded instead of discarding it.
        if (recordedBytes >= (localOnly ? MAX_AUDIO_BYTES : session.maxAudioBytes || MAX_AUDIO_BYTES) - 32768 && recorder.state === "recording") {
          setNotice("Recording stopped to keep your answer ready to send.");
          recorder.stop();
        }
      };
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
        if (!blob.size || blob.size > (localOnly ? MAX_AUDIO_BYTES : session.maxAudioBytes || MAX_AUDIO_BYTES)) {
          setErrorMessage("Recording is too large. Try a shorter sentence.");
          return;
        }
        try {
          clearRecording();
          const playableUrl = URL.createObjectURL(blob);
          recordedUrlRef.current = playableUrl;
          setStudentAudioUrl(playableUrl);
          if (localOnly) { setLocalRetry(true); return; }
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
        if ((elapsed >= (localOnly ? MAX_RECORDING_SECONDS : session.maxRecordingSeconds || MAX_RECORDING_SECONDS) || (!localOnly && Date.now() >= Date.parse(session.expiresAt))) &&
          recorder.state === "recording") recorder.stop();
      }, 300);
    } catch (err) {
      mediaRef.current?.getTracks().forEach(track => track.stop());
      setErrorMessage(err?.message || "Microphone permission was denied.");
    } finally {
      recordingStarting.current = false;
    }
  };
  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

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

      {supportedExaminer && !examFeedback ? <GoetheExamTaskCard flow={session?.examFlow || taskPreview} topic={session?.examTask?.prompt || examTask?.prompt} active={Boolean(session)}/> : null}
      {examinerEntry && !supportedExaminer && !session && !examFeedback ? (
        <div style={{padding:12,background:"#eff6ff",borderRadius:10,display:"grid",gap:6}}>
          <strong>Prepare → Answer → Follow-up → Feedback</strong>
          <p style={{margin:0,lineHeight:1.5,fontSize:14}} lang="de">{examTask?.prompt}</p>
          {examTask?.keywords ? <p style={{margin:0,fontSize:13}}>{examTask.keywords}</p> : null}
          {examTask?.hint ? <p style={{margin:0,fontSize:13}}>{examTask.hint}</p> : null}
          <small>Think about your answer first. You’ll answer the task and one follow-up before reviewing feedback.</small>
        </div>
      ) : null}
      {details?.enabled && !session ? (
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
          {details.capReached && !details.activeSession ? (
            <p role="status" style={{margin:0,color:"#64748b",fontSize:13}}>Speaking practice is temporarily unavailable.</p>
          ) : (details.activeSession || sessionsAvailable || details.pilotAvailable) ? (
            <div>
              <button type="button" style={styles.primaryButton} onClick={startSession} disabled={busy || recording}>
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

      {session ? (
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
          {examinerSession ? <p role="status" style={{margin:0,fontSize:13}}>
            {taskReady ? "Answers saved. You’re ready for feedback." : session.examFlow ? "Follow the task card and the current speaker. Corrections come at the end." : Number(session.answeredTurns) ? "Follow-up: answer the examiner’s question." : `Answer the selected task (up to ${session.maxRecordingSeconds || 20} seconds). Corrections come after you finish.`}
          </p> : null}
          <div aria-live="polite" style={{display:"grid",gap:10,maxHeight:430,overflowY:"auto"}}>
            {messages.map((message,i) => (
              <div key={i} style={{background:message.role==="assistant"?"#eff6ff":"#f0fdf4",borderRadius:14,padding:13,marginLeft:message.role==="user"?30:0,marginRight:message.role==="assistant"?30:0}}>
                <strong>{message.role==="assistant"?(examinerSession ? message.speaker === "partner" ? "AI partner" : "AI Examiner" : "AI German tutor"):"You"}</strong>
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
              <span>{simulation ? "Recognised speech" : "What I said (you can edit this)"}</span>
              <textarea lang="de" rows={3} value={recognizedText} readOnly={simulation && !recognitionCorrection} maxLength={session.maxTranscriptChars || 600}
                onChange={event=>setRecognizedText(event.target.value)}
                style={{border:"1px solid #cbd5e1",borderRadius:10,padding:10,fontSize:16}}/>
            </label>
            {simulation ? <label><input type="checkbox" checked={recognitionCorrection} onChange={event=>{setRecognitionCorrection(event.target.checked);if(!event.target.checked)setRecognizedText(pending.transcript || recognizedText);}}/> Correct a speech-recognition mistake only</label> : null}
            {studentAudioUrl ? <audio controls src={studentAudioUrl} aria-label="Listen to your own recording" style={{width:"100%"}} /> : null}
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button type="button" style={styles.primaryButton}
                disabled={busy || feedbackBusy || (expired && (!examinerSession || Date.now() > Date.parse(session.expiresAt)+300000)) || recognizedText.trim().length < 2}
                onClick={confirmTranscript}>Confirm answer</button>
              <button type="button" style={styles.secondaryButton}
                disabled={busy} onClick={retryTranscript}>Record again</button>
            </div>
          </div> : null}
          {expired ? <p role="status">Your speaking session has ended. Your answers remain visible; finish the task to request feedback.</p> : null}
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button type="button" style={styles.primaryButton}
              onClick={recording?stopRecording:()=>startRecording(false)}
              disabled={busy || feedbackBusy || expired || Boolean(pending) || taskReady || Boolean(session.feedbackStatus) || details?.capReached}>
              {recording ? "■ Stop & send (" + recordingSeconds + "s)" : "🎤 Speak German"}
            </button>
            {examinerSession ? (
              <button type="button" style={styles.secondaryButton} onClick={finishExamTask}
                disabled={feedbackBusy || busy || recording || Boolean(pending) || !recordedAnswers.length}>
                {feedbackBusy ? "Preparing feedback…" : session.examFlow && !taskReady && !expired ? "Finish early & review" : "Finish task & see feedback"}
              </button>
            ) : null}
            <button type="button" style={styles.secondaryButton} onClick={endSession} disabled={busy || recording || feedbackBusy}>
              {examinerSession ? "End without feedback" : "End session"}
            </button>
          </div>

        </section>
      ) : null}

      {!session && !examFeedback && messages.some(message => message.role === "user") ? (
        <section aria-label="Saved speaking answers" style={shell}>
          <h2 style={{margin:0,fontSize:19}}>Your saved answers</h2>
          {messages.filter(message => message.role === "user").map((message,i) => <p key={i} lang="de">{message.text}</p>)}
        </section>
      ) : null}
      {examFeedback ? (
        <section aria-label="Speaking exam practice feedback"
          style={{...shell,border:"1px solid #bfdbfe",background:"#fff",display:"grid",gap:9}}>
          <h2 style={{margin:0,fontSize:19}}>Your speaking practice feedback</h2>
          {details?.lastExamResult?.examTask?.prompt ? <p style={{margin:0,fontSize:13}}>{details.lastExamResult.level} · {details.lastExamResult.examTask.prompt}</p> : null}
          {messages.filter(message => message.role === "user").length ? (
            <details><summary>Your saved answers</summary>
              {messages.filter(message => message.role === "user").map((message,i) => <p key={i} lang="de" style={{lineHeight:1.6}}>{message.text}</p>)}
            </details>
          ) : null}
          <p style={{margin:0,whiteSpace:"pre-wrap",lineHeight:1.65,fontSize:14}}>{examFeedback}</p>
          <button type="button" style={styles.primaryButton}
            onClick={recording ? stopRecording : () => {setLocalRetry(false); clearRecording(); startRecording(true);}}>
            {recording ? "■ Stop recording (" + recordingSeconds + "s)" : "Try your improved answer"}
          </button>
          <small>Use the correction above, record again, and listen back. This recording stays on your device and uses no AI allowance.</small>
          {localRetry && studentAudioUrl ? <audio controls src={studentAudioUrl} aria-label="Listen to your improved answer" style={{width:"100%"}} /> : null}
          <small style={{color:"#64748b"}}>This is practice feedback from reviewed transcripts, not an official Goethe result. Pronunciation cannot be scored from these transcripts.</small>
        </section>
      ) : null}
      {notice ? <p role="status" style={{...shell,background:"#eff6ff",margin:0}}>{notice}</p> : null}
      {errorMessage ? <p role="alert" style={{...shell,background:"#fef2f2",color:"#991b1b",margin:0}}>{errorMessage}</p> : null}

    </Container>
  );
}
