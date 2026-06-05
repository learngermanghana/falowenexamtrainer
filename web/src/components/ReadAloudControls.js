import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";

const DEFAULT_RATE = 0.9;

const cleanText = (value = "") =>
  String(value || "")
    .replace(/\s+/g, " ")
    .replace(/Open Teil 4 audio/gi, "")
    .replace(/Reminder:.*?Submission tab\./gi, "")
    .trim();

const getGermanVoice = () => {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  return (
    voices.find((voice) => voice.lang?.toLowerCase() === "de-de") ||
    voices.find((voice) => voice.lang?.toLowerCase().startsWith("de")) ||
    null
  );
};

const ReadAloudControls = ({ text, getText, title = "Read text aloud", compact = false }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [message, setMessage] = useState("");
  const utteranceRef = useRef(null);

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window);
  }, []);

  useEffect(() => {
    if (!isSupported || typeof window === "undefined") return undefined;
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", loadVoices);
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
    setIsSpeaking(false);
    setIsPaused(false);
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
    const utterance = new SpeechSynthesisUtterance(readableText);
    utterance.lang = "de-DE";
    utterance.rate = Number(rate) || DEFAULT_RATE;
    utterance.pitch = 1;
    utterance.voice = getGermanVoice();
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setMessage("Reading in German...");
    };
    utterance.onpause = () => {
      setIsPaused(true);
      setMessage("Paused.");
    };
    utterance.onresume = () => {
      setIsPaused(false);
      setMessage("Reading in German...");
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setMessage("Finished reading.");
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setMessage("Could not read the text aloud. Try again or use another browser.");
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
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
            German browser voice · free · best for Lesen practice
          </p>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
          Speed
          <select value={rate} onChange={handleRateChange} style={{ ...styles.select, width: 92, margin: 0 }}>
            <option value={0.75}>0.75x</option>
            <option value={0.9}>0.9x</option>
            <option value={1}>1.0x</option>
            <option value={1.1}>1.1x</option>
            <option value={1.25}>1.25x</option>
          </select>
        </label>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" style={styles.primaryButton} onClick={play} disabled={!isSupported}>
          ▶ Play
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
      {message ? <p style={{ ...styles.helperText, margin: 0, color: "#1e40af" }}>{message}</p> : null}
    </div>
  );
};

export default ReadAloudControls;
