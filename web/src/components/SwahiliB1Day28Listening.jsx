import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const listeningQuestions = [
  { id: "listen-plastic", prompt: "Kwa nini mwanzoni Juma anapendelea mifuko ya plastiki? Taja sababu mbili." },
  { id: "listen-cloth", prompt: "Amina anajibu nini Juma anapouliza kama mifuko ya kitambaa inaweza kuchanika kwa urahisi?" },
  { id: "listen-remember", prompt: "Amina anapendekeza Juma aweke mifuko yake wapi ili aikumbuke anapoenda kununua vitu? Taja sehemu moja." },
  { id: "listen-tomorrow", prompt: "Juma anakubali kubadili tabia yake kuanzia lini, na kwa lengo gani?" },
  { id: "listen-compost", prompt: "Kulingana na Amina, wanaweza kutumia taka za kikaboni kutengeneza nini, na watakitumia wapi?" },
];

export default function SwahiliB1Day28Listening({ answers, onAnswer }) {
  const { user } = useAuth();
  const [listeningAudio, setListeningAudio] = useState({ url: "", loading: false, error: "" });
  async function loadListeningAudio() {
    if (listeningAudio.loading) return;
    if (!user?.getIdToken) {
      setListeningAudio({ url: "", loading: false, error: "Ingia kwenye akaunti yako ili kusikiliza sauti. Sign in to play the recording." });
      return;
    }
    setListeningAudio(current => ({ ...current, loading: true, error: "" }));
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/course-media/swahili/b1/day-28/audio-url", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok || !result?.url) throw new Error(result?.error || "Could not load the listening recording.");
      setListeningAudio({ url: result.url, loading: false, error: "" });
    } catch (error) {
      setListeningAudio({ url: "", loading: false, error: error.message || "Could not load the listening recording." });
    }
  }

  return <>
    <h2>4 · Kusikiliza</h2>
    <p>Sikiliza mazungumzo ya Amina na Juma mara mbili. Kisha jibu maswali kwa Kiswahili.</p>
    {listeningAudio.url
      ? <audio controls src={listeningAudio.url} aria-label="Mazungumzo ya Amina na Juma"
          onError={() => setListeningAudio({ url: "", loading: false, error: "Sauti haikupatikana. Jaribu tena." })} />
      : <button type="button" disabled={listeningAudio.loading} onClick={loadListeningAudio}>
          {listeningAudio.loading ? "Inapakia…" : "Pakua sauti ili usikilize"}
        </button>}
    {listeningAudio.error && <p role="alert">{listeningAudio.error}</p>}
    <ol>{listeningQuestions.map(({ id, prompt }) => (
      <li key={id}><label htmlFor={id}>{prompt}</label>
        <textarea id={id} rows={3} value={answers[id] || ""} onChange={event => onAnswer(id, event.target.value)} />
      </li>
    ))}</ol>
  </>;
}
