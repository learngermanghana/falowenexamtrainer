import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db, doc, getDoc } from "../firebase";
import { saveSwahiliWorkbook } from "../services/swahiliWorkbookService";
import { canSubmitSwahiliWorkbook } from "../utils/campusProgram";
import { getCurrentSwahiliReview } from "../utils/swahiliWorkbookReview";

const empty = () => ({writing:{},reading:{},listening:{}});
const object = value => value && typeof value === "object" && !Array.isArray(value) ? value : {};
export function readWorkbookDraft(storage, uid, day, writingField) {
  if (!uid) return empty();
  try {
    const prefix = "swahili-b1-day-" + day;
    const raw = storage.getItem(prefix + ":" + uid);
    if (raw !== null) {
      const draft = JSON.parse(raw);
      return {writing:object(draft?.writing),reading:object(draft?.reading),listening:object(draft?.listening)};
    }
    if (day === 28) return {
      writing:{[writingField]:storage.getItem(prefix+":writing:"+uid) || ""},
      reading:object(JSON.parse(storage.getItem(prefix+":reading:"+uid) || "{}")),
      listening:object(JSON.parse(storage.getItem(prefix+":listening:"+uid) || "{}"))
    };
  } catch { /* storage unavailable */ }
  return empty();
}
export function useSwahiliB1Workbook({uid, day, title, writingField = "essay", complete}) {
  const {user,studentProfile} = useAuth();
  const canSubmit = canSubmitSwahiliWorkbook({user,studentProfile}) && uid === user?.uid;
  const key = canSubmit ? "swahili-b1-day-"+day+":"+uid : "";
  const [draft,setDraft] = useState(() => key ? readWorkbookDraft(sessionStorage,uid,day,writingField) : empty());
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [submitted,setSubmitted] = useState(false);
  const [notice,setNotice] = useState("");
  const [feedback,setFeedback] = useState("");
  const [confirmationVersion,setConfirmationVersion] = useState(0);
  const [storageNotice,setStorageNotice] = useState("");
  const lock = useRef(false);
  const draftRef = useRef(draft);
  useEffect(() => {
    let active = true;
    if (!canSubmit || !db) { setLoading(false); return; }
    getDoc(doc(db,"users",uid,"swahiliLessons","b1-day-"+day)).then(async snapshot => {
      if (!active || !snapshot.exists()) return;
      const prior = snapshot.data();
      const current = draftRef.current;
      const next = {writing:{...object(prior.writing),...current.writing},reading:{...prior.readingAnswers,...current.reading},listening:{...prior.listeningAnswers,...current.listening}};
      draftRef.current = next; setDraft(next); setSubmitted(true);
      const review = await getDoc(doc(db,"swahiliTeacherReviews",uid+"_b1-day-"+day));
      if (active) setFeedback(getCurrentSwahiliReview(prior,review.data())?.feedback || "");
    }).catch(() => {if(active) setNotice("Imeshindikana kupakia kazi ya awali.");})
      .finally(() => {if(active) setLoading(false);});
    return () => {active=false;};
  },[uid,day,canSubmit]);
  function update(section,id,value) {
    const current = draftRef.current;
    const next = {...current,[section]:{...current[section],[id]:value}};
    draftRef.current = next; setDraft(next); setConfirmationVersion(v=>v+1); setNotice("");
    if (key) try {sessionStorage.setItem(key,JSON.stringify(next));setStorageNotice("Draft saved in this browser session.");}
    catch {setStorageNotice("Draft could not be saved on this device.");}
  }
  async function submit() {
    if (!canSubmit || !db || loading || lock.current || !complete(draftRef.current)) return;
    lock.current=true;setSaving(true);setNotice("");
    const current = draftRef.current;
    try {
      await saveSwahiliWorkbook(user,{studentId:uid,userId:uid,studentName:studentProfile?.name || user.displayName || "",studentEmail:user.email || "",program:"swahili",level:"B1",day,lessonId:"swahili-b1-day-"+day,title,status:"submitted",writing:{[writingField]:(current.writing[writingField] || "").trim()},readingAnswers:current.reading,listeningAnswers:current.listening});
      setSubmitted(true);setFeedback("");setConfirmationVersion(v=>v+1);setNotice("Kazi yako imewasilishwa kwa mwalimu.");
    } catch {setNotice("Imeshindikana kuwasilisha kazi. Jaribu tena.");}
    finally {lock.current=false;setSaving(false);}
  }
  return {draft,loading,saving,submitted,notice,feedback,confirmationVersion,storageNotice,canSubmit,update,submit};
}
