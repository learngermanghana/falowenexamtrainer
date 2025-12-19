import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import { courseOverview, chatPrompts } from "../data/courseData";
import { courseSchedules } from "../data/courseSchedule";
import VocabPage from "./VocabPage";
import { useAuth } from "../context/AuthContext";
import { fetchAssignmentSummary } from "../services/assignmentService";
import {
  isSubmissionLocked,
  loadDraftForStudent,
  loadSubmissionForStudent,
  loadStudentCodeForEmail,
  rememberStudentCodeForEmail,
  saveDraftForStudent,
  saveDraftToSpecificPath,
  submitWorkToSpecificPath,
} from "../services/submissionService";
import { fetchResults } from "../services/resultsService";
import { deriveStudentProfile, findStudentByEmail } from "../services/studentDirectory";
import {
  appendChatMessages,
  ensureIntroMessage,
  subscribeToChatMessages,
} from "../services/chatService";

const tabs = [
  { key: "home", label: "Campus Home" },
  { key: "course", label: "My Course" },
  { key: "vocab", label: "Vokabeln" },
  { key: "submit", label: "Submit Work" },
  { key: "chat", label: "Falowen A.I." },
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
  const { user, studentProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatStatus, setChatStatus] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recorderError, setRecorderError] = useState("");
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recorderRef = useRef(null);
  const [writingSubtab, setWritingSubtab] = useState("mark");
  const [letterDraft, setLetterDraft] = useState("");
  const [letterFeedback, setLetterFeedback] = useState("");
  const [ideaMessages, setIdeaMessages] = useState([
    {
      sender: "coach",
      text: "Füge deine Prüfungsfrage ein und lass uns Ideen brainstormen, bevor du schreibst.",
    },
  ]);
  const [ideaInput, setIdeaInput] = useState("");
  const [selectedCourseLevel, setSelectedCourseLevel] = useState("A1");
  const [submissionLevel, setSubmissionLevel] = useState("A1");
  const [studentCode, setStudentCode] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState(
    courseOverview.nextAssignment.title
  );
  const [assignmentId, setAssignmentId] = useState("");
  const [workDraft, setWorkDraft] = useState("");
  const [draftStatus, setDraftStatus] = useState("");
  const [manualDraftStatus, setManualDraftStatus] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [receiptCode, setReceiptCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [locked, setLocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [lastSavedDraft, setLastSavedDraft] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [confirmComplete, setConfirmComplete] = useState(false);
  const [confirmLock, setConfirmLock] = useState(false);
  const [assignmentSummary, setAssignmentSummary] = useState(null);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [assignmentError, setAssignmentError] = useState("");
  const [leaderboardLevel, setLeaderboardLevel] = useState("A1");
  const [results, setResults] = useState([]);
  const [resultsMetrics, setResultsMetrics] = useState(null);
  const [resultsAssignments, setResultsAssignments] = useState([]);
  const [resultsLevel, setResultsLevel] = useState("A1");
  const [resultsStatus, setResultsStatus] = useState({
    loading: false,
    error: "",
    fetchedAt: null,
  });

  const studentLevel = (studentProfile?.level || selectedCourseLevel || "A1").toUpperCase();
  const studentFirstName = useMemo(() => {
    const fullName = studentProfile?.name || courseOverview.studentName || "Student";
    return fullName.split(" ")[0];
  }, [studentProfile?.name]);

  const studentEmail = useMemo(
    () => studentProfile?.email || user?.email || "",
    [studentProfile?.email, user?.email]
  );

  const falowenIntro = useMemo(
    () => ({
      sender: "coach",
      text: `Hi ${studentFirstName}, I’m Falowen A.I.—your German grammar coach and chat buddy. Ask a grammar question or just practice chatting; I’ll keep the guidance at your level (${studentLevel}).`,
      kind: "system",
      createdAt: new Date(),
    }),
    [studentFirstName, studentLevel]
  );

  const sendToOpenAI = async (content, history) => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      setChatStatus("Missing OpenAI API key. Add REACT_APP_OPENAI_API_KEY to your .env file.");
      return;
    }

    const thread = history || chatMessages;
    const chatPayload = [
      {
        role: "system",
        content: `You are Falowen, a patient German grammar coach. Keep answers concise, switch between German and English when helpful, and adapt to level ${studentLevel}. Encourage speaking aloud and correct short errors clearly.`,
      },
      ...thread.map((message) => ({
        role: message.sender === "coach" ? "assistant" : "user",
        content: message.text,
      })),
      { role: "user", content },
    ];

    setChatLoading(true);
    setChatStatus("Falowen is replying via OpenAI…");

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: chatPayload,
          temperature: 0.4,
          max_tokens: 320,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenAI error: ${response.status} ${errorBody}`);
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content?.trim();
      const assistantMessage = {
        sender: "coach",
        text: reply || "I couldn’t send anything back. Please try again.",
        kind: "text",
        createdAt: new Date(),
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
      appendChatMessages(user?.uid, [assistantMessage]).catch((error) => {
        console.error("Failed to persist assistant chat", error);
      });
      setChatStatus("Reply sent. Ask me anything about German grammar or pronunciation.");
    } catch (error) {
      console.error("OpenAI chat error", error);
      setChatStatus("Could not reach OpenAI. Please check your API key and connection.");
    } finally {
      setChatLoading(false);
    }
  };

  const sanitizePathSegment = (value) =>
    (value || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9@._-]/gi, "-");

  const lessonDraftPath = useMemo(() => {
    if (!studentCode || !assignmentId) return "";
    return `/drafts_v2/${sanitizePathSegment(
      studentCode
    )}/lessons/${sanitizePathSegment(assignmentId)}`;
  }, [assignmentId, studentCode]);

  const lessonSubmissionPath = useMemo(
    () => `/submissions/${submissionLevel}/posts`,
    [submissionLevel]
  );

  const assignmentOptions = useMemo(() => {
    const schedule = courseSchedules[submissionLevel] || [];
    const seen = new Set();
    const options = [];

    const addChapter = ({ chapter, topic, day }) => {
      if (!chapter) return;
      const value = chapter.toString();
      if (seen.has(value)) return;
      seen.add(value);

      const parts = [`${submissionLevel} · ${value}`];
      if (topic) parts.push(`— ${topic}`);
      if (typeof day !== "undefined") parts.push(`(Day ${day})`);

      options.push({
        value,
        label: parts.join(" "),
        title: topic || `Assignment ${value}`,
      });
    };

    const inspectLesson = (lesson, meta) => {
      if (!lesson) return;
      if (Array.isArray(lesson)) {
        lesson.forEach((item) => inspectLesson(item, meta));
        return;
      }
      if (lesson.assignment) {
        addChapter({
          chapter: lesson.chapter || lesson.topic,
          topic: lesson.topic || meta?.topic,
          day: meta?.day,
        });
      }
    };

    schedule.forEach((day) => {
      if (day.assignment) {
        addChapter({ chapter: day.chapter || day.topic, topic: day.topic, day: day.day });
      }
      inspectLesson(day.lesen_hören, { topic: day.topic, day: day.day });
      inspectLesson(day.schreiben_sprechen, { topic: day.topic, day: day.day });
    });

    return options.sort((a, b) => a.value.localeCompare(b.value));
  }, [submissionLevel]);

  const resubmitMailto = useMemo(() => {
    const subject = encodeURIComponent(
      `Request new attempt: ${submissionLevel} assignment ${assignmentId || "(choose chapter)"}`
    );
    const body = encodeURIComponent(
      `Hi team,

I'd like to request another submission slot for ${submissionLevel} assignment ${
        assignmentId || "(add chapter)"
      }.
Student code: ${studentCode || "(add your student code)"}
Receipt: ${receiptCode || "(optional)"}

Thank you!`
    );

    return `mailto:learngermanghana@gmail.com?subject=${subject}&body=${body}`;
  }, [assignmentId, receiptCode, studentCode, submissionLevel]);

  useEffect(() => {
    if (!user?.email) return;
    const profile = deriveStudentProfile(user, studentProfile);
    const storedCode = loadStudentCodeForEmail(user.email);
    const resolvedStudentCode = profile.studentCode || storedCode;

    if (resolvedStudentCode) {
      setStudentCode((prev) => prev || resolvedStudentCode);
    }

    if (profile.level) {
      setSelectedCourseLevel((prev) => prev || profile.level);
      setSubmissionLevel((prev) => prev || profile.level);
    }

    if (profile.assignmentTitle) {
      setAssignmentTitle((prev) => prev || profile.assignmentTitle);
    }
  }, [user?.email, user?.profile]);

  useEffect(() => {
    let cancelled = false;
    if (!user?.email || studentCode) return undefined;

    const lookupStudent = async () => {
      try {
        const match = await findStudentByEmail(user.email);
        if (!match || cancelled) return;
        const detectedCode = match.studentcode || match.studentCode || match.id;
        if (detectedCode) {
          setStudentCode((prev) => prev || detectedCode);
        }
        if (match.assignmentTitle) {
          setAssignmentTitle((prev) => prev || match.assignmentTitle);
        }
        if (match.level) {
          const normalizedLevel = (match.level || "").toUpperCase();
          setSelectedCourseLevel((prev) => prev || normalizedLevel);
          setSubmissionLevel((prev) => prev || normalizedLevel);
        }
      } catch (error) {
        console.error("Failed to fetch student by email", error);
      }
    };

    lookupStudent();
    return () => {
      cancelled = true;
    };
  }, [studentCode, user?.email]);

  useEffect(() => {
    setSubmissionLevel(selectedCourseLevel);
  }, [selectedCourseLevel]);

  useEffect(() => {
    if (!user?.uid) return undefined;

    setChatLoading(true);
    setChatStatus("");

    const unsubscribe = subscribeToChatMessages(user.uid, (messages) => {
      if (!messages.length) {
        setChatMessages([falowenIntro]);
        ensureIntroMessage(user.uid, falowenIntro).catch((error) => {
          console.error("Failed to seed intro message", error);
          setChatStatus("Chat konnte nicht initialisiert werden.");
        });
        setChatLoading(false);
        return;
      }

      setChatMessages(messages);
      setChatLoading(false);
    });

    return unsubscribe;
  }, [falowenIntro, user?.uid]);

  useEffect(
    () => () => {
      stopActiveRecorder();
    },
    []
  );

  useEffect(() => {
    setHydrated(false);
    setLocked(false);
    setReceiptCode("");
    setSubmissionStatus("");
    setDraftStatus("");
    setManualDraftStatus("");
    setLastSavedDraft("");
    setLastSavedAt(null);
    setConfirmComplete(false);
    setConfirmLock(false);
  }, [assignmentId, studentCode, submissionLevel]);

  useEffect(() => {
    if (!assignmentOptions.length || assignmentId) return;
    setAssignmentId(assignmentOptions[0].value);
  }, [assignmentId, assignmentOptions]);

  useEffect(() => {
    if (!assignmentId) {
      setAssignmentTitle("");
      return;
    }
    const selectedAssignment = assignmentOptions.find((option) => option.value === assignmentId);
    const preferredTitle = selectedAssignment?.title || `Assignment ${assignmentId}`;
    setAssignmentTitle(preferredTitle);
  }, [assignmentId, assignmentOptions]);

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
    if (!selectedCourseLevel) return;
    setResultsLevel((prev) => (prev && prev !== "A1" ? prev : selectedCourseLevel));
  }, [selectedCourseLevel]);
  useEffect(() => {
    if (activeTab !== "results") return;

    const loadResults = async () => {
      setResultsStatus((prev) => ({ ...prev, loading: true, error: "" }));
      try {
        if (!studentCode) {
          setResults([]);
          setResultsMetrics(null);
          setResultsAssignments([]);
          setResultsStatus({
            loading: false,
            error: "Bitte füge deinen Student code hinzu, um Ergebnisse zu sehen.",
            fetchedAt: null,
          });
          return;
        }

        const response = await fetchResults({
          level: resultsLevel,
          studentCode,
          email: studentEmail,
        });
        const payloadResults = response.results || [];
        setResults(payloadResults);
        setResultsMetrics(response.metrics || null);
        setResultsAssignments(response.assignments || []);
        setResultsStatus({
          loading: false,
          error: "",
          fetchedAt: response.fetchedAt || null,
        });
      } catch (error) {
        const fallbackMessage =
          error.response?.data?.error || "Konnte Ergebnisse nicht laden.";
        setResultsStatus({ loading: false, error: fallbackMessage, fetchedAt: null });
      }
    };

    loadResults();
  }, [activeTab, resultsLevel, studentCode, studentEmail]);

  useEffect(() => {
    if (!user?.email || !studentCode) {
      setWorkDraft("");
      setDraftStatus("Add your student code to start saving drafts to /drafts_v2.");
      setLocked(false);
      setHydrated(false);
      return;
    }

    if (!assignmentId) {
      setWorkDraft("");
      setDraftStatus("Select an assignment to load drafts.");
      setLocked(false);
      setHydrated(false);
      return;
    }

    if (hydrated) return;

    const submission = loadSubmissionForStudent({
      level: submissionLevel,
      studentCode,
      lessonKey: assignmentId,
    });

    if (submission) {
      setWorkDraft(submission.content || "");
      setLocked(true);
      setReceiptCode(submission.receiptCode || "");
      const submittedAt = submission.submittedAt
        ? ` at ${new Date(submission.submittedAt).toLocaleString()}`
        : "";
      setSubmissionStatus(
        `Submission loaded from /${submission.submissionPath}${submittedAt}${
          submission.receiptCode ? ` · Receipt ${submission.receiptCode}` : ""
        }`
      );
      setDraftStatus("Submitted attempt is locked.");
      setLastSavedDraft(submission.content || "");
      setLastSavedAt(submission.submittedAt || null);
      setHydrated(true);
      return;
    }

    const lockState = isSubmissionLocked({
      email: user.email,
      studentCode,
      level: submissionLevel,
      lessonKey: assignmentId,
    });
    if (lockState.locked) {
      setLocked(true);
      const lockedAt = lockState.lockedAt
        ? ` at ${new Date(lockState.lockedAt).toLocaleString()}`
        : "";
      setSubmissionStatus(`Submission locked via /${lockState.lockPath}${lockedAt}`);
      setHydrated(true);
      return;
    }

    const draft = loadDraftForStudent({
      email: user.email,
      studentCode,
      level: submissionLevel,
      lessonKey: assignmentId,
    });
    const draftContent = draft.text || draft.content || "";
    setWorkDraft(draftContent);
    setAssignmentTitle(
      (draft.assignmentTitle || assignmentTitle || courseOverview.nextAssignment.title).trim()
    );
    setDraftStatus(
      draft.updatedAt
        ? `Draft restored from /${draft.path}`
        : `Ready to save drafts to /${draft.path}`
    );
    setLastSavedDraft(draftContent);
    setLastSavedAt(draft.updatedAt || draft.updated_at || null);
    setLocked(false);
    setSubmissionStatus("");
    setHydrated(true);
  }, [
    assignmentId,
    assignmentTitle,
    hydrated,
    studentCode,
    submissionLevel,
    user?.email,
  ]);

  useEffect(() => {
    if (!user?.email || !studentCode || !assignmentId || locked || !hydrated) return;

    const hasChanges = workDraft !== lastSavedDraft;
    if (!hasChanges) return;

    const lastSavedMs = lastSavedAt ? new Date(lastSavedAt).getTime() : 0;
    const timeSinceLastSave = lastSavedMs ? Date.now() - lastSavedMs : Infinity;
    const changeSize = Math.abs(workDraft.length - (lastSavedDraft || "").length);
    const delay = changeSize >= 20 || timeSinceLastSave >= 15000 ? 800 : 1800;

    const handle = setTimeout(() => {
      const result = saveDraftForStudent({
        email: user.email,
        studentCode,
        level: submissionLevel,
        lessonKey: assignmentId,
        content: workDraft,
        assignmentTitle,
      });
      setDraftStatus(
        `Draft saved to /${result.path} (${new Date(result.savedAt).toLocaleTimeString()})`
      );
      setManualDraftStatus("");
      setLastSavedDraft(workDraft);
      setLastSavedAt(result.savedAt);
    }, delay);

    return () => clearTimeout(handle);
  }, [
    assignmentId,
    assignmentTitle,
    hydrated,
    lastSavedAt,
    lastSavedDraft,
    locked,
    studentCode,
    submissionLevel,
    user?.email,
    workDraft,
  ]);

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

    if (!user?.uid) {
      setChatStatus("Please log in to use the chat.");
      return;
    }

    const userMessage = { sender: "user", text: content, kind: "text", createdAt: new Date() };
    const nextMessages = [...chatMessages, userMessage];

    setChatMessages(nextMessages);
    appendChatMessages(user.uid, [userMessage]).catch((error) => {
      console.error("Failed to persist chat", error);
      setChatStatus("Could not save chat. Please try again.");
    });
    setChatInput("");
    sendToOpenAI(content, nextMessages);
  };

  const stopActiveRecorder = () => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    recorderRef.current?.stream?.getTracks?.().forEach((track) => track.stop());
  };

  const handleRecordingToggle = async () => {
    if (isRecording) {
      stopActiveRecorder();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setRecorderError("Recording not supported.");
      return;
    }

    if (typeof MediaRecorder === "undefined") {
      setRecorderError("MediaRecorder is not supported.");
      return;
    }

      try {
        setRecorderError("");
        setChatStatus("Recording… tap again to stop.");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: "audio/webm" });
          stopActiveRecorder();
          setIsRecording(false);
          const sizeKb = Math.max(Math.round(audioBlob.size / 1024), 1);
          setRecordingDuration(sizeKb);

          if (!user?.uid) {
            setChatStatus("Please log in to save voice notes.");
            return;
          }

          const audioNote = {
            sender: "user",
            kind: "audio",
            text: `Voice note captured (${sizeKb} KB). Whisper can turn it into text later.`,
            createdAt: new Date(),
          };

          setChatMessages((prev) => [...prev, audioNote]);
          appendChatMessages(user.uid, [audioNote]).catch((error) => {
            console.error("Failed to save audio note", error);
            setChatStatus("Could not save the audio note.");
          });
        };

      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Recorder error", error);
      setRecorderError("Could not record. Please check microphone permissions.");
      setIsRecording(false);
    }
  };

  const saveDraftImmediately = () => {
    if (!user?.email || !studentCode || !assignmentId || locked) return null;
    if (!workDraft.trim()) return null;

    const result = saveDraftForStudent({
      email: user.email,
      studentCode,
      level: submissionLevel,
      lessonKey: assignmentId,
      content: workDraft,
      assignmentTitle,
    });
    setDraftStatus(
      `Draft saved to /${result.path} (${new Date(result.savedAt).toLocaleTimeString()})`
    );
    setLastSavedDraft(workDraft);
    setLastSavedAt(result.savedAt);
    setManualDraftStatus("");
    return result;
  };

  const handleBlurSave = () => {
    if (!hydrated || locked) return;
    saveDraftImmediately();
  };

  const handleSubmitWork = async () => {
    setSubmissionStatus("");
    if (!user?.email) {
      setSubmissionStatus("Please sign in to submit your work.");
      return;
    }

    if (!studentCode.trim()) {
      setSubmissionStatus("Enter your student code to track the submission.");
      return;
    }

    if (!assignmentId) {
      setSubmissionStatus("Pick the assignment number from the course dictionary.");
      return;
    }

    if (!lessonSubmissionPath) {
      setSubmissionStatus("Add an assignment number to generate the submission path.");
      return;
    }

    if (!assignmentTitle.trim()) {
      setSubmissionStatus("Add an assignment title so we know what you're submitting.");
      return;
    }

    if (!workDraft.trim()) {
      setSubmissionStatus("Add your coursework before submitting.");
      return;
    }

    if (!confirmComplete || !confirmLock) {
      setSubmissionStatus("Tick both confirmation boxes before submitting.");
      return;
    }

    const existingLock = isSubmissionLocked({
      email: user.email,
      studentCode,
      level: submissionLevel,
      lessonKey: assignmentId,
    });
    if (existingLock.locked) {
      setLocked(true);
      setReceiptCode(existingLock.submission?.receiptCode || "");
      setSubmissionStatus(`Submission already locked at /${existingLock.lockPath}.`);
      return;
    }

    setSubmitting(true);
    try {
      saveDraftImmediately();
      const result = submitWorkToSpecificPath({
        path: lessonSubmissionPath,
        content: workDraft,
        studentCode,
        lessonKey: assignmentId,
        level: submissionLevel,
        email: user.email,
        assignmentTitle,
      });
      if (result.locked) {
        setLocked(true);
        setReceiptCode(result.receiptCode || "");
        const lockedAt = result.lockedAt
          ? ` at ${new Date(result.lockedAt).toLocaleTimeString()}`
          : "";
        setSubmissionStatus(`Submission locked via /${result.lockPath}${lockedAt}`);
        return;
      }
      setLocked(true);
      setReceiptCode(result.receiptCode || "");
      setSubmissionStatus(
        `Submitted to ${lessonSubmissionPath} (student_code=${sanitizePathSegment(
          studentCode
        )}, lesson_key=${sanitizePathSegment(assignmentId)}) at ${new Date(
          result.savedAt
        ).toLocaleTimeString()}${result.receiptCode ? ` · Receipt ${result.receiptCode}` : ""}`
      );
      setDraftStatus("Submitted attempt is locked.");
      setLastSavedDraft(workDraft);
      setLastSavedAt(result.savedAt);
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
      setManualDraftStatus("Add student code and assignment number to save this draft.");
      return;
    }

    const localResult = saveDraftImmediately();
    const result = saveDraftToSpecificPath({ path: lessonDraftPath, content: workDraft });
    setManualDraftStatus(
      `Draft saved to ${lessonDraftPath} (${new Date(result.savedAt).toLocaleTimeString()})`
    );
    if (localResult?.savedAt) {
      setDraftStatus(
        `Draft saved to /${localResult.path} (${new Date(localResult.savedAt).toLocaleTimeString()})`
      );
    }
  };

  const renderHome = () => {
    if (!studentProfile) {
      return (
        <div style={{ ...styles.card, display: "grid", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <h2 style={styles.sectionTitle}>Course Home</h2>
            <span style={styles.badge}>No course data</span>
          </div>
          <p style={{ ...styles.helperText, margin: 0 }}>
            We haven’t received course data for your account yet. Once your profile is linked to the campus system,
            your next assignment, attendance, and recommendations will show up here.
          </p>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Please ask your instructor for an update or try again later.
          </p>
        </div>
      );
    }

    return (
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
  };

  const renderCourse = () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <h2 style={styles.sectionTitle}>My Course</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={styles.helperText}>Course level:</span>
          <span style={styles.levelPill}>{studentLevel}</span>
        </div>
      </div>
      <p style={styles.helperText}>
        Pulling content from the course dictionary. Your enrolled level controls the day-by-day plan.
      </p>

      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div>
            <h3 style={{ margin: "0 0 4px" }}>Ready to submit your coursework?</h3>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Jump straight to the submission tools without scrolling to the bottom of this page.
            </p>
          </div>
          <button style={styles.primaryButton} onClick={() => setActiveTab("submit")}>
            Open submit tab
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {(courseSchedules[studentLevel] || []).map((entry) => {
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

  const renderVocab = () => (
    <div style={{ display: "grid", gap: 12 }}>
      <VocabPage
        title="Vokabel-Training für Kurs & Prüfung"
        subtitle="Die gleiche Liste aus dem Vocab Sheet wird hier und im Prüfungsraum verwendet. Markiere, was du geübt hast, oder starte neu."
        contextLabel="Geteilte Vokabeln"
      />
    </div>
  );

  const renderChat = () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div style={styles.chatHeaderRow}>
          <div style={{ display: "grid", gap: 6 }}>
            <h2 style={styles.sectionTitle}>Falowen A.I. · Voice &amp; Grammar Chat</h2>
            <p style={styles.helperText}>
              WhatsApp-style layout: record or type at the bottom, see the thread above. Ask for grammar help, request feedback, or get quick exercises.
            </p>
            <p style={styles.helperText}>
              OpenAI connects once you add <code>REACT_APP_OPENAI_API_KEY</code> to your .env file. We send your turns as chat context so answers stay matched to your level.
            </p>
          </div>
          <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
            <span style={styles.badge}>Level: {studentLevel}</span>
            <span style={styles.badge}>{chatLoading ? "Falowen is typing…" : "Chat ready"}</span>
            {recordingDuration ? (
              <span style={{ ...styles.helperText, margin: 0 }}>Last recording: {recordingDuration} KB</span>
            ) : null}
          </div>
        </div>

        <div style={styles.promptChips}>
          {chatPrompts.map((prompt) => (
            <button key={prompt} style={styles.promptChip} onClick={() => handleSend(prompt)}>
              {prompt}
            </button>
          ))}
        </div>

        <div style={styles.chatShell}>
          <div style={styles.chatLogWide}>
            {chatMessages.length === 0 ? (
              <div style={{ ...styles.helperText, textAlign: "center" }}>
                No messages yet. Type a question or record a short voice note below.
              </div>
            ) : (
              chatMessages.map((message, index) => (
                <div
                  key={`${message.sender}-${index}-${message.createdAt || index}`}
                  style={message.sender === "coach" ? styles.chatBubbleCoach : styles.chatBubbleUser}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <strong>{message.sender === "coach" ? "Falowen" : "You"}</strong>
                    <span style={styles.chatTimestamp}>
                      {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : "Just now"}
                    </span>
                  </div>
                  <div>{message.text}</div>
                </div>
              ))
            )}
          </div>

          <div style={styles.chatComposer}>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={styles.recorderRow}>
                <button
                  style={isRecording ? styles.recorderButtonActive : styles.recorderButton}
                  onClick={handleRecordingToggle}
                >
                  {isRecording ? "■ Stop" : "🎙️ Voice note"}
                </button>
                <div style={styles.helperText}>
                  Tap like WhatsApp: tap once to start, again to stop. We save it as a note for Whisper later.
                </div>
              </div>
              <div style={styles.composerRow}>
                <textarea
                  style={styles.chatTextarea}
                  rows={2}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a grammar question or write a short sentence to correct."
                  disabled={chatLoading}
                />
                <button
                  style={styles.sendButton}
                  onClick={() => handleSend(chatInput)}
                  disabled={chatLoading}
                >
                  {chatLoading ? "Sending…" : "Send"}
                </button>
              </div>
            </div>
            {chatStatus ? <div style={{ ...styles.helperText, marginTop: 6 }}>{chatStatus}</div> : null}
            {recorderError ? <div style={styles.errorBox}>{recorderError}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    const targetTotal = resultsMetrics?.targetTotal ?? resultsAssignments.length ?? 0;
    const completedCount = resultsMetrics?.completedCount ?? 0;
    const remaining = resultsMetrics?.remaining ?? Math.max(targetTotal - completedCount, 0);
    const averageScore = resultsMetrics?.averageScore ?? null;
    const bestScore = resultsMetrics?.bestScore ?? null;
    const missed = resultsMetrics?.missed || [];
    const failed = resultsMetrics?.failed || [];
    const next = resultsMetrics?.next || null;
    const targetHelper = resultsMetrics?.targetOverride
      ? `Override aktiv (${resultsMetrics.targetOverride})`
      : `${resultsMetrics?.scheduleCount || resultsAssignments.length || 0} laut Plan`;

    const renderAssignmentPill = (assignment) => (
      <span
        key={assignment.identifier || assignment.label}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 10px",
          borderRadius: 999,
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
          fontSize: 13,
        }}
      >
        <span style={{ fontWeight: 700 }}>{assignment.identifier || "?"}</span>
        <span style={{ color: "#4b5563" }}>{assignment.label || "Lesson"}</span>
      </span>
    );

    return (
      <div style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <h2 style={styles.sectionTitle}>My Results</h2>
            <span style={styles.badge}>Level: {resultsLevel}</span>
            {resultsStatus.fetchedAt && (
              <span style={{ ...styles.helperText, margin: 0 }}>
                Sync: {new Date(resultsStatus.fetchedAt).toLocaleString()}
              </span>
            )}
          </div>
          <span style={styles.badge}>Targets nutzen Kursplan + Overrides</span>
        </div>

        <p style={styles.helperText}>
          Berechnet aus dem Kursplan (Assignments) und deinen besten Scores pro Kapitel. Ab 60% gilt ein Assignment als
          abgeschlossen. Falls Scores unter 60% vorliegen, ist der nächste Vorschlag blockiert, bis du die Reworks erledigst.
        </p>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div>
            <label style={styles.label}>Level auswählen</label>
            <select
              style={styles.select}
              value={resultsLevel}
              onChange={(e) => setResultsLevel(e.target.value)}
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
            </select>
            <p style={styles.helperText}>Lädt Kursplan + Scores für dieses Level.</p>
          </div>
          <div>
            <label style={styles.label}>Student code</label>
            <input
              style={{ ...styles.textArea, minHeight: "auto", height: 44 }}
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              placeholder="z.B. sewornua2"
            />
            <p style={styles.helperText}>Notwendig, um deine Versuche zu finden.</p>
          </div>
        </div>

        {resultsStatus.error && <div style={styles.errorBox}>{resultsStatus.error}</div>}
        {resultsStatus.loading && <div style={styles.helperText}>Lade Ergebnisse ...</div>}

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <StatCard label="Total assignments" value={targetTotal || 0} helper={targetHelper} />
          <StatCard label="Completed assignments" value={completedCount || 0} helper={`Bleiben: ${remaining || 0}`} />
          <StatCard
            label="Average score"
            value={averageScore !== null ? `${averageScore}%` : "–"}
            helper="Bestwerte pro Assignment"
          />
          <StatCard
            label="Best score"
            value={bestScore !== null ? `${bestScore}%` : "–"}
            helper={`Versuche: ${results.length}`}
          />
        </div>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <div style={{ ...styles.card, display: "grid", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <h3 style={{ margin: 0 }}>Jumped &amp; Next</h3>
              {resultsMetrics?.isBlockedForRework ? (
                <span style={{ ...styles.badge, background: "#fef2f2", color: "#b91c1c" }}>
                  Rework nötig
                </span>
              ) : (
                <span style={styles.badge}>Unblockiert</span>
              )}
            </div>

            {resultsMetrics?.isBlockedForRework ? (
              <p style={{ ...styles.helperText, margin: 0 }}>
                Mindestens ein Assignment hat &lt; 60%. Erledige diese Reworks, bevor du mit dem nächsten weitermachst.
              </p>
            ) : next ? (
              <p style={{ margin: 0 }}>
                Nächster Vorschlag: <strong>{next.label || `Kapitel ${next.identifier}`}</strong>
                {next.identifier ? ` (${next.identifier})` : ""}. Noch {remaining || 0} übrig.
              </p>
            ) : (
              <p style={{ margin: 0 }}>Keine Empfehlung verfügbar.</p>
            )}

            {!!missed.length && (
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Missed (übersprungen)</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {missed.map((assignment) => renderAssignmentPill(assignment))}
                </div>
              </div>
            )}

            {!!failed.length && (
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Failed (&lt;60%)</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {failed.map((assignment) => renderAssignmentPill(assignment))}
                </div>
              </div>
            )}
          </div>

          <div style={{ ...styles.card, display: "grid", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <h3 style={{ margin: 0 }}>Attempts</h3>
              <span style={styles.badge}>Gesamt: {results.length}</span>
            </div>

            {!resultsStatus.loading && !results.length ? (
              <p style={{ margin: 0 }}>Keine Ergebnisse gefunden.</p>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {results.map((row) => (
                  <div
                    key={`${row.studentCode}-${row.assignment}-${row.attempt}-${row.date}`}
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      border: row.isRetake ? "1px solid #f97316" : "1px solid #e5e7eb",
                      background: "#fff",
                      display: "grid",
                      gap: 6,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontWeight: 800 }}>{row.assignment}</div>
                        <div style={{ ...styles.helperText, margin: 0 }}>
                          {row.date || "Datum fehlt"} · Versuch {row.attempt || 1}
                          {row.isRetake ? " · Retake" : ""}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                        <span style={styles.badge}>{row.level || "?"}</span>
                        <span style={styles.badge}>{row.score !== null ? `${row.score}%` : "pending"}</span>
                      </div>
                    </div>
                    <p style={{ margin: "0 0 4px 0" }}>{row.comments || "Kein Feedback hinterlegt."}</p>
                    {row.link ? (
                      <a href={row.link} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>
                        Link öffnen
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderLetters = () => {
    const handleReviewLetter = () => {
      if (!letterDraft.trim()) {
        setLetterFeedback("Füge deinen Brief ein, damit der Coach ihn prüfen kann.");
        return;
      }

      const wordCount = letterDraft.trim().split(/\s+/).length;
      const excerpt = letterDraft.trim().split(/\s+/).slice(0, 12).join(" ");
      const topicHint = excerpt ? `Brief-Auszug: "${excerpt}..."` : "Brief geprüft";

      const insights = [
        `${topicHint}.`,
        wordCount < 80
          ? "Dein Text ist noch kurz – füge Details zu Ort, Zeit und Begründungen hinzu."
          : "Gute Länge! Prüfe, ob jede Bullet-Point-Forderung direkt beantwortet ist.",
        "Prüfe Satzanfänge (z.B. Zudem, Außerdem, Danach), um den roten Faden klar zu halten.",
        "Schließe mit einer klaren Bitte oder einem nächsten Schritt (z.B. Rückmeldung, Termin).",
      ];

      setLetterFeedback(
        `AI Coach (Demo): ${insights[0]}\n- ${insights.slice(1).join("\n- ")}`
      );
    };

    const handleIdeaSend = (message) => {
      const content = message.trim();
      if (!content) return;

      const topicLabel = content || "deine Aufgabe";

      setIdeaMessages((prev) => [
        ...prev,
        { sender: "user", text: content },
        {
          sender: "coach",
          text: `Hier sind drei Ansatzpunkte für ${topicLabel}:\n1) Situations-Check: Was ist der Anlass und welches Ziel hast du?\n2) Struktur: Einleitung (Dank/Bezug) · Hauptteil (2–3 Kernpunkte) · Abschluss (Bitte/Frist).\n3) Sprach-Booster: Nutze zwei Verbindungswörter (z.B. außerdem, dennoch) und eine klare Bitte im letzten Satz.`,
        },
      ]);
      setIdeaInput("");
    };

    return (
      <div style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <h2 style={styles.sectionTitle}>Schreiben Trainer</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={writingSubtab === "mark" ? styles.primaryButton : styles.secondaryButton}
              onClick={() => setWritingSubtab("mark")}
              type="button"
            >
              Mark my letter
            </button>
            <button
              style={writingSubtab === "ideas" ? styles.primaryButton : styles.secondaryButton}
              onClick={() => setWritingSubtab("ideas")}
              type="button"
            >
              Ideas generator
            </button>
          </div>
        </div>

        {writingSubtab === "mark" ? (
          <div style={{ ...styles.card, display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 4 }}>
              <h3 style={{ margin: 0 }}>Mark my letter</h3>
              <p style={styles.helperText}>
                Ein Feld reicht: Kopiere deinen gesamten Brief hier hinein. Der AI-Coach gibt dir Sofort-Feedback zu Länge,
                Struktur und Redemitteln.
              </p>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <label style={styles.label}>Dein Brief (ein Feld zum Einfügen)</label>
              <textarea
                style={{ ...styles.textArea, minHeight: 180 }}
                placeholder="Paste hier deine komplette Antwort – inklusive Aufgabenstellung, wenn du möchtest."
                value={letterDraft}
                onChange={(e) => setLetterDraft(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button style={styles.primaryButton} type="button" onClick={handleReviewLetter}>
                AI um Feedback bitten
              </button>
            </div>
            {letterFeedback ? (
              <div style={styles.card}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Feedback</div>
                <pre style={{ ...styles.pre, background: "#0f172a", color: "#e2e8f0" }}>{letterFeedback}</pre>
              </div>
            ) : null}
          </div>
        ) : null}

        {writingSubtab === "ideas" ? (
          <div style={{ ...styles.card, display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 4 }}>
              <h3 style={{ margin: 0 }}>Ideas generator</h3>
              <p style={styles.helperText}>
                Nur ein Feld: Klebe die Aufgabenstellung oder deinen Ansatz ein und chatte mit dem Coach. Er schlägt Ideen,
                Satzstarter und Formulierungen vor, bevor du schreibst.
              </p>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={styles.chatLog}>
                {ideaMessages.map((message, index) => (
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
                placeholder="Beschreibe kurz, wobei du Hilfe brauchst – z.B. Ideen für Einleitung oder Schluss."
                value={ideaInput}
                onChange={(e) => setIdeaInput(e.target.value)}
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button style={styles.primaryButton} type="button" onClick={() => handleIdeaSend(ideaInput)}>
                  Nachricht senden
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

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
        Drafts are auto-saved in Firebase-style paths rooted at your student code. We now auto-look up your student code
        from the students collection when you sign in, and you can pick the assignment number directly from the course
        dictionary to avoid mistakes.
      </p>
      <p style={styles.helperText}>
        Need explicit lesson paths? Use the buttons to save drafts to
        {" "}
        {lessonDraftPath || "/drafts_v2/<student-code>/lessons/<assignment>"} and submit the final version to
        {lessonSubmissionPath || `/submissions/${submissionLevel}/posts`} (filtered by
        student_code + lesson_key).
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
          />
          <p style={styles.helperText}>Required alongside email to store drafts and submissions.</p>
        </div>
        <div>
          <label style={styles.label}>Course level for this upload</label>
          <input
            style={{ ...styles.select, background: "#f3f4f6", cursor: "not-allowed" }}
            value={submissionLevel}
            readOnly
            disabled
          />
          <p style={styles.helperText}>Matches the /submissions/{submissionLevel} path.</p>
        </div>
        <div>
          <label style={styles.label}>Assignment (number & title)</label>
          <select
            style={styles.select}
            value={assignmentId}
            onChange={(e) => setAssignmentId(e.target.value)}
            disabled={!assignmentOptions.length}
          >
            {!assignmentId && <option value="">Select from dictionary</option>}
            {assignmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {`${option.value} — ${option.title}`}
              </option>
            ))}
          </select>
          <p style={styles.helperText}>
            Choose one entry from the course dictionary so the assignment number and title stay in sync.
          </p>
        </div>
      </div>

      <div>
        <label style={styles.label}>Your work</label>
        <textarea
          style={styles.textArea}
          value={workDraft}
          disabled={locked}
          onChange={(e) => setWorkDraft(e.target.value)}
          onBlur={handleBlurSave}
          rows={6}
          placeholder="Paste or type your course work. Drafts save to /drafts_v2 while you type."
        />
        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={confirmComplete}
              disabled={locked}
              onChange={(e) => setConfirmComplete(e.target.checked)}
            />
            <span style={styles.helperText}>
              I confirm this answer is complete for {submissionLevel} / assignment {assignmentId || "?"}.
            </span>
          </label>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={confirmLock}
              disabled={locked}
              onChange={(e) => setConfirmLock(e.target.checked)}
            />
            <span style={styles.helperText}>
              I understand this box locks after submission and I cannot edit until a new attempt is opened.
            </span>
          </label>
        </div>
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
              Save draft
            </button>
            <button
              style={styles.primaryButton}
              onClick={handleSubmitWork}
              disabled={locked || submitting || !confirmComplete || !confirmLock}
            >
              {locked ? "Submission locked" : submitting ? "Submitting..." : "Submit now"}
            </button>
          </div>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {locked && (
            <a
              href={resubmitMailto}
              style={{
                ...styles.secondaryButton,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Request new attempt via email
            </a>
          )}
          {manualDraftStatus && (
            <div style={styles.successBox}>
              {manualDraftStatus} {lessonDraftPath ? `(path: ${lessonDraftPath})` : ""}
            </div>
          )}
        </div>
      </div>

      {submissionStatus && (
        <div
          style={
            submissionStatus.toLowerCase().includes("submit") ||
            submissionStatus.toLowerCase().includes("locked")
              ? styles.successBox
              : styles.errorBox
          }
        >
          {submissionStatus}
          {receiptCode ? ` · Receipt ${receiptCode}` : ""}
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
      {activeTab === "vocab" && renderVocab()}
      {activeTab === "chat" && renderChat()}
      {activeTab === "results" && renderResults()}
      {activeTab === "letters" && renderLetters()}
      {activeTab === "submit" && renderSubmission()}
    </div>
  );
};

export default CourseTab;
