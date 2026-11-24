import { AccountDeletionCard } from "./AccountDeletion";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";
import TuitionStatusCard from "./TuitionStatusCard";
import StudentDocumentsPanel from "./StudentDocumentsPanel";
import NotificationSettingsCard from "./NotificationSettingsCard";
import AdditionalProgrammeRequest from "./AdditionalProgrammeRequest";
import ClassParticipationCard from "./ClassParticipationCard";
import { isPaymentsEnabled } from "../lib/featureFlags";
import { toDate, toDateMs } from "../lib/dateUtils";
import { hasClearedBalance, normalizePaymentStatus } from "../lib/paymentStatus";
import { shouldOfferTuitionPayment } from "../utils/tuitionPaymentVisibility";
import { formatCurrency } from "../lib/formatters";
import { useFalowenUsdGhsRate, approximateUsd } from "../lib/falowenFxRate";
import { getNextLevel, getTuitionFeeForLevel } from "../data/levelFees";
import { clearPaymentAttempt, getPaymentAttempt } from "../lib/paymentAttempt";
import { getTrialLifecycleState } from "../lib/trialAccess";
import { isApprovedUniversityStudent, isHamburgUniversityStudent } from "../lib/universityInvitations";
import useCourseCompletionProgress from "../hooks/useCourseCompletionProgress";
import { getCourseType } from "./CourseTypeSettings";
import "./AccountSettings.css";

const formatDate = (value) => {
  if (!value) return "–";
  const date = toDate(value);
  if (!date) return "–";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const COURSE_COMPLETION_UPGRADE_LEVELS = new Set(["A1", "A2", "B1"]);

const AccountSettings = () => {
  const { user, studentProfile, idToken, refreshStudentProfile } = useAuth();
  const { i18n, t } = useTranslation();
  const isSwahili = studentProfile?.program === "swahili";
  const isSecondaryCourse = studentProfile?.isSecondaryCourse === true;
  const isUniversityRegistration = isHamburgUniversityStudent(studentProfile);
  const hasComplimentaryAccess = isApprovedUniversityStudent(studentProfile);
  const fxQuote = useFalowenUsdGhsRate();
  const usdBelow = (value) => {
    const estimated = approximateUsd(value, fxQuote);
    return estimated ? <small style={{display:"block",fontWeight:400,fontSize:12,color:"#64748b",marginTop:3}}>≈ {estimated} USD</small> : null;
  };
  const locale = i18n.language;
  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const formatMoney = useCallback(
    (value) => formatCurrency(value, { locale, maximumFractionDigits: 2 }),
    [locale]
  );
  const paymentsEnabled = isPaymentsEnabled();
  const [status, setStatus] = useState("");
  const [isUpgradingLevel, setIsUpgradingLevel] = useState(false);
  const [isRefreshingPayment, setIsRefreshingPayment] = useState(false);
  const {
    progress: courseCompletion,
    loading: courseCompletionLoading,
    error: courseCompletionError,
    refresh: refreshCourseCompletion,
  } = useCourseCompletionProgress({
    studentProfile: isSwahili ? null : studentProfile,
    user: isSwahili ? null : user,
    level: isSwahili ? "" : studentProfile?.level,
  });
  const location = useLocation();
  const navigate = useNavigate();
  const requestedTab = new URLSearchParams(location.search).get("tab") || "billing";
  // Keep the canonical Router tab expression stable for the Account sync
  // scripts, and handle the additional Documents tab as a separate fallback.
  const activeTab = ["studentData", "participation", "notifications", "billing", "upgrade", "deleteAccount"].includes(requestedTab)
    ? (isSwahili && ["participation", "upgrade"].includes(requestedTab)) || (isSecondaryCourse && requestedTab === "upgrade")
      ? "studentData" : requestedTab
    : requestedTab === "documents" ? "documents" : "studentData";

  const selectAccountTab = (tabKey) => {
    const params = new URLSearchParams(location.search);
    if (tabKey === "billing") params.delete("tab");
    else params.set("tab", tabKey);
    const nextSearch = params.toString();
    const nextUrl =
      location.pathname +
      (nextSearch ? "?" + nextSearch : "") +
      (location.hash || "");
    navigate(nextUrl, { replace: true });
  };

  const billingSummary = useMemo(() => {
    const upgradeStatus = String(studentProfile?.upgradeStatus || "").toLowerCase();
    if (upgradeStatus === "pending") {
      const tuition = Math.max(Number(studentProfile?.upgradeTuitionFee || 0) || 0, 0);
      const paid = Math.max(Number(studentProfile?.upgradePaid || 0) || 0, 0);
      const balanceDue = Math.max(Number(studentProfile?.upgradeBalanceDue ?? Math.max(tuition - paid, 0)) || 0, 0);
      return { paidAmount: paid, tuitionFee: tuition, balanceDue, isUpgrade: true };
    }

    const paid = Math.max(Number(studentProfile?.paid ?? studentProfile?.initialPaymentAmount ?? 0) || 0, 0);
    const tuition = Math.max(Number(studentProfile?.tuitionFee ?? (studentProfile?.program === "swahili" ? 0 : getTuitionFeeForLevel(studentProfile?.level))) || 0, 0);
    const explicitBalanceRaw = studentProfile?.balanceDue ?? studentProfile?.balance;
    const explicitBalance = explicitBalanceRaw === undefined || explicitBalanceRaw === null
      ? null
      : Math.max(Number(explicitBalanceRaw) || 0, 0);
    const derivedBalance = studentProfile?.program === "swahili" && studentProfile.tuitionFee == null
      ? null
      : Math.max(tuition - paid, 0);
    const balanceDue = explicitBalance === null || derivedBalance === null
      ? explicitBalance ?? derivedBalance
      : Math.min(explicitBalance, derivedBalance);
    return { paidAmount: paid, tuitionFee: tuition, balanceDue, isUpgrade: false };
  }, [studentProfile]);

  const paidAmount = billingSummary.paidAmount;
  const balanceDue = billingSummary.balanceDue;

  const paymentAttempt = useMemo(() => getPaymentAttempt(studentProfile), [studentProfile]);
  const trialLifecycle = useMemo(() => getTrialLifecycleState(studentProfile), [studentProfile]);
  const normalizedPaymentStatus = normalizePaymentStatus(studentProfile?.paymentStatus);
  const paymentCleared = normalizedPaymentStatus === "paid" || hasClearedBalance(balanceDue);
  // Payment actions require a real amount due and must never prompt an already-paid learner.
  const hasOutstandingTuition = shouldOfferTuitionPayment({ balanceDue, paymentCleared });

  const billingState = useMemo(() => {
    if (isSecondaryCourse) {
      return {
        key: "secondary", label: t("enrollmentRequest.secondaryBillingTitle"),
        title: t("enrollmentRequest.secondaryBillingTitle"),
        body: t("enrollmentRequest.secondaryBillingNotice"),
        tone: "#1e40af", background: "#eff6ff", border: "#93c5fd",
      };
    }
    if (isUniversityRegistration) {
      return {
        key: hasComplimentaryAccess ? "complimentary" : "verification-pending",
        label: hasComplimentaryAccess ? "Complimentary access" : "Awaiting verification",
        title: hasComplimentaryAccess ? "University course access approved" : "University course verification pending",
        body: hasComplimentaryAccess
          ? "Your Kiswahili A1 course access is complimentary. No tuition payment is due."
          : "Ruth will verify your University of Hamburg course enrolment. No payment is required.",
        tone: "#1e40af", background: "#eff6ff", border: "#93c5fd",
      };
    }
    if (paymentCleared) {
      return {
        key: "paid",
        label: "Paid",
        title: "Tuition paid",
        body: "Your tuition payment is confirmed in Falowen.",
        tone: "#166534",
        background: "#ecfdf5",
        border: "#86efac",
      };
    }
    if (normalizedPaymentStatus === "partial" || paidAmount > 0) {
      return {
        key: "partial",
        label: "Part payment received",
        title: "Balance remaining",
        body: `Falowen has confirmed ${formatMoney(paidAmount)}. You still have ${formatMoney(balanceDue)} remaining.`,
        tone: "#92400e",
        background: "#fffbeb",
        border: "#fcd34d",
      };
    }
    if (paymentAttempt) {
      return {
        key: "pending-attempt",
        label: "Payment pending",
        title: "Payment checkout started",
        body: "If you closed Paystack before finishing, your account remains unpaid. You can safely continue payment below. Falowen only marks you paid after confirmation.",
        tone: "#1e40af",
        background: "#eff6ff",
        border: "#93c5fd",
      };
    }
    if (trialLifecycle.key === "ending_soon") {
      return {
        key: "trial-ending",
        label: "Trial ending soon",
        title: "Pay before your trial ends",
        body: `Your trial has ${trialLifecycle.daysRemaining} day${trialLifecycle.daysRemaining === 1 ? "" : "s"} remaining. Your progress is saved, and payment keeps access uninterrupted.`,
        tone: "#92400e",
        background: "#fffbeb",
        border: "#fcd34d",
      };
    }
    if (trialLifecycle.key === "active") {
      return {
        key: "trial",
        label: "Trial active",
        title: "7-day trial active",
        body: `You can continue learning during your trial. ${trialLifecycle.daysRemaining} day${trialLifecycle.daysRemaining === 1 ? "" : "s"} remaining.`,
        tone: "#166534",
        background: "#f0fdf4",
        border: "#86efac",
      };
    }
    if (trialLifecycle.key === "expired_retained") {
      return {
        key: "trial-expired",
        label: "Trial expired · data retained",
        title: "Restore access by paying",
        body: `Your course access has ended, but your progress is retained for ${trialLifecycle.retentionDaysRemaining} more day${trialLifecycle.retentionDaysRemaining === 1 ? "" : "s"}. Pay now to continue with the same account.`,
        tone: "#9a3412",
        background: "#fff7ed",
        border: "#fdba74",
      };
    }
    if (trialLifecycle.key === "retention_ending_soon") {
      return {
        key: "retention-ending",
        label: "Recovery window ending soon",
        title: "Saved progress is nearing removal",
        body: `Your retained trial data has ${trialLifecycle.retentionDaysRemaining} day${trialLifecycle.retentionDaysRemaining === 1 ? "" : "s"} left before the recovery window ends. Pay now to restore access before then.`,
        tone: "#991b1b",
        background: "#fef2f2",
        border: "#fca5a5",
      };
    }
    return {
      key: "attention",
      label: "Payment needs attention",
      title: "Complete payment to continue",
      body: trialLifecycle.key === "purge_due"
        ? "The trial recovery window has ended. Contact Falowen support if you need help restoring access."
        : "Your account does not currently have confirmed paid access. Use the payment section below or refresh status if you have already paid.",
      tone: "#9a3412",
      background: "#fff7ed",
      border: "#fdba74",
    };
  }, [balanceDue, formatMoney, normalizedPaymentStatus, paidAmount, paymentAttempt, paymentCleared, trialLifecycle.key, trialLifecycle.daysRemaining, trialLifecycle.retentionDaysRemaining, isUniversityRegistration, hasComplimentaryAccess, isSecondaryCourse, t]);

  const accountAccess = useMemo(() => {
    if (isSecondaryCourse) {
      return {
        label: studentProfile?.coursePlacementPending
          ? t("enrollmentRequest.placementPendingLabel") : t("enrollmentRequest.secondaryAccessLabel"),
        detail: studentProfile?.coursePlacementPending
          ? t("enrollmentRequest.placementPending") : t("enrollmentRequest.secondaryBillingNotice"),
        daysRemaining: null,
        tone: "#1e40af", background: "#eff6ff", border: "#93c5fd",
      };
    }
    if (isUniversityRegistration) {
      return {
        label: hasComplimentaryAccess ? "Active" : "Verification pending",
        detail: hasComplimentaryAccess ? "Complimentary University of Hamburg Kiswahili A1 access" : "Awaiting instructor verification · no payment needed",
        daysRemaining: null,
        tone: "#1e40af", background: "#eff6ff", border: "#93c5fd",
      };
    }
    const now = Date.now();
    const contractEnd = toDate(studentProfile?.contractEnd);
    const contractEndMs = contractEnd?.getTime?.();
    const hasContractEnd = Number.isFinite(contractEndMs);
    const hasCurrentContract = hasContractEnd && contractEndMs > now;
    const daysRemaining = hasCurrentContract
      ? Math.max(0, Math.ceil((contractEndMs - now) / (1000 * 60 * 60 * 24)))
      : null;

    if (hasCurrentContract || (!hasContractEnd && paymentCleared)) {
      return {
        label: "Active",
        detail: hasCurrentContract
          ? `Course access until ${formatDate(studentProfile?.contractEnd)}`
          : "Paid course access",
        daysRemaining,
        tone: "#166534",
        background: "#ecfdf5",
        border: "#86efac",
      };
    }

    if (hasContractEnd && contractEndMs <= now) {
      return {
        label: "Access ended",
        detail: `Course access ended ${formatDate(studentProfile?.contractEnd)}`,
        daysRemaining: null,
        tone: "#9a3412",
        background: "#fff7ed",
        border: "#fdba74",
      };
    }

    if (trialLifecycle.key === "active" || trialLifecycle.key === "ending_soon") {
      return {
        label: "Trial",
        detail: `${trialLifecycle.daysRemaining} day${trialLifecycle.daysRemaining === 1 ? "" : "s"} remaining`,
        daysRemaining: trialLifecycle.daysRemaining,
        tone: trialLifecycle.key === "ending_soon" ? "#92400e" : "#166534",
        background: trialLifecycle.key === "ending_soon" ? "#fffbeb" : "#f0fdf4",
        border: trialLifecycle.key === "ending_soon" ? "#fcd34d" : "#86efac",
      };
    }

    if (trialLifecycle.key === "expired_retained" || trialLifecycle.key === "retention_ending_soon") {
      return {
        label: "Access ended",
        detail: `Progress retained for ${trialLifecycle.retentionDaysRemaining} more day${trialLifecycle.retentionDaysRemaining === 1 ? "" : "s"}`,
        daysRemaining: null,
        tone: "#9a3412",
        background: "#fff7ed",
        border: "#fdba74",
      };
    }

    return {
      label: "Payment required",
      detail: billingState.body,
      daysRemaining: null,
      tone: billingState.tone,
      background: billingState.background,
      border: billingState.border,
    };
  }, [
    billingState.background,
    billingState.body,
    billingState.border,
    billingState.tone,
    isSecondaryCourse, studentProfile?.coursePlacementPending, t,
    paymentCleared,
    isUniversityRegistration,
    hasComplimentaryAccess,
    studentProfile?.contractEnd,
    trialLifecycle.daysRemaining,
    trialLifecycle.key,
    trialLifecycle.retentionDaysRemaining,
  ]);

  React.useEffect(() => {
    if (paymentCleared && paymentAttempt) {
      clearPaymentAttempt(studentProfile);
    }
  }, [paymentAttempt, paymentCleared, studentProfile]);

  const handleRefreshPaymentStatus = async () => {
    if (!refreshStudentProfile || isRefreshingPayment) return;
    setIsRefreshingPayment(true);
    setStatus("");
    try {
      const latest = await refreshStudentProfile();
      const latestStatus = normalizePaymentStatus(latest?.paymentStatus);
      const latestBalance = latest?.balanceDue ?? latest?.balance;
      if (latestStatus === "paid" || hasClearedBalance(latestBalance)) {
        clearPaymentAttempt(latest || studentProfile);
        setStatus("Payment confirmed. Your account is up to date.");
      } else if (latestStatus === "partial" || Number(latest?.paid ?? latest?.initialPaymentAmount ?? 0) > 0) {
        setStatus("Part payment confirmed. Your remaining balance is shown below.");
      } else {
        setStatus("No confirmed payment yet. If you left Paystack before finishing, use Continue payment below.");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not refresh payment status.");
    } finally {
      setIsRefreshingPayment(false);
    }
  };

  const transactionHistory = useMemo(() => {
    const candidates = [
      ...(Array.isArray(studentProfile?.payments) ? studentProfile.payments : []),
      ...(Array.isArray(studentProfile?.paymentHistory) ? studentProfile.paymentHistory : []),
      ...(Array.isArray(studentProfile?.transactions) ? studentProfile.transactions : []),
    ];

    return candidates
      .map((entry, index) => {
        const amount = Number(entry?.amount ?? entry?.paidAmount ?? 0) || 0;
        const rawDate = entry?.date || entry?.paidAt || entry?.createdAt;
        const timestamp = toDateMs(rawDate);
        return {
          id: entry?.id || entry?.reference || `tx-${index}`,
          date: formatDate(rawDate),
          timestamp: Number.isFinite(timestamp) ? timestamp : 0,
          amount,
          channel: entry?.channel || entry?.provider || "Paystack",
          reference: entry?.reference || entry?.transactionReference || "—",
          status: entry?.status || t("accountSettings.billing.transaction.statusCompleted"),
          receiptUrl: entry?.receiptUrl || entry?.receipt || entry?.receiptLink || "",
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [studentProfile?.paymentHistory, studentProfile?.payments, studentProfile?.transactions, t]);

  const subscription = useMemo(() => {
    const contractEnd = studentProfile?.contractEnd ? toDate(studentProfile.contractEnd) : null;
    const isActive = contractEnd && !Number.isNaN(contractEnd.getTime()) && contractEnd.getTime() > Date.now();
    const contractMonths = Number(studentProfile?.contractTermMonths) || null;
    const paymentStatus = normalizePaymentStatus(studentProfile?.paymentStatus);
    const balanceCleared = hasClearedBalance(balanceDue);
    const hasPaid = paymentStatus === "paid" || balanceCleared;

    const plan =
      contractMonths === 6
        ? t("accountSettings.billing.contract.sixMonth")
        : contractMonths === 1
        ? t("accountSettings.billing.contract.oneMonth")
        : hasPaid
        ? t("accountSettings.billing.contract.sixMonth")
        : paymentStatus === "partial"
        ? t("accountSettings.billing.contract.oneMonth")
        : t("accountSettings.billing.contract.paymentRequired");

    const renewalDays = contractEnd ? Math.ceil((contractEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

    return {
      plan,
      renewalDate: formatDate(studentProfile?.contractEnd),
      renewalDays,
      status: isActive ? t("accountSettings.billing.statusActive") : t("accountSettings.billing.statusPending"),
      seats: 1,
      paymentMethod: paymentsEnabled ? "Paystack" : t("accountSettings.billing.paymentMethodWeb"),
      invoiceEmail: studentProfile?.email || user?.email || "",
      autoRenew: Boolean(studentProfile?.autoRenew),
    };
  }, [
    paymentsEnabled,
    studentProfile?.contractEnd,
    studentProfile?.contractTermMonths,
    studentProfile?.paymentStatus,
    studentProfile?.autoRenew,
    balanceDue,
    studentProfile?.email,
    user?.email,
    t,
  ]);

  const paymentAlert = useMemo(() => {
    if (!balanceDue || balanceDue <= 0) return null;
    if (!studentProfile?.contractEnd) return null;
    const contractEndMs = toDateMs(studentProfile.contractEnd);
    if (!Number.isFinite(contractEndMs)) return null;
    const dayMs = 1000 * 60 * 60 * 24;
    const daysLeft = Math.ceil((contractEndMs - Date.now()) / dayMs);
    if (daysLeft < 0 || daysLeft > 15) return null;
    const daysLabel = t("common.day", { count: daysLeft, formattedCount: numberFormatter.format(daysLeft) });

    return {
      message:
        daysLeft === 0
          ? t("accountSettings.billing.alertToday", { amount: formatMoney(balanceDue) })
          : t("accountSettings.billing.alertDays", { amount: formatMoney(balanceDue), daysLabel }),
    };
  }, [balanceDue, formatMoney, numberFormatter, studentProfile?.contractEnd, t]);

  const upgradeStatus = String(studentProfile?.upgradeStatus || "").trim().toLowerCase();
  const queuedUpgradeLevel = String(studentProfile?.upgradeToLevel || "").toUpperCase();
  const upgradeBalanceDue = Math.max(Number(studentProfile?.upgradeBalanceDue || 0) || 0, 0);
  const hasOpenUpgrade = ["awaiting_payment", "pending", "expired"].includes(upgradeStatus) && Boolean(queuedUpgradeLevel) && upgradeBalanceDue > 0;

  const levelUpgrade = useMemo(() => {
    const currentLevel = String(studentProfile?.level || "").toUpperCase();
    const nextLevel = getNextLevel(currentLevel);
    const hasOutstandingBalance = (Number(balanceDue) || 0) > 0;
    const requiresCourseCompletion = COURSE_COMPLETION_UPGRADE_LEVELS.has(currentLevel);
    const completionVerified = !requiresCourseCompletion || Boolean(
      courseCompletion &&
      courseCompletion.level === currentLevel &&
      Number(courseCompletion.total) > 0
    );
    const awaitingReview = requiresCourseCompletion
      ? Math.max(Number(courseCompletion?.awaitingReview) || 0, 0)
      : 0;
    const courseCompleted =
      !requiresCourseCompletion ||
      (completionVerified && courseCompletion.courseWorkCompleted === true && awaitingReview === 0);

    if (hasOpenUpgrade) {
      return {
        currentLevel,
        nextLevel: queuedUpgradeLevel,
        canUpgrade: false,
        reason: t("accountSettings.upgrade.pending", { level: queuedUpgradeLevel }),
        completionVerified,
        courseCompleted,
        hasOutstandingBalance,
        requiresCourseCompletion,
        awaitingReview,
      };
    }

    if (!nextLevel) {
      return {
        currentLevel,
        nextLevel: null,
        canUpgrade: false,
        reason: t("accountSettings.upgrade.maxedOut"),
        completionVerified,
        courseCompleted,
        hasOutstandingBalance,
        requiresCourseCompletion,
        awaitingReview,
      };
    }

    if (requiresCourseCompletion && courseCompletionLoading) {
      return {
        currentLevel,
        nextLevel,
        canUpgrade: false,
        reason: "Checking your Course Book completion before upgrade.",
        completionVerified: false,
        courseCompleted: false,
        hasOutstandingBalance,
        requiresCourseCompletion,
        awaitingReview,
      };
    }

    if (requiresCourseCompletion && !completionVerified) {
      return {
        currentLevel,
        nextLevel,
        canUpgrade: false,
        reason: courseCompletionError
          ? "Falowen could not verify your Course Book completion. Refresh your progress and try again."
          : `Complete your ${currentLevel} Course Book before upgrading to ${nextLevel}.`,
        completionVerified: false,
        courseCompleted: false,
        hasOutstandingBalance,
        requiresCourseCompletion,
        awaitingReview,
      };
    }

    if (requiresCourseCompletion && !courseCompleted) {
      const reason = courseCompletion.courseWorkCompleted === true && awaitingReview > 0
        ? `${awaitingReview} assignment${awaitingReview === 1 ? "" : "s"} awaiting review. Upgrade opens after all required assignments have been reviewed.`
        : `Complete your ${currentLevel} Course Book first (${courseCompletion.completed}/${courseCompletion.total} required assignments complete).`;
      return {
        currentLevel,
        nextLevel,
        canUpgrade: false,
        reason,
        completionVerified: true,
        courseCompleted: false,
        hasOutstandingBalance,
        requiresCourseCompletion,
        awaitingReview,
      };
    }

    if (hasOutstandingBalance) {
      return {
        currentLevel,
        nextLevel,
        canUpgrade: false,
        reason: t("accountSettings.upgrade.clearBalance"),
        completionVerified: true,
        courseCompleted: true,
        hasOutstandingBalance: true,
        requiresCourseCompletion,
        awaitingReview,
      };
    }

    const nextTuitionFee = getTuitionFeeForLevel(nextLevel);

    return {
      currentLevel,
      nextLevel,
      nextTuitionFee,
      canUpgrade: true,
      reason: "",
      completionVerified: true,
      courseCompleted: true,
      hasOutstandingBalance: false,
      requiresCourseCompletion,
      awaitingReview,
    };
  }, [
    balanceDue,
    courseCompletion,
    courseCompletionError,
    courseCompletionLoading,
    hasOpenUpgrade,
    queuedUpgradeLevel,
    studentProfile?.level,
    t,
  ]);

  const postUpgradeAction = async (path, body = {}) => {
    if (!idToken) throw new Error("Your login session is missing. Please refresh and try again.");
    const studentCode = studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || user?.uid || "";
    if (!studentCode) throw new Error("Missing student code. Please re-login or contact support.");
    const response = await fetch(`/api/paystack/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ studentCode, ...body }),
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(json?.error || "Could not update the level upgrade.");
    await refreshStudentProfile();
  };

  const handleUpgradeToNextLevel = async () => {
    if (hasOpenUpgrade || !levelUpgrade?.canUpgrade || !levelUpgrade?.courseCompleted || !levelUpgrade?.nextLevel) return;
    setIsUpgradingLevel(true);
    setStatus("");
    try {
      const nextLevel = levelUpgrade.nextLevel;
      await postUpgradeAction("prepare-upgrade", { targetLevel: nextLevel });
      setStatus(`${nextLevel} upgrade prepared. Pay the full fee for a 6-month extension, or make a partial payment to start 1 month of temporary access.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t("accountSettings.upgrade.error"));
    } finally {
      setIsUpgradingLevel(false);
    }
  };

  const handleCancelQueuedUpgrade = async () => {
    if (upgradeStatus !== "awaiting_payment") return;
    setIsUpgradingLevel(true);
    setStatus("");
    try {
      await postUpgradeAction("cancel-upgrade");
      setStatus(t("accountSettings.upgrade.cancelled"));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t("accountSettings.upgrade.error"));
    } finally {
      setIsUpgradingLevel(false);
    }
  };

  if (!studentProfile) {
    return <div style={styles.card}>{t("accountSettings.noProfile")}</div>;
  }

  const supportMailTo = `mailto:info@falowen.app?subject=${encodeURIComponent(t("accountSettings.profile.supportSubject"))}&body=${encodeURIComponent(
    t("accountSettings.profile.supportBody", {
      name: studentProfile?.name || user?.displayName || "",
      email: studentProfile?.email || user?.email || "",
      studentCode: studentProfile?.studentCode || "",
    })
  )}`;
  const accessUntil =
    studentProfile?.contractEnd ||
    (Number.isFinite(trialLifecycle.endsAtMs) ? trialLifecycle.endsAtMs : null);

  const displayName = studentProfile?.name || user?.displayName || t("accountOverview.student");
  const initials = displayName.trim().split(/\s+/).slice(0, 2).map(word => word.charAt(0)).join("").toUpperCase();

  return (
    <div className="fw-account">
      <header className="fw-account-header">
        <small>Falowen Campus　/　{t("accountOverview.title")}</small>
        <h1>{t("accountOverview.myAccount", "My Falowen account")}</h1>
      </header>
      <div className="fw-account-layout">
      <aside className="fw-account-profile" aria-label={t("accountOverview.title")}>
        <div className="fw-account-identity">
          <span className="fw-account-avatar" aria-hidden="true">{initials}</span>
          <h2>{displayName}</h2>
          <p>{[studentProfile?.level, studentProfile?.className].filter(Boolean).join(" · ") || t("accountOverview.courseAccount")}</p>
          <span className="fw-account-pill" style={{color: accountAccess.tone, background: accountAccess.background}}>{accountAccess.label}</span>
        </div>
        <dl className="fw-account-meta">
          <dt>{t("accountOverview.studentCode")}</dt>
          <dd>{studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || "–"}</dd>
          <dt>{accountAccess.label === "Trial" ? t("accountOverview.trialAccess") : t("accountOverview.courseAccess")}</dt>
          <dd>{accountAccess.detail}</dd>
        </dl>
        <nav className="fw-account-nav" aria-label={t("accountOverview.title")}>
        {[
          { key: "studentData", label: t("accountSettings.tabs.studentData") },
          { key: "notifications", label: t("accountOverview.notifications") },
          { key: "billing", label: t("accountSettings.tabs.billing") },
          { key: "documents", label: "Documents" },
          { key: "upgrade", label: t("accountSettings.tabs.upgrade") },
          { key: "deleteAccount", label: t("accountOverview.deleteAccount") },
        ].filter(tab => tab.key !== "upgrade" || (!isSwahili && !isSecondaryCourse)).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => selectAccountTab(tab.key)}
            aria-current={activeTab === tab.key ? "page" : undefined}
          >
            {tab.label}<span aria-hidden="true">›</span>
          </button>
        ))}
        </nav>
      </aside>
      <div className="fw-account-content">
        {!isSecondaryCourse && studentProfile && (
          <p>Course type <strong>{getCourseType(studentProfile) === "exam_preparation" ? "Exam preparation" : "Full course"}</strong>{" "}
            <Link to="/mock/account">Manage course type</Link>
          </p>
        )}
      {activeTab === "studentData" ? (
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>{t("accountSettings.studentData.title")}</h2>
        <p style={styles.helperText}>{t("accountSettings.studentData.subtitle")}</p>
        <div style={{ ...styles.card, margin: "8px 0 10px" }}>
          <div style={styles.metaRow}><span>{t("accountSettings.studentData.fields.name")}</span><strong>{studentProfile?.name || user?.displayName || "–"}</strong></div>
          <div style={styles.metaRow}><span>{t("accountSettings.studentData.fields.phone")}</span><strong>{studentProfile?.phone || studentProfile?.phoneNumber || "–"}</strong></div>
          <div style={styles.metaRow}><span>{t("accountSettings.studentData.fields.email")}</span><strong>{studentProfile?.email || user?.email || "–"}</strong></div>
          <div style={styles.metaRow}><span>{t("accountSettings.studentData.fields.studentCode")}</span><strong>{studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || "–"}</strong></div>
          <div style={styles.metaRow}><span>{t("accountSettings.studentData.fields.className")}</span><strong>{studentProfile?.className || "–"}</strong></div>
          <div style={styles.metaRow}><span>{t("accountSettings.studentData.fields.level")}</span><strong>{studentProfile?.level || "–"}</strong></div>
          <div style={styles.metaRow}><span>{t("accountSettings.studentData.fields.location")}</span><strong>{studentProfile?.emailLocation || studentProfile?.location || studentProfile?.country || "–"}</strong></div>
        </div>

        <AdditionalProgrammeRequest />
        {studentProfile?.coursePlacementPending && <p role="status" style={{ color: "#92400e" }}>{t("enrollmentRequest.placementPending")}</p>}

        <h3 style={{ marginTop: 0 }}>{t("accountSettings.profile.title")}</h3>
        <p style={styles.helperText}>{t("accountSettings.profile.adminManaged")}</p>
        <a href={supportMailTo} style={{ ...styles.secondaryButton, display: "inline-block", textDecoration: "none", marginBottom: 10 }}>
          {t("accountSettings.profile.requestChange")}
        </a>
        <p style={{ ...styles.helperText, margin: 0 }}>
          {t("accountOverview.biographyNotice")}
        </p>
      </section>
      ) : null}

      {activeTab === "participation" ? (
        <section style={{ display: "grid", gap: 12 }} aria-label="Class Participation details">
          <div>
            <button type="button" style={styles.backTextLink} onClick={() => selectAccountTab("studentData")}>
              <span aria-hidden="true">←</span> Back to Student Data
            </button>
          </div>
          <ClassParticipationCard />
        </section>
      ) : null}

      {activeTab === "notifications" ? <NotificationSettingsCard /> : null}

      {activeTab === "billing" && isSecondaryCourse ? (
        <section style={{ ...styles.card, display: "grid", gap: 12, padding: 16 }} aria-label={t("enrollmentRequest.secondaryBillingTitle")}>
          <h2 style={styles.sectionTitle}>{t("enrollmentRequest.secondaryBillingTitle")}</h2>
          <p style={styles.helperText}>{t("enrollmentRequest.secondaryBillingNotice")}</p>
          {studentProfile?.coursePlacementPending ? (
            <p role="status">{t("enrollmentRequest.placementPending")}</p>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              <div style={styles.metaRow}><span>{t("accountOverview.tuition")}</span><strong>{studentProfile.tuitionFee == null ? "–" : formatMoney(studentProfile.tuitionFee)}</strong></div>
              <div style={styles.metaRow}><span>{t("accountOverview.paid")}</span><strong>{studentProfile.paid == null ? "–" : formatMoney(studentProfile.paid)}</strong></div>
              <div style={styles.metaRow}><span>{t("accountOverview.balance")}</span><strong>{studentProfile.balanceDue == null ? "–" : formatMoney(studentProfile.balanceDue)}</strong></div>
            </div>
          )}
          <a href={supportMailTo} style={{ ...styles.secondaryButton, display: "inline-block", width: "fit-content" }}>
            {t("accountSettings.profile.requestChange")}
          </a>
        </section>
      ) : activeTab === "billing" && isUniversityRegistration ? (
      <section data-university-course-billing style={{ ...styles.card, display: "grid", gap: 12, padding: 16 }}>
        <h2 style={{ ...styles.sectionTitle, marginBottom: 3 }}>University course access</h2>
        <strong>{hasComplimentaryAccess ? "Complimentary access · Approved" : "Registration awaiting verification"}</strong>
        <p style={{ margin: 0 }}>University of Hamburg · Kiswahili A1 · Instructor: Ruth</p>
        <p style={{ margin: 0 }}>{hasComplimentaryAccess
          ? "Your course access has been approved. There is no tuition payment or seven-day trial for this cohort."
          : "Your instructor will verify your eligibility. No payment details or tuition amount are required."}</p>
      </section>
      ) : activeTab === "billing" ? (
      <section className="fw-account-billing">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ ...styles.sectionTitle, marginBottom: 3 }}>{t("accountSettings.billing.title")}</h2>
            <p style={{ ...styles.helperText, margin: 0 }}>{t("accountOverview.billingIntro")}</p>
          </div>
          <button
            type="button"
            style={{ ...styles.secondaryButton, padding: "6px 9px", fontSize: 12, whiteSpace: "nowrap" }}
            onClick={handleRefreshPaymentStatus}
            disabled={isRefreshingPayment}
          >
            {isRefreshingPayment ? t("accountOverview.refreshing") : t("accountOverview.refresh")}
          </button>
        </div>

        <div className="fw-account-tuition" data-account-billing-summary>
          <header><span>{t("accountOverview.tuitionOverview", "Tuition overview")}</span><span className="fw-account-pill" style={{color: billingState.tone, background: billingState.background}}>{billingState.label}</span></header>
          <div className="fw-account-amounts">
            <div><span>{t("accountOverview.tuition")}</span><strong>{formatMoney(billingSummary.tuitionFee)}</strong>{usdBelow(billingSummary.tuitionFee)}</div>
            <div><span>{t("accountOverview.paid")}</span><strong>{formatMoney(paidAmount)}</strong>{usdBelow(paidAmount)}</div>
            <div><span>{t("accountOverview.balance")}</span><strong style={{color: balanceDue > 0 ? "#98451b" : "#20674c"}}>{formatMoney(balanceDue)}</strong>{usdBelow(balanceDue)}</div>
          </div>
        </div>
        <div className="fw-account-access">
          <small>{t("accountOverview.courseAccess")}</small>
          <strong>{accessUntil ? formatDate(accessUntil) : accountAccess.label}</strong>
          <span>{accountAccess.detail}</span>
        {studentProfile?.contractStart || studentProfile?.contractEnd ? (
          <details>
            <summary style={{ cursor: "pointer", fontWeight: 750, color: "#0f172a", fontSize: 14 }}>
              Course access details
            </summary>
            <div style={{ display: "grid", gap: 7, marginTop: 10 }}>
              {studentProfile?.contractStart ? (
                <div style={styles.metaRow}><span>Contract start</span><strong>{formatDate(studentProfile.contractStart)}</strong></div>
              ) : null}
              {studentProfile?.contractEnd ? (
                <div style={styles.metaRow}><span>Contract end</span><strong>{formatDate(studentProfile.contractEnd)}</strong></div>
              ) : null}
              {subscription.renewalDays !== null ? (
                <div style={styles.metaRow}>
                  <span>{t("accountSettings.billing.countdown")}</span>
                  <strong>
                    {subscription.renewalDays > 0
                      ? t("accountSettings.billing.inDays", { count: subscription.renewalDays })
                      : t("accountSettings.billing.dueNow")}
                  </strong>
                </div>
              ) : null}
              <div style={styles.metaRow}><span>Payment method</span><strong>{subscription.paymentMethod}</strong></div>
            </div>
          </details>
        ) : null}
        </div>
        {billingState.key !== "paid" ? (
          <div
            style={{
              border: `1px solid ${billingState.border}`,
              background: billingState.background,
              color: billingState.tone,
              borderRadius: 12,
              padding: "9px 11px",
            }}
          >
            <strong style={{ fontSize: 14 }}>
              {billingState.key === "trial"
                ? `Trial · ${trialLifecycle.daysRemaining} day${trialLifecycle.daysRemaining === 1 ? "" : "s"} remaining`
                : billingState.title}
            </strong>
            {billingState.key === "trial" ? null : (
              <p style={{ ...styles.helperText, margin: "3px 0 0", color: billingState.tone, lineHeight: 1.45 }}>
                {billingState.body}
              </p>
            )}
          </div>
        ) : null}

        {status ? (
          <div style={{ borderRadius: 10, padding: "9px 11px", background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: 13 }}>
            {status}
          </div>
        ) : null}

        {paymentAlert ? <div style={{ ...styles.errorBox, margin: 0 }}>{paymentAlert.message}</div> : null}

        {hasOutstandingTuition ? (
          <div style={{ display: "grid", gap: 7, borderTop: "1px solid #e2e8f0", paddingTop: 12 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 18 }}>Pay tuition</h3>
              <p style={{ ...styles.helperText, margin: "3px 0 0" }}>
                Pay all or part of your outstanding balance.
              </p>
            </div>
            <TuitionStatusCard
              level={studentProfile.level}
              paidAmount={paidAmount}
              balanceDue={balanceDue}
              tuitionFee={billingSummary.tuitionFee}
              checkoutAmountOverride={paidAmount > 0 ? undefined : studentProfile?.paymentIntentAmount}
              paymentActionLabel={
                billingState.key === "pending-attempt"
                  ? "Continue payment"
                  : billingState.key === "partial"
                    ? "Pay balance"
                    : undefined
              }
              description={
                billingState.key === "pending-attempt"
                  ? "Continue your unfinished checkout below."
                  : undefined
              }
              showSummary={false}
            />
          </div>
        ) : null}
        <details className="fw-account-history">
          <summary style={{ cursor: "pointer", fontWeight: 750, color: "#0f172a", fontSize: 14 }}>
            Transaction history{transactionHistory.length > 0 ? ` (${transactionHistory.length})` : ""}
          </summary>
          {transactionHistory.length === 0 ? (
            <p style={{ ...styles.helperText, margin: "8px 0 0" }}>{t("accountSettings.billing.transaction.empty")}</p>
          ) : (
            <div style={{ display: "grid", gap: 0, marginTop: 8 }}>
              {transactionHistory.map((tx, index) => (
                <div
                  key={tx.id}
                  style={{
                    padding: "9px 0",
                    borderTop: index === 0 ? "none" : "1px solid #e2e8f0",
                    display: "grid",
                    gap: 4,
                  }}
                >
                  <div style={styles.metaRow}><span>{tx.date}</span><strong style={{textAlign:"right"}}>{formatMoney(tx.amount)}{usdBelow(tx.amount)}</strong></div>
                  <div style={{ ...styles.metaRow, fontSize: 12 }}><span>{tx.channel}</span><span>{tx.status}</span></div>
                  <div style={{ ...styles.helperText, fontSize: 11, overflowWrap: "anywhere" }}>{tx.reference}</div>
                  {tx.receiptUrl ? <a href={tx.receiptUrl} target="_blank" rel="noreferrer">{t("accountSettings.billing.transaction.receipt")}</a> : null}
                </div>
              ))}
            </div>
          )}
        </details>
      </section>
      ) : null}

      {activeTab === "documents" ? <StudentDocumentsPanel user={user} studentProfile={studentProfile} /> : null}

      {activeTab === "deleteAccount" ? <AccountDeletionCard /> : null}
      {activeTab === "upgrade" ? (
      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div>
          <h2 style={{ ...styles.sectionTitle, marginBottom: 4 }}>{t("accountSettings.upgrade.title")}</h2>
          <p style={{ ...styles.helperText, margin: 0 }}>
            {levelUpgrade.requiresCourseCompletion
              ? "Your next level unlocks only after both your current Course Book and current tuition balance are complete."
              : "Your next level unlocks after your current tuition balance is cleared."}
          </p>
        </div>

        {hasOpenUpgrade ? (
          <>
            <p style={styles.helperText}>{levelUpgrade.reason}</p>
            {upgradeStatus === "pending" ? (
              <div style={{ ...styles.errorBox, background: "#eff6ff", borderColor: "#93c5fd", color: "#1e3a8a", marginBottom: 10 }}>
                <strong>1-month temporary {queuedUpgradeLevel} access is active.</strong>
                <p style={{ ...styles.helperText, margin: "4px 0 0", color: "#1e3a8a" }}>
                  Complete the remaining {formatMoney(upgradeBalanceDue)} by {formatDate(studentProfile?.upgradeGraceEnd)}. Additional partial payments do not restart the one-month period.
                </p>
              </div>
            ) : null}
            {upgradeStatus === "expired" ? (
              <div style={{ ...styles.errorBox, marginBottom: 10 }}>
                Temporary access has ended. A partial payment now reduces the balance but does not grant another month. Full payment reactivates {queuedUpgradeLevel} and adds 6 months.
              </div>
            ) : null}
            {upgradeStatus === "awaiting_payment" ? (
              <div style={{ ...styles.card, margin: "0 0 10px", background: "#f8fafc" }}>
                <strong>No access has changed yet.</strong>
                <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
                  Full payment immediately activates {queuedUpgradeLevel} and adds 6 months. A partial payment starts one month of temporary {queuedUpgradeLevel} access.
                </p>
              </div>
            ) : null}

            <TuitionStatusCard
              level={queuedUpgradeLevel}
              paidAmount={Math.max(Number(studentProfile?.upgradePaid || 0) || 0, 0)}
              balanceDue={upgradeBalanceDue}
              tuitionFee={Math.max(Number(studentProfile?.upgradeTuitionFee || getTuitionFeeForLevel(queuedUpgradeLevel)) || 0, 0)}
              checkoutAmountOverride={upgradeBalanceDue}
              paymentPurpose="level_upgrade"
              title={`${queuedUpgradeLevel} upgrade payment`}
              description={`Remaining upgrade balance. Your previous paid contract stays protected until this upgrade is fully paid.`}
            />

            {upgradeStatus === "awaiting_payment" ? (
              <button
                type="button"
                style={{ ...styles.secondaryButton, marginTop: 8 }}
                onClick={handleCancelQueuedUpgrade}
                disabled={isUpgradingLevel}
              >
                {t("accountSettings.upgrade.cancel")}
              </button>
            ) : null}
            {status ? <p style={{ ...styles.helperText, marginTop: 8 }}>{status}</p> : null}
          </>
        ) : levelUpgrade.nextLevel ? (
          <>
            <div
              data-upgrade-eligibility
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gap: 8,
              }}
            >
              {levelUpgrade.requiresCourseCompletion ? (
                <div
                  style={{
                    ...styles.card,
                    margin: 0,
                    background: levelUpgrade.courseCompleted ? "#f0fdf4" : "#fff7ed",
                    borderColor: levelUpgrade.courseCompleted ? "#86efac" : "#fdba74",
                  }}
                >
                  <span style={{ ...styles.helperText, fontSize: 12 }}>Course Book</span>
                  <strong style={{ color: levelUpgrade.courseCompleted ? "#166534" : "#9a3412" }}>
                    {courseCompletionLoading
                      ? "Checking…"
                      : levelUpgrade.courseCompleted
                        ? "Complete"
                        : levelUpgrade.awaitingReview > 0
                          ? `${levelUpgrade.awaitingReview} awaiting review`
                          : courseCompletion?.total
                            ? `${courseCompletion.completed}/${courseCompletion.total} complete`
                            : "Not verified"}
                  </strong>
                </div>
              ) : null}

              <div
                style={{
                  ...styles.card,
                  margin: 0,
                  background: levelUpgrade.hasOutstandingBalance ? "#fff7ed" : "#f0fdf4",
                  borderColor: levelUpgrade.hasOutstandingBalance ? "#fdba74" : "#86efac",
                }}
              >
                <span style={{ ...styles.helperText, fontSize: 12 }}>Current balance</span>
                <strong style={{ color: levelUpgrade.hasOutstandingBalance ? "#9a3412" : "#166534" }}>
                  {levelUpgrade.hasOutstandingBalance ? formatMoney(balanceDue) : "Cleared"}{levelUpgrade.hasOutstandingBalance ? usdBelow(balanceDue) : null}
                </strong>
              </div>
            </div>

            <p style={{ ...styles.helperText, margin: 0 }}>
              {t("accountSettings.upgrade.description", {
                currentLevel: levelUpgrade.currentLevel,
                nextLevel: levelUpgrade.nextLevel,
                amount: `${formatMoney(levelUpgrade.nextTuitionFee || getTuitionFeeForLevel(levelUpgrade.nextLevel))}${approximateUsd(levelUpgrade.nextTuitionFee || getTuitionFeeForLevel(levelUpgrade.nextLevel), fxQuote) ? ` (≈ ${approximateUsd(levelUpgrade.nextTuitionFee || getTuitionFeeForLevel(levelUpgrade.nextLevel), fxQuote)} USD)` : ""}`,
              })}
            </p>

            {levelUpgrade.reason ? (
              <div
                style={{
                  borderRadius: 12,
                  padding: 12,
                  border: "1px solid #fdba74",
                  background: "#fff7ed",
                  color: "#9a3412",
                }}
              >
                <strong>{levelUpgrade.reason}</strong>
                {levelUpgrade.requiresCourseCompletion && !courseCompletionLoading && !levelUpgrade.courseCompleted ? (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                    <button
                      type="button"
                      style={styles.secondaryButton}
                      onClick={() => navigate("/campus/course")}
                    >
                      Continue Course Book
                    </button>
                    {courseCompletionError || !levelUpgrade.completionVerified ? (
                      <button
                        type="button"
                        style={styles.secondaryButton}
                        onClick={refreshCourseCompletion}
                      >
                        Refresh progress
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            <button
              type="button"
              style={styles.primaryButton}
              onClick={handleUpgradeToNextLevel}
              disabled={!levelUpgrade.canUpgrade || isUpgradingLevel || courseCompletionLoading}
            >
              {isUpgradingLevel
                ? t("accountSettings.upgrade.upgrading")
                : t("accountSettings.upgrade.button", { nextLevel: levelUpgrade.nextLevel })}
            </button>

            {status ? <p style={{ ...styles.helperText, margin: 0 }}>{status}</p> : null}
          </>
        ) : (
          <p style={styles.helperText}>{levelUpgrade.reason}</p>
        )}
      </section>
      ) : null}
      </div>
      </div>
    </div>
  );
};

export default AccountSettings;
