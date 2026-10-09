const LEVEL_STORAGE_KEY = "exam-coach-level";

const isBrowser = typeof window !== "undefined";

// Persist exam practice per student, not across different accounts on one device.
const storageKeyFor = (userId) =>
  userId ? `${LEVEL_STORAGE_KEY}:${userId}` : LEVEL_STORAGE_KEY;

export const loadPreferredLevel = (userId) => {
  if (!isBrowser) return null;
  try {
    const value = window.localStorage.getItem(storageKeyFor(userId));
    return value || null;
  } catch (error) {
    console.warn("Failed to load preferred level", error);
    return null;
  }
};

export const savePreferredLevel = (level, userId) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(storageKeyFor(userId), level);
  } catch (error) {
    console.warn("Failed to store preferred level", error);
  }
};

export const clearPreferredLevel = (userId) => {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(storageKeyFor(userId));
  } catch (error) {
    console.warn("Failed to clear preferred level", error);
  }
};
