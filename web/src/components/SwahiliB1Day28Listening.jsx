import SwahiliObjectiveQuestions from "./SwahiliObjectiveQuestions";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const listeningQuestions = [
  { id: "listen-plastic", choices: ["Ni rahisi kubeba na haigharimu pesa nyingi.","Ni imara na zinaweza kutumiwa kwa miaka mingi.","Ni nzito na zinagharimu pesa nyingi."], prompt: "Kwa nini mwanzoni Juma anapendelea mifuko ya plastiki? Taja sababu mbili." },
  { id: "listen-cloth", choices: ["Anasema inachanika baada ya matumizi ya kwanza.","Anasema inapaswa kutupwa kila siku.","Anasema ina nguvu na inaweza kutumiwa tena na tena kwa miaka mingi."], prompt: "Amina anajibu nini Juma anapouliza kama mifuko ya kitambaa inaweza kuchanika kwa urahisi?" },
  { id: "listen-remember", choices: ["Kwenye duka la nguo.","Kwenye gari lake au katika mfuko anaobeba kila siku.","Kwenye ofisi ya muuzaji."], prompt: "Amina anapendekeza Juma aweke mifuko yake wapi ili aikumbuke anapoenda kununua vitu? Taja sehemu moja." },
  { id: "listen-tomorrow", choices: ["Kuanzia kesho, ili kupunguza taka za plastiki mtaani mwao.","Kuanzia mwezi ujao, ili kununua bidhaa nyingi.","Kuanzia wiki ijayo, ili kuongeza matumizi ya plastiki."], prompt: "Juma anakubali kubadili tabia yake kuanzia lini, na kwa lengo gani?" },
  { id: "listen-compost", choices: ["Kutengeneza plastiki na kuitumia dukani.","Kutengeneza mifuko na kuitumia sokoni.","Wanaweza kutengeneza mbolea na kuitumia katika bustani yao."], prompt: "Kulingana na Amina, wanaweza kutumia taka za kikaboni kutengeneza nini, na watakitumia wapi?" },
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
    <p>Sikiliza mazungumzo ya Amina na Juma mara mbili. Kisha chagua jibu moja kwa kila swali.</p>
    {listeningAudio.url
      ? <audio controls preload="none" src={listeningAudio.url} aria-label="Mazungumzo ya Amina na Juma"
          onError={() => setListeningAudio({ url: "", loading: false, error: "Sauti haikupatikana. Jaribu tena." })} />
      : <button type="button" disabled={listeningAudio.loading} onClick={loadListeningAudio}>
          {listeningAudio.loading ? "Inapakia…" : "Pakua sauti ili usikilize"}
        </button>}
    {listeningAudio.error && <p role="alert">{listeningAudio.error}</p>}
    <SwahiliObjectiveQuestions questions={listeningQuestions} answers={answers} onAnswer={onAnswer} groupName="listening" />
  </>;
}
