import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";
import { correctBiography } from "../services/profileService";
import TuitionStatusCard from "./TuitionStatusCard";
import { isPaymentsEnabled } from "../lib/featureFlags";
import { toDate, toDateMs } from "../lib/dateUtils";
import { hasClearedBalance, normalizePaymentStatus } from "../lib/paymentStatus";
import { formatCurrency } from "../lib/formatters";
import {
  defaultPaymentIntentForTuition,
  getNextLevel,
  getTuitionFeeForLevel,
  MIN_INSTALLMENT_GHS,
} from "../data/levelFees";

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

const AccountSettings = () => {
  const { user, studentProfile, idToken, saveStudentProfile } = useAuth();
  const { i18n, t } = useTranslation();
  const locale = i18n.language;
  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const formatMoney = useCallback(
    (value) => formatCurrency(value, { locale, maximumFractionDigits: 2 }),
    [locale]
  );
  const paymentsEnabled = isPaymentsEnabled();
  const [profile, setProfile] = useState({
    biography: "",
  });
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCorrectingBio, setIsCorrectingBio] = useState(false);
  const [isUpgradingLevel, setIsUpgradingLevel] = useState(false);

  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      biography: studentProfile?.biography || "",
    }));
  }, [studentProfile, user]);

  const paidAmount = useMemo(() => {
    const paid = studentProfile?.paid ?? studentProfile?.initialPaymentAmount ?? 0;
    return Math.max(Number(paid) || 0, 0);
  }, [studentProfile?.initialPaymentAmount, studentProfile?.paid]);

  const balanceDue = useMemo(() => {
    const balance = studentProfile?.balanceDue ?? studentProfile?.balance;
    if (balance === null || balance === undefined) return undefined;
    return Math.max(Number(balance) || 0, 0);
  }, [studentProfile?.balance, studentProfile?.balanceDue]);

  const subscription = useMemo(() => {
    const contractEnd = studentProfile?.contractEnd ? toDate(studentProfile.contractEnd) : null;
    const isActive = contractEnd && !Number.isNaN(contractEnd.getTime()) && contractEnd.getTime() > Date.now();
    const contractMonths = Number(studentProfile?.contractTermMonths) || null;
    const paymentStatus = normalizePaymentStatus(studentProfile?.paymentStatus);
    const balanceCleared = hasClearedBalance(balanceDue);
    const hasPaid = paymentStatus === "paid" || balanceCleared;

    const plan =
      contractMonths === 6
        ? "6-month contract"
        : contractMonths === 1
        ? "1-month access"
        : hasPaid
        ? "6-month contract"
        : paymentStatus === "partial"
        ? "1-month access"
        : "Payment required";

    return {
      plan,
      renewalDate: formatDate(studentProfile?.contractEnd),
      status: isActive ? "Active" : "Pending",
      seats: 1,
      paymentMethod: paymentsEnabled ? "Paystack" : "Web portal",
      invoiceEmail: studentProfile?.email || user?.email || "",
    };
  }, [
    paymentsEnabled,
    studentProfile?.contractEnd,
    studentProfile?.contractTermMonths,
    studentProfile?.paymentStatus,
    balanceDue,
    studentProfile?.email,
    user?.email,
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
      balanceDue,
      daysLeft,
      message:
        daysLeft === 0
          ? `Your access ends today and you still owe ${formatMoney(balanceDue)}. Please make a payment to keep access.`
          : `You still owe ${formatMoney(balanceDue)} and have ${daysLabel} left. Please make a payment to keep access.`,
    };
  }, [balanceDue, formatMoney, numberFormatter, studentProfile?.contractEnd, t]);

  const activeContractInfo = useMemo(() => {
    const contractEndMs = toDateMs(studentProfile?.contractEnd);
    const hasActiveContract = Number.isFinite(contractEndMs) && contractEndMs > Date.now();

    return {
      hasActiveContract,
      contractEnd: studentProfile?.contractEnd || "",
      contractEndLabel: formatDate(studentProfile?.contractEnd),
    };
  }, [studentProfile?.contractEnd]);

  const levelUpgrade = useMemo(() => {
    const currentLevel = String(studentProfile?.level || "").toUpperCase();
    const nextLevel = getNextLevel(currentLevel);

    if (!nextLevel) {
      return {
        currentLevel,
        nextLevel: null,
        canUpgrade: false,
        reason: "You're already at the highest available level.",
      };
    }

    const hasOutstandingBalance = (Number(balanceDue) || 0) > 0;
    if (hasOutstandingBalance) {
      return {
        currentLevel,
        nextLevel,
        canUpgrade: false,
        reason: "Clear your current balance before moving to the next level.",
      };
    }

    const nextTuitionFee = getTuitionFeeForLevel(nextLevel);

    return {
      currentLevel,
      nextLevel,
      nextTuitionFee,
      canUpgrade: true,
      reason: "",
    };
  }, [balanceDue, studentProfile?.level]);

  const handleUpgradeToNextLevel = async () => {
    if (!levelUpgrade?.canUpgrade || !levelUpgrade?.nextLevel) return;

    setIsUpgradingLevel(true);
    setStatus("");

    try {
      const nextLevel = levelUpgrade.nextLevel;
      const nextTuitionFee = levelUpgrade.nextTuitionFee || 0;
      const defaultPaymentIntent = defaultPaymentIntentForTuition(nextTuitionFee);

      const upgradePayload = {
        level: nextLevel,
        className: "",
        paid: 0,
        initialPaymentAmount: 0,
        paymentIntentAmount: defaultPaymentIntent,
        tuitionFee: nextTuitionFee,
        balanceDue: nextTuitionFee,
        paymentStatus: "pending",
        upgradeFromLevel: levelUpgrade.currentLevel,
        upgradeToLevel: nextLevel,
        upgradeQueuedAt: new Date().toISOString(),
      };

      if (activeContractInfo.hasActiveContract) {
        upgradePayload.contractMergeMode = "append_after_active_contract";
        upgradePayload.upgradeCarryoverUntil = activeContractInfo.contractEnd;
      } else {
        upgradePayload.contractMergeMode = "start_after_payment";
        upgradePayload.contractTermMonths = null;
        upgradePayload.contractStart = "";
        upgradePayload.contractEnd = "";
      }

      await saveStudentProfile(upgradePayload);

      const statusMessage = activeContractInfo.hasActiveContract
        ? `You're now on ${nextLevel}. Your current contract stays active until ${activeContractInfo.contractEndLabel}; the new level contract will append after that once payment is confirmed.`
        : `You're now on ${nextLevel}. Please complete payment to unlock access.`;
      setStatus(statusMessage);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not upgrade level.";
      setStatus(message);
    } finally {
      setIsUpgradingLevel(false);
    }
  };

  const handleChange = (field) => (event) => {
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));
    setStatus("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      biography: profile.biography.trim(),
    };

    setIsSaving(true);
    setStatus("");

    saveStudentProfile(payload)
      .then(() => {
        setStatus("Profile saved. Your classmates can now read your bio.");
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Could not save profile.";
        setStatus(message);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleCorrectBiography = async () => {
    const draft = profile.biography || "";
    if (!draft.trim()) {
      setStatus("Please add a short bio before asking the AI to correct it.");
      return;
    }

    setIsCorrectingBio(true);
    setStatus("");

    try {
      const { corrected } = await correctBiography({ text: draft, level: studentProfile?.level, idToken });
      if (corrected) {
        setProfile((prev) => ({ ...prev, biography: corrected }));
        setStatus("AI suggestions applied to your bio.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not correct your biography.";
      setStatus(message);
    } finally {
      setIsCorrectingBio(false);
    }
  };

  if (!studentProfile) {
    return (
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h2 style={styles.sectionTitle}>Account &amp; Billing</h2>
          <span style={styles.badge}>No profile data</span>
        </div>
        <p style={{ ...styles.helperText, margin: 0 }}>
          We couldn't find any account data for this login. Once your campus profile syncs, we'll show contracts,
          payments, and billing details here.
        </p>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Please contact your instructor or try again later.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h2 style={styles.sectionTitle}>Account overview</h2>
          <span style={styles.levelPill}>{studentProfile.className || "No course"}</span>
        </div>
        <p style={styles.helperText}>Quick view of your key info.</p>

        <div
          style={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <div style={{ ...styles.card, margin: 0, background: "#f8fafc" }}>
            <div style={styles.metaRow}>
              <span>Student code</span>
              <span style={styles.badge}>{studentProfile.status || "–"}</span>
            </div>
            <strong style={{ fontSize: 20 }}>{studentProfile.studentCode}</strong>
          </div>

          <div style={{ ...styles.card, margin: 0, background: "#f8fafc" }}>
            <div style={styles.metaRow}>
              <span>Course</span>
              <span style={styles.badge}>{studentProfile.level || "–"}</span>
            </div>
            <strong style={{ fontSize: 16 }}>{studentProfile.className || "(no class selected)"}</strong>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
              Next renewal: <strong>{subscription.renewalDate}</strong>
            </p>
          </div>

          <div style={{ ...styles.card, margin: 0, background: "#ecfdf3", border: "1px solid #34d399" }}>
            <div style={styles.metaRow}>
              <span>Contact</span>
              <span style={styles.badge}>current</span>
            </div>
            <strong style={{ fontSize: 16 }}>{studentProfile.phone || "(no number)"}</strong>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
              {studentProfile.location || "(location unknown)"}
            </p>
          </div>
        </div>
      </section>

      <section style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h2 style={styles.sectionTitle}>Account settings</h2>
          <span style={styles.badge}>Profile &amp; communication</span>
        </div>
        <p style={styles.helperText}>
          Your name and login email are managed by Falowen to keep linked apps in sync. Contact support to update them.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          <div style={{
            ...styles.card,
            margin: 0,
            padding: 12,
            background: "#f8fafc",
            borderColor: "#e2e8f0",
          }}>
            <div style={styles.metaRow}>
              <span>Display name</span>
              <span style={styles.badge}>read-only</span>
            </div>
            <strong style={{ fontSize: 16 }}>{studentProfile?.name || user?.displayName || "Unknown"}</strong>
            <div style={{ ...styles.metaRow, marginTop: 8 }}>
              <span>Login email</span>
              <span style={styles.badge}>managed by admin</span>
            </div>
            <strong style={{ fontSize: 16 }}>{studentProfile?.email || user?.email || "(no email)"}</strong>
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="biography">
              Class biography
            </label>
            <textarea
              id="biography"
              style={styles.textArea}
              value={profile.biography}
              onChange={handleChange("biography")}
              placeholder="Write 2-4 sentences about your work, goals, or hobbies. Classmates will see this on the member page."
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6, flexWrap: "wrap" }}>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={handleCorrectBiography}
                disabled={isCorrectingBio}
              >
                {isCorrectingBio ? "AI is polishing ..." : "Correct with AI"}
              </button>
              <button type="submit" style={styles.primaryButton} disabled={isSaving}>
                {isSaving ? "Saving ..." : "Save changes"}
              </button>
            </div>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
              Your bio is read-only on the member page. Edit it here anytime.
            </p>
          </div>
          {status && (
            <div style={{ ...styles.errorBox, background: "#ecfdf3", color: "#065f46", borderColor: "#34d399" }}>
              {status}
            </div>
          )}
        </form>
      </section>

      <section style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h2 style={styles.sectionTitle}>Subscription &amp; billing</h2>
          <span style={styles.levelPill}>{subscription.status}</span>
        </div>
        <p style={styles.helperText}>Essential billing info at a glance.</p>
        {paymentAlert ? <div style={styles.errorBox}>{paymentAlert.message}</div> : null}

        <div style={{ ...styles.gridTwo, gap: 10 }}>
          <div style={{ ...styles.card, margin: 0 }}>
            <div style={styles.metaRow}>
              <h3 style={{ margin: 0 }}>{subscription.plan}</h3>
              <span style={styles.badge}>Seat: {subscription.seats}</span>
            </div>
            <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
              <div style={styles.metaRow}>
                <span>Next renewal</span>
                <strong>{subscription.renewalDate}</strong>
              </div>
              <div style={styles.metaRow}>
                <span>Payment</span>
                <strong>{studentProfile.paymentStatus || "pending"}</strong>
              </div>
            </div>
          </div>

          <div style={{ ...styles.card, margin: 0, background: "#f8fafc", borderColor: "#e2e8f0" }}>
            <div style={styles.metaRow}>
              <h3 style={{ margin: 0 }}>Level progression</h3>
              <span style={styles.badge}>{levelUpgrade.currentLevel || "No level"}</span>
            </div>
            {levelUpgrade.nextLevel ? (
              <>
                <p style={{ ...styles.helperText, margin: "8px 0 0" }}>
                  Completed {levelUpgrade.currentLevel}? Move to <strong>{levelUpgrade.nextLevel}</strong>.
                  Next level tuition: <strong>{formatMoney(levelUpgrade.nextTuitionFee || 0)}</strong>.
                  Minimum first payment is <strong>{formatMoney(MIN_INSTALLMENT_GHS)}</strong> (or the full remaining balance if lower). You can also pay the full next-level tuition immediately.
                </p>
                {activeContractInfo.hasActiveContract ? (
                  <p style={{ ...styles.helperText, margin: "8px 0 0", color: "#1e3a8a" }}>
                    Contract merge: your current contract remains active until <strong>{activeContractInfo.contractEndLabel}</strong>.
                    After payment for {levelUpgrade.nextLevel}, the next contract should be appended after this date (no contract time is lost).
                  </p>
                ) : null}
                <button
                  type="button"
                  style={{ ...styles.primaryButton, marginTop: 10 }}
                  onClick={handleUpgradeToNextLevel}
                  disabled={!levelUpgrade.canUpgrade || isUpgradingLevel}
                >
                  {isUpgradingLevel ? "Upgrading ..." : `Upgrade to ${levelUpgrade.nextLevel}`}
                </button>
              </>
            ) : (
              <p style={{ ...styles.helperText, margin: "8px 0 0" }}>{levelUpgrade.reason}</p>
            )}
            {levelUpgrade.reason && levelUpgrade.nextLevel ? (
              <p style={{ ...styles.helperText, margin: "8px 0 0", color: "#92400e" }}>
                {levelUpgrade.reason}
              </p>
            ) : null}
          </div>

          <TuitionStatusCard
            level={studentProfile.level}
            paidAmount={paidAmount}
            balanceDue={balanceDue}
            tuitionFee={studentProfile.tuitionFee}
            checkoutAmountOverride={
              paidAmount > 0
                ? undefined
                : studentProfile?.paymentIntentAmount
            }
            title="Balance & tuition"
            description={`Billing email: ${subscription.invoiceEmail || "add an email"}`}
          />
        </div>
      </section>
    </div>
  );
};

export default AccountSettings;
