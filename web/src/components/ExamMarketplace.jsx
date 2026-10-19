import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { generateStudentCode } from "../services/studentCode";
import { EXAMS_LEVELS, EXAMS_LEVEL_LABELS, EXAMS_PACKAGES, EXAMS_READY_FULL_MOCKS } from "../data/examMarketplace";
import "./ExamMarketplace.css";

const skills = [
  { icon: "📖", title: "Lesen", desc: "Read exam-style texts and practise the question types." },
  { icon: "🎧", title: "Hören", desc: "Train your listening with clear, original German audio." },
  { icon: "✍️", title: "Schreiben", desc: "Write under exam conditions and review your performance." },
  { icon: "🎙️", title: "Sprechen", desc: "Prepare to speak confidently with an examiner." },
];
const sample = {
  A1: ["Das Geschäft ist am Sonntag geschlossen.", "Kann man am Sonntag einkaufen?", ["Ja", "Nein"], 1],
  A2: ["Die Bibliothek öffnet heute erst um 11 Uhr. Normalerweise öffnet sie um 9 Uhr.", "Wann öffnet die Bibliothek heute?", ["Um 9 Uhr", "Um 11 Uhr"], 1],
  B1: ["Die Anmeldung ist online bis Freitag möglich. Vor Ort können sich Interessierte noch am Samstag anmelden.", "Ist eine Anmeldung am Samstag möglich?", ["Ja, vor Ort", "Nein, nur online"], 0],
  B2: ["Trotz gestiegener Nachfrage bleiben die Öffnungszeiten unverändert, da derzeit Personal fehlt.", "Warum werden die Öffnungszeiten nicht verlängert?", ["Wegen Personalmangels", "Wegen sinkender Nachfrage"], 0],
  C1: ["Die Maßnahme gilt als wirkungsvoll; ihre langfristige Finanzierung ist jedoch weiterhin ungeklärt.", "Welcher Aspekt bleibt offen?", ["Die Finanzierung", "Die Wirksamkeit"], 0],
  C2: ["Die Studie relativiert frühere Gewissheiten, ohne den zugrunde liegenden Forschungsansatz grundsätzlich infrage zu stellen.", "Wie beurteilt die Studie den Forschungsansatz?", ["Sie verwirft ihn vollständig", "Sie schränkt frühere Gewissheiten ein"], 1],
};

function PackageCards({ level, onSelect }) {
  return <div className="fex-pricing-grid">
    {EXAMS_PACKAGES.map((plan) => {
      const disabled = plan.comingSoon || (plan.availableLevels && !plan.availableLevels.includes(level));
      return <article className={"fex-price-card"+(plan.id==="single"?" fex-recommended":"")} key={plan.id}>
        {plan.id==="single" && <span className="fex-recommend-tag">AVAILABLE FULL MOCK</span>}
        <h3>{plan.title}</h3>
        <p>{plan.details}</p>
        <div className="fex-price"><small>GH₵</small>{plan.price}</div>
        <span className="fex-duration">{plan.duration}</span>
        <button type="button" disabled={disabled} className={"fex-btn "+(plan.id==="single"?"fex-btn-primary":"fex-btn-outline")} onClick={()=>onSelect(plan.id)}>
          {disabled?"Coming soon":plan.id==="free"?"Try free sample":"Choose "+plan.title}
        </button>
        <ul>{plan.perks.map(perk=><li key={perk}>✓ {perk}</li>)}</ul>
      </article>;
    })}
  </div>;
}

export function ExamMarketplaceLanding() {
  const navigate=useNavigate();
  const [level,setLevel]=useState("A2");
  const [showSample,setShowSample]=useState(false);
  const [answer,setAnswer]=useState(-1);
  const [menuOpen,setMenuOpen]=useState(false);
  const example=sample[level];
  const chooseLevel=(next)=>{setLevel(next);setAnswer(-1);};
  const selectPlan=(id)=>{
    if(id==="free"){setShowSample(true);setAnswer(-1);return;}
    navigate("/signup?level="+encodeURIComponent(level)+"&package="+encodeURIComponent(id)+"&source=exams");
  };
  return <div className="fex-site">
    <div className="fex-strip">German exam practice from <strong>A1 to C2</strong> · Independent Goethe-style preparation</div>
    <header className="fex-header"><div className="fex-wrap fex-nav">
      <a className="fex-brand" href="/" aria-label="Falowen Exams home"><span className="fex-brand-icon">F</span><span>falowen.<small>EXAMS</small></span></a>
      <nav className={menuOpen?"fex-links fex-links-open":"fex-links"} aria-label="Site navigation">
        <a href="#skills" onClick={()=>setMenuOpen(false)}>Practice</a><a href="#levels" onClick={()=>setMenuOpen(false)}>Exam levels</a><a href="#how" onClick={()=>setMenuOpen(false)}>How it works</a><a href="#pricing" onClick={()=>setMenuOpen(false)}>Pricing</a>
      </nav>
      <a className="fex-login" href="/login">Log in</a>
      <a className="fex-btn fex-btn-primary fex-nav-cta" href={"/signup?level="+level+"&source=exams"}>Get started →</a>
      <button className="fex-menu" type="button" aria-expanded={menuOpen} aria-label="Toggle navigation" onClick={()=>setMenuOpen(v=>!v)}>☰</button>
    </div></header>
    <main>
      <section className="fex-hero"><div className="fex-wrap fex-hero-grid">
        <div><span className="fex-eyebrow">REALISTIC GERMAN EXAM PREPARATION</span><h1>Your German exam is coming. <em>Practise like it's the real thing.</em></h1>
          <p>Get ready for Goethe-style A1, A2, B1, B2, C1 and C2 exams. Practise individual skills, try a free question and build confidence before exam day.</p>
          <div className="fex-actions"><button className="fex-btn fex-btn-primary" type="button" onClick={()=>setShowSample(true)}>Try a free sample ↗</button><a className="fex-btn fex-btn-outline" href="#pricing">Explore packages →</a></div>
          <div className="fex-assurance"><span>✓ All six CEFR levels</span><span>✓ Four exam skills</span><span>✓ No full-course subscription</span></div>
        </div>
        <div className="fex-hero-visual" aria-label="Mock exam illustration">
          <div className="fex-preview-top"><span>F <b>Falowen Exam Room</b></span><span className="fex-ready">Exam-style practice</span></div>
          <div className="fex-preview-line"><div><small>German proficiency</small><strong>{level} Exam Preparation</strong></div><span className="fex-level-circle">{level}</span></div>
          <div className="fex-visual-skills">{skills.map(s=><div key={s.title}><span>{s.icon}</span><strong>{s.title}</strong><small>Targeted practice</small></div>)}</div>
          <div className="fex-visual-bottom"><span>✓</span><div><b>Practise with a purpose</b><small>Use Falowen's existing Exams Room</small></div></div>
        </div>
      </div></section>
      <section className="fex-proof"><div className="fex-wrap"><span>One focused place for exam preparation</span><strong>✓ Original practice</strong><strong>✓ Flexible packages</strong><strong>✓ Scores and feedback</strong></div></section>
      <section id="skills" className="fex-section fex-wrap"><span className="fex-section-label">FOUR CORE SKILLS</span><h2>Prepare for every part of your exam.</h2><p className="fex-section-intro">Practise a complete exam where available, or focus on the question types you need to improve.</p><div className="fex-skills">{skills.map(skill=><article key={skill.title}><span className="fex-skill-icon">{skill.icon}</span><h3>{skill.title}</h3><p>{skill.desc}</p></article>)}</div></section>
      <section id="levels" className="fex-section fex-levels"><div className="fex-wrap"><span className="fex-section-label">FIND YOUR LEVEL</span><h2>From A1 through C2.</h2><p className="fex-section-intro">Choose the level you're preparing for. Each one has a distinct sample question.</p><div className="fex-level-buttons" role="group" aria-label="German exam level">{EXAMS_LEVELS.map(item=><button key={item} className={level===item?"fex-level-tab fex-active":"fex-level-tab"} type="button" aria-pressed={level===item} onClick={()=>chooseLevel(item)}><strong>{item}</strong><small>{EXAMS_LEVEL_LABELS[item]}</small></button>)}</div>
        <div className="fex-level-summary"><div><span className="fex-section-label">{level} · {EXAMS_LEVEL_LABELS[level]}</span><h3>Prepare for your {level} German exam.</h3><p>{EXAMS_READY_FULL_MOCKS[level]?"A full four-skill practice mock is available at this level. More unique mocks and individual Teil packages are being prepared.":"Sample practice is available. Complete four-skill mocks for this level are being prepared and are not yet on sale."}</p><button className="fex-btn fex-btn-primary" type="button" onClick={()=>setShowSample(true)}>Try {level} sample →</button></div><aside><strong>{level} practice roadmap</strong>{skills.map(s=><div key={s.title}><span>{s.title}</span><small>{EXAMS_READY_FULL_MOCKS[level]?"Full mock available":"Full mock coming soon"}</small></div>)}</aside></div>
      </div></section>
      <section id="how" className="fex-section fex-wrap"><span className="fex-section-label">HOW IT WORKS</span><h2>Three simple steps.</h2><div className="fex-steps"><article><b>01</b><h3>Choose your level</h3><p>Pick A1, A2, B1, B2, C1 or C2 and try the free sample.</p></article><article><b>02</b><h3>Create an exam-only account</h3><p>New customers use a Falowen exam-only account. Existing Falowen students use their current login.</p></article><article><b>03</b><h3>Open the Exams Room</h3><p>Pay for available practice and use the existing Falowen exam engine without enrolling in a full class.</p></article></div></section>
      <section id="pricing" className="fex-section fex-pricing"><div className="fex-wrap"><span className="fex-section-label">ONE-TIME PRICING</span><h2>Pay for practice. Not the full course.</h2><p className="fex-section-intro">Displayed prices are introductory; only packages with published practice can be purchased.</p><PackageCards level={level} onSelect={selectPlan}/><p className="fex-legal">Independent exam preparation; not an official Goethe examination or certificate. Extra Teil sets and three-mock bundles will be offered after their questions and assessment are ready.</p></div></section>
      <section className="fex-wrap fex-bottom"><div><h2>You've studied German. Now practise the exam.</h2><p>Join Falowen Exams with your existing account or create a new exam-only profile.</p></div><a className="fex-btn fex-btn-mint" href={"/signup?level="+level+"&source=exams"}>Start practising →</a></section>
      <section id="faq" className="fex-section fex-wrap fex-faq"><span className="fex-section-label">COMMON QUESTIONS</span><h2>Frequently asked questions</h2><details><summary>Is Falowen Exams part of Goethe-Institut?</summary><p>No. Falowen offers independent exam-style preparation and is not affiliated with or endorsed by Goethe-Institut.</p></details><details><summary>Do I have to register for the GH₵3,000 German course?</summary><p>No. Exam-only customers can buy practice without accessing the full Falowen course.</p></details><details><summary>Are complete C1 and C2 mock exams available?</summary><p>Not yet. All six levels have a sample preview, but full C1 and C2 mocks will only be sold once published.</p></details><details><summary>I'm already a Falowen student. Do I need another account?</summary><p>No. Log in with your existing Falowen credentials.</p></details></section>
    </main>
    <footer className="fex-footer"><div className="fex-wrap"><strong>falowen. <small>EXAMS</small></strong><p>Realistic German exam preparation, A1–C2.</p><p>© {new Date().getFullYear()} Falowen · Independent Goethe-style exam preparation</p></div></footer>
    {showSample&&<div className="fex-modal-backdrop" onClick={()=>setShowSample(false)} role="presentation"><section className="fex-modal" role="dialog" aria-modal="true" aria-labelledby="fex-sample-title" onClick={event=>event.stopPropagation()}><button type="button" className="fex-modal-close" aria-label="Close" onClick={()=>setShowSample(false)}>×</button><span className="fex-section-label">FREE {level} LESEN SAMPLE</span><h2 id="fex-sample-title">Try an original question</h2><p className="fex-question">{example[0]}</p><strong>{example[1]}</strong><div className="fex-answer-buttons">{example[2].map((option,index)=><button type="button" key={option} disabled={answer!==-1} className={answer===index?(index===example[3]?"fex-correct":"fex-incorrect"):""} onClick={()=>setAnswer(index)}>{option}</button>)}</div>{answer!==-1&&<p role="status">{answer===example[3]?"Correct! Well done.":"Not quite. The correct answer is: "+example[2][example[3]]+"."}</p>}<button type="button" className="fex-btn fex-btn-outline" onClick={()=>{setAnswer(-1);setShowSample(false)}}>Close sample</button></section></div>}
  </div>;
}

export function ExamMarketplaceSignup() {
  const { signup, user, authError, setAuthError }=useAuth();
  const navigate=useNavigate();
  const params=new URLSearchParams(window.location.search);
  const requestedLevel=String(params.get("level")||"A1").toUpperCase();
  const [level,setLevel]=useState(EXAMS_LEVELS.includes(requestedLevel)?requestedLevel:"A1");
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [busy,setBusy]=useState(false);const [error,setError]=useState("");
  useEffect(()=>{if(user)navigate("/exams/overview",{replace:true})},[user,navigate]);
  const submit=async(event)=>{
    event.preventDefault();setBusy(true);setError("");setAuthError("");
    try{
      if(name.trim().split(/\s+/).length<2) throw new Error("Enter your first and last name.");
      await signup(email,password,{name:name.trim(),studentCode:generateStudentCode({name}),level,accountType:"exam_only",onboardingCompleted:true});
      navigate("/exams/overview",{replace:true});
    }catch(e){setError(e?.message||"Could not create your account.");}finally{setBusy(false);}
  };
  return <main className="fex-auth-page"><section className="fex-auth-card"><a className="fex-brand" href="/"><span className="fex-brand-icon">F</span><span>falowen.<small>EXAMS</small></span></a><h1>Create your exam-only account</h1><p>Access German exam preparation without signing up for the full course. Already studying with Falowen? <a href="/login">Use your existing login</a>.</p>
    <form onSubmit={submit}><label>Full name<input autoComplete="name" required value={name} onChange={e=>setName(e.target.value)} placeholder="First and last name"/></label><label>Email<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={e=>setPassword(e.target.value)}/></label><label>My exam level<select value={level} onChange={e=>setLevel(e.target.value)}>{EXAMS_LEVELS.map(v=><option key={v} value={v}>{v} · {EXAMS_LEVEL_LABELS[v]}</option>)}</select></label><p className="fex-legal">No course access or trial is activated. Your exam package can be purchased after account creation.</p><button className="fex-btn fex-btn-primary" type="submit" disabled={busy}>{busy?"Creating account...":"Create exam-only account →"}</button>{(error||authError)&&<p role="alert" className="fex-error">{error||authError}</p>}</form><p><a href="/login">Already registered? Log in →</a></p></section></main>;
}

export function ExamMarketplaceAccess({children}) {
  const {idToken,studentProfile,logout}=useAuth();
  const [access,setAccess]=useState(null);
  const [working,setWorking]=useState(false);
  const [issue,setIssue]=useState("");
  const level=String(studentProfile?.level||"A1").toUpperCase();
  const check=async()=>{
    if(!idToken)return;
    try{const response=await fetch("/api/paystack/exams/status",{headers:{Authorization:"Bearer "+idToken},cache:"no-store"});if(!response.ok)throw new Error("Unable to verify exam access right now.");setAccess(await response.json());setIssue("");}
    catch(error){setAccess({unavailable:true});setIssue(error?.message||"Unable to verify access.");}
  };
  useEffect(()=>{setAccess(null);check()},[idToken,studentProfile?.level]);
  const levelAccess=access?.levels?.[level];
  if(!access)return <div className="fex-access-state" role="status">Checking your Falowen exam access…</div>;
  if(levelAccess?.active) return children;
  const checkout=async()=>{
    if(working||!EXAMS_READY_FULL_MOCKS[level])return;
    setWorking(true);setIssue("");
    try{const response=await fetch("/api/paystack/exams/initialize",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+idToken},body:JSON.stringify({packageId:"single",level})});const data=await response.json();if(!response.ok||!data.authorization_url)throw new Error(data?.error||"Could not start checkout.");window.location.assign(data.authorization_url);}
    catch(error){setIssue(error?.message||"Could not start checkout.");setWorking(false);}
  };
  return <main className="fex-access-page"><section className="fex-access-card"><span className="fex-section-label">FALOWEN EXAMS · {level}</span><h1>{levelAccess?.expired?"Renew your exam access":"Your exam practice is ready"}</h1><p>{EXAMS_READY_FULL_MOCKS[level]?"Purchase access to the existing "+level+" four-skill mock exam. Your full Falowen course is not required.":"A complete "+level+" mock has not been published yet. You can still preview the sample questions while content is prepared."}</p><div className="fex-access-price">{EXAMS_READY_FULL_MOCKS[level]?"Single Full Mock · GH₵49 · 14 days":"Full mock coming soon"}</div>{issue&&<p role="alert" className="fex-error">{issue}</p>}{EXAMS_READY_FULL_MOCKS[level]&&<button className="fex-btn fex-btn-primary" type="button" onClick={checkout} disabled={working||access.unavailable}>{working?"Opening secure checkout…":"Pay securely with Paystack →"}</button>}<div className="fex-access-actions"><button type="button" onClick={check}>Refresh payment status</button><a href="/">View exam levels</a><button type="button" onClick={logout}>Log out</button></div><p className="fex-legal">Access is activated only after Paystack confirms payment. The payment return page alone never unlocks exams.</p></section></main>;
}
