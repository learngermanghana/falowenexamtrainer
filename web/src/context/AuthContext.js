import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signOut,
  requestMessagingToken,
  db,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  isFirebaseConfigured,
  deleteField,
  getDoc,
} from "../firebase";
import { firestoreCollections, legacyStudentKey } from "../lib/firestorePaths";

const AuthContext = createContext();

const fetchStudentProfileByUid = async (uid) => {
  if (!uid) return null;

  const mappingRef = doc(db, ...firestoreCollections.studentMappingDoc(uid));
  const mappingSnapshot = await getDoc(mappingRef).catch((error) => {
    if (error?.code === "permission-denied") {
      console.warn("Skipping mapping lookup: missing Firestore permissions.");
      return null;
    }
    throw error;
  });

  const mappingData = mappingSnapshot?.exists()
    ? { id: mappingSnapshot.id, ...mappingSnapshot.data() }
    : null;

  const studentCode = legacyStudentKey(mappingData);

  let legacyData = null;
  if (studentCode) {
    const studentRef = doc(db, ...firestoreCollections.studentDoc(studentCode));
    const studentSnapshot = await getDoc(studentRef).catch((error) => {
      if (error?.code === "permission-denied") {
        console.warn("Skipping profile lookup: missing Firestore permissions.");
        return mappingData ? { ...mappingData, id: studentCode } : null;
      }
      throw error;
    });

    if (studentSnapshot?.exists()) {
      legacyData = { id: studentSnapshot.id, ...studentSnapshot.data() };
    }
  }

  const derivedStudentCode = legacyStudentKey({ ...legacyData, ...mappingData }) || "";

  if (!legacyData && !mappingData) {
    return null;
  }

  const canonicalClassName =
    mappingData?.className ||
    mappingData?.class_board ||
    legacyData?.className ||
    legacyData?.class_board ||
    "";

  const legacyClassBoard = mappingData?.class_board || legacyData?.class_board || null;

  return {
    ...(legacyData || {}),
    ...(mappingData || {}),
    className: canonicalClassName,
    class_board: legacyClassBoard || canonicalClassName || undefined,
    id: derivedStudentCode || mappingData?.id || null,
    mappingId: mappingData?.id || uid,
    studentcode: derivedStudentCode,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("idle");
  const [messagingToken, setMessagingToken] = useState(null);

  const persistStudentClassName = useCallback(async (className) => {
    if (!isFirebaseConfigured || !db || !(studentProfile?.mappingId || user?.uid)) {
      return { ok: false, reason: "unavailable" };
    }

    const mappingRef = doc(
      db,
      ...firestoreCollections.studentMappingDoc(studentProfile?.mappingId || user?.uid)
    );

    try {
      const payload = { className, class_board: className, updated_at: serverTimestamp() };
      await setDoc(mappingRef, payload, { merge: true });

      if (studentProfile?.studentcode) {
        const legacyRef = doc(db, ...firestoreCollections.studentDoc(studentProfile.studentcode));
        await setDoc(legacyRef, { class_board: className }, { merge: true });
      }
    } catch (error) {
      if (error?.code === "permission-denied") {
        console.warn("Missing Firestore permissions to persist className", error);
        return { ok: false, reason: "permission-denied" };
      }

      throw error;
    }

    setStudentProfile((prev) =>
      prev?.mappingId === mappingRef.id
        ? { ...prev, className, class_board: className }
        : prev
    );

    return { ok: true };
  }, [studentProfile?.mappingId, user?.uid]);

  const persistMessagingToken = async (token, mappingId) => {
    if (!mappingId || !token) return;
    const mappingRef = doc(db, ...firestoreCollections.studentMappingDoc(mappingId));
    await setDoc(
      mappingRef,
      { messagingToken: token, messagingTokenUpdatedAt: serverTimestamp() },
      { merge: true }
    );
    setStudentProfile((prev) =>
      prev?.mappingId === mappingId ? { ...prev, messagingToken: token } : prev
    );
  };

  const revokeMessagingToken = async (mappingId) => {
    if (!mappingId) return;
    const mappingRef = doc(db, ...firestoreCollections.studentMappingDoc(mappingId));
    await updateDoc(mappingRef, {
      messagingToken: deleteField(),
      messagingTokenUpdatedAt: serverTimestamp(),
    });
    setStudentProfile((prev) =>
      prev?.mappingId === mappingId
        ? { ...prev, messagingToken: undefined }
        : prev
    );
  };

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
      setUser(firebaseUser);
      setStudentProfile(null);
      setAuthError("");

      if (!firebaseUser) {
        setIdToken(null);
        setLoading(false);
        setMessagingToken(null);
        setNotificationStatus("idle");
        return;
      }

      try {
        const token = await firebaseUser.getIdToken();
        setIdToken(token);
        const profile = await fetchStudentProfileByUid(firebaseUser.uid);
        setStudentProfile(profile);
        setMessagingToken(profile?.messagingToken || null);
      } catch (error) {
        console.error("Failed to fetch ID token or profile", error);
        setAuthError("Konnte Login-Token nicht laden.");
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, profile = {}) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase-Konfiguration fehlt. Bitte .env Variablen setzen.");
    }
    setAuthError("");
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await credential.user.getIdToken();
    setIdToken(token);

    const legacyStudentCode = legacyStudentKey(profile) || profile.studentCode || "";
    const mappingRef = doc(db, ...firestoreCollections.studentMappingDoc(credential.user.uid));
    const className = profile.className || "";
    const payload = {
      email: email.toLowerCase(),
      level: (profile.level || "").toUpperCase(),
      className,
      class_board: className,
      studentcode: legacyStudentCode,
      joined_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };

    await setDoc(mappingRef, payload, { merge: true });
    setStudentProfile({ id: legacyStudentCode || credential.user.uid, mappingId: mappingRef.id, ...payload });
    setNotificationStatus("idle");
    return credential;
  };

  const login = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase-Konfiguration fehlt. Bitte .env Variablen setzen.");
    }
    setAuthError("");
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const token = await credential.user.getIdToken();
    setIdToken(token);
    const profile = await fetchStudentProfileByUid(credential.user.uid);
    setStudentProfile(profile);
    setMessagingToken(profile?.messagingToken || null);
    return credential;
  };

  const logout = async () => {
    if (!isFirebaseConfigured || !auth) {
      setUser(null);
      setStudentProfile(null);
      setIdToken(null);
      setMessagingToken(null);
      setNotificationStatus("idle");
      return;
    }

    if (studentProfile?.mappingId && studentProfile.messagingToken) {
      try {
        await revokeMessagingToken(studentProfile.mappingId);
      } catch (error) {
        console.error("Failed to revoke messaging token", error);
      }
    }

    try {
      await signOut(auth);
    } finally {
      setUser(null);
      setIdToken(null);
      setMessagingToken(null);
      setNotificationStatus("idle");
      setStudentProfile(null);
    }
  };

  const enableNotifications = async () => {
    if (!isFirebaseConfigured) {
      throw new Error("Firebase-Konfiguration fehlt. Bitte .env Variablen setzen.");
    }
    setNotificationStatus("pending");
    try {
      const token = await requestMessagingToken();
      setMessagingToken(token);
      if (studentProfile?.mappingId) {
        await persistMessagingToken(token, studentProfile.mappingId);
      }
      setNotificationStatus("granted");
      return token;
    } catch (error) {
      console.error("Failed to enable notifications", error);
      setNotificationStatus("error");
      throw error;
    }
  };

  useEffect(() => {
    const refreshMessagingToken = () => {
      if (!user || !studentProfile || !isFirebaseConfigured) return;

      const storedToken = studentProfile.messagingToken || null;

      if (typeof Notification !== "undefined") {
        if (Notification.permission === "denied") {
          setNotificationStatus("blocked");
          return;
        }

        if (Notification.permission === "default") {
          setNotificationStatus(storedToken ? "stale" : "idle");
          return;
        }
      }

      setNotificationStatus(storedToken ? "granted" : "idle");
      setMessagingToken(storedToken);
    };

    refreshMessagingToken();
    // Only re-run when a new user or profile is loaded to avoid repeated token prompts.
  }, [user?.uid, studentProfile?.id]);

  const value = useMemo(
    () => ({
      user,
      studentProfile,
      idToken,
      loading,
      authError,
      setAuthError,
      signup,
      login,
      logout,
      enableNotifications,
      messagingToken,
      notificationStatus,
      persistStudentClassName,
    }),
    [
      user,
      studentProfile,
      idToken,
      loading,
      authError,
      messagingToken,
      notificationStatus,
      persistStudentClassName,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
