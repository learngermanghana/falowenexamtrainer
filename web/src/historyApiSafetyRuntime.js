const restoreNativeHistoryMethod = (methodName) => {
  if (typeof window === "undefined") return false;

  const history = window.history;
  const prototype = window.History?.prototype;
  const current = history?.[methodName];
  const nativeMethod = prototype?.[methodName];

  if (!history || typeof current !== "function" || typeof nativeMethod !== "function") {
    return false;
  }

  const looksLikeLegacyCleanupPatch =
    current.name === "patchedHistoryMethod" ||
    String(current).includes("scheduleCleanup");

  if (!looksLikeLegacyCleanupPatch) return false;

  try {
    delete history[methodName];
  } catch (_error) {
    // Some WebViews expose History methods as non-configurable instance fields.
  }

  if (history[methodName]?.name === "patchedHistoryMethod") {
    try {
      Object.defineProperty(history, methodName, {
        configurable: true,
        writable: true,
        value: nativeMethod.bind(history),
      });
    } catch (_error) {
      return false;
    }
  }

  return history[methodName]?.name !== "patchedHistoryMethod";
};

restoreNativeHistoryMethod("pushState");
restoreNativeHistoryMethod("replaceState");

export { restoreNativeHistoryMethod };
