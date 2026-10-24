import React from "react";
import {useNavigate} from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
const modules=[
 {name:"Lesen",path:"/campus/course/b1-mock-3-lesen",detail:"5 Teile · 30 Aufgaben · serverseitige Lösungen"},
 {name:"Hören",path:"/campus/course/b1-mock-3-hoeren",detail:"4 Teile · 30 Aufgaben · geschütztes Audio"},
 {name:"Schreiben",path:"/campus/course/b1-mock-3-schreiben",detail:"3 originale Schreibaufgaben · Entwurf"},
 {name:"Sprechen",path:"/campus/course/b1-mock-3-sprechen",detail:"3 Teile · Live-Prüfungsgespräch"},
];
export default function B1Mock3Hub(){
 const navigate=useNavigate();
 return <main className="a2-mock2-shell" data-b1-mock3-hub>
 <AppBackButton label="Zurück zu Probeprüfungen" fallbackPath="/exams/mocks"/>
 <header className="a2-mock2-progress"><h1>B1 Mock 3</h1><p>Lesen · Hören · Schreiben · Sprechen</p></header>
 <p role="note">Alle vier Aufgabenbereiche sind hier zusammengeführt. Noch keine
 vollständige /100-Prüfung: Lesen, Hören und Sprechen benötigen geprüfte
 Produktionsfreigaben; Schreiben benötigt serverseitige KI-Bewertung sowie
 eine gemeinsame, überprüfte Ergebnis-Synchronisierung.</p>
 <section style={{display:"grid",gap:12}}>
 {modules.map(m=><article key={m.name} className="a2-mock2-paper">
   <h2>{m.name}</h2><p>{m.detail}</p>
   <button type="button" onClick={()=>navigate(m.path)}>Bereich öffnen</button>
 </article>)}
 </section></main>;
}
