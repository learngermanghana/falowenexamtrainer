import React from "react";
import { styles } from "../styles";
import { countReferenceWords } from "../lib/writingReferenceLibrary";

const WritingReferenceLibrary = ({
  title = "Reference library",
  description = "Save each pasted reference with a clear topic and body. The topic list stays short, and each topic opens a separate study page with the full note.",
  tip = "Use topics like “Apology letter”, “Complaint phrases”, or “B1 connectors”, then paste the complete explanation, examples, and corrections in the body.",
  emptyText = "No references saved yet. Add your first topic above — it will be saved with your writing workspace.",
  idPrefix = "writing-reference",
  topicPlaceholder = "e.g., Complaint letter phrases",
  referenceTopicInput,
  setReferenceTopicInput,
  referenceBodyInput,
  setReferenceBodyInput,
  referenceNotes,
  filteredReferenceNotes,
  selectedReferenceNote,
  setSelectedReferenceNoteId,
  editingReferenceNoteId,
  referenceEditTopicInput,
  setReferenceEditTopicInput,
  referenceEditBodyInput,
  setReferenceEditBodyInput,
  referenceSearch,
  setReferenceSearch,
  ideaError,
  ideaSuccess,
  setIdeaError,
  setIdeaSuccess,
  addReferenceNote,
  startEditingReferenceNote,
  cancelEditingReferenceNote,
  saveEditedReferenceNote,
  removeReferenceNote,
  addReferenceToLetter,
  bodyInputRef = null,
  bodyInputStyle = styles.textareaSmall,
  bodyRows = 7,
  renderBodyTools = null,
}) => {
  const clearDraft = () => {
    setReferenceTopicInput("");
    setReferenceBodyInput("");
    setIdeaError("");
    setIdeaSuccess("");
  };

  return (
    <section style={styles.card}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      <p style={styles.helperText}>{description}</p>
      <div style={{ ...styles.infoBox, marginBottom: 12 }}>
        <strong>Tip:</strong> {tip}
      </div>

      <div style={{ ...styles.gridTwo, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 10 }}>
          <label style={styles.label} htmlFor={`${idPrefix}-topic-input`}>Topic</label>
          <input
            id={`${idPrefix}-topic-input`}
            style={styles.input}
            value={referenceTopicInput}
            placeholder={topicPlaceholder}
            onChange={(event) => {
              setReferenceTopicInput(event.target.value);
              setIdeaError("");
              setIdeaSuccess("");
            }}
          />
          <label style={styles.label} htmlFor={`${idPrefix}-body-input`}>Body</label>
          <textarea
            id={`${idPrefix}-body-input`}
            ref={bodyInputRef}
            style={bodyInputStyle}
            rows={bodyRows}
            value={referenceBodyInput}
            placeholder="Paste the full reference text, corrections, examples, or notes here."
            onChange={(event) => {
              setReferenceBodyInput(event.target.value);
              setIdeaError("");
              setIdeaSuccess("");
            }}
          />
          {renderBodyTools ? renderBodyTools() : null}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" style={styles.primaryButton} onClick={addReferenceNote}>
              Save reference
            </button>
            <button type="button" style={styles.secondaryButton} onClick={clearDraft}>
              Clear
            </button>
          </div>
          {ideaError ? <div style={{ ...styles.errorBox, marginTop: 0 }}>{ideaError}</div> : null}
          {ideaSuccess ? <div style={{ ...styles.successBox, marginTop: 0 }}>{ideaSuccess}</div> : null}
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <h4 style={{ ...styles.resultHeading, margin: 0 }}>Topics ({filteredReferenceNotes.length}/{referenceNotes.length})</h4>
            <span style={styles.badge}>Tap a topic to open</span>
          </div>
          {referenceNotes.length === 0 ? (
            <p style={styles.helperText}>{emptyText}</p>
          ) : filteredReferenceNotes.length === 0 ? (
            <p style={styles.helperText}>No topics match your search.</p>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {filteredReferenceNotes.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => {
                    setSelectedReferenceNoteId(note.id);
                    cancelEditingReferenceNote();
                  }}
                  style={
                    selectedReferenceNote?.id === note.id
                      ? { ...styles.tabButtonActive, textAlign: "left", borderRadius: 12 }
                      : { ...styles.tabButton, textAlign: "left", borderRadius: 12 }
                  }
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                    <strong>{note.topic}</strong>
                    <span style={styles.badge}>{countReferenceWords(note.body)} words</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedReferenceNote ? (
        <div
          style={{
            marginTop: 16,
            border: "1px solid #cbd5e1",
            borderRadius: 14,
            background: "#f8fafc",
            padding: 14,
          }}
        >
          {editingReferenceNoteId === selectedReferenceNote.id ? (
            <div style={{ display: "grid", gap: 10 }}>
              <h4 style={{ ...styles.resultHeading, margin: 0 }}>Edit reference page</h4>
              <label style={styles.label} htmlFor={`${idPrefix}-edit-topic-input`}>Topic</label>
              <input
                id={`${idPrefix}-edit-topic-input`}
                style={styles.input}
                value={referenceEditTopicInput}
                onChange={(event) => {
                  setReferenceEditTopicInput(event.target.value);
                  setIdeaError("");
                  setIdeaSuccess("");
                }}
              />
              <label style={styles.label} htmlFor={`${idPrefix}-edit-body-input`}>Body</label>
              <textarea
                id={`${idPrefix}-edit-body-input`}
                style={styles.textareaSmall}
                rows={8}
                value={referenceEditBodyInput}
                onChange={(event) => {
                  setReferenceEditBodyInput(event.target.value);
                  setIdeaError("");
                  setIdeaSuccess("");
                }}
              />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" style={styles.primaryButton} onClick={() => saveEditedReferenceNote(selectedReferenceNote)}>
                  Save edit
                </button>
                <button type="button" style={styles.secondaryButton} onClick={cancelEditingReferenceNote}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <div>
                  <p style={{ ...styles.helperText, margin: "0 0 4px" }}>Reference page</p>
                  <h4 style={{ ...styles.sectionTitle, margin: 0 }}>{selectedReferenceNote.topic}</h4>
                </div>
                <span style={{ ...styles.levelPill, alignSelf: "flex-start" }}>
                  {countReferenceWords(selectedReferenceNote.body)} words
                </span>
              </div>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.75,
                  color: "#111827",
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 14,
                }}
              >
                {selectedReferenceNote.body}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" style={styles.secondaryButton} onClick={() => addReferenceToLetter(selectedReferenceNote)}>
                  Add body to letter
                </button>
                <button type="button" style={styles.secondaryButton} onClick={() => startEditingReferenceNote(selectedReferenceNote)}>
                  Edit page
                </button>
                <button type="button" style={styles.dangerButton} onClick={() => removeReferenceNote(selectedReferenceNote)}>
                  Delete page
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      <div style={{ marginTop: 16, display: "grid", gap: 6 }}>
        <label style={styles.label} htmlFor={`${idPrefix}-search-input`}>Search topics and bodies</label>
        <input
          id={`${idPrefix}-search-input`}
          style={styles.input}
          value={referenceSearch}
          placeholder="Search your reference library..."
          onChange={(event) => setReferenceSearch(event.target.value)}
        />
      </div>
    </section>
  );
};

export default WritingReferenceLibrary;
