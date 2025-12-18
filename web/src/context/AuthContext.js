import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signOut,
  requestMessagingToken,
  db,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  isFirebaseConfigured,
  deleteField,
} from "../firebase";

const AuthContext = createContext();

const fetchStudentProfileByEmail = async (email) => {
  if (!email) return null;
  const studentsRef = collection(db, "students");
  const q = query(studentsRef, where("email", "==", email.toLowerCase())) ;
  try {
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const hit = snapshot.docs[0];
    return { id: hit.id, ...hit.data() };
  } catch (error) {
    if (error?.code === "permission-denied") {
      console.warn("Skipping profile lookup: missing Firestore permissions.");
      return null;
    }
    throw error;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("idle");
  const [messagingToken, setMessagingToken] = useState(null);

  const persistMessagingToken = async (token, studentId) => {
    if (!studentId || !token) return;
    const studentRef = doc(db, "students", studentId);
    await setDoc(
      studentRef,
      { messagingToken: token, messagingTokenUpdatedAt: serverTimestamp() },
      { merge: true }
    );
    setStudentProfile((prev) =>
      prev?.id === studentId ? { ...prev, messagingToken: token } : prev
    );
  };

  const revokeMessagingToken = async (studentId) => {
    if (!studentId) return;
    const studentRef = doc(db, "students", studentId);
    await updateDoc(studentRef, {
      messagingToken: deleteField(),
      messagingTokenUpdatedAt: serverTimestamp(),
    });
    setStudentProfile((prev) =>
      prev?.id === studentId
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
        const profile = await fetchStudentProfileByEmail(firebaseUser.email);
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

    const studentCode = profile.studentCode;
    const studentsRef = doc(db, "students", studentCode || credential.user.uid);
    const payload = {
      name: profile.firstName || "",
      email: email.toLowerCase(),
      about: "",
      level: (profile.level || "").toUpperCase(),
      className: profile.className || "",
      joined_at: new Date().toISOString(),
      updated_at: serverTimestamp(),
      syncedToSheets: false,
    };
    if (studentCode) {
      payload.studentcode = studentCode;
    }

    await setDoc(studentsRef, payload, { merge: true });
    setStudentProfile({ id: studentsRef.id, ...payload });
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
    const profile = await fetchStudentProfileByEmail(email);
    setStudentProfile(profile);
    setMessagingToken(profile?.messagingToken || null);
    return credential;
  };

  const logout = async () => {
    if (!isFirebaseConfigured || !auth) {
      setUser(null);
      setStudentProfile(null);
      setIdToken(null);
      return;
    }
    if (studentProfile?.id && studentProfile.messagingToken) {
      try {
        await revokeMessagingToken(studentProfile.id);
      } catch (error) {
        console.error("Failed to revoke messaging token", error);
      }
    }
    await signOut(auth);
    setMessagingToken(null);
    setNotificationStatus("idle");
    setStudentProfile(null);
  };

  const enableNotifications = async () => {
    if (!isFirebaseConfigured) {
      throw new Error("Firebase-Konfiguration fehlt. Bitte .env Variablen setzen.");
    }
    setNotificationStatus("pending");
    try {
      const token = await requestMessagingToken();
      setMessagingToken(token);
      if (studentProfile?.id) {
        await persistMessagingToken(token, studentProfile.id);
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
    const refreshMessagingToken = async () => {
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

      if (!storedToken) {
        setNotificationStatus("pending");
      }

      try {
        const token = await requestMessagingToken();
        setMessagingToken(token);
        if (studentProfile.messagingToken !== token) {
          await persistMessagingToken(token, studentProfile.id);
        }
        setNotificationStatus("granted");
      } catch (error) {
        console.error("Failed to refresh messaging token on sign-in", error);
        setNotificationStatus(storedToken ? "stale" : "error");
      }
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
    }),
    [
      user,
      studentProfile,
      idToken,
      loading,
      authError,
      messagingToken,
      notificationStatus,
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
