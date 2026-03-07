import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { styles } from "../styles";
import { correctBiography } from "../services/profileService";
import TuitionStatusCard from "./TuitionStatusCard";
import { isPaymentsEnabled } from "../lib/featureFlags";
import { toDate, toDateMs } from "../lib/dateUtils";
import { hasClearedBalance, normalizePaymentStatus } from "../lib/paymentStatus";
import { formatCurrency } from "../lib/formatters";
import { getNextLevel, getTuitionFeeForLevel } from "../data/levelFees";

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
  const { showToast } = useToast();
  const { i18n, t } = useTranslation();
  const locale = i18n.language;
  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const formatMoney = useCallback(
    (value) => formatCurrency(value, { locale, maximumFractionDigits: 2 }),
    [locale]
  );
  const paymentsEnabled = isPaymentsEnabled();
  const [profile, setProfile] = useState({ biography: "" });
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCorrectingBio, setIsCorrectingBio] = useState(false);
  const [isUpgradingLevel, setIsUpgradingLevel] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);

  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      biography: studentProfile?.biography || "",
    }));
  }, [studentProfile, user]);

  const billingSummary = useMemo(() => {
    const paid = Math.max(Number(studentProfile?.paid ?? studentProfile?.initialPaymentAmount ?? 0) || 0, 0);
    const tuition = Math.max(Number(studentProfile?.tuitionFee ?? getTuitionFeeForLevel(studentProfile?.level)) || 0, 0);
    const explicitBalanceRaw = studentProfile?.balanceDue ?? studentProfile?.balance;
    const explicitBalance = explicitBalanceRaw === undefined || explicitBalanceRaw === null
      ? null
      : Math.max(Number(explicitBalanceRaw) || 0, 0);
    const derivedBalance = Math.max(tuition - paid, 0);
    const balanceDue = explicitBalance === null ? derivedBalance : Math.min(explicitBalance, derivedBalance);
    return { paidAmount: paid, tuitionFee: tuition, balanceDue };
  }, [studentProfile]);

  const paidAmount = billingSummary.paidAmount;
  const balanceDue = billingSummary.balanceDue;

  const transactionHistory = useMemo(() => {
    const candidates = [
      ...(Array.isArray(studentProfile?.payments) ? studentProfile.payments : []),
      ...(Array.isArray(studentProfile?.paymentHistory) ? studentProfile.paymentHistory : []),
      ...(Array.isArray(studentProfile?.transactions) ? studentProfile.transactions : []),
    ];

    return candidates
      .map((entry, index) => {
        const amount = Number(entry?.amount ?? entry?.paidAmount ?? 0) || 0;
        return {
          id: entry?.id || entry?.reference || `tx-${index}`,
          date: formatDate(entry?.date || entry?.paidAt || entry?.createdAt),
          amount,
          channel: entry?.channel || entry?.provider || "Paystack",
          reference: entry?.reference || entry?.transactionReference || "—",
          status: entry?.status || t("accountSettings.billing.transaction.statusCompleted"),
          receiptUrl: entry?.receiptUrl || entry?.receipt || entry?.receiptLink || "",
        };
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
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

  const levelUpgrade = useMemo(() => {
    const currentLevel = String(studentProfile?.level || "").toUpperCase();
    const nextLevel = getNextLevel(currentLevel);

    if (!nextLevel) {
      return {
        currentLevel,
        nextLevel: null,
        canUpgrade: false,
        reason: t("accountSettings.upgrade.maxedOut"),
      };
    }

    const hasOutstandingBalance = (Number(balanceDue) || 0) > 0;
    if (hasOutstandingBalance) {
      return {
        currentLevel,
        nextLevel,
        canUpgrade: false,
        reason: t("accountSettings.upgrade.clearBalance"),
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
  }, [balanceDue, studentProfile?.level, t]);

  const handleUpgradeToNextLevel = async () => {
    if (!levelUpgrade?.canUpgrade || !levelUpgrade?.nextLevel) return;

    setIsUpgradingLevel(true);
    setStatus("");

    try {
      const nextLevel = levelUpgrade.nextLevel;
      const nextTuitionFee = levelUpgrade.nextTuitionFee || 0;

      await saveStudentProfile({
        level: nextLevel,
        className: "",
        paid: 0,
        initialPaymentAmount: 0,
        paymentIntentAmount: nextTuitionFee,
        tuitionFee: nextTuitionFee,
        balanceDue: nextTuitionFee,
        paymentStatus: "pending",
        contractTermMonths: null,
        contractStart: "",
        contractEnd: "",
      });

      setStatus(t("accountSettings.upgrade.success", { level: nextLevel }));
    } catch (error) {
      const message = error instanceof Error ? error.message : t("accountSettings.upgrade.error");
      setStatus(message);
    } finally {
      setIsUpgradingLevel(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus("");

    saveStudentProfile({ biography: profile.biography.trim() })
      .then(() => {
        setLastSavedAt(new Date());
        showToast(t("accountSettings.profile.bioSaved"), "success");
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : t("accountSettings.profile.bioError");
        setStatus(message);
        showToast(message, "error");
      })
      .finally(() => setIsSaving(false));
  };

  const handleCorrectBiography = async () => {
    const draft = profile.biography || "";
    if (!draft.trim()) {
      setStatus(t("accountSettings.profile.bioEmpty"));
      return;
    }

    setIsCorrectingBio(true);
    setStatus("");

    try {
      const { corrected } = await correctBiography({ text: draft, level: studentProfile?.level, idToken });
      if (corrected) {
        setProfile((prev) => ({ ...prev, biography: corrected }));
        showToast(t("accountSettings.profile.bioAiApplied"), "success");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : t("accountSettings.profile.bioCorrectError");
      setStatus(message);
      showToast(message, "error");
    } finally {
      setIsCorrectingBio(false);
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

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>{t("accountSettings.overview.title")}</h2>
        <p style={styles.helperText}>{t("accountSettings.overview.subtitle")}</p>
        <p style={styles.helperText}>{t("accountSettings.overview.renewal", { date: subscription.renewalDate })}</p>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>{t("accountSettings.profile.title")}</h2>
        <p style={styles.helperText}>{t("accountSettings.profile.adminManaged")}</p>
        <a href={supportMailTo} style={{ ...styles.secondaryButton, display: "inline-block", textDecoration: "none", marginBottom: 10 }}>
          {t("accountSettings.profile.requestChange")}
        </a>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          <label style={styles.label} htmlFor="biography">{t("accountSettings.profile.biographyLabel")}</label>
          <textarea
            id="biography"
            style={styles.textArea}
            value={profile.biography}
            onChange={(event) => setProfile((prev) => ({ ...prev, biography: event.target.value }))}
            placeholder={t("accountSettings.profile.biographyPlaceholder")}
          />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button type="button" style={styles.secondaryButton} onClick={handleCorrectBiography} disabled={isCorrectingBio}>
              {isCorrectingBio ? t("accountSettings.profile.correcting") : t("accountSettings.profile.correctCta")}
            </button>
            <button type="submit" style={styles.primaryButton} disabled={isSaving}>
              {isSaving ? t("accountSettings.profile.saving") : t("accountSettings.profile.save")}
            </button>
          </div>
          {lastSavedAt ? (
            <p style={{ ...styles.helperText, margin: 0 }}>
              {t("accountSettings.profile.lastSaved", { time: lastSavedAt.toLocaleString(locale) })}
            </p>
          ) : null}
          {status ? <div style={styles.errorBox}>{status}</div> : null}
        </form>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>{t("accountSettings.billing.title")}</h2>
        <p style={styles.helperText}>{t("accountSettings.billing.subtitle")}</p>
        {paymentAlert ? <div style={styles.errorBox}>{paymentAlert.message}</div> : null}
        <div style={{ ...styles.card, margin: "8px 0 0" }}>
          <div style={styles.metaRow}><span>{t("accountSettings.billing.nextRenewal")}</span><strong>{subscription.renewalDate}</strong></div>
          <div style={styles.metaRow}><span>{t("accountSettings.billing.countdown")}</span><strong>{subscription.renewalDays > 0 ? t("accountSettings.billing.inDays", { count: subscription.renewalDays }) : t("accountSettings.billing.dueNow")}</strong></div>
          <div style={styles.metaRow}><span>{t("accountSettings.billing.renewalMode")}</span><strong>{subscription.autoRenew ? t("accountSettings.billing.autoRenew") : t("accountSettings.billing.manualRenew")}</strong></div>
          <p style={{ ...styles.helperText, marginTop: 8 }}>{t("accountSettings.billing.policySummary")}</p>
        </div>

        <TuitionStatusCard
          level={studentProfile.level}
          paidAmount={paidAmount}
          balanceDue={balanceDue}
          tuitionFee={billingSummary.tuitionFee}
          checkoutAmountOverride={paidAmount > 0 ? undefined : studentProfile?.paymentIntentAmount}
          title={t("accountSettings.billing.balanceTitle")}
          description={t("accountSettings.billing.email", { email: subscription.invoiceEmail || t("accountSettings.billing.addEmail") })}
        />

        <div style={{ ...styles.card, marginTop: 12 }}>
          <h3 style={{ marginTop: 0 }}>{t("accountSettings.billing.transaction.title")}</h3>
          {transactionHistory.length === 0 ? (
            <p style={styles.helperText}>{t("accountSettings.billing.transaction.empty")}</p>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {transactionHistory.map((tx) => (
                <div key={tx.id} style={{ ...styles.card, margin: 0, background: "#f8fafc" }}>
                  <div style={styles.metaRow}><span>{tx.date}</span><strong>{formatMoney(tx.amount)}</strong></div>
                  <div style={styles.metaRow}><span>{t("accountSettings.billing.transaction.channel")}</span><span>{tx.channel}</span></div>
                  <div style={styles.metaRow}><span>{t("accountSettings.billing.transaction.reference")}</span><span>{tx.reference}</span></div>
                  <div style={styles.metaRow}><span>{t("accountSettings.billing.transaction.status")}</span><span>{tx.status}</span></div>
                  {tx.receiptUrl ? <a href={tx.receiptUrl} target="_blank" rel="noreferrer">{t("accountSettings.billing.transaction.receipt")}</a> : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>{t("accountSettings.upgrade.title")}</h2>
        {levelUpgrade.nextLevel ? (
          <>
            <p style={styles.helperText}>{t("accountSettings.upgrade.description", { currentLevel: levelUpgrade.currentLevel, nextLevel: levelUpgrade.nextLevel, amount: formatMoney(levelUpgrade.nextTuitionFee || 0) })}</p>
            <button type="button" style={styles.primaryButton} onClick={handleUpgradeToNextLevel} disabled={!levelUpgrade.canUpgrade || isUpgradingLevel}>
              {isUpgradingLevel ? t("accountSettings.upgrade.upgrading") : t("accountSettings.upgrade.button", { nextLevel: levelUpgrade.nextLevel })}
            </button>
            {levelUpgrade.reason ? <p style={{ ...styles.helperText, color: "#92400e" }}>{levelUpgrade.reason}</p> : null}
          </>
        ) : (
          <p style={styles.helperText}>{levelUpgrade.reason}</p>
        )}
      </section>
    </div>
  );
};

export default AccountSettings;
