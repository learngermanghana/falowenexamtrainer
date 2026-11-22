#!/usr/bin/env node
"use strict";
// One-time historical normalisation. Dry-run unless --apply is explicitly supplied.
// Run with existing authorized Firebase Admin credentials, never from a browser.
const admin = require("firebase-admin");
const { canonicalPhone, canonicalEmail, canonicalName } = require("../functionz/signupDuplicateReview");

async function main() {
  const apply = process.argv.includes("--apply");
  if (!admin.apps.length) admin.initializeApp();
  const db = admin.firestore();
  const snap = await db.collection("students").get();
  let changed = 0;
  let invalidPhones = 0;
  let commits = 0;
  let batch = db.batch();
  let batchSize = 0;
  const seenPhones = new Map();

  for (const doc of snap.docs) {
    const row = doc.data() || {};
    const phone = canonicalPhone(row.phone || row.phoneNumber || row.mobile);
    const emergency = canonicalPhone(
      row.emergencyContactPhone || row.emergencyContactPhoneNumber || row.emergencyPhone || row.guardianPhone
    );
    const values = {
      phoneIdentity: phone,
      emergencyContactPhoneIdentity: emergency,
      emailIdentity: canonicalEmail(row.email || row.authEmail),
      nameIdentity: canonicalName(row.name || row.fullName),
    };
    if (!phone) invalidPhones += 1;
    if (phone) seenPhones.set(phone, (seenPhones.get(phone) || 0) + 1);
    const changes = Object.fromEntries(Object.entries(values).filter(([key, value]) =>
      value && row[key] !== value
    ));
    if (!Object.keys(changes).length) continue;
    changed += 1;
    if (!apply) continue;
    batch.update(doc.ref, changes);
    batchSize += 1;
    if (batchSize >= 200) {
      await batch.commit();
      commits += 1;
      batch = db.batch();
      batchSize = 0;
    }
  }
  if (apply && batchSize) { await batch.commit(); commits += 1; }
  const collisions = [...seenPhones.values()].filter(count => count > 1).length;
  // Aggregate counts only: no student names, emails, or contact numbers in logs.
  console.log(JSON.stringify({
    mode: apply ? "applied" : "dry-run", studentsRead: snap.size, changed,
    invalidPrimaryPhones: invalidPhones, preExistingPrimaryPhoneCollisions: collisions,
    batchesCommitted: commits,
  }, null, 2));
}
main().catch(error => {
  console.error("Signup identity backfill failed:", error?.code || error?.message || "unknown");
  process.exitCode = 1;
});
