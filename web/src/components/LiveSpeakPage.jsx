import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { backendUrl } from "../services/aiClient";
import GoetheExamTaskCard from "./GoetheExamTaskCard";
import { examinerTaskPreview } from "../lib/examinerTaskPreview";
import { styles } from "../styles";
import { liveSpeakSessionContext, isDifferentLiveSpeakSessionContext } from "../lib/liveSpeakSessionContext";
import { microphoneFailureMessage, speakingTurnLabel } from "../lib/liveSpeakDevice";

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
  const [voiceState, setVoiceState] = useState("idle");
  const [audioRetry, setAudioRetry] = useState(null);
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
    if (!examinerEntry || typeof document === "undefined") return undefined;
    document.body.classList.toggle("falowen-speaking-session-active", Boolean(session) || recording);
    return () => document.body.classList.remove("falowen-speaking-session-active");
  }, [examinerEntry, session, recording]);

  useEffect(() => {
    if (!session) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [session]);

  const stopAudio = () => {
    const previous = voiceRef.current;
    if (previous) {
      previous.onended = null;
      previous.onerror = null;
      previous.pause();
    }
    voiceRef.current = null;
    setVoiceReady(false);
    setVoiceState("idle");
  };

  const playVoice = async (base64) => {
    stopAudio();
    if (!base64) { setVoiceState("ready"); return; }
    const audio = new Audio("data:audio/mpeg;base64," + base64);
    voiceRef.current = audio;
    audio.onended = () => {
      if (voiceRef.current === audio && mounted.current) setVoiceState("ready");
    };
    audio.onerror = () => {
      if (voiceRef.current !== audio || !mounted.current) return;
      setVoiceState("blocked");
      setNotice("German audio could not play. Tap Replay examiner audio, or continue using the written question.");
    };
    setVoiceReady(true);
    setVoiceState("playing");
    try { await audio.play(); }
    catch (_err) {
      if (voiceRef.current !== audio || !mounted.current) return;
      setVoiceState("blocked");
      setNotice("Automatic audio playback was blocked. Tap Replay examiner audio to listen, or read the question.");
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
        setAudioRetry(null);
        setPending({pendingId:result.pendingId,sessionId:currentSession.sessionId,transcript:result.transcript,uncertain:Boolean(result.uncertain)});
        setRecognizedText(result.transcript);
        setRecognitionCorrection(false);
        setNotice(result.uncertain ? "The recording was unclear. Please listen, correct the transcript, or record again." :
          "Check what the AI heard before the tutor responds.");
        return;
      }
      setAudioRetry(null);
      setMessages(old => [
        ...old,
        ...(result.transcript ? [{role:"user",text:result.transcript}] : []),
        {role:"assistant",speaker:result.speaker || result.examFlow?.step?.role || "examiner",text:result.reply},
      ]);
      setLastAudio(result.audioBase64);
      await playVoice(result.audioBase64);
    } catch (err) {
      if (mounted.current) {
        if (payload.audioBase64 && !payload.intro) {
          setAudioRetry({sessionId:currentSession.sessionId, payload:{intro:false,audioBase64:payload.audioBase64,mimeType:payload.mimeType}});
          setErrorMessage("Could not send the recording. Your audio remains on this device. Retry sending, or record again.");
        } else setErrorMessage(err.message);
      }
    } finally {
      requestBusy.current = false;
      if (mounted.current) setBusy(false);
    }
  };

  const retryRecordingUpload = async () => {
    if (!audioRetry || !session || busy || requestBusy.current) return;
    setBusy(true);
    setErrorMessage("");
    let safeToResend = false;
    try {
      // Always reconcile first: a lost HTTP response can arrive after the
      // server has already saved a pending or completed candidate turn.
      const info = await api("/live-speak/status");
      const active = info.activeSession;
      if (!active || active.sessionId !== audioRetry.sessionId) {
        setAudioRetry(null);
        setErrorMessage("This exam session is no longer active. You can still replay your local recording.");
      } else if (active.pending || Number(active.answeredTurns || 0) > Number(session.answeredTurns || 0)) {
        setSession(active);
        setMessages(active.messages || []);
        setPending(active.pending || null);
        setRecognizedText(active.pending?.transcript || "");
        setAudioRetry(null);
        setNotice("Your saved answer has been recovered. Review it before continuing.");
      } else {
        safeToResend = true;
      }
    } catch (_err) {
      setErrorMessage("Unable to check if your answer was saved. Check your connection and retry. Nothing was uploaded again.");
    } finally {
      if (mounted.current) setBusy(false);
    }
    if (safeToResend) await sendTurn(session, audioRetry.payload);
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
      setAudioRetry(null);
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
    setAudioRetry(null);
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
      setAudioRetry(null);
      setVoiceState("idle");
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
    setAudioRetry(null);
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
    if (recordingStarting.current || busy || feedbackBusy || recording || pending || audioRetry || voiceState === "playing") return;
    if (!localOnly && (!session || taskReady || now >= Date.parse(session.expiresAt))) return;
    if (localOnly && !examFeedback) return;
    setErrorMessage("");
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setErrorMessage("Audio recording is not supported on this browser. Use a recent Chrome or Safari version.");
      return;
    }
    recordingStarting.current = true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation:true, noiseSuppression:true, channelCount:1 },
      });
      if (!mounted.current) { stream.getTracks().forEach(track => track.stop()); return; }
      // Do not discard the replayable German question until the phone has
      // actually granted microphone access (iOS/Android permission prompts).
      stopAudio();
      mediaRef.current = stream;
      const mime = voiceTypes.find(type => typeof MediaRecorder.isTypeSupported === "function" && MediaRecorder.isTypeSupported(type)) || "";
      const recorder = new MediaRecorder(stream, {audioBitsPerSecond:24000, ...(mime ? {mimeType:mime} : {})});
      recorderRef.current = recorder;
      recorder.onerror = () => setErrorMessage("Recording was interrupted. Check microphone access and record again.");
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
      setErrorMessage(microphoneFailureMessage(err));
    } finally {
      recordingStarting.current = false;
    }
  };
  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

  const timeRemaining = session ? Math.max(0, Date.parse(session.expiresAt) - now) : 0;
  const expired = Boolean(session) && timeRemaining <= 0;
  const speakingLimit = Number(session?.maxRecordingSeconds || MAX_RECORDING_SECONDS);
  const recordingTimeLabel = friendlyTime(recordingSeconds * 1000);
  const speakingLimitLabel = friendlyTime(speakingLimit * 1000);
  const sessionsAvailable = (Number(details?.remaining) > 0 || Boolean(details?.activeSession)) && !details?.capReached;
  const examTurnState = speakingTurnLabel({recording,pending,busy,feedbackBusy,voiceState,session,taskReady,expired});
  return (
    <Container className={examinerEntry ? "speaking-exam-live" : undefined} data-live-speak-context={embedded ? "embedded-practice" : "standalone"}
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
                {busy ? "Starting…" : details.activeSession ? "Resume speaking" : examinerEntry ? "Start exam" : "Start speaking"}
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
        <section className={examinerSession ? "speaking-exam-session" : undefined} style={{ ...shell, display:"grid", gap:14 }}>
          <header className={examinerSession ? "speaking-exam-session__header" : undefined} style={{display:"flex",gap:12,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>

            <div>
              <h2 style={{margin:0,fontSize:20}}>{examinerSession ? "AI Examiner" : "Speaking practice"} · {displayContext.level}</h2>
              {examinerSession && session.examFlow ? <small style={{color:"#475569",fontWeight:600}}>
                Teil {session.examFlow.key?.split("-")[1]} · Step {Math.min(Number(session.answeredTurns || 0)+1,session.answerLimit || 1)} of {session.answerLimit || 2}
              </small> : null}
              {hasChangedContext ? <p role="status" style={{margin:"5px 0",color:"#92400e",fontSize:13}}>
                Current task: {displayContext.topic || "the previous topic"}. Finish it to change topics.
              </p> : null}
            </div>
            <div style={{display:"grid",justifyItems:"end",gap:2}}>
              <small style={{color:"#64748b"}}>Session time left</small>
              <strong style={{fontSize:22,color:expired?"#b91c1c":"#145b8f"}} aria-live="off">{friendlyTime(timeRemaining)}</strong>
            </div>
          </header>
          {examinerSession ? <div className="speaking-exam-turn-indicator" role="status" aria-live="polite" aria-atomic="true">
            <span className={recording ? "speaking-exam-turn-indicator__dot is-recording" : "speaking-exam-turn-indicator__dot"} aria-hidden="true"/>
            <strong>{examTurnState}</strong>
            <small>{voiceState === "playing"
              ? "Listen to the question before using the microphone."
              : voiceState === "blocked"
                ? "Tap Replay examiner audio, or read the German question."
                : taskReady
                  ? "Answers saved. You’re ready for feedback."
                  : session.examFlow ? "Corrections come at the end of this exam task."
                  : Number(session.answeredTurns) ? "Follow-up: answer the examiner’s question." : "Listen, then answer in German."}</small>
          </div> : null}
          <div className={examinerSession ? "speaking-exam-session__conversation" : undefined} aria-live="polite" style={{display:"grid",gap:10,maxHeight:430,overflowY:"auto"}}>
            {messages.map((message,i) => (
              <div key={i} style={{background:message.role==="assistant"?"#eff6ff":"#f0fdf4",borderRadius:14,padding:13,marginLeft:message.role==="user"?30:0,marginRight:message.role==="assistant"?30:0}}>
                <strong>{message.role==="assistant"?(examinerSession ? message.speaker === "partner" ? "AI partner" : "AI Examiner" : "AI German tutor"):"You"}</strong>
                <p style={{margin:"7px 0 0",lineHeight:1.65}} lang="de">{message.text}</p>
              </div>
            ))}
            {busy ? <p>{pending ? "Preparing the next examiner/tutor response…" : "Processing your German recording…"}</p> : null}
          </div>
          {lastAudio && voiceReady ? <button type="button" className={examinerSession ? "speaking-exam-replay" : undefined}
            style={styles.secondaryButton} disabled={busy || recording} onClick={()=>playVoice(lastAudio)}>
            {examinerSession ? "▶ Replay examiner audio" : "▶ Play AI voice again"}
          </button> : null}
          {examinerSession ? (
            <div className="speaking-exam-session__answer" style={{borderTop:"1px solid #e2e8f0",paddingTop:12,display:"grid",gap:9}} aria-label="Speaking answer controls">
              <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <strong style={{fontSize:13}}>Your spoken answer</strong>
                <span role="timer" aria-label="Speaking time" style={{fontVariantNumeric:"tabular-nums",fontSize:13,color:recording && speakingLimit-recordingSeconds<=10?"#b91c1c":"#334155",fontWeight:700}}>
                  {recording ? "Recording " : "Speaking time "}{recordingTimeLabel} / {speakingLimitLabel}
                </span>
              </div>
              <div className="speaking-exam-recorder-row" style={{display:"flex",alignItems:"stretch",gap:8,minWidth:0}}>
                <textarea lang="de" aria-label={simulation ? "Recognised speech" : "What I said (you can edit this)"} rows={2}
                  placeholder={pending ? "Review what Falowen heard…" : "Your German words appear here after recording"}
                  value={pending ? recognizedText : ""}
                  readOnly={!pending || (simulation && !recognitionCorrection)}
                  maxLength={session.maxTranscriptChars || 600}
                  onChange={event=>setRecognizedText(event.target.value)}
                  style={{minWidth:0,minHeight:60,flex:1,resize:"vertical",border:"1px solid #cbd5e1",borderRadius:12,padding:10,fontSize:16,background:pending?"#fff":"#f8fafc"}}/>
                <button type="button" aria-label={recording ? "Stop and send recording" : "Record German answer"}
                  title={recording ? "Stop and send recording" : "Record your German answer"}
                  onClick={recording ? stopRecording : () => startRecording(false)}
                  disabled={busy || feedbackBusy || expired || Boolean(pending) || Boolean(audioRetry) || voiceState === "playing" || taskReady || Boolean(session.feedbackStatus) || details?.capReached}
                  style={{border:"none",borderRadius:14,width:56,minWidth:56,background:recording?"#991b1b":"#dc2626",color:"#fff",fontWeight:800,fontSize:23,cursor:"pointer"}}>
                    {recording ? "■" : "🎙"}
                </button>
                <button type="button" aria-label="Confirm answer" title="Confirm spoken answer"
                  onClick={confirmTranscript}
                  disabled={!pending || busy || feedbackBusy || recognizedText.trim().length<2 || (expired && (!examinerSession || Date.now()>Date.parse(session.expiresAt)+300000))}
                  style={{border:"none",borderRadius:12,minWidth:44,padding:"0 10px",background:pending?"#2563eb":"#cbd5e1",color:pending?"#fff":"#475569",fontWeight:800,fontSize:20,cursor:pending?"pointer":"not-allowed"}}>
                  ➤
                </button>
              </div>
              {audioRetry ? <div role="group" aria-label="Recover unsent speaking audio" className="speaking-exam-recovery">
                <p role="alert">The recording is saved on this device, but the server has not confirmed it. Check your connection before retrying.</p>
                <div className="speaking-exam-recovery__actions">
                  <button type="button" onClick={retryRecordingUpload} disabled={busy || feedbackBusy}>Retry sending recording</button>
                  <button type="button" onClick={()=>{setAudioRetry(null);clearRecording();setErrorMessage("");setNotice("Record a new answer when you are ready.");}} disabled={busy}>Record again instead</button>
                </div>
                {studentAudioUrl ? <audio controls src={studentAudioUrl} aria-label="Replay unsent recording" style={{maxWidth:"100%",width:"100%"}}/> : null}
              </div> : null}
              {pending ? (
                <div role="group" aria-label="Review German speech recognition" style={{display:"grid",gap:8}}>
                  <p style={{margin:0,color:"#92400e",fontSize:13}}>Did Falowen hear you correctly? Review the words, then use the blue send arrow to confirm.</p>
                  {pending.uncertain ? <small>Audio unclear. Review the words or record again.</small> : null}
                  {simulation ? <label style={{fontSize:13}}>
                    <input type="checkbox" checked={recognitionCorrection} onChange={event=>{setRecognitionCorrection(event.target.checked);if(!event.target.checked)setRecognizedText(pending.transcript || recognizedText);}}/>
                    Correct a speech-recognition mistake only
                  </label> : null}
                  {studentAudioUrl ? <audio controls src={studentAudioUrl} aria-label="Listen to your own recording" style={{width:"100%"}}/> : null}
                  <button type="button" onClick={retryTranscript} disabled={busy} style={{...styles.secondaryButton,justifySelf:"start"}}>Record again</button>
                </div>
              ) : <small style={{color:"#64748b"}}>{voiceState === "playing" ? "The examiner is speaking. The microphone becomes available when the question finishes." : "Tap the red microphone when it is your turn. Feedback comes after the task."}</small>}
              {expired ? <p role="status">Your session time has ended. Your answers remain visible. Finish the task to review feedback.</p> : null}
              <div className="speaking-exam-session__actions" style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <button type="button" style={styles.secondaryButton} onClick={finishExamTask}
                  disabled={feedbackBusy || busy || recording || Boolean(pending) || !recordedAnswers.length}>
                  {feedbackBusy ? "Preparing feedback…" : "Finish task & see feedback"}
                </button>
                <button type="button" style={styles.secondaryButton} onClick={endSession} disabled={busy || recording || feedbackBusy}>End without feedback</button>
              </div>
            </div>
          ) : (
            <>
              {pending ? <div role="group" aria-label="Review German speech recognition">
                <label>What I said (you can edit this)
                  <textarea lang="de" rows={3} value={recognizedText} maxLength={session.maxTranscriptChars||600} onChange={e=>setRecognizedText(e.target.value)}/>
                </label>
                <button type="button" onClick={confirmTranscript} disabled={busy || recognizedText.trim().length<2}>Confirm answer</button>
                <button type="button" onClick={retryTranscript} disabled={busy}>Record again</button>
              </div> : null}
              {expired ? <p role="status">Your session has ended.</p> : null}
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <button type="button" style={styles.primaryButton} onClick={recording?stopRecording:()=>startRecording(false)}
                  disabled={busy || expired || Boolean(pending) || taskReady || details?.capReached}>{recording?"■ Stop & send":"🎤 Speak German"}</button>
                <button type="button" style={styles.secondaryButton} onClick={endSession} disabled={busy || recording}>End session</button>
              </div>
            </>
          )}

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
