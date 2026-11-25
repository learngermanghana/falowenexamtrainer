import React from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";

const sections = [
  ["mocks","Mock Exams","Full mock examinations"],
  ["lesen","Reading","Reading practice samples"],
  ["horen","Listening","Listening practice with approved audio"],
  ["writing","Writing","Tutor-marked writing tasks"],
  ["speaking","Speaking","Speaking practice and assessment"],
  ["file","Exam File and Date","Examination records and dates"],
];

export default function SwahiliExamSection({level,section}){
  if(!["A1","A2","B1"].includes(level)) return <section style={styles.card}><h2>Kiswahili Exams Room</h2><p>No accessible examination level.</p><Link to="/campus/account">Open account</Link></section>;
  const selected=sections.find(item=>item[0]===section);
  return <section style={{...styles.card,display:"grid",gap:12}} aria-label="Kiswahili Exams Room">
    <h2>{section==="overview"?"Your "+level+" Kiswahili Exams Room":level+" · "+(selected?.[1]||"Overview")}</h2>
    {section==="overview"?<>
      <p>Examination materials are in preparation. Only teacher-approved materials will be made available.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12}}>
        {sections.map(([key,label,description])=><article key={key} style={styles.card}><h3>{label}</h3><p>{description}</p><Link to={"/exams/"+key} style={{...styles.secondaryButton,...styles.primaryButtonLink}}>Open {label}</Link></article>)}
      </div>
    </>:<>
      <p>{section==="speaking"?"Speaking assessment is not enabled.":section==="file"?"No Kiswahili examination records or dates are available yet.": "No approved "+level+" materials are published in this section yet."}</p>
      <Link to="/exams/overview">Back to overview</Link>
    </>}
  </section>;
}
