import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MARKER = "PAYMENT_DRIVEN_ACCOUNT_UPGRADE_2026_08";

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function write(relativePath, content) {
  fs.writeFileSync(path.join(root, relativePath), content, "utf8");
}

function replaceOnce(content, needle, replacement, label) {
  if (content.includes(replacement)) return content;
  if (!content.includes(needle)) {
    throw new Error(`Payment-driven account upgrade patch could not find ${label}.`);
  }
  return content.replace(needle, replacement);
}

function replaceRegex(content, regex, replacement, label) {
  if (!regex.test(content)) {
    throw new Error(`Payment-driven account upgrade patch could not find ${label}.`);
  }
  return content.replace(regex, replacement);
}

function patchPaymentAwareApp() {
  const file = "functions/functionz/paymentAwareApp.js";
  let content = read(file);
  if (content.includes(MARKER)) return;

  content = replaceOnce(
    content,
    'const PAYSTACK_MIN_INSTALLMENT_GHS = 2000;\n',
    `const PAYSTACK_MIN_INSTALLMENT_GHS = 2000;\nconst ${MARKER} = true;\nconst LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1"];\nconst LEVEL_FEES = { A1: 3000, A2: 3000, B1: 3000, B2: 3000, C1: 3000 };\nconst OPEN_UPGRADE_STATUSES = new Set(["awaiting_payment", "pending", "expired"]);\n\nconst normalizeLevel = (value) => {\n  const match = String(value || "").trim().toUpperCase().match(/\\b(A1|A2|B1|B2|C1)\\b/);\n  return match ? match[1] : "";\n};\n\nconst getNextLevel = (value) => {\n  const current = normalizeLevel(value);\n  const index = LEVEL_ORDER.indexOf(current);\n  return index >= 0 && index < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[index + 1] : "";\n};\n\nconst createUpgradeId = (studentCode) =>\n  \`UPG-\${String(studentCode || "student").replace(/[^A-Za-z0-9_-]/g, "-")}-\${Date.now()}-\${crypto.randomBytes(4).toString("hex")}\`;\n\nconst activeContractEnd = (value, now = new Date()) => {\n  const date = value ? new Date(value) : null;\n  return date && !Number.isNaN(date.getTime()) && date.getTime() > now.getTime() ? date : null;\n};\n`,
    "payment constants",
  );

  const prepareRoutes = `\napp.post("/paystack/prepare-upgrade", async (req, res) => {\n  try {\n    const authedUser = await getAuthedUser(req);\n    if (!authedUser) return res.status(401).json({ error: "Please sign in again before upgrading." });\n\n    const body = req.body || {};\n    const requestedStudentCode = String(body.studentCode || body.student_code || body.studentcode || "").trim();\n    if (!requestedStudentCode) return res.status(400).json({ error: "Missing studentCode" });\n\n    const match = await findStudentByCodeOrEmail({\n      studentCode: requestedStudentCode,\n      email: authedUser.email,\n      uid: authedUser.uid,\n    });\n    if (!match) return res.status(404).json({ error: "Student not found" });\n\n    const student = match.snap.data() || {};\n    const studentEmail = String(student.email || "").trim().toLowerCase();\n    const authedEmail = String(authedUser.email || "").trim().toLowerCase();\n    if (student.uid && student.uid !== authedUser.uid && studentEmail !== authedEmail) {\n      return res.status(403).json({ error: "Not authorized for this student" });\n    }\n\n    const currentLevel = normalizeLevel(student.paidLevel || student.level);\n    const expectedTargetLevel = getNextLevel(currentLevel);\n    const requestedTargetLevel = normalizeLevel(body.targetLevel);\n    const targetLevel = requestedTargetLevel || expectedTargetLevel;\n    if (!currentLevel || !expectedTargetLevel) {\n      return res.status(400).json({ error: "This account has no next Falowen level to upgrade to." });\n    }\n    if (targetLevel !== expectedTargetLevel) {\n      return res.status(400).json({ error: \`The next eligible level is \${expectedTargetLevel}.\` });\n    }\n\n    const currentBilling = normalizeStudentBilling(student);\n    if (currentBilling.effectiveBalance > 0.01) {\n      return res.status(409).json({ error: "Please clear the current-level balance before upgrading." });\n    }\n    if (!activeContractEnd(student.contractEnd)) {\n      return res.status(409).json({ error: "The current paid contract has ended. Please renew before upgrading." });\n    }\n\n    const existingUpgradeStatus = String(student.upgradeStatus || "").trim().toLowerCase();\n    const existingUpgradeBalance = firstValidMoney(student.upgradeBalanceDue) ?? 0;\n    if (OPEN_UPGRADE_STATUSES.has(existingUpgradeStatus) && existingUpgradeBalance > 0) {\n      return res.status(409).json({ error: "This account already has an unfinished level upgrade." });\n    }\n\n    const studentCode = String(student.studentCode || student.studentcode || match.snap.id).trim();\n    const tuitionFee = LEVEL_FEES[targetLevel] || 0;\n    if (!tuitionFee) return res.status(400).json({ error: "No tuition fee is configured for that level." });\n\n    const upgradeId = createUpgradeId(studentCode);\n    const createdAt = new Date().toISOString();\n    const update = {\n      paidLevel: currentLevel,\n      upgradeId,\n      upgradeStatus: "awaiting_payment",\n      upgradeFromLevel: currentLevel,\n      upgradeToLevel: targetLevel,\n      upgradeCreatedAt: createdAt,\n      upgradeStartedAt: "",\n      upgradeGraceEnd: "",\n      upgradeTuitionFee: tuitionFee,\n      upgradePaid: 0,\n      upgradeBalanceDue: tuitionFee,\n      upgradePreviousLevel: currentLevel,\n      upgradePreviousClassName: String(student.className || ""),\n      upgradePreviousBalanceDue: currentBilling.effectiveBalance,\n      upgradePreviousPaymentStatus: String(student.paymentStatus || "paid"),\n      upgradePreviousStatus: String(student.status || "Active"),\n      upgradeTargetClassName: "",\n      paymentReminderLevel: "",\n      updated_at: admin.firestore.FieldValue.serverTimestamp(),\n    };\n\n    await match.ref.set(update, { merge: true });\n    return res.json({\n      ok: true,\n      studentUpdate: {\n        ...update,\n        updated_at: undefined,\n      },\n      targetLevel,\n      tuitionFee,\n    });\n  } catch (error) {\n    console.error("Prepare account upgrade error", error);\n    return res.status(500).json({ error: "Could not prepare the level upgrade." });\n  }\n});\n\napp.post("/paystack/cancel-upgrade", async (req, res) => {\n  try {\n    const authedUser = await getAuthedUser(req);\n    if (!authedUser) return res.status(401).json({ error: "Please sign in again." });\n    const body = req.body || {};\n    const requestedStudentCode = String(body.studentCode || body.student_code || body.studentcode || "").trim();\n    if (!requestedStudentCode) return res.status(400).json({ error: "Missing studentCode" });\n\n    const match = await findStudentByCodeOrEmail({\n      studentCode: requestedStudentCode,\n      email: authedUser.email,\n      uid: authedUser.uid,\n    });\n    if (!match) return res.status(404).json({ error: "Student not found" });\n    const student = match.snap.data() || {};\n    const studentEmail = String(student.email || "").trim().toLowerCase();\n    const authedEmail = String(authedUser.email || "").trim().toLowerCase();\n    if (student.uid && student.uid !== authedUser.uid && studentEmail !== authedEmail) {\n      return res.status(403).json({ error: "Not authorized for this student" });\n    }\n\n    const upgradeStatus = String(student.upgradeStatus || "").trim().toLowerCase();\n    const upgradePaid = firstValidMoney(student.upgradePaid) ?? 0;\n    if (upgradeStatus !== "awaiting_payment" || upgradePaid > 0) {\n      return res.status(409).json({ error: "An upgrade can only be cancelled before the first successful payment." });\n    }\n\n    const update = {\n      upgradeStatus: "cancelled",\n      upgradeCancelledAt: new Date().toISOString(),\n      upgradeToLevel: "",\n      upgradeTuitionFee: 0,\n      upgradePaid: 0,\n      upgradeBalanceDue: 0,\n      upgradeStartedAt: "",\n      upgradeGraceEnd: "",\n      paymentReminderLevel: "",\n      updated_at: admin.firestore.FieldValue.serverTimestamp(),\n    };\n    await match.ref.set(update, { merge: true });\n    return res.json({ ok: true });\n  } catch (error) {\n    console.error("Cancel account upgrade error", error);\n    return res.status(500).json({ error: "Could not cancel the level upgrade." });\n  }\n});\n`;

  content = replaceOnce(
    content,
    'app.post("/paystack/initialize", async (req, res) => {\n',
    `${prepareRoutes}\napp.post("/paystack/initialize", async (req, res) => {\n`,
    "Paystack initialize route",
  );

  content = replaceOnce(
    content,
    '    const { tuitionFee, paidSoFar, effectiveBalance: balanceDue } = normalizeStudentBilling(student);\n\n    if (balanceDue <= 0) return res.status(400).json({ error: "No balance due" });\n',
    `    const paymentPurpose = String(body.purpose || "balance").trim().toLowerCase();\n    let tuitionFee;\n    let paidSoFar;\n    let balanceDue;\n    if (paymentPurpose === "level_upgrade") {\n      const upgradeStatus = String(student.upgradeStatus || "").trim().toLowerCase();\n      if (!OPEN_UPGRADE_STATUSES.has(upgradeStatus)) {\n        return res.status(409).json({ error: "This account has no payable level upgrade." });\n      }\n      tuitionFee = firstValidMoney(student.upgradeTuitionFee) ?? 0;\n      paidSoFar = firstValidMoney(student.upgradePaid) ?? 0;\n      balanceDue = firstValidMoney(student.upgradeBalanceDue) ?? Math.max(roundMoney(tuitionFee - paidSoFar), 0);\n      if (!normalizeLevel(student.upgradeToLevel)) {\n        return res.status(409).json({ error: "The upgrade target level is missing." });\n      }\n    } else {\n      ({ tuitionFee, paidSoFar, effectiveBalance: balanceDue } = normalizeStudentBilling(student));\n    }\n\n    if (balanceDue <= 0) return res.status(400).json({ error: "No balance due" });\n`,
    "initialize billing selection",
  );

  content = replaceOnce(
    content,
    '    const planAfterPayment =\n      tuitionFee > 0 && paidSoFar + tuitionAmount >= tuitionFee ? "6-month" : "1-month";\n',
    `    const clearsSelectedBalance = Math.abs(tuitionAmount - balanceDue) < 0.5;\n    const planAfterPayment = clearsSelectedBalance\n      ? "6-month"\n      : paymentPurpose === "level_upgrade" && String(student.upgradeStatus || "").toLowerCase() === "expired"\n      ? "no-access-until-full"\n      : "1-month";\n`,
    "plan after payment",
  );

  content = replaceOnce(
    content,
    '    const metadata = {\n      studentCode,\n',
    `    const metadata = {\n      studentCode,\n      purpose: paymentPurpose,\n      upgradeId: paymentPurpose === "level_upgrade" ? String(student.upgradeId || "") : "",\n      targetLevel: paymentPurpose === "level_upgrade" ? normalizeLevel(student.upgradeToLevel) : "",\n`,
    "Paystack metadata",
  );

  const intentBlock = `    await match.ref.set(\n      {\n        paymentIntentAmount: tuitionAmount,\n        paymentIntentCheckoutAmount: fee.checkoutAmount,\n        paymentIntentStudentFeeContribution: fee.studentFeeContribution,\n        paymentIntentFeePolicy: "shared_50_50",\n        paystackReference: reference,\n        lastPaymentInitAt: admin.firestore.FieldValue.serverTimestamp(),\n        updated_at: admin.firestore.FieldValue.serverTimestamp(),\n      },\n      { merge: true }\n    );\n`;
  const intentReplacement = `    const paymentIntentUpdate = paymentPurpose === "level_upgrade"\n      ? {\n          upgradePaymentIntentAmount: tuitionAmount,\n          upgradePaymentIntentCheckoutAmount: fee.checkoutAmount,\n          upgradePaymentIntentStudentFeeContribution: fee.studentFeeContribution,\n          upgradePaymentIntentFeePolicy: "shared_50_50",\n          upgradePaystackReference: reference,\n          lastUpgradePaymentInitAt: admin.firestore.FieldValue.serverTimestamp(),\n          updated_at: admin.firestore.FieldValue.serverTimestamp(),\n        }\n      : {\n          paymentIntentAmount: tuitionAmount,\n          paymentIntentCheckoutAmount: fee.checkoutAmount,\n          paymentIntentStudentFeeContribution: fee.studentFeeContribution,\n          paymentIntentFeePolicy: "shared_50_50",\n          paystackReference: reference,\n          lastPaymentInitAt: admin.firestore.FieldValue.serverTimestamp(),\n          updated_at: admin.firestore.FieldValue.serverTimestamp(),\n        };\n    await match.ref.set(paymentIntentUpdate, { merge: true });\n`;
  content = replaceOnce(content, intentBlock, intentReplacement, "payment intent persistence");

  content = replaceOnce(
    content,
    '        studentCode,\n        email: payEmail,\n        tuitionAmount,\n',
    `        studentCode,\n        email: payEmail,\n        purpose: paymentPurpose,\n        upgradeId: paymentPurpose === "level_upgrade" ? String(student.upgradeId || "") : "",\n        targetLevel: paymentPurpose === "level_upgrade" ? normalizeLevel(student.upgradeToLevel) : "",\n        tuitionAmount,\n`,
    "Paystack init request audit",
  );

  content = replaceOnce(
    content,
    '    const { tuitionFee, paidSoFar: priorPaid, effectiveBalance: priorBalanceDue } =\n      normalizeStudentBilling(student);\n',
    `    const paymentPurpose = String(data?.metadata?.purpose || "balance").trim().toLowerCase();\n    let tuitionFee;\n    let priorPaid;\n    let priorBalanceDue;\n    if (paymentPurpose === "level_upgrade") {\n      const upgradeStatus = String(student.upgradeStatus || "").trim().toLowerCase();\n      if (!OPEN_UPGRADE_STATUSES.has(upgradeStatus)) {\n        return reject("upgrade_not_payable", { upgradeStatus });\n      }\n      tuitionFee = firstValidMoney(student.upgradeTuitionFee) ?? 0;\n      priorPaid = firstValidMoney(student.upgradePaid) ?? 0;\n      priorBalanceDue = firstValidMoney(student.upgradeBalanceDue) ?? Math.max(roundMoney(tuitionFee - priorPaid), 0);\n    } else {\n      ({ tuitionFee, paidSoFar: priorPaid, effectiveBalance: priorBalanceDue } = normalizeStudentBilling(student));\n    }\n`,
    "webhook billing selection",
  );

  const paymentStatusLine = '    const paymentStatus = tuitionFee && totalPaid < tuitionFee ? "partial" : "paid";\n';
  const upgradeWebhookBranch = `    const paymentStatus = tuitionFee && totalPaid < tuitionFee ? "partial" : "paid";\n\n    if (paymentPurpose === "level_upgrade") {\n      const upgradeStatus = String(student.upgradeStatus || "").trim().toLowerCase();\n      const targetLevel = normalizeLevel(data?.metadata?.targetLevel || student.upgradeToLevel);\n      const expectedTarget = normalizeLevel(student.upgradeToLevel);\n      if (!targetLevel || (expectedTarget && targetLevel !== expectedTarget)) {\n        return reject("upgrade_target_mismatch", { targetLevel, expectedTarget });\n      }\n\n      const paidAtDate = new Date(paidAtMs);\n      const upgradeCompleted = balanceDue <= 0.01;\n      const baseUpgradeUpdate = {\n        upgradePaid: totalPaid,\n        upgradeBalanceDue: balanceDue,\n        lastPaymentTuitionAmount: tuitionAmountPaid,\n        lastPaymentCheckoutAmount: checkoutAmountPaid,\n        lastPaymentStudentFeeContribution: studentFeeContribution,\n        lastPaymentFalowenFeeContribution: roundMoney(Math.max(paystackFee - studentFeeContribution, 0)),\n        lastPaymentPaystackFee: paystackFee,\n        lastPaymentFeePolicy: data?.metadata?.feePolicy || "legacy_merchant_paid",\n        lastPaymentProvider: "Paystack",\n        lastPaymentReference: reference,\n        lastPaymentAt: paidAtDate.toISOString(),\n        updated_at: admin.firestore.FieldValue.serverTimestamp(),\n      };\n      let updates = { ...baseUpgradeUpdate };\n\n      if (upgradeCompleted) {\n        const existingEnd = student.contractEnd ? new Date(student.contractEnd) : null;\n        const existingEndValid = existingEnd && !Number.isNaN(existingEnd.getTime());\n        const extensionBase = existingEndValid && existingEnd.getTime() >= paidAtDate.getTime()\n          ? existingEnd\n          : paidAtDate;\n        const extendedEnd = addMonths(extensionBase, 6);\n        const existingStart = student.contractStart ? new Date(student.contractStart) : null;\n        const existingStartValid = existingStart && !Number.isNaN(existingStart.getTime());\n        updates = {\n          ...updates,\n          level: targetLevel,\n          paidLevel: targetLevel,\n          className: String(student.upgradeTargetClassName || ""),\n          tuitionFee,\n          paid: totalPaid,\n          initialPaymentAmount: totalPaid,\n          balanceDue: 0,\n          balance: 0,\n          paymentStatus: "paid",\n          status: "Active",\n          contractStart: existingEndValid && existingEnd.getTime() >= paidAtDate.getTime() && existingStartValid\n            ? existingStart.toISOString()\n            : paidAtDate.toISOString(),\n          contractEnd: extendedEnd ? extendedEnd.toISOString() : "",\n          contractTermMonths: 6,\n          upgradeStatus: "completed",\n          upgradeCompletedAt: paidAtDate.toISOString(),\n          paymentReminderLevel: "",\n        };\n      } else if (upgradeStatus === "awaiting_payment") {\n        const graceEnd = addMonths(paidAtDate, 1);\n        updates = {\n          ...updates,\n          level: targetLevel,\n          paidLevel: normalizeLevel(student.paidLevel || student.upgradeFromLevel || student.level),\n          className: String(student.upgradeTargetClassName || ""),\n          balanceDue,\n          balance: balanceDue,\n          paymentStatus: "partial",\n          status: "Active",\n          upgradeStatus: "pending",\n          upgradeStartedAt: paidAtDate.toISOString(),\n          upgradeGraceEnd: graceEnd ? graceEnd.toISOString() : "",\n          paymentReminderLevel: targetLevel,\n        };\n      } else if (upgradeStatus === "pending") {\n        updates = {\n          ...updates,\n          level: targetLevel,\n          balanceDue,\n          balance: balanceDue,\n          paymentStatus: "partial",\n          status: "Active",\n          paymentReminderLevel: targetLevel,\n        };\n      } else if (upgradeStatus === "expired") {\n        // Payments after expiry remain auditable and reduce the upgrade balance,\n        // but only a full payoff restores the next level. No second grace month.\n        updates = { ...updates, upgradeStatus: "expired" };\n      }\n\n      await match.ref.set(updates, { merge: true });\n      await appendStudentToStudentsSheetSafely({ ...student, ...updates }).catch((error) => {\n        console.warn("Upgrade payment succeeded but sheet sync failed", error?.message || error);\n      });\n\n      await eventRef.set(\n        {\n          status: "handled",\n          studentId: match.ref.id,\n          studentCode,\n          email,\n          purpose: paymentPurpose,\n          upgradeId: String(student.upgradeId || data?.metadata?.upgradeId || ""),\n          targetLevel,\n          checkoutAmount: checkoutAmountPaid,\n          tuitionAmount: tuitionAmountPaid,\n          paymentStatus,\n          balanceDue,\n          upgradeStatus: upgradeCompleted ? "completed" : upgradeStatus === "awaiting_payment" ? "pending" : upgradeStatus,\n          handledAt: admin.firestore.FieldValue.serverTimestamp(),\n        },\n        { merge: true }\n      );\n\n      return res.json({\n        status: "synced",\n        purpose: paymentPurpose,\n        targetLevel,\n        paymentStatus,\n        balanceDue,\n        upgradeStatus: upgradeCompleted ? "completed" : upgradeStatus === "awaiting_payment" ? "pending" : upgradeStatus,\n        contractEnd: updates.contractEnd || student.contractEnd || "",\n      });\n    }\n`;
  content = replaceOnce(content, paymentStatusLine, upgradeWebhookBranch, "upgrade webhook branch");

  write(file, content);
}

function patchTuitionCard() {
  const file = "web/src/components/TuitionStatusCardLegacy.js";
  let content = read(file);
  if (content.includes(`const ${MARKER}`)) return;

  content = replaceOnce(
    content,
    'const PAYMENT_GRACE_PERIOD_DAYS = 7;\n',
    `const PAYMENT_GRACE_PERIOD_DAYS = 7;\nconst ${MARKER} = true;\n`,
    "tuition card marker",
  );
  content = replaceOnce(
    content,
    '  checkoutAmountOverride,\n}) => {\n',
    '  checkoutAmountOverride,\n  paymentPurpose = "balance",\n}) => {\n',
    "tuition card props",
  );
  content = replaceOnce(
    content,
    '          studentCode,\n          amount: amountToPay,\n          redirectUrl: `${window.location.origin}/payment-complete`,\n',
    '          studentCode,\n          amount: amountToPay,\n          purpose: paymentPurpose,\n          redirectUrl: `${window.location.origin}/payment-complete`,\n',
    "tuition payment purpose",
  );

  const graceStart = '  const paymentGraceNotice = useMemo(() => {\n    const paymentStatus = `${studentProfile?.paymentStatus || ""}`.toLowerCase();\n';
  const graceReplacement = `  const paymentGraceNotice = useMemo(() => {\n    if (String(paymentPurpose || "balance").toLowerCase() === "level_upgrade") {\n      const upgradeStatus = String(studentProfile?.upgradeStatus || "").toLowerCase();\n      if (upgradeStatus === "expired") return { daysLeft: 0, isExpired: true };\n      if (upgradeStatus === "pending") {\n        const graceEndMs = new Date(studentProfile?.upgradeGraceEnd || "").getTime();\n        if (Number.isFinite(graceEndMs)) {\n          const millisecondsLeft = graceEndMs - Date.now();\n          return {\n            daysLeft: Math.max(Math.ceil(millisecondsLeft / (24 * 60 * 60 * 1000)), 0),\n            isExpired: millisecondsLeft <= 0,\n          };\n        }\n      }\n      return null;\n    }\n\n    const paymentStatus = \`${studentProfile?.paymentStatus || ""}\`.toLowerCase();\n`;
  content = replaceOnce(content, graceStart, graceReplacement, "upgrade grace notice");
  content = replaceOnce(
    content,
    '    studentProfile?.upgradeCarryoverUntil,\n  ]);\n',
    '    studentProfile?.upgradeCarryoverUntil,\n    studentProfile?.upgradeGraceEnd,\n    studentProfile?.upgradeStatus,\n    paymentPurpose,\n  ]);\n',
    "grace notice dependencies",
  );

  write(file, content);
}

function patchAuthContext() {
  const file = "web/src/context/AuthContext.js";
  let content = read(file);
  if (content.includes(`const ${MARKER}`)) return;

  content = replaceOnce(
    content,
    'const BLOCKED_PAYMENT_STATUSES = ["failed", "overdue", "rejected", "cancelled", "canceled"];\n',
    `const BLOCKED_PAYMENT_STATUSES = ["failed", "overdue", "rejected", "cancelled", "canceled"];\nconst ${MARKER} = true;\n\nconst hasActiveUpgradeGrace = (profile) => {\n  if (String(profile?.upgradeStatus || "").trim().toLowerCase() !== "pending") return false;\n  const graceEndMs = toMillis(profile?.upgradeGraceEnd);\n  return Number.isFinite(graceEndMs) && graceEndMs > Date.now();\n};\n`,
    "AuthContext access constants",
  );
  content = replaceOnce(
    content,
    '  if (Number.isFinite(contractEndMs) && contractEndMs <= Date.now()) return "contract_ended";\n',
    '  if (Number.isFinite(contractEndMs) && contractEndMs <= Date.now() && !hasActiveUpgradeGrace(profile)) return "contract_ended";\n',
    "support reason contract grace",
  );
  content = replaceOnce(
    content,
    '  if (Number.isFinite(contractEndMs) && contractEndMs <= Date.now()) {\n    return `Your contract ended on ${formatDateForLoginError(profile.contractEnd)}. Please renew your contract or contact support.`;\n  }\n',
    '  if (Number.isFinite(contractEndMs) && contractEndMs <= Date.now() && !hasActiveUpgradeGrace(profile)) {\n    return `Your contract ended on ${formatDateForLoginError(profile.contractEnd)}. Please renew your contract or contact support.`;\n  }\n',
    "login contract grace",
  );

  write(file, content);
}

function patchGeneralHome() {
  const file = "web/src/components/GeneralHome.js";
  let content = read(file);
  if (content.includes(`const ${MARKER}`)) return;

  content = replaceOnce(
    content,
    'const selfLearningLevels = new Set(["B2", "C1"]);\n',
    `const selfLearningLevels = new Set(["B2", "C1"]);\nconst ${MARKER} = true;\n`,
    "GeneralHome marker",
  );
  content = replaceOnce(
    content,
    'const formatContractStatus = (studentProfile = {}) => {\n  const contractEndMs = toDateMs(studentProfile.contractEnd);\n',
    `const formatContractStatus = (studentProfile = {}) => {\n  const upgradeStatus = String(studentProfile?.upgradeStatus || "").toLowerCase();\n  const upgradeGraceEndMs = toDateMs(studentProfile?.upgradeGraceEnd);\n  if (upgradeStatus === "pending" && Number.isFinite(upgradeGraceEndMs) && upgradeGraceEndMs > Date.now()) {\n    const target = String(studentProfile?.upgradeToLevel || studentProfile?.level || "next level").toUpperCase();\n    return \`Temporary \${target} access until \${formatDate(upgradeGraceEndMs)}\`;\n  }\n\n  const contractEndMs = toDateMs(studentProfile.contractEnd);\n`,
    "GeneralHome upgrade access status",
  );

  write(file, content);
}

function patchAccountSettings() {
  const file = "web/src/components/AccountSettings.js";
  let content = read(file);
  if (content.includes(`const ${MARKER}`)) return;

  content = replaceOnce(
    content,
    'const formatDate = (value) => {\n',
    `const ${MARKER} = true;\n\nconst formatDate = (value) => {\n`,
    "AccountSettings marker",
  );
  content = replaceOnce(
    content,
    '  const { user, studentProfile, saveStudentProfile } = useAuth();\n',
    '  const { user, studentProfile, idToken } = useAuth();\n',
    "AccountSettings auth values",
  );

  const oldBilling = `  const billingSummary = useMemo(() => {\n    const paid = Math.max(Number(studentProfile?.paid ?? studentProfile?.initialPaymentAmount ?? 0) || 0, 0);\n    const tuition = Math.max(Number(studentProfile?.tuitionFee ?? getTuitionFeeForLevel(studentProfile?.level)) || 0, 0);\n    const explicitBalanceRaw = studentProfile?.balanceDue ?? studentProfile?.balance;\n    const explicitBalance = explicitBalanceRaw === undefined || explicitBalanceRaw === null\n      ? null\n      : Math.max(Number(explicitBalanceRaw) || 0, 0);\n    const derivedBalance = Math.max(tuition - paid, 0);\n    const balanceDue = explicitBalance === null ? derivedBalance : Math.min(explicitBalance, derivedBalance);\n    return { paidAmount: paid, tuitionFee: tuition, balanceDue };\n  }, [studentProfile]);\n`;
  const newBilling = `  const billingSummary = useMemo(() => {\n    const upgradeStatus = String(studentProfile?.upgradeStatus || "").toLowerCase();\n    if (upgradeStatus === "pending") {\n      const tuition = Math.max(Number(studentProfile?.upgradeTuitionFee || 0) || 0, 0);\n      const paid = Math.max(Number(studentProfile?.upgradePaid || 0) || 0, 0);\n      const balanceDue = Math.max(Number(studentProfile?.upgradeBalanceDue ?? Math.max(tuition - paid, 0)) || 0, 0);\n      return { paidAmount: paid, tuitionFee: tuition, balanceDue, isUpgrade: true };\n    }\n\n    const paid = Math.max(Number(studentProfile?.paid ?? studentProfile?.initialPaymentAmount ?? 0) || 0, 0);\n    const tuition = Math.max(Number(studentProfile?.tuitionFee ?? getTuitionFeeForLevel(studentProfile?.level)) || 0, 0);\n    const explicitBalanceRaw = studentProfile?.balanceDue ?? studentProfile?.balance;\n    const explicitBalance = explicitBalanceRaw === undefined || explicitBalanceRaw === null\n      ? null\n      : Math.max(Number(explicitBalanceRaw) || 0, 0);\n    const derivedBalance = Math.max(tuition - paid, 0);\n    const balanceDue = explicitBalance === null ? derivedBalance : Math.min(explicitBalance, derivedBalance);\n    return { paidAmount: paid, tuitionFee: tuition, balanceDue, isUpgrade: false };\n  }, [studentProfile]);\n`;
  content = replaceOnce(content, oldBilling, newBilling, "upgrade-aware billing summary");

  const handlerRegex = /  const queuedUpgradeLevel = String\(studentProfile\?\.upgradeToLevel \|\| ""\)\.toUpperCase\(\);[\s\S]*?\n  if \(!studentProfile\) \{/;
  const newHandlers = `  const upgradeStatus = String(studentProfile?.upgradeStatus || "").trim().toLowerCase();\n  const queuedUpgradeLevel = String(studentProfile?.upgradeToLevel || "").toUpperCase();\n  const upgradeBalanceDue = Math.max(Number(studentProfile?.upgradeBalanceDue || 0) || 0, 0);\n  const hasOpenUpgrade = ["awaiting_payment", "pending", "expired"].includes(upgradeStatus) && Boolean(queuedUpgradeLevel) && upgradeBalanceDue > 0;\n\n  const levelUpgrade = useMemo(() => {\n    const currentLevel = String(studentProfile?.paidLevel || studentProfile?.level || "").toUpperCase();\n    const nextLevel = hasOpenUpgrade ? queuedUpgradeLevel : getNextLevel(String(studentProfile?.level || currentLevel).toUpperCase());\n\n    if (hasOpenUpgrade) {\n      return {\n        currentLevel,\n        nextLevel: queuedUpgradeLevel,\n        canUpgrade: false,\n        reason: upgradeStatus === "pending"\n          ? \`Temporary \${queuedUpgradeLevel} access is active while the remaining balance is due.\`\n          : upgradeStatus === "expired"\n          ? \`The temporary \${queuedUpgradeLevel} access ended. Full payment of the remaining balance will reactivate it.\`\n          : \`The \${queuedUpgradeLevel} upgrade is ready for payment. Access changes only after a successful payment.\`,\n      };\n    }\n\n    if (!nextLevel) {\n      return { currentLevel, nextLevel: null, canUpgrade: false, reason: t("accountSettings.upgrade.maxedOut") };\n    }\n\n    const currentBalance = Math.max(Number(studentProfile?.balanceDue ?? studentProfile?.balance ?? 0) || 0, 0);\n    if (currentBalance > 0) {\n      return { currentLevel, nextLevel, canUpgrade: false, reason: t("accountSettings.upgrade.clearBalance") };\n    }\n\n    return {\n      currentLevel,\n      nextLevel,\n      nextTuitionFee: getTuitionFeeForLevel(nextLevel),\n      canUpgrade: true,\n      reason: "",\n    };\n  }, [hasOpenUpgrade, queuedUpgradeLevel, studentProfile?.balance, studentProfile?.balanceDue, studentProfile?.level, studentProfile?.paidLevel, t, upgradeStatus]);\n\n  const postUpgradeAction = async (path, body = {}) => {\n    if (!idToken) throw new Error("Your login session is missing. Please refresh and try again.");\n    const studentCode = studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || user?.uid || "";\n    if (!studentCode) throw new Error("Missing student code. Please re-login or contact support.");\n    const response = await fetch(\`${window.location.origin}/api/paystack/\${path}\`, {\n      method: "POST",\n      headers: {\n        "Content-Type": "application/json",\n        Authorization: \`Bearer \${idToken}\`,\n      },\n      body: JSON.stringify({ studentCode, ...body }),\n    });\n    const json = await response.json().catch(() => ({}));\n    if (!response.ok) throw new Error(json?.error || "Could not update the level upgrade.");\n    return json;\n  };\n\n  const handleUpgradeToNextLevel = async () => {\n    if (hasOpenUpgrade || !levelUpgrade?.canUpgrade || !levelUpgrade?.nextLevel) return;\n    setIsUpgradingLevel(true);\n    setStatus("");\n    try {\n      const nextLevel = levelUpgrade.nextLevel;\n      await postUpgradeAction("prepare-upgrade", { targetLevel: nextLevel });\n      setStatus(\`${nextLevel} upgrade prepared. Pay the full fee for a 6-month extension, or make a partial payment to start 1 month of temporary access.\`);\n    } catch (error) {\n      setStatus(error instanceof Error ? error.message : t("accountSettings.upgrade.error"));\n    } finally {\n      setIsUpgradingLevel(false);\n    }\n  };\n\n  const handleCancelQueuedUpgrade = async () => {\n    if (upgradeStatus !== "awaiting_payment") return;\n    setIsUpgradingLevel(true);\n    setStatus("");\n    try {\n      await postUpgradeAction("cancel-upgrade");\n      setStatus(t("accountSettings.upgrade.cancelled"));\n    } catch (error) {\n      setStatus(error instanceof Error ? error.message : t("accountSettings.upgrade.error"));\n    } finally {\n      setIsUpgradingLevel(false);\n    }\n  };\n\n  if (!studentProfile) {`;
  content = replaceRegex(content, handlerRegex, newHandlers, "AccountSettings upgrade handlers");

  const upgradeUiRegex = /      \{activeTab === "upgrade" \? \([\s\S]*?      \) : null\}\n    <\/div>/;
  const newUpgradeUi = `      {activeTab === "upgrade" ? (\n      <section style={styles.card}>\n        <h2 style={styles.sectionTitle}>{t("accountSettings.upgrade.title")}</h2>\n        {hasOpenUpgrade ? (\n          <>\n            <p style={styles.helperText}>{levelUpgrade.reason}</p>\n            {upgradeStatus === "pending" ? (\n              <div style={{ ...styles.errorBox, background: "#eff6ff", borderColor: "#93c5fd", color: "#1e3a8a", marginBottom: 10 }}>\n                <strong>1-month temporary {queuedUpgradeLevel} access is active.</strong>\n                <p style={{ ...styles.helperText, margin: "4px 0 0", color: "#1e3a8a" }}>\n                  Complete the remaining {formatMoney(upgradeBalanceDue)} by {formatDate(studentProfile?.upgradeGraceEnd)}. Additional partial payments do not restart the one-month period.\n                </p>\n              </div>\n            ) : null}\n            {upgradeStatus === "expired" ? (\n              <div style={{ ...styles.errorBox, marginBottom: 10 }}>\n                Temporary access has ended. A partial payment now reduces the balance but does not grant another month. Full payment reactivates {queuedUpgradeLevel} and adds 6 months.\n              </div>\n            ) : null}\n            {upgradeStatus === "awaiting_payment" ? (\n              <div style={{ ...styles.card, margin: "0 0 10px", background: "#f8fafc" }}>\n                <strong>No access has changed yet.</strong>\n                <p style={{ ...styles.helperText, margin: "4px 0 0" }}>\n                  Full payment immediately activates {queuedUpgradeLevel} and adds 6 months. A partial payment starts one month of temporary {queuedUpgradeLevel} access.\n                </p>\n              </div>\n            ) : null}\n\n            <TuitionStatusCard\n              level={queuedUpgradeLevel}\n              paidAmount={Math.max(Number(studentProfile?.upgradePaid || 0) || 0, 0)}\n              balanceDue={upgradeBalanceDue}\n              tuitionFee={Math.max(Number(studentProfile?.upgradeTuitionFee || getTuitionFeeForLevel(queuedUpgradeLevel)) || 0, 0)}\n              checkoutAmountOverride={upgradeBalanceDue}\n              paymentPurpose="level_upgrade"\n              title={\`${queuedUpgradeLevel} upgrade payment\`}\n              description={\`Remaining upgrade balance. Your previous paid contract stays protected until this upgrade is fully paid.\`}\n            />\n\n            {upgradeStatus === "awaiting_payment" ? (\n              <button\n                type="button"\n                style={{ ...styles.secondaryButton, marginTop: 8 }}\n                onClick={handleCancelQueuedUpgrade}\n                disabled={isUpgradingLevel}\n              >\n                {t("accountSettings.upgrade.cancel")}\n              </button>\n            ) : null}\n            {status ? <p style={{ ...styles.helperText, marginTop: 8 }}>{status}</p> : null}\n          </>\n        ) : levelUpgrade.nextLevel ? (\n          <>\n            <p style={styles.helperText}>{t("accountSettings.upgrade.description", { currentLevel: levelUpgrade.currentLevel, nextLevel: levelUpgrade.nextLevel, amount: formatMoney(levelUpgrade.nextTuitionFee || 0) })}</p>\n            <button type="button" style={styles.primaryButton} onClick={handleUpgradeToNextLevel} disabled={!levelUpgrade.canUpgrade || isUpgradingLevel}>\n              {isUpgradingLevel ? t("accountSettings.upgrade.upgrading") : t("accountSettings.upgrade.button", { nextLevel: levelUpgrade.nextLevel })}\n            </button>\n            {status ? <p style={{ ...styles.helperText, marginTop: 8 }}>{status}</p> : null}\n            {levelUpgrade.reason ? <p style={{ ...styles.helperText, color: "#92400e" }}>{levelUpgrade.reason}</p> : null}\n          </>\n        ) : (\n          <p style={styles.helperText}>{levelUpgrade.reason}</p>\n        )}\n      </section>\n      ) : null}\n    </div>`;
  content = replaceRegex(content, upgradeUiRegex, newUpgradeUi, "AccountSettings upgrade UI");

  write(file, content);
}

patchPaymentAwareApp();
patchTuitionCard();
patchAuthContext();
patchGeneralHome();
patchAccountSettings();
console.log("Payment-driven Falowen account upgrade patch applied.");
