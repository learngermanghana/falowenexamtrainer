import {
  initializeApp,
  getApps,
  getApp,
} from "firebase/app";
import {
  getAuth,
  onIdTokenChanged,
  createUserWithEmailAndPassword,
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

const getFirebaseApp = () => {
  if (!firebaseConfig.apiKey) {
    throw new Error("Firebase config is missing. Please set REACT_APP_FIREBASE_* env vars.");
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
};

const app = getFirebaseApp();
const auth = getAuth(app);
const db = getFirestore(app);

const requestMessagingToken = async () => {
  const supported = await isSupported().catch(() => false);
  if (!supported) {
    throw new Error("Browser does not support Firebase Cloud Messaging.");
  }

  const messaging = getMessaging(app);
  const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    throw new Error("Missing REACT_APP_FIREBASE_VAPID_KEY for push notifications.");
  }

  return getToken(messaging, { vapidKey });
};

const listenForForegroundMessages = async (callback) => {
  const supported = await isSupported().catch(() => false);
  if (!supported) return () => {};
  const messaging = getMessaging(app);
  return onMessage(messaging, callback);
};

export {
  app,
  auth,
  db,
  onIdTokenChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  requestMessagingToken,
  listenForForegroundMessages,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  serverTimestamp,
  limit,
};
