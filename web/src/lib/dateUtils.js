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
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
};

export const toDateMs = (value) => {
  const date = toDate(value);
  return date ? date.getTime() : NaN;
};
