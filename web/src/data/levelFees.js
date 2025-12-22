export const LEVEL_FEES = {
  // Customize each CEFR level's tuition here.
  // These amounts are used at signup to set the student's tuitionFee and balance.
  A1: 2800,
  A2: 3000,
  B1: 3000,
  B2: 3000,
};

export const getTuitionFeeForLevel = (level) => LEVEL_FEES[level] ?? 0;

const DEFAULT_PAYSTACK_LINK = "https://paystack.com/pay/falowen";

const normalizeLevelKey = (level) =>
  (level || "")
    .toString()
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_");

export const paystackLinkForLevel = (level) => {
  const normalizedLevel = normalizeLevelKey(level);
  const levelSpecificLink = normalizedLevel ? process.env[`REACT_APP_PAYSTACK_LINK_${normalizedLevel}`] : undefined;

  if (levelSpecificLink) {
    return levelSpecificLink;
  }

  return process.env.REACT_APP_PAYSTACK_LINK || DEFAULT_PAYSTACK_LINK;
};

export const computeTuitionStatus = ({ level, paidAmount = 0, tuitionFee, balanceDue }) => {
  const normalizedPaid = Math.max(Number(paidAmount) || 0, 0);
  const computedTuitionFee =
    typeof tuitionFee === "number" ? tuitionFee : getTuitionFeeForLevel(level);

  const computedBalance =
    typeof balanceDue === "number"
      ? Math.max(balanceDue, 0)
      : Math.max(computedTuitionFee - normalizedPaid, 0);

  let statusLabel = "Pending";
  if (computedTuitionFee > 0 && normalizedPaid >= computedTuitionFee) {
    statusLabel = "Paid";
  } else if (normalizedPaid > 0 && computedBalance > 0) {
    statusLabel = "Partial";
  }

  const statusCopy =
    statusLabel === "Paid"
      ? "Full tuition received"
      : statusLabel === "Partial"
      ? "Partial tuition received"
      : "Awaiting payment";

  return {
    tuitionFee: computedTuitionFee,
    paidAmount: normalizedPaid,
    balanceDue: computedBalance,
    statusLabel,
    statusCopy,
    paystackLink: paystackLinkForLevel(level),
  };
};
