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
  serverTimestamp,
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

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setStudentProfile(null);
      setAuthError("");

      if (!firebaseUser) {
        setIdToken(null);
        setLoading(false);
        setMessagingToken(null);
        return;
      }

      try {
        const token = await firebaseUser.getIdToken();
        setIdToken(token);
        const profile = await fetchStudentProfileByEmail(firebaseUser.email);
        setStudentProfile(profile);
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
    return credential;
  };

  const login = async (email, password) => {
    setAuthError("");
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const token = await credential.user.getIdToken();
    setIdToken(token);
    const profile = await fetchStudentProfileByEmail(email);
    setStudentProfile(profile);
    return credential;
  };

  const logout = async () => {
    await signOut(auth);
    setMessagingToken(null);
    setStudentProfile(null);
  };

  const enableNotifications = async () => {
    setNotificationStatus("pending");
    try {
      const token = await requestMessagingToken();
      setMessagingToken(token);
      setNotificationStatus("granted");
      return token;
    } catch (error) {
      console.error("Failed to enable notifications", error);
      setNotificationStatus("error");
      throw error;
    }
  };

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
