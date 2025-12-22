const { google } = require("googleapis");

const SHEET_ID = process.env.STUDENTS_SHEET_ID;
const TAB = process.env.STUDENTS_SHEET_TAB || "student";

function getServiceAccount() {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64;
  if (!b64) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON_B64");
  return JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
}

// ✅ Strong normalization: handles "Daily Limit", "Daily_Limit", "daily-limit", etc.
function normalizeHeader(h) {
  return String(h || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "") // remove spaces/underscores/hyphens
    .replace(/[()]/g, "");  // remove parentheses
}

function colToA1(colIdx0) {
  let n = colIdx0 + 1;
  let s = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

async function getSheets() {
  const sa = getServiceAccount();
  const auth = new google.auth.JWT({
    email: sa.client_email,
    key: sa.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
    if (!SHEET_ID) return res.status(500).json({ error: "Missing STUDENTS_SHEET_ID" });

    const student = req.body || {};
    const studentCode = String(student.studentCode || student.StudentCode || "").trim();
    const uid = String(student.uid || student.UID || "").trim();
    const email = String(student.email || student.Email || "").trim();

    if (!studentCode && !uid && !email) {
      return res.status(400).json({ error: "Provide studentCode or uid or email" });
    }

    const sheets = await getSheets();

    // Read header row
    const headerRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${TAB}!1:1`,
    });

    const headers = (headerRes.data.values && headerRes.data.values[0]) || [];

    // Map normalizedHeader -> columnIndex
    const headerIndex = new Map();
    headers.forEach((h, i) => headerIndex.set(normalizeHeader(h), i));

    // Helper: find a column by trying multiple aliases
    function findCol(...aliases) {
      for (const a of aliases) {
        const col = headerIndex.get(normalizeHeader(a));
        if (col !== undefined) return col;
      }
      return undefined;
    }

    // ✅ Column resolution with aliases (backwards compatible)
    const COL = {
      StudentCode: findCol("StudentCode", "Student Code"),
      UID: findCol("UID"),
      Email: findCol("Email"),
      Name: findCol("Name"),
      Phone: findCol("Phone"),
      Location: findCol("Location"),
      Level: findCol("Level"),
      Paid: findCol("Paid", "InitialPayment", "Initial Payment"),
      Balance: findCol("Balance", "BalanceDue", "Balance Due"),
      ContractStart: findCol("ContractStart", "Contract Start"),
      ContractEnd: findCol("ContractEnd", "Contract End"),
      EmergencyPhone: findCol(
        "Emergency Contact (Phone Number)",
        "Emergency Contact Phone",
        "Emergency Contact"
      ),
      Status: findCol("Status"),
      EnrollDate: findCol("EnrollDate", "Enroll Date"),
      ClassName: findCol("ClassName", "Class Name"),
      Daily_Limit: findCol("Daily_Limit", "Daily Limit", "DailyLimit"),
    };

    if (COL.StudentCode === undefined) {
      throw new Error("Sheet missing StudentCode header (or Student Code) in row 1");
    }

    // ----- Find existing row by StudentCode (primary), else UID, else Email -----
    const codeColA1 = colToA1(COL.StudentCode);
    const codesRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${TAB}!${codeColA1}2:${codeColA1}`,
    });
    const codes = (codesRes.data.values || []).map((r) => (r?.[0] ? String(r[0]).trim() : ""));

    let rowIndex0 = -1;
    if (studentCode) rowIndex0 = codes.findIndex((v) => v === studentCode);

    if (rowIndex0 === -1 && COL.UID !== undefined && uid) {
      const uidA1 = colToA1(COL.UID);
      const uRes = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${TAB}!${uidA1}2:${uidA1}`,
      });
      const uids = (uRes.data.values || []).map((r) => (r?.[0] ? String(r[0]).trim() : ""));
      rowIndex0 = uids.findIndex((v) => v === uid);
    }

    if (rowIndex0 === -1 && COL.Email !== undefined && email) {
      const emailA1 = colToA1(COL.Email);
      const eRes = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${TAB}!${emailA1}2:${emailA1}`,
      });
      const emails = (eRes.data.values || []).map((r) => (r?.[0] ? String(r[0]).trim() : ""));
      rowIndex0 = emails.findIndex((v) => v.toLowerCase() === email.toLowerCase());
    }

    const rowNumber = rowIndex0 >= 0 ? rowIndex0 + 2 : null;

    const get = (k, alt) => (student[k] ?? student[alt] ?? "");
    const updates = [];

    // Update one cell in an existing row
    function setCell(col, value) {
      if (col === undefined || !rowNumber) return;
      updates.push({
        range: `${TAB}!${colToA1(col)}${rowNumber}`,
        values: [[value ?? ""]],
      });
    }

    // ✅ UPDATE existing row
    if (rowNumber) {
      setCell(COL.StudentCode, studentCode);
      setCell(COL.UID, uid);
      setCell(COL.Email, email);
      setCell(COL.Name, get("name", "Name"));
      setCell(COL.Phone, get("phone", "Phone"));
      setCell(COL.Location, get("location", "Location"));
      setCell(COL.Level, get("level", "Level"));
      setCell(COL.Paid, get("paid", "Paid"));
      setCell(COL.Balance, get("balance", "Balance"));
      setCell(COL.ContractStart, get("contractStart", "ContractStart"));
      setCell(COL.ContractEnd, get("contractEnd", "ContractEnd"));
      setCell(COL.EmergencyPhone, get("emergencyPhone", "Emergency Contact (Phone Number)"));
      setCell(COL.Status, get("status", "Status"));
      setCell(COL.EnrollDate, get("enrollDate", "EnrollDate"));
      setCell(COL.ClassName, get("className", "ClassName"));
      setCell(COL.Daily_Limit, get("dailyLimit", "Daily_Limit"));

      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: { valueInputOption: "USER_ENTERED", data: updates },
      });

      return res.json({ ok: true, action: "updated", row: rowNumber });
    }

    // ✅ APPEND new row (match sheet width)
    const row = Array(headers.length).fill("");

    function setRow(col, value) {
      if (col === undefined) return;
      row[col] = value ?? "";
    }

    setRow(COL.StudentCode, studentCode);
    setRow(COL.UID, uid);
    setRow(COL.Email, email);
    setRow(COL.Name, get("name", "Name"));
    setRow(COL.Phone, get("phone", "Phone"));
    setRow(COL.Location, get("location", "Location"));
    setRow(COL.Level, get("level", "Level"));
    setRow(COL.Paid, get("paid", "Paid"));
    setRow(COL.Balance, get("balance", "Balance"));
    setRow(COL.ContractStart, get("contractStart", "ContractStart"));
    setRow(COL.ContractEnd, get("contractEnd", "ContractEnd"));
    setRow(COL.EmergencyPhone, get("emergencyPhone", "Emergency Contact (Phone Number)"));
    setRow(COL.Status, get("status", "Status"));
    setRow(COL.EnrollDate, get("enrollDate", "EnrollDate"));
    setRow(COL.ClassName, get("className", "ClassName"));
    setRow(COL.Daily_Limit, get("dailyLimit", "Daily_Limit"));

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${TAB}!A:Z`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });

    return res.json({ ok: true, action: "appended" });
  } catch (e) {
    return res.status(500).json({ error: e.message || String(e) });
  }
};
