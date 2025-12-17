import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  clearPreferredClass,
  loadPreferredClass,
  savePreferredClass,
} from "../services/classSelectionStorage";
import { PAYMENT_PROVIDER } from "../data/paystackPlans";

const isBrowser = typeof window !== "undefined";
const ACCESS_STORAGE_KEY = "exam-coach-access";

const BASE_ACCESS_STATE = {
  coursePaymentStatus: "trial", // trial | partial | full
  coursePaymentDate: null,
  trialStartedAt: null,
  focus: "class", // class | exam-only
  preferredClass: null,
  paystackReference: "",
};

const addDays = (date, days) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
const addMonths = (date, months) => {
  const copy = new Date(date.getTime());
  copy.setMonth(copy.getMonth() + months);
  return copy;
};

const loadAccessStore = () => {
  if (!isBrowser) return {};
  try {
    const raw = window.localStorage.getItem(ACCESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) || {} : {};
  } catch (error) {
    console.warn("Failed to load access store", error);
    return {};
  }
};

const persistAccessStore = (store) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.warn("Failed to persist access store", error);
  }
};

const getInitialStateForEmail = (email) => {
  const store = loadAccessStore();
  const stored = email ? store[email] : null;
  const nowIso = new Date().toISOString();
  const preferredClass = loadPreferredClass();

  return {
    ...BASE_ACCESS_STATE,
    trialStartedAt: stored?.trialStartedAt || nowIso,
    coursePaymentDate: stored?.coursePaymentDate || nowIso,
    coursePaymentStatus: stored?.coursePaymentStatus || "trial",
    focus: stored?.focus || (preferredClass ? "class" : "exam-only"),
    preferredClass: stored?.preferredClass || preferredClass,
    paystackReference: stored?.paystackReference || "",
  };
};

const AccessContext = createContext();

export const AccessProvider = ({ children }) => {
  const { user } = useAuth();
  const emailKey = (user?.email || "").toLowerCase();
  const [state, setState] = useState(() =>
    emailKey ? getInitialStateForEmail(emailKey) : null
  );

  const persistForEmail = (nextState) => {
    if (!emailKey) return;
    const store = loadAccessStore();
    store[emailKey] = nextState;
    persistAccessStore(store);
  };

  useEffect(() => {
    if (!emailKey) {
      setState(null);
      return;
    }

    const initialState = getInitialStateForEmail(emailKey);
    setState(initialState);
    persistForEmail(initialState);
  }, [emailKey]);

  const updateState = (updater) => {
    setState((prev) => {
      const base = prev || getInitialStateForEmail(emailKey);
      const nextState = typeof updater === "function" ? updater(base) : updater;
      persistForEmail(nextState);
      return nextState;
    });
  };

  const markPartialPayment = (reference = "") => {
    const nowIso = new Date().toISOString();
    updateState((prev) => ({
      ...prev,
      coursePaymentStatus: "partial",
      coursePaymentDate: nowIso,
      paystackReference: reference || prev.paystackReference,
    }));
  };

  const markFullPayment = (reference = "") => {
    const nowIso = new Date().toISOString();
    updateState((prev) => ({
      ...prev,
      coursePaymentStatus: "full",
      coursePaymentDate: nowIso,
      paystackReference: reference || prev.paystackReference,
    }));
  };

  const setPreferredClass = (className) => {
    if (className) {
      savePreferredClass(className);
    }
    updateState((prev) => ({
      ...prev,
      preferredClass: className || null,
      focus: className ? "class" : prev.focus,
    }));
  };

  const setExamOnlyFocus = () => {
    clearPreferredClass();
    updateState((prev) => ({
      ...prev,
      preferredClass: null,
      focus: "exam-only",
    }));
  };

  const derived = useMemo(() => {
    if (!state) {
      return {
        trialActive: false,
        trialEndsAt: null,
        courseAccessUntil: null,
        hasCourseAccess: false,
        hasExamAccess: false,
        courseAccessLabel: "No access",
      };
    }

    const trialStartDate = new Date(state.trialStartedAt || new Date().toISOString());
    const trialEndsAt = addDays(trialStartDate, 3);
    const paymentDate = new Date(state.coursePaymentDate || state.trialStartedAt || new Date());

    let courseAccessUntil = trialEndsAt;
    if (state.coursePaymentStatus === "partial") {
      courseAccessUntil = addMonths(paymentDate, 1);
    }
    if (state.coursePaymentStatus === "full") {
      courseAccessUntil = addMonths(paymentDate, 6);
    }

    const now = new Date();
    const trialActive = state.coursePaymentStatus === "trial" && now <= trialEndsAt;
    const hasCourseAccess = now <= courseAccessUntil;
    const hasExamAccess = state.coursePaymentStatus === "full";

    const courseAccessLabel = state.coursePaymentStatus === "full"
      ? "Full payment · 6 months access"
      : state.coursePaymentStatus === "partial"
      ? "Part payment · 1 month access"
      : "Trial · 3 days access";

    return {
      trialActive,
      trialEndsAt,
      courseAccessUntil,
      hasCourseAccess,
      hasExamAccess,
      courseAccessLabel,
    };
  }, [state]);

  const value = useMemo(
    () => ({
      state,
      ...derived,
      markPartialPayment,
      markFullPayment,
      setPreferredClass,
      setExamOnlyFocus,
      paymentProvider: PAYMENT_PROVIDER,
    }),
    [derived, state]
  );

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
};

export const useAccess = () => {
  const ctx = useContext(AccessContext);
  if (!ctx) {
    throw new Error("useAccess must be used within an AccessProvider");
  }
  return ctx;
};
