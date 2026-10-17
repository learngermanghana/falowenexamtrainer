import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { backendUrl } from "../services/aiClient";
import { requestCoachSpeech } from "../services/presentationCoachService";
import GoetheExamTaskCard from "./GoetheExamTaskCard";
import SpeakingRecorder from "./SpeakingRecorder";
import { SpeakingFeedback } from "./SpeakingPracticeHome";
import { examinerTaskPreview } from "../lib/examinerTaskPreview";
import { styles } from "../styles";
import { liveSpeakSessionContext, isDifferentLiveSpeakSessionContext } from "../lib/liveSpeakSessionContext";
import { microphoneFailureMessage, speakingTurnLabel, speakingRecordingBitrate } from "../lib/liveSpeakDevice";
import { matchingExamResult, nextExamTeil } from "../lib/speakingPracticeHistory";

const MAX_RECORDING_SECONDS = 20;
const LOCAL_PRACTICE_SECONDS = 75; // Bounded on-device recording, no backend usage.
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

export default function LiveSpeakPage({ embedded = false, initialLevel = "", practiceTopic = "", practiceSource = "", examTask = null, examMode = "guided", onActivityChange, onExamCompleted, onContinueToNext, autoStart = false, freshAttempt = false, deferFeedback = false, onSessionReset, gradedCourseMock = false }) {
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
  const [examAssessment, setExamAssessment] = useState(null);
  const [feedbackBusy, setFeedbackBusy] = useState(false);
  const [exitConfirm, setExitConfirm] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [answerMode, setAnswerMode] = useState("record");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);
  const autoFeedbackRequested = useRef(false);
  const [pending, setPending] = useState(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [recognitionCorrection,setRecognitionCorrection]=useState(false);
  const [studentAudioUrl, setStudentAudioUrl] = useState("");
  const recordedUrlRef = useRef(null);
  const examConversationRef = useRef(null);
  const followLatestRef = useRef(true);
  const [showLatest, setShowLatest] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceReady, setVoiceReady] = useState(false);
  const replayUrlRef = useRef("");
  const replayRequestRef = useRef(null);
  const nativeAudioRef = useRef(null);
  const studentPlaybackRef = useRef(null);
  const [openingFailed,setOpeningFailed] = useState(false);
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
  const [localAnswer, setLocalAnswer] = useState("");
  const mounted = useRef(true);
  const level = String(studentProfile?.level || "A2").toUpperCase();
  const contextualLevel = String(initialLevel || "").toUpperCase();
  const fixedLevel = embedded && /^(A1|A2|B1|B2|C1|C2)$/.test(contextualLevel) ? contextualLevel : "";
  const safeLevel = fixedLevel || selectedLevel || (/^(A1|A2|B1|B2|C1|C2)$/.test(level) ? level : "A2");
  const examinerEntry = embedded && practiceSource === "exam-speaking-practice";
  const Container = embedded ? "section" : "main";
  const supportedExaminer=examinerEntry && ["A1","A2","B1","B2","C1","C2"].includes(safeLevel);
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

  // The old Speaking Coach keeps a dedicated scrolling conversation. Follow
  // new examiner turns only if the learner is already near the latest message.
  // Students reading an earlier answer must not be yanked back to the bottom.
  useEffect(() => {
    if (!examinerSession) return;
    const thread = examConversationRef.current;
    if (!thread || !followLatestRef.current) return;
    thread.scrollTop = thread.scrollHeight;
    setShowLatest(false);
  }, [examinerSession, messages.length, busy]);

  const handleExamThreadScroll = () => {
    const thread = examConversationRef.current;
    if (!thread) return;
    const nearBottom = thread.scrollHeight - thread.scrollTop - thread.clientHeight < 72;
    followLatestRef.current = nearBottom;
    setShowLatest(!nearBottom);
  };
  const jumpToLatestExamTurn = () => {
    const thread = examConversationRef.current;
    if (!thread) return;
    thread.scrollTop = thread.scrollHeight;
    followLatestRef.current = true;
    setShowLatest(false);
  };

  const courseAssignmentKey = String(examTask?.courseAssignmentKey || "").trim().toUpperCase();
  const api = useCallback(async (path, method = "GET", body = undefined) => {
    const headers = { Authorization: "Bearer " + idToken };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    const scopedPath = courseAssignmentKey && path === "/live-speak/status"
      ? `${path}?courseAssignmentKey=${encodeURIComponent(courseAssignmentKey)}` : path;
    const payload = body !== undefined && courseAssignmentKey ? { ...body, courseAssignmentKey } : body;
    const result = await fetch(backendUrl + scopedPath, {
      method, headers, body: payload === undefined ? undefined : JSON.stringify(payload),
    });
    const data = await result.json().catch(() => ({}));
    if (!result.ok) {
      const err = new Error(data.error || "Live Speak is temporarily unavailable.");
      err.code = data.code;
      err.status = result.status;
      throw err;
    }
    return data;
  }, [idToken, courseAssignmentKey]);

  const refresh = useCallback(async () => {
    if (!idToken) { setLoading(false); return; }
    try {
      const response = await api("/live-speak/status");
      // Ignore an unrelated legacy response while frontend/backend releases roll out.
      const info = courseAssignmentKey && response.activeSession?.examTask?.courseAssignmentKey !== courseAssignmentKey
        ? { ...response, activeSession: null } : response;
      if (mounted.current) {
        setDetails(info);
        if (!freshAttempt && examinerEntry && matchingExamResult(info.lastExamResult,{
          level:safeLevel,taskId:examTask?.id
        })) {
          setExamFeedback(info.lastExamResult.feedback || "");
          setExamAssessment(info.lastExamResult.assessment || null);
          if (!info.activeSession) setMessages(info.lastExamResult.messages || []);
        }
      }
    } catch (err) {
      if (mounted.current) setErrorMessage(err.message);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [api, idToken, examinerEntry, safeLevel, examTask?.id, freshAttempt, courseAssignmentKey]);

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
      replayRequestRef.current?.abort();
      if (replayUrlRef.current) URL.revokeObjectURL(replayUrlRef.current);
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
    nativeAudioRef.current?.pause();
    studentPlaybackRef.current?.pause();
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

  const playVoice = async (base64, sourceUrl = "") => {
    stopAudio();
    if (!base64 && !sourceUrl) { setVoiceState("ready"); return; }
    const audio = new Audio(sourceUrl || "data:audio/mpeg;base64," + base64);
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
        setPending({pendingId:result.pendingId,sessionId:currentSession.sessionId,transcript:result.transcript,uncertain:Boolean(result.uncertain),typed:Boolean(result.typed)});
        setRecognizedText(result.transcript);
        setRecognitionCorrection(false);
        setNotice(result.typed ? "Confirm your typed German answer to continue." : result.uncertain ?
          "The recording was unclear. Please listen, correct the transcript, or record again." :
          "Check what the AI heard before the tutor responds.");
        return;
      }
      setAudioRetry(null);
      setOpeningFailed(false);
      setMessages(old => [
        ...old,
        ...(result.transcript ? [{role:"user",text:result.transcript}] : []),
        {role:"assistant",speaker:result.speaker || result.examFlow?.step?.role || "examiner",text:result.reply},
      ]);
      if (replayUrlRef.current) {URL.revokeObjectURL(replayUrlRef.current);replayUrlRef.current="";}
      setLastAudio(result.audioBase64);
      await playVoice(result.audioBase64);
    } catch (err) {
      if (mounted.current) {
        if (payload.audioBase64 && !payload.intro) {
          // Only transport / transient failures are safe to resend. Expiry,
          // quota, and size errors are definitive: a retry would fail again.
          const terminalCodes = new Set(["session_ended","task_ready","audio_limit","audio_too_large",
            "budget_reached","turn_limit","invalid_audio"]);
          const retryable = !terminalCodes.has(err.code) && (
            !err.status || err.status >= 500 || ["turn_in_progress","transcript_missing"].includes(err.code)
          );
          setAudioRetry(retryable
            ? {sessionId:currentSession.sessionId,payload:{intro:false,audioBase64:payload.audioBase64,mimeType:payload.mimeType}}
            : null);
          setErrorMessage(retryable
            ? "The upload was not confirmed. Your recording is still available below. Tap Check saved answer to recover it or retry safely."
            : err.message + " Your recording is still available to preview below.");
        } else if (payload.intro && err.code === "intro_already_sent") {
          // A lost opening response must resume the server's saved question.
          const info = await api("/live-speak/status");
          if (mounted.current && info.activeSession?.sessionId === currentSession.sessionId) {
            setSession(info.activeSession);
            setMessages(info.activeSession.messages || []);
            setOpeningFailed(false);
          }
        } else {setOpeningFailed(Boolean(payload.intro));setErrorMessage(err.message);}
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
      // A Vercel request can time out AFTER server acceptance. Ask Firestore
      // first; do not charge for a duplicate transcript still processing.
      const info = await api("/live-speak/status");
      const active = info.activeSession;
      if (!active || active.sessionId !== audioRetry.sessionId) {
        setAudioRetry(null);
        setErrorMessage("This exam session is no longer active. You can still replay your local recording.");
      } else if (active.pending || Number(active.answeredTurns || 0) > Number(session.answeredTurns || 0)) {
        setSession(active);
        setMessages(active.messages || []);
        setPending(active.pending || null);
        setAnswerMode(active.pending?.typed ? "type" : "record");
        setRecognizedText(active.pending?.transcript || "");
        setAudioRetry(null);
        setNotice(active.pending
          ? "Your answer reached Falowen. Please review and confirm the recovered transcript."
          : "Your answer was already saved. Continue from the recovered examiner question.");
      } else if (active.processingAnswer) {
        setNotice("Falowen is still processing this recording. Please wait a moment, then tap Check saved answer again.");
      } else {
        // Old in-flight locks can survive an interrupted serverless execution.
        // Reconciliation must finish before any replacement /turn request.
        safeToResend = true;
      }
    } catch (_err) {
      setErrorMessage("Falowen cannot verify whether this answer reached the server. Check your connection and tap Check saved answer again. Your recording was not resent.");
    } finally {
      if (mounted.current) setBusy(false);
    }
    if (safeToResend) await sendTurn(session, audioRetry.payload);
  };

  const confirmTranscript = async (skip = false) => {
    const skipAnswer = skip === true;
    if ((!pending && !skipAnswer) || !session || requestBusy.current || busy) return;
    if (skipAnswer && (!["A2-3","B1-1"].includes(session.examFlow?.key) ||
        pending || taskReady || recording || feedbackBusy)) return;
    const text = skipAnswer ? "[Keine Antwort]" : recognizedText.trim();
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
        sessionId:session.sessionId,pendingId:pending?.pendingId || "",transcript:text,history,
        recognitionCorrection:!skipAnswer && recognitionCorrection,skipAnswer,
        expectedAnsweredTurns:Number(session.answeredTurns || 0),
      });
      if (!mounted.current) return;
      setMessages(old => [...old,{role:"user",text:result.transcript},{role:"assistant",speaker:result.speaker || result.examFlow?.step?.role || "examiner",text:result.reply},
        ...(result.nextInstruction ? [{role:"assistant",speaker:result.examFlow?.step?.role || "examiner",text:result.nextInstruction}] : [])]);
      setSession(old => old ? {...old, answeredTurns:(Number(old.answeredTurns) || 0)+1, taskReady:Boolean(result.taskReady), maxRecordingSeconds:result.maxRecordingSeconds || 20,maxAudioBytes:result.maxAudioBytes || old.maxAudioBytes,maxTranscriptChars:result.maxTranscriptChars || old.maxTranscriptChars,...(result.examFlow ? {examFlow:result.examFlow} : {})} : old);
      setPending(null);
      setAudioRetry(null);
      setRecognizedText("");
      setTypedAnswer("");
      if (replayUrlRef.current) {URL.revokeObjectURL(replayUrlRef.current);replayUrlRef.current="";}
      setLastAudio(result.audioBase64);
      setNotice(skipAnswer
        ? "This question was skipped (0 points). " + (result.taskReady
          ? "The examiner has finished this Teil and will mark it." : "Continue with the next question.")
        : gradedCourseMock
          ? `✓ Answer ${Number(session.answeredTurns || 0) + 1} saved to Falowen. ${result.taskReady ? "All answers recorded; AI marking is starting." : "Continue with the examiner."}`
          : "");
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
              setAnswerMode(restored.pending?.typed ? "type" : "record");
              setRecognizedText(restored.pending?.transcript || "");
              if (skipAnswer && Number(restored.answeredTurns || 0) > Number(session.answeredTurns || 0)) {
                setNotice("✓ Your skipped answer was saved; the examiner advanced.");
                setErrorMessage("");
              }
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
  const retryTranscript = async () => {
    if (!pending || !session || busy || requestBusy.current || recording) return;
    // Do not unlock a replacement turn or clear the local preview until the
    // server has atomically discarded this exact pending candidate.
    requestBusy.current = true;
    setBusy(true);
    setErrorMessage("");
    try {
      await api("/live-speak/session/discard-pending", "POST", {
        sessionId:session.sessionId, pendingId:pending.pendingId,
      });
      if (!mounted.current) return;
      if (pending.typed) {
        setTypedAnswer(recognizedText);
        setAnswerMode("type");
      }
      setAudioRetry(null);
      setPending(null);
      setRecognizedText("");
      setNotice(pending.typed
        ? "Edit your German answer and send it again."
        : "Record your answer again. Your previous unconfirmed answer was discarded.");
      clearRecording();
    } catch (err) {
      if (mounted.current) {
        // A failed/disconnected discard retains the original transcript so
        // students can retry, confirm, or resume after refreshing.
        setErrorMessage("Could not discard your unfinished answer. Please retry. " + err.message);
      }
    } finally {
      requestBusy.current = false;
      if (mounted.current) setBusy(false);
    }
  };

  const startSession = async (resumeSaved = false) => {
    if (busy || (session && resumeSaved !== true) || recording || recordingStarting.current) return;
    if (supportedExaminer && !details?.activeSession && details?.examinerFlowVersion !== 1) {
      setErrorMessage("Examiner practice is temporarily unavailable. Please try again shortly.");
      return;
    }
    setBusy(true);
    setErrorMessage("");
    try {
      // One-click practice. The server still verifies credits and global cost caps.
      if ((!examinerEntry || !details?.openTesting) && details?.pilotAvailable &&
        !details?.examTryoutAvailable && !details?.activeSession &&
        Number(!examinerEntry && details.actualRemaining != null ? details.actualRemaining : details.remaining) <= 0) {
        await api("/live-speak/pilot/claim", "POST", {});
      }
      const result = await api("/live-speak/session/start", "POST", {level:safeLevel, topic:practiceTopic, source:practiceSource, examTask:examinerEntry ? examTask : null,...(supportedExaminer ? {examinerFlowVersion:1,examMode} : {})});
      setSession(result);
      setAudioRetry(null);
      setVoiceState("idle");
      setLocalRetry(false);
      setExamFeedback("");
      setExamAssessment(null);
      setExitConfirm(false);
      setResetConfirm(false);
      setTypedAnswer("");
      autoFeedbackRequested.current=false;
      setRecognitionCorrection(false);
      setPending(result.pending || null);
      setAnswerMode(result.pending?.typed ? "type" : "record");
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
      const needsOpening = !result.resumed || (!result.messages?.length && !result.pending && !Number(result.answeredTurns));
      if (result.resumed) setNotice(
        isDifferentLiveSpeakSessionContext(result, {level:safeLevel,topic:practiceTopic,source:practiceSource,examTask,examMode})
          ? "Your existing voice session is still using its original topic and level. End it before starting a conversation on the newly selected topic."
          : "Your ongoing speaking session has resumed. Continue speaking German."
      );
      if (needsOpening) await sendTurn(result, {intro:true});
      refresh();
    } catch (err) {
      setErrorMessage(err.message);
      setBusy(false);
      refresh();
    }
  };

  const resetExamSession = async () => {
    if (resetting || feedbackBusy || recording) return;
    const active = session || details?.activeSession;
    setResetting(true);
    setErrorMessage("");
    try {
      // Only return to selection after the server confirms this task ended.
      if (active?.sessionId) await api("/live-speak/session/end", "POST", {sessionId:active.sessionId});
      stopAudio();
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.onstop = null;
        recorderRef.current.stop();
      }
      mediaRef.current?.getTracks().forEach(track => track.stop());
      if (recordingTicker.current) clearInterval(recordingTicker.current);
      replayRequestRef.current?.abort();
      setSession(null);
      setPending(null);
      setAudioRetry(null);
      setMessages([]);
      setExamFeedback("");
      setExamAssessment(null);
      setTypedAnswer("");
      setResetConfirm(false);
      clearRecording();
      if (onSessionReset) onSessionReset();
      else await refresh();
    } catch (err) {
      if (mounted.current) setErrorMessage("Could not reset the session. Your work is still available. Please retry. " + err.message);
    } finally {
      if (mounted.current) setResetting(false);
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
    setExitConfirm(false);
    setPending(null);
    setAudioRetry(null);
    clearRecording();
    setNotice(examinerSession ? "The examiner task was ended without feedback." : "Your conversation has ended. Review your corrections and phrases below.");
    try { await api("/live-speak/session/end", "POST", { sessionId: existing.sessionId }); }
    catch (_error) { /* The server expiry and quotas still apply. */ }
    refresh();
  };

  const autoStartRequested = useRef(false);
  useEffect(() => {
    if (!autoStart || autoStartRequested.current || loading || !details?.enabled || session || busy) return;
    // A failed start leaves the ordinary Start/Resume control available for retry.
    autoStartRequested.current = true;
    startSession();
  }, [autoStart, loading, details, session, busy]);

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
      if (gradedCourseMock && !result.assessment) {
        throw new Error("Your answers are saved, but AI marking is incomplete. Tap Retry feedback.");
      }
      const accepted = onExamCompleted?.({sessionId:session.sessionId,taskId:session.examTask?.id || examTask?.id,
        level:session.level || safeLevel,
        teil:session.examTask?.teil || examTask?.teil,
        topic:session.examTask?.prompt || examTask?.prompt,
        keyword:session.examTask?.keywords || examTask?.keywords,
        feedback:result.feedback,assessment:result.assessment || null,
        words:session.examFlow?.cards || session.examFlow?.requestCards || []});
      if (gradedCourseMock && accepted === false) {
        throw new Error("Your exam answers are saved. Retry feedback to complete the mark.");
      }
      setExamFeedback(result.feedback);
      setExamAssessment(result.assessment || null);
      setSession(null);
      setExitConfirm(false);
      setNotice(gradedCourseMock
        ? "✓ This speaking part has been marked and saved to Falowen."
        : "Exam practice complete. Feedback is based on your reviewed transcripts, not a pronunciation assessment.");
      await refresh();
    } catch (err) {
      autoFeedbackRequested.current = false;
      if (gradedCourseMock && err.code === "course_mock_part_incomplete") {
        try {
          const status = await api("/live-speak/status");
          const restored = status.activeSession;
          if (mounted.current && restored?.sessionId === session.sessionId) {
            setSession(restored);
            setMessages(restored.messages || []);
            setPending(restored.pending || null);
            setNotice("✓ Your earlier answers are saved. The examiner has another step to finish.");
            setErrorMessage("");
            return;
          }
        } catch (_restoreError) { /* Keep the saved-answer retry available. */ }
      }
      if (mounted.current) {
        setErrorMessage(err.message);
        setNotice(gradedCourseMock
          ? "Your confirmed answers remain saved. Marking is pending; use Retry feedback."
          : "");
      }
    } finally {
      requestBusy.current = false;
      if (mounted.current) setFeedbackBusy(false);
    }
  };

  const startRecording = async (localOnly = false) => {
    if (recordingStarting.current || busy || feedbackBusy || recording || pending || audioRetry || voiceState === "playing") return;
    if (!localOnly && (!session || taskReady || now >= Date.parse(session.expiresAt))) return;
    if (localOnly && !examFeedback && !examinerEntry) return;
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
      const recorder = new MediaRecorder(stream, {
        // Higher fidelity for fast speech without increasing per-step/server
        // upload limits. Long presentations retain the economical bitrate.
        audioBitsPerSecond: speakingRecordingBitrate({localOnly,maxRecordingSeconds:session?.maxRecordingSeconds}),
        ...(mime ? {mimeType:mime} : {}),
      });
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
        if ((elapsed >= (localOnly ? LOCAL_PRACTICE_SECONDS : session.maxRecordingSeconds || MAX_RECORDING_SECONDS) || (!localOnly && Date.now() >= Date.parse(session.expiresAt))) &&
          recorder.state === "recording") recorder.stop();
      }, 300);
    } catch (err) {
      mediaRef.current?.getTracks().forEach(track => track.stop());
      setErrorMessage(microphoneFailureMessage(err));
    } finally {
      recordingStarting.current = false;
    }
  };
  // At a finished Teil, the server has already accepted every answer; request
  // feedback once instead of asking the learner to end or lose the session.
  useEffect(() => {
    if (!examinerSession || !taskReady || !recordedAnswers.length ||
      pending || busy || feedbackBusy || examFeedback || errorMessage || autoFeedbackRequested.current) return;
    autoFeedbackRequested.current=true;
    finishExamTask();
  }, [examinerSession,taskReady,recordedAnswers.length,pending,busy,feedbackBusy,examFeedback,errorMessage]);

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

  const examinerMessages = messages.filter(message=>message.role === "assistant" && message.text);
  const currentExaminerText = examinerMessages.at(-1)?.text || session?.examFlow?.step?.instruction || "";
  const replayExaminer = async () => {
    if (busy || recording || replayRequestRef.current) return;
    if (lastAudio) { await playVoice(lastAudio); return; }
    if (replayUrlRef.current) { await playVoice("",replayUrlRef.current); return; }
    if (!currentExaminerText) return;
    const controller = new AbortController();
    replayRequestRef.current = controller;
    setBusy(true);
    setErrorMessage("");
    try {
      const url = await requestCoachSpeech({text:currentExaminerText,level:safeLevel,idToken,signal:controller.signal});
      if (!mounted.current) {URL.revokeObjectURL(url);return;}
      replayUrlRef.current = url;
      await playVoice("",url);
    } catch (err) {
      if (mounted.current && err.name !== "AbortError") setErrorMessage("Examiner audio is unavailable. Read the German question, or tap Listen to examiner to retry.");
    } finally {
      replayRequestRef.current = null;
      if (mounted.current) setBusy(false);
    }
  };

  const submitTypedAnswer = async () => {
    const answer = typedAnswer.trim();
    if (!session || pending || audioRetry || busy || feedbackBusy || recording || requestBusy.current ||
        voiceState === "playing" || taskReady || answer.length < 2 ||
        answer.length > (session.maxTranscriptChars || 600)) return;
    await sendTurn(session, {intro:false,typedAnswer:answer});
  };

  const timeRemaining = session ? Math.max(0, Date.parse(session.expiresAt) - now) : 0;
  const expired = Boolean(session) && timeRemaining <= 0;
  const speakingLimit = Number(session?.maxRecordingSeconds || MAX_RECORDING_SECONDS);
  const recordingTimeLabel = friendlyTime(recordingSeconds * 1000);
  const speakingLimitLabel = friendlyTime(speakingLimit * 1000);
  const sessionsAvailable = (examinerEntry && Boolean(details?.openTesting)) ||
    ((Number(!examinerEntry && details?.actualRemaining != null ? details.actualRemaining : details?.remaining) > 0 ||
      Boolean(details?.activeSession)) &&
      !(examinerEntry ? details?.capReached : details?.actualCapReached ?? details?.capReached));
  // A real, server-bounded AI examiner tryout is available once per month when
  // normal pilot access is exhausted. No client-side quota override occurs.
  const aiTryoutAvailable = examinerEntry && Boolean(details?.examTryoutAvailable);
  const canStartAiExaminer = sessionsAvailable || aiTryoutAvailable ||
    (Boolean(details?.pilotAvailable) && !details?.capReached);
  const localPracticeMode = examinerEntry && !session && !examFeedback && !loading &&
    (!details?.enabled || !canStartAiExaminer);
  const waitingForOpening = examinerSession && busy && !messages.length && !pending;
  const examTurnState = waitingForOpening
    ? "AI examiner is preparing to speak"
    : speakingTurnLabel({recording,pending,busy,feedbackBusy,voiceState,session,taskReady,expired});
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

      {loading ? <p role="status" style={{margin:0,color:"#64748b",fontSize:13}}>{examinerEntry ? "Preparing the AI examiner. The AI will speak first; please wait and listen." : "Preparing speaking practice…"}</p> : null}
      {examinerEntry && busy && !session ? <p role="status" className="speaking-opening-question">Preparing your German examiner’s voice… Please wait and listen before answering.</p> : null}
      {!loading && details && !details.enabled ? (
        <p role="status" style={{margin:0,color:"#64748b"}}>Speaking practice is temporarily unavailable.</p>
      ) : null}

      {supportedExaminer && !examFeedback ? <GoetheExamTaskCard flow={session?.examFlow || taskPreview} topic={session?.examTask?.prompt || examTask?.prompt} active={Boolean(session)}/> : null}
      {examinerEntry && !gradedCourseMock && details?.openTesting && !session && !loading ? (
        <p role="status" className="speaking-testing-access-note">
          AI examiner testing is available. Start or repeat an exam without pilot credits.
        </p>
      ) : null}
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
          {details.capReached && !details.activeSession && !aiTryoutAvailable ? (
            <p role="status" style={{margin:0,color:"#64748b",fontSize:13}}>Live AI voice sessions are paused by the shared safety budget. You can still record and replay your own practice below.</p>
          ) : (details.activeSession || sessionsAvailable || aiTryoutAvailable || details.pilotAvailable) ? (
            <div>
              <button type="button" style={styles.primaryButton} onClick={startSession} disabled={busy || recording}>
                {busy ? "Starting…" : details.activeSession ? "Resume speaking" : examinerEntry ? "Start speaking" : "Start speaking"}
              </button>
            </div>
          ) : (
            <p role="status" style={{margin:0,color:"#64748b",fontSize:13}}>
              Your live AI examiner sessions are not currently available. You can still record, write notes and replay your speaking locally below — without using an AI allowance.
            </p>
          )}
        </div>
      ) : null}

      {examinerEntry && !session && details?.activeSession ? <button type="button"
        className="speaking-reset-session" onClick={()=>setResetConfirm(true)} disabled={resetting}>
        Reset saved session
      </button> : null}
      {localPracticeMode ? (
        <section className="speaking-exam-local-practice" aria-label="Record speaking practice without AI">
          <div className="speaking-exam-local-practice__heading">
            <strong>Record your speaking answer</strong>
            <small>Device-only practice · no AI credits or upload</small>
          </div>
          <p style={{margin:0,fontSize:13,lineHeight:1.45,color:"#475569"}}>
            The live examiner is unavailable for this account right now. Use this microphone to practise the task and listen back. This mode does not transcribe, grade or ask AI follow-up questions.
          </p>
          <div className="speaking-exam-local-practice__recorder">
            <textarea lang="de" aria-label="Type optional speaking notes" rows={2}
              value={localAnswer} maxLength={1400} onChange={event=>setLocalAnswer(event.target.value)}
              placeholder="Optional: write your German answer or notes here…" />
            <button type="button" aria-label={recording ? "Stop local practice recording" : "Record local speaking practice"}
              title={recording ? "Stop and listen to your recording" : "Record speaking practice"}
              onClick={recording ? stopRecording : () => {setLocalRetry(false);clearRecording();startRecording(true);}}
              disabled={busy || feedbackBusy}
              className={recording ? "speaking-exam-local-practice__mic is-recording" : "speaking-exam-local-practice__mic"}>
              {recording ? "■" : "🎙"}
            </button>
          </div>
          <small role="status">{recording ? "Recording " + recordingSeconds + "s / " + LOCAL_PRACTICE_SECONDS + "s" : "Tap the red microphone to begin. Tap again to stop."}</small>
          {localRetry && studentAudioUrl ? <audio controls src={studentAudioUrl} aria-label="Replay local speaking answer" style={{width:"100%",maxWidth:"100%"}} /> : null}
        </section>
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
            <div className="speaking-exam-session__utility">
              <strong className="speaking-session-clock" aria-label="Session time left" aria-live="off">{friendlyTime(timeRemaining)}</strong>
              {examinerSession ? <button type="button" className="speaking-reset-session"
                onClick={()=>setResetConfirm(true)} disabled={resetting || recording}>Reset session</button> : null}
            </div>
          </header>
          {examinerSession ? <div className="speaking-exam-turn-indicator" role="status" aria-live="polite" aria-atomic="true">
            <span className={waitingForOpening ? "speaking-exam-turn-indicator__dot is-waiting" : recording ? "speaking-exam-turn-indicator__dot is-recording" : "speaking-exam-turn-indicator__dot"} aria-hidden="true"/>
            <strong>{examTurnState}</strong>
            <small>{waitingForOpening ? "Please wait. The AI is preparing your German question and audio."
              : voiceState === "playing"
              ? "Please listen. Your microphone unlocks when the examiner finishes speaking."
              : voiceState === "blocked"
                ? "iPhone/Safari may require a tap to enable the examiner’s voice. Use the speaker button below."
                : taskReady
                  ? "Answers saved. You’re ready for feedback."
                  : session.examFlow ? "Corrections come at the end of this exam task."
                  : Number(session.answeredTurns) ? "Follow-up: answer the examiner’s question." : "Listen, then answer in German."}</small>
          </div> : null}
          {examinerSession && !messages.length ? <p className="speaking-opening-question" lang="de" role="status">
            {session.examFlow?.step?.instruction || (busy ? "Die Frage wird vorbereitet …" : examTask?.prompt)}
          </p> : null}
          {openingFailed ? <button type="button" className="speaking-opening-retry" disabled={busy || recording} onClick={()=>sendTurn(session,{intro:true})}>Retry examiner opening</button> : null}
          {examinerSession && voiceState === "blocked" && currentExaminerText ? (
            <div className="speaking-voice-unlock" role="status" aria-label="Examiner audio requires a tap">
              <strong>🔊 The examiner is ready to speak</strong>
              <p>On iPhone, sound may need your permission. Tap below to hear the German question before recording.</p>
              <button type="button" aria-label="Tap to hear the AI examiner" onClick={replayExaminer} disabled={busy || recording}>
                ▶ Tap to hear the AI examiner
              </button>
            </div>
          ) : null}
          {examinerSession && currentExaminerText ? <div className="speaking-current-question" aria-label="Current examiner question">
            <strong>AI question</strong>
            <p lang="de">{currentExaminerText}</p>
            <button type="button" onClick={replayExaminer}
              disabled={busy || recording || feedbackBusy || resetting || !currentExaminerText}>
              ▶ Listen to question again
            </button>
          </div> : null}
          <details className={examinerSession ? "speaking-exam-chat-shell speaking-dialogue-history" : "speaking-exam-chat-shell"} open={!examinerSession ? true : undefined}>
            {examinerSession ? <summary>Previous dialogue · {messages.length} messages</summary> : null}
            <div ref={examinerSession ? examConversationRef : undefined}
              onScroll={examinerSession ? handleExamThreadScroll : undefined}
              className={examinerSession ? "speaking-exam-session__conversation speaking-exam-chat-thread" : undefined}
              role={examinerSession ? "log" : undefined}
              aria-label={examinerSession ? "Examiner conversation" : undefined}
              aria-live="polite" aria-relevant="additions text"
              style={{display:"grid",gap:10,maxHeight:430,overflowY:"auto"}}>
              {messages.map((message,i) => (
                examinerSession ? (
                  <div key={i} className={message.role === "user" ? "speaking-exam-message-row is-student" : "speaking-exam-message-row is-examiner"}>
                    {message.role !== "user" ? <span className="speaking-exam-message-avatar" aria-hidden="true">💬</span> : null}
                    <div className="speaking-exam-message-bubble">
                      <strong>{message.role === "user" ? "You" : message.speaker === "partner" ? "AI partner" : "AI Examiner"}</strong>
                      <p lang="de">{message.text}</p>
                    </div>
                    {message.role === "user" ? <span className="speaking-exam-message-avatar is-student" aria-hidden="true">👤</span> : null}
                  </div>
                ) : (
                  <div key={i} style={{background:message.role==="assistant"?"#eff6ff":"#f0fdf4",borderRadius:14,padding:13,marginLeft:message.role==="user"?30:0,marginRight:message.role==="assistant"?30:0}}>
                    <strong>{message.role==="assistant"?"AI German tutor":"You"}</strong>
                    <p style={{margin:"7px 0 0",lineHeight:1.65}} lang="de">{message.text}</p>
                  </div>
                )
              ))}
              {busy ? <p className={examinerSession ? "speaking-exam-message-waiting" : undefined}>
                {pending ? "Preparing the next examiner/tutor response…" : "Processing your German recording…"}
              </p> : null}
            </div>
            {examinerSession && showLatest ? <button type="button" className="speaking-exam-chat-latest"
              onClick={jumpToLatestExamTurn}>↓ Latest message</button> : null}
          </details>
          {examinerSession && lastAudio && voiceState === "blocked" ? <details className="speaking-exam-audio-controls">
            <summary>Examiner audio player</summary>
            <audio ref={nativeAudioRef} controls={!recording && !busy} preload="metadata" aria-label="Examiner audio player"
              src={"data:audio/mpeg;base64,"+lastAudio}
              onPlay={()=>{if(recording){nativeAudioRef.current?.pause();return;}voiceRef.current?.pause();setVoiceState("playing");}}
              onPause={()=>setVoiceState("ready")} onEnded={()=>setVoiceState("ready")}/>
          </details> : null}
          {!examinerSession && lastAudio && voiceReady ? <button type="button" style={styles.secondaryButton}
            disabled={busy || recording} onClick={()=>playVoice(lastAudio)}>▶ Play AI voice again</button> : null}
          {examinerSession ? (
            <div className="speaking-exam-session__answer" style={{borderTop:"1px solid #e2e8f0",paddingTop:12,display:"grid",gap:9}} aria-label="Speaking answer controls">
              <div className="speaking-answer-heading">
                <strong>Your answer</strong>
                <span role="timer" aria-label="Speaking time">{recording ? "● Recording " : ""}{recordingTimeLabel} / {speakingLimitLabel}</span>
              </div>
              {gradedCourseMock && notice ? <p role="status" aria-live="polite" className="speaking-mock-saved-notice">{notice}</p> : null}
              <div className="speaking-answer-mode" role="group" aria-label="Choose how to answer">
                <button type="button" aria-pressed={answerMode==="record"} disabled={recording || busy || Boolean(pending)}
                  onClick={()=>setAnswerMode("record")}>🎙 Record</button>
                <button type="button" aria-pressed={answerMode==="type"} disabled={recording || busy || Boolean(pending)}
                  onClick={()=>setAnswerMode("type")}>⌨ Type</button>
              </div>
              {answerMode==="record" ? <>
                <SpeakingRecorder recording={recording}
                  disabled={busy || feedbackBusy || expired || Boolean(pending) || Boolean(audioRetry) ||
                    voiceState === "playing" || taskReady || Boolean(session.feedbackStatus) ||
                    (details?.capReached && !session.examTryout)}
                  onRecord={()=>startRecording(false)} onStop={stopRecording}/>
                {studentAudioUrl ? <div className="speaking-recording-preview">
                  <small>Preview your recording</small>
                  <audio ref={studentPlaybackRef} src={studentAudioUrl} preload="metadata" controls
                    aria-label="Listen to your own recording"/>
                </div> : null}
              </> : <div className="speaking-typed-answer">
                <textarea lang="de" aria-label="Type your German answer" rows={3} placeholder="Schreibe deine Antwort auf Deutsch…"
                  value={typedAnswer} maxLength={session.maxTranscriptChars || 600}
                  onChange={event=>setTypedAnswer(event.target.value)}
                  disabled={busy || feedbackBusy || expired || Boolean(pending) || Boolean(audioRetry) || voiceState==="playing" || taskReady}/>
                <button type="button" onClick={submitTypedAnswer}
                  disabled={busy || feedbackBusy || expired || Boolean(pending) || Boolean(audioRetry) ||
                    voiceState==="playing" || taskReady || typedAnswer.trim().length<2}>
                  Send typed answer
                </button>
              </div>}
              {!pending && !taskReady && ["A2-3","B1-1"].includes(session.examFlow?.key) &&
                !recording && !audioRetry && !expired ? <button type="button"
                  className="speaking-skip-question" onClick={()=>confirmTranscript(true)}
                  disabled={busy || feedbackBusy || voiceState === "playing" || requestBusy.current}
                  aria-label="Skip this planning question for zero points">
                  I cannot answer — skip question (0 points)
                </button> : null}
              {pending ? <details className="speaking-exam-transcript" aria-label="Review your words" open>
                <summary>Your transcript</summary>
                <textarea lang="de" aria-label={simulation ? "Recognised speech" : "What I said (you can edit this)"} rows={2}
                  placeholder={pending ? "Review what Falowen heard…" : "Your German words appear here after recording"}
                  value={pending ? recognizedText : ""}
                  readOnly={!pending || (simulation && !pending.typed && !recognitionCorrection)}
                  maxLength={session.maxTranscriptChars || 600}
                  onChange={event=>setRecognizedText(event.target.value)}
                  style={{minWidth:0,minHeight:60,flex:1,resize:"vertical",border:"1px solid #cbd5e1",borderRadius:12,padding:10,fontSize:16,background:pending?"#fff":"#f8fafc"}}/>
                {pending ? <button type="button" aria-label="Confirm answer" title="Confirm answer"
                  onClick={confirmTranscript}
                  disabled={!pending || busy || feedbackBusy || recognizedText.trim().length<2 || (expired && (!examinerSession || Date.now()>Date.parse(session.expiresAt)+300000))}
                  style={{border:"none",borderRadius:12,minWidth:44,padding:"0 10px",background:pending?"#194f49":"#cbd5e1",color:pending?"#fff":"#475569",fontWeight:800,fontSize:20,cursor:pending?"pointer":"not-allowed"}}>
                  Confirm answer
                </button> : null}
              </details> : null}
              {audioRetry ? <div role="group" aria-label="Recover unsent speaking audio" className="speaking-exam-recovery">
                <p role="alert">Your recording is safe on this device. Falowen is checking whether the answer already reached the examiner.</p>
                <div className="speaking-exam-recovery__actions">
                  <button type="button" onClick={retryRecordingUpload} disabled={busy || feedbackBusy}>Check saved answer / retry</button>
                  <button type="button" onClick={()=>{setAudioRetry(null);clearRecording();setErrorMessage("");setNotice("Record a new answer when you are ready.");}} disabled={busy}>Record again instead</button>
                </div>
                {studentAudioUrl ? <small>Your recording remains available in Preview your recording above.</small> : null}
              </div> : null}
              {pending ? (
                <div role="group" aria-label="Review German speech recognition" style={{display:"grid",gap:8}}>
                  <p style={{margin:0,color:"#92400e",fontSize:13}}>{pending.typed ? "Check your typed answer, then confirm it." : "Check what Falowen heard. Confirm to continue."}</p>
                  {pending.uncertain ? <small>Audio unclear. Review the words or record again.</small> : null}
                  {simulation && gradedCourseMock && !pending.typed ? <details className="speaking-mock-transcription-help">
                     <summary>Transcription incorrect?</summary>
                     <p>Correct only words Falowen misheard. Do not improve grammar after recording.</p>
                     <label><input type="checkbox" checked={recognitionCorrection} onChange={event=>{setRecognitionCorrection(event.target.checked);if(!event.target.checked)setRecognizedText(pending.transcript || recognizedText);}}/> Allow speech-to-text correction</label>
                   </details> : simulation && !gradedCourseMock ? <label style={{fontSize:13}}>
                    <input type="checkbox" checked={recognitionCorrection} onChange={event=>{setRecognitionCorrection(event.target.checked);if(!event.target.checked)setRecognizedText(pending.transcript || recognizedText);}}/>
                    Correct a speech-recognition mistake only
                  </label> : null}
                  {studentAudioUrl && !pending.typed && answerMode!=="record" ? <small>Switch to Record to preview your recording.</small> : null}
                  <button type="button" onClick={retryTranscript} disabled={busy} style={{...styles.secondaryButton,justifySelf:"start"}}>{pending.typed ? "Edit typed answer" : "Record again"}</button>
                </div>
              ) : <small style={{color:"#64748b"}}>{voiceState === "playing" ? "The examiner is speaking. The microphone becomes available when the question finishes." : "Tap Record answer when it is your turn. Feedback comes after the task."}</small>}
              {expired ? <p role="status">Your session time has ended. Your answers remain visible. {gradedCourseMock && !taskReady ? "Continue your saved session to finish this part." : "Finish the task to review feedback."}</p> : null}
              {expired && gradedCourseMock && !taskReady ? <button type="button"
                onClick={() => startSession(true)} disabled={busy || feedbackBusy || recording}>
                Continue saved speaking session
              </button> : null}
              {taskReady && !feedbackBusy && errorMessage ? <div className="speaking-exam-session__actions">
                <button type="button" style={styles.primaryButton} onClick={finishExamTask}
                  disabled={busy || recording || Boolean(pending) || !recordedAnswers.length}>Retry feedback</button>
              </div> : null}
              {exitConfirm ? <div role="alertdialog" aria-label="Leave unfinished speaking task" aria-modal="false"
                style={{display:"grid",gap:9,padding:12,border:"1px solid #fbbf24",borderRadius:11,background:"#fffbeb"}}>
                <strong>This Teil isn't complete yet.</strong>
                <p style={{margin:0,fontSize:13}}>Your confirmed answers remain on the server, but you won't receive a completed-task mark or feedback if you leave now.</p>
                <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
                  <button type="button" style={styles.primaryButton} onClick={()=>setExitConfirm(false)}>Keep practising</button>
                  <button type="button" style={styles.secondaryButton} onClick={endSession}>Leave without feedback</button>
                </div>
              </div> : null}
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
      {examFeedback && !deferFeedback ? (
        <section className="speaking-practice-feedback" aria-label="Speaking exam practice feedback"
          style={{...shell,border:"1px solid #bfdbfe",background:"#fff",display:"grid",gap:9}}>
          <h2 style={{margin:0,fontSize:19}}>Your speaking practice feedback</h2>
          {examAssessment ? <div aria-label="Speaking practice score" style={{border:"1px solid #cbd5e1",borderRadius:12,padding:14,display:"grid",gap:8}}>
            <strong style={{fontSize:24}}>{examAssessment.score} / {examAssessment.maxScore} points · {examAssessment.percent}%</strong>
            <small>Falowen CEFR {examAssessment.level} practice assessment — not an official Goethe score.</small>
            {(examAssessment.tasks || []).map(item=><div key={item.step} style={{display:"flex",justifyContent:"space-between",gap:10,fontSize:13}}>
              <span>Task {item.step} · {item.comment || "Reviewed"}</span><strong style={{whiteSpace:"nowrap"}}>{item.score}/{item.maxScore}</strong>
            </div>)}
          </div> : null}
          {details?.lastExamResult?.examTask?.prompt ? <p style={{margin:0,fontSize:13}}>{details.lastExamResult.level} · {details.lastExamResult.examTask.prompt}</p> : null}
          {messages.filter(message => message.role === "user").length ? (
            <details><summary>Your saved answers</summary>
              {messages.filter(message => message.role === "user").map((message,i) => <p key={i} lang="de" style={{lineHeight:1.6}}>{message.text}</p>)}
            </details>
          ) : null}
          <SpeakingFeedback assessment={examAssessment} feedback={examFeedback}/>
          <div className="speaking-exam-feedback-summary" style={{display:"grid",gap:8}}>
            <strong style={{fontSize:14}}>Teil {String(examTask?.teil || details?.lastExamResult?.examTask?.teil || "").match(/\d+/)?.[0] || ""} complete · Feedback saved</strong>

            <button type="button" style={styles.secondaryButton} aria-expanded={showDetailedFeedback}
              onClick={()=>setShowDetailedFeedback(value=>!value)}>
              {showDetailedFeedback ? "Hide detailed feedback" : "View detailed feedback"}
            </button>
            {showDetailedFeedback ? <p style={{margin:0,whiteSpace:"pre-wrap",lineHeight:1.65,fontSize:13}}>{examFeedback}</p> : null}
          </div>
          {onContinueToNext ? <button type="button" style={styles.primaryButton} className="speaking-exam-continue"
            onClick={onContinueToNext}>Continue to Teil {nextExamTeil(safeLevel,examTask?.teil)} →</button>
          : examinerEntry ? <p role="status" style={{fontWeight:700,color:"#166534"}}>This was the final Teil. Review your completed practice in Speaking progress.</p> : null}
          <button type="button" style={styles.secondaryButton}
            onClick={recording ? stopRecording : () => {setLocalRetry(false); clearRecording(); startRecording(true);}}>
            {recording ? "■ Stop recording (" + recordingSeconds + "s)" : "Try your improved answer"}
          </button>
          <small>Use the correction above, record again, and listen back. This recording stays on your device and uses no AI allowance.</small>
          {localRetry && studentAudioUrl ? <audio controls src={studentAudioUrl} aria-label="Listen to your improved answer" style={{width:"100%"}} /> : null}
          <small style={{color:"#64748b"}}>This is practice feedback from reviewed transcripts, not an official Goethe result. Pronunciation cannot be scored from these transcripts.</small>
        </section>
      ) : null}
      {examinerEntry && resetConfirm ? <div role="alertdialog" aria-label="Reset speaking session" aria-modal="false" className="speaking-reset-confirm">
        <strong>Start this speaking part again?</strong>
        <p>The unfinished session will end. Completed practice stays saved. A new AI session may use another allowance.</p>
        <div>
          <button type="button" onClick={()=>setResetConfirm(false)} disabled={resetting}>Keep practising</button>
          <button type="button" onClick={resetExamSession} disabled={resetting || recording || feedbackBusy}>
            {resetting ? "Resetting…" : "Reset session"}
          </button>
        </div>
      </div> : null}
      {notice && !gradedCourseMock ? <p role="status" style={{...shell,background:"#eff6ff",margin:0}}>{notice}</p> : null}
      {errorMessage ? <p role="alert" style={{...shell,background:"#fef2f2",color:"#991b1b",margin:0}}>{errorMessage}</p> : null}

    </Container>
  );
}
