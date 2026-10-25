import React from "react";
import { A1_KOMBI_READING_PAPERS } from "../data/a1KombiReadingPapers";

// Source text retains the original contexts and statements; no answers are shipped.
export default function A1KombiReadingSection({mockNumber,answers={},onChange}){
 const paper=A1_KOMBI_READING_PAPERS[mockNumber];
 if(!paper) return <p role="alert">Reading paper not available.</p>;
 return <div className="a1-kombi-reading">
  <p>Lesen Sie alle Texte und Aufgaben auf dem Prüfungsblatt. Wählen Sie danach Ihre Antworten. Teil 1 und Teil 3: Richtig/Falsch. Teil 2: Anzeige a/b.</p>
  <div style={{whiteSpace:"pre-wrap",fontFamily:"inherit",lineHeight:1.65,padding:"1rem",background:"#fff",border:"1px solid #e2e8f0",borderRadius:12}}>{paper.paperText}</div>
  {["Teil 1 · Aufgaben 1–5","Teil 2 · Aufgaben 6–10","Teil 3 · Aufgaben 11–15"].map((label,i)=>
  <fieldset key={label} style={{marginTop:20,padding:16,border:"1px solid #dbe2ea",borderRadius:10}}>
   <legend style={{fontWeight:700}}>{label}</legend>
   {Array.from({length:5},(_,j)=>i*5+j+1).map(n=>{
    const id=`t${i+1}-${n}`,choices=i===1?["a","b"]:["richtig","falsch"];
    return <fieldset key={id} style={{margin:"12px 0",padding:10,border:"1px solid #edf2f7",borderRadius:8}}>
      <legend>Aufgabe {n}</legend>
      {choices.map(choice=><label key={choice} style={{display:"inline-flex",alignItems:"center",gap:7,marginRight:20}}>
        <input type="radio" name={`lesen-${id}`} value={choice} checked={answers[id]===choice} onChange={()=>onChange(id,choice)} />
        {choice==="richtig"?"Richtig":choice==="falsch"?"Falsch":choice}
      </label>)}
    </fieldset>;
   })}
  </fieldset>)}
 </div>;
}
