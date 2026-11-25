import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSwahiliProgress } from "../hooks/useSwahiliProgress";
import { summarizeSwahiliLevel } from "../data/swahili/curriculumRegistry";
import { styles } from "../styles";
import { courseBookStyles as book } from "./courseBookStyles";

export default function SwahiliHomeProgress({ level = "A1" }) {
  const { user } = useAuth();
  const { records, failed } = useSwahiliProgress(user?.uid);
  const { published, required, completed, reviewed, known, average, next, allSubmitted, percent } = summarizeSwahiliLevel(level, records);
  const stats = [
    ["Published workbooks", published.length],
    ["Submitted", known ? completed + "/" + required.length : "—"],
    ["Tutor reviewed", known ? reviewed : "—"],
    ["Average score", average === null ? "—" : average + "%"],
  ];
  return <section style={{ ...styles.card, display: "grid", gap: 12 }} aria-label="Kiswahili learning progress">
    <h2 style={styles.sectionTitle}>Kiswahili {level} · Learning progress</h2>
    <div className="course-book-quick-stats" style={book.statGrid}>
      {stats.map(([label, value]) => <div key={label} style={book.statCard}><p style={book.statLabel}>{label}</p><p style={book.statValue}>{value}</p></div>)}
    </div>
    {percent !== null && <div role="progressbar" aria-label="Published assignment progress" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} style={book.progressShell}><div style={{...book.progressFill, width: percent+"%"}} /></div>}
    <p role="status" style={styles.helperText}>{failed ? "Progress unavailable. Reopen this page to retry." : !known ? "Loading your progress…" : !required.length ? "No tutor assignments published for this level yet." : completed + " of " + required.length + " published assignments submitted."}</p>
    {next && <div><h3>{allSubmitted ? "Review lessons" : "Continue learning"}</h3><p>Somo la {next.day} · {next.title}</p><Link style={{...styles.primaryButton, ...styles.primaryButtonLink}} to={"/campus/course/swahili"+next.route}>{allSubmitted ? "Review lesson" : "Continue lesson"}</Link></div>}
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {[["course","Course Book"],["music","Music"],["vocab","Vocab"],["results","Results"],["attendance","Attendance"],["account","Account"]].map(([route,label]) => <Link key={route} style={{...styles.secondaryButton,...styles.primaryButtonLink}} to={"/campus/"+route}>{label}</Link>)}
    </div>
  </section>;
}
