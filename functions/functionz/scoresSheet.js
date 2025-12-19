const { getSheetsClient } = require("./googleSheetsClient");

const normHeader = (h) =>
  String(h || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const normVal = (v) => String(v || "").trim().toLowerCase();

async function getScoresByStudentCode(studentCode) {
  const SHEET_ID = process.env.SCORES_SHEET_ID || process.env.SHEETS_SCORES_ID;
  const TAB = process.env.SCORES_SHEET_TAB || process.env.SHEETS_SCORES_TAB || "scores_backup";
  if (!SHEET_ID) throw new Error("Missing SCORES_SHEET_ID");

  const sheets = await getSheetsClient();
  const r = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A:Z`,
  });

  const values = r.data.values || [];
  if (values.length < 2) return [];

  const headers = values[0].map(normHeader);
  const rows = values.slice(1);

  const idxStudentCode = headers.indexOf("studentcode");
  if (idxStudentCode === -1) {
    throw new Error("Scores sheet missing StudentCode column (header should be StudentCode/studentcode)");
  }

  const idxName = headers.indexOf("name");
  const idxAssignment = headers.indexOf("assignment");
  const idxScore = headers.indexOf("score");
  const idxComments = headers.indexOf("comments");
  const idxDate = headers.indexOf("date");
  const idxLevel = headers.indexOf("level");
  const idxLink = headers.indexOf("link");

  const target = normVal(studentCode);
  return rows
    .filter((row) => normVal(row[idxStudentCode]) === target)
    .map((row, i) => ({
      id: `${studentCode}-${i + 1}-${row[idxDate] || ""}`,
      studentCode: row[idxStudentCode] || "",
      name: idxName !== -1 ? (row[idxName] || "") : "",
      assignment: idxAssignment !== -1 ? (row[idxAssignment] || "") : "",
      score: idxScore !== -1 ? Number(row[idxScore] || 0) : undefined,
      comments: idxComments !== -1 ? (row[idxComments] || "") : "",
      date: idxDate !== -1 ? (row[idxDate] || "") : "",
      level: idxLevel !== -1 ? (row[idxLevel] || "") : "",
      link: idxLink !== -1 ? (row[idxLink] || "") : "",
    }));
}

module.exports = { getScoresByStudentCode };
