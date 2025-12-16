import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { courseOverview, sheetResults, chatPrompts } from "../data/courseData";
import { courseSchedules } from "../data/courseSchedule";
import { writingLetters } from "../data/writingLetters";
import { useAuth } from "../context/AuthContext";
import { fetchAssignmentSummary } from "../services/assignmentService";
import {
  isSubmissionLocked,
  loadDraftForStudent,
  loadStudentCodeForEmail,
  rememberStudentCodeForEmail,
  saveDraftForStudent,
  submitFinalWork,
  saveDraftToSpecificPath,
  submitWorkToSpecificPath,
} from "../services/submissionService";

const tabs = [
  { key: "home", label: "Home" },
  { key: "course", label: "My Course" },
  { key: "chat", label: "Class Chat" },
  { key: "results", label: "My Results" },
  { key: "letters", label: "Schreiben Trainer" },
];

const StatCard = ({ label, value, helper }) => (
  <div style={{ ...styles.card, marginBottom: 0 }}>
    <div style={{ fontSize: 13, color: "#4b5563" }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{value}</div>
    {helper ? <div style={{ ...styles.helperText, margin: "6px 0 0" }}>{helper}</div> : null}
  </div>
);

const CourseTab = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "coach",
      text: `Willkommen, ${courseOverview.studentName}! Wähle einen Prompt oder frag mich direkt, ich bereite dich auf ${courseOverview.upcomingSession.topic} vor.`,
    },
  ]);
  const [letterLevel, setLetterLevel] = useState("all");
  const [selectedCourseLevel, setSelectedCourseLevel] = useState("A1");
  const [submissionLevel, setSubmissionLevel] = useState("A1");
  const [studentCode, setStudentCode] = useState("");
  const [workDraft, setWorkDraft] = useState("");
  const [draftStatus, setDraftStatus] = useState("");
  const [manualDraftStatus, setManualDraftStatus] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [manualSubmissionStatus, setManualSubmissionStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [locked, setLocked] = useState(false);
  const [assignmentSummary, setAssignmentSummary] = useState(null);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [assignmentError, setAssignmentError] = useState("");
  const [leaderboardLevel, setLeaderboardLevel] = useState("A1");

  const LESSON_ASSIGNMENT_NAME = "A1_day10_ch6";
  const LESSON_POST_ID = "0lYQbCPoL4nEux99kYZk";

  const sanitizePathSegment = (value) =>
    (value || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9@._-]/gi, "-");

  const lessonDraftPath = useMemo(() => {
    if (!studentCode) return "";
    return `/drafts_v2/${sanitizePathSegment(studentCode)}/lessons/${LESSON_ASSIGNMENT_NAME}`;
  }, [studentCode]);

  const lessonSubmissionPath = useMemo(
    () => `/submissions/${submissionLevel}/posts/${LESSON_POST_ID}`,
    [submissionLevel]
  );

  const filteredLetters = useMemo(() => {
    if (letterLevel === "all") return writingLetters;
    return writingLetters.filter((letter) => letter.level === letterLevel);
  }, [letterLevel]);

  useEffect(() => {
    if (!user?.email) return;
    const storedCode = loadStudentCodeForEmail(user.email);
    if (storedCode) {
      setStudentCode(storedCode);
    }
  }, [user?.email]);

  useEffect(() => {
    setSubmissionLevel(selectedCourseLevel);
  }, [selectedCourseLevel]);

  useEffect(() => {
    let cancelled = false;

    const loadAssignmentSummary = async () => {
      setAssignmentLoading(true);
      setAssignmentError("");

      try {
        const data = await fetchAssignmentSummary({ studentCode });
        if (cancelled) return;

        setAssignmentSummary(data);
        const levels = Object.keys(data?.leaderboard || {});
        if (levels.length) {
          setLeaderboardLevel((prev) => (levels.includes(prev) ? prev : levels[0]));
        }
      } catch (error) {
        if (cancelled) return;
        setAssignmentError(
          error?.response?.data?.error ||
            error?.message ||
            "Konnte Assignment-Daten nicht laden."
        );
      } finally {
        if (!cancelled) {
          setAssignmentLoading(false);
        }
      }
    };

    loadAssignmentSummary();

    return () => {
      cancelled = true;
    };
  }, [studentCode]);

  useEffect(() => {
    if (!assignmentSummary?.leaderboard) return;
    if (assignmentSummary.leaderboard[selectedCourseLevel]) {
      setLeaderboardLevel(selectedCourseLevel);
    }
  }, [assignmentSummary?.leaderboard, selectedCourseLevel]);

  useEffect(() => {
    if (!user?.email || !studentCode) {
      setWorkDraft("");
      setDraftStatus("Add your student code to start saving drafts to /drafts_v2.");
      setLocked(false);
      return;
    }

    const draft = loadDraftForStudent({
      email: user.email,
      studentCode,
      level: submissionLevel,
    });
    setWorkDraft(draft.content || "");
    setDraftStatus(
      draft.updatedAt
        ? `Draft restored from /${draft.path}`
        : `Ready to save drafts to /${draft.path}`
    );

    const lockState = isSubmissionLocked({ email: user.email, studentCode });
    setLocked(lockState.locked);
    if (lockState.locked) {
      const lockedAt = lockState.lockedAt
        ? ` at ${new Date(lockState.lockedAt).toLocaleString()}`
        : "";
      setSubmissionStatus(`Submission locked via /${lockState.lockPath}${lockedAt}`);
    } else {
      setSubmissionStatus("");
    }
  }, [studentCode, submissionLevel, user?.email]);

  useEffect(() => {
    if (!user?.email || !studentCode || locked) return;
    const handle = setTimeout(() => {
      const result = saveDraftForStudent({
        email: user.email,
        studentCode,
        level: submissionLevel,
        content: workDraft,
      });
      setDraftStatus(
        `Draft saved to /${result.path} (${new Date(result.savedAt).toLocaleTimeString()})`
      );
      setManualDraftStatus("");
    }, 800);

    return () => clearTimeout(handle);
  }, [user?.email, studentCode, submissionLevel, workDraft, locked]);

  useEffect(() => {
    if (user?.email && studentCode) {
      rememberStudentCodeForEmail(user.email, studentCode);
    }
  }, [studentCode, user?.email]);

  const streakStats = assignmentSummary?.student;
  const streakValue = assignmentLoading
    ? "Lädt …"
    : streakStats
    ? `${streakStats.weekAssignments} diese Woche`
    : `${courseOverview.assignmentStreak} Tage`;
  const streakHelper = assignmentLoading
    ? "Hole Abgaben aus dem Sheet …"
    : streakStats
    ? `${streakStats.weekAttempts} Abgaben · ${streakStats.retriesThisWeek} Wiederholungen${
        streakStats.lastAssignment ? ` · Letzte: ${streakStats.lastAssignment}` : ""
      }`
    : "Halte die Serie – jede Aufgabe zählt.";

  const renderAssignmentLeaderboard = () => {
    const levels = Object.keys(assignmentSummary?.leaderboard || {});

    if (!levels.length) {
      return assignmentLoading ? (
        <div style={{ ...styles.card, display: "grid", gap: 6 }}>
          <h3 style={{ margin: 0 }}>Assignments Leaderboard</h3>
          <p style={{ ...styles.helperText, margin: 0 }}>Sheet wird geladen …</p>
        </div>
      ) : null;
    }

    const activeLevel = levels.includes(leaderboardLevel)
      ? leaderboardLevel
      : levels[0];
    const rows = assignmentSummary.leaderboard[activeLevel] || [];

    return (
      <div style={{ ...styles.card, display: "grid", gap: 10 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <h3 style={{ margin: 0 }}>Assignments Leaderboard</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={styles.helperText}>Level</span>
            <select
              style={styles.select}
              value={activeLevel}
              onChange={(e) => setLeaderboardLevel(e.target.value)}
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p style={{ ...styles.helperText, margin: 0 }}>
          Ranking basiert auf höchster Note und der Anzahl eindeutiger Abgaben pro Level.
        </p>
        {assignmentError ? <div style={styles.errorBox}>{assignmentError}</div> : null}

        <div style={{ display: "grid", gap: 10 }}>
          {rows.length === 0 ? (
            <div style={styles.helperText}>Keine Einträge für dieses Level.</div>
          ) : (
            rows.map((row, index) => (
              <div
                key={`${row.studentCode}-${row.lastDate || index}`}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  background: "#f9fafb",
                  display: "grid",
                  gap: 6,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ fontWeight: 800, display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ color: "#6b7280" }}>{index + 1}.</span>
                    <span>{row.name || row.studentCode}</span>
                  </div>
                  <span style={styles.badge}>{row.studentCode}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 13, color: "#374151" }}>
                  <span>Assignments: {row.assignmentCount}</span>
                  <span>Beste Note: {Math.round(row.bestScore || 0)}%</span>
                  {row.lastDate ? (
                    <span>Letzte Abgabe: {new Date(row.lastDate).toLocaleDateString()}</span>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const handleSend = (value) => {
    const content = value?.trim();
    if (!content) return;

    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: content },
      {
        sender: "coach",
        text: `Notiert. Für ${courseOverview.nextAssignment.title} nutze bitte die Redemittel aus Kapitel 5. Denk an dein Ziel: ${streakValue} und ${courseOverview.attendanceSummary}.`,
      },
    ]);
    setChatInput("");
  };

  const handleSubmitWork = async () => {
    setSubmissionStatus("");
    setManualSubmissionStatus("");
    if (!user?.email) {
      setSubmissionStatus("Please sign in to submit your work.");
      return;
    }

    if (!studentCode.trim()) {
      setSubmissionStatus("Enter your student code to track the submission.");
      return;
    }

    if (!workDraft.trim()) {
      setSubmissionStatus("Add your coursework before submitting.");
      return;
    }

    const existingLock = isSubmissionLocked({ email: user.email, studentCode });
    if (existingLock.locked) {
      setLocked(true);
      setSubmissionStatus(`Submission already locked at /${existingLock.lockPath}.`);
      return;
    }

    setSubmitting(true);
    try {
      const result = submitFinalWork({
        email: user.email,
        studentCode,
        level: submissionLevel,
        content: workDraft,
      });

      setLocked(true);
      if (result.locked) {
        setSubmissionStatus(`Submission locked at /${result.lockPath}.`);
        return;
      }

      setSubmissionStatus(
        `Submitted to /${result.submissionPath} and locked at /${result.lockPath}.`
      );
    } catch (error) {
      console.error("Failed to submit work", error);
      setSubmissionStatus("Could not submit your work. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveLessonDraft = () => {
    if (!workDraft.trim()) {
      setManualDraftStatus("Add content before saving your lesson draft.");
      return;
    }

    if (!lessonDraftPath) {
      setManualDraftStatus("Enter your student code to save this lesson draft.");
      return;
    }

    const result = saveDraftToSpecificPath({ path: lessonDraftPath, content: workDraft });
    setManualDraftStatus(
      `Draft saved to ${lessonDraftPath} (${new Date(result.savedAt).toLocaleTimeString()})`
    );
  };

  const handleSubmitLessonWork = () => {
    if (!workDraft.trim()) {
      setManualSubmissionStatus("Add your coursework before submitting this lesson.");
      return;
    }

    const result = submitWorkToSpecificPath({ path: lessonSubmissionPath, content: workDraft });
    setManualSubmissionStatus(
      `Submitted to ${lessonSubmissionPath} (${new Date(result.savedAt).toLocaleTimeString()})`
    );
  };

  const renderHome = () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h2 style={styles.sectionTitle}>Course Home</h2>
        <span style={styles.badge}>Live aus Kurs-Dictionary</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        <StatCard
          label="Assignment Streak"
          value={streakValue}
          helper={assignmentError ? `Sheet-Fehler: ${assignmentError}` : streakHelper}
        />
        <StatCard
          label="Anwesenheit"
          value={`${courseOverview.attendanceRate}%`}
          helper={courseOverview.attendanceSummary}
        />
        <StatCard
          label="Nächste Session"
          value={courseOverview.upcomingSession.topic}
          helper={`${courseOverview.upcomingSession.materials} · Fokus: ${courseOverview.upcomingSession.focus}`}
        />
      </div>

      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Nächste empfohlene Aufgabe</h3>
          <span style={styles.levelPill}>Due: {courseOverview.nextAssignment.dueDate}</span>
        </div>
        <p style={{ ...styles.helperText, margin: 0 }}>{courseOverview.nextAssignment.title}</p>
        <p style={{ margin: 0 }}>{courseOverview.nextAssignment.description}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={styles.badge}>Kapitel 5</span>
          <span style={styles.badge}>Schreiben</span>
          <span style={styles.badge}>80–100 Wörter</span>
        </div>
      </div>

      {renderAssignmentLeaderboard()}
    </div>
  );

  const renderCourse = () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <h2 style={styles.sectionTitle}>My Course</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={styles.helperText}>Course level:</span>
          <select
            style={styles.select}
            value={selectedCourseLevel}
            onChange={(e) => setSelectedCourseLevel(e.target.value)}
          >
            {Object.keys(courseSchedules).map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p style={styles.helperText}>
        Pulling content from the course dictionary. Select a level to see its full day-by-day plan.
      </p>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {(courseSchedules[selectedCourseLevel] || []).map((entry) => {
          const lesenHorenList = Array.isArray(entry.lesen_hören)
            ? entry.lesen_hören
            : entry.lesen_hören
            ? [entry.lesen_hören]
            : [];
          const schreibenSprechenList = entry.schreiben_sprechen
            ? Array.isArray(entry.schreiben_sprechen)
              ? entry.schreiben_sprechen
              : [entry.schreiben_sprechen]
            : [];

          return (
            <div key={`day-${entry.day}`} style={{ ...styles.card, marginBottom: 0, display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div>
                  <span style={styles.levelPill}>Day {entry.day}</span>
                  <h3 style={{ margin: "6px 0 4px 0" }}>{entry.topic}</h3>
                  {entry.chapter ? (
                    <div style={{ ...styles.helperText, marginBottom: 4 }}>Chapter: {entry.chapter}</div>
                  ) : null}
                </div>
                <div style={{ display: "grid", gap: 6, justifyItems: "flex-end" }}>
                  {entry.assignment !== undefined ? (
                    <span style={styles.badge}>{entry.assignment ? "Assignment" : "Self-practice"}</span>
                  ) : null}
                  {entry.grammar_topic ? <span style={styles.levelPill}>{entry.grammar_topic}</span> : null}
                </div>
              </div>

              {entry.goal ? <p style={{ margin: 0 }}>{entry.goal}</p> : null}
              {entry.instruction ? <p style={{ ...styles.helperText, margin: 0 }}>{entry.instruction}</p> : null}

              {lesenHorenList.length > 0 ? (
                <div style={{ display: "grid", gap: 8 }}>
                  <h4 style={{ margin: 0 }}>Lesen &amp; Hören</h4>
                  <div style={{ display: "grid", gap: 8 }}>
                    {lesenHorenList.map((lesson, index) => (
                      <div
                        key={`${entry.day}-lesen-${lesson.chapter || index}`}
                        style={{
                          padding: 10,
                          borderRadius: 10,
                          border: "1px solid #e5e7eb",
                          background: "#f9fafb",
                          display: "grid",
                          gap: 6,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                          <div style={{ fontWeight: 700 }}>
                            {lesson.chapter ? `Kapitel ${lesson.chapter}` : "Resource"}
                          </div>
                          {lesson.assignment ? <span style={styles.badge}>Assignment</span> : null}
                        </div>
                        <ul style={{ ...styles.checklist, margin: 0 }}>
                          {lesson.video ? (
                            <li>
                              <a href={lesson.video} target="_blank" rel="noreferrer">
                                Video ansehen
                              </a>
                            </li>
                          ) : null}
                          {lesson.grammarbook_link ? (
                            <li>
                              <a href={lesson.grammarbook_link} target="_blank" rel="noreferrer">
                                Grammarbook
                              </a>
                            </li>
                          ) : null}
                          {lesson.workbook_link ? (
                            <li>
                              <a href={lesson.workbook_link} target="_blank" rel="noreferrer">
                                Workbook
                              </a>
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {schreibenSprechenList.length > 0 ? (
                <div style={{ display: "grid", gap: 8 }}>
                  <h4 style={{ margin: 0 }}>Schreiben &amp; Sprechen</h4>
                  <div style={{ display: "grid", gap: 8 }}>
                    {schreibenSprechenList.map((lesson, index) => (
                      <div
                        key={`${entry.day}-schreiben-${lesson.chapter || index}`}
                        style={{
                          padding: 10,
                          borderRadius: 10,
                          border: "1px solid #e5e7eb",
                          background: "#f8fafc",
                          display: "grid",
                          gap: 6,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                          <div style={{ fontWeight: 700 }}>
                            {lesson.chapter ? `Kapitel ${lesson.chapter}` : "Übung"}
                          </div>
                          {lesson.assignment ? <span style={styles.badge}>Assignment</span> : null}
                        </div>
                        <ul style={{ ...styles.checklist, margin: 0 }}>
                          {lesson.video ? (
                            <li>
                              <a href={lesson.video} target="_blank" rel="noreferrer">
                                Video ansehen
                              </a>
                            </li>
                          ) : null}
                          {lesson.workbook_link ? (
                            <li>
                              <a href={lesson.workbook_link} target="_blank" rel="noreferrer">
                                Workbook
                              </a>
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderChat = () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
        <h2 style={styles.sectionTitle}>Class Chat · AI Coach</h2>
        <span style={styles.badge}>Vorbereitung auf den Unterricht</span>
      </div>
      <p style={styles.helperText}>Fragen für die nächste Stunde, Redemittel oder Mini-Übungen – die Antworten nutzen dein Kurs-Dictionary.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {chatPrompts.map((prompt) => (
          <button
            key={prompt}
            style={styles.secondaryButton}
            onClick={() => handleSend(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
      <div style={{ ...styles.card, display: "grid", gap: 10 }}>
        <div style={styles.chatLog}>
          {chatMessages.map((message, index) => (
            <div
              key={`${message.sender}-${index}`}
              style={message.sender === "coach" ? styles.chatBubbleCoach : styles.chatBubbleUser}
            >
              <strong>{message.sender === "coach" ? "Coach" : "Du"}:</strong> {message.text}
            </div>
          ))}
        </div>
        <textarea
          style={styles.textareaSmall}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Frag den Coach nach Redemitteln oder lasse dir eine Mini-Übung geben"
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button style={styles.primaryButton} onClick={() => handleSend(chatInput)}>Nachricht senden</button>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
        <h2 style={styles.sectionTitle}>My Results</h2>
        <span style={styles.badge}>Import: Google Sheet</span>
      </div>
      <p style={styles.helperText}>Die Werte stammen aus dem letzten Google-Sheet-Sync und zeigen Score, Aufgabe und Kurzfeedback.</p>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {sheetResults.map((row) => (
          <div key={`${row.date}-${row.task}`} style={{ ...styles.card, marginBottom: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
              <h3 style={{ margin: "0 0 4px 0" }}>{row.skill}</h3>
              <span style={styles.badge}>{row.date}</span>
            </div>
            <p style={{ margin: "0 0 6px 0" }}>{row.task}</p>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{row.score}</div>
            <p style={{ ...styles.helperText, margin: 0 }}>{row.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLetters = () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
        <h2 style={styles.sectionTitle}>Schreiben Trainer</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={styles.helperText}>Level filtern:</span>
          <select
            style={styles.select}
            value={letterLevel}
            onChange={(e) => setLetterLevel(e.target.value)}
          >
            <option value="all">Alle</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
          </select>
        </div>
      </div>
      <p style={styles.helperText}>Wähle eine Vorlage und schreibe den Text in 10–20 Minuten. Nutze sie im Unterricht oder lade sie im Schreib-Tab hoch.</p>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {filteredLetters.map((letter) => (
          <div key={letter.id} style={{ ...styles.card, marginBottom: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <h3 style={{ margin: "0 0 4px 0" }}>{letter.letter}</h3>
              <span style={styles.badge}>{letter.level}</span>
            </div>
            <div style={{ ...styles.helperText, marginBottom: 6 }}>Dauer: {letter.durationMinutes} Minuten</div>
            <p style={{ margin: "0 0 6px 0" }}>{letter.situation}</p>
            <ul style={styles.checklist}>
              {letter.whatToInclude.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSubmission = () => (
    <section style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <h2 style={styles.sectionTitle}>Submit your coursework</h2>
        <span style={styles.badge}>/drafts_v2 · /submissions/{submissionLevel}</span>
      </div>
      <p style={styles.helperText}>
        Drafts are auto-saved in Firebase-style paths using your email + student code. Final submissions land in
        /submissions/{submissionLevel} and are locked via /submission_locks once you submit.
      </p>
      <p style={styles.helperText}>
        Need explicit lesson paths? Use the new buttons to save drafts to
        {" "}
        {lessonDraftPath || `/drafts_v2/<student-code>/lessons/${LESSON_ASSIGNMENT_NAME}`} and to submit the final version
        to {lessonSubmissionPath}.
      </p>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <div>
          <label style={styles.label}>Student email</label>
          <input
            value={user?.email || ""}
            readOnly
            style={{ ...styles.textArea, minHeight: "auto", height: 44, background: "#f9fafb" }}
          />
          <p style={styles.helperText}>Used to key your draft and submission.</p>
        </div>
        <div>
          <label style={styles.label}>Student code</label>
          <input
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            placeholder="Campus / student code"
            style={{ ...styles.textArea, minHeight: "auto", height: 44 }}
            disabled={locked}
          />
          <p style={styles.helperText}>Required alongside email to store drafts and submissions.</p>
        </div>
        <div>
          <label style={styles.label}>Course level for this upload</label>
          <select
            style={styles.select}
            value={submissionLevel}
            onChange={(e) => setSubmissionLevel(e.target.value)}
            disabled={locked}
          >
            {Object.keys(courseSchedules).map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <p style={styles.helperText}>Matches the /submissions/{submissionLevel} path.</p>
        </div>
      </div>

      <div>
        <label style={styles.label}>Your work</label>
        <textarea
          style={styles.textArea}
          value={workDraft}
          disabled={locked}
          onChange={(e) => setWorkDraft(e.target.value)}
          rows={6}
          placeholder="Paste or type your course work. Drafts save to /drafts_v2 while you type."
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span style={{ ...styles.helperText, margin: 0 }}>{draftStatus}</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {locked && <span style={styles.lockPill}>Locked</span>}
              <button
                style={styles.secondaryButton}
                type="button"
                onClick={handleSaveLessonDraft}
                disabled={locked}
              >
                Save draft to lessons path
              </button>
              <button
                style={styles.secondaryButton}
                type="button"
                onClick={handleSubmitLessonWork}
                disabled={locked}
              >
                Submit to lessons path
              </button>
              <button
                style={styles.primaryButton}
                onClick={handleSubmitWork}
                disabled={locked || submitting}
            >
              {locked ? "Submission locked" : submitting ? "Submitting..." : "Submit work"}
            </button>
          </div>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {manualDraftStatus && (
            <div style={styles.successBox}>
              {manualDraftStatus} {lessonDraftPath ? `(path: ${lessonDraftPath})` : ""}
            </div>
          )}
          {manualSubmissionStatus && (
            <div style={styles.successBox}>
              {manualSubmissionStatus} (path: {lessonSubmissionPath})
            </div>
          )}
        </div>
      </div>

      {submissionStatus && (
        <div
          style={
            submissionStatus.toLowerCase().includes("submitted to")
              ? styles.successBox
              : styles.errorBox
          }
        >
          {submissionStatus}
        </div>
      )}
    </section>
  );

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={styles.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            style={activeTab === tab.key ? styles.tabButtonActive : styles.tabButton}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "home" && renderHome()}
      {activeTab === "course" && renderCourse()}
      {activeTab === "chat" && renderChat()}
      {activeTab === "results" && renderResults()}
      {activeTab === "letters" && renderLetters()}
      {activeTab === "course" && renderSubmission()}
    </div>
  );
};

export default CourseTab;
