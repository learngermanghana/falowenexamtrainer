import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);

let messagingPromise = null;

const getMessagingInstance = async () => {
  if (!messagingPromise) {
    messagingPromise = isSupported().then((supported) =>
      supported ? getMessaging(app) : null
    );
  }

  return messagingPromise;
};

const ensureServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) return null;

  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js"
  );

  registration?.active?.postMessage({
    type: "INIT_FIREBASE",
    payload: firebaseConfig,
  });

  return registration;
};

export const requestMessagingToken = async () => {
  const messaging = await getMessagingInstance();

  if (!messaging) {
    throw new Error("Push messaging is not supported in this browser.");
  }

  if (!("Notification" in window)) {
    throw new Error("Notifications are not available in this environment.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notifications were not granted.");
  }

  const registration = await ensureServiceWorker();

  const token = await getToken(messaging, {
    vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration || undefined,
  });

  return token;
};

export const listenForForegroundMessages = async (callback) => {
  const messaging = await getMessagingInstance();
  if (!messaging) return () => {};

  return onMessage(messaging, callback);
};
