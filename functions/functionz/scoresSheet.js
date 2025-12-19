const { getSheetsClient } = require("./googleSheetsClient");

function normalizeHeader(h) {
  return String(h || "").trim().toLowerCase();
}

async function getScoresForStudent(studentCode) {
  const SHEET_ID = process.env.SHEETS_SCORES_ID;
  const TAB = process.env.SHEETS_SCORES_TAB || "scores_backup";
  if (!SHEET_ID) throw new Error("Missing env SHEETS_SCORES_ID");

  const sheets = await getSheetsClient();

  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A:Z`
  });

  const values = resp.data.values || [];
  if (values.length < 2) return [];

  const header = values[0].map(normalizeHeader);
  const rows = values.slice(1);

  const idxStudentCode = header.indexOf("studentcode");
  const idxName = header.indexOf("name");
  const idxAssignment = header.indexOf("assignment");
  const idxScore = header.indexOf("score");
  const idxComments = header.indexOf("comments");
  const idxDate = header.indexOf("date");
  const idxLevel = header.indexOf("level");
  const idxLink = header.indexOf("link");

  if (idxStudentCode === -1) throw new Error("Scores sheet missing 'studentcode' column");

  const target = String(studentCode).trim().toLowerCase();

  const out = [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const sc = String(r[idxStudentCode] || "").trim().toLowerCase();
    if (!sc || sc !== target) continue;

    out.push({
      studentcode: r[idxStudentCode] || "",
      name: idxName !== -1 ? (r[idxName] || "") : "",
      assignment: idxAssignment !== -1 ? (r[idxAssignment] || "") : "",
      score: idxScore !== -1 ? Number(r[idxScore] || 0) : 0,
      comments: idxComments !== -1 ? (r[idxComments] || "") : "",
      date: idxDate !== -1 ? (r[idxDate] || "") : "",
      level: idxLevel !== -1 ? (r[idxLevel] || "") : "",
      link: idxLink !== -1 ? (r[idxLink] || "") : ""
    });
  }

  return out;
}

module.exports = { getScoresForStudent };
