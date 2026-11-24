import React, { useEffect, useRef, useState } from "react";
import "./AccessLockDialog.css";

export function courseLockInfo({ title, examOnly = false, day1Available = true, assignment = false, level } = {}) {
  return {
    title: title || "Course material",
    reason: examOnly
      ? assignment ? "Your Exam Preparation account includes a read-only Day 1 preview. Course assignment submission requires Full Course access."
        : "Your Exam Preparation account includes a Day 1 course preview. Later lessons require Full Course access."
      : day1Available ? "Your Full Course trial includes Day 1 lessons and Day 1 assignments. Later lessons require an eligible Full Course enrollment."
        : "Your current course access does not include this material. Review your enrollment and access dates in Account.",
    plan: "Full Course",
    included: ["Course Book and assignments", "Live classes where included in your enrollment", "Exam preparation"],
    level,
    accountHref: examOnly ? "/mock/account" : "/campus/account?tab=courses",
  };
}

export function examLockInfo({ title, trialExam, level, examOnly = false } = {}) {
  const includedTrial = trialExam && !trialExam.locked && trialExam.id && trialExam.route;
  return {
    title: title || "Exam practice",
    reason: trialExam?.accessError ? "Your access could not be verified. Retry the access check before making any payment." : includedTrial
      ? "Your trial includes one designated practice. This activity is outside your current trial access."
      : "This activity requires active exam access for your level. Your current access does not include it.",
    plan: "Exam Preparation or eligible Full Course",
    included: ["Published mocks at your eligible level", "Lesen, Hören, Schreiben and Sprechen practice", "Assessment and saved results where available"],
    level,
    trialHref: includedTrial ? trialExam.route : null,
    accessError: Boolean(trialExam?.accessError),
    retryAccess: trialExam?.retryAccess,
    accountHref: examOnly ? "/mock/account" : "/campus/account?tab=courses",
  };
}

export function useAccessLock() {
  const [info, setInfo] = useState(null);
  const trigger = useRef(null);
  const openLock = (details, event) => {
    trigger.current = event?.currentTarget || document.activeElement;
    setInfo(details);
  };
  useEffect(() => {
    if (!info && trigger.current) { trigger.current.focus?.(); trigger.current = null; }
  }, [info]);
  const closeLock = () => setInfo(null);
  return { openLock, lockDialog: info ? <AccessLockDialog info={info} onClose={closeLock} /> : null };
}

export default function AccessLockDialog({ info, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (typeof dialog?.showModal === "function" && !dialog.open) dialog.showModal();
    else if (dialog) dialog.setAttribute("open", "");
    closeRef.current?.focus();
    return () => { if (dialog?.open && typeof dialog.close === "function") dialog.close(); };
  }, []);
  return <dialog ref={dialogRef} className="fw-access-lock-dialog" aria-label={"Locked: " + info.title}
    onCancel={event => {event.preventDefault(); onClose();}}
    onKeyDown={event => {if(event.key === "Escape"){event.preventDefault(); onClose();}}}
    onClick={event=>{if(event.target===event.currentTarget)onClose();}}>
    <div className="fw-access-lock-content">
      <span className="fw-access-lock-eyebrow">🔒 Access required</span>
      <h2>{info.title}</h2>
      <p>{info.reason}</p>
      <strong>{info.plan}{info.level ? " · " + info.level : ""}</strong>
      <ul>{info.included.map(item=><li key={item}>{item}</li>)}</ul>
      {!info.accessError && <p className="fw-access-lock-note">Review the available plans before paying. Opening this explanation does not change your access or charge you.</p>}
      <div className="fw-access-lock-actions">
        {info.accessError ? <button type="button" onClick={()=>{onClose();info.retryAccess?.();}}>Retry access check</button> : <a className="fw-access-lock-primary" href="/mock/payment">View plans</a>}
        <a href={info.accountHref}>My courses &amp; subscriptions</a>
        {info.trialHref && <a href={info.trialHref}>Open included trial practice</a>}
        <button ref={closeRef} type="button" onClick={onClose}>Keep browsing</button>
      </div>
    </div>
  </dialog>;
}
