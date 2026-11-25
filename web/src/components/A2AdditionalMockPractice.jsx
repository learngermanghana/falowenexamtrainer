import React from "react";
import MockPracticeWorkspace,{PracticeAudio,PracticeQuestions,PracticeWriting,PracticeSpeaking} from "./MockPracticeWorkspace";
import {A2_MOCK_2_LESEN} from "../data/a2Mock2Lesen";
import {A2_MOCK_3_LESEN} from "../data/a2Mock3Lesen";
import {A2_MOCK_2_HOEREN} from "../data/a2Mock2Hoeren";
import {A2_MOCK_2_SCHREIBEN} from "../data/a2Mock2Schreiben";
import {A2_MOCK_3_SCHREIBEN} from "../data/a2Mock3Schreiben";
import {TASKS as MOCK2_SPEAKING_TASKS} from "./A2Mock2ConversationalSpeaking";
import {TASKS as MOCK3_SPEAKING_TASKS} from "./A2Mock3ConversationalSpeaking";
import {PARTS as MOCK3_HOEREN} from "./A2Mock3Hoeren";
import {getA2KombiSet} from "../data/a2KombiMockSets";
import {A2_MOCK_04_HOEREN} from "../data/a2Mock04Hoeren";
import {A2_MOCK_05_HOEREN} from "../data/a2Mock05Hoeren";
import {A2_MOCK_06_HOEREN} from "../data/a2Mock06Hoeren";
import {A2_MOCK_07_HOEREN} from "../data/a2Mock07Hoeren";
import {fetchA2MockAudioPlaybackUrl} from "../services/a2AudioService";

function Reading({parts,answers,onChange}){
  return <>{parts.map((part,i)=><article className="mock-practice-paper" key={i}><h2>Teil {i+1}: {part.title}</h2><p>{part.instruction}</p>{part.subject?<p>Betreff: {part.subject}</p>:null}
    {part.paragraphs?.map((p,j)=><p key={j}>{p}</p>)}{part.passage?<p style={{whiteSpace:"pre-wrap"}}>{part.passage}</p>:null}
    {part.floors?<table><tbody>{part.floors.map(([floor,desc])=><tr key={floor}><th>{floor}</th><td>{desc}</td></tr>)}</tbody></table>:null}
    {part.ads?.map((ad,j)=>{const [id,title,copy]=Array.isArray(ad)?ad:[ad.id,ad.title,ad.body];return <article className="mock-practice-paper" key={j}><strong>Anzeige {id} · {title}</strong><p>{copy}</p></article>})}
    <PracticeQuestions questions={part.questions} answers={answers} onChange={onChange} optionsFor={q=>q.options?.length?q.options:["a","b","c","d","e","f","x"].map(id=>({id,label:id==="x"?"Keine passende Anzeige":`Anzeige ${id.toUpperCase()}`}))}/></article>)}</>;
}
const kombiSpeaking=paper=>[
  {title:"Teil 1 · Fragen zur Person",prompt:`Stellen Sie Fragen zu diesen Themenkarten: ${paper.speaking.cards.map(c=>c.theme+": "+c.keyword).join(" / ")}.`},
  {title:"Teil 2 · Von sich erzählen",prompt:`Thema: ${paper.speaking.teil2.topic}. ${paper.speaking.teil2.points.join(" / ")}`},
  {title:"Teil 3 · Gemeinsam planen",prompt:`${paper.speaking.teil3.situation} ${paper.speaking.teil3.points.join(" / ")}`},
];
export default function A2AdditionalMockPractice({mockId}){
  const is2=mockId==="a2-mock-02",is3=mockId==="a2-mock-03";
  const paper=getA2KombiSet(mockId);
  const reading=is2?A2_MOCK_2_LESEN:is3?A2_MOCK_3_LESEN:paper.reading;
  const writing=is2?Object.values(A2_MOCK_2_SCHREIBEN).filter(t=>t?.situation):is3?Object.values(A2_MOCK_3_SCHREIBEN).filter(t=>t?.situation):paper.writing;
  const speaking=is2?MOCK2_SPEAKING_TASKS:is3?MOCK3_SPEAKING_TASKS:kombiSpeaking(paper);
  const listening=is2?A2_MOCK_2_HOEREN:is3?MOCK3_HOEREN.map(p=>({...p.data,id:p.id,title:p.label})):({"a2-mock-04":A2_MOCK_04_HOEREN,"a2-mock-05":A2_MOCK_05_HOEREN,"a2-mock-06":A2_MOCK_06_HOEREN,"a2-mock-07":A2_MOCK_07_HOEREN})[mockId]||[];
  return <MockPracticeWorkspace mockId={mockId} title={`A2 Mock ${Number(mockId.slice(-2))}`} reading={props=><Reading {...props} parts={reading}/>} writing={props=><PracticeWriting {...props} tasks={writing}/>} speaking={props=><PracticeSpeaking {...props} tasks={speaking}/>} listening={({answers,onChange,idToken})=><>{listening.map((part,i)=><article className="mock-practice-paper" key={i}><h2>Teil {i+1} · {part.title||""}</h2><p>{part.instruction}</p><PracticeAudio load={()=>fetchA2MockAudioPlaybackUrl({mockId:mockId.slice(3),part:part.id||`teil-${i+1}`,key:part.audioObjectKey,idToken})}/>
    <PracticeQuestions questions={part.questions} answers={answers} onChange={onChange} optionsFor={q=>part.pictures?part.pictures.map(([id,label,icon])=>({id:id.toLowerCase(),label:`${id} · ${icon||""} ${label}`})):q.options||(is3?[["richtig","Richtig"],["falsch","Falsch"]]:[["ja","Ja"],["nein","Nein"]])}/></article>)}</>}/>;
}
