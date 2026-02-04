const LEVEL_STORAGE_KEY = "exam-coach-level";

const isBrowser = typeof window !== "undefined";

export const loadPreferredLevel = () => {
  if (!isBrowser) return null;
  try {
    const value = window.localStorage.getItem(LEVEL_STORAGE_KEY);
    return value || null;
  } catch (error) {
    console.warn("Failed to load preferred level", error);
    return null;
  }
};

export const savePreferredLevel = (level) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(LEVEL_STORAGE_KEY, level);
  } catch (error) {
    console.warn("Failed to store preferred level", error);
  }
};

export const clearPreferredLevel = () => {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(LEVEL_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear preferred level", error);
  }
};
