import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { backendUrl } from "../services/aiClient";
import { styles } from "../styles";

const MAX_RECORDING_SECONDS = 20;
const MAX_AUDIO_BYTES = 350000;
const shell = { ...styles.card, padding: "clamp(16px, 4vw, 28px)", borderRadius: 18 };
const friendlyTime = (value) => {
  const seconds = Math.max(0, Math.ceil(value / 1000));
  return String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0");
};
const allowedCheckout = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && ["paystack.com", "checkout.paystack.com"].includes(parsed.hostname);
  } catch (_err) { return false; }
};
const toBase64 = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error("Unable to read the recording."));
  reader.onload = () => resolve(String(reader.result || "").split(",")[1] || "");
  reader.readAsDataURL(blob);
});
const voiceTypes = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm", "audio/ogg"];

export default function LiveSpeakPage() {
  const { user, idToken, studentProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [session, setSession] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [messages, setMessages] = useState([]);
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
  const safeLevel = /^(A1|A2|B1|B2|C1|C2)$/.test(level) ? level : "A2";

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
    };
  }, [refresh]);

  useEffect(() => {
    if (!session) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [session]);

  useEffect(() => {
    const reference = new URLSearchParams(location.search).get("reference") ||
      new URLSearchParams(location.search).get("trxref");
    if (!reference || !idToken) return undefined;
    let canceled = false;
    setNotice("Checking your Live Speak payment with Paystack...");
    api("/live-speak/payment/verify", "POST", {reference})
      .then(result => {
        if (canceled) return;
        setNotice(result.paid ? "Payment confirmed. Your speaking sessions are ready." :
          "Paystack has not confirmed your payment yet. Please refresh this page shortly.");
        refresh();
      }).catch(err => { if (!canceled) setErrorMessage(err.message); })
      .finally(() => { if (!canceled) navigate("/campus/live-speak", {replace:true}); });
    return () => { canceled = true; };
  }, [api, idToken, location.search, navigate, refresh]);

  const stopAudio = () => {
    voiceRef.current?.pause();
    voiceRef.current = null;
    setVoiceReady(false);
  };

  const playVoice = async (base64) => {
    stopAudio();
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

  const startSession = async () => {
    if (busy || session) return;
    setBusy(true);
    setErrorMessage("");
    try {
      const result = await api("/live-speak/session/start", "POST", {level:safeLevel});
      setSession(result);
      setMessages([]);
      setLastAudio("");
      setNow(Date.now());
      // Release busy before greeting turn; the greeting is a metered server call.
      setBusy(false);
      await sendTurn(result, {intro:true});
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
    setNotice("Your conversation has ended. Review your corrections and phrases below.");
    try { await api("/live-speak/session/end", "POST", { sessionId: existing.sessionId }); }
    catch (_error) { /* The server expiry and quotas still apply. */ }
    refresh();
  };

  const startRecording = async () => {
    if (!session || busy || recording || now >= Date.parse(session.expiresAt)) return;
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

  const checkout = async () => {
    setBusy(true);
    setErrorMessage("");
    try {
      const result = await api("/live-speak/checkout", "POST", {});
      if (!allowedCheckout(result.authorization_url)) throw new Error("Unexpected payment destination.");
      window.location.assign(result.authorization_url);
    } catch (err) { setErrorMessage(err.message); setBusy(false); }
  };
  const claimTrial = async () => {
    setBusy(true);
    setErrorMessage("");
    try {
      await api("/live-speak/trial", "POST", {});
      setNotice("Your two free trial sessions are available.");
      await refresh();
    } catch (err) { setErrorMessage(err.message); }
    finally { setBusy(false); }
  };

  const timeRemaining = session ? Math.max(0, Date.parse(session.expiresAt) - now) : 0;
  const expired = Boolean(session) && timeRemaining <= 0;
  const sessionsAvailable = Number(details?.remaining) > 0 && !details?.capReached;
  return (
    <main style={{ ...styles.container, maxWidth: 940, paddingBottom: 65, display:"grid", gap:16 }}>
      <Link to="/" style={{ color:"#1d4ed8", fontWeight:700, textDecoration:"none" }}>← Back to Falowen</Link>
      <section style={{ ...shell, background:"linear-gradient(135deg,#132f67,#145b8f)",color:"#fff" }}>
        <p style={{ margin:0, letterSpacing:1, textTransform:"uppercase",fontSize:12 }}>Optional speaking add-on</p>
        <h1 style={{ margin:"8px 0",color:"#fff",fontSize:"clamp(27px,6vw,39px)" }}>Falowen Live Speak</h1>
        <p style={{ margin:0,color:"#e0efff",lineHeight:1.6 }}>Speak German with a natural AI voice, hear a gentle correction after your turn, and keep the conversation going. Five-minute sessions. No continuous listening.</p>
      </section>

      {loading ? <section style={shell}>Checking your speaking allowance…</section> : null}
      {!loading && details && !details.enabled ? (
        <section style={{ ...shell, background:"#f8fafc" }}>
          <h2 style={{ margin:0 }}>Live Speak pilot is being prepared</h2>
          <p>This add-on is not accepting payments or generating premium audio yet. Existing Goethe Free Sprechen Chat and Speaking Trainer remain available with your course.</p>
          <Link to="/campus/speaking" style={styles.secondaryButton}>Use existing speaking practice</Link>
        </section>
      ) : null}

      {details?.enabled ? (
        <>
          <section style={shell}>
            <h2 style={{ marginTop:0 }}>Your Live Speak access</h2>
            <p style={{fontSize:16, margin:"6px 0"}}><strong>{details.remaining || 0}</strong> sessions remaining · 5 minutes each</p>
            <p style={{color:"#475569",fontSize:13}}>
              {details.expiresAt ? "Available until " + new Date(details.expiresAt).toLocaleDateString() + "." : "No active package."}
              {" "}Each session supports up to 10 short speaking turns.
            </p>
            {details.capReached ? <p role="alert">The pilot's monthly AI spending limit has been reached. New speaking turns are paused.</p> : null}
            {!session && sessionsAvailable ? (
              <button type="button" style={styles.primaryButton} onClick={startSession} disabled={busy}>
                {busy ? "Starting..." : "Start 5-minute conversation"}
              </button>
            ) : null}
          </section>

          {!session && (!sessionsAvailable || !details.remaining) ? (
            <section style={shell}>
              <h2 style={{marginTop:0}}>Live Speak Basic</h2>
              <p style={{fontSize:26,fontWeight:800,margin:"4px 0"}}>GH₵40 <span style={{fontSize:13,fontWeight:400}}>per 8-session package</span></p>
              <p>Eight five-minute conversations to use within 30 days. One-time Paystack payment, no automatic renewal. A small shared transaction fee is shown at checkout.</p>
              {details.trialAvailable ? (
                <button type="button" style={styles.secondaryButton} onClick={claimTrial} disabled={busy}>Try 2 free sessions first</button>
              ) : null}
              <button type="button" style={{...styles.primaryButton, marginLeft:8}} onClick={checkout} disabled={busy || details.capReached}>
                {busy ? "Please wait..." : "Buy 8 sessions"}
              </button>
            </section>
          ) : null}
        </>
      ) : null}

      {session ? (
        <section style={{ ...shell, display:"grid", gap:14 }}>
          <header style={{display:"flex",gap:12,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>
            <div>
              <h2 style={{margin:0}}>German conversation · {safeLevel}</h2>
              <p style={{margin:"5px 0",color:"#475569"}}>The tutor will speak first, then listen to each response.</p>
            </div>
            <strong style={{fontSize:24,color:expired?"#b91c1c":"#145b8f"}} aria-live="off">{friendlyTime(timeRemaining)}</strong>
          </header>
          <div aria-live="polite" style={{display:"grid",gap:10,maxHeight:430,overflowY:"auto"}}>
            {messages.map((message,i) => (
              <div key={i} style={{background:message.role==="assistant"?"#eff6ff":"#f0fdf4",borderRadius:14,padding:13,marginLeft:message.role==="user"?30:0,marginRight:message.role==="assistant"?30:0}}>
                <strong>{message.role==="assistant"?"AI German tutor":"You"}</strong>
                <p style={{margin:"7px 0 0",lineHeight:1.65}} lang="de">{message.text}</p>
              </div>
            ))}
            {busy ? <p>Listening, correcting and preparing a German voice reply…</p> : null}
          </div>
          {lastAudio && voiceReady ? <button type="button" style={styles.secondaryButton} onClick={()=>playVoice(lastAudio)}>▶ Play AI voice again</button> : null}
          {expired ? <p role="status">Your five-minute session has ended. Your corrections remain visible here.</p> : null}
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button type="button" style={styles.primaryButton}
              onClick={recording?stopRecording:startRecording}
              disabled={busy || expired}>
              {recording ? "■ Stop & send (" + recordingSeconds + "s)" : "🎤 Speak German"}
            </button>
            <button type="button" style={styles.secondaryButton} onClick={endSession}>End session</button>
          </div>
          <small style={{color:"#475569"}}>Speak for 2–20 seconds per turn. Your audio is processed for this reply and is not saved to your student results.</small>
        </section>
      ) : null}

      {notice ? <p role="status" style={{...shell,background:"#eff6ff",margin:0}}>{notice}</p> : null}
      {errorMessage ? <p role="alert" style={{...shell,background:"#fef2f2",color:"#991b1b",margin:0}}>{errorMessage}</p> : null}
      <section style={shell}>
        <h2 style={{marginTop:0}}>What's included and what's not</h2>
        <p>Live Speak is an optional premium voice add-on. Your usual course, Goethe Free Sprechen Chat and Speaking Trainer are not replaced or removed. AI corrections concern grammar and communication; this feature does not claim precise phonetic pronunciation scores.</p>
        <p style={{marginBottom:0,color:"#475569",fontSize:13}}>AI-generated voice. Natural German pronunciation can vary; please report any incorrect audio. No subscription renewal, no unexpected overage charges. Full session access and budget limits are verified by the server.</p>
      </section>
    </main>
  );
}
