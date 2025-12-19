const { getSheetsClient } = require("./googleSheetsClient");

const normalizeHeaderKey = (header, index) => {
  const normalized = String(header || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

  if (normalized) return normalized;
  return `col_${index}`;
};

async function getSheetContent(sheetId, tabName) {
  if (!sheetId) {
    throw new Error("sheetId is required");
  }

  const sheets = await getSheetsClient();
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!A:Z`,
  });

  const values = result.data.values || [];
  if (!values.length) return [];

  const header = values[0].map(normalizeHeaderKey);
  const rows = values.slice(1);

  return rows
    .map((row, rowIndex) => {
      const entry = { _row: rowIndex + 2 };

      header.forEach((key, idx) => {
        entry[key] = typeof row[idx] !== "undefined" ? row[idx] : "";
      });

      if (!entry.id) {
        entry.id = `${entry._row}-${Object.values(entry).join("-")}`;
      }

      return entry;
    })
    .filter((row) => Object.values(row).some((value) => String(value || "").trim()));
}

module.exports = { getSheetContent };
