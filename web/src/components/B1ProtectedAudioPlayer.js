import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchB1AudioPlaybackUrl } from "../services/b1AudioService";
import { styles } from "../styles";

export default function B1ProtectedAudioPlayer({ day, audioKey, title = "B1 Hören" }) {
  const { idToken } = useAuth();
  const [audioUrl, setAudioUrl] = useState("");
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [refreshNonce, setRefreshNonce] = useState(0);
  const retryRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const key = String(audioKey || "").trim();

    if (!key) {
      setAudioUrl("");
      setState("error");
      setError("Für diese Hörübung wurde keine Audiodatei eingetragen.");
      return () => {
        cancelled = true;
      };
    }

    if (!idToken) {
      setAudioUrl("");
      setState("error");
      setError("Bitte melden Sie sich erneut an, um das Audio abzuspielen.");
      return () => {
        cancelled = true;
      };
    }

    setState("loading");
    setError("");
    fetchB1AudioPlaybackUrl({ day, key, idToken })
      .then(({ url }) => {
        if (cancelled) return;
        setAudioUrl(url);
        setState("ready");
      })
      .catch((requestError) => {
        if (cancelled) return;
        setAudioUrl("");
        setState("error");
        setError(
          requestError?.response?.data?.error ||
            requestError?.message ||
            "Das Audio konnte nicht geladen werden.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [day, audioKey, idToken, refreshNonce]);

  const refreshAudio = () => {
    retryRef.current = 0;
    setRefreshNonce((value) => value + 1);
  };

  const handleAudioError = () => {
    if (retryRef.current < 1) {
      retryRef.current += 1;
      setRefreshNonce((value) => value + 1);
      return;
    }
    setState("error");
    setError("Das Audio konnte nicht abgespielt werden. Bitte laden Sie es erneut.");
  };

  const handleCanPlay = () => {
    retryRef.current = 0;
    setState("ready");
    setError("");
  };

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {state === "loading" ? (
        <div style={{ padding: 12, borderRadius: 12, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <strong>Audio wird geladen …</strong>
          <div style={{ marginTop: 4, color: "#475569" }}>
            Falowen bereitet die geschützte Aufnahme für die Wiedergabe vor.
          </div>
        </div>
      ) : null}

      {audioUrl ? (
        <div style={{ padding: 12, borderRadius: 12, background: "#ffffff", border: "1px solid #e2e8f0", display: "grid", gap: 8 }}>
          <strong>{title}</strong>
          <audio
            data-b1-r2-audio="true"
            controls
            preload="metadata"
            src={audioUrl}
            onError={handleAudioError}
            onCanPlay={handleCanPlay}
            style={{ width: "100%" }}
          >
            Ihr Browser unterstützt die Audiowiedergabe nicht.
          </audio>
          <span style={{ color: "#64748b", fontSize: 13 }}>
            Die Aufnahme wird direkt in Falowen abgespielt.
          </span>
        </div>
      ) : null}

      {state === "error" ? (
        <div role="alert" style={{ padding: 12, borderRadius: 12, background: "#fff7f7", border: "1px solid #fecaca", display: "grid", gap: 8 }}>
          <strong>Audio momentan nicht verfügbar</strong>
          <span>{error}</span>
          <div>
            <button type="button" onClick={refreshAudio} style={styles.secondaryButton}>
              Audio erneut laden
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
