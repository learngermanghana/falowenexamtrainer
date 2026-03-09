// web/src/components/ClassDiscussionPage.js
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { courseSchedules } from "../data/courseSchedule";
import { styles } from "../styles";
import {
  addDoc,
  collection,
  db,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  deleteField,
} from "../firebase";
import { correctDiscussionText } from "../services/discussionService";
import ClassMembersTab from "./ClassMembersTab";

const postsCollectionRef = (level, className) =>
  collection(db, "class_board", level, "classes", className, "posts");
const presenceCollectionRef = (level, className) =>
  collection(db, "class_board", level, "classes", className, "presence");

const UNIT_MULTIPLIERS = {
  minutes: 1,
  hours: 60,
  days: 60 * 24,
};

const getUnitMultiplier = (unit) => UNIT_MULTIPLIERS[unit] || UNIT_MULTIPLIERS.minutes;

const minutesFromValue = (value, unit) => (Number(value) || 0) * getUnitMultiplier(unit);

const valueFromMinutes = (minutes, unit) =>
  (Number(minutes) || 0) / Math.max(1, getUnitMultiplier(unit));

const formatTimeRemaining = (expiresAt, now) => {
  if (!expiresAt) return "No timer";
  const rawDiff = Math.max(0, expiresAt - now);
  const diff = rawDiff;
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (diff <= 0) return "Expired";
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
};

const makeUUID = () =>
  (window.crypto && window.crypto.randomUUID && window.crypto.randomUUID()) ||
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const normalizeTimestamp = (value) => {
  if (!value) return null;

  if (typeof value === "number" && Number.isFinite(value)) {
    return value < 1e12 ? value * 1000 : value;
  }

  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value?.toMillis === "function") {
    return value.toMillis();
  }

  if (typeof value?.seconds === "number") {
    return value.seconds * 1000;
  }

  return null;
};

const formatDateTime = (value, timezonePreference = "ghana") => {
  const ms = normalizeTimestamp(value);
  if (!ms) return "";

  const useLocalTimezone = timezonePreference === "local";

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...(useLocalTimezone ? {} : { timeZone: "Africa/Accra" }),
  }).format(new Date(ms));
};

const formatRelativeTime = (value, now) => {
  const ms = normalizeTimestamp(value);
  if (!ms) return "";

  const diffSeconds = Math.round((ms - now) / 1000);
  const absSeconds = Math.abs(diffSeconds);
  if (absSeconds < 5) return "just now";

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (absSeconds < 60) return rtf.format(diffSeconds, "second");
  if (absSeconds < 3600) return rtf.format(Math.round(diffSeconds / 60), "minute");
  if (absSeconds < 86400) return rtf.format(Math.round(diffSeconds / 3600), "hour");
  return rtf.format(Math.round(diffSeconds / 86400), "day");
};

const repliesCollectionRef = (threadId) => collection(db, "qa_posts", threadId, "responses");

const ClassDiscussionPage = () => {
  const { user, studentProfile, idToken } = useAuth();
  const [threads, setThreads] = useState([]);
  const [repliesByThread, setRepliesByThread] = useState({});
  const [typingByThread, setTypingByThread] = useState({});
  const [now, setNow] = useState(Date.now());
  const [replyDrafts, setReplyDrafts] = useState({});
  const [isCorrectingDraft, setIsCorrectingDraft] = useState({});
  const [editingReply, setEditingReply] = useState(null);
  const [editingThread, setEditingThread] = useState(null); // { threadId, topic, question, instructions, extraLink }
  const [isSavingThreadEdit, setIsSavingThreadEdit] = useState(false);

  const [extensionValues, setExtensionValues] = useState({});
  const [extensionUnits, setExtensionUnits] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingThread, setIsSavingThread] = useState(false);
  const [activeTab, setActiveTab] = useState("discussion");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showMyPostsOnly, setShowMyPostsOnly] = useState(false);
  const [showNoRepliesOnly, setShowNoRepliesOnly] = useState(false);
  const [lessonFilter, setLessonFilter] = useState("all");
  const [timezonePreference, setTimezonePreference] = useState(() =>
    window.localStorage.getItem("discussionTimezonePreference") || "ghana"
  );
  const [form, setForm] = useState({
    lessonId: "",
    topic: "",
    question: "",
    instructions: "",
    extraLink: "",
    timerMinutes: 15,
    timerUnit: "minutes",
  });
  const typingTimeouts = useRef({});

  const lessonOptions = useMemo(() => {
    const level = (studentProfile?.level || "").toUpperCase();
    const sessions = courseSchedules[level] || [];

    return sessions.map((session) => ({
      id: `${level}-${session.day}-${session.chapter || session.topic}`,
      label: `${level} · Tag ${session.day}: ${session.topic}`,
      level,
      topic: session.topic,
      goal: session.goal,
      chapter: session.chapter,
    }));
  }, [studentProfile?.level]);

  const isTutor = useMemo(() => {
    const role = (studentProfile?.role || "").toLowerCase();
    return role === "tutor" || role === "admin" || studentProfile?.isTutor === true;
  }, [studentProfile?.role, studentProfile?.isTutor]);

  useEffect(() => {
    if (!db) {
      setError("Firebase is not configured. Please set up Firestore to share discussions.");
      setIsLoading(false);
      return;
    }

    if (!studentProfile?.level || !studentProfile?.className) {
      setError("Missing course details in your profile. Please set your class and level.");
      setIsLoading(false);
      return undefined;
    }

    const threadsQuery = query(
      postsCollectionRef(studentProfile.level, studentProfile.className),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      threadsQuery,
      (snapshot) => {
        const nextThreads = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();

          const createdAt = normalizeTimestamp(data.createdAt) || normalizeTimestamp(data.createdAtMs);
          const timerMinutes = Number(data.timerMinutes) || 0;
          const timerStartedAt =
            normalizeTimestamp(data.timerStartedAt) ||
            normalizeTimestamp(data.timerStartedAtMs) ||
            createdAt;
          const explicitExpiresAt = normalizeTimestamp(data.expiresAt);

          const expiresAt =
            explicitExpiresAt ||
            (timerMinutes > 0 && timerStartedAt ? timerStartedAt + timerMinutes * 60000 : null);

          return {
            id: docSnapshot.id,
            level: data.level || studentProfile?.level || "",
            className: data.className || studentProfile?.className || "",
            lessonId: data.lessonId || "",
            lessonLabel: data.lessonLabel || "",
            topic: data.topic || "",
            question: data.question || "",
            questionTitle: data.questionTitle || data.topic || "",
            instructions: data.instructions || "",
            extraLink: data.extraLink || "",
            timerUnit: data.timerUnit || "minutes",
            timerMinutes,
            timerValue:
              data.timerValue !== undefined
                ? data.timerValue
                : valueFromMinutes(timerMinutes, data.timerUnit || "minutes"),
            createdAt,
            timerStartedAt,
            createdBy: data.createdBy || "Student",
            createdByUid: data.createdByUid || null,
            editedAt: normalizeTimestamp(data.editedAt),
            editedByUid: data.editedByUid || null,
            expiresAt,
            status: data.status || "open",
            expiredAt: normalizeTimestamp(data.expiredAt),
          };
        });

        setError("");
        setThreads(nextThreads);
        setIsLoading(false);
      },
      (err) => {
        console.error("Failed to subscribe to discussion threads", err);
        setError("Discussions could not be loaded. Please try again later.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [studentProfile?.level, studentProfile?.className]);

  useEffect(() => {
    if (!db || threads.length === 0) {
      setRepliesByThread({});
      return undefined;
    }

    const unsubs = threads.map((thread) => {
      if (!thread?.id) return () => {};
      const repliesQuery = query(repliesCollectionRef(thread.id), orderBy("createdAt", "asc"));
      return onSnapshot(
        repliesQuery,
        (snapshot) => {
          const replies = snapshot.docs.map((docSnapshot) => {
            const data = docSnapshot.data();
            return {
              id: docSnapshot.id,
              author: data.author || data.responder || "Student",
              responderCode: data.responderCode || data.studentCode || null,
              responderUid: data.responderUid || null,
              text: data.text || "",
              createdAt: normalizeTimestamp(data.createdAt) || Date.now(),
              editedAt: normalizeTimestamp(data.editedAt),
            };
          });

          setRepliesByThread((prev) => ({ ...prev, [thread.id]: replies }));
        },
        (err) => {
          console.error("Failed to subscribe to replies", err);
          setError("Responses could not be loaded. Please try again later.");
        }
      );
    });

    return () => unsubs.forEach((unsub) => unsub());
  }, [threads]);

  useEffect(() => {
    if (!db || !studentProfile?.level || !studentProfile?.className) return undefined;

    const presenceRef = presenceCollectionRef(studentProfile.level, studentProfile.className);
    const unsubscribe = onSnapshot(
      presenceRef,
      (snapshot) => {
        const nowTs = Date.now();
        const grouped = {};

        snapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          const typingFor = data.typingFor;
          const typedAt = data.typingAt?.toMillis ? data.typingAt.toMillis() : data.typingAt || 0;

          if (!typingFor || !typedAt || nowTs - typedAt > 15000) return;

          const name = data.displayName || data.responder || data.author || "Student";
          const existing = new Set(grouped[typingFor] || []);
          existing.add(name);
          grouped[typingFor] = Array.from(existing);
        });

        setTypingByThread(grouped);
      },
      (err) => {
        console.error("Failed to subscribe to typing indicators", err);
      }
    );

    return () => unsubscribe();
  }, [studentProfile?.level, studentProfile?.className]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const resolveStatus = useCallback(
    (thread) => {
      if (!thread) return "open";
      if (thread.status === "archived") return "archived";
      if (thread.expiresAt) {
        return thread.expiresAt <= now ? "expired" : "open";
      }
      if (thread.status === "expired") return "expired";
      return "open";
    },
    [now]
  );

  const getThreadDocRef = useCallback(
    (thread) => {
      if (!db || !thread?.id) return null;
      const level = thread.level || studentProfile?.level;
      const className = thread.className || studentProfile?.className;
      if (!level || !className) return null;
      return doc(postsCollectionRef(level, className), thread.id);
    },
    [studentProfile?.className, studentProfile?.level]
  );

  useEffect(() => {
    window.localStorage.setItem("discussionTimezonePreference", timezonePreference);
  }, [timezonePreference]);

  useEffect(
    () => () => {
      Object.values(typingTimeouts.current).forEach((timeoutId) => clearTimeout(timeoutId));
    },
    []
  );

  const selectedLesson = lessonOptions.find((option) => option.id === form.lessonId) || lessonOptions[0];

  useEffect(() => {
    if (lessonOptions.length === 0) return;

    const lessonExists = lessonOptions.some((option) => option.id === form.lessonId);

    if (!lessonExists) {
      setForm((prev) => ({ ...prev, lessonId: lessonOptions[0].id, topic: lessonOptions[0].topic }));
    }
  }, [form.lessonId, lessonOptions]);

  const getDisplayName = () => studentProfile?.name || user?.displayName || user?.email || "Student";

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateThread = async (event) => {
    event.preventDefault();
    if (!form.question.trim() || !db) return;

    if (!studentProfile?.level || !studentProfile?.className) {
      setError("Please add your course level and class name in your account settings.");
      return;
    }

    const lesson = lessonOptions.find((option) => option.id === form.lessonId) || selectedLesson;
    const timerValue = Number(form.timerMinutes) || 0;
    const timerMinutes = minutesFromValue(timerValue, form.timerUnit);
    const nowTimestamp = Date.now();

    setIsSavingThread(true);
    setError("");

    try {
      await addDoc(postsCollectionRef(studentProfile.level, studentProfile.className), {
        level: studentProfile.level,
        className: studentProfile.className,
        lessonId: lesson?.id,
        lessonLabel: lesson?.label,
        topic: form.topic || lesson?.topic,
        questionTitle: form.topic || lesson?.topic,
        instructions: form.instructions || "",
        question: form.question,
        extraLink: form.extraLink,
        timerMinutes,
        timerUnit: form.timerUnit,
        timerValue,
        createdAtMs: nowTimestamp,
        timerStartedAtMs: nowTimestamp,
        timerStartedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        createdBy: getDisplayName(),
        createdByUid: user?.uid || null,
        status: "open",
      });

      setForm({
        lessonId: lesson?.id || "",
        topic: lesson?.topic || "",
        question: "",
        instructions: "",
        extraLink: "",
        timerMinutes: timerValue,
        timerUnit: form.timerUnit,
      });
    } catch (err) {
      console.error("Failed to create discussion thread", err);
      setError("Thread could not be created. Please try again.");
    } finally {
      setIsSavingThread(false);
    }
  };

  const getResponderCode = () =>
    studentProfile?.studentcode ||
    studentProfile?.studentCode ||
    studentProfile?.id ||
    user?.uid ||
    "unknown";

  const canEditThread = useCallback(
    (thread) => {
      if (!thread) return false;
      if (isTutor) return true;
      return Boolean(user?.uid) && thread.createdByUid === user.uid;
    },
    [isTutor, user?.uid]
  );

  const startEditThread = (thread) => {
    if (!canEditThread(thread)) {
      setError("You can only edit a post you created.");
      return;
    }

    setError("");
    setEditingThread({
      threadId: thread.id,
      topic: thread.topic || "",
      question: thread.question || "",
      instructions: thread.instructions || "",
      extraLink: thread.extraLink || "",
    });
  };

  const saveThreadEdit = async () => {
    if (!editingThread?.threadId || !db) return;

    const thread = threads.find((t) => t.id === editingThread.threadId);
    if (!thread || !canEditThread(thread)) {
      setError("You can only edit a post you created.");
      return;
    }

    const threadRef = getThreadDocRef(thread);
    if (!threadRef) {
      setError("Missing class context. Please reload the page.");
      return;
    }

    setIsSavingThreadEdit(true);
    setError("");

    try {
      await setDoc(
        threadRef,
        {
          topic: editingThread.topic,
          questionTitle: editingThread.topic,
          question: editingThread.question,
          instructions: editingThread.instructions,
          extraLink: editingThread.extraLink,
          editedAt: serverTimestamp(),
          editedByUid: user?.uid || null,
        },
        { merge: true }
      );
      setEditingThread(null);
    } catch (err) {
      console.error("Failed to edit thread", err);
      setError("Thread could not be edited. Please try again.");
    } finally {
      setIsSavingThreadEdit(false);
    }
  };

  const canEditReply = useCallback(
    (reply) => {
      if (!reply) return false;
      if (isTutor) return true;

      const myCode = String(getResponderCode() || "").toLowerCase();
      const replyCode = String(reply.responderCode || "").toLowerCase();
      if (myCode && replyCode && myCode === replyCode) return true;

      if (reply.responderUid && user?.uid && reply.responderUid === user.uid) return true;

      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTutor, user?.uid, studentProfile?.studentcode, studentProfile?.studentCode, studentProfile?.id]
  );

  const getPresenceDocRef = () => {
    if (!db || !studentProfile?.level || !studentProfile?.className) return null;
    return doc(
      presenceCollectionRef(studentProfile.level, studentProfile.className),
      user?.uid || studentProfile?.id || studentProfile?.studentcode || "anonymous"
    );
  };

  const stopTypingIndicator = async (threadId) => {
    const presenceDocRef = getPresenceDocRef();
    if (!presenceDocRef) return;

    if (typingTimeouts.current[threadId]) {
      clearTimeout(typingTimeouts.current[threadId]);
      delete typingTimeouts.current[threadId];
    }

    try {
      await setDoc(
        presenceDocRef,
        { typingFor: deleteField(), typingAt: serverTimestamp() },
        { merge: true }
      );
    } catch (err) {
      console.error("Failed to clear typing indicator", err);
    }
  };

  const markTypingForThread = async (threadId) => {
    const presenceDocRef = getPresenceDocRef();
    if (!presenceDocRef) return;

    if (typingTimeouts.current[threadId]) {
      clearTimeout(typingTimeouts.current[threadId]);
    }

    try {
      await setDoc(
        presenceDocRef,
        {
          displayName: studentProfile?.name || user?.email || "Student",
          typingFor: threadId,
          typingAt: serverTimestamp(),
        },
        { merge: true }
      );

      typingTimeouts.current[threadId] = setTimeout(() => {
        stopTypingIndicator(threadId);
      }, 8000);
    } catch (err) {
      console.error("Failed to write typing indicator", err);
    }
  };

  const handleReply = async (threadId) => {
    const thread = threads.find((item) => item.id === threadId);
    if (thread && resolveStatus(thread) !== "open") {
      setError("Replies are closed for this thread. A tutor can reopen it with the timer controls.");
      return;
    }

    const draft = replyDrafts[threadId] || "";
    if (!draft.trim() || !db) return;

    setError("");

    try {
      const replyId = makeUUID();
      await setDoc(doc(repliesCollectionRef(threadId), replyId), {
        author: getDisplayName(),
        responderCode: getResponderCode(),
        responderUid: user?.uid || null,
        text: draft,
        createdAt: serverTimestamp(),
      });

      setReplyDrafts((prev) => ({ ...prev, [threadId]: "" }));
      stopTypingIndicator(threadId);
    } catch (err) {
      console.error("Failed to post reply", err);
      setError("Response could not be saved. Please try again.");
    }
  };

  const handleExtendThread = async (threadId) => {
    const thread = threads.find((item) => item.id === threadId);
    if (!thread) return;

    const unit = extensionUnits[threadId] || thread.timerUnit || "minutes";
    const minutes = minutesFromValue(
      extensionValues[threadId] ?? thread.timerValue ?? thread.timerMinutes,
      unit
    );
    const threadRef = getThreadDocRef(thread);

    if (!threadRef) {
      setError("Missing class context. Please reload the page.");
      return;
    }

    try {
      await setDoc(
        threadRef,
        {
          timerMinutes: minutes,
          timerUnit: unit,
          timerValue: extensionValues[threadId] ?? thread.timerValue ?? thread.timerMinutes,
          timerStartedAt: serverTimestamp(),
          expiresAt: deleteField(),
          status: "open",
          expiredAt: deleteField(),
        },
        { merge: true }
      );
      setError("");
    } catch (err) {
      console.error("Failed to extend or reopen thread", err);
      setError("Could not extend or reopen this thread. Try again.");
    }
  };

  const handleDeleteReply = async (threadId, reply) => {
    if (!db) return;

    if (!canEditReply(reply)) {
      setError("You can only delete your own response.");
      return;
    }

    try {
      await deleteDoc(doc(repliesCollectionRef(threadId), reply.id));

      if (editingReply?.replyId === reply.id) {
        setEditingReply(null);
      }
    } catch (err) {
      console.error("Failed to delete reply", err);
      setError("Response could not be deleted.");
    }
  };

  const handleStartEditReply = (threadId, reply) => {
    if (!canEditReply(reply)) {
      setError("You can only edit your own response.");
      return;
    }

    setError("");
    setEditingReply({ threadId, replyId: reply.id, text: reply.text, author: reply.author });
  };

  const handleSaveEditReply = async () => {
    if (!editingReply || !editingReply.text.trim() || !db) return;

    const threadReplies = repliesByThread[editingReply.threadId] || [];
    const currentReply = threadReplies.find((r) => r.id === editingReply.replyId);
    if (!canEditReply(currentReply)) {
      setError("You can only edit your own response.");
      return;
    }

    try {
      await setDoc(
        doc(repliesCollectionRef(editingReply.threadId), editingReply.replyId),
        { text: editingReply.text, editedAt: serverTimestamp() },
        { merge: true }
      );

      setEditingReply(null);
    } catch (err) {
      console.error("Failed to edit reply", err);
      setError("Response could not be edited.");
    }
  };

  const handleCorrectDraft = async (threadId) => {
    const draft = replyDrafts[threadId] || "";
    if (!draft.trim()) {
      setError("Enter text first — the AI needs content to correct.");
      return;
    }

    setIsCorrectingDraft((prev) => ({ ...prev, [threadId]: true }));
    setError("");

    try {
      const { corrected } = await correctDiscussionText({
        text: draft,
        level: studentProfile?.level,
        idToken,
      });

      if (corrected) {
        setReplyDrafts((prev) => ({ ...prev, [threadId]: corrected }));
      }
    } catch (err) {
      console.error("Failed to correct draft", err);
      setError("The AI correction failed. Please try again later.");
    } finally {
      setIsCorrectingDraft((prev) => ({ ...prev, [threadId]: false }));
    }
  };

  const threadsWithReplies = useMemo(
    () =>
      threads.map((thread) => ({
        ...thread,
        status: resolveStatus(thread),
        replies: repliesByThread[thread.id] || [],
      })),
    [threads, repliesByThread, resolveStatus]
  );

  const filteredThreadsWithReplies = useMemo(() => {
    const queryTerm = searchTerm.trim().toLowerCase();

    const filtered = threadsWithReplies.filter((thread) => {
      const status = thread.status;
      const isMine = user?.uid && thread.createdByUid === user.uid;
      const hasNoReplies = thread.replies.length === 0;

      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (showMyPostsOnly && !isMine) return false;
      if (showNoRepliesOnly && !hasNoReplies) return false;
      if (lessonFilter !== "all" && thread.lessonId !== lessonFilter) return false;

      if (!queryTerm) return true;

      return [thread.topic, thread.questionTitle, thread.question, thread.lessonLabel, thread.createdBy]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(queryTerm));
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "oldest") return (a.createdAt || 0) - (b.createdAt || 0);
      if (sortBy === "mostReplies") return b.replies.length - a.replies.length;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [lessonFilter, searchTerm, showMyPostsOnly, showNoRepliesOnly, sortBy, statusFilter, threadsWithReplies, user?.uid]);

  const renderThread = (thread) => {
    const status = thread.status || resolveStatus(thread);
    const isThreadOpen = status === "open";

    const timeRemainingLabel =
      status === "archived"
        ? "Archived"
        : status === "expired"
        ? "Expired"
        : thread.expiresAt
        ? `Time left ${formatTimeRemaining(thread.expiresAt, now)}`
        : "No timer set";

    const statusBadgeStyle = {
      ...styles.badge,
      background:
        status === "archived"
          ? "#fef3c7"
          : status === "expired"
          ? "#fee2e2"
          : "#ecfeff",
      borderColor:
        status === "archived"
          ? "#fcd34d"
          : status === "expired"
          ? "#fecaca"
          : "#a5f3fc",
      color: status === "archived" ? "#92400e" : status === "expired" ? "#991b1b" : "#0ea5e9",
    };

    const tutorUnit = extensionUnits[thread.id] || thread.timerUnit || "minutes";
    const tutorMinutes = valueFromMinutes(thread.timerMinutes || 0, tutorUnit);
    const tutorValue = extensionValues[thread.id] ?? tutorMinutes ?? 10;

    const isEditingThisThread = editingThread?.threadId === thread.id;

    return (
      <div key={thread.id} style={{ ...styles.card, display: "grid", gap: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "grid", gap: 4 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>
              {thread.questionTitle || thread.topic}
              {thread.editedAt ? (
                <span style={{ ...styles.helperText, marginLeft: 8 }}>· edited</span>
              ) : null}
            </div>

            <div style={{ fontSize: 13, color: "#4b5563" }}>{thread.lessonLabel}</div>

            <div style={{ fontSize: 12, color: "#6b7280" }} title={formatDateTime(thread.createdAt, timezonePreference)}>
              Posted {formatRelativeTime(thread.createdAt, now)}
            </div>
            {thread.editedAt ? (
              <div style={{ fontSize: 12, color: "#6b7280" }} title={formatDateTime(thread.editedAt, timezonePreference)}>
                Edited at {formatDateTime(thread.editedAt, timezonePreference)}
              </div>
            ) : null}

            {thread.extraLink ? (
              <a href={thread.extraLink} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>
                Open external link
              </a>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <span style={styles.badge}>Posted by {thread.createdBy}</span>
            <span style={statusBadgeStyle}>{timeRemainingLabel}</span>

            {canEditThread(thread) ? (
              <button
                style={{ ...styles.secondaryButton, padding: "8px 10px" }}
                type="button"
                onClick={() => startEditThread(thread)}
              >
                Edit post
              </button>
            ) : null}
          </div>
        </div>

        {isEditingThisThread ? (
          <div style={{ display: "grid", gap: 10, background: "#f8fafc", padding: 12, borderRadius: 12 }}>
            <div style={styles.field}>
              <label style={styles.label}>Topic / headline</label>
              <input
                type="text"
                style={styles.select}
                value={editingThread.topic}
                onChange={(e) => setEditingThread((p) => ({ ...p, topic: e.target.value }))}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Instructions (English)</label>
              <textarea
                style={styles.textArea}
                value={editingThread.instructions}
                onChange={(e) => setEditingThread((p) => ({ ...p, instructions: e.target.value }))}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Guiding question</label>
              <textarea
                style={styles.textArea}
                value={editingThread.question}
                onChange={(e) => setEditingThread((p) => ({ ...p, question: e.target.value }))}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Additional link (optional)</label>
              <input
                type="url"
                style={styles.select}
                value={editingThread.extraLink}
                onChange={(e) => setEditingThread((p) => ({ ...p, extraLink: e.target.value }))}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                style={{ ...styles.secondaryButton, padding: "10px 12px" }}
                type="button"
                onClick={() => setEditingThread(null)}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.primaryButton, padding: "10px 12px" }}
                type="button"
                onClick={saveThreadEdit}
                disabled={isSavingThreadEdit}
              >
                {isSavingThreadEdit ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        ) : (
          <>
            {!isThreadOpen ? (
              <div
                style={{
                  ...styles.helperText,
                  margin: 0,
                  background: "#f8fafc",
                  borderRadius: 10,
                  padding: 10,
                  color: "#0f172a",
                }}
              >
                Replies are closed because this thread is {status}. Tutors can reopen it with the timer controls.
              </div>
            ) : null}

            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ ...styles.helperText, ...styles.discussionLongText, margin: 0, fontSize: 14 }}>
                <strong>Question:</strong> {thread.question}
              </div>

              {thread.instructions ? (
                <div
                  style={{
                    ...styles.helperText,
                    ...styles.discussionLongText,
                    margin: 0,
                    background: "#f8fafc",
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <strong>Instructions (English):</strong> {thread.instructions} — Refer to chapter "Tutorial" in the
                  course book.
                </div>
              ) : null}
            </div>
          </>
        )}

        {isTutor ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <label style={{ ...styles.helperText, margin: 0 }}>Extend or reopen timer</label>
            <input
              type="number"
              min="0"
              step="1"
              style={{ ...styles.select, maxWidth: 120 }}
              value={tutorValue}
              onChange={(e) => setExtensionValues((prev) => ({ ...prev, [thread.id]: e.target.value }))}
            />
            <select
              value={tutorUnit}
              onChange={(e) => setExtensionUnits((prev) => ({ ...prev, [thread.id]: e.target.value }))}
              style={{ ...styles.select, maxWidth: 140 }}
            >
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
            <button
              style={{ ...styles.primaryButton, padding: "10px 12px" }}
              type="button"
              onClick={() => handleExtendThread(thread.id)}
            >
              Reopen / extend
            </button>
          </div>
        ) : null}

        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Responses ({thread.replies.length})</div>

          <div style={{ display: "grid", gap: 10 }}>
            {thread.replies.map((reply) => {
              const canManage = canEditReply(reply);

              return (
                <div key={reply.id} style={{ ...styles.card, marginBottom: 0, background: "#f9fafb" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{reply.author || "Student"}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }} title={formatDateTime(reply.createdAt, timezonePreference)}>
                        Posted {formatRelativeTime(reply.createdAt, now)}
                        {reply.editedAt ? ` · edited ${formatDateTime(reply.editedAt, timezonePreference)}` : ""}
                      </div>
                    </div>

                    {canManage ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          style={{ ...styles.secondaryButton, padding: "6px 10px" }}
                          onClick={() => handleStartEditReply(thread.id, reply)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          style={{ ...styles.dangerButton, padding: "6px 10px" }}
                          onClick={() => handleDeleteReply(thread.id, reply)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>

                  {editingReply && editingReply.replyId === reply.id ? (
                    <>
                      <textarea
                        style={{ ...styles.textareaSmall, marginTop: 8 }}
                        value={editingReply.text}
                        onChange={(e) => setEditingReply((prev) => ({ ...prev, text: e.target.value }))}
                      />
                      <div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: "flex-end" }}>
                        <button
                          style={{ ...styles.secondaryButton, padding: "6px 10px" }}
                          onClick={() => setEditingReply(null)}
                          type="button"
                        >
                          Cancel
                        </button>
                        <button
                          style={{ ...styles.primaryButton, padding: "6px 10px" }}
                          onClick={handleSaveEditReply}
                          type="button"
                        >
                          Save
                        </button>
                      </div>
                    </>
                  ) : (
                    <p style={styles.discussionMessage}>
                      {reply.text}
                      {reply.editedAt ? " · edited" : ""}
                    </p>
                  )}
                </div>
              );
            })}

            {thread.replies.length === 0 && (
              <div style={{ ...styles.helperText, margin: 0 }}>No responses yet — start the discussion!</div>
            )}
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span style={statusBadgeStyle}>{timeRemainingLabel}</span>
            </div>

            <textarea
              style={styles.textareaSmall}
              placeholder={
                isThreadOpen ? "Share your opinion or give feedback ..." : "Replies are disabled for this thread"
              }
              value={replyDrafts[thread.id] || ""}
              onChange={(e) => {
                setReplyDrafts((prev) => ({ ...prev, [thread.id]: e.target.value }));
                if (isThreadOpen) markTypingForThread(thread.id);
              }}
              onBlur={() => stopTypingIndicator(thread.id)}
              disabled={!isThreadOpen}
            />

            {typingByThread[thread.id]?.length ? (
              <div style={{ ...styles.helperText, margin: 0, color: "#0ea5e9" }}>
                {typingByThread[thread.id].join(", ")} is typing ...
              </div>
            ) : null}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, flexWrap: "wrap" }}>
              <button
                style={{ ...styles.secondaryButton, padding: "10px 12px" }}
                type="button"
                onClick={() => handleCorrectDraft(thread.id)}
                disabled={isCorrectingDraft[thread.id] || !isThreadOpen}
              >
                {isCorrectingDraft[thread.id] ? "AI is correcting ..." : "Correct with AI"}
              </button>
              <button
                style={styles.primaryButton}
                onClick={() => handleReply(thread.id)}
                disabled={!isThreadOpen}
                type="button"
              >
                Post response
              </button>
            </div>

            {!isThreadOpen ? (
              <p style={{ ...styles.helperText, margin: 0, color: "#0f172a" }}>
                Replies are disabled for this {status} thread.
              </p>
            ) : null}

            <p style={{ ...styles.helperText, margin: 0 }}>
              "Correct with AI" improves only what you type. Without text, the AI cannot help.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section
        style={{
          ...styles.card,
          minHeight: 200,
          display: "grid",
          alignContent: "end",
          gap: 8,
          border: "none",
          boxShadow: "0 14px 40px rgba(15, 23, 42, 0.2)",
          backgroundImage:
            "linear-gradient(120deg, rgba(15,23,42,0.72), rgba(30,64,175,0.42)), url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 style={{ ...styles.sectionTitle, margin: 0, color: "#f8fafc" }}>Group discussion hub</h2>
        <p style={{ ...styles.helperText, margin: 0, color: "#dbeafe" }}>
          Share ideas with your classmates, practise clear responses, and improve together.
        </p>
      </section>

      <div style={styles.card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={styles.sectionTitle}>Class discussion</h2>
            <p style={{ ...styles.helperText, marginBottom: 0 }}>
              Anyone in your class (students + tutors) can create a timed discussion post. Replies update live, and
              you can edit your own posts if you make mistakes.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
              <span style={styles.badge}>Level: {studentProfile?.level || "(missing)"}</span>
              <span style={styles.badge}>Class: {studentProfile?.className || "(missing)"}</span>
              <span
                style={{
                  ...styles.badge,
                  background: "#f8fafc",
                  borderColor: "#cbd5e1",
                  color: "#0f172a",
                }}
              >
                Only members of your class can view and post here.
              </span>
            </div>
          </div>

          {activeTab === "discussion" ? (
            <span style={{ ...styles.badge, background: "#ecfeff", borderColor: "#a5f3fc", color: "#0ea5e9" }}>
              Live updates
            </span>
          ) : (
            <span style={{ ...styles.badge, background: "#f3f4f6", borderColor: "#cbd5e1", color: "#374151" }}>
              Read-only class directory
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          <button
            style={activeTab === "discussion" ? styles.navButtonActive : styles.navButton}
            onClick={() => setActiveTab("discussion")}
            type="button"
          >
            Group discussion
          </button>
          <button
            style={activeTab === "members" ? styles.navButtonActive : styles.navButton}
            onClick={() => setActiveTab("members")}
            type="button"
          >
            Class members
          </button>
        </div>

        {activeTab === "discussion" ? (
          <form onSubmit={handleCreateThread} style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span style={styles.helperText}>Time display</span>
              <select
                value={timezonePreference}
                onChange={(e) => setTimezonePreference(e.target.value)}
                style={{ ...styles.select, maxWidth: 220 }}
              >
                <option value="ghana">Ghana time (Africa/Accra)</option>
                <option value="local">My local time</option>
              </select>
            </div>
            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              <div style={styles.field}>
                <label style={styles.label}>Select lesson</label>
                <select
                  value={form.lessonId}
                  onChange={(e) => handleFormChange("lessonId", e.target.value)}
                  style={styles.select}
                >
                  {lessonOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {selectedLesson?.goal ? (
                  <div style={{ ...styles.helperText, margin: 0 }}>Goal: {selectedLesson.goal}</div>
                ) : null}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Topic / headline</label>
                <input
                  type="text"
                  style={styles.select}
                  value={form.topic}
                  onChange={(e) => handleFormChange("topic", e.target.value)}
                  placeholder="e.g. Phrases for complaints"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Timer</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    style={{ ...styles.select, flex: 1 }}
                    value={form.timerMinutes}
                    onChange={(e) => handleFormChange("timerMinutes", e.target.value)}
                  />
                  <select
                    value={form.timerUnit}
                    onChange={(e) => handleFormChange("timerUnit", e.target.value)}
                    style={{ ...styles.select, width: 140 }}
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Additional link (optional)</label>
                <input
                  type="url"
                  style={styles.select}
                  value={form.extraLink}
                  onChange={(e) => handleFormChange("extraLink", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Instructions for everyone (English)</label>
              <textarea
                style={styles.textArea}
                value={form.instructions}
                onChange={(e) => handleFormChange("instructions", e.target.value)}
                placeholder="Share house rules, materials, or answer format in English so everyone can follow along. Refer to chapter 'Tutorial' in the course book."
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Guiding question for the class</label>
              <textarea
                style={styles.textArea}
                value={form.question}
                onChange={(e) => handleFormChange("question", e.target.value)}
                placeholder="Which question should learners answer?"
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button style={styles.primaryButton} type="submit" disabled={isSavingThread}>
                {isSavingThread ? "Posting..." : "Post discussion"}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <p style={{ ...styles.helperText, margin: 0 }}>
              This directory lists classmates in your level and class. You can also update your own biography directly
              from this tab.
            </p>
            <ClassMembersTab />
          </div>
        )}
      </div>

      {activeTab === "discussion" ? (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ ...styles.card, display: "grid", gap: 10 }}>
            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
              <input
                style={styles.select}
                placeholder="Search topic, question, author"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.select}>
                <option value="all">All statuses</option>
                <option value="open">Open</option>
                <option value="expired">Expired</option>
                <option value="archived">Archived</option>
              </select>
              <select value={lessonFilter} onChange={(e) => setLessonFilter(e.target.value)} style={styles.select}>
                <option value="all">All lessons</option>
                {lessonOptions.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.label}
                  </option>
                ))}
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="mostReplies">Most replies</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <label style={{ ...styles.helperText, margin: 0 }}>
                <input type="checkbox" checked={showMyPostsOnly} onChange={(e) => setShowMyPostsOnly(e.target.checked)} /> My posts
              </label>
              <label style={{ ...styles.helperText, margin: 0 }}>
                <input
                  type="checkbox"
                  checked={showNoRepliesOnly}
                  onChange={(e) => setShowNoRepliesOnly(e.target.checked)}
                />{" "}
                No replies
              </label>
            </div>
          </div>

          {error ? (
            <div style={{ ...styles.card, borderColor: "#fca5a5", background: "#fef2f2" }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Error</div>
              <p style={{ ...styles.helperText, margin: 0 }}>{error}</p>
            </div>
          ) : isLoading ? (
            <div style={styles.card}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Loading discussions ...</div>
              <p style={{ ...styles.helperText, margin: 0 }}>Fetching the latest posts.</p>
            </div>
          ) : filteredThreadsWithReplies.length === 0 ? (
            <div style={styles.card}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>No matching discussions</div>
              <p style={{ ...styles.helperText, margin: 0 }}>
                Try adjusting your filters, or create a new post for your class.
              </p>
            </div>
          ) : (
            filteredThreadsWithReplies.map((thread) => renderThread(thread))
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ClassDiscussionPage;
