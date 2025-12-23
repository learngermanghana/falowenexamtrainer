import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  onIdTokenChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
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
  getActionCodeSettings,
  reload,
} from "../firebase";

const AuthContext = createContext();

const fetchStudentProfileByEmail = async (email) => {
  if (!email) return null;
  const studentsRef = collection(db, "students");
  const q = query(studentsRef, where("email", "==", email.toLowerCase())) ;
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const hit = snapshot.docs[0];
  return { id: hit.id, ...hit.data() };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("idle");
  const [messagingToken, setMessagingToken] = useState(null);

  const persistMessagingToken = useCallback(async (token, studentId) => {
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
  }, []);

  const revokeMessagingToken = useCallback(async (studentId) => {
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
  }, []);

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
    const normalizedEmail = email.trim().toLowerCase();
    const credential = await createUserWithEmailAndPassword(
      auth,
      normalizedEmail,
      password
    );
    const token = await credential.user.getIdToken();
    setIdToken(token);

    const studentCode = profile.studentCode;
    const studentId = studentCode || credential.user.uid;
    const studentsRef = doc(db, "students", studentId);
    const payload = {
      uid: credential.user.uid,
      name: profile.name || profile.firstName || "",
      email: normalizedEmail,
      role: "student",
      studentCode: studentId,
      about: "",
      level: (profile.level || "").toUpperCase(),
      className: profile.className || "",
      phone: profile.phone || "",
      location: profile.location || "",
      emergencyContactPhone: profile.emergencyContactPhone || "",
      status: profile.status || "Active",
      initialPaymentAmount: profile.initialPaymentAmount ?? 0,
      tuitionFee: profile.tuitionFee ?? null,
      balanceDue: profile.balanceDue ?? null,
      paymentStatus: profile.paymentStatus || "pending",
      paystackLink: profile.paystackLink || "",
      contractStart: profile.contractStart || "",
      contractEnd: profile.contractEnd || "",
      contractTermMonths: profile.contractTermMonths ?? null,
      joined_at: new Date().toISOString(),
      updated_at: serverTimestamp(),
      syncedToSheets: false,
    };
    if (studentCode) {
      payload.studentcode = studentCode;
    }

    await setDoc(studentsRef, payload, { merge: true });
    await sendEmailVerification(credential.user, getActionCodeSettings());
    setStudentProfile({ id: studentsRef.id, ...payload });
    setNotificationStatus("idle");
    return { verificationRequired: true, studentCode, paystackLink: payload.paystackLink };
  };

  const login = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase-Konfiguration fehlt. Bitte .env Variablen setzen.");
    }
    setAuthError("");
    const normalizedEmail = email.trim().toLowerCase();
    const credential = await signInWithEmailAndPassword(
      auth,
      normalizedEmail,
      password
    );
    const token = await credential.user.getIdToken();
    setIdToken(token);
    const profile = await fetchStudentProfileByEmail(normalizedEmail);
    setStudentProfile(profile);
    setMessagingToken(profile?.messagingToken || null);
    if (!credential.user.emailVerified) {
      await sendEmailVerification(credential.user, getActionCodeSettings());
      return { credential, emailVerificationRequired: true };
    }

    return credential;
  };

  const refreshUser = async () => {
    if (!auth?.currentUser) return null;
    await reload(auth.currentUser);
    return auth.currentUser;
  };

  const resendVerificationEmail = async () => {
    if (!auth?.currentUser) {
      throw new Error("No user is signed in.");
    }

    await sendEmailVerification(auth.currentUser, getActionCodeSettings());
  };

  const resetPassword = async (email) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase-Konfiguration fehlt. Bitte .env Variablen setzen.");
    }
    if (!email) {
      throw new Error("Please enter your email address to reset the password.");
    }
    const normalizedEmail = email.trim().toLowerCase();
    await sendPasswordResetEmail(auth, normalizedEmail, getActionCodeSettings());
  };

  const logout = useCallback(
    async () => {
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
    },
    [revokeMessagingToken, studentProfile?.id, studentProfile?.messagingToken]
  );

  const enableNotifications = useCallback(
    async () => {
      if (!isFirebaseConfigured) {
        throw new Error("Firebase-Konfiguration fehlt. Bitte .env Variablen setzen.");
      }
      setNotificationStatus("pending");
      try {
        const token = await requestMessagingToken();
        if (!token) {
          setNotificationStatus(
            typeof Notification !== "undefined" && Notification.permission === "denied"
              ? "blocked"
              : "idle"
          );
          return null;
        }
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
    },
    [persistMessagingToken, studentProfile?.id]
  );

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
        if (!token) {
          setNotificationStatus(storedToken ? "stale" : "blocked");
          return;
        }
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
  }, [persistMessagingToken, studentProfile, user]);

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
      resetPassword,
      logout,
      enableNotifications,
      messagingToken,
      notificationStatus,
      saveStudentProfile,
      refreshUser,
      resendVerificationEmail,
    }),
    [
      user,
      studentProfile,
      idToken,
      loading,
      authError,
      resetPassword,
      messagingToken,
      notificationStatus,
      saveStudentProfile,
      enableNotifications,
      logout,
      refreshUser,
      resendVerificationEmail,
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
