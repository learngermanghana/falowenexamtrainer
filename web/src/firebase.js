import legacyStudents from "./data/legacyStudents";

const isBrowser = typeof window !== "undefined";

const STORAGE_KEY = "exam-coach-auth";
const USER_STORE_KEY = "exam-coach-users";

const createToken = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const loadUserStore = () => {
  if (!isBrowser) return { users: {}, seededLegacy: false };
  try {
    const raw = window.localStorage.getItem(USER_STORE_KEY);
    if (!raw) return { users: {}, seededLegacy: false };
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object"
      ? { users: parsed.users || {}, seededLegacy: Boolean(parsed.seededLegacy) }
      : { users: {}, seededLegacy: false };
  } catch (error) {
    console.warn("Failed to load user store", error);
    return { users: {}, seededLegacy: false };
  }
};

const persistUserStore = (store) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(USER_STORE_KEY, JSON.stringify(store));
  } catch (error) {
    console.warn("Failed to persist user store", error);
  }
};

const userStore = loadUserStore();

const wrapUser = (user) => ({
  ...user,
  getIdToken: async () => user.token,
});

const seedLegacyStudents = () => {
  if (userStore.seededLegacy || !Array.isArray(legacyStudents)) return;

  legacyStudents.forEach((student) => {
    const emailKey = (student.email || "").toLowerCase();
    if (!emailKey || userStore.users[emailKey]) return;

    userStore.users[emailKey] = {
      uid: createToken(),
      email: student.email,
      password: null,
      token: null,
      profile: {
        firstName: student.firstName || "",
        level: (student.level || "").toUpperCase(),
        studentCode: student.studentCode || "",
        legacy: true,
      },
    };
  });

  userStore.seededLegacy = true;
  persistUserStore(userStore);
};

seedLegacyStudents();

const findUserByEmail = (email) => {
  if (!email) return null;
  return userStore.users[email.toLowerCase()] || null;
};

const loadStoredUser = () => {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || !parsed.email) return null;

    const stored = findUserByEmail(parsed.email) || parsed;
    return wrapUser({ ...stored, token: stored.token || createToken() });
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

const auth = {
  currentUser: null,
  listeners: new Set(),
};

const notifyAuthListeners = () => {
  auth.listeners.forEach((callback) => callback(auth.currentUser));
};

const setCurrentUser = (user) => {
  auth.currentUser = user ? wrapUser(user) : null;
  persistUser(user ? user : null);
  notifyAuthListeners();
};

auth.currentUser = loadStoredUser();

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

  const emailKey = email.toLowerCase();
  if (userStore.users[emailKey]) {
    throw new Error("An account with this email already exists.");
  }

  const user = {
    uid: createToken(),
    email,
    password,
    token: createToken(),
    profile,
  };

  userStore.users[emailKey] = user;
  persistUserStore(userStore);
  setCurrentUser(user);
  return { user: auth.currentUser };
};

export const signInWithEmailAndPassword = async (_auth, email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const stored = findUserByEmail(email);

  if (!stored) {
    throw new Error("No account found. Please sign up first.");
  }

  if (!stored.password) {
    const activatedUser = {
      ...stored,
      password,
      token: createToken(),
      profile: {
        ...stored.profile,
        legacy: true,
      },
    };
    userStore.users[email.toLowerCase()] = activatedUser;
    persistUserStore(userStore);
    setCurrentUser(activatedUser);
    return { user: auth.currentUser, migratedFromLegacy: true };
  }

  if (stored.password !== password) {
    throw new Error("Invalid credentials");
  }

  const refreshedUser = { ...stored, token: createToken() };
  userStore.users[email.toLowerCase()] = refreshedUser;
  persistUserStore(userStore);
  setCurrentUser(refreshedUser);
  return { user: auth.currentUser, migratedFromLegacy: false };
};

export const signOut = async (_auth) => {
  setCurrentUser(null);
};

export const requestMessagingToken = async () => {
  throw new Error("Push notifications are unavailable without the Firebase SDK.");
};

export const listenForForegroundMessages = async () => () => {};

export { auth };
