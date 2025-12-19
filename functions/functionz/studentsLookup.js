const { getSheetsClient } = require("./googleSheetsClient");

const normHeader = (h) =>
  String(h || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const normVal = (v) => String(v || "").trim().toLowerCase();

async function getStudentCodeByEmail(email) {
  const SHEET_ID = process.env.STUDENTS_SHEET_ID;
  const TAB = process.env.STUDENTS_SHEET_TAB || "students";
  if (!SHEET_ID) throw new Error("Missing STUDENTS_SHEET_ID");

  const targetEmail = normVal(email);
  if (!targetEmail) return null;

  const sheets = await getSheetsClient();
  const r = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A:Z`,
  });

  const values = r.data.values || [];
  if (values.length < 2) return null;

  const headers = values[0].map(normHeader);
  const rows = values.slice(1);

  const idxEmail = headers.indexOf("email");
  const idxStudentCode = headers.indexOf("studentcode");
  if (idxEmail === -1) throw new Error("Students sheet missing Email column");
  if (idxStudentCode === -1) throw new Error("Students sheet missing StudentCode column");

  for (const row of rows) {
    if (normVal(row[idxEmail]) === targetEmail) {
      return String(row[idxStudentCode] || "").trim() || null;
    }
  }
  return null;
}

module.exports = { getStudentCodeByEmail };
