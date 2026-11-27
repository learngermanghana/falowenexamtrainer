"use strict";

// Students may download their own academic and enrollment documents. Browser requests never provide a student code or email;
// those identities come from the Firebase ID token and trusted student record.
// Academic and registration documents use separate Apps Script deployments.
const ACADEMIC_TYPES = new Set(["transcript", "certificate"]);
const REGISTRATION_TYPES = new Set(["enrollment", "agreement", "receipt", "residence"]);
const DOCUMENT_LEVELS = new Set(["A1", "A2", "B1"]);
const MAX_PDF_BYTES = 2_750_000;

const lower = (value) => String(value || "").trim().toLowerCase();

function documentTrialRestriction(profile = {}) {
  const status = String(profile.trialStatus || "").trim().toLowerCase();
  const accountStatus = String(profile.status || "").trim().toLowerCase();
  const trial = ["active", "expired", "used", "ended"].includes(status)
    || ["trial", "trial_active", "trial_expired"].includes(accountStatus)
    || Boolean(profile.trialStartedAt || profile.trialUsedAt || profile.trialEndsAt);
  const paid = Number(profile.paid ?? profile.paidAmount ?? 0) > 0
    || ["paid", "partial", "partially paid", "partially_paid", "part paid", "part-paid"].includes(String(profile.paymentStatus || "").trim().toLowerCase());
  if (!trial || paid) return "";
  const rawEnd = profile.trialEndsAt;
  const end = rawEnd?.toMillis?.() ?? new Date(rawEnd || "").getTime();
  const expired = ["expired", "used", "ended"].includes(status) || accountStatus === "trial_expired"
    || (Number.isFinite(end) && end <= Date.now());
  return expired
    ? "Your free trial has ended. Official school documents are unavailable until you enroll and your tuition payment is confirmed."
    : "You are on a free trial. Official school documents cannot be downloaded until you enroll and your tuition payment is confirmed.";
}

function isTrustedAppsScriptUrl(raw) {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" && url.hostname === "script.google.com"
      && /^\/macros\/s\/[^/]+\/exec$/.test(url.pathname);
  } catch {
    return false;
  }
}

function registerStudentDocumentRoutes(app, {
  requireAuthenticatedUser, getFirestoreSafe, findAuthedStudentProfile, enforceUserQuota,
}) {
  app.post("/students/me/documents/:kind", async (req, res) => {
    res.set("Cache-Control", "private, no-store, max-age=0");
    res.set("X-Content-Type-Options", "nosniff");
    const kind = String(req.params.kind || "").toLowerCase();
    const academic = ACADEMIC_TYPES.has(kind);
    const level = academic ? String(req.body?.level || "").trim().toUpperCase() : "";
    if (academic ? !DOCUMENT_LEVELS.has(level) : !REGISTRATION_TYPES.has(kind)) {
      return res.status(400).json({ error: "Choose a supported document and course level." });
    }

    try {
      const authenticated = await requireAuthenticatedUser(req, res, { allowGuest: false });
      if (!authenticated) return;
      const verifiedEmail = lower(authenticated.email);
      if (!verifiedEmail || authenticated.email_verified !== true) {
        return res.status(403).json({ error: "Verify your Falowen account email before downloading school documents." });
      }

      const database = getFirestoreSafe();
      if (!database) return res.status(503).json({ error: "Student account verification is unavailable." });
      const match = await findAuthedStudentProfile(database, authenticated);
      const profile = match?.data || null;
      const profileEmail = lower(profile?.email || profile?.contactEmail);
      const studentCode = String(profile?.studentCode || profile?.studentcode || profile?.student_code || "").trim();

      // Never accept a user-supplied identity or infer one from a display name.
      if (!studentCode || !profileEmail || profileEmail !== verifiedEmail) {
        return res.status(403).json({ error: "Your student account details need verification. Contact Falowen support." });
      }

      const trialReason = documentTrialRestriction(profile);
      if (trialReason) return res.status(403).json({ code: "trial_document_restricted", error: trialReason });

      const webhookUrl = String((academic ? process.env.ANNOUNCEMENT_WEBHOOK_URL : process.env.STUDENT_DOCS_WEBHOOK_URL) || "").trim();
      const webhookToken = String((academic ? process.env.ANNOUNCEMENT_WEBHOOK_TOKEN : process.env.STUDENT_DOCS_WEBHOOK_TOKEN) || "").trim();
      if (!webhookToken || !isTrustedAppsScriptUrl(webhookUrl)) {
        return res.status(503).json({ error: "Document downloads are not connected yet. Please contact Falowen." });
      }

      const quota = await enforceUserQuota({
        uid: authenticated.uid, category: "official_documents", limit: 8,
      });
      if (!quota.allowed) {
        return res.status(429).json({ error: "Daily document download limit reached. Try again tomorrow." });
      }

      const upstreamResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: webhookToken,
          action: academic ? "exportStudentDocumentFromScores" : "exportStudentAccountDocument",
          source: "falowen-student-account",
          kind, ...(academic ? { level } : {}),
          row: { student_code: studentCode, email: verifiedEmail },
        }),
        signal: AbortSignal.timeout(45_000),
        redirect: "follow",
      });
      if (!upstreamResponse.ok) {
        return res.status(502).json({ error: "Falowen's document generator is unavailable." });
      }

      const result = await upstreamResponse.json();
      if (!result?.ok) {
        if (!academic && result?.code === "document_unavailable") {
          return res.status(404).json({ error: ({ enrollment: "No enrollment letter is available for your student record. Contact Falowen to verify your enrollment.", agreement: "No payment agreement is available for your student record. Contact Falowen to verify your agreement.", receipt: "No issued payment receipt is available for your student record yet. Check Billing history or contact Falowen.", residence: "No residence-permit support letter has been issued for your student record yet. Contact Falowen." })[kind] });
        }
        const reason = typeof result?.error === "string" ? result.error : "";
        const isNotEligible = kind === "certificate" && /not yet eligible|not qualified|required tasks|final course assessment|final mock|incomplete|failed assignments|missing assignments|not passed/i.test(reason);
        // Only expose bounded academic facts, not raw upstream exceptions or private data.
        const progress = reason.match(/\b(\d{1,3})\s*\/\s*(\d{1,3})\s+(?:required\s+)?(?:tasks|assignments|workbooks|items)(?:\s+(?:passed|completed|verified))?/i);
        const verifiedProgress = progress && Number(progress[2]) > 0 && Number(progress[1]) <= Number(progress[2]) ? progress : null;
        const finalMissing = /(?:final (?:course assessment|mock|assessment|exam)).{0,60}(?:missing|not passed|not completed|not verified|required|failed|pending)|(?:missing|failed|pending).{0,40}final (?:mock|assessment|exam)/i.test(reason);
        const failed = reason.match(/\b(\d{1,3})\s+failed\s+(?:tasks|assignments|workbooks|items)\b/i);
        const details = [verifiedProgress ? verifiedProgress[1] + " of " + verifiedProgress[2] + " required tasks recorded as " + (/passed/i.test(verifiedProgress[0]) ? "passed" : /completed/i.test(verifiedProgress[0]) ? "completed" : "verified by the document service") + "." : "", failed ? failed[1] + " required tasks have failed." : "", finalMissing ? "Your official final assessment is missing, has not passed, or has not been verified." : ""].filter(Boolean).join(" ");
        const hasNoScores = /no verified .*scores|no score rows/i.test(result?.error || "");
        return res.status(isNotEligible ? 409 : hasNoScores ? 404 : 503).json({
          error: isNotEligible
            ? `Your ${level} certificate is not available yet. ${details || "The document service has not confirmed that all required marked tasks and the official final assessment have passed."} Check Results or contact your tutor to resolve outstanding work.`
            : hasNoScores
              ? "No verified scores are available for this level yet."
              : "Falowen could not generate this document. Contact support if the problem continues.",
        });
      }

      if (result.mime_type !== "application/pdf" || !result.data_base64
          || (academic && result.level !== level) || result.kind !== kind) {
        return res.status(502).json({ error: "The document service returned an invalid response." });
      }
      const pdf = Buffer.from(result.data_base64, "base64");
      if (!pdf.length || pdf.length > MAX_PDF_BYTES || pdf.subarray(0, 4).toString() !== "%PDF") {
        return res.status(502).json({ error: "The document service returned an invalid PDF." });
      }

      const fileName = String(result.file_name || `Falowen_${kind}_${level}.pdf`)
        .replace(/[^a-z0-9._-]/gi, "_").slice(0, 150);
      res.set("Content-Type", "application/pdf");
      res.set("Content-Disposition", `attachment; filename="${fileName}"`);
      return res.status(200).send(pdf);
    } catch (error) {
      console.error("Self-service academic document request failed", {
        kind, level, reason: error?.name === "TimeoutError" ? "timeout" : "upstream_error",
      });
      return res.status(503).json({ error: ["TimeoutError", "AbortError"].includes(error?.name) ? "The document generator timed out. Please try again." : "The document service is temporarily unavailable. Please try again." });
    }
  });
}

module.exports = { registerStudentDocumentRoutes, isTrustedAppsScriptUrl };
