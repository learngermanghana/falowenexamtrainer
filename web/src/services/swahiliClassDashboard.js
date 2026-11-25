import { db, doc, getDoc, getDocs, collection, query, where } from "../firebase";
import { fetchAttendanceRecords, buildAttendanceSummary } from "./attendanceServiceBase";
import { asLiveClassDate } from "../utils/liveClassCardPresentation";
const text = value => String(value || "").trim();
const language = value => text(value).toLowerCase();
export const isSwahiliClass = klass => ["swahili","kiswahili"].includes(language(klass?.program || klass?.language));
export function belongsToSwahiliClass(session, klass) {
  const ids = [klass.id,klass.classId].map(text).filter(Boolean);
  const owner = text(session.classRecordId || session.classId);
  const program = language(session.program || session.language);
  return Boolean(owner && ids.includes(owner) && (!program || ["swahili","kiswahili"].includes(program)));
}
export function selectSwahiliSessions(sessions, klass, now = new Date()) {
  const unique = new Map();
  for (const session of sessions) {
    if (!belongsToSwahiliClass(session,klass) || session.superseded === true || ["superseded","deleted"].includes(language(session.status || session.sessionStatus))) continue;
    const startsAt = asLiveClassDate(session.startsAt), endsAt = asLiveClassDate(session.endsAt);
    if (!startsAt || !endsAt || endsAt <= startsAt) continue;
    unique.set(session.id,{...session,startsAt,endsAt});
  }
  const ordered = [...unique.values()].sort((a,b)=>a.startsAt-b.startsAt);
  const status = session => language(session.status || session.sessionStatus);
  const next = ordered.find(s=>!["cancelled","completed","ended"].includes(status(s)) && s.endsAt>=now) || null;
  return {sessions:ordered,next,completed:ordered.filter(s=>status(s)==="completed")};
}
export async function fetchSwahiliClassDashboard({classId,className,studentCode,studentUid,level}) {
  if (!db || !studentUid || (!classId && !className)) return null;
  let klass;
  if(classId) {
    const snap = await getDoc(doc(db,"classes",classId));
    if(snap.exists()) klass={...snap.data(),id:snap.id};
  } else {
    const results=await Promise.all(["name","className"].map(field=>getDocs(query(collection(db,"classes"),where(field,"==",className)))));
    const candidates=new Map();
    results.forEach(result=>result.docs.forEach(s=>{const k={...s.data(),id:s.id};if(isSwahiliClass(k)&&!k.archived&&!k.isArchived&&!["archived","deleted"].includes(language(k.status)))candidates.set(k.id,k);}));
    if(candidates.size===1)klass=[...candidates.values()][0];
  }
  if(!isSwahiliClass(klass)||klass.archived||klass.isArchived||["archived","deleted"].includes(language(klass.status)))return null;
  const ids=[...new Set([klass.id,klass.classId].map(text).filter(Boolean))];
  const [results,zoomSnap,attendance]=await Promise.all([
    Promise.all(ids.flatMap(id=>["classId","classRecordId"].map(field=>getDocs(query(collection(db,"classSessions"),where(field,"==",id)))))),
    klass.zoomProfileId ? getDoc(doc(db,"zoomProfiles",klass.zoomProfileId)).catch(()=>null) : Promise.resolve(null),
    studentCode ? fetchAttendanceRecords({className:klass.id,studentCode,studentUid,level}).catch(()=>null) : Promise.resolve(null)
  ]);
  const sessions=results.flatMap(r=>r.docs.map(s=>({...s.data(),id:s.id})));
  const zoom=zoomSnap?.exists()?zoomSnap.data():{};
  return {klass,...selectSwahiliSessions(sessions,klass),zoom,attendance:attendance?buildAttendanceSummary(attendance.records,attendance.hours):null};
}
