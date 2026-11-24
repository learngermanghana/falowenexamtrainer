import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getBackendUrl } from "../services/backendUrl";
import { getTrialLifecycleState } from "../lib/trialAccess";
import { toDateMs } from "../lib/dateUtils";
import { styles } from "../styles";

export function courseRows(profile, now = Date.now()) {
  if (!profile) return [];
  const primary = profile.program || "german";
  const rows = [];
  function add(program, record, secondary = false) {
    if (!record) return;
    const trial = getTrialLifecycleState(record, now);
    const end = toDateMs(record.contractEnd);
    const complimentary = record.accessType === "complimentary";
    const status = String(record.paymentStatus || "").toLowerCase();
    const paid = ["paid", "partial", "partially_paid", "partially paid"].includes(status) || Number(record.paid || 0) > 0;
    const date = trial.active ? trial.endsAtMs : Number.isFinite(end) ? end : null;
    let label = "Access not confirmed";
    if (trial.active) label = "Trial active";
    else if (Number.isFinite(end) && end <= now) label = "Contract expired";
    else if (complimentary && Number.isFinite(end)) label = "Complimentary access";
    else if (paid && Number.isFinite(end)) label = "Paid course contract";
    else if (paid) label = "Payment recorded — check access";
    else if (trial.key?.includes("expired") || trial.key === "purge_due" || trial.key === "retention_ending_soon") label = "Trial ended";
    rows.push({program, level: record.level, label, expiry: date, secondary});
  }
  if (profile.accountType !== "exam_only") add(primary, profile);
  if (profile.secondaryProgram && profile.secondaryProgram !== primary) add(profile.secondaryProgram, profile.coursePlacements?.[profile.secondaryProgram], true);
  return rows;
}
const formatEnd = value => Number.isFinite(value) ? new Date(value).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"}) : "Not recorded";

export default function MyCoursesPanel() {
  const { user, studentProfile, accountProfile, courseOptions = [], selectCourse } = useAuth();
  const profile = accountProfile || studentProfile;
  const navigate = useNavigate();
  const [attempt,setAttempt] = useState(0);
  const [state,setState] = useState({loading:true,active:[]});
  useEffect(() => {
    if (!user) return undefined;
    let mounted = true;
    setState({loading:true,active:[]});
    user.getIdToken().then(token => fetch(getBackendUrl()+"/mock/access",{headers:{Authorization:"Bearer "+token},cache:"no-store"}))
      .then(async response => {if(!response.ok) throw new Error("Could not verify exam subscriptions."); return response.json();})
      .then(data => {if(mounted) setState({loading:false,uid:user.uid,active:Array.isArray(data.active)?data.active:[],entitlements:data.entitlements});})
      .catch(() => {if(mounted) setState({loading:false,uid:user.uid,active:[],error:true});});
    return () => {mounted=false;};
  },[user,attempt]);
  const rows = courseRows(profile);
  const verified = state.uid === user?.uid && !state.loading && !state.error;
  const grants = verified ? state.active.filter(row => Number(row.expiresAtMs)>Date.now()) : [];
  const trial = verified ? state.entitlements?.exam?.trial : null;
  const extraTrial = trial && trial.expiresAtMs > Date.now() && !grants.some(row=>row.scope==="trial" && row.level===trial.level) ? [trial] : [];
  const openCourse = program => {selectCourse?.(program);navigate("/campus/course");};
  return <section style={{...styles.card,display:"grid",gap:12}} aria-label="My courses and subscriptions">
    <h2 style={{margin:0}}>My courses &amp; subscriptions</h2>
    <p style={styles.helperText}>Each course has its own access period. Opening this page does not change or renew any enrollment.</p>
    {rows.map(row=><article key={row.program} style={{border:"1px solid #dbe4ee",borderRadius:12,padding:14}}>
      <h3 style={{marginTop:0}}>{row.program==="swahili"?"Kiswahili":"German"} {row.level||""}</h3>
      <p>{row.label} · End date: {formatEnd(row.expiry)}</p>
      {courseOptions.includes(row.program) && <button type="button" style={styles.secondaryButton} onClick={()=>openCourse(row.program)}>Open course</button>}
    </article>)}
    <article style={{border:"1px solid #dbe4ee",borderRadius:12,padding:14}}>
      <h3>German exam preparation</h3>
      {state.loading || state.uid!==user?.uid ? <p role="status">Checking subscription…</p> : state.error ? <p role="alert">Subscription status unavailable. <button type="button" onClick={()=>setAttempt(x=>x+1)}>Retry</button></p> : <>
        {grants.map(row=><p key={row.id||row.level+row.scope}>{row.level} · {row.scope==="trial"?"Exam trial":"Monthly exam subscription"} · Expires {formatEnd(row.expiresAtMs)}</p>)}
        {extraTrial.map(row=><p key={row.level}>{row.level} · Designated trial practice · Expires {formatEnd(row.expiresAtMs)}</p>)}
        {!grants.length && !extraTrial.length && <p>No active standalone exam subscription found. Full Course exam access is determined by your enrollment.</p>}
      </>}
      <Link to="/exams/overview">Open Exams Room</Link>{" · "}<Link to="/mock/payment">View plans</Link>
    </article>
  </section>;
}
