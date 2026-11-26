"use strict";
// Expanded writes are opt-in and limited to canonical non-timed workbooks.
const crypto = require("crypto");
const { germanEnrollment } = require("./chatgptAssignmentSubmission");
const { getAssignmentSummary } = require("./routes/scoresSummaryCoursePlan");
const { courseExpiry } = require("./entitlementService");
const { enrollmentRows, blockedEnrollmentLevels } = require("./levelEnrollmentAccess");
const { readSwahiliAccess } = require("./swahiliAccess");
const { normalizeWorkbook } = require("./swahiliSubmission");
const norm = v => String(v || "").trim();
const idPart = v => norm(v).toLowerCase().replace(/[^a-z0-9._-]/g,"_").slice(0,120);
const hash = v => crypto.createHash("sha256").update(v).digest("hex");
const denied = error => ({ submitted:false, error });
const dateMillis = v => v?.toMillis?.() ?? new Date(v || 0).getTime();

function germanRule(student, args, rules) {
  const { germanLevel:level, primaryProgram } = germanEnrollment(student);
  const id = norm(args?.assignmentId).toUpperCase();
  const rule = rules?.german?.[id];
  // Secondary German contracts require a separately verified entitlement path.
  if (primaryProgram !== "german" || !["A2","B1"].includes(level) ||
      rule?.level !== level || !Array.isArray(rule.requiredParts) ||
      !rule.requiredParts.length || !Number.isInteger(rule.day) ||
      rule.day >= (level === "A2" ? 21 : 18)) return null;
  const entry = getAssignmentSummary(level).lessons.find(e => e.submissionRequired &&
    e.assignmentId === id && Number(e.dayNumber) === rule.day);
  return entry?.displayChapter ? { ...rule, id, entry } : null;
}

function validateGermanText(text, rule) {
  if (typeof text !== "string" || text.trim().length < 20 ||
      text.trim().length > (rule.level === "A2" ? 3200 : 4200)) return false;
  if (text.trim().split(/\s+/u).length < rule.minimumWords) return false;
  const parts = new Map();
  let active;
  for (const line of text.split(/\r?\n/)) {
    const heading = line.match(/^\s*(?:teil|part)\s*([1-4])\b\s*[:.·—–-]?\s*(.*)$/i);
    if (heading) {
      active = Number(heading[1]);
      if (parts.has(active)) return false;
      parts.set(active,[]);
      const tail = heading[2].replace(/^(?:schreiben|writing|lesen|reading|h[oö]ren|listening)\b\s*[:·—–-]?\s*/i,"");
      if (tail.trim()) parts.get(active).push(tail.trim());
    } else if (active) parts.get(active).push(line.trim());
  }
  const answered = lines => lines?.some(l => l &&
    !/^(?:schreiben|writing|lesen|reading|h[oö]ren|listening|(?:frage|aufgabe|question)\s*\d+\s*[).:-]?|(?:q\s*)?\d+\s*[).:-]?)$/i.test(l));
  return rule.requiredParts.every(p => answered(parts.get(p)));
}

function exactAnswers(values, questions) {
  if (!values || typeof values !== "object" || Array.isArray(values)) return false;
  const keys = Object.keys(values);
  return keys.length === questions.length && questions.every(q =>
    Object.prototype.hasOwnProperty.call(values,q.id) &&
    typeof values[q.id] === "string" && values[q.id].trim() &&
    values[q.id].length <= 12000 &&
    (!q.choices.length || q.choices.includes(values[q.id])));
}

function planSwahili(args,rules) {
  const day = args?.day;
  if (!Number.isInteger(day) || day < 1 || day > 20) return null;
  const rule = rules?.swahili?.[String(day)];
  if (!rule || rule.day !== day || typeof args.writing !== "string" ||
      !args.writing.trim() || args.writing.length > 12000 ||
      !exactAnswers(args.readingAnswers,rule.reading) ||
      !exactAnswers(args.listeningAnswers ?? {},rule.listening) ||
      (rule.listening.length && args.listeningConfirmed !== true)) return null;
  return normalizeWorkbook({ level:"A1",day,title:rule.title,
    writing:{[rule.writingKey]:args.writing.trim()},readingAnswers:args.readingAnswers,
    listeningAnswers:args.listeningAnswers ?? {},contentVersion:rule.contentVersion,
    readingVersion:rule.readingVersion });
}

async function submitExpandedWorkbook({admin,student,uid,email,args,rules}) {
  if (args?.confirmed !== true || !/^[A-Za-z0-9_-]{8,80}$/.test(args?.requestId || "") ||
      !uid || !email) return denied("Review the complete answers and explicitly confirm the submission first.");
  if (process.env.FALOWEN_CHATGPT_EXPANDED_SUBMIT_ENABLED !== "true")
    return denied("Expanded ChatGPT submission is not yet enabled. Nothing was saved; use Campus.");
  if (args.program === "swahili") {
    const work = planSwahili(args,rules);
    if (!work) return denied("Complete every published writing, reading and listening answer, confirm listening if required, or use Campus for unsupported workbooks.");
    const db = admin.firestore();
    return db.runTransaction(async tx => {
      const access = await readSwahiliAccess(db,uid,work.level,tx);
      if (!access.allowed) return denied("Active Kiswahili course access is required.");
      const ref = db.collection("users").doc(uid).collection("swahiliLessons").doc(work.id);
      const existing = await tx.get(ref);
      const digest = hash(JSON.stringify(work.data));
      if (existing.exists) {
        const p = existing.data();
        return p.chatgptRequestId === args.requestId && p.chatgptAnswerHash === digest
          ? {submitted:true,alreadyProcessed:true,program:"swahili",day:work.day}
          : denied("This workbook already exists in Campus. Review or revise it there; ChatGPT will not overwrite it.");
      }
      tx.create(ref,{...work.data,studentId:uid,userId:uid,studentName:norm(access.profile.name || access.profile.fullName).slice(0,150),
        studentEmail:email.slice(0,254),submittedAt:admin.firestore.FieldValue.serverTimestamp(),
        chatgptRequestId:args.requestId,chatgptAnswerHash:digest});
      return {submitted:true,program:"swahili",day:work.day,reviewStatus:"pending_review"};
    });
  }
  if (args.program !== "german") return denied("Select German or Kiswahili.");
  const rule = germanRule(student,args,rules);
  if (!rule || !validateGermanText(args.answerText,rule))
    return denied("This assignment is timed, unavailable, or incomplete. Supply every required Teil with your own answers, or submit in Campus.");
  const db = admin.firestore();
  const profileRef = db.collection("students").doc(student.id);
  return db.runTransaction(async tx => {
    const live = await tx.get(profileRef);
    const p = live.data();
    const liveRule = germanRule({id:student.id,data:p},args,rules);
    const policy = (await tx.get(db.collection("courseAccountAccess").doc(uid))).data() || {};
    const deletion = (await tx.get(db.collection("accountDeletionRequests").doc(uid))).data();
    if (!p || p.uid !== uid || !liveRule || policy.examOnly === true || p.accountType === "exam_only" ||
        ["pending","processing","completed"].includes(deletion?.status) ||
        ["inactive","archived","withdrawn","deleted","suspended","blocked"].includes(norm(p.status).toLowerCase()) ||
        ["failed","overdue","rejected","cancelled","canceled"].includes(norm(p.paymentStatus).toLowerCase()) ||
        (p.contractEnd && !(dateMillis(p.contractEnd) > Date.now())) ||
        blockedEnrollmentLevels(await enrollmentRows(profileRef,tx),"german").includes(rule.level))
      return denied("Current German course access could not be verified.");
    const expiry = courseExpiry(p);
    if (expiry !== null && !(expiry > Date.now() && rule.day === 1))
      return denied("Course trial access does not permit this assignment.");
    const chapter = rule.entry.displayChapter;
    const chapterKey = "chapter-" + idPart(chapter);
    const studentCode = norm(p.studentCode || p.studentcode || student.id);
    const studentScopeKey = [uid,studentCode,email].map(idPart).filter(Boolean).join("__");
    const lock = db.collection("submissionLocks").doc([studentScopeKey,rule.level.toLowerCase(),idPart(chapterKey)].join("__"));
    const docId = hash(uid + ":" + args.requestId).slice(0,40);
    const ref = db.collection("submissions").doc(docId);
    const [prior, priorLock] = await Promise.all([tx.get(ref),tx.get(lock)]);
    const answer = args.answerText.trim();
    const digest = hash(answer);
    if (prior.exists) {
      const existing = prior.data();
      return existing.studentId === uid && existing.assignmentId === rule.id && existing.chatgptAnswerHash === digest
        ? {submitted:true,alreadyProcessed:true,assignmentId:rule.id,submissionId:docId}
        : denied("The request ID was already used for different work.");
    }
    if (priorLock.exists) return denied("This assignment is already locked. Use Campus for resubmission.");
    const title = rule.level + " • Day " + rule.day + ": " + rule.entry.title + " • Chapter " + chapter;
    const at = admin.firestore.FieldValue.serverTimestamp();
    tx.create(ref,{program:"german",title,assignmentTitle:title,level:rule.level,day:rule.day,chapter,
      assignmentId:rule.id,assignment_id:rule.id,assignmentKey:rule.id,canonicalAssignmentKey:rule.id,
      chapterKey,answerKeySource:null,submissionLink:null,submissionText:answer,answer,workContent:answer,
      studentId:uid,studentEmail:email,studentCode,studentScopeKey,studentName:norm(p.name || p.fullName || p.displayName),
      className:norm(p.className),submissionFingerprint:[idPart(title),idPart(chapterKey),idPart(answer.toLowerCase().replace(/\s+/g," "))].join("::"),
      chatgptAnswerHash:digest,status:"submitted",attempt:1,attemptNumber:1,isResubmission:false,reviewStatus:"pending_review",
      submittedAt:at,createdAt:at,updatedAt:at,source:"falowen_chatgpt_confirmed_student_submission"});
    tx.create(lock,{studentId:uid,studentEmail:email,studentCode,level:rule.level,lockedAt:at,assignmentTitle:title,day:rule.day,chapter,chapterKey});
    return {submitted:true,assignmentId:rule.id,submissionId:docId,reviewStatus:"pending_review"};
  });
}

async function workbookStatus({admin,student,uid,args,rules}) {
  const db = admin.firestore();
  if (args?.program === "swahili") {
    const day = args.day;
    if (!Number.isInteger(day) || day < 1 || day > 20 ||
        !(await readSwahiliAccess(db,uid,"A1")).allowed) return {available:false};
    const ref = await db.collection("users").doc(uid).collection("swahiliLessons").doc("day-"+day).get();
    const data = ref.data();
    return {available:true,program:"swahili",day,submitted:data?.status === "submitted",
      requiredSections:rules?.swahili?.[String(day)] ? {writing:true,reading:rules.swahili[String(day)].reading.map(q=>q.id),
        listening:rules.swahili[String(day)].listening.map(q=>q.id)} : null,
      clarification:"No submission record does not prove work is missing. Check Campus Results for current tutor feedback.",
      campusUrl:"https://www.falowen.app/campus/results"};
  }
  if (args?.program !== "german") return {available:false};
  const {germanLevel:level,enrolledInGerman} = germanEnrollment(student);
  const id = norm(args.assignmentId).toUpperCase();
  if (!enrolledInGerman || !["A1","A2","B1"].includes(level) ||
      !getAssignmentSummary(level).lessons.some(e=>e.submissionRequired && e.assignmentId === id) ||
      id.includes("MOCK")) return {available:false};
  const records = await db.collection("submissions").where("studentId","==",uid)
    .where("canonicalAssignmentKey","==",id).limit(20).get();
  const owned = records.docs.map(d=>d.data()).filter(d=>d.studentId===uid && d.level===level &&
    (!d.program || d.program==="german") && d.status!=="draft");
  const newest = owned.sort((a,b)=>dateMillis(b.updatedAt || b.createdAt)-dateMillis(a.updatedAt || a.createdAt))[0];
  const rule = germanRule(student,args,rules);
  return {available:true,program:"german",assignmentId:id,submittedRecordFound:Boolean(newest),
    status:newest?.status || null,reviewStatus:newest?.reviewStatus || null,requiredParts:rule?.requiredParts || null,
    clarification:"Only matching submission records are shown, not official grades. Use tutor feedback or Campus Results for marked work; a missing record is not proof of non-submission.",
    campusUrl:"https://www.falowen.app/campus/results"};
}
module.exports = {germanRule,validateGermanText,planSwahili,submitExpandedWorkbook,workbookStatus};
