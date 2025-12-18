const { getSheetsClient } = require("./googleSheetsClient");

function normalizeHeader(h) {
  return String(h || "").trim().toLowerCase();
}

const normalizeValue = (value) => String(value || "").trim().toLowerCase();

async function getScoresForStudent({ studentCode, email, level } = {}) {
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
  const idxEmail = header.indexOf("email");

  if (idxStudentCode === -1) throw new Error("Scores sheet missing 'studentcode' column");

  const targetCode = normalizeValue(studentCode);
  const targetEmail = normalizeValue(email);
  const targetLevel = normalizeValue(level);

  const out = [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const sc = normalizeValue(r[idxStudentCode]);
    if (targetCode && sc !== targetCode) continue;
    const rowEmail = idxEmail !== -1 ? normalizeValue(r[idxEmail]) : "";
    if (targetEmail && (!rowEmail || rowEmail !== targetEmail)) continue;
    const rowLevel = idxLevel !== -1 ? normalizeValue(r[idxLevel]) : "";
    if (targetLevel && targetLevel !== "all" && rowLevel !== targetLevel) continue;

    out.push({
      studentcode: r[idxStudentCode] || "",
      email: idxEmail !== -1 ? (r[idxEmail] || "") : "",
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
