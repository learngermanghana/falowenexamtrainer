const isLegacyHistoryPatch = (method) =>
  typeof method === "function" && (
    method.name === "patchedHistoryMethod" ||
    String(method).includes("scheduleCleanup")
  );

const restoreHistoryMethodOnTarget = (history, prototype, methodName) => {
  const current = history?.[methodName];
  const nativeMethod = prototype?.[methodName];

  if (!history || typeof current !== "function" || typeof nativeMethod !== "function") {
    return false;
  }

  if (!isLegacyHistoryPatch(current)) return false;

  try {
    delete history[methodName];
  } catch (_error) {
    // Some WebViews expose History methods as non-configurable instance fields.
  }

  if (!isLegacyHistoryPatch(history[methodName])) return true;

  const replacement = nativeMethod.bind(history);
  const descriptor = Object.getOwnPropertyDescriptor(history, methodName);

  try {
    if (descriptor && Object.prototype.hasOwnProperty.call(descriptor, "value")) {
      if (!descriptor.writable) return false;

      // A non-configurable data property may still have its value replaced when
      // it is writable, but none of its descriptor flags may be relaxed.
      Object.defineProperty(history, methodName, {
        ...descriptor,
        value: replacement,
      });
    } else if (typeof descriptor?.set === "function") {
      descriptor.set.call(history, replacement);
    } else {
      history[methodName] = replacement;
    }
  } catch (_error) {
    try {
      // Assignment also preserves a non-configurable writable descriptor.
      history[methodName] = replacement;
    } catch (_assignmentError) {
      return false;
    }
  }

  return !isLegacyHistoryPatch(history[methodName]);
};

const restoreNativeHistoryMethod = (methodName) => {
  if (typeof window === "undefined") return false;

  return restoreHistoryMethodOnTarget(
    window.history,
    window.History?.prototype,
    methodName,
  );
};

restoreNativeHistoryMethod("pushState");
restoreNativeHistoryMethod("replaceState");

export { restoreHistoryMethodOnTarget, restoreNativeHistoryMethod };
