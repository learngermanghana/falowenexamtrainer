const { getSheetsClient } = require("./googleSheetsClient");

function normalizeHeader(h) {
  return String(h || "").trim().toLowerCase();
}

function colToA1(colIndexZeroBased) {
  let n = colIndexZeroBased + 1;
  let s = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

async function readHeaderRow(sheets, sheetId, tab) {
  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tab}!1:1`
  });

  const header = (resp.data.values && resp.data.values[0]) || [];
  if (!header.length) throw new Error(`No header row found in ${tab}`);
  return header;
}

async function readColumnValues(sheets, sheetId, tab, colIndex) {
  const colLetter = colToA1(colIndex);
  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tab}!${colLetter}:${colLetter}`
  });
  const values = resp.data.values || [];
  // values includes header in row 1
  return values.map((r) => (r && r[0] ? String(r[0]).trim() : ""));
}

async function updateSingleCell(sheets, sheetId, tab, rowNumber1Based, colIndex0Based, value) {
  const colLetter = colToA1(colIndex0Based);
  const range = `${tab}!${colLetter}${rowNumber1Based}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range,
    valueInputOption: "RAW",
    requestBody: { values: [[value]] }
  });
}

async function appendRow(sheets, sheetId, tab, row) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${tab}!A1`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] }
  });
}

async function appendStudentToStudentsSheetSafely(student) {
  const SHEET_ID = process.env.SHEETS_STUDENTS_ID; // your students sheet id
  const TAB = process.env.SHEETS_STUDENTS_TAB || "students";

  if (!SHEET_ID) throw new Error("Missing env SHEETS_STUDENTS_ID");

  const sheets = await getSheetsClient();
  const header = await readHeaderRow(sheets, SHEET_ID, TAB);

  // Build lookup
  const headerNorm = header.map(normalizeHeader);
  const idxStudentCode = headerNorm.indexOf("studentcode");
  const idxUid = headerNorm.indexOf("uid");

  // Dedupe: if StudentCode exists, update UID only (if possible), else skip append
  if (idxStudentCode !== -1) {
    const colValues = await readColumnValues(sheets, SHEET_ID, TAB, idxStudentCode);
    const existingRowIndex = colValues.findIndex(
      (v, i) => i > 0 && v && v.toLowerCase() === String(student.studentCode || student.studentcode || "").toLowerCase()
    );

    if (existingRowIndex !== -1) {
      // row number is index + 1
      const rowNumber = existingRowIndex + 1;

      // If uid column exists and we have uid, update it (safe)
      if (idxUid !== -1 && student.uid) {
        await updateSingleCell(sheets, SHEET_ID, TAB, rowNumber, idxUid, String(student.uid));
      }
      return;
    }
  }

  // Map fields based on header names ONLY (prevents extra columns)
  const row = header.map((h) => {
    const key = normalizeHeader(h);

    // match your sheet headers
    if (key === "name") return student.name || "";
    if (key === "phone") return student.phone || "";
    if (key === "location") return student.location || "";
    if (key === "level") return student.level || "";
    if (key === "studentcode") return student.studentCode || student.studentcode || "";
    if (key === "email") return student.email || "";
    if (key === "classname") return student.className || student.classname || "";
    if (key === "uid") return student.uid || "";

    // keep existing automation columns untouched
    return "";
  });

  await appendRow(sheets, SHEET_ID, TAB, row);
}

module.exports = { appendStudentToStudentsSheetSafely };
