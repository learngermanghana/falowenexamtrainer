import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  onIdTokenChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  serverTimestamp,
  limit,
  addDoc,
  startAfter,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  Timestamp,
  collectionGroup,
  deleteField,
} from "firebase/firestore";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const resolveActionCodeUrl = () => {
  if (process.env.REACT_APP_AUTH_CONTINUE_URL) {
    return process.env.REACT_APP_AUTH_CONTINUE_URL;
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  if (firebaseConfig.authDomain) {
    return `https://${firebaseConfig.authDomain}`;
  }

  return "http://localhost";
};

const getActionCodeSettings = () => ({
  url: resolveActionCodeUrl(),
  handleCodeInApp: false,
});

const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

const missingConfigError = new Error(
  "Firebase config is missing. Please set REACT_APP_FIREBASE_* env vars."
);

const getFirebaseApp = () => {
  if (!isFirebaseConfigured) {
    throw missingConfigError;
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
};

const app = isFirebaseConfigured ? getFirebaseApp() : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

let messagingServiceWorkerRegistrationPromise = null;
let unregisteringMessagingServiceWorkerPromise = null;

const sendFirebaseConfigToServiceWorker = async (registration) => {
  if (!registration) return null;
  const serviceWorker = registration.active || registration.waiting;

  if (serviceWorker) {
    serviceWorker.postMessage({
      type: "INIT_FIREBASE",
      payload: firebaseConfig,
    });
    return registration;
  }

  const installingWorker = registration.installing;
  if (installingWorker) {
    return new Promise((resolve) => {
      installingWorker.addEventListener("statechange", (event) => {
        if (event.target.state === "activated" && registration.active) {
          registration.active.postMessage({
            type: "INIT_FIREBASE",
            payload: firebaseConfig,
          });
          resolve(registration);
        }
      });
    });
  }

  return registration;
};

const registerMessagingServiceWorker = async () => {
  if (messagingServiceWorkerRegistrationPromise) {
    return messagingServiceWorkerRegistrationPromise;
  }

  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  messagingServiceWorkerRegistrationPromise = navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then(() => navigator.serviceWorker.ready)
    .then(sendFirebaseConfigToServiceWorker)
    .catch((error) => {
      console.error("Failed to register messaging service worker", error);
      return null;
    });

  return messagingServiceWorkerRegistrationPromise;
};

const unregisterMessagingServiceWorker = async () => {
  if (unregisteringMessagingServiceWorkerPromise) {
    return unregisteringMessagingServiceWorkerPromise;
  }

  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  unregisteringMessagingServiceWorkerPromise = navigator.serviceWorker
    .getRegistrations()
    .then((registrations) =>
      Promise.all(
        registrations
          .filter((registration) =>
            [registration.active, registration.waiting, registration.installing]
              .filter(Boolean)
              .some((worker) => worker.scriptURL.includes("firebase-messaging-sw.js"))
          )
          .map((registration) => registration.unregister())
      )
    )
    .then(() => {
      messagingServiceWorkerRegistrationPromise = null;
      unregisteringMessagingServiceWorkerPromise = null;
      return null;
    })
    .catch((error) => {
      console.error("Failed to unregister messaging service worker", error);
      unregisteringMessagingServiceWorkerPromise = null;
      return null;
    });

  return unregisteringMessagingServiceWorkerPromise;
};

const assertFirebaseReady = () => {
  if (!isFirebaseConfigured || !app) {
    throw missingConfigError;
  }
};

const ensureNotificationPermission = async () => {
  if (typeof window === "undefined" || typeof Notification === "undefined") {
    return "unsupported";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  return Notification.requestPermission();
};

const requestMessagingToken = async (shouldRetry = true) => {
  assertFirebaseReady();
  const supported = await isSupported().catch(() => false);
  if (!supported) {
    throw new Error("Browser does not support Firebase Cloud Messaging.");
  }

  const permission = await ensureNotificationPermission();
  if (permission !== "granted") {
    return null;
  }

  const messaging = getMessaging(app);
  const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    throw new Error("Missing REACT_APP_FIREBASE_VAPID_KEY for push notifications.");
  }

  const serviceWorkerRegistration = await registerMessagingServiceWorker();

  if (!serviceWorkerRegistration) {
    throw new Error(
      "Push notifications require a registered service worker. Please use HTTPS or localhost."
    );
  }

  try {
    return await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: serviceWorkerRegistration || undefined,
    });
  } catch (error) {
    const isSubscribeFailed = error?.code === "messaging/token-subscribe-failed";

    if (shouldRetry && isSubscribeFailed) {
      await unregisterMessagingServiceWorker();
      return requestMessagingToken(false);
    }

    throw error;
  }
};

const listenForForegroundMessages = async (callback) => {
  if (!isFirebaseConfigured || !app) return () => {};
  const supported = await isSupported().catch(() => false);
  if (!supported) return () => {};
  const messaging = getMessaging(app);
  return onMessage(messaging, callback);
};

export {
  app,
  auth,
  db,
  isFirebaseConfigured,
  onIdTokenChanged,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  requestMessagingToken,
  listenForForegroundMessages,
  getActionCodeSettings,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  serverTimestamp,
  limit,
  addDoc,
  startAfter,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  Timestamp,
  collectionGroup,
  deleteField,
};
