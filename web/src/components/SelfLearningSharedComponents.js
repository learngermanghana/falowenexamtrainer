import React from "react";
import { styles } from "../styles";
import { describeGrammarFocusItem } from "../lib/grammarFocusNotes";

export const DayTabs = ({ dayKey, tabs, activeTab, onChange, tablistLabel }) => {
  const onKeyDown = (event, index) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();

    if (event.key === "Home") {
      onChange(tabs[0].id);
      return;
    }

    if (event.key === "End") {
      onChange(tabs[tabs.length - 1].id);
      return;
    }

    const delta = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + delta + tabs.length) % tabs.length;
    onChange(tabs[nextIndex].id);
  };

  return (
    <div role="tablist" aria-label={tablistLabel} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            id={`${dayKey}-${tab.id}-tab`}
            aria-controls={`${dayKey}-${tab.id}-panel`}
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            style={isActive ? styles.primaryButton : styles.secondaryButton}
          >
            <span>{tab.label}</span>
            {tab.badge ? (
              <span style={{ ...styles.badge, marginLeft: 6, padding: "0 6px", fontSize: 11 }}>{tab.badge}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};

export const OverviewPanel = ({ dayKey, entry, grammarLanguage, labels }) => {
  const hasOverview = Boolean(
    entry.learningObjectives?.length || entry.grammarFocus?.items?.length || entry.brainMap?.length
  );

  return (
    <div role="tabpanel" id={`${dayKey}-overview-panel`} aria-labelledby={`${dayKey}-overview-tab`} style={{ display: "grid", gap: 8 }}>
      {entry.learningObjectives?.length ? (
        <div style={{ ...styles.helperText, marginTop: 0 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{labels.learningObjectives}</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {entry.learningObjectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {entry.grammarFocus?.items?.length ? (
        <div style={{ ...styles.helperText, marginTop: 0 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {labels.grammarFocus} {entry.grammarFocus.group ? `(${entry.grammarFocus.group})` : ""}
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
            {entry.grammarFocus.items.map((item) => {
              const grammarItem = describeGrammarFocusItem(item, grammarLanguage);
              return (
                <li key={grammarItem.title}>
                  <strong>{grammarItem.title}</strong>
                  <div>{grammarItem.note}</div>
                  <div style={{ fontStyle: "italic", color: "#374151", marginTop: 2 }}>
                    {grammarItem.exampleLabel} {grammarItem.example}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      {entry.brainMap?.length ? (
        <div style={{ ...styles.helperText, marginTop: 0 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{labels.brainMap}</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {entry.brainMap.map((idea) => (
              <li key={idea}>{idea}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {!hasOverview ? <p style={{ ...styles.helperText, margin: 0 }}>{labels.emptyOverview}</p> : null}
    </div>
  );
};

export const ResourcePanel = ({
  dayKey,
  entry,
  readingResource,
  listeningResource,
  sheetVocabLoaded,
  skimmingWords,
  flashcardIndex,
  onPrevCard,
  onNextCard,
  onRandomCard,
  dayState,
  onToggleSkimming,
  labels,
}) => (
  <div role="tabpanel" id={`${dayKey}-resources-panel`} aria-labelledby={`${dayKey}-resources-tab`} style={{ display: "grid", gap: 12 }}>
    {entry.activities ? (
      <div style={{ display: "grid", gap: 6 }}>
        <strong>{labels.activitiesTitle}</strong>
        {entry.activities.quiz?.length ? (
          <>
            <div style={{ ...styles.helperText, fontWeight: 600 }}>{labels.quizTitle}</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {entry.activities.quiz.map((question) => (
                <li key={question} style={styles.helperText}>
                  {question}
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {entry.activities.discussionPrompt ? (
          <p style={{ ...styles.helperText, margin: 0 }}>
            <strong>{labels.discussionLabel}</strong> {entry.activities.discussionPrompt}
          </p>
        ) : null}
        {entry.activities.reflectionPrompt ? (
          <p style={{ ...styles.helperText, margin: 0 }}>
            <strong>{labels.reflectionLabel}</strong> {entry.activities.reflectionPrompt}
          </p>
        ) : null}
      </div>
    ) : null}

    {entry.reading ? (
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <strong>{labels.readingTitle}</strong>
          {entry.reading.optional ? <span style={{ ...styles.badge, background: "#ecfeff", color: "#0e7490" }}>{labels.optionalBadge}</span> : null}
        </div>
        <p style={{ ...styles.helperText, margin: 0, fontWeight: 600 }}>{readingResource?.title || entry.reading.title}</p>
        {readingResource?.description ? <p style={{ ...styles.helperText, margin: 0 }}>{readingResource.description}</p> : null}
        {entry.reading.text ? <p style={{ ...styles.helperText, margin: 0 }}>{entry.reading.text}</p> : null}
        {readingResource?.url ? (
          <a href={readingResource.url} target="_blank" rel="noreferrer" style={styles.linkButton}>
            {labels.openReading}
          </a>
        ) : null}
        {entry.reading.tasks?.length ? (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {entry.reading.tasks.map((task) => (
              <li key={task} style={styles.helperText}>{task}</li>
            ))}
          </ul>
        ) : null}
        {readingResource?.source || entry.reading.source ? (
          <p style={{ ...styles.helperText, margin: 0, color: "#6b7280" }}>
            {labels.sourcePrefix} {readingResource?.source || entry.reading.source}
          </p>
        ) : null}
      </div>
    ) : null}

    {entry.listening ? (
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <strong>{labels.listeningTitle}</strong>
          {entry.listening.optional ? <span style={{ ...styles.badge, background: "#ecfeff", color: "#0e7490" }}>{labels.optionalBadge}</span> : null}
        </div>
        <p style={{ ...styles.helperText, margin: 0, fontWeight: 600 }}>{listeningResource?.title || entry.listening.title}</p>
        {listeningResource?.description ? <p style={{ ...styles.helperText, margin: 0 }}>{listeningResource.description}</p> : null}
        {entry.listening.prompt ? <p style={{ ...styles.helperText, margin: 0 }}>{entry.listening.prompt}</p> : null}
        {listeningResource?.url ? (
          <a href={listeningResource.url} target="_blank" rel="noreferrer" style={styles.linkButton}>
            {labels.openListening}
          </a>
        ) : null}
        {entry.listening.tasks?.length ? (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {entry.listening.tasks.map((task) => (
              <li key={task} style={styles.helperText}>{task}</li>
            ))}
          </ul>
        ) : null}
        {listeningResource?.source || entry.listening.source ? (
          <p style={{ ...styles.helperText, margin: 0, color: "#6b7280" }}>
            {labels.sourcePrefix} {listeningResource?.source || entry.listening.source}
          </p>
        ) : null}
      </div>
    ) : null}

    <div style={{ display: "grid", gap: 6 }}>
      <strong>{labels.skimmingTitle}</strong>
      <p style={{ ...styles.helperText, margin: 0 }}>{labels.skimmingHelper}</p>
      {!sheetVocabLoaded ? <p style={{ ...styles.helperText, margin: 0 }}>{labels.loadingVocab}</p> : null}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {skimmingWords.map((word) => (
          <span key={word} style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>{word}</span>
        ))}
      </div>
      {skimmingWords.length ? (
        <div style={{ ...styles.card, padding: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>{labels.flashcardTitle}</div>
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{skimmingWords[flashcardIndex]}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" style={styles.secondaryButton} onClick={onPrevCard}>{labels.prevCard}</button>
            <button type="button" style={styles.secondaryButton} onClick={onNextCard}>{labels.nextCard}</button>
            <button type="button" style={styles.linkButton} onClick={onRandomCard}>{labels.randomCard}</button>
          </div>
        </div>
      ) : null}
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="checkbox" checked={dayState.skimmingComplete} onChange={(event) => onToggleSkimming(event.target.checked)} />
        <span style={styles.label}>{labels.skimmingCompleteLabel}</span>
      </label>
    </div>
  </div>
);

export const WeeklyReviewPanel = ({ dayKey, weeklyReview, labels }) => {
  if (!weeklyReview) {
    return (
      <div role="tabpanel" id={`${dayKey}-review-panel`} aria-labelledby={`${dayKey}-review-tab`}>
        <p style={{ ...styles.helperText, margin: 0 }}>{labels.emptyReview}</p>
      </div>
    );
  }

  return (
    <div role="tabpanel" id={`${dayKey}-review-panel`} aria-labelledby={`${dayKey}-review-tab`} style={{ display: "grid", gap: 6 }}>
      <strong>{labels.reviewTitle}</strong>
      {weeklyReview.summary ? <p style={{ ...styles.helperText, margin: 0 }}>{weeklyReview.summary}</p> : null}
      {weeklyReview.reflectionQuestions?.length ? (
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {weeklyReview.reflectionQuestions.map((question) => (
            <li key={question} style={styles.helperText}>{question}</li>
          ))}
        </ul>
      ) : null}
      {weeklyReview.practicePrompt ? (
        <p style={{ ...styles.helperText, margin: 0 }}>
          <strong>{labels.practiceLabel}</strong> {weeklyReview.practicePrompt}
        </p>
      ) : null}
    </div>
  );
};
