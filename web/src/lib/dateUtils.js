const parseSlashDate = (raw) => {
  if (!raw) return null;
  const match = String(raw).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (!day || !month || !year) return null;
  const parsed = new Date(year, month - 1, day);
  if (Number.isNaN(parsed.getTime())) return null;
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
    return null;
  }
  return parsed;
};

const parseShortSlashDate = (raw, yearOverride) => {
  if (!raw) return null;
  const match = String(raw).trim().match(/^(\d{1,2})[/-](\d{1,2})$/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number.isFinite(yearOverride) ? yearOverride : new Date().getFullYear();
  if (!day || !month || !year) return null;
  const parsed = new Date(year, month - 1, day);
  if (Number.isNaN(parsed.getTime())) return null;
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
    return null;
  }
  return parsed;
};

export const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "object" && typeof value.toDate === "function") {
    const fromTimestamp = value.toDate();
    if (fromTimestamp instanceof Date && !Number.isNaN(fromTimestamp.getTime())) {
      return fromTimestamp;
    }
  }
  if (typeof value === "string" || typeof value === "number") {
    const slashDate = parseSlashDate(value);
    if (slashDate) return slashDate;
    if (typeof value === "string") {
      const shortSlashDate = parseShortSlashDate(value);
      if (shortSlashDate) return shortSlashDate;
    }
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
};

export const toDateMs = (value) => {
  const date = toDate(value);
  return date ? date.getTime() : NaN;
};
