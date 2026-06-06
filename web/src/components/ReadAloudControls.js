import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";

const DEFAULT_RATE = 0.82;
const DEFAULT_PITCH = 0.96;
const MAX_UTTERANCE_LENGTH = 1700;

const cleanText = (value = "") =>
  String(value || "")
    .replace(/Open Teil 4 audio/gi, "")
    .replace(/Reminder:.*?Submission tab\./gi, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/[•●▪▫]/g, ". ")
    .replace(/\s*→\s*/g, ", dann ")
    .replace(/\s+/g, " ")
    .replace(/\.{2,}/g, ".")
    .trim();

const normalizeVoiceText = (value = "") =>
  cleanText(value)
    .replace(/AI/gi, "A I")
    .replace(/C1/g, "C eins")
    .replace(/B2/g, "B zwei")
    .replace(/B1/g, "B eins")
    .replace(/A2/g, "A zwei")
    .replace(/A1/g, "A eins")
    .replace(/Mark My Letter/gi, "Mark my Letter")
    .replace(/Falowen/gi, "Falowen")
    .trim();

const splitReadableText = (text = "") => {
  const cleaned = normalizeVoiceText(text);
  if (cleaned.length <= MAX_UTTERANCE_LENGTH) return [cleaned].filter(Boolean);

  const sentences = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleaned];
  const chunks = [];
  let current = "";

  sentences.forEach((sentence) => {
    const next = `${current} ${sentence}`.trim();
    if (next.length > MAX_UTTERANCE_LENGTH && current) {
      chunks.push(current.trim());
      current = sentence.trim();
      return;
    }
    current = next;
  });

  if (current.trim()) chunks.push(current.trim());
  return chunks;
};

const voiceScore = (voice) => {
  const name = String(voice?.name || "").toLowerCase();
  const lang = String(voice?.lang || "").toLowerCase();
  let score = 0;

  if (lang === "de-de") score += 100;
  else if (lang.startsWith("de")) score += 70;

  if (/google.*deutsch|google.*german/.test(name)) score += 45;
  if (/microsoft.*katja|microsoft.*conrad|microsoft.*de/.test(name)) score += 45;
  if (/anna|markus|katja|conrad|petra|helena|siri.*deutsch|premium|enhanced|natural/.test(name)) score += 35;
  if (/german|deutsch/.test(name)) score += 25;
  if (voice?.localService === false) score += 8;
  if (/compact|basic|default/.test(name)) score -= 20;

  return score;
};

const getGermanVoice = () => {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  const germanVoices = voices.filter((voice) => String(voice.lang || "").toLowerCase().startsWith("de"));
  if (!germanVoices.length) return null;

  return [...germanVoices].sort((a, b) => voiceScore(b) - voiceScore(a))[0];
};

const describeVoiceQuality = (voice) => {
  if (!voice) return "No German voice installed in this browser.";
  const score = voiceScore(voice);
  if (score >= 130) return `Using clearer German voice: ${voice.name}`;
  if (score >= 95) return `Using German voice: ${voice.name}`;
  return `Using browser German voice: ${voice.name}. If it sounds rough, try Chrome/Edge on desktop or install a German system voice.`;
};

const ReadAloudControls = ({ text, getText, title = "Read text aloud", compact = false }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [message, setMessage] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("");
  const [voicesReady, setVoicesReady] = useState(false);
  const utteranceRef = useRef(null);
  const chunksRef = useRef([]);
  const chunkIndexRef = useRef(0);

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window);
  }, []);

  useEffect(() => {
    if (!isSupported || typeof window === "undefined") return undefined;

    const loadVoices = () => {
      window.speechSynthesis.getVoices();
      const voice = getGermanVoice();
      setVoiceMessage(describeVoiceQuality(voice));
      setVoicesReady(Boolean(voice));
    };

    loadVoices();
    const timeout = setTimeout(loadVoices, 400);
    window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);
    return () => {
      clearTimeout(timeout);
      window.speechSynthesis.removeEventListener?.("voiceschanged", loadVoices);
    };
  }, [isSupported]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const availableText = useMemo(() => cleanText(text), [text]);

  const resolveText = () => cleanText(typeof getText === "function" ? getText() : availableText);

  const stop = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    chunksRef.current = [];
    chunkIndexRef.current = 0;
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const speakChunk = (chunks, index = 0) => {
    if (!chunks[index]) {
      utteranceRef.current = null;
      chunksRef.current = [];
      chunkIndexRef.current = 0;
      setIsSpeaking(false);
      setIsPaused(false);
      setMessage("Finished reading.");
      return;
    }

    const voice = getGermanVoice();
    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.lang = voice?.lang || "de-DE";
    utterance.rate = Number(rate) || DEFAULT_RATE;
    utterance.pitch = DEFAULT_PITCH;
    utterance.volume = 1;
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setVoiceMessage(describeVoiceQuality(voice));
      setMessage(chunks.length > 1 ? `Reading in German... part ${index + 1}/${chunks.length}` : "Reading in German...");
    };
    utterance.onpause = () => {
      setIsPaused(true);
      setMessage("Paused.");
    };
    utterance.onresume = () => {
      setIsPaused(false);
      setMessage(chunks.length > 1 ? `Reading in German... part ${index + 1}/${chunks.length}` : "Reading in German...");
    };
    utterance.onend = () => {
      if (chunksRef.current.length && chunkIndexRef.current < chunksRef.current.length - 1) {
        chunkIndexRef.current += 1;
        window.setTimeout(() => speakChunk(chunksRef.current, chunkIndexRef.current), 160);
        return;
      }
      utteranceRef.current = null;
      chunksRef.current = [];
      chunkIndexRef.current = 0;
      setIsSpeaking(false);
      setIsPaused(false);
      setMessage("Finished reading.");
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setMessage("Could not read the text clearly. Try again, reduce the speed, or use Chrome/Edge/Safari with a German voice installed.");
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const play = () => {
    if (!isSupported) {
      setMessage("Read aloud is not supported in this browser.");
      return;
    }

    const readableText = resolveText();
    if (!readableText) {
      setMessage("No reading text found on this page.");
      return;
    }

    window.speechSynthesis.cancel();
    const chunks = splitReadableText(readableText);
    chunksRef.current = chunks;
    chunkIndexRef.current = 0;

    const voice = getGermanVoice();
    setVoiceMessage(describeVoiceQuality(voice));
    if (!voice) {
      setMessage("No German voice was found in this browser. The audio may sound unclear until a German voice is installed.");
    }

    window.setTimeout(() => speakChunk(chunks, 0), 80);
  };

  const pause = () => {
    if (!isSupported || !isSpeaking || isPaused) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    if (!isSupported || !isSpeaking || !isPaused) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const handleRateChange = (event) => {
    const nextRate = Number(event.target.value);
    setRate(nextRate);
    if (isSpeaking) {
      setMessage("Speed changed. Press Play again to restart with the new speed.");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #bfdbfe",
        borderRadius: 14,
        padding: compact ? 10 : 12,
        background: "#eff6ff",
        color: "#1e3a8a",
        display: "grid",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <strong>{title}</strong>
          <p style={{ ...styles.helperText, margin: "3px 0 0", color: "#1e40af" }}>
            German read aloud · clearer voice selection · slow practice speed
          </p>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
          Speed
          <select value={rate} onChange={handleRateChange} style={{ ...styles.select, width: 92, margin: 0 }}>
            <option value={0.7}>0.7x</option>
            <option value={0.82}>0.82x</option>
            <option value={0.9}>0.9x</option>
            <option value={1}>1.0x</option>
            <option value={1.1}>1.1x</option>
          </select>
        </label>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" style={styles.primaryButton} onClick={play} disabled={!isSupported}>
          ▶ Play clearer German
        </button>
        <button type="button" style={styles.secondaryButton} onClick={pause} disabled={!isSupported || !isSpeaking || isPaused}>
          ⏸ Pause
        </button>
        <button type="button" style={styles.secondaryButton} onClick={resume} disabled={!isSupported || !isSpeaking || !isPaused}>
          ▶ Continue
        </button>
        <button type="button" style={styles.dangerButton || styles.secondaryButton} onClick={stop} disabled={!isSupported || !isSpeaking}>
          ⏹ Stop
        </button>
      </div>

      {!isSupported ? (
        <p style={{ ...styles.helperText, margin: 0, color: "#991b1b" }}>
          Your browser does not support read aloud. Try Chrome, Edge or Safari.
        </p>
      ) : null}
      {isSupported && !voicesReady ? (
        <p style={{ ...styles.helperText, margin: 0, color: "#92400e" }}>
          German voice is loading. If the voice sounds unclear, try again after a few seconds.
        </p>
      ) : null}
      {voiceMessage ? <p style={{ ...styles.helperText, margin: 0, color: "#1e40af" }}>{voiceMessage}</p> : null}
      {message ? <p style={{ ...styles.helperText, margin: 0, color: "#1e40af" }}>{message}</p> : null}
    </div>
  );
};

export default ReadAloudControls;
