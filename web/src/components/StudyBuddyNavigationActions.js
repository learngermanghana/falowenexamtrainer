import React from "react";
import { getStudyBuddyNavigationActions } from "../services/studyBuddyNavigation";

export default function StudyBuddyNavigationActions({ content, onNavigate }) {
  const actions = getStudyBuddyNavigationActions(content);
  if (!actions.length) return null;
  return <div className="study-buddy-navigation-actions" aria-label="Open a Falowen page">
    {actions.map((action) => <button type="button" key={action.path} className="study-buddy-shortcut" onClick={() => onNavigate(action.path)}>{action.label}</button>)}
  </div>;
}
