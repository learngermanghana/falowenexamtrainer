import React, {useEffect,useState} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {getHomeClassIdentity} from "../utils/homeClassSchedule";
import {getCampusProgram} from "../utils/campusProgram";
import {fetchSwahiliClassDashboard} from "../services/swahiliClassDashboard";
import {liveClassSessionStatus,canJoinLiveClass,GHANA_TIMEZONE} from "../utils/liveClassCardPresentation";
import {styles} from "../styles";

const date = value => new Intl.DateTimeFormat("en-GB",{timeZone:GHANA_TIMEZONE,dateStyle:"medium",timeStyle:"short"}).format(value);
const title = session => session?.title || session?.topic || session?.sessionLabel || "Kiswahili class";
const safeLink = value => {try {const url=new URL(value);return url.protocol==="https:"?url.href:"";}catch{return "";}};

export default function SwahiliClassDashboard({studentProfile,level}) {
  const {user}=useAuth();
  const {className,classId}=getHomeClassIdentity(studentProfile);
  const studentCode=studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || "";
  const uid=user?.uid;
  const allowed=Boolean(uid && getCampusProgram(studentProfile)==="swahili" && (classId||className));
  const [revision,setRevision]=useState(0);
  const [state,setState]=useState({status:"loading",data:null,key:""});
  const key=JSON.stringify([uid,classId,className,studentCode,level,revision]);
  useEffect(()=>{
    if(!allowed)return;
    let active=true;
    fetchSwahiliClassDashboard({classId,className,studentCode,studentUid:uid,level})
      .then(data=>{if(active)setState({status:data?"ready":"unavailable",data,key});})
      .catch(()=>{if(active)setState({status:"error",data:null,key});});
    return()=>{active=false;};
  },[allowed,classId,className,studentCode,uid,level,key]);
  if(!allowed)return <section style={styles.card}><h2>Your Kiswahili class</h2><p>No assigned class yet. Check your account or contact the academy.</p><Link to="/campus/account">Open account</Link></section>;
  const {status,data}=state.key===key?state:{status:"loading",data:null};
  const next=data?.next, attendance=data?.attendance, now=new Date();
  const zoom=safeLink(data?.zoom?.url || data?.zoom?.joinUrl || data?.zoom?.zoomUrl);
  return <section style={{...styles.card,display:"grid",gap:12}} aria-label="Kiswahili class dashboard">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}><h2>Your Kiswahili class</h2><button type="button" style={styles.secondaryButton} disabled={status==="loading"} onClick={()=>setRevision(v=>v+1)}>Refresh</button></div>
    {status==="loading"?<p role="status">Loading your class…</p>:!data?<p role="status">Your Kiswahili timetable is not available yet. Contact the academy if your class is already assigned.</p>:<>
      <p><strong>{data.klass.name || data.klass.className || className}</strong></p>
      <section><h3>Next class</h3>{next?<><strong>{title(next)}</strong><p>{date(next.startsAt)} – {date(next.endsAt)} · Ghana time</p><p>{liveClassSessionStatus(next,now)}</p>{zoom && canJoinLiveClass(next,now)?<a href={zoom} target="_blank" rel="noreferrer" style={styles.primaryButton}>Join live class</a>:<p>{zoom?"Zoom opens before class.":"Class Zoom link is not available yet."}</p>}</>:<p>No upcoming session scheduled.</p>}</section>
      <section><h3>Attendance</h3>{attendance?<><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(95px,1fr))",gap:8}}>{[["Present",attendance.presentSessions],["Absent",attendance.absentSessions],["Pending",attendance.pendingSessions],["Attendance",attendance.attendanceRate==null?"—":attendance.attendanceRate+"%"]].map(([label,value])=><div key={label}><strong>{value}</strong><div>{label}</div></div>)}</div><p>{attendance.totalSessions? "Based on marked sessions.":"No marked attendance available."}</p></>:<p>Attendance unavailable.</p>}<Link to="/campus/attendance">View attendance</Link></section>
      <details><summary>Full class timetable · {data.sessions.length} sessions</summary><ol>{data.sessions.map(session=><li key={session.id}><strong>{title(session)}</strong><div>{date(session.startsAt)} · {liveClassSessionStatus(session,now)}</div></li>)}</ol></details>
      <section><h3>Completed lessons</h3>{data.completed.length?<ul>{data.completed.slice().reverse().map(session=><li key={session.id}>{title(session)} · {date(session.startsAt)}</li>)}</ul>:<p>No completed sessions recorded.</p>}<Link to="/campus/course">Open course book and teacher videos</Link></section>
    </>}
  </section>;
}
