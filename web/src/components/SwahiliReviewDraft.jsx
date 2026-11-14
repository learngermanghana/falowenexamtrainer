import React from "react";

export function useSwahiliReviewDraft(uid, day, answers, restore) {
  const key = uid && day ? `falowen:swahili-review:${uid}:day-${day}` : "";
  const [notice, setNotice] = React.useState("");
  React.useEffect(() => {
    setNotice("");
    if (!key) return;
    try {
      const draft = JSON.parse(localStorage.getItem(key) || "null");
      if (draft) restore(draft);
    } catch {
      // An unavailable or malformed local draft must not block the workbook.
    }
  }, [key, restore]);

  function saveDraft() {
    if (!key) return;
    try {
      localStorage.setItem(key, JSON.stringify(answers));
      setNotice("Draft saved on this device.");
    } catch {
      setNotice("Could not save this draft on your device.");
    }
  }

  return { saveDraft, notice };
}

export default function SwahiliReviewDraft({ writing, questions, reading, listening, draft }) {
  return <>
    <h3>Teil 2 · Writing</h3>
    <ol>{Object.entries(writing).map(([label, value]) => (
      <li key={label}><strong>{label}</strong><p style={{ whiteSpace: "pre-wrap" }}>{value || "Unanswered"}</p></li>
    ))}</ol>
    <h3>Teil 3 · Reading</h3>
    <ol>{questions.map((question, index) => (
      <li key={question.id}><strong>{question.question || question.prompt || `Question ${index + 1}`}</strong>
        <p>{reading[question.id] || "Unanswered"}</p></li>
    ))}</ol>
    {listening && <p>Optional listening answers saved in this draft: {Object.values(listening).filter(Boolean).length}.</p>}
    {draft && <div className="swahili-book__row">
      <button type="button" className="swahili-book__button swahili-book__button--soft" onClick={draft.saveDraft}>Save draft</button>
      {draft.notice && <p role="status">{draft.notice}</p>}
    </div>}
  </>;
}

export function SwahiliFinalSubmit({ disabled, onSubmit, children }) {
  const [checked, setChecked] = React.useState([false, false, false]);
  const labels = [
    "I checked that this is the correct lesson.",
    "I included my final answers for Teil 2 · Writing.",
    "I included all answers for Teil 3 · Reading.",
  ];
  const ready = checked.every(Boolean);
  return <>
    <fieldset disabled={disabled}>
      <legend>Confirm your submission</legend>
      {labels.map((label, index) => (
        <label key={label} style={{ display: "block", marginBlock: 8 }}>
          <input type="checkbox" checked={checked[index]} onChange={event => {
            const value = event.target.checked;
            setChecked(previous => previous.map((item, i) => i === index ? value : item));
          }} /> {label}
        </label>
      ))}
    </fieldset>
    <button type="button" className="swahili-book__button" disabled={disabled || !ready}
      onClick={() => { if (!disabled && ready) onSubmit(); }}>{children}</button>
  </>;
}
