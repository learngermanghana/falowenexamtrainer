import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  onIdTokenChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  requestMessagingToken,
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
  isFirebaseConfigured,
  deleteField,
  getActionCodeSettings,
  reload,
  limit,
  GoogleAuthProvider,
} from "../firebase";

const AuthContext = createContext();

const fetchStudentProfileByEmail = async (email) => {
  if (!email) return null;
  const studentsRef = collection(db, "students");
  const q = query(studentsRef, where("email", "==", email.toLowerCase()));
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
      setLoading(true);
      setUser(firebaseUser);
      setStudentProfile(null);
      setAuthError("");

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
            setMessagingToken(profile?.messagingToken || null);
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
  }, [user?.email, user?.uid]);

  // ✅ UPDATED signup: now includes address
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

      learningMode: profile.learningMode || "", // already there ✅
      address: profile.address || "",            // ✅ NEW FIELD

      emergencyContactPhone: profile.emergencyContactPhone || "",
      status: profile.status || "Active",
      initialPaymentAmount: profile.initialPaymentAmount ?? 0,
      tuitionFee: profile.tuitionFee ?? null,
      balanceDue: profile.balanceDue ?? null,
      paymentStatus: profile.paymentStatus || "pending",
      paystackLink: profile.paystackLink || "",
      paymentIntentAmount: profile.paymentIntentAmount ?? null,
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
    setStudentProfile({ id: studentsRef.id, ...payload });
    setNotificationStatus("idle");
    return { studentCode, paystackLink: payload.paystackLink };
  };

  const login = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase-Konfiguration fehlt. Bitte .env Variablen setzen.");
    }
    setAuthError("");
    const normalizedEmail = email.trim().toLowerCase();

    const finalizeLogin = async (credential, profileOverride = null, meta = {}) => {
      const token = await credential.user.getIdToken();
      setIdToken(token);
      const profile = profileOverride || (await fetchStudentProfileByEmail(normalizedEmail));
      setStudentProfile(profile);
      setMessagingToken(profile?.messagingToken || null);

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
      if (error?.code === "auth/user-not-found") {
        const existingProfile = await fetchStudentProfileByEmail(normalizedEmail);

        if (existingProfile) {
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

          return await finalizeLogin(migratedCredential, mergedProfile, { migratedFromLegacy: true });
        }
      }

      throw error;
    }
  };

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

    const existingProfile = await fetchStudentProfileByEmail(email);
    if (!existingProfile) {
      await signOut(auth);
      throw new Error("Only existing students in our records can use Google sign-in. Please contact support.");
    }

    if (existingProfile.role && `${existingProfile.role}`.toLowerCase() !== "student") {
      await signOut(auth);
      throw new Error("Google sign-in is limited to student accounts. Please contact support for access.");
    }

    const studentRef = doc(db, "students", existingProfile.id);
    await setDoc(
      studentRef,
      {
        uid: credential.user.uid,
        email,
        role: existingProfile.role || "student",
        updated_at: serverTimestamp(),
      },
      { merge: true }
    );

    const token = await credential.user.getIdToken();
    setIdToken(token);
    const mergedProfile = { ...existingProfile, uid: credential.user.uid, email };
    setStudentProfile(mergedProfile);
    setMessagingToken(mergedProfile?.messagingToken || null);
    return { credential, profile: mergedProfile };
  }, []);

  const refreshUser = async () => {
    if (!auth?.currentUser) return null;
    await reload(auth.currentUser);
    setUser(auth.currentUser);
    return auth.currentUser;
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
      loginWithGoogle,
      resetPassword,
      logout,
      enableNotifications,
      messagingToken,
      notificationStatus,
      saveStudentProfile,
      refreshUser,
    }),
    [
      user,
      studentProfile,
      idToken,
      loading,
      authError,
      resetPassword,
      loginWithGoogle,
      messagingToken,
      notificationStatus,
      saveStudentProfile,
      enableNotifications,
      logout,
      refreshUser,
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
