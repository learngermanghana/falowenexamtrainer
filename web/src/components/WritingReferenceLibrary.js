import React from "react";
import { styles } from "../styles";
import { countReferenceWords } from "../lib/writingReferenceLibrary";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const buildReferencePreview = (body = "", maxLength = 150) => {
  const clean = String(body || "").replace(/\s+/g, " ").trim();
  if (!clean) return "No body text saved yet.";
  return clean.length > maxLength ? `${clean.slice(0, maxLength)}...` : clean;
};

const WritingReferenceLibrary = ({
  title = "Reference library",
  description = "Save each pasted reference with a clear topic. The main page stays clean; open a topic to study the full note on its own page.",
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

  const openReferencePage = (note) => {
    if (!note) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Pop-up blocked. Please allow pop-ups to open the reference page.");
      return;
    }

    const wordCount = countReferenceWords(note.body);
    const safeTitle = escapeHtml(note.topic || "Reference page");
    const safeBody = escapeHtml(note.body || "");

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${safeTitle}</title>
          <style>
            :root { color-scheme: light; }
            body {
              margin: 0;
              background: #f1f5f9;
              color: #0f172a;
              font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              line-height: 1.75;
            }
            .page {
              width: min(900px, calc(100% - 32px));
              margin: 32px auto;
              display: grid;
              gap: 16px;
            }
            .toolbar {
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 12px;
              flex-wrap: wrap;
            }
            .brand {
              font-size: 13px;
              font-weight: 800;
              color: #2563eb;
              text-transform: uppercase;
              letter-spacing: .08em;
            }
            .actions { display: flex; gap: 8px; flex-wrap: wrap; }
            button {
              border: 1px solid #cbd5e1;
              background: #ffffff;
              color: #0f172a;
              border-radius: 999px;
              padding: 10px 14px;
              font-weight: 800;
              cursor: pointer;
            }
            button.primary {
              background: #2563eb;
              color: white;
              border-color: #2563eb;
              box-shadow: 0 10px 24px rgba(37, 99, 235, .24);
            }
            article {
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 24px;
              box-shadow: 0 18px 45px rgba(15, 23, 42, .08);
              padding: clamp(20px, 4vw, 44px);
            }
            h1 {
              margin: 0 0 10px;
              font-size: clamp(28px, 4vw, 46px);
              line-height: 1.05;
              letter-spacing: -0.04em;
            }
            .meta {
              display: flex;
              gap: 8px;
              flex-wrap: wrap;
              margin-bottom: 22px;
              color: #475569;
              font-size: 14px;
              font-weight: 700;
            }
            .body {
              white-space: pre-wrap;
              font-size: 17px;
            }
            @media print {
              body { background: #ffffff; }
              .page { width: 100%; margin: 0; }
              .toolbar { display: none; }
              article { box-shadow: none; border: none; border-radius: 0; padding: 0; }
            }
          </style>
        </head>
        <body>
          <main class="page">
            <div class="toolbar">
              <div>
                <div class="brand">Falowen reference page</div>
                <div>${wordCount} words</div>
              </div>
              <div class="actions">
                <button type="button" onclick="window.close()">Close</button>
                <button class="primary" type="button" onclick="window.print()">Download PDF / Print</button>
              </div>
            </div>
            <article>
              <h1>${safeTitle}</h1>
              <div class="meta">
                <span>${wordCount} words</span>
                <span>•</span>
                <span>Saved reference</span>
              </div>
              <div class="body">${safeBody}</div>
            </article>
          </main>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
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
            <span style={styles.badge}>Open full page</span>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={styles.label} htmlFor={`${idPrefix}-search-input`}>Search references</label>
            <input
              id={`${idPrefix}-search-input`}
              style={styles.input}
              value={referenceSearch}
              placeholder="Search topics and bodies..."
              onChange={(event) => setReferenceSearch(event.target.value)}
            />
          </div>

          {referenceNotes.length === 0 ? (
            <p style={styles.helperText}>{emptyText}</p>
          ) : filteredReferenceNotes.length === 0 ? (
            <p style={styles.helperText}>No topics match your search.</p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {filteredReferenceNotes.map((note) => {
                const selected = selectedReferenceNote?.id === note.id;
                return (
                  <article
                    key={note.id}
                    style={{
                      border: selected ? "1px solid #93c5fd" : "1px solid #e5e7eb",
                      borderRadius: 16,
                      padding: 14,
                      background: selected ? "#eff6ff" : "#ffffff",
                      boxShadow: selected ? "0 12px 28px rgba(37, 99, 235, 0.14)" : "0 8px 18px rgba(15, 23, 42, 0.04)",
                      display: "grid",
                      gap: 10,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ display: "grid", gap: 4 }}>
                        <strong style={{ fontSize: 15, lineHeight: 1.35 }}>{note.topic}</strong>
                        <p style={{ ...styles.helperText, margin: 0 }}>{buildReferencePreview(note.body)}</p>
                      </div>
                      <span style={{ ...styles.badge, whiteSpace: "nowrap" }}>{countReferenceWords(note.body)} words</span>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        style={styles.primaryButton}
                        onClick={() => {
                          setSelectedReferenceNoteId(note.id);
                          cancelEditingReferenceNote();
                          openReferencePage(note);
                        }}
                      >
                        Open page
                      </button>
                      <button type="button" style={styles.secondaryButton} onClick={() => addReferenceToLetter(note)}>
                        Add to letter
                      </button>
                      <button
                        type="button"
                        style={styles.secondaryButton}
                        onClick={() => {
                          setSelectedReferenceNoteId(note.id);
                          startEditingReferenceNote(note);
                        }}
                      >
                        Edit
                      </button>
                      <button type="button" style={styles.dangerButton} onClick={() => removeReferenceNote(note)}>
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedReferenceNote && editingReferenceNoteId === selectedReferenceNote.id ? (
        <div
          style={{
            marginTop: 16,
            border: "1px solid #cbd5e1",
            borderRadius: 14,
            background: "#f8fafc",
            padding: 14,
          }}
        >
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
              <button type="button" style={styles.secondaryButton} onClick={() => openReferencePage(selectedReferenceNote)}>
                Open page
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default WritingReferenceLibrary;
