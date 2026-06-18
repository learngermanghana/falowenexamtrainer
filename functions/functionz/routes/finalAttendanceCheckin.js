const express = require("express");
const admin = require("firebase-admin");

const ATTENDANCE_CHECKIN_SOURCES = new Set(["falowen_student_app", "public_checkin"]);

const normalizeText = (value) => String(value || "").trim();
const normalizeComparable = (value) => normalizeText(value).toLowerCase();

const toMillis = (value) => {
  if (!value) return null;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.toDate === "function") return value.toDate().getTime();
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : null;
};

const isAttendanceSessionOpen = (session = {}, now = Date.now()) => {
  const openFromMs = toMillis(session.openFrom);
  const openToMs = toMillis(session.openTo);

  if (Object.prototype.hasOwnProperty.call(session, "opened")) {
    return (
      session.opened === true &&
      (!Number.isFinite(openFromMs) || now >= openFromMs) &&
      (!Number.isFinite(openToMs) || now <= openToMs)
    );
  }

  const status = normalizeComparable(session.status);
  const active = session.active === true || session.isActive === true || status === "open" || status === "active";
  const closed = session.closed === true || session.isClosed === true || status === "closed";
  const expiryMs = toMillis(session.expiresAt || session.endsAt || session.closesAt || session.activeUntil);

  return active && !closed && (!Number.isFinite(expiryMs) || expiryMs > now);
};

const isPresentAttendanceEntry = (entry) => {
  if (entry === true) return true;
  if (!entry || typeof entry !== "object") return false;
  const status = normalizeComparable(entry.status || entry.attendance);
  return entry.present === true || entry.attended === true || status === "present";
};

const uniqueNonEmpty = (values) => [...new Set(values.map(normalizeText).filter(Boolean))];

async function findAuthenticatedStudent(db, authedUser) {
  const studentsRef = db.collection("students");
  const direct = await studentsRef.doc(authedUser.uid).get();
  if (direct.exists) return { snap: direct, data: direct.data() || {} };

  const queries = [
    studentsRef.where("uid", "==", authedUser.uid).limit(1),
    studentsRef.where("studentCode", "==", authedUser.uid).limit(1),
    authedUser.email
      ? studentsRef.where("email", "==", normalizeComparable(authedUser.email)).limit(1)
      : null,
  ].filter(Boolean);

  for (const query of queries) {
    const snapshot = await query.get();
    if (!snapshot.empty) {
      const snap = snapshot.docs[0];
      return { snap, data: snap.data() || {} };
    }
  }

  return null;
}

function createFinalAttendanceCheckinRouter({ adminInstance = admin } = {}) {
  const router = express.Router();
  router.use(express.json({ limit: "1mb" }));

  router.post("/attendance/checkin", async (req, res) => {
    try {
      const authorization = String(req.headers.authorization || "");
      const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
      if (!tokenMatch) return res.status(401).json({ error: "Authentication required" });

      let authedUser;
      try {
        authedUser = await adminInstance.auth().verifyIdToken(tokenMatch[1]);
      } catch (error) {
        return res.status(401).json({ error: "Invalid or expired authentication token" });
      }

      const db = adminInstance.firestore();
      const {
        className: rawClassName = "",
        sessionId: rawSessionId = "",
        source = "falowen_student_app",
      } = req.body || {};
      const className = normalizeText(rawClassName);
      const sessionId = normalizeText(rawSessionId);

      if (!className || !sessionId) {
        return res.status(400).json({ error: "className and sessionId are required" });
      }
      if (!ATTENDANCE_CHECKIN_SOURCES.has(source)) {
        return res.status(400).json({ error: "Invalid attendance source" });
      }

      const student = await findAuthenticatedStudent(db, authedUser);
      if (!student) return res.status(404).json({ error: "Student profile not found" });

      const studentData = student.data;
      const studentClass =
        studentData.className || studentData.class || studentData.classId || studentData.course || "";
      if (normalizeComparable(studentClass) !== normalizeComparable(className)) {
        return res.status(403).json({ error: "Attendance session is not for your class" });
      }

      const studentCode = normalizeText(
        studentData.studentCode || studentData.studentcode || student.snap.id || authedUser.uid
      );
      const email = normalizeComparable(studentData.email || authedUser.email);
      const phone = normalizeText(
        studentData.phone ||
          studentData.phoneNumber ||
          studentData.phone_number ||
          studentData.whatsapp ||
          studentData.contactNumber
      );
      const method = source === "falowen_student_app" ? "falowen_button" : "qr";

      const sessionRef = db.collection("attendance").doc(className).collection("sessions").doc(sessionId);
      const checkinIds = uniqueNonEmpty([authedUser.uid, student.snap.id, studentCode]);
      const checkinRefs = checkinIds.map((id) => sessionRef.collection("checkins").doc(id));
      const primaryCheckinRef = checkinRefs[0];

      const result = await db.runTransaction(async (transaction) => {
        const sessionSnapshot = await transaction.get(sessionRef);
        if (!sessionSnapshot.exists) {
          throw Object.assign(new Error("Attendance session not found"), { status: 404 });
        }

        const session = sessionSnapshot.data() || {};
        if (!isAttendanceSessionOpen(session)) {
          throw Object.assign(new Error("Attendance session is not active"), { status: 409 });
        }

        const existingSnapshots = [];
        for (const ref of checkinRefs) {
          existingSnapshots.push(await transaction.get(ref));
        }
        if (existingSnapshots.some((snapshot) => snapshot.exists)) {
          return { duplicate: true };
        }

        const attendance = session.attendance || {};
        if (isPresentAttendanceEntry(attendance[studentCode])) {
          return { duplicate: true };
        }

        const timestamp = adminInstance.firestore.FieldValue.serverTimestamp();
        const checkinPayload = {
          uid: authedUser.uid,
          studentUid: authedUser.uid,
          studentCode,
          name: normalizeText(studentData.name || studentData.fullName),
          email,
          phone,
          phoneNumber: phone,
          classId: className,
          className,
          sessionId,
          status: "present",
          present: true,
          method,
          source,
          checkedInAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        transaction.set(primaryCheckinRef, checkinPayload, { merge: false });
        transaction.set(
          sessionRef,
          {
            attendance: {
              [studentCode]: {
                status: "present",
                present: true,
                method,
                source,
                studentUid: authedUser.uid,
                email,
                phone,
                checkedInAt: timestamp,
              },
            },
            updatedAt: timestamp,
          },
          { merge: true }
        );

        return { duplicate: false };
      });

      return res.json({
        ok: true,
        duplicate: result.duplicate,
        status: "present",
        method,
        source,
      });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message || "Could not check in" });
    }
  });

  return router;
}

module.exports = {
  createFinalAttendanceCheckinRouter,
  isAttendanceSessionOpen,
  isPresentAttendanceEntry,
  uniqueNonEmpty,
};
