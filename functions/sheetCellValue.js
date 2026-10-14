"use strict";

// Sheets Values API accepts scalar cells, never Firestore Timestamp objects.
function sheetCellValue(value) {
  if (value == null) return "";
  if (typeof value?.toDate === "function") return sheetCellValue(value.toDate());
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? "" : value.toISOString();
  if (typeof value === "object") {
    const seconds = value.seconds ?? value._seconds;
    const nanos = value.nanoseconds ?? value._nanoseconds ?? 0;
    if (Number.isFinite(seconds) && Number.isFinite(nanos)) {
      return sheetCellValue(new Date(seconds * 1000 + Math.floor(nanos / 1000000)));
    }
    return JSON.stringify(value);
  }
  return value;
}
module.exports = { sheetCellValue };
