import React, { useState } from "react";

// Date-only values use calendar days, avoiding fractional days across DST.
export function examDaysRemaining(value, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
  const target = Date.parse(value + "T00:00:00Z");
  if (!Number.isFinite(target) || new Date(target).toISOString().slice(0,10) !== value) return null;
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86400000);
}
const storageKey = (uid, level) => "falowen:exam-date:" + uid + ":" + level;

export default function PersonalExamCountdown({uid, level}) {
  const key = storageKey(uid, level);
  const [date, setDate] = useState(() => {
    try { return window.localStorage.getItem(key) || ""; } catch { return ""; }
  });
  const [storageIssue, setStorageIssue] = useState(false);
  const days = examDaysRemaining(date);
  const update = value => {
    if (value && examDaysRemaining(value) === null) return;
    setDate(value);
    try {
      if (value) window.localStorage.setItem(key, value);
      else window.localStorage.removeItem(key);
      setStorageIssue(false);
    } catch { setStorageIssue(true); }
  };
  return <div className="exam-room-countdown">
    <div>
      <h3>My {level} exam date</h3>
      <p>{days === null ? "Add your booked exam date to plan your practice." : days > 0 ? days + " day" + (days === 1 ? "" : "s") + " until your exam" : days === 0 ? "Your exam is today" : "Your recorded exam date has passed."}</p>
      <small>{storageIssue ? "Date could not be saved on this device." : "Personal reminder · saved on this device only, not a booking."}</small>
    </div>
    <div className="exam-room-date-control">
      <label>Booked exam date<input type="date" value={date} onChange={event=>update(event.target.value)} /></label>
      {date && <button type="button" className="exam-room-text-action" onClick={()=>update("")}>Clear date</button>}
    </div>
  </div>;
}
