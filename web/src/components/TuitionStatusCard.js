import React from "react";
import { styles } from "../styles";
import { computeTuitionStatus, paystackLinkForLevel } from "../data/levelFees";
import { isPaymentsEnabled } from "../lib/featureFlags";
import { buildPaystackCheckoutLink } from "../lib/paystack";

const STATUS_TONES = {
  Paid: { background: "#ecfdf3", borderColor: "#22c55e", color: "#166534" },
  Partial: { background: "#fffbeb", borderColor: "#f59e0b", color: "#92400e" },
  Pending: { background: "#fef2f2", borderColor: "#fca5a5", color: "#991b1b" },
};

const metaValueStyle = { fontWeight: 800, color: "#0f172a" };

const TuitionStatusCard = ({
  level,
  paidAmount = 0,
  balanceDue,
  tuitionFee,
  paystackLink,
  title = "Tuition & payments",
  description,
}) => {
  const summary = computeTuitionStatus({ level, paidAmount, tuitionFee, balanceDue });
  const tone = STATUS_TONES[summary.statusLabel] || STATUS_TONES.Pending;
  const levelCopy = level ? `${level} level` : "your level";
  const helper =
    description ||
    `${summary.statusCopy}. ${summary.tuitionFee ? `Tuition for ${levelCopy} is GH₵${summary.tuitionFee}.` : "Tuition not set yet."}`;
  const checkoutLink = paystackLink || paystackLinkForLevel(level);
  const checkoutAmount = summary.balanceDue || summary.paidAmount || summary.tuitionFee;
  const redirectUrl = `${window.location.origin}/payment-complete`;
  const checkoutLinkWithParams = buildPaystackCheckoutLink({
    baseLink: checkoutLink,
    amount: checkoutAmount,
    redirectUrl,
  });
  const paymentsEnabled = isPaymentsEnabled();

  return (
    <div style={{ ...styles.card, margin: 0 }} data-testid="tuition-status-card">
      <div style={{ ...styles.metaRow, margin: "0 0 8px 0" }}>
        <div>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <p style={{ ...styles.helperText, margin: "4px 0 0" }}>{helper}</p>
        </div>
        <span style={{ ...styles.badge, ...tone, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            aria-hidden
            style={{ width: 8, height: 8, borderRadius: 999, background: tone.color, display: "inline-block" }}
          />
          {summary.statusLabel}
        </span>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={styles.metaRow}>
          <span>Tuition</span>
          <span style={metaValueStyle}>{summary.tuitionFee ? `GH₵${summary.tuitionFee}` : "–"}</span>
        </div>
        <div style={styles.metaRow}>
          <span>Paid so far</span>
          <span style={metaValueStyle}>{summary.paidAmount ? `GH₵${summary.paidAmount}` : "GH₵0"}</span>
        </div>
        <div style={styles.metaRow}>
          <span>Balance remaining</span>
          <span style={metaValueStyle}>{summary.balanceDue ? `GH₵${summary.balanceDue}` : "GH₵0"}</span>
        </div>
        {paymentsEnabled ? (
          <a
            href={checkoutLinkWithParams}
            target="_blank"
            rel="noreferrer"
            style={{
              ...styles.primaryButton,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            Pay tuition online
          </a>
        ) : (
          <div
            style={{
              ...styles.errorBox,
              background: "#f1f5f9",
              borderColor: "#cbd5e1",
              color: "#0f172a",
            }}
          >
            <strong>Payments are only available on the web app.</strong>
            <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
              Please sign in from the website to complete your tuition payment through our secure portal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TuitionStatusCard;
