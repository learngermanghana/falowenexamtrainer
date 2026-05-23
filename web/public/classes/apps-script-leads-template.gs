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
  - followUpDueLeads: every day or every 6 hours
  - updatePaymentStatuses: every hour if you connect a payment sheet/export
*/

const SETTINGS = {
  LEADS_SHEET: 'Leads',
  EVENTS_SHEET: 'LeadEvents',
  PAYMENTS_SHEET: 'Payments',
  LOGS_SHEET: 'Logs',
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
  const nextFollowUpAt = getNextFollowUpAt_(lead.startDate, 0);

  const record = {
    lead_id: leadId,
    created_at: lead.createdAt || now,
    source: lead.source || 'classes-brochure',
    status: lead.status || 'new_lead',
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
    payment_status: lead.paymentStatus || 'unknown',
    paid_at: lead.paidAt || '',
    payment_reference: lead.paymentReference || '',
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
  return { ok: true, leadId, nextFollowUpAt };
}

function followUpDueLeads() {
  const sheet = ensureSheet_(SETTINGS.LEADS_SHEET, LEAD_HEADERS);
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return;

  const headers = rows[0];
  const now = new Date();

  rows.slice(1).forEach((row, offset) => {
    const record = rowToObject_(headers, row);
    if (!record.email) return;
    if (String(record.payment_status).toLowerCase() === 'paid') return;
    if (!record.next_follow_up_at) return;
    if (new Date(record.next_follow_up_at) > now) return;

    const followUpCount = Number(record.follow_up_count || 0);
    if (followUpCount >= SETTINGS.FOLLOW_UP_DAYS_BEFORE_CLASS.length) return;

    sendFollowUpEmail_(record, followUpCount + 1);

    const nextCount = followUpCount + 1;
    const nextFollowUp = getNextFollowUpAt_(record.start_date, nextCount);
    const rowNumber = offset + 2;
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
  const daysBefore = SETTINGS.FOLLOW_UP_DAYS_BEFORE_CLASS[followUpCount];
  const start = new Date(`${startDateValue}T09:00:00Z`);
  start.setUTCDate(start.getUTCDate() - daysBefore);
  return start.toISOString();
}

function updatePaymentStatuses() {
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
  setCellByHeader_(sheet, headers, rowNumber, 'updated_at', new Date().toISOString());
  appendEvent_(rows[rowIndex][headers.indexOf('lead_id')], 'payment_webhook_paid', payment);
  return { ok: true };
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

function normalizePhone_(phone) {
  return String(phone || '').replace(/\D/g, '').replace(/^0/, '233');
}

function formatDate_(value) {
  if (!value) return '';
  return Utilities.formatDate(new Date(`${value}T00:00:00Z`), 'GMT', 'dd MMM yyyy');
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
