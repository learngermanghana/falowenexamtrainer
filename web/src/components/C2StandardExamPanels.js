import React,{useEffect,useMemo,useState}from"react";
import{styles}from"../styles";
import{EmbeddedSpeechPracticePanel}from"./selfLearning/EmbeddedPracticePanels";
import{getC2ExamStandard}from"../data/c2ExamStandardContent";
import{getC2LessonContentAlignment}from"../data/c2LessonContentAlignment";
import{buildC2OpinionWritingTemplate}from"../data/c2OpinionWritingTemplate";

const card={...styles.card,display:"grid",gap:14,border:"1px solid #e2e8f0",borderRadius:18,boxShadow:"0 10px 26px rgba(15,23,42,.06)"};
const sub={border:"1px solid #dbeafe",borderRadius:14,padding:14,background:"#f8fbff",display:"grid",gap:7};
const Section=({title,children})=><section style={card}><h2 style={{margin:0,fontSize:"1.18rem"}}>{title}</h2>{children}</section>;
const completion=(checked,onChange,label)=><label style={{display:"flex",gap:8,alignItems:"flex-start",fontWeight:700,lineHeight:1.5}}><input type="checkbox" checked={Boolean(checked)} onChange={e=>onChange?.(e.target.checked)} style={{marginTop:4}}/>{label}</label>;
const DetailList=({items=[]})=><ul style={{margin:0,paddingLeft:22,lineHeight:1.7}}>{items.filter(Boolean).map(item=><li key={item}>{item}</li>)}</ul>;

const TopicFoundation=({knowledge})=>{
 if(!knowledge)return null;
 return <Section title="Thema verstehen · Inhalt vor Argumentation">
  <div data-c2-topic-foundation="true" style={{display:"grid",gap:12}}>
   <div style={{...sub,background:"#eff6ff"}}><strong>In simple English</strong><span style={{lineHeight:1.7}}>{knowledge.englishDefinition}</span></div>
   <div style={{...sub,background:"#fff"}}><strong>Auf Deutsch</strong><span style={{lineHeight:1.7}}>{knowledge.germanDefinition}</span></div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
    <div style={{...sub,background:"#fff7f7"}}><strong>Wegwerfgesellschaft · linear</strong><span>{knowledge.linearModel}</span></div>
    <div style={{...sub,background:"#f0fdf4"}}><strong>Kreislaufwirtschaft · circular</strong><span>{knowledge.circularModel}</span></div>
   </div>
   <div style={sub}><strong>{knowledge.exampleTitle}</strong><span style={{lineHeight:1.7}}>{knowledge.example}</span></div>
   <div><strong>Wer trägt Verantwortung?</strong><div style={{display:"grid",gap:8,marginTop:8}}>{knowledge.actors?.map(([actor,role])=><div key={actor} style={sub}><strong>{actor}</strong><span>{role}</span></div>)}</div></div>
   <div><strong>Welche Interessen geraten in Spannung?</strong><div style={{display:"grid",gap:8,marginTop:8}}>{knowledge.tensions?.map(([left,right])=><div key={left} style={{...sub,background:"#fffbeb"}}><span><strong>{left}</strong> ↔ <strong>{right}</strong></span></div>)}</div></div>
   <div style={{...sub,background:"#eef2ff"}}><strong>Kernfrage</strong><span style={{lineHeight:1.7}}>{knowledge.coreQuestion}</span></div>
  </div>
 </Section>;
};

const AlignedGrammarTeaching=({day})=>{
 const aligned=getC2LessonContentAlignment(day);
 const grammar=aligned?.grammarNotes;
 const checks=Array.isArray(aligned?.grammarChecks)?aligned.grammarChecks:[];
 if(!grammar)return null;
 return <>
  <Section title={grammar.title}>
   <span style={{...styles.badge,width:"fit-content",background:"#eef2ff",color:"#3730a3"}}>Detailed C2 grammar notes</span>
   <div><strong>When and why to use it</strong><p style={{marginBottom:0,lineHeight:1.7}}>{grammar.usage}</p></div>
   <div><strong>Structure / word order</strong><p style={{marginBottom:0,lineHeight:1.7}}>{grammar.wordOrder}</p></div>
   <div><strong>Examples from today’s topic</strong><DetailList items={grammar.examples}/></div>
   <div><strong>Common mistakes</strong><DetailList items={grammar.commonMistakes}/></div>
  </Section>
  {checks.length?<Section title="Grammar checks with explanations">
   {checks.map((check,index)=><details key={`${index}-${check.question}`} style={{border:"1px solid #e2e8f0",borderRadius:12,padding:12}}>
    <summary style={{cursor:"pointer",fontWeight:800}}>{index+1}. {check.question}</summary>
    {Array.isArray(check.options)&&check.options.length?<ol style={{lineHeight:1.7}}>{check.options.map(option=><li key={option}>{option}</li>)}</ol>:null}
    <p style={{marginBottom:4}}><strong>Answer:</strong> {check.options?.[check.answerIndex]||"See explanation"}</p>
    <p style={{margin:0,lineHeight:1.7}}>{check.explanation}</p>
   </details>)}
  </Section>:null}
 </>;
};

export function C2StandardGrammarPanel({day,completed,onCompleteChange}){
 const d=getC2ExamStandard(day);if(!d)return null;
 const [principle,...examples]=d.grammar||[];
 return <div style={{display:"grid",gap:14}}>
  <TopicFoundation knowledge={d.topicKnowledge}/>
  <Section title={`Grammar · ${d.grammarFocus}`}>
   <span style={{...styles.badge,width:"fit-content",background:"#dbeafe",color:"#1e3a8a"}}>C2 Day {day} · {d.title}</span>
   <p style={{margin:0,lineHeight:1.75,color:"#334155"}}>{principle}</p>
   <div style={{display:"grid",gap:10}}>{examples.map((x,i)=><div key={x} style={sub}><strong>{i===0?"Grundmuster":"C2-Anwendung"}</strong><span style={{lineHeight:1.7}}>{x}</span></div>)}</div>
   <div style={{border:"1px solid #cbd5e1",borderRadius:14,padding:14,display:"grid",gap:8}}><strong>So kontrollierst du die Struktur</strong><ol style={{margin:0,paddingLeft:22,lineHeight:1.8}}><li>Zuerst Bedeutung und logische Funktion bestimmen.</li><li>Dann die passende C2-Struktur wählen — nicht nur eine kompliziertere Form.</li><li>Kasus, Rektion, Verbposition und Bezug kontrollieren.</li><li>Prüfen, ob die Formulierung natürlich und präzise bleibt.</li></ol></div>
  </Section>
  {d.topicKnowledge?.vocabulary?.length?<Section title={`Wortschatz · ${d.title}`}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>{d.topicKnowledge.vocabulary.map(([word,meaning])=><div key={word} style={sub}><strong>{word}</strong><span style={{color:"#64748b"}}>{meaning}</span></div>)}</div></Section>:null}
  {d.topicKnowledge?.collocations?.length?<Section title="Kollokationen · Das Thema argumentieren"><div style={{display:"grid",gap:10}}>{d.topicKnowledge.collocations.map(([phrase,meaning,example])=><div key={phrase} style={sub}><strong>{phrase}</strong><span style={{color:"#64748b"}}>{meaning}</span><span style={{lineHeight:1.7}}>{example}</span></div>)}</div></Section>:null}
  {d.writeType==="reformulation"?<Section title="Umformung · Methode für die heutige Schreibaufgabe">
   <p style={{margin:0,lineHeight:1.75}}>Bei einer Umformung bleibt die Bedeutung gleich, während sich die grammatische Struktur ändert. Das vorgegebene Wort muss unverändert verwendet werden.</p>
   <div style={{display:"grid",gap:10}}>{[["1","Bedeutung sichern","Fasse die Kernaussage des Ausgangssatzes kurz zusammen."],["2","Vorgabewort analysieren","Erkenne, welche Konstruktion das Wort auslöst: Präposition, Nomen, feste Wendung oder Satzverknüpfung."],["3","Satz neu bauen","Nicht Wort für Wort ersetzen. Baue die Aussage um die neue Struktur herum neu auf."],["4","Grammatik nachziehen","Kontrolliere Kasus, Artikel, Genitiv, Großschreibung, Verbform und Wortstellung."],["5","Vergleichen","Ausgangssatz und Umformung müssen dieselbe Aussage enthalten; das Vorgabewort bleibt exakt gleich."]].map(([n,t,text])=><div key={n} style={sub}><strong>{n}. {t}</strong><span>{text}</span></div>)}</div>
   <h3 style={{marginBottom:0}}>Muster, die du heute brauchst</h3>
   <div style={{display:"grid",gap:12}}>{d.reformulations.map((r,i)=><article key={r.cue+i} style={{border:"1px solid #e2e8f0",borderRadius:14,padding:14,display:"grid",gap:7}}><strong>{i+1}. Vorgabewort: {r.cue}</strong><div><span style={{color:"#64748b"}}>Ausgang:</span> {r.source}</div><div><span style={{color:"#64748b"}}>Muster:</span> {r.model}</div><div style={{color:"#475569",lineHeight:1.65}}><strong>Warum?</strong> {r.note}</div></article>)}</div>
   <div style={{border:"1px solid #86efac",borderRadius:14,padding:13,background:"#f0fdf4",lineHeight:1.7}}><strong>Prüfungscheck:</strong> gleiche Bedeutung · Vorgabewort unverändert · Struktur wirklich umgebaut · Kasus und Wortstellung korrekt · natürlicher deutscher Satz.</div>
  </Section>:<Section title="Argumentation · Sprache für die heutige Stellungnahme">
   <div style={{display:"grid",gap:10}}>{[
    ["Position öffnen","Die Frage, inwieweit …, lässt sich nicht pauschal beantworten."],
    ["Standpunkt abwägen","Für diese Position spricht insbesondere, dass …; dagegen ist einzuwenden, dass …"],
    ["Beispiel einordnen","Dies zeigt sich etwa dann, wenn …, wobei berücksichtigt werden muss, dass …"],
    ["Eigene Bewertung","Meines Erachtens ist dieser Ansatz insofern überzeugend, als …"],
    ["Differenziert schließen","Entscheidend ist daher weniger … als vielmehr …"]
   ].map(([t,x])=><div key={t} style={sub}><strong>{t}</strong><span>{x}</span></div>)}</div>
   <p style={{margin:0,color:"#475569",lineHeight:1.7}}>Nutze diese Redemittel nur, wenn sie zur Aussage passen. C2 bedeutet präzise Argumentation, nicht möglichst viele feste Formeln.</p>
  </Section>}
  <AlignedGrammarTeaching day={day}/>
  <Section title="Grammar check">{completion(completed,onCompleteChange,"Ich kann die heutige Struktur erklären und sie bewusst in Sprechen oder Schreiben einsetzen.")}</Section>
 </div>;
}

export function C2StandardSpeakPanel({day,completed,onCompleteChange}){
 const d=getC2ExamStandard(day);if(!d)return null;
 return <Section title="Sprechen · Fünfminütiger Vortrag">
  <div style={{display:"grid",gap:12}}>
   <div><strong style={{display:"block",marginBottom:6}}>Thema: {d.title}</strong><p style={{margin:0,lineHeight:1.75}}>Sie nehmen an einem Seminar zum Thema „{d.title}“ teil und halten dort einen fünfminütigen Vortrag. Im Anschluss beantworten Sie Fragen dazu.</p></div>
   <p style={{margin:0,lineHeight:1.75}}>Wägen Sie unterschiedliche Standpunkte ab. Sie können sich an den folgenden Aussagen orientieren. Geben Sie auch Beispiele.</p>
   <div style={{border:"1px solid #cbd5e1",borderRadius:16,padding:"clamp(16px,3vw,24px)",background:"#f8fafc",display:"grid",gap:14}}>{d.perspectives.map((q,i)=><div key={q} style={{paddingBottom:i<2?12:0,borderBottom:i<2?"1px solid #e2e8f0":"none",fontStyle:"italic",lineHeight:1.7}}>„{q}“</div>)}</div>
   <div style={{lineHeight:1.7}}><strong>Achten Sie darauf, dass Sie</strong><ul style={{marginBottom:0}}><li>Ihren Vortrag gut strukturieren,</li><li>anspruchsvolle Sprache (Wörter und Strukturen) einsetzen,</li><li>Ihre persönliche Einstellung zum Thema klar machen.</li></ul></div>
   <EmbeddedSpeechPracticePanel/>
   {completion(completed,onCompleteChange,"Ich habe den fünfminütigen Vortrag durchgeführt und meine Position begründet.")}
  </div>
 </Section>;
}

function OpinionWrite({d,day,completed,onCompleteChange}){
 const key=`falowen:c2:day${day}:standard-opinion-draft`;
 const template=useMemo(()=>buildC2OpinionWritingTemplate(d),[d]);
 const[draft,setDraft]=useState(()=>{try{const saved=localStorage.getItem(key);return saved===null?buildC2OpinionWritingTemplate(d):saved}catch{return buildC2OpinionWritingTemplate(d)}});
 useEffect(()=>{try{localStorage.setItem(key,draft)}catch{}},[key,draft]);
 const words=useMemo(()=>draft.trim()?draft.trim().split(/\s+/).length:0,[draft]);
 const restoreTemplate=()=>{
  if(draft.trim()&&draft!==template&&typeof window!=="undefined"&&!window.confirm("Die aktuelle Antwort wird durch die C2-Vorlage ersetzt. Fortfahren?"))return;
  setDraft(template);
 };
 return <Section title="Schreiben · Stellungnahme">
  <div style={{display:"grid",gap:12}}>
   <p style={{margin:0,lineHeight:1.75}}>Sie haben eine Diskussionsrunde zum Thema „{d.title}“ verfolgt. Schreiben Sie einen ausführlichen Leserbrief bzw. eine E-Mail von circa 350 Wörtern an die Redaktion. Beziehen Sie sich auf alle drei Beiträge, begründen Sie Ihre Argumentation mit Beispielen und entwickeln Sie eine eigene, differenzierte Position.</p>
   <div style={{display:"grid",gap:10}}>{d.perspectives.map((p,i)=><blockquote key={p} style={{margin:0,border:"1px solid #cbd5e1",borderRadius:14,padding:16,background:"#fff",fontStyle:"italic",lineHeight:1.7}}>{i+1}. „{p}“</blockquote>)}</div>
   <div style={{border:"1px solid #bbf7d0",borderRadius:14,padding:13,background:"#f0fdf4",display:"grid",gap:7}}><strong>C2-Schreibvorlage ist bereits im Textfeld gespeichert</strong><span>Ersetzen Sie alle eckigen Klammern durch Ihre eigenen Inhalte. Bereits gespeicherte Antworten bleiben erhalten.</span><div><button type="button" onClick={restoreTemplate} style={styles.secondaryButton}>Vorlage wiederherstellen</button></div></div>
   <textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Schreiben Sie hier Ihre vollständige C2-Stellungnahme …" style={{minHeight:520,border:"1px solid #94a3b8",borderRadius:12,padding:14,font:"inherit",lineHeight:1.75}}/>
   <div style={{fontWeight:700,color:"#475569"}}>{words} Wörter · Ziel: circa 350 Wörter</div>
   {completion(completed,onCompleteChange,"Ich habe alle drei Beiträge berücksichtigt, alle Platzhalter ersetzt und meine eigene Position begründet.")}
  </div>
 </Section>;
}

function ReformulationWrite({d,day,completed,onCompleteChange}){
 const key=`falowen:c2:day${day}:standard-reformulations`;
 const[answers,setAnswers]=useState(()=>{try{return JSON.parse(localStorage.getItem(key)||"{}")}catch{return{}}});
 useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(answers))}catch{}},[key,answers]);
 return <Section title="Schreiben · Umformung">
  <p style={{margin:0,lineHeight:1.7}}><strong>Aufgabe:</strong> Formulieren Sie jeden Satz neu. Verwenden Sie das jeweils vorgegebene Wort unverändert. Die Bedeutung muss erhalten bleiben.</p>
  <div style={{display:"grid",gap:12}}>{d.reformulations.map((r,i)=><article key={r.cue+i} style={{border:"1px solid #dbeafe",borderRadius:14,padding:14,background:"#fff",display:"grid",gap:9}}><strong>{i+1}. {r.source}</strong><div><strong>Vorgegebenes Wort:</strong> <span style={{...styles.badge,background:"#dbeafe",color:"#1e3a8a"}}>{r.cue}</span></div><textarea value={answers[i]||""} onChange={e=>setAnswers(old=>({...old,[i]:e.target.value}))} placeholder="Ihre Umformung" style={{minHeight:92,border:"1px solid #cbd5e1",borderRadius:12,padding:12,font:"inherit",lineHeight:1.65}}/></article>)}</div>
  {completion(completed,onCompleteChange,"Ich habe alle fünf Umformungen bearbeitet und jedes Vorgabewort unverändert verwendet.")}
 </Section>;
}

export function C2StandardWritePanel({day,completed,onCompleteChange}){
 const d=getC2ExamStandard(day);if(!d)return null;
 return d.writeType==="opinion"?<OpinionWrite d={d} day={day} completed={completed} onCompleteChange={onCompleteChange}/>:<ReformulationWrite d={d} day={day} completed={completed} onCompleteChange={onCompleteChange}/>;
}

export default C2StandardGrammarPanel;
