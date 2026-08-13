import React from "react";
import {styles} from "../styles";
import {getC2Day1To7Mastery} from "../data/c2Day1To7Mastery";
import C2Day1GuidedWorkbookPage from "./C2Day1GuidedWorkbookPage";
import C2Days2To5GuidedWorkbookPage from "./C2Days2To5GuidedWorkbookPage";

const C2Day1To7MasteryPage=({lesson})=>{
 const day=Number(lesson?.day||0);
 if(day===1)return <C2Day1GuidedWorkbookPage lesson={lesson}/>;
 if(day>=2&&day<=5)return <C2Days2To5GuidedWorkbookPage lesson={lesson}/>;
 const d=lesson?.c2Mastery||getC2Day1To7Mastery(day);
 if(!d)return null;
 const card={...styles.card,display:"grid",gap:10};
 return <main style={{...styles.container,display:"grid",gap:14}} data-c2-mastery-day={day}>
  <header style={card}><strong>C2 · Day {day} · Chapter {d.chapter}</strong><h1 style={{...styles.title,margin:0}}>{d.title}</h1><p>{d.topic}</p><strong>{d.grammarFocus}</strong><p>C2 focus: correctness, precision, register, nuance and natural collocation.</p></header>
  <section style={card}><h2>Lernziele</h2><ul>{d.objectives.map(x=><li key={x}>{x}</li>)}</ul></section>
  <section style={card}><h2>Präziser Wortschatz</h2>{d.vocabulary.map(([a,b])=><p key={a}><strong>{a}</strong> — {b}</p>)}</section>
  <section style={card}><h2>Kollokationen</h2>{d.collocations.map(([a,b,c])=><div key={a}><strong>{a}</strong> — {b}<p>{c}</p></div>)}</section>
  <section style={card}><h2>Grammar & Style Contrast</h2>{d.contrast.map((x,i)=><p key={x}><strong>Version {i+1}:</strong> {x}</p>)}<p>Use complexity only when it adds precision, distance, focus or appropriate register.</p></section>
  <section style={card}><h2>Meaning & Nuance Check</h2><p><strong>{d.nuance.q}</strong></p><ol>{d.nuance.o.map(x=><li key={x}>{x}</li>)}</ol><details><summary>Show answer and explanation</summary><p><strong>{d.nuance.o[d.nuance.a]}</strong></p><p>{d.nuance.e}</p></details></section>
  <section style={card}><h2>Reformulation</h2><p><strong>Starting version:</strong> {d.reformulation[0]}</p><details><summary>Show one C2 model</summary><p>{d.reformulation[1]}</p></details></section>
  <section style={card}><h2>Original Production</h2><p>{d.production}</p></section>
  <section style={card}><h2>C2 Challenge</h2><p>{d.challenge}</p><strong>Final check: precision · register · nuance · natural collocation.</strong></section>
 </main>;
};
export default C2Day1To7MasteryPage;
