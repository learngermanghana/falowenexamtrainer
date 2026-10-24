import React from "react";
import { getStudyBuddyPracticeActions } from "../services/studyBuddyFollowups";

export default function StudyBuddyPracticeActions({ history, disabled, onAction }) {
  const actions = getStudyBuddyPracticeActions(history);
  if (!actions.length) return null;
  return <div className="study-buddy-navigation-actions" aria-label="Continue practice">
    {actions.map(({ label, message }) => <button type="button" key={label} className="study-buddy-shortcut" disabled={disabled} onClick={() => onAction(message)}>{label}</button>)}
  </div>;
}
