// functions/functionz/studentsSheet.js
"use strict";

const { getSheetsClient } = require("./googleSheetsClient");

/**
 * Header-aware upsert into your Students Google Sheet.
 * - Reads row 1 for headers
 * - Finds existing row by StudentCode (preferred), else by uid/email
 * - Updates ONLY the matching cells (safe for Apps Script + formulas)
 * - Appends a new row if not found
 *
 * ENV expected:
 * - STUDENTS_SHEET_ID
 * - STUDENTS_SHEET_TAB (default: "students")
 * - GOOGLE_SERVICE_ACCOUNT_JSON (recommended, JSON string)
 *    OR GOOGLE_SERVICE_ACCOUNT_JSON_B64 (base64 of JSON string)
 */

function normalizeHeader(h) {
  return String(h || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[_-]+/g, " ");
}

function colToA1(colIdx0) {
  // 0 => A, 25 => Z, 26 => AA
  let n = colIdx0 + 1;
  let s = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

async function loadHeaderMap(sheets, sheetId, tabName) {
  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!1:1`,
  });

  const headers = (headerRes.data.values && headerRes.data.values[0]) || [];
  const headerMap = new Map(); // normalized header -> colIdx0

  headers.forEach((h, idx) => {
    const key = normalizeHeader(h);
    if (key) headerMap.set(key, idx);
  });

  return { headers, headerMap };
}

function findCol(headerMap, ...candidates) {
  for (const c of candidates) {
    const idx = headerMap.get(normalizeHeader(c));
    if (idx !== undefined) return idx;
  }
  return null;
}

async function getColumnValues(sheets, sheetId, tabName, colIdx0) {
  const colA1 = colToA1(colIdx0);
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!${colA1}2:${colA1}`,
  });

  const values = res.data.values || [];
  // values is [["x"],["y"]...]
  return values.map((r) => (r && r[0] ? String(r[0]).trim() : ""));
}

async function upsertStudentToSheet(student) {
  const sheetId = process.env.STUDENTS_SHEET_ID;
  const tabName = process.env.STUDENTS_SHEET_TAB || "students";

  if (!sheetId) throw new Error("Missing STUDENTS_SHEET_ID env var.");

  const sheets = await getSheetsClient();
  const { headerMap } = await loadHeaderMap(sheets, sheetId, tabName);

  // Find important columns by header names (supports variations)
  const colStudentCode = findCol(headerMap, "StudentCode", "Student Code", "studentcode");
  const colUid = findCol(headerMap, "uid", "UID");
  const colEmail = findCol(headerMap, "Email", "email");
  const colName = findCol(headerMap, "Name", "name");
  const colPhone = findCol(headerMap, "Phone", "phone");
  const colLocation = findCol(headerMap, "Location", "location");
  const colLevel = findCol(headerMap, "Level", "level");
  const colClassName = findCol(headerMap, "ClassName", "Class Name", "classname");
  const colStatus = findCol(headerMap, "Status", "status");
  const colEnrollDate = findCol(headerMap, "EnrollDate", "Enroll Date", "enrolldate");

  if (colStudentCode === null) {
    throw new Error("Students sheet is missing a StudentCode column header.");
  }

  // Build indexes to locate existing rows (only by columns that exist)
  const studentCodes = await getColumnValues(sheets, sheetId, tabName, colStudentCode);

  let uids = [];
  if (colUid !== null) uids = await getColumnValues(sheets, sheetId, tabName, colUid);

  let emails = [];
  if (colEmail !== null) emails = await getColumnValues(sheets, sheetId, tabName, colEmail);

  // Row number in sheet (1-based; row 1 is header). Data rows start at row 2.
  const targetStudentCode = String(student.studentCode || "").trim();
  const targetUid = String(student.uid || "").trim();
  const targetEmail = String(student.email || "").trim();

  let rowIndex0 = -1; // data index in arrays (0 means sheet row 2)
  if (targetStudentCode) {
    rowIndex0 = studentCodes.findIndex((v) => v === targetStudentCode);
  }
  if (rowIndex0 === -1 && targetUid && uids.length) {
    rowIndex0 = uids.findIndex((v) => v === targetUid);
  }
  if (rowIndex0 === -1 && targetEmail && emails.length) {
    rowIndex0 = emails.findIndex((v) => v.toLowerCase() === targetEmail.toLowerCase());
  }

  const sheetRowNumber = rowIndex0 >= 0 ? rowIndex0 + 2 : null;

  // Prepare cell updates (ONLY update columns that exist)
  const updates = [];
  function pushCell(colIdx0, value) {
    if (colIdx0 === null || colIdx0 === undefined) return;
    const colA1 = colToA1(colIdx0);
    const a1 = `${tabName}!${colA1}${sheetRowNumber}`;
    updates.push({ range: a1, values: [[value]] });
  }

  if (sheetRowNumber) {
    // Update existing row safely
    pushCell(colStudentCode, targetStudentCode || "");
    pushCell(colUid, targetUid || "");
    pushCell(colEmail, targetEmail || "");
    pushCell(colName, student.name || "");
    pushCell(colPhone, student.phone || "");
    pushCell(colLocation, student.location || "");
    pushCell(colLevel, student.level || "");
    pushCell(colClassName, student.className || "");
    pushCell(colStatus, student.status || "");
    pushCell(colEnrollDate, student.enrollDate || "");

    if (updates.length) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          valueInputOption: "USER_ENTERED",
          data: updates,
        },
      });
    }

    return { action: "updated", row: sheetRowNumber };
  }

  // Append new row: create an array aligned to header length
  // Note: we only fill known columns; everything else stays empty.
  const maxCol = Math.max(...Array.from(headerMap.values()));
  const row = Array(maxCol + 1).fill("");

  row[colStudentCode] = targetStudentCode || "";
  if (colUid !== null) row[colUid] = targetUid || "";
  if (colEmail !== null) row[colEmail] = targetEmail || "";
  if (colName !== null) row[colName] = student.name || "";
  if (colPhone !== null) row[colPhone] = student.phone || "";
  if (colLocation !== null) row[colLocation] = student.location || "";
  if (colLevel !== null) row[colLevel] = student.level || "";
  if (colClassName !== null) row[colClassName] = student.className || "";
  if (colStatus !== null) row[colStatus] = student.status || "";
  if (colEnrollDate !== null) row[colEnrollDate] = student.enrollDate || "";

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${tabName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });

  return { action: "appended" };
}

module.exports = {
  upsertStudentToSheet,
  // Kept for backwards compatibility with existing imports
  appendStudentToStudentsSheetSafely: upsertStudentToSheet,
};
