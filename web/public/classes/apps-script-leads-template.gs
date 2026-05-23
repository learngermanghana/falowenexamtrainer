/*
  Falowen class brochure lead capture backend

  Setup:
  1. Create a Google Sheet with tabs: Leads, LeadEvents, Payments, Logs.
  2. Open Extensions > Apps Script and paste this file.
  3. Deploy > New deployment > Web app.
     - Execute as: Me
     - Who has access: Anyone
  4. Copy the Web App URL and put it into class-leads.js:
     DEFAULT_APPS_SCRIPT_ENDPOINT = "YOUR_WEB_APP_URL";

  Recommended triggers:
  - monitorStudentRegistrations: every hour
  - followUpDueLeads: every day or every 6 hours
  - updatePaymentStatuses: every hour if you also connect a payment sheet/export

  Student monitoring:
  - This script reads the existing student data spreadsheet below.
  - If a lead appears in the student sheet by same email, phone, or exact name, the lead is marked student_registered.
  - If class start date has passed, follow-up stops automatically.
*/

const SETTINGS = {
  LEADS_SHEET: 'Leads',
  EVENTS_SHEET: 'LeadEvents',
  PAYMENTS_SHEET: 'Payments',
  LOGS_SHEET: 'Logs',
  STUDENT_SPREADSHEET_ID: '12NXf5FeVHr7JJT47mRHh7Jp-TC1yhPS7ZG6nzZVTt1U',
  STUDENT_SHEET_NAME: '', // leave blank to auto-detect the sheet with Name, Phone, Email, Paid, Balance headers
  FROM_NAME: 'Learn Language Education Academy',
  SUPPORT_EMAIL: 'info@falowen.app',
  FOLLOW_UP_DAYS_BEFORE_CLASS: [21, 10, 3],
};

const LEAD_HEADERS = [
  'lead_id',
  'created_at',
  'source',
  'status',
  'name',
  'phone',
  'email',
  'class_id',
  'class_slug',
  'class_name',
  'level',
  'start_date',
  'end_date',
  'meeting_times',
  'schedule_url',
  'payment_status',
  'paid_at',
  'payment_reference',
  'student_registered_at',
  'student_code',
  'student_status',
  'student_paid',
  'student_balance',
  'matched_student_row',
  'stop_reason',
  'follow_up_count',
  'next_follow_up_at',
  'last_follow_up_at',
  'updated_at'
];

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (payload.action === 'saveLead') {
      const result = saveLead_(payload.lead || {});
      return json_(result);
    }
    if (payload.action === 'paymentWebhook') {
      const result = markPaidFromWebhook_(payload.payment || payload);
      return json_(result);
    }
    return json_({ ok: false, error: 'unknown-action' });
  } catch (error) {
    log_('doPost error', error.stack || error.message);
    return json_({ ok: false, error: String(error.message || error) });
  }
}

function saveLead_(lead) {
  const sheet = ensureSheet_(SETTINGS.LEADS_SHEET, LEAD_HEADERS);
  const now = new Date().toISOString();
  const leadId = lead.id || Utilities.getUuid();
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0] || LEAD_HEADERS;
  const idIndex = headers.indexOf('lead_id');
  const existingRowIndex = rows.findIndex((row, index) => index > 0 && row[idIndex] === leadId);
  const startPassed = hasClassStarted_(lead.startDate);
  const studentMatch = findStudentMatchForLead_(lead);
  const registered = Boolean(studentMatch);
  const paymentInfo = registered ? paymentStatusFromStudent_(studentMatch.student) : { status: lead.paymentStatus || 'unknown', paidAt: lead.paidAt || '' };
  const nextFollowUpAt = registered || startPassed ? '' : getNextFollowUpAt_(lead.startDate, 0);

  const record = {
    lead_id: leadId,
    created_at: lead.createdAt || now,
    source: lead.source || 'classes-brochure',
    status: registered ? 'student_registered' : startPassed ? 'class_started_no_followup' : lead.status || 'new_lead',
    name: lead.name || '',
    phone: lead.phone || '',
    email: lead.email || '',
    class_id: lead.classId || '',
    class_slug: lead.classSlug || '',
    class_name: lead.className || '',
    level: lead.level || '',
    start_date: lead.startDate || '',
    end_date: lead.endDate || '',
    meeting_times: lead.meetingTimes || '',
    schedule_url: lead.scheduleUrl || '',
    payment_status: paymentInfo.status,
    paid_at: paymentInfo.paidAt || '',
    payment_reference: lead.paymentReference || '',
    student_registered_at: registered ? now : '',
    student_code: registered ? studentMatch.student.StudentCode || '' : '',
    student_status: registered ? studentMatch.student.Status || '' : '',
    student_paid: registered ? studentMatch.student.Paid || '' : '',
    student_balance: registered ? studentMatch.student.Balance || '' : '',
    matched_student_row: registered ? studentMatch.rowNumber : '',
    stop_reason: registered ? 'matched_student_sheet' : startPassed ? 'class_start_date_passed' : '',
    follow_up_count: Number(lead.followUpCount || 0),
    next_follow_up_at: lead.nextFollowUpAt || nextFollowUpAt,
    last_follow_up_at: '',
    updated_at: now,
  };

  const values = LEAD_HEADERS.map((header) => record[header] || '');
  if (existingRowIndex > 0) {
    sheet.getRange(existingRowIndex + 1, 1, 1, values.length).setValues([values]);
  } else {
    sheet.appendRow(values);
  }

  appendEvent_(leadId, 'lead_saved', record);
  if (registered) appendEvent_(leadId, 'student_registration_detected_on_save', studentMatch.student);
  if (startPassed && !registered) appendEvent_(leadId, 'lead_stopped_class_started', { startDate: lead.startDate });
  return { ok: true, leadId, registered, nextFollowUpAt };
}

function monitorStudentRegistrations() {
  const sheet = ensureSheet_(SETTINGS.LEADS_SHEET, LEAD_HEADERS);
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return;

  const headers = rows[0];
  const studentData = getStudentData_();
  const now = new Date().toISOString();

  rows.slice(1).forEach((row, offset) => {
    const rowNumber = offset + 2;
    const lead = rowToObject_(headers, row);
    const currentStatus = String(lead.status || '').toLowerCase();
    const alreadyStopped = ['student_registered', 'paid', 'class_started_no_followup'].includes(currentStatus);

    if (hasClassStarted_(lead.start_date) && !alreadyStopped) {
      setCellByHeader_(sheet, headers, rowNumber, 'status', 'class_started_no_followup');
      setCellByHeader_(sheet, headers, rowNumber, 'next_follow_up_at', '');
      setCellByHeader_(sheet, headers, rowNumber, 'stop_reason', 'class_start_date_passed');
      setCellByHeader_(sheet, headers, rowNumber, 'updated_at', now);
      appendEvent_(lead.lead_id, 'lead_stopped_class_started', { startDate: lead.start_date });
      return;
    }

    if (currentStatus === 'student_registered' || currentStatus === 'paid') return;

    const match = findStudentMatch_(lead, studentData);
    if (!match) return;

    const student = match.student;
    const paymentInfo = paymentStatusFromStudent_(student);
    setCellByHeader_(sheet, headers, rowNumber, 'status', 'student_registered');
    setCellByHeader_(sheet, headers, rowNumber, 'payment_status', paymentInfo.status);
    setCellByHeader_(sheet, headers, rowNumber, 'paid_at', paymentInfo.paidAt || '');
    setCellByHeader_(sheet, headers, rowNumber, 'student_registered_at', now);
    setCellByHeader_(sheet, headers, rowNumber, 'student_code', student.StudentCode || '');
    setCellByHeader_(sheet, headers, rowNumber, 'student_status', student.Status || '');
    setCellByHeader_(sheet, headers, rowNumber, 'student_paid', student.Paid || '');
    setCellByHeader_(sheet, headers, rowNumber, 'student_balance', student.Balance || '');
    setCellByHeader_(sheet, headers, rowNumber, 'matched_student_row', match.rowNumber);
    setCellByHeader_(sheet, headers, rowNumber, 'stop_reason', 'matched_student_sheet');
    setCellByHeader_(sheet, headers, rowNumber, 'next_follow_up_at', '');
    setCellByHeader_(sheet, headers, rowNumber, 'updated_at', now);
    appendEvent_(lead.lead_id, 'student_registration_detected', { rowNumber: match.rowNumber, student });
  });
}

function followUpDueLeads() {
  monitorStudentRegistrations();

  const sheet = ensureSheet_(SETTINGS.LEADS_SHEET, LEAD_HEADERS);
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return;

  const headers = rows[0];
  const now = new Date();

  rows.slice(1).forEach((row, offset) => {
    const record = rowToObject_(headers, row);
    const rowNumber = offset + 2;
    const status = String(record.status || '').toLowerCase();
    const paymentStatus = String(record.payment_status || '').toLowerCase();

    if (!record.email) return;
    if (['student_registered', 'paid', 'class_started_no_followup'].includes(status)) return;
    if (['paid', 'registered_paid', 'registered_partial', 'registered_unpaid'].includes(paymentStatus)) return;

    if (hasClassStarted_(record.start_date)) {
      setCellByHeader_(sheet, headers, rowNumber, 'status', 'class_started_no_followup');
      setCellByHeader_(sheet, headers, rowNumber, 'next_follow_up_at', '');
      setCellByHeader_(sheet, headers, rowNumber, 'stop_reason', 'class_start_date_passed');
      setCellByHeader_(sheet, headers, rowNumber, 'updated_at', new Date().toISOString());
      appendEvent_(record.lead_id, 'lead_stopped_class_started', { startDate: record.start_date });
      return;
    }

    if (!record.next_follow_up_at) return;
    if (new Date(record.next_follow_up_at) > now) return;

    const followUpCount = Number(record.follow_up_count || 0);
    if (followUpCount >= SETTINGS.FOLLOW_UP_DAYS_BEFORE_CLASS.length) return;

    sendFollowUpEmail_(record, followUpCount + 1);

    const nextCount = followUpCount + 1;
    const nextFollowUp = getNextFollowUpAt_(record.start_date, nextCount);
    setCellByHeader_(sheet, headers, rowNumber, 'follow_up_count', nextCount);
    setCellByHeader_(sheet, headers, rowNumber, 'last_follow_up_at', new Date().toISOString());
    setCellByHeader_(sheet, headers, rowNumber, 'next_follow_up_at', nextFollowUp);
    setCellByHeader_(sheet, headers, rowNumber, 'updated_at', new Date().toISOString());
    appendEvent_(record.lead_id, 'follow_up_sent', { followUpCount: nextCount, nextFollowUp });
  });
}

function sendFollowUpEmail_(record, number) {
  const subject = `${record.class_name || 'Your German class'} starts soon`;
  const body = `Hello ${record.name || ''},\n\nThank you for your interest in ${record.class_name}.\n\nClass start date: ${formatDate_(record.start_date)}\nMeeting times: ${record.meeting_times}\nClass schedule: ${record.schedule_url}\n\nTo secure your seat, please sign in to Falowen, choose the class under Upcoming Classes, and make payment. Full payment gives 6 months access.\n\nRegards,\n${SETTINGS.FROM_NAME}`;
  GmailApp.sendEmail(record.email, subject, body, { name: SETTINGS.FROM_NAME, replyTo: SETTINGS.SUPPORT_EMAIL });
}

function getNextFollowUpAt_(startDateValue, followUpCount) {
  if (!startDateValue) return '';
  if (followUpCount >= SETTINGS.FOLLOW_UP_DAYS_BEFORE_CLASS.length) return '';
  if (hasClassStarted_(startDateValue)) return '';
  const daysBefore = SETTINGS.FOLLOW_UP_DAYS_BEFORE_CLASS[followUpCount];
  const start = new Date(`${startDateValue}T09:00:00Z`);
  start.setUTCDate(start.getUTCDate() - daysBefore);
  return start.toISOString();
}

function updatePaymentStatuses() {
  monitorStudentRegistrations();

  const leadsSheet = ensureSheet_(SETTINGS.LEADS_SHEET, LEAD_HEADERS);
  const paymentsSheet = ensureSheet_(SETTINGS.PAYMENTS_SHEET, [
    'payment_reference',
    'email',
    'phone',
    'class_name',
    'amount',
    'payment_status',
    'paid_at'
  ]);

  const leadRows = leadsSheet.getDataRange().getValues();
  const paymentRows = paymentsSheet.getDataRange().getValues();
  if (leadRows.length < 2 || paymentRows.length < 2) return;

  const leadHeaders = leadRows[0];
  const paymentHeaders = paymentRows[0];
  const payments = paymentRows.slice(1).map((row) => rowToObject_(paymentHeaders, row));

  leadRows.slice(1).forEach((row, offset) => {
    const lead = rowToObject_(leadHeaders, row);
    if (String(lead.payment_status).toLowerCase() === 'paid') return;

    const match = payments.find((payment) => {
      const statusPaid = String(payment.payment_status || '').toLowerCase() === 'paid';
      const sameEmail = lead.email && payment.email && String(lead.email).toLowerCase() === String(payment.email).toLowerCase();
      const samePhone = normalizePhone_(lead.phone) && normalizePhone_(payment.phone) && normalizePhone_(lead.phone) === normalizePhone_(payment.phone);
      const sameClass = !payment.class_name || String(payment.class_name).toLowerCase() === String(lead.class_name).toLowerCase();
      return statusPaid && sameClass && (sameEmail || samePhone);
    });

    if (!match) return;
    const rowNumber = offset + 2;
    setCellByHeader_(leadsSheet, leadHeaders, rowNumber, 'payment_status', 'paid');
    setCellByHeader_(leadsSheet, leadHeaders, rowNumber, 'paid_at', match.paid_at || new Date().toISOString());
    setCellByHeader_(leadsSheet, leadHeaders, rowNumber, 'payment_reference', match.payment_reference || 'matched-payment-sheet');
    setCellByHeader_(leadsSheet, leadHeaders, rowNumber, 'status', 'paid');
    setCellByHeader_(leadsSheet, leadHeaders, rowNumber, 'next_follow_up_at', '');
    setCellByHeader_(leadsSheet, leadHeaders, rowNumber, 'stop_reason', 'payment_matched');
    setCellByHeader_(leadsSheet, leadHeaders, rowNumber, 'updated_at', new Date().toISOString());
    appendEvent_(lead.lead_id, 'payment_matched', match);
  });
}

function markPaidFromWebhook_(payment) {
  const sheet = ensureSheet_(SETTINGS.LEADS_SHEET, LEAD_HEADERS);
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return { ok: false, error: 'no-leads' };

  const headers = rows[0];
  const leadId = payment.leadId || payment.lead_id || '';
  const email = String(payment.email || '').toLowerCase();
  const phone = normalizePhone_(payment.phone || '');
  const className = String(payment.className || payment.class_name || '').toLowerCase();

  const rowIndex = rows.findIndex((row, index) => {
    if (index === 0) return false;
    const lead = rowToObject_(headers, row);
    if (leadId && lead.lead_id === leadId) return true;
    const sameEmail = email && String(lead.email || '').toLowerCase() === email;
    const samePhone = phone && normalizePhone_(lead.phone || '') === phone;
    const sameClass = !className || String(lead.class_name || '').toLowerCase() === className;
    return sameClass && (sameEmail || samePhone);
  });

  if (rowIndex < 1) return { ok: false, error: 'lead-not-found' };
  const rowNumber = rowIndex + 1;
  setCellByHeader_(sheet, headers, rowNumber, 'payment_status', 'paid');
  setCellByHeader_(sheet, headers, rowNumber, 'paid_at', payment.paidAt || payment.paid_at || new Date().toISOString());
  setCellByHeader_(sheet, headers, rowNumber, 'payment_reference', payment.reference || payment.payment_reference || 'webhook');
  setCellByHeader_(sheet, headers, rowNumber, 'status', 'paid');
  setCellByHeader_(sheet, headers, rowNumber, 'next_follow_up_at', '');
  setCellByHeader_(sheet, headers, rowNumber, 'stop_reason', 'payment_webhook_paid');
  setCellByHeader_(sheet, headers, rowNumber, 'updated_at', new Date().toISOString());
  appendEvent_(rows[rowIndex][headers.indexOf('lead_id')], 'payment_webhook_paid', payment);
  return { ok: true };
}

function findStudentMatchForLead_(lead) {
  try {
    return findStudentMatch_({
      email: lead.email || '',
      phone: lead.phone || '',
      name: lead.name || '',
      class_name: lead.className || '',
      level: lead.level || ''
    }, getStudentData_());
  } catch (error) {
    log_('findStudentMatchForLead_ error', error.stack || error.message);
    return null;
  }
}

function getStudentData_() {
  const ss = SpreadsheetApp.openById(SETTINGS.STUDENT_SPREADSHEET_ID);
  let sheet = SETTINGS.STUDENT_SHEET_NAME ? ss.getSheetByName(SETTINGS.STUDENT_SHEET_NAME) : null;
  if (!sheet) sheet = findStudentSheet_(ss);
  if (!sheet) throw new Error('student-sheet-not-found');

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return { headers: [], students: [] };
  const headers = values[0].map((header) => String(header || '').trim());
  const students = values.slice(1).map((row, index) => ({
    rowNumber: index + 2,
    student: rowToObject_(headers, row)
  }));
  return { headers, students };
}

function findStudentSheet_(ss) {
  const required = ['Name', 'Phone', 'Email', 'Paid', 'Balance'];
  return ss.getSheets().find((sheet) => {
    const lastColumn = Math.max(sheet.getLastColumn(), required.length);
    if (sheet.getLastRow() < 1) return false;
    const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map((header) => String(header || '').trim());
    return required.every((header) => headers.includes(header));
  });
}

function findStudentMatch_(lead, studentData) {
  const email = normalizeEmail_(lead.email);
  const phone = normalizePhone_(lead.phone);
  const name = normalizeName_(lead.name);
  const className = normalizeName_(lead.class_name || lead.className);
  const level = String(lead.level || '').toUpperCase();

  const students = studentData.students || [];

  const strongMatch = students.find(({ student }) => {
    const studentEmail = normalizeEmail_(student.Email);
    const studentPhone = normalizePhone_(student.Phone);
    const emailMatch = email && studentEmail && email === studentEmail;
    const phoneMatch = phone && studentPhone && phone === studentPhone;
    return emailMatch || phoneMatch;
  });
  if (strongMatch) return strongMatch;

  const nameMatches = students.filter(({ student }) => normalizeName_(student.Name) === name && name);
  if (nameMatches.length === 1) return nameMatches[0];

  if (nameMatches.length > 1) {
    const classMatch = nameMatches.find(({ student }) => {
      const studentClass = normalizeName_(student.ClassName);
      const studentLevel = String(student.Level || '').toUpperCase();
      return (className && studentClass === className) || (level && studentLevel === level);
    });
    if (classMatch) return classMatch;
  }

  return null;
}

function paymentStatusFromStudent_(student) {
  const paid = toNumber_(student.Paid);
  const balance = toNumber_(student.Balance);
  const paidAt = student.LastPaidRecorded || student.ContractStart || student.EnrollDate || student.RegistrationDate || '';

  if (paid > 0 && balance <= 0) return { status: 'registered_paid', paidAt };
  if (paid > 0 && balance > 0) return { status: 'registered_partial', paidAt };
  return { status: 'registered_unpaid', paidAt: '' };
}

function hasClassStarted_(startDateValue) {
  if (!startDateValue) return false;
  const start = new Date(`${startDateValue}T23:59:59Z`);
  return new Date() > start;
}

function ensureSheet_(name, headers) {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);
  const existing = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getValues()[0];
  headers.forEach((header) => {
    if (!existing.includes(header)) sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
  });
  return sheet;
}

function appendEvent_(leadId, eventType, data) {
  const sheet = ensureSheet_(SETTINGS.EVENTS_SHEET, ['timestamp', 'lead_id', 'event_type', 'data_json']);
  sheet.appendRow([new Date().toISOString(), leadId || '', eventType, JSON.stringify(data || {})]);
}

function log_(message, details) {
  const sheet = ensureSheet_(SETTINGS.LOGS_SHEET, ['timestamp', 'message', 'details']);
  sheet.appendRow([new Date().toISOString(), message, details || '']);
}

function rowToObject_(headers, row) {
  return headers.reduce((obj, header, index) => {
    obj[header] = row[index];
    return obj;
  }, {});
}

function setCellByHeader_(sheet, headers, rowNumber, header, value) {
  const index = headers.indexOf(header);
  if (index === -1) return;
  sheet.getRange(rowNumber, index + 1).setValue(value);
}

function normalizeEmail_(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizePhone_(phone) {
  return String(phone || '').replace(/\D/g, '').replace(/^0/, '233');
}

function normalizeName_(name) {
  return String(name || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function toNumber_(value) {
  if (typeof value === 'number') return value;
  return Number(String(value || '').replace(/[^0-9.-]/g, '')) || 0;
}

function formatDate_(value) {
  if (!value) return '';
  return Utilities.formatDate(new Date(`${value}T00:00:00Z`), 'GMT', 'dd MMM yyyy');
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
