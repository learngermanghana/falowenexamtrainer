import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { computeTuitionStatus } from "../data/levelFees";
import { isPaymentsEnabled } from "../lib/featureFlags";
import { useAuth } from "../context/AuthContext";
import { getBackendUrl } from "../services/backendUrl";

const MIN_INSTALLMENT_GHS = 1000;

const formatMoney = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "–";
  return `GH₵${numeric.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const clampNumber = (value, { min = 0, max = Number.POSITIVE_INFINITY } = {}) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.min(Math.max(numeric, min), max);
};

/**
 * TuitionStatusCard
 * - shows tuition fee, paid so far, balance.
 * - lets students choose how much to pay now.
 * - enforces: minimum GH₵1000 unless they're paying the final remaining balance.
 * - calls backend /paystack/initialize so Paystack receives clear metadata (paid so far, balance, plan).
 */
const TuitionStatusCard = ({
  level,
  paidAmount,
  balanceDue,
  tuitionFee,
  showPaymentAction = true,
  title = "Balance & tuition",
  description,
  checkoutAmountOverride,
}) => {
  const paymentsEnabled = isPaymentsEnabled();
  const { idToken, studentProfile, user } = useAuth();

  const summary = useMemo(
    () =>
      computeTuitionStatus({
        level,
        paidAmount,
        tuitionFee,
        balanceDue,
      }),
    [balanceDue, level, paidAmount, tuitionFee]
  );

  const maxPayable = Math.max(Number(summary.balanceDue) || 0, 0);
  const defaultAmount =
    checkoutAmountOverride !== undefined && checkoutAmountOverride !== null
      ? clampNumber(checkoutAmountOverride, { min: 0, max: maxPayable })
      : clampNumber(studentProfile?.paymentIntentAmount ?? maxPayable, { min: 0, max: maxPayable });

  const [amountText, setAmountText] = useState(defaultAmount ? String(defaultAmount) : "");
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    // Keep the input in sync when the profile updates (e.g., after webhook).
    const nextDefault = defaultAmount ? String(defaultAmount) : "";
    setAmountText(nextDefault);
  }, [defaultAmount]);

  const amountNow = useMemo(() => {
    if (!amountText) return 0;
    const numericOnly = String(amountText).replace(/[^0-9]/g, "");
    return clampNumber(numericOnly, { min: 0, max: maxPayable });
  }, [amountText, maxPayable]);

  const paidSoFar = Math.max(Number(summary.paidAmount) || 0, 0);
  const tuitionTotal = Math.max(Number(summary.tuitionFee) || 0, 0);
  const projectedTotalPaid = paidSoFar + amountNow;

  const isFinalPayment = maxPayable > 0 && Math.abs(amountNow - maxPayable) < 0.5;
  const meetsMinimum = amountNow >= MIN_INSTALLMENT_GHS || isFinalPayment;
  const willClearTuition = tuitionTotal > 0 && projectedTotalPaid >= tuitionTotal;
  const accessAfterPayment = willClearTuition ? "6 months" : "1 month";

  const amountHelper = useMemo(() => {
    if (maxPayable <= 0) return "No balance due.";
    if (!amountNow) return `Enter an amount (min GH₵${MIN_INSTALLMENT_GHS}, or pay the remaining balance).`;
    if (!meetsMinimum) {
      return `Minimum is GH₵${MIN_INSTALLMENT_GHS} unless you're paying the remaining ${formatMoney(maxPayable)}.`;
    }
    const remaining = Math.max(maxPayable - amountNow, 0);
    return `After this payment: access for ${accessAfterPayment}. Remaining balance: ${formatMoney(remaining)}.`;
  }, [accessAfterPayment, amountNow, maxPayable, meetsMinimum]);

  const canPay = paymentsEnabled && maxPayable > 0 && amountNow > 0 && meetsMinimum && Boolean(idToken);

  const startPayment = async () => {
    setPaymentError("");

    const studentCode =
      studentProfile?.studentCode ||
      studentProfile?.studentcode ||
      studentProfile?.id ||
      user?.uid ||
      "";

    if (!studentCode) {
      setPaymentError("Missing student code. Please re-login or contact support.");
      return;
    }

    if (!idToken) {
      setPaymentError("Your login session is missing. Please refresh and try again.");
      return;
    }

    setIsStartingPayment(true);
    try {
      const res = await fetch(`${getBackendUrl()}/paystack/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          studentCode,
          amount: amountNow,
          redirectUrl: `${window.location.origin}/payment-complete`,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || "Could not start the payment.");
      }

      const url = json?.authorization_url;
      if (!url) {
        throw new Error("Paystack did not return a payment link.");
      }

      window.location.assign(url);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not start the payment.";
      setPaymentError(message);
    } finally {
      setIsStartingPayment(false);
    }
  };

  return (
    <div style={{ ...styles.card, margin: 0 }} data-testid="tuition-status-card">
      <div style={styles.metaRow}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span style={styles.badge}>{summary.statusLabel}</span>
      </div>

      {description ? <p style={{ ...styles.helperText, margin: "6px 0 0" }}>{description}</p> : null}

      <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
        <div style={styles.metaRow}>
          <span>Tuition</span>
          <strong>{formatMoney(summary.tuitionFee)}</strong>
        </div>
        <div style={styles.metaRow}>
          <span>Paid so far</span>
          <strong>{formatMoney(summary.paidAmount)}</strong>
        </div>
        <div style={styles.metaRow}>
          <span>Balance remaining</span>
          <strong>{formatMoney(summary.balanceDue)}</strong>
        </div>
      </div>

      {paymentsEnabled && showPaymentAction ? (
        <div style={{ marginTop: 12 }}>
          <label style={{ ...styles.label, marginBottom: 6 }}>Amount to pay now</label>
          <input
            type="text"
            inputMode="numeric"
            value={amountText}
            onChange={(e) => {
              setPaymentError("");
              setAmountText(e.target.value);
            }}
            style={{ ...styles.textArea, minHeight: "auto", height: 44 }}
            placeholder={`Min GH₵${MIN_INSTALLMENT_GHS} (or pay remaining)`}
          />
          <p style={{ ...styles.helperText, margin: "6px 0 0" }}>{amountHelper}</p>

          <button
            type="button"
            style={{ ...styles.primaryButton, marginTop: 10 }}
            onClick={startPayment}
            disabled={!canPay || isStartingPayment}
          >
            {isStartingPayment ? "Opening Paystack ..." : "Pay tuition online"}
          </button>

          {paymentError ? (
            <div style={{ ...styles.errorBox, marginTop: 10 }}>{paymentError}</div>
          ) : null}
        </div>
      ) : (
        <div
          style={{
            ...styles.errorBox,
            background: "#f1f5f9",
            borderColor: "#cbd5e1",
            color: "#0f172a",
            marginTop: 12,
          }}
        >
          <strong>Payments are only available on the web app.</strong>
          <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
            Use the website to view or pay your tuition through the secure payment portal. Payments are hidden in the Android app.
          </p>
        </div>
      )}
    </div>
  );
};

export default TuitionStatusCard;
