export const normalizePaymentStatus = (status) => {
  const normalized = String(status || "pending").toLowerCase();
  if (normalized === "active") return "paid";
  return normalized;
};

export const hasClearedBalance = (balanceDue) => {
  if (balanceDue === null || balanceDue === undefined) return false;
  const numeric = Number(balanceDue);
  if (!Number.isFinite(numeric)) return false;
  return numeric <= 0;
};
