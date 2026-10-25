import React from "react";
import { A2_KOMBI_MOCK_CONTENT } from "../data/a2KombiMockContent";
import "./A2GoetheReadingMockPreview.css";
import "./A1FinalMockExamPage.css";

// Reuses the four-part A2 Mock 1 reading design. Keys stay server-side.
export default function A2KombiReadingSection({mockNumber,answers={},onChange}){
 const p=A2_KOMBI_MOCK_CONTENT[mockNumber]?.reading;
 if(!p) return <p role="alert">Reading paper is unavailable.</p>;
 const choices=(q,part)=>(
  <div className="a2-mock-choice-list" role="radiogroup" aria-label={`Aufgabe ${q.number}`}>
   {q.options.map(o=><label className="a2-mock-choice" key={o.id}>
    <input type="radio" name={`a2-kombi-${mockNumber}-t${part}-${q.number}`}
      checked={answers[`t${part}-${q.number}`]===o.id}
      onChange={()=>onChange(`t${part}-${q.number}`,o.id)}/>
    <strong>{o.id.toUpperCase()}</strong><span>{o.label}</span>
   </label>)}
  </div>
 );
 const questions=(part,n)=>part.questions.map(q=><section className="a2-mock-question" key={q.number}>
    <h3>Aufgabe {q.number}</h3><p>{q.question}</p>{choices(q,n)}
   </section>);
 return <div className="a2-kombi-reading" data-a2-kombi-reading lang="de">
  <section className="a2-mock-part">
   <header className="a2-mock-part-heading"><h2>Teil 1 · Onlinetext</h2><p>Lesen Sie den Text. Wählen Sie a, b oder c.</p></header>
   <article className="a2-mock-newspaper"><p>{p.teil1.source}</p></article>{questions(p.teil1,1)}
  </section>
  <section className="a2-mock-part">
   <header className="a2-mock-part-heading"><h2>Teil 2 · Etagenverzeichnis</h2><p>In welcher Etage finden Sie die gesuchte Information?</p></header>
   <article className="a2-mock-directory"><h3>Etagen / Abteilungen</h3>
    {p.teil2.source.split(/\n+/).filter(Boolean).map((line,i)=><div className="a2-mock-floor" key={i}><p>{line.trim()}</p></div>)}
   </article>{questions(p.teil2,2)}
  </section>
  <section className="a2-mock-part">
   <header className="a2-mock-part-heading"><h2>Teil 3 · E-Mail / Mitteilung</h2><p>Lesen Sie die Mitteilung und wählen Sie a, b oder c.</p></header>
   <article className="a2-mock-email"><div className="a2-mock-email-body"><p>{p.teil3.source}</p></div></article>{questions(p.teil3,3)}
  </section>
  <section className="a2-mock-part a2-mock-teil4">
   <header className="a2-mock-part-heading"><h2>Teil 4 · Kleinanzeigen</h2><p>Ordnen Sie jeder Person eine Anzeige A–F zu. Wenn keine passt, wählen Sie X.</p></header>
   <div className="a2-mock-ads-grid">
    {p.teil4.ads.map(ad=><article className="a2-mock-ad" key={ad.id}>
      <div className="a2-mock-ad-browser"><strong>Anzeige {ad.id.toUpperCase()}</strong></div>
      <div className="a2-mock-ad-body"><p>{ad.text}</p></div>
    </article>)}
   </div>
   <div className="a2-mock-people-sheet">
    {p.teil4.questions.map(q=><div className="a2-mock-person-row" key={q.number}>
     <div><strong>Aufgabe {q.number}</strong><p>{q.question}</p></div>
     <label>Anzeige:
      <select aria-label={`Aufgabe ${q.number} Anzeige`}
       value={answers[`t4-${q.number}`]||""}
       onChange={e=>onChange(`t4-${q.number}`,e.target.value)}>
       <option value="">—</option>{["a","b","c","d","e","f","x"].map(x=><option key={x} value={x}>{x.toUpperCase()}</option>)}
      </select>
     </label>
    </div>)}
   </div>
  </section>
 </div>;
}
