import { courseProfile, enrolledCourses, readCoursePreference, saveCoursePreference, secondaryAccessExpiry } from "../utils/courseEnrollment";
import { enrollmentDecision } from "../utils/levelEnrollmentAccess";
import { ReadingStudentContext } from "../services/savedReadingPhrases";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  onIdTokenChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  requestMessagingToken,
  getPushEnvironment,
  db,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  setDoc,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  isFirebaseConfigured,
  deleteField,
  getActionCodeSettings,
  reload,
  limit,
  addDoc,
  runTransaction,
  GoogleAuthProvider,
} from "../firebase";
import {
  getMessagingTokenForDevice,
  mergeMessagingTokenForDevice,
  removeMessagingTokenForDevice,
} from "../utils/devicePushTokens";
import { getBackendUrl } from "../services/backendUrl";
import { createOrResumeSignupAccount } from "../lib/signupAuthRecovery";
import { checkSignupDuplicate } from "../lib/signupDuplicateCheck";
import { areSameContactNumber } from "../lib/signupContactValidation";
import { canonicalEmail, canonicalName, canonicalPhone } from "../lib/signupIdentity";
import { isUniversityInvitationOpen, resolveUniversityInvitation } from "../lib/universityInvitations";
import { getDocFromServer } from "firebase/firestore";

const AuthContext = createContext();

const DEVICE_ID_STORAGE_KEY = "falowenMessagingDeviceId";

const getDeviceId = () => {
  if (typeof window === "undefined") return "unknown";
  let storedId = window.localStorage?.getItem(DEVICE_ID_STORAGE_KEY);
  if (!storedId) {
    storedId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage?.setItem(DEVICE_ID_STORAGE_KEY, storedId);
  }
  return storedId;
};

const getDevicePlatform = () => {
  if (typeof navigator === "undefined") return "web";
  return navigator.platform || navigator.userAgent || "web";
};

const getMessagingTokenFromProfile = getMessagingTokenForDevice;

const isServerTimestampValue = (value) =>
  Boolean(value && typeof value === "object" && value._methodName === "serverTimestamp");

const toTimestamp = (value) => {
  if (!value) return Timestamp.now();
  if (value instanceof Timestamp) return value;
  if (value instanceof Date) return Timestamp.fromDate(value);
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.valueOf())) {
      return Timestamp.fromDate(date);
    }
  }
  if (isServerTimestampValue(value)) return Timestamp.now();
  return Timestamp.now();
};

const toIsoString = (value) => {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  if (typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.valueOf())) return date.toISOString();
  }
  return null;
};

const normalizeMessagingTokensForFirestore = (tokens = []) =>
  tokens
    .filter((entry) => entry?.token && entry?.deviceId)
    .map((entry) => ({
      token: entry.token,
      deviceId: entry.deviceId,
      platform: entry.platform || "web",
      lastSeen: toTimestamp(entry.lastSeen),
    }));

const normalizeMessagingTokensForState = (tokens = []) =>
  tokens
    .filter((entry) => entry?.token && entry?.deviceId)
    .map((entry) => ({
      token: entry.token,
      deviceId: entry.deviceId,
      platform: entry.platform || "web",
      lastSeen: toIsoString(entry.lastSeen),
    }));


const toMillis = (value) => {
  if (!value) return NaN;
  if (value instanceof Timestamp) return value.toDate().getTime();
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = new Date(value).getTime();
    return Number.isFinite(parsed) ? parsed : NaN;
  }
  if (typeof value === "object" && typeof value.toDate === "function") {
    return value.toDate().getTime();
  }
  return NaN;
};

const formatDateForLoginError = (value) => {
  const millis = toMillis(value);
  if (!Number.isFinite(millis)) return "the recorded end date";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric" }).format(new Date(millis));
};

const normalizePaymentStatus = (value) => String(value || "").trim().toLowerCase();

const ACTIVE_STUDENT_STATUSES = ["active", "paid", "partial", "pending", "enrolled", "registered", "ongoing", "current", "trial_active", "trial_expired"];
const BLOCKED_PAYMENT_STATUSES = ["failed", "overdue", "rejected", "cancelled", "canceled"];

const getStudentSupportReason = (profile, fallbackReason = "student_access_blocked") => {
  if (!profile) return "profile_not_found";
  const status = String(profile.status || "").trim().toLowerCase();
  if (status && !ACTIVE_STUDENT_STATUSES.includes(status)) return "inactive_status";

  const contractEndMs = toMillis(profile.contractEnd);
  if (Number.isFinite(contractEndMs) && contractEndMs <= Date.now()) return "contract_ended";

  const paymentStatus = normalizePaymentStatus(profile.paymentStatus);
  if (BLOCKED_PAYMENT_STATUSES.includes(paymentStatus)) return "payment_status";

  return fallbackReason;
};

const buildStudentSupportDiagnostic = (profile, reason = "student_access_blocked") => ({
  reason: getStudentSupportReason(profile, reason),
  status: profile?.status || "",
  studentCode: profile?.studentCode || profile?.studentcode || profile?.id || "",
  email: profile?.email || "",
  contractEnd: profile?.contractEnd ? formatDateForLoginError(profile.contractEnd) : "",
  paymentStatus: profile?.paymentStatus || "",
  profile,
});

const getStudentAccessBlockReason = (profile, hasIndependentContracts = false) => {
  if (!profile) return "No student profile was found for this login. Please contact support.";

  const status = String(profile.status || "").trim().toLowerCase();
  if (status && !ACTIVE_STUDENT_STATUSES.includes(status)) {
    return `Login blocked because this student record is marked ${profile.status}.`;
  }
  if(hasIndependentContracts)return "";

  const contractEndMs = toMillis(profile.contractEnd);
  if (Number.isFinite(contractEndMs) && contractEndMs <= Date.now()) {
    return `Your contract ended on ${formatDateForLoginError(profile.contractEnd)}. Please renew your contract or contact support.`;
  }

  const paymentStatus = normalizePaymentStatus(profile.paymentStatus);
  if (BLOCKED_PAYMENT_STATUSES.includes(paymentStatus)) {
    return `Login blocked because this student payment status is ${profile.paymentStatus}. Please complete your payment or contact support.`;
  }

  return "";
};

async function hasIndependentContracts(profile,user){
  if(!profile?.id||!user?.uid||profile.uid!==user.uid)return false;
  const {getDocs,query,limit}=await import("firebase/firestore");
  try{const snap=await getDocs(query(collection(db,"students",profile.id,"levelEnrollments"),limit(1)));return !snap.empty;}catch{return false;}
}
class LoginDiagnosticError extends Error {
  constructor(message, diagnostic = {}) {
    super(message);
    this.name = "LoginDiagnosticError";
    this.code = diagnostic.code || "auth/login-diagnostic";
    this.diagnostic = diagnostic;
  }
}

const fetchLoginDiagnostic = async (identifier) => {
  const baseUrl = getBackendUrl();
  if (!baseUrl || !identifier?.trim()) return null;

  const response = await fetch(`${baseUrl}/auth/login-diagnostics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier }),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json?.error || "Could not check this login account.");
  }
  return json;
};

const throwIfDiagnosticBlocksLogin = (diagnostic) => {
  if (!diagnostic) return;
  if (diagnostic.reason === "contract_ended") {
    throw new LoginDiagnosticError(
      `Your contract ended on ${diagnostic.contractEndLabel || "the recorded end date"}. Please renew your contract or contact support.`,
      { ...diagnostic, code: "auth/contract-ended" }
    );
  }
  if (diagnostic.reason === "inactive_status") {
    const status = String(diagnostic.status || diagnostic.profile?.status || "").trim();
    if (ACTIVE_STUDENT_STATUSES.includes(status.toLowerCase())) return;
    throw new LoginDiagnosticError(
      `Login blocked because this student record is marked ${status || "not active"}.`,
      { ...diagnostic, status, code: "auth/account-inactive" }
    );
  }
  if (diagnostic.reason === "payment_status") {
    throw new LoginDiagnosticError(
      `Login blocked because this student payment status is ${diagnostic.paymentStatus || diagnostic.profile?.paymentStatus || "not accepted"}. Please complete your payment or contact support.`,
      { ...diagnostic, code: "auth/payment-status-blocked" }
    );
  }
};

const buildCredentialMismatchError = (identifier) =>
  new LoginDiagnosticError(
    `Password mismatch. The password you entered does not match the account for ${identifier}. Please try again or reset your password.`,
    { code: "auth/password-mismatch" }
  );

const fetchStudentProfileByEmail = async (email) => {
  if (!email) return null;
  const cleanedEmail = email.trim();
  if (!cleanedEmail) return null;
  const normalizedEmail = cleanedEmail.toLowerCase();
  const studentsRef = collection(db, "students");
  const candidateEmails = Array.from(new Set([normalizedEmail, cleanedEmail]));

  for (const candidate of candidateEmails) {
    const q = query(studentsRef, where("email", "==", candidate), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const hit = snapshot.docs[0];
      return { id: hit.id, ...hit.data() };
    }
  }

  return null;
};

const fetchStudentProfileByUid = async (uid) => {
  const cleanedUid = String(uid || "").trim();
  if (!cleanedUid) return null;

  const directDoc = await getDoc(doc(db, "students", cleanedUid));
  if (directDoc.exists()) {
    return { id: directDoc.id, ...directDoc.data() };
  }

  const studentsRef = collection(db, "students");
  const uidQuery = query(studentsRef, where("uid", "==", cleanedUid), limit(1));
  const uidSnapshot = await getDocs(uidQuery);
  if (!uidSnapshot.empty) {
    const hit = uidSnapshot.docs[0];
    return { id: hit.id, ...hit.data() };
  }

  return null;
};

const fetchStudentProfileByStudentCode = async (studentCode) => {
  if (!studentCode) return null;
  const cleanedCode = studentCode.trim();
  if (!cleanedCode) return null;

  const studentsRef = collection(db, "students");
  const directDoc = await getDoc(doc(db, "students", cleanedCode));
  if (directDoc.exists()) {
    return { id: directDoc.id, ...directDoc.data() };
  }

  const candidateCodes = Array.from(
    new Set([cleanedCode, cleanedCode.toUpperCase(), cleanedCode.toLowerCase()])
  );

  for (const code of candidateCodes) {
    const codeQuery = query(
      studentsRef,
      where("studentCode", "==", code),
      limit(1)
    );
    const codeSnapshot = await getDocs(codeQuery);
    if (!codeSnapshot.empty) {
      const hit = codeSnapshot.docs[0];
      return { id: hit.id, ...hit.data() };
    }

    const legacyCodeQuery = query(
      studentsRef,
      where("studentcode", "==", code),
      limit(1)
    );
    const legacySnapshot = await getDocs(legacyCodeQuery);
    if (!legacySnapshot.empty) {
      const hit = legacySnapshot.docs[0];
      return { id: hit.id, ...hit.data() };
    }
  }

  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("idle");
  const [messagingToken, setMessagingToken] = useState(null);
  const deviceId = useMemo(() => getDeviceId(), []);
  const devicePlatform = useMemo(() => getDevicePlatform(), []);
  // Device push is retired; do not refresh or register tokens on sign-in.
  const hasVapidKey = false;
  const previousUserId = useRef(null);

  const persistMessagingToken = useCallback(async (token, studentId) => {
    if (!studentId || !token || !deviceId) return;
    const studentRef = doc(db, "students", studentId);
    let mergedTokens = [];
    // Read the freshest list inside a Firestore transaction. Otherwise a phone
    // and computer enabling notifications at the same time can erase each other.
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(studentRef);
      if (!snapshot.exists()) throw new Error("Student profile not found. Sign in again to enable notifications.");
      mergedTokens = mergeMessagingTokenForDevice(snapshot.data()?.messagingTokens, {
        token,
        deviceId,
        platform: devicePlatform,
        lastSeen: Timestamp.now(),
      });
      transaction.set(studentRef, {
        messagingToken: token, // Legacy compatibility for older push delivery jobs.
        messagingTokenUpdatedAt: serverTimestamp(),
        messagingTokens: normalizeMessagingTokensForFirestore(mergedTokens),
      }, { merge: true });
    });
    setStudentProfile((prev) =>
      prev?.id === studentId
        ? { ...prev, messagingToken: token, messagingTokens: normalizeMessagingTokensForState(mergedTokens) }
        : prev
    );
  }, [deviceId, devicePlatform]);

  const logLoginSession = useCallback(
    async ({ uid, email, studentId, studentCode, provider, meta = {} }) => {
      if (!isFirebaseConfigured || !db || !uid) return;
      try {
        const sessionPayload = {
          uid,
          email: email || null,
          studentId: studentId || null,
          studentCode: studentCode || null,
          provider: provider || "unknown",
          loggedInAt: serverTimestamp(),
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
          language: typeof navigator !== "undefined" ? navigator.language : null,
          timeZone:
            typeof Intl !== "undefined"
              ? Intl.DateTimeFormat().resolvedOptions().timeZone
              : null,
          origin: typeof window !== "undefined" ? window.location.origin : null,
          ...meta,
        };

        await addDoc(collection(db, "loginSessions"), sessionPayload);
      } catch (error) {
        console.error("Failed to log login session", error);
      }
    },
    []
  );

  const revokeMessagingToken = useCallback(async (studentId, token) => {
    if (!studentId || !deviceId) return;
    const studentRef = doc(db, "students", studentId);
    let remainingTokens = [];
    let legacyToken;
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(studentRef);
      if (!snapshot.exists()) return;
      const current = snapshot.data() || {};
      remainingTokens = removeMessagingTokenForDevice(current.messagingTokens, deviceId, token);
      const updatePayload = {
        messagingTokens: normalizeMessagingTokensForFirestore(remainingTokens),
        messagingTokenUpdatedAt: serverTimestamp(),
      };
      if (current.messagingToken === token) {
        legacyToken = remainingTokens[0]?.token;
        updatePayload.messagingToken = legacyToken || deleteField();
      } else {
        legacyToken = current.messagingToken;
      }
      transaction.set(studentRef, updatePayload, { merge: true });
    });
    setStudentProfile((prev) =>
      prev?.id === studentId
        ? {
            ...prev,
            messagingToken: legacyToken,
            messagingTokens: normalizeMessagingTokensForState(remainingTokens),
          }
        : prev
    );
  }, [deviceId]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setAuthError("Firebase ist nicht konfiguriert. Bitte REACT_APP_FIREBASE_* Variablen setzen.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      return undefined;
    }

    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      const nextUserId = firebaseUser?.uid ?? null;
      const userChanged = previousUserId.current !== nextUserId;
      if (userChanged) {
        setLoading(true);
        setStudentProfile(null);
      }

      setUser(firebaseUser);
      setAuthError("");
      previousUserId.current = nextUserId;

      if (!firebaseUser) {
        setIdToken(null);
        setMessagingToken(null);
        setNotificationStatus("idle");
        setLoading(false);
        return;
      }

      try {
        const token = await firebaseUser.getIdToken();
        setIdToken(token);
      } catch (error) {
        console.error("Failed to fetch ID token or profile", error);
        setAuthError("Konnte Login-Token nicht laden.");
        if (userChanged) {
          setLoading(false);
        }
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user?.uid || !isFirebaseConfigured || !db) {
      return undefined;
    }

    let unsubscribe = null;
    let cancelled = false;

    const subscribeToProfile = async () => {
      setLoading(true);
      const studentsRef = collection(db, "students");

      const connectToDoc = (docId) =>
        onSnapshot(
          doc(db, "students", docId),
          (docSnapshot) => {
            if (!docSnapshot.exists()) {
              setStudentProfile(null);
              setMessagingToken(null);
              setLoading(false);
              return;
            }
            const profile = { id: docSnapshot.id, ...docSnapshot.data() };
            setStudentProfile(profile);
            setMessagingToken(null);
            setLoading(false);
          },
          (error) => {
            console.error("Failed to subscribe to student profile", error);
            setAuthError("Konnte Studentenprofil nicht laden.");
            setLoading(false);
          }
        );

      try {
        const primaryDocRef = doc(db, "students", user.uid);
        const primaryDoc = await getDoc(primaryDocRef);
        if (cancelled) return;

        if (primaryDoc.exists()) {
          unsubscribe = connectToDoc(primaryDocRef.id);
          return;
        }

        const uidQuery = query(
          studentsRef,
          where("uid", "==", user.uid),
          limit(1)
        );
        const uidSnapshot = await getDocs(uidQuery);
        if (cancelled) return;

        if (!uidSnapshot.empty) {
          unsubscribe = connectToDoc(uidSnapshot.docs[0].id);
          return;
        }

        const studentCodeQuery = query(
          studentsRef,
          where("studentCode", "==", user.uid),
          limit(1)
        );
        const studentCodeSnapshot = await getDocs(studentCodeQuery);
        if (cancelled) return;

        if (!studentCodeSnapshot.empty) {
          unsubscribe = connectToDoc(studentCodeSnapshot.docs[0].id);
          return;
        }

        if (user.email) {
          const emailQuery = query(
            studentsRef,
            where("email", "==", user.email.toLowerCase()),
            limit(1)
          );
          const emailSnapshot = await getDocs(emailQuery);
          if (cancelled) return;

          if (!emailSnapshot.empty) {
            unsubscribe = connectToDoc(emailSnapshot.docs[0].id);
            return;
          }
        }

        setStudentProfile(null);
        setMessagingToken(null);
        setLoading(false);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to resolve student profile subscription", error);
        setAuthError("Konnte Studentenprofil nicht laden.");
        setStudentProfile(null);
        setMessagingToken(null);
        setLoading(false);
      }
    };

    subscribeToProfile();

    return () => {
      cancelled = true;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [deviceId, user?.email, user?.uid]);

  // ✅ UPDATED signup: now includes address
  const signup = useCallback(
    async (email, password, profile = {}) => {
      const universityInvitation = resolveUniversityInvitation(profile.universityInvitationCode);
      const program = universityInvitation?.program || profile.program || "german";
      if (!["german", "swahili"].includes(program)) {
        throw new Error("Please choose German or Swahili to register.");
      }
      if (!isFirebaseConfigured || !auth) {
        throw new Error("Firebase-Konfiguration fehlt. Bitte .env Variablen setzen.");
      }
      setAuthError("");

      if (universityInvitation) {
        let invitation;
        try {
          invitation = await getDocFromServer(doc(db, "universityInvitations", universityInvitation.code));
        } catch {
          throw new Error("We could not check this university invitation. Please try again before creating your account.");
        }
        if (!isUniversityInvitationOpen(invitation.data())) {
          throw new Error("This university invitation is closed or has expired. Ask your course coordinator for an active link.");
        }
      }

      const normalizedEmail = email.trim().toLowerCase();
      // Enforce the same rule here even if a signup UI is bypassed. Comparing
      // the E.164 forms catches 024... versus +23324... and + versus 00.
      // Do this before the network duplicate check or creating an Auth user.
      if (areSameContactNumber(profile.phone, profile.emergencyContactPhone, profile.countryCode)) {
        const error = new Error("Use a different emergency contact phone number from your own.");
        error.code = "auth/emergency-contact-matches-student";
        throw error;
      }
      // Fail closed before making a new Firebase Auth user, so an alternate email
      // cannot silently create another student profile using the same phone.
      if (profile.courseType !== "exam_preparation") {
        await checkSignupDuplicate({
          name: profile.name || profile.firstName || "",
          email: normalizedEmail,
          phone: profile.phone || "",
          emergencyContactPhone: profile.emergencyContactPhone || "",
        });
      }
      // A previous attempt may have created Firebase Auth successfully but failed
      // before writing students/{studentCode}. Only the correct existing password
      // may resume that incomplete account; existing profiles are never overwritten.
      const { credential, resumed } = await createOrResumeSignupAccount({
        email: normalizedEmail, password,
        createAccount: (e, p) => createUserWithEmailAndPassword(auth, e, p),
        signIn: (e, p) => signInWithEmailAndPassword(auth, e, p),
        findProfile: async (uid, e) => (await fetchStudentProfileByUid(uid)) || (await fetchStudentProfileByEmail(e)),
        deletionStatus: async uid => {
          const snap = await getDoc(doc(db, "accountDeletionRequests", uid));
          return snap.exists() ? snap.data()?.status || "" : "";
        },
        signOutExisting: () => signOut(auth),
      });

      const token = await credential.user.getIdToken();
      setIdToken(token);

      if (profile.courseType === "exam_preparation") {
        let registration;
        try {
          const response = await fetch(`${getBackendUrl()}/mock/register`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ name: profile.name, level: profile.level }),
          });
          registration = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(registration.error || "Could not register for exam preparation.");
        } catch (error) {
          await signOut(auth).catch(() => {});
          throw error;
        }
        setIdToken(await credential.user.getIdToken(true));
        const examProfile = await fetchStudentProfileByUid(credential.user.uid);
        if (examProfile) setStudentProfile(examProfile);
        return { studentCode: credential.user.uid, trial: registration.trial };
      }

      const studentCode = profile.studentCode;
      const studentId = studentCode || credential.user.uid;
      const studentsRef = doc(db, "students", studentId);
      // Do not award a new trial because a Firebase Auth-only account is recovered.
      // Preserve the original Auth creation date and let the normal expiry rules apply.
      const trialStartedDate = resumed
        ? new Date(credential.user.metadata?.creationTime || "")
        : new Date();
      if (!Number.isFinite(trialStartedDate.getTime())) {
        await signOut(auth).catch(() => {});
        throw new Error("Your previous sign-up needs support to verify its original date. Please contact admissions.");
      }
      const trialEndsDate = new Date(trialStartedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      const trialPurgeDate = new Date(trialEndsDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      const payload = {
        uid: credential.user.uid,
        name: profile.name || profile.firstName || "",
        fullName: profile.name || profile.firstName || "",
        firstName: profile.firstName || "",
        middleName: profile.middleName || "",
        lastName: profile.lastName || "",
        certificateNameConfirmed: profile.certificateNameConfirmed === true,
        email: normalizedEmail,
        authEmail: normalizedEmail,
        emailIdentity: canonicalEmail(normalizedEmail),
        nameIdentity: canonicalName(profile.name || profile.firstName || ""),
        phoneIdentity: canonicalPhone(profile.phone || ""),
        emergencyContactPhoneIdentity: canonicalPhone(profile.emergencyContactPhone || ""),
        role: "student",
        studentCode: studentId,
        about: "",
        level: universityInvitation?.level || (profile.level || "").toUpperCase(),
        className: universityInvitation ? "" : profile.className || "",
        phone: profile.phone || "",
        location: profile.location || "",
        countryCode: profile.countryCode || "",
        country: profile.country || "",
        program,
        // Admissions interest is never an active secondaryProgram. Staff must
        // approve placement and tuition before enabling the second course.
        additionalProgrammeInterest: ["german", "swahili"].includes(profile.additionalProgrammeInterest)
          && profile.additionalProgrammeInterest !== program ? profile.additionalProgrammeInterest : "",
        preferredInterfaceLanguage: ["en", "de", "fr", "sw"].includes(profile.preferredInterfaceLanguage)
          ? profile.preferredInterfaceLanguage : "en",

        courseType: "full_course",
        address: profile.address || "",            // ✅ NEW FIELD

        emergencyContactPhone: profile.emergencyContactPhone || "",
        status: universityInvitation ? "registered" : (profile.status || "pending"),
        trialStatus: universityInvitation ? "not_applicable" : (profile.trialStatus || "active"),
        ...(!universityInvitation ? {
          trialStartedAt: Timestamp.fromDate(trialStartedDate),
          trialUsedAt: Timestamp.fromDate(trialStartedDate),
          trialEndsAt: Timestamp.fromDate(trialEndsDate),
          trialPurgeAt: Timestamp.fromDate(trialPurgeDate),
        } : {
          institutionId: universityInvitation.institutionId,
          institutionName: universityInvitation.institutionName,
          cohortId: universityInvitation.cohortId,
          instructorName: universityInvitation.instructorName,
          registrationSource: universityInvitation.registrationSource,
          universityInvitationCode: universityInvitation.code,
          institutionVerification: "pending",
          accessType: "invitation_pending",
        }),
        initialPaymentAmount: profile.initialPaymentAmount ?? 0,
        tuitionFee: profile.tuitionFee ?? null,
        balanceDue: profile.balanceDue ?? null,
        paymentStatus: universityInvitation ? "exempt_pending" : (profile.paymentStatus || "pending"),
        paystackLink: profile.paystackLink || "",
        paymentIntentAmount: profile.paymentIntentAmount ?? null,
        ...(!universityInvitation ? {
          contractStart: profile.contractStart || "",
          contractEnd: profile.contractEnd || "",
          contractTermMonths: profile.contractTermMonths ?? null,
        } : {}),
        joined_at: trialStartedDate.toISOString(),
        updated_at: serverTimestamp(),
        syncedToSheets: false,
      };

      if (studentCode) {
        payload.studentcode = studentCode;
      }

      try {
        // Use a create-only transaction: a previously issued student code must not
        // be silently reassigned when two signups happen to choose the same code.
        await runTransaction(db, async transaction => {
          const existing = await transaction.get(studentsRef);
          if (existing.exists()) {
            const conflict = new Error("This student code is already assigned. Please contact admissions to complete registration.");
            conflict.code = "auth/student-code-conflict";
            throw conflict;
          }
          transaction.set(studentsRef, payload);
        });
      } catch (writeError) {
        await signOut(auth).catch(() => {});
        if (writeError?.code === "auth/student-code-conflict") throw writeError;
        const incomplete = new Error("Your sign-in was created but the student registration could not be saved. Retry this form with the same email and password to resume safely, or contact admissions.");
        incomplete.code = "auth/profile-creation-incomplete";
        throw incomplete;
      }
      setStudentProfile({ id: studentsRef.id, ...payload });
      setNotificationStatus("idle");
      await logLoginSession({
        uid: credential.user.uid,
        email: normalizedEmail,
        studentId: studentsRef.id,
        studentCode: studentId,
        provider: "password",
        meta: { isSignup: true },
      });
      // Send verification after the student profile has been saved. Email
      // delivery must never turn a successfully enrolled student into a failed signup.
      // Learners can resend from Account → Documents if delivery is throttled.
      if (credential.user.email && !credential.user.emailVerified) {
        sendEmailVerification(credential.user, getActionCodeSettings()).catch((error) => {
          console.warn("Learner verification email could not be sent", error?.code || error?.message);
        });
      }
      return { studentCode, paystackLink: payload.paystackLink };
    },
    [logLoginSession]
  );

  const login = useCallback(
    async (identifier, password) => {
      if (!isFirebaseConfigured || !auth) {
        throw new Error("Firebase-Konfiguration fehlt. Bitte .env Variablen setzen.");
      }
      setAuthError("");
      const cleanedIdentifier = identifier.trim();
      const isEmailLogin = cleanedIdentifier.includes("@");
      let normalizedEmail = isEmailLogin ? cleanedIdentifier.toLowerCase() : "";
      let profileFromCode = null;

      let loginDiagnostic = null;

      try {
        loginDiagnostic = await fetchLoginDiagnostic(cleanedIdentifier);
        throwIfDiagnosticBlocksLogin(loginDiagnostic);
        if (isEmailLogin) {
          const linkedAuthEmail = String(
            loginDiagnostic?.profile?.authEmail || loginDiagnostic?.profile?.loginEmail || ""
          ).trim().toLowerCase();
          if (linkedAuthEmail) normalizedEmail = linkedAuthEmail;
        }
      } catch (error) {
        if (error instanceof LoginDiagnosticError) {
          throw error;
        }
        console.warn("Login diagnostic check failed", error);
      }

      if (!isEmailLogin) {
        profileFromCode = loginDiagnostic?.profile || null;
        if (!profileFromCode) {
          try {
            profileFromCode = await fetchStudentProfileByStudentCode(cleanedIdentifier);
          } catch (error) {
            if (error?.code === "permission-denied" || error?.code === "auth/permission-denied") {
              throw new LoginDiagnosticError(
                "We could not find that student code. Check the code or sign in with the email linked to your account.",
                { code: "auth/user-not-found" }
              );
            }
            throw error;
          }
        }
        if (!profileFromCode) {
          throw new LoginDiagnosticError(
            "We could not find that student code. Check the code or sign in with the email linked to your account.",
            { code: "auth/user-not-found" }
          );
        }
        const linkedAuthEmail = String(
          profileFromCode.authEmail || profileFromCode.loginEmail || profileFromCode.email || ""
        ).trim();
        if (!linkedAuthEmail) {
          throw new Error("We couldn't find a sign-in email for this student code. Please contact support.");
        }
        normalizedEmail = linkedAuthEmail.toLowerCase();
      }

      const finalizeLogin = async (credential, profileOverride = null, meta = {}) => {
        const token = await credential.user.getIdToken();
        setIdToken(token);
        const recovery = await getDoc(doc(db, "accountDeletionRequests", credential.user.uid)).catch(error => {
          if (error.code === "permission-denied") return { data: () => null };
          throw error;
        });
        if (["pending", "processing", "completed"].includes(recovery.data()?.status)) {
          setStudentProfile(null); setMessagingToken(null);
          return { credential, ...meta };
        }
        const profile =
          profileOverride ||
          (await fetchStudentProfileByUid(credential.user.uid)) ||
          (await fetchStudentProfileByEmail(normalizedEmail));
        const accessBlockReason = getStudentAccessBlockReason(profile,await hasIndependentContracts(profile,credential.user));
        if (accessBlockReason) {
          await signOut(auth).catch((error) => console.warn("Failed to sign out blocked login", error));
          setStudentProfile(null);
          setMessagingToken(null);
          throw new LoginDiagnosticError(accessBlockReason, {
            ...buildStudentSupportDiagnostic(profile, "student_access_blocked"),
            code: "auth/student-access-blocked",
          });
        }
        setStudentProfile(profile);
        setMessagingToken(null);
        const studentId = profile?.id || credential.user.uid;
        const studentCode = profile?.studentCode || profile?.studentcode || credential.user.uid;
        await logLoginSession({
          uid: credential.user.uid,
          email: normalizedEmail,
          studentId,
          studentCode,
          provider: "password",
          meta,
        });

        if (meta.migratedFromLegacy) {
          credential.migratedFromLegacy = true;
        }

        return { credential, ...meta };
      };

      try {
        const credential = await signInWithEmailAndPassword(
          auth,
          normalizedEmail,
          password
        );
        return await finalizeLogin(credential);
      } catch (error) {
        const canAttemptLegacyMigration = ["auth/user-not-found", "auth/invalid-credential"].includes(error?.code);
        if (canAttemptLegacyMigration) {
          let existingProfile = profileFromCode || loginDiagnostic?.profile || null;
          if (!existingProfile) {
            try {
              existingProfile = await fetchStudentProfileByEmail(normalizedEmail);
            } catch (profileLookupError) {
              console.warn("Login profile lookup failed after credential error", profileLookupError);
            }
          }

          const hasLinkedUid = Boolean(existingProfile?.uid);
          if (existingProfile && !hasLinkedUid) {
            const migratedCredential = await createUserWithEmailAndPassword(
              auth,
              normalizedEmail,
              password
            );

            const mergedStudentCode =
              existingProfile.studentCode ||
              existingProfile.studentcode ||
              existingProfile.id ||
              migratedCredential.user.uid;

            const studentRef = doc(db, "students", existingProfile.id);
            const mergedProfile = {
              ...existingProfile,
              uid: migratedCredential.user.uid,
              studentCode: mergedStudentCode,
              studentcode: mergedStudentCode,
              email: normalizedEmail,
            };

            await setDoc(
              studentRef,
              {
                uid: migratedCredential.user.uid,
                studentCode: mergedStudentCode,
                studentcode: mergedStudentCode,
                email: normalizedEmail,
                role: existingProfile.role || "student",
                updated_at: serverTimestamp(),
              },
              { merge: true }
            );

            return await finalizeLogin(migratedCredential, mergedProfile, {
              migratedFromLegacy: true,
            });
          }
        }

        if (["auth/invalid-credential", "auth/wrong-password"].includes(error?.code)) {
          if (loginDiagnostic?.exists) {
            throwIfDiagnosticBlocksLogin(loginDiagnostic);
            throw buildCredentialMismatchError(cleanedIdentifier);
          }

          try {
            const diagnostic = await fetchLoginDiagnostic(cleanedIdentifier);
            if (diagnostic?.exists) {
              throwIfDiagnosticBlocksLogin(diagnostic);
              throw buildCredentialMismatchError(cleanedIdentifier);
            }
          } catch (diagnosticError) {
            if (diagnosticError instanceof LoginDiagnosticError) {
              throw diagnosticError;
            }
            console.warn("Login diagnostic check failed after credential error", diagnosticError);
          }
        }

        throw error;
      }
    },
    [deviceId, logLoginSession]
  );

  const loginWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase-Konfiguration fehlt. Bitte .env Variablen setzen.");
    }
    setAuthError("");

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const credential = await signInWithPopup(auth, provider);
    const email = credential.user?.email?.toLowerCase();

    if (!email) {
      await signOut(auth);
      throw new Error("Google sign-in did not return an email address. Please try another account.");
    }

    const recovery = await getDoc(doc(db, "accountDeletionRequests", credential.user.uid)).catch(error => {
          if (error.code === "permission-denied") return { data: () => null };
          throw error;
        });
    if (["pending", "processing", "completed"].includes(recovery.data()?.status)) {
      setIdToken(await credential.user.getIdToken()); setStudentProfile(null); setMessagingToken(null);
      return { credential };
    }
    const existingProfile =
      (await fetchStudentProfileByUid(credential.user.uid)) ||
      (await fetchStudentProfileByEmail(email));
    if (!existingProfile) {
      await signOut(auth);
      throw new Error("Only existing students in our records can use Google sign-in. Please contact support.");
    }

    if (existingProfile.role && `${existingProfile.role}`.toLowerCase() !== "student") {
      await signOut(auth);
      throw new Error("Google sign-in is limited to student accounts. Please contact support for access.");
    }

    const accessBlockReason = getStudentAccessBlockReason(existingProfile,await hasIndependentContracts(existingProfile,credential.user));
    if (accessBlockReason) {
      await signOut(auth);
      throw new LoginDiagnosticError(accessBlockReason, {
        ...buildStudentSupportDiagnostic(existingProfile, "student_access_blocked"),
        code: "auth/student-access-blocked",
      });
    }

    const studentRef = doc(db, "students", existingProfile.id);
    const resolvedName =
      String(
        existingProfile.name ||
        existingProfile.fullName ||
        existingProfile.displayName ||
        credential.user?.displayName ||
        ""
      ).trim();
    await setDoc(
      studentRef,
      {
        uid: credential.user.uid,
        authEmail: email,
        name: resolvedName || existingProfile.name || "",
        role: existingProfile.role || "student",
        updated_at: serverTimestamp(),
      },
      { merge: true }
    );

    const token = await credential.user.getIdToken();
    setIdToken(token);
    const mergedProfile = {
      ...existingProfile,
      uid: credential.user.uid,
      authEmail: email,
      name: resolvedName || existingProfile.name || "",
    };
    setStudentProfile(mergedProfile);
    setMessagingToken(null);
    await logLoginSession({
      uid: credential.user.uid,
      email,
      studentId: mergedProfile?.id || credential.user.uid,
      studentCode: mergedProfile?.studentCode || mergedProfile?.studentcode || credential.user.uid,
      provider: "google",
    });
    return { credential, profile: mergedProfile };
  }, [deviceId, logLoginSession]);

  const refreshUser = useCallback(async () => {
    if (!auth?.currentUser) return null;
    await reload(auth.currentUser);
    setUser(auth.currentUser);
    return auth.currentUser;
  }, []);

  const refreshStudentProfile = useCallback(async () => {
    const profileId = studentProfile?.id || user?.uid;
    if (!profileId || !db) return null;
    const snapshot = await getDoc(doc(db, "students", profileId));
    if (!snapshot.exists()) return null;
    const profile = { id: snapshot.id, ...snapshot.data() };
    setStudentProfile(profile);
    return profile;
  }, [studentProfile?.id, user?.uid]);

  const resetPassword = useCallback(async (email) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase-Konfiguration fehlt. Bitte .env Variablen setzen.");
    }
    if (!email) {
      throw new Error("Please enter your email address to reset the password.");
    }
    const normalizedEmail = email.trim().toLowerCase();
    let resetEmail = normalizedEmail;
    try {
      const diagnostic = await fetchLoginDiagnostic(normalizedEmail);
      const linkedAuthEmail = String(
        diagnostic?.profile?.authEmail || diagnostic?.profile?.loginEmail || ""
      ).trim().toLowerCase();
      if (linkedAuthEmail) resetEmail = linkedAuthEmail;
    } catch (error) {
      console.warn("Password reset identity lookup failed", error);
    }
    await sendPasswordResetEmail(auth, resetEmail, getActionCodeSettings());
  }, []);

  const logout = useCallback(
    async () => {
      if (!isFirebaseConfigured || !auth) {
        setUser(null);
        setStudentProfile(null);
        setIdToken(null);
        return;
      }
      await signOut(auth);
      setMessagingToken(null);
      setNotificationStatus("idle");
      setStudentProfile(null);
    },
    []
  );

  // Preserve the context API for older callers, without any token registration.
  const enableNotifications = useCallback(async () => null, []);

  const saveStudentProfile = useCallback(
    async (updates) => {
      if (!studentProfile?.id) {
        throw new Error("No student profile found. Please re-login.");
      }

      if (!isFirebaseConfigured || !db) {
        throw new Error("Firebase is not configured. Cannot save profile.");
      }

      const studentRef = doc(db, "students", studentProfile.id);
      await setDoc(studentRef, { ...updates, updated_at: serverTimestamp() }, { merge: true });
      setStudentProfile((prev) => (prev ? { ...prev, ...updates } : prev));
      return { ...studentProfile, ...updates };
    },
    [studentProfile]
  );

  const [courseAccessClock, setCourseAccessClock] = useState(Date.now);
  const secondaryExpiry = secondaryAccessExpiry(studentProfile);
  useEffect(() => {
    if (!secondaryExpiry || secondaryExpiry <= Date.now()) return undefined;
    const timer = setTimeout(() => setCourseAccessClock(Date.now()), Math.min(2147483647, Math.max(1, secondaryExpiry - Date.now())));
    return () => clearTimeout(timer);
  }, [secondaryExpiry, courseAccessClock]);
  const courseOptions = useMemo(() => enrolledCourses(studentProfile, Math.max(courseAccessClock, Date.now())), [studentProfile, courseAccessClock]);
  const courseKey = `falowen:course:${user?.uid}`;
  const [selection, setSelection] = useState(null);
  const linkedCourse = typeof window !== "undefined" && /^#swahili-day-/.test(window.location.hash)
    && window.location.pathname === "/campus/results" && courseOptions.includes("swahili") ? "swahili" : null;
  const storedCourse = readCoursePreference(user?.uid, courseOptions);
  const preferred = linkedCourse || (selection?.key === courseKey && courseOptions.includes(selection.program)
    ? selection.program : storedCourse);
  useEffect(() => {
    if (linkedCourse && user?.uid) saveCoursePreference(user.uid, linkedCourse, courseOptions);
  }, [linkedCourse, user?.uid, courseOptions]);
  const [levelEnrollmentState,setLevelEnrollmentState] = useState(null);
  const enrollmentProfileId=studentProfile?.id;
  const enrollmentUid=user?.uid;
  const enrollmentOwner=studentProfile?.uid===enrollmentUid;
  useEffect(()=>{
    setLevelEnrollmentState(null);
    if(!db||!enrollmentUid||!enrollmentProfileId||!enrollmentOwner)return undefined;
    return onSnapshot(collection(db,"students",enrollmentProfileId,"levelEnrollments"),snap=>{
      setLevelEnrollmentState({uid:enrollmentUid,id:enrollmentProfileId,rows:snap.docs.map(d=>({...d.data(),id:d.id}))});
    },()=>setLevelEnrollmentState({uid:enrollmentUid,id:enrollmentProfileId,error:true,rows:[]}));
  },[enrollmentUid,enrollmentProfileId,enrollmentOwner]);
  const [levelAccessClock,setLevelAccessClock]=useState(Date.now);
  useEffect(()=>{
    if(!levelEnrollmentState?.rows?.length)return undefined;
    const now=Date.now(),next=new Date(new Date(now).toISOString().slice(0,10)+"T00:00:00Z").getTime()+86400000;
    const timer=setTimeout(()=>setLevelAccessClock(Date.now()),Math.max(1,next-now));
    return ()=>clearTimeout(timer);
  },[levelAccessClock,levelEnrollmentState]);
  const activeProfile = useMemo(() => {
    const profile=courseProfile(studentProfile,preferred);
    if(!profile)return profile;
    const state=levelEnrollmentState?.uid===enrollmentUid&&levelEnrollmentState?.id===enrollmentProfileId?levelEnrollmentState:null;
    const now=Math.max(levelAccessClock,Date.now());
    const decision=enrollmentDecision(state?.rows,profile.program||"german",now);
    const legacyEnd=toMillis(profile.contractEnd);
    const legacyUnavailable=decision.managed.length>0&&((Number.isFinite(legacyEnd)&&legacyEnd<=now)||BLOCKED_PAYMENT_STATUSES.includes(normalizePaymentStatus(profile.paymentStatus)));
    const levels=["A1","A2","B1","B2","C1","C2"];
    const legacyLevels=levels.slice(0,levels.indexOf(String(profile.level||"").toUpperCase())+1);
    const blocked=[...new Set([...decision.blocked,...(legacyUnavailable?legacyLevels.filter(l=>!decision.granted.includes(l)):[])])];
    const rows=state?.rows||[];
    // Use the live level ledger only for the new upgrade lifecycle; legacy-only accounts keep their existing projection.
    const language=String(profile.program||"german").toLowerCase().replace(/^kiswahili$/,"swahili");
    const managed=decision.managed.length>0;
    const today=new Date(now).toISOString().slice(0,10);
    const current=managed?rows.filter(r=>r.program===language&&decision.granted.includes(r.level)&&!blocked.includes(r.level)&&["active","completed"].includes(r.status)&&r.contractStart<=today&&r.contractEnd>=today).sort((a,b)=>levels.indexOf(b.level)-levels.indexOf(a.level))[0]:null;
    const projection=current?{level:current.level,className:current.className||"",contractStart:current.contractStart,contractEnd:current.contractEnd,tuitionFee:current.tuitionFee,paid:current.paid,balanceDue:current.balanceDue,balance:current.balanceDue,paymentStatus:current.balanceDue===0?"paid":"partial",accessType:current.balanceDue===0?"paid":"partial",trialStatus:"converted",trialRetentionStatus:"converted"}:{};
    return {...profile,...projection,blockedEnrollmentLevels:blocked,grantedEnrollmentLevels:decision.granted,managedEnrollmentLevels:decision.managed,levelBillingEnrollments:rows,levelEnrollmentCheckPending:!!enrollmentOwner&&!state,levelEnrollmentCheckError:!!state?.error};
  },[studentProfile,preferred,levelEnrollmentState,enrollmentUid,enrollmentProfileId,enrollmentOwner,levelAccessClock]);
  const selectCourse = useCallback(program => {
    if (!courseOptions.includes(program) || !user?.uid) return;
    saveCoursePreference(user.uid, program, courseOptions);
    setSelection({ key: courseKey, program });
  }, [courseKey, courseOptions, user?.uid]);

  const value = useMemo(
    () => ({
      user,
      studentProfile: activeProfile,
      accountProfile: studentProfile,
      courseOptions,
      selectCourse,
      idToken,
      loading,
      authError,
      setAuthError,
      signup,
      login,
      loginWithGoogle,
      resetPassword,
      logout,
      enableNotifications,
      messagingToken,
      notificationStatus,
      saveStudentProfile,
      refreshUser,
      refreshStudentProfile,
    }),
    [
      user,
      activeProfile,
      studentProfile,
      courseOptions,
      selectCourse,
      idToken,
      loading,
      authError,
      signup,
      login,
      resetPassword,
      loginWithGoogle,
      messagingToken,
      notificationStatus,
      saveStudentProfile,
      enableNotifications,
      logout,
      refreshUser,
      refreshStudentProfile,
    ]
  );

  return <AuthContext.Provider value={value}>
    <ReadingStudentContext.Provider key={activeProfile?.program || "german"} value={user?.uid}>{children}</ReadingStudentContext.Provider>
  </AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
