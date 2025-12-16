import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signOut,
  requestMessagingToken,
} from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("idle");
  const [messagingToken, setMessagingToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
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
      } catch (error) {
        console.error("Failed to fetch ID token", error);
        setAuthError("Konnte Login-Token nicht laden.");
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, profile = {}) => {
    setAuthError("");
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
      profile
    );
    const token = await credential.user.getIdToken();
    setIdToken(token);
    return credential;
  };

  const login = async (email, password) => {
    setAuthError("");
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const token = await credential.user.getIdToken();
    setIdToken(token);
    return credential;
  };

  const logout = async () => {
    await signOut(auth);
    setMessagingToken(null);
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
