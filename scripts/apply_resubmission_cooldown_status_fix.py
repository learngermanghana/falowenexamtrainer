#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def replace_once(path: Path, old: str, new: str) -> None:
    text = path.read_text(encoding="utf-8")
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected one match, found {count}: {old[:120]!r}")
    path.write_text(text.replace(old, new, 1), encoding="utf-8")


def insert_before_once(path: Path, marker: str, addition: str) -> None:
    text = path.read_text(encoding="utf-8")
    count = text.count(marker)
    if count != 1:
        raise RuntimeError(f"{path}: expected one marker, found {count}: {marker[:120]!r}")
    path.write_text(text.replace(marker, addition + marker, 1), encoding="utf-8")


course_tab = ROOT / "web/src/components/CourseTab.js"
lesson_progress = ROOT / "web/src/hooks/useLessonProgress.js"
submission_page = ROOT / "web/src/components/AssignmentSubmissionPage.js"
course_tab_test = ROOT / "web/src/components/CourseTab.status.test.js"
submission_test = ROOT / "web/src/components/AssignmentSubmissionPage.test.js"
lesson_progress_test = ROOT / "web/src/hooks/useLessonProgress.test.js"
functions_index = ROOT / "functions/index.js"

# Course-book cards: score is authoritative after marking, even when an older
# lessonProgress document still says "submitted".
replace_once(
    course_tab,
    'const normalizeStatus = (value) => String(value || "").trim().toLowerCase();\n',
    'const normalizeStatus = (value) => String(value || "").trim().toLowerCase();\nconst PASS_MARK = 60;\n',
)
replace_once(
    course_tab,
    '  failed: { key: "Needs correction", color: "#dc2626", background: "#fef2f2", border: "#fecaca" },',
    '  failed: { key: "Needs improvement", color: "#b45309", background: "#fff7ed", border: "#fed7aa" },',
)
replace_once(
    course_tab,
'''const statusFromProgressRecord = (record = {}) => {
  const statusFromStatusField = toCourseTabStatus(record.status || record.value || record.state);
  let statusFromFlags = "notStarted";
  if (record.passed === true) statusFromFlags = "passed";
  else if (record.failed === true) statusFromFlags = "failed";
  else if (record.submitted === true) statusFromFlags = toCourseTabStatus(record.status) === "resubmitted" ? "resubmitted" : "submitted";
  else if (record.inProgress === true || record.hasDraft === true) statusFromFlags = "inProgress";

  const finalStatus = statusFromFlags !== "notStarted" ? statusFromFlags : statusFromStatusField;
  return { statusFromStatusField, statusFromFlags, finalStatus };
};
''',
'''const toProgressScore = (record = {}) => {
  const value =
    record.bestScore ??
    record.latestScore ??
    record.score ??
    record.finalScore ??
    record.mark ??
    record.grade;

  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\\d.+-]+/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const toProgressMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") return value.toDate()?.getTime?.() || 0;
  if (Number.isFinite(value?.seconds)) return Number(value.seconds) * 1000;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

const hasPendingScoreReview = (record = {}) => {
  if (record?.source?.pendingSubmission === true) return true;
  const submittedAt = Math.max(
    toProgressMillis(record.submittedAt),
    toProgressMillis(record.resubmittedAt)
  );
  const markedAt = Math.max(
    toProgressMillis(record.markedAt),
    toProgressMillis(record.scoredAt)
  );
  return submittedAt > 0 && markedAt > 0 && submittedAt > markedAt;
};

const statusFromProgressRecord = (record = {}) => {
  const statusFromStatusField = toCourseTabStatus(record.status || record.value || record.state);
  const score = toProgressScore(record);
  let statusFromFlags = "notStarted";

  if (score !== null && !hasPendingScoreReview(record)) {
    statusFromFlags = score >= PASS_MARK ? "passed" : "failed";
  } else if (record.passed === true) statusFromFlags = "passed";
  else if (record.failed === true) statusFromFlags = "failed";
  else if (record.submitted === true) statusFromFlags = toCourseTabStatus(record.status) === "resubmitted" ? "resubmitted" : "submitted";
  else if (record.inProgress === true || record.hasDraft === true) statusFromFlags = "inProgress";

  const finalStatus = statusFromFlags !== "notStarted" ? statusFromFlags : statusFromStatusField;
  return { statusFromStatusField, statusFromFlags, finalStatus };
};
''',
)

# Live lesson-progress rows can be stale. Derive pass/fail from a real score,
# while preserving Submitted/Resubmitted when a newer attempt is awaiting marking.
replace_once(
    lesson_progress,
'''    const latestScore = toNumber(row.latestScore ?? row.score ?? row.finalScore);
    const bestScore = toNumber(row.bestScore ?? latestScore);
    const status = normalizeProgressStatus(row);
    const markedMillis = toMillis(row.markedAt || row.scoredAt || row.updatedAt);
    const submittedMillis = toMillis(row.submittedAt || row.resubmittedAt || row.updatedAt);
''',
'''    const latestScore = toNumber(row.latestScore ?? row.score ?? row.finalScore);
    const bestScore = toNumber(row.bestScore ?? latestScore);
    const markedMillis = toMillis(row.markedAt || row.scoredAt);
    const submittedMillis = toMillis(row.resubmittedAt || row.submittedAt);
    const storedStatus = normalizeProgressStatus(row);
    const scoreForStatus = bestScore ?? latestScore;
    const hasPendingSubmission = submittedMillis > 0 && markedMillis > 0 && submittedMillis > markedMillis;
    const status =
      typeof scoreForStatus === "number" && !hasPendingSubmission
        ? scoreForStatus >= PASS_MARK
          ? "passed"
          : "failed"
        : storedStatus;
''',
)
replace_once(
    lesson_progress,
'      source: { lessonProgress: true },',
'      source: { lessonProgress: true, pendingSubmission: hasPendingSubmission },',
)

# Shared cooldown helpers. The timer is rounded up, so the UI never says zero
# while the server still has a fraction of a second left.
replace_once(
    submission_page,
'''const toDateValue = (timestamp) => {
  if (!timestamp) return null;
  if (typeof timestamp?.toDate === "function") return timestamp.toDate();
  if (timestamp?.seconds) return new Date(timestamp.seconds * 1000);

  const fallback = new Date(timestamp);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};
''',
'''const toDateValue = (timestamp) => {
  if (!timestamp) return null;
  if (typeof timestamp?.toDate === "function") return timestamp.toDate();
  if (timestamp?.seconds) return new Date(timestamp.seconds * 1000);

  const fallback = new Date(timestamp);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

const toTimestampMillis = (timestamp) => {
  if (!timestamp) return 0;
  if (typeof timestamp?.toMillis === "function") {
    const millis = timestamp.toMillis();
    return Number.isFinite(millis) ? millis : 0;
  }
  const date = toDateValue(timestamp);
  return date?.getTime?.() || 0;
};

const getCooldownRemainingSeconds = (nextAllowedAtMs, nowMs = Date.now()) => {
  const deadline = Number(nextAllowedAtMs);
  const now = Number(nowMs);
  if (!Number.isFinite(deadline) || !Number.isFinite(now) || deadline <= now) return 0;
  return Math.max(0, Math.ceil((deadline - now) / 1000));
};

const formatCooldownRemaining = (remainingSeconds) => {
  const totalSeconds = Math.max(0, Math.ceil(Number(remainingSeconds) || 0));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const minuteText = `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  const secondText = `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
  return minutes > 0 ? `${minuteText} ${secondText}` : secondText;
};

const getCooldownDetailsFromError = (error) => {
  let details =
    error?.details ||
    error?.customData?.details ||
    error?.data?.details ||
    error?.cause?.details ||
    null;

  if (typeof details === "string") {
    try {
      details = JSON.parse(details);
    } catch (_error) {
      details = null;
    }
  }

  if (!details || typeof details !== "object") return null;
  const code = String(details.code || "").trim().toUpperCase();
  const remainingSeconds = Math.max(0, Math.ceil(Number(details.remainingSeconds) || 0));
  const nextAllowedAtMs = toTimestampMillis(details.nextAllowedAt);
  if (code !== "RESUBMISSION_COOLDOWN" && !remainingSeconds && !nextAllowedAtMs) return null;

  return {
    code: code || "RESUBMISSION_COOLDOWN",
    remainingSeconds:
      remainingSeconds || getCooldownRemainingSeconds(nextAllowedAtMs),
    nextAllowedAtMs,
  };
};
''',
)

replace_once(
    submission_page,
'''  const [resubmissionText, setResubmissionText] = useState("");
  const [resubmissionImprovement, setResubmissionImprovement] = useState("");
  const [resubmissionStatus, setResubmissionStatus] = useState({ loading: false, error: "", success: "" });
''',
'''  const [resubmissionText, setResubmissionText] = useState("");
  const [resubmissionImprovement, setResubmissionImprovement] = useState("");
  const [resubmissionStatus, setResubmissionStatus] = useState({ loading: false, error: "", success: "" });
  const [cooldownClockMs, setCooldownClockMs] = useState(() => Date.now());
  const [serverCooldownUntilMs, setServerCooldownUntilMs] = useState(0);
''',
)
replace_once(
    submission_page,
'''  const lastAutosavedRef = useRef({ assignmentTitle: "", submissionText: "" });
  const submissionTextRef = useRef(null);
''',
'''  const lastAutosavedRef = useRef({ assignmentTitle: "", submissionText: "" });
  const submissionTextRef = useRef(null);
  const cooldownWasActiveRef = useRef(false);
''',
)

replace_once(
    submission_page,
'''  const latestSubmissionActionAt = useMemo(() => {
    const latest = recentSubmissions.reduce((acc, item) => {
      const statusLabel = safeLower(item?.status);
      if (!["submitted", "resubmitted"].includes(statusLabel)) return acc;

      const itemDate = toDateValue(item.createdAt || item.updatedAt);
      if (!itemDate) return acc;
      if (!acc || itemDate > acc) return itemDate;
      return acc;
    }, null);

    return latest;
  }, [recentSubmissions]);

  const submissionCooldownRemainingMs = useMemo(() => {
    if (!latestSubmissionActionAt) return 0;
    const elapsed = Date.now() - latestSubmissionActionAt.getTime();
    const boundedElapsed = Math.max(0, elapsed);
    return Math.max(0, Math.min(ACTION_COOLDOWN_MS, ACTION_COOLDOWN_MS - boundedElapsed));
  }, [latestSubmissionActionAt]);

  const submissionCooldownLabel = useMemo(() => {
    if (!submissionCooldownRemainingMs) return "";
    const totalSecondsRemaining = Math.ceil(submissionCooldownRemainingMs / 1000);
    const minutesRemaining = Math.floor(totalSecondsRemaining / 60);
    const secondsRemaining = totalSecondsRemaining % 60;
    return minutesRemaining > 0 ? `${minutesRemaining}m ${secondsRemaining}s` : `${secondsRemaining}s`;
  }, [submissionCooldownRemainingMs]);
''',
'''  const latestSubmissionActionAt = useMemo(() => {
    const latest = recentSubmissions.reduce((acc, item) => {
      const statusLabel = safeLower(item?.status);
      if (!["submitted", "resubmitted"].includes(statusLabel)) return acc;
      if (!isSameSelectedAssignment(item)) return acc;

      const itemDate = [
        item.resubmittedAt,
        item.submittedAt,
        item.createdAt,
        item.updatedAt,
      ]
        .map(toDateValue)
        .filter(Boolean)
        .sort((left, right) => right.getTime() - left.getTime())[0];

      if (!itemDate) return acc;
      if (!acc || itemDate > acc) return itemDate;
      return acc;
    }, null);

    return latest;
  }, [isSameSelectedAssignment, recentSubmissions]);

  useEffect(() => {
    const timer = window.setInterval(() => setCooldownClockMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const submissionCooldownDeadlineMs = useMemo(() => {
    const localDeadline = latestSubmissionActionAt
      ? latestSubmissionActionAt.getTime() + ACTION_COOLDOWN_MS
      : 0;
    return Math.max(localDeadline, serverCooldownUntilMs || 0);
  }, [latestSubmissionActionAt, serverCooldownUntilMs]);

  const submissionCooldownRemainingSeconds = useMemo(
    () => getCooldownRemainingSeconds(submissionCooldownDeadlineMs, cooldownClockMs),
    [cooldownClockMs, submissionCooldownDeadlineMs]
  );
  const submissionCooldownRemainingMs = submissionCooldownRemainingSeconds * 1000;
  const submissionCooldownLabel = useMemo(
    () => formatCooldownRemaining(submissionCooldownRemainingSeconds),
    [submissionCooldownRemainingSeconds]
  );

  useEffect(() => {
    if (submissionCooldownRemainingSeconds > 0) {
      cooldownWasActiveRef.current = true;
      return undefined;
    }
    if (!cooldownWasActiveRef.current || !db || !user?.uid) return undefined;

    cooldownWasActiveRef.current = false;
    let cancelled = false;
    const refreshAfterCooldown = async () => {
      const submissionsRef = collection(db, SUBMISSION_COLLECTION);
      const snapshot = await getDocs(
        query(submissionsRef, where("studentId", "==", user.uid), orderBy("createdAt", "desc"), limit(25))
      );
      if (cancelled) return;
      setRecentSubmissions(
        snapshot.docs
          .map((entry) => ({ id: entry.id, ...entry.data() }))
          .filter((entry) => {
            const entryLevel = normalizeLevel(entry.level || selectedSubmitLevel);
            return entryLevel === "GENERAL" || accessibleSubmitLevels.includes(entryLevel);
          })
      );
      setCooldownClockMs(Date.now());
    };

    refreshAfterCooldown().catch((error) => {
      console.warn("Could not revalidate resubmission cooldown", error);
    });
    return () => {
      cancelled = true;
    };
  }, [
    accessibleSubmitLevels,
    selectedSubmitLevel,
    submissionCooldownRemainingSeconds,
    user?.uid,
  ]);
''',
)

submission_text = submission_page.read_text(encoding="utf-8")
submission_text = submission_text.replace(
    'error: `Please wait ${submissionCooldownLabel} before sending another submission.`,',
    'error: `You can resubmit in ${submissionCooldownLabel}.`,',
)
if submission_text.count('error: `You can resubmit in ${submissionCooldownLabel}.`,') < 2:
    raise RuntimeError("AssignmentSubmissionPage: expected both cooldown error messages to be updated")
submission_page.write_text(submission_text, encoding="utf-8")

replace_once(
    submission_page,
'''      const response = await submitAssignmentResubmission(payload);
      const result = response?.data || {};

      if (result.limitReached) {
''',
'''      const response = await submitAssignmentResubmission(payload);
      const result = response?.data || {};
      const returnedNextAllowedAtMs = toTimestampMillis(result.nextAllowedAt);
      if (returnedNextAllowedAtMs > Date.now()) {
        setServerCooldownUntilMs(returnedNextAllowedAtMs);
        setCooldownClockMs(Date.now());
      }

      if (result.limitReached) {
''',
)

replace_once(
    submission_page,
'''    } catch (error) {
      console.error("Failed to save resubmission", error);
      setResubmissionStatus({
        loading: false,
        error: getExactErrorMessage(error, "Could not save your resubmission."),
        success: "",
      });
    }
''',
'''    } catch (error) {
      console.error("Failed to save resubmission", error);
      const cooldownDetails = getCooldownDetailsFromError(error);
      if (cooldownDetails) {
        const nextAllowedAtMs =
          cooldownDetails.nextAllowedAtMs ||
          Date.now() + cooldownDetails.remainingSeconds * 1000;
        const remainingSeconds =
          cooldownDetails.remainingSeconds ||
          getCooldownRemainingSeconds(nextAllowedAtMs);

        setServerCooldownUntilMs(nextAllowedAtMs);
        setCooldownClockMs(Date.now());
        setResubmissionStatus({
          loading: false,
          error: `Your previous submission was received. You can resubmit in ${formatCooldownRemaining(remainingSeconds)}.`,
          success: "",
        });
        return;
      }

      setResubmissionStatus({
        loading: false,
        error: getExactErrorMessage(error, "Could not save your resubmission."),
        success: "",
      });
    }
''',
)

replace_once(
    submission_page,
'''                disabled={resubmissionStatus.loading || resubmissionLimitReached}
              >
                {resubmissionStatus.loading ? "Saving ..." : "Submit resubmission"}
''',
'''                disabled={
                  resubmissionStatus.loading ||
                  resubmissionLimitReached ||
                  submissionCooldownRemainingSeconds > 0
                }
              >
                {resubmissionStatus.loading
                  ? "Saving ..."
                  : submissionCooldownRemainingSeconds > 0
                  ? `Wait ${submissionCooldownLabel}`
                  : "Submit resubmission"}
''',
)

replace_once(
    submission_page,
'''  buildSubmissionFingerprint,
};
''',
'''  buildSubmissionFingerprint,
  getCooldownRemainingSeconds,
  formatCooldownRemaining,
  getCooldownDetailsFromError,
};
''',
)

# Backend source-of-truth cooldown.
replace_once(
    functions_index,
'const PASS_THRESHOLD_SCORE = 60;\n',
'const PASS_THRESHOLD_SCORE = 60;\nconst RESUBMISSION_COOLDOWN_MS = 10 * 60 * 1000;\n',
)
replace_once(
    functions_index,
'''        let attempts = Number(counterSnap.data()?.attempts || 0);
        let passed = counterSnap.data()?.passed === true;
        let hasSubmittedOrLockedAssignment = attempts > 0;
        let hasMatchingFailedScore = false;
''',
'''        let attempts = Number(counterSnap.data()?.attempts || 0);
        let passed = counterSnap.data()?.passed === true;
        let hasSubmittedOrLockedAssignment = attempts > 0;
        let hasMatchingFailedScore = false;
        let latestSubmissionMillis = 0;
''',
)
replace_once(
    functions_index,
'''        existingSnap.forEach((docSnap) => {
          const existing = docSnap.data() || {};
          if (countSubmissionAttemptDoc(existing)) {
''',
'''        existingSnap.forEach((docSnap) => {
          const existing = docSnap.data() || {};
          const timestampCandidates = [
            existing.resubmittedAt,
            existing.submittedAt,
            existing.createdAt,
            existing.updatedAt,
          ]
            .map(getMillisFromTimestampLike)
            .filter(Number.isFinite);
          if (timestampCandidates.length) {
            latestSubmissionMillis = Math.max(latestSubmissionMillis, ...timestampCandidates);
          }

          if (countSubmissionAttemptDoc(existing)) {
''',
)
replace_once(
    functions_index,
'''        if (!hasMatchingFailedScore) {
          throw new HttpsError("failed-precondition", "The reviewed score does not match this assignment.");
        }

        if (attempts >= MAX_TOTAL_SUBMISSION_ATTEMPTS) {
''',
'''        if (!hasMatchingFailedScore) {
          throw new HttpsError("failed-precondition", "The reviewed score does not match this assignment.");
        }

        const nextAllowedAtMillis = latestSubmissionMillis + RESUBMISSION_COOLDOWN_MS;
        const remainingSeconds = Math.max(
          0,
          Math.ceil((nextAllowedAtMillis - Date.now()) / 1000)
        );
        if (latestSubmissionMillis > 0 && remainingSeconds > 0) {
          throw new HttpsError(
            "resource-exhausted",
            "Please wait before resubmitting this assignment.",
            {
              code: "RESUBMISSION_COOLDOWN",
              nextAllowedAt: new Date(nextAllowedAtMillis).toISOString(),
              remainingSeconds,
            }
          );
        }

        if (attempts >= MAX_TOTAL_SUBMISSION_ATTEMPTS) {
''',
)
replace_once(
    functions_index,
'''      return result;
''',
'''      return {
        ...result,
        nextAllowedAt: new Date(Date.now() + RESUBMISSION_COOLDOWN_MS).toISOString(),
        cooldownSeconds: Math.ceil(RESUBMISSION_COOLDOWN_MS / 1000),
      };
''',
)

# Regression tests.
insert_before_once(
    course_tab_test,
'''  it("requires all assignment chapters in a combined day entry before marking complete", () => {
''',
'''  it("uses a marked score over a stale submitted status", () => {
    const failedStatus = getAutoStatusForEntry({
      progressByAssignmentId: {
        "A1-2": {
          assignmentId: "A1-2",
          status: "submitted",
          submitted: true,
          bestScore: 40,
          latestScore: 40,
        },
      },
      entry,
      level: "A1",
      occurrence: 1,
    });
    const passedStatus = getAutoStatusForEntry({
      progressByAssignmentId: {
        "A1-2": {
          assignmentId: "A1-2",
          status: "submitted",
          submitted: true,
          bestScore: 60,
          latestScore: 60,
        },
      },
      entry,
      level: "A1",
      occurrence: 1,
    });

    expect(failedStatus.finalStatus).toBe("failed");
    expect(passedStatus.finalStatus).toBe("passed");
  });

''',
)

insert_before_once(
    submission_test,
'''  it("falls back to auth display name when student profile name is missing", () => {
''',
'''  it("rounds cooldowns up and shows exact minutes and seconds", () => {
    expect(__TESTING__.getCooldownRemainingSeconds(600001, 0)).toBe(601);
    expect(__TESTING__.getCooldownRemainingSeconds(10000, 10000)).toBe(0);
    expect(__TESTING__.formatCooldownRemaining(514)).toBe("8 minutes 34 seconds");
    expect(__TESTING__.formatCooldownRemaining(42)).toBe("42 seconds");
    expect(__TESTING__.formatCooldownRemaining(61)).toBe("1 minute 1 second");
  });

  it("reads structured cooldown details returned by the callable", () => {
    const details = __TESTING__.getCooldownDetailsFromError({
      details: {
        code: "RESUBMISSION_COOLDOWN",
        nextAllowedAt: "2026-06-22T12:10:00.000Z",
        remainingSeconds: 45,
      },
    });

    expect(details).toMatchObject({
      code: "RESUBMISSION_COOLDOWN",
      remainingSeconds: 45,
    });
    expect(details.nextAllowedAtMs).toBe(new Date("2026-06-22T12:10:00.000Z").getTime());
  });

''',
)

lesson_progress_test.write_text(
'''import { buildProgressFromLessonProgressRows } from "./useLessonProgress";

describe("buildProgressFromLessonProgressRows", () => {
  it("marks a stale submitted record as failed when its best score is below 60", () => {
    const progress = buildProgressFromLessonProgressRows(
      [
        {
          assignmentId: "A1-1.2",
          level: "A1",
          status: "submitted",
          submitted: true,
          bestScore: 40,
          latestScore: 40,
          submittedAt: "2026-06-22T10:00:00.000Z",
          markedAt: "2026-06-22T10:05:00.000Z",
        },
      ],
      "A1"
    );

    expect(progress["A1-1.2"]).toMatchObject({
      status: "failed",
      failed: true,
      passed: false,
      bestScore: 40,
    });
  });

  it("passes a score of exactly 60", () => {
    const progress = buildProgressFromLessonProgressRows(
      [
        {
          assignmentId: "A1-1.2",
          level: "A1",
          status: "submitted",
          submitted: true,
          bestScore: 60,
          latestScore: 60,
          submittedAt: "2026-06-22T10:00:00.000Z",
          markedAt: "2026-06-22T10:05:00.000Z",
        },
      ],
      "A1"
    );

    expect(progress["A1-1.2"].status).toBe("passed");
  });

  it("keeps a newer resubmission awaiting review instead of showing the old failed score", () => {
    const progress = buildProgressFromLessonProgressRows(
      [
        {
          assignmentId: "A1-1.2",
          level: "A1",
          status: "resubmitted",
          submitted: true,
          bestScore: 40,
          latestScore: 40,
          markedAt: "2026-06-22T10:05:00.000Z",
          resubmittedAt: "2026-06-22T10:10:00.000Z",
        },
      ],
      "A1"
    );

    expect(progress["A1-1.2"]).toMatchObject({
      status: "resubmitted",
      failed: false,
      submitted: true,
      source: { pendingSubmission: true },
    });
  });
});
''',
    encoding="utf-8",
)

print("Applied resubmission cooldown and assignment status fixes.")
