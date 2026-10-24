const CLASS_STORAGE_KEY = "exam-coach-class";
const isBrowser = typeof window !== "undefined";

export const loadPreferredClass = () => {
  if (!isBrowser) return null;
  try {
    const value = window.localStorage.getItem(CLASS_STORAGE_KEY);
    return value || null;
  } catch (error) {
    console.warn("Failed to load preferred class", error);
    return null;
  }
};

export const savePreferredClass = (className) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(CLASS_STORAGE_KEY, className);
    window.dispatchEvent(
      new CustomEvent("class-selection-changed", { detail: { className } })
    );
  } catch (error) {
    console.warn("Failed to store preferred class", error);
  }
};

export const clearPreferredClass = () => {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(CLASS_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear preferred class", error);
  }
};
