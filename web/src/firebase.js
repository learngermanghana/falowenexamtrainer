const isBrowser = typeof window !== "undefined";

const STORAGE_KEY = "exam-coach-auth";

const loadStoredUser = () => {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Failed to read stored auth user", error);
    return null;
  }
};

const persistUser = (user) => {
  if (!isBrowser) return;
  try {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.warn("Failed to persist auth user", error);
  }
};

const createToken = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const auth = {
  currentUser: loadStoredUser(),
  listeners: new Set(),
};

const notifyAuthListeners = () => {
  auth.listeners.forEach((callback) => callback(auth.currentUser));
};

const wrapUser = (user) => ({
  ...user,
  getIdToken: async () => user.token,
});

const setCurrentUser = (user) => {
  auth.currentUser = user ? wrapUser(user) : null;
  persistUser(user ? auth.currentUser : null);
  notifyAuthListeners();
};

export const onIdTokenChanged = (authInstance, callback) => {
  callback(authInstance.currentUser);
  authInstance.listeners.add(callback);
  return () => authInstance.listeners.delete(callback);
};

export const createUserWithEmailAndPassword = async (
  _auth,
  email,
  password,
  profile = {}
) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = {
    uid: createToken(),
    email,
    password,
    token: createToken(),
    profile,
  };

  setCurrentUser(user);
  return { user: auth.currentUser };
};

export const signInWithEmailAndPassword = async (_auth, email, password) => {
  const stored = auth.currentUser;
  if (!stored || stored.email !== email || stored.password !== password) {
    throw new Error("Invalid credentials");
  }

  setCurrentUser({ ...stored, token: createToken() });
  return { user: auth.currentUser };
};

export const signOut = async (_auth) => {
  setCurrentUser(null);
};

export const requestMessagingToken = async () => {
  throw new Error("Push notifications are unavailable without the Firebase SDK.");
};

export const listenForForegroundMessages = async () => () => {};

export { auth };
