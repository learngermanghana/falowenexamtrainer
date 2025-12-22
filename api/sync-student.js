const { google } = require("googleapis");

const SHEET_ID = process.env.STUDENTS_SHEET_ID;
const TAB = process.env.STUDENTS_SHEET_TAB || "student";

function getServiceAccount() {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64;
  if (!b64) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON_B64");
  return JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
}

function normalizeHeader(h) {
  return String(h || "").trim();
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

    const headerRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${TAB}!1:1`,
    });

    const headers = (headerRes.data.values && headerRes.data.values[0]) || [];
    const headerIndex = new Map();
    headers.forEach((h, i) => headerIndex.set(normalizeHeader(h), i));

    const H = {
      Name: "Name",
      Phone: "Phone",
      Location: "Location",
      Level: "Level",
      Paid: "Paid",
      Balance: "Balance",
      ContractStart: "ContractStart",
      ContractEnd: "ContractEnd",
      StudentCode: "StudentCode",
      Email: "Email",
      EmergencyPhone: "Emergency Contact (Phone Number)",
      Status: "Status",
      EnrollDate: "EnrollDate",
      ClassName: "ClassName",
      Daily_Limit: "Daily_Limit",
      Uses_Today: "Uses_Today",
      Last_Date: "Last_Date",
      ReminderSent: "ReminderSent",
      UID: "UID",
    };

    const colStudentCode = headerIndex.get(H.StudentCode);
    if (colStudentCode === undefined) throw new Error("Sheet missing StudentCode header");
    const colUID = headerIndex.get(H.UID);
    const colEmail = headerIndex.get(H.Email);

    const codeColA1 = colToA1(colStudentCode);
    const codesRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${TAB}!${codeColA1}2:${codeColA1}`,
    });
    const codes = (codesRes.data.values || []).map((r) => (r?.[0] ? String(r[0]).trim() : ""));

    let rowIndex0 = -1;
    if (studentCode) rowIndex0 = codes.findIndex((v) => v === studentCode);

    if (rowIndex0 === -1 && colUID !== undefined && uid) {
      const uidA1 = colToA1(colUID);
      const uRes = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${TAB}!${uidA1}2:${uidA1}`,
      });
      const uids = (uRes.data.values || []).map((r) => (r?.[0] ? String(r[0]).trim() : ""));
      rowIndex0 = uids.findIndex((v) => v === uid);
    }

    if (rowIndex0 === -1 && colEmail !== undefined && email) {
      const emailA1 = colToA1(colEmail);
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

    function setCell(headerName, value) {
      const col = headerIndex.get(headerName);
      if (col === undefined || !rowNumber) return;
      updates.push({
        range: `${TAB}!${colToA1(col)}${rowNumber}`,
        values: [[value ?? ""]],
      });
    }

    if (rowNumber) {
      setCell(H.StudentCode, studentCode);
      setCell(H.UID, uid);
      setCell(H.Email, email);
      setCell(H.Name, get("name", "Name"));
      setCell(H.Phone, get("phone", "Phone"));
      setCell(H.Location, get("location", "Location"));
      setCell(H.Level, get("level", "Level"));
      setCell(H.Paid, get("paid", "Paid"));
      setCell(H.Balance, get("balance", "Balance"));
      setCell(H.ContractStart, get("contractStart", "ContractStart"));
      setCell(H.ContractEnd, get("contractEnd", "ContractEnd"));
      setCell(H.EmergencyPhone, get("emergencyPhone", "Emergency Contact (Phone Number)"));
      setCell(H.Status, get("status", "Status"));
      setCell(H.EnrollDate, get("enrollDate", "EnrollDate"));
      setCell(H.ClassName, get("className", "ClassName"));
      setCell(H.Daily_Limit, get("dailyLimit", "Daily_Limit"));
      setCell(H.Uses_Today, get("usesToday", "Uses_Today"));
      setCell(H.Last_Date, get("lastDate", "Last_Date"));
      setCell(H.ReminderSent, get("reminderSent", "ReminderSent"));

      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: { valueInputOption: "USER_ENTERED", data: updates },
      });

      return res.json({ ok: true, action: "updated", row: rowNumber });
    }

    const maxCol = Math.max(...Array.from(headerIndex.values()));
    const row = Array(maxCol + 1).fill("");

    function setRow(headerName, value) {
      const col = headerIndex.get(headerName);
      if (col === undefined) return;
      row[col] = value ?? "";
    }

    setRow(H.StudentCode, studentCode);
    setRow(H.UID, uid);
    setRow(H.Email, email);
    setRow(H.Name, get("name", "Name"));
    setRow(H.Phone, get("phone", "Phone"));
    setRow(H.Location, get("location", "Location"));
    setRow(H.Level, get("level", "Level"));
    setRow(H.Paid, get("paid", "Paid"));
    setRow(H.Balance, get("balance", "Balance"));
    setRow(H.ContractStart, get("contractStart", "ContractStart"));
    setRow(H.ContractEnd, get("contractEnd", "ContractEnd"));
    setRow(H.EmergencyPhone, get("emergencyPhone", "Emergency Contact (Phone Number)"));
    setRow(H.Status, get("status", "Status"));
    setRow(H.EnrollDate, get("enrollDate", "EnrollDate"));
    setRow(H.ClassName, get("className", "ClassName"));
    setRow(H.Daily_Limit, get("dailyLimit", "Daily_Limit"));
    setRow(H.Uses_Today, get("usesToday", "Uses_Today"));
    setRow(H.Last_Date, get("lastDate", "Last_Date"));
    setRow(H.ReminderSent, get("reminderSent", "ReminderSent"));

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
