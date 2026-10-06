import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchA1AudioPlaybackUrl } from "../services/a1AudioService";

export default function A1ProtectedAudioPlayer({ day, audioKey }) {
  const { idToken } = useAuth();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const retry = useRef(0);

  useEffect(() => {
    let cancelled = false;
    setUrl("");
    setError("");
    setLoading(true);
    if (!idToken) {
      setLoading(false);
      setError("Bitte melden Sie sich an, um das Audio abzuspielen.");
      return undefined;
    }
    fetchA1AudioPlaybackUrl({ day, key: audioKey, idToken })
      .then((playback) => { if (!cancelled) setUrl(playback.url); })
      .catch((failure) => {
        if (!cancelled) setError(failure?.response?.data?.error || failure?.message || "Das Audio konnte nicht geladen werden.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [day, audioKey, idToken, revision]);

  const reload = () => { retry.current = 0; setRevision((value) => value + 1); };
  const handleError = () => {
    if (!url) return;
    if (retry.current < 1) {
      retry.current += 1;
      setRevision((value) => value + 1);
    } else {
      setError("Das Audio konnte nicht abgespielt werden. Bitte laden Sie es erneut.");
    }
  };

  return <div style={{ display: "grid", gap: 8 }}>
    <audio data-a1-r2-audio="true" aria-label={`A1 Day ${day} Hören`} controls preload="metadata" src={url || undefined} onError={handleError} onCanPlay={() => { retry.current = 0; setError(""); }} style={{ width: "100%" }}>
      Ihr Browser unterstützt dieses Audio nicht.
    </audio>
    {loading ? <span role="status">Audio wird geladen …</span> : null}
    {error ? <div role="alert"><p>{error}</p><button type="button" onClick={reload}>Audio erneut laden</button></div> : null}
  </div>;
}
