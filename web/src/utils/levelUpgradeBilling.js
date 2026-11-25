const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const cents = value => typeof value === "number" && Number.isFinite(value) && value >= 0 && Number.isSafeInteger(Math.round(value * 100)) && Math.abs(value * 100 - Math.round(value * 100)) < 0.000001 ? Math.round(value * 100) : null;

export function verifiedLevelBalance(row) {
  const fee = cents(row?.tuitionFee), paid = cents(row?.paid), balance = cents(row?.balanceDue);
  return fee !== null && paid !== null && balance !== null && fee === paid + balance ? balance / 100 : null;
}

export function managedUpgradeState(profile, rows) {
  const ordered = [...rows].sort((a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level));
  const granted = profile?.grantedEnrollmentLevels || [];
  const blocked = profile?.blockedEnrollmentLevels || [];
  const currentLevel = String(profile?.paidLevel || profile?.level || "").toUpperCase();
  // Revision access alone does not make an expired historical contract current.
  const activePaid = ordered.filter(row => granted.includes(row.level) && !blocked.includes(row.level) &&
    ["active", "completed"].includes(row.status) && verifiedLevelBalance(row) === 0 &&
    row.contractEnd >= new Date().toISOString().slice(0, 10));
  const current = activePaid[activePaid.length - 1] || ordered.find(row => row.level === currentLevel);
  const base = current?.level || currentLevel;
  const nextLevel = LEVELS[LEVELS.indexOf(base) + 1];
  const next = ordered.find(row => row.level === nextLevel);
  const legacyOpen = ["awaiting_payment", "pending", "expired"].includes(String(profile?.upgradeStatus || "").toLowerCase());
  const legacyTarget = legacyOpen ? String(profile?.upgradeToLevel || "").toUpperCase() : "";
  const overlap = !!legacyTarget && ordered.some(row => row.level === legacyTarget);
  return {current, next, nextLevel, legacyOpen, legacyTarget, overlap, granted, blocked};
}

export function legacyUpgradeOverlap(profile, row) {
  return ["awaiting_payment", "pending", "expired"].includes(String(profile?.upgradeStatus || "").toLowerCase()) &&
    String(profile?.upgradeToLevel || "").toUpperCase() === row?.level;
}
