const installLegacyPatch = (methodName) => {
  const original = window.history[methodName];
  window.history[methodName] = function patchedHistoryMethod(...args) {
    return original.apply(this, args);
  };
};

const resetHistoryMethod = (methodName) => {
  try {
    delete window.history[methodName];
  } catch (_error) {
    window.history[methodName] = window.History.prototype[methodName].bind(window.history);
  }
};

describe("History API startup safety", () => {
  beforeEach(() => {
    jest.resetModules();
    resetHistoryMethod("pushState");
    resetHistoryMethod("replaceState");
  });

  afterEach(() => {
    resetHistoryMethod("pushState");
    resetHistoryMethod("replaceState");
  });

  test("removes the cached course cleanup wrappers before React Router starts", () => {
    installLegacyPatch("pushState");
    installLegacyPatch("replaceState");

    expect(window.history.pushState.name).toBe("patchedHistoryMethod");
    expect(window.history.replaceState.name).toBe("patchedHistoryMethod");

    jest.isolateModules(() => {
      require("../historyApiSafetyRuntime");
    });

    expect(window.history.pushState.name).not.toBe("patchedHistoryMethod");
    expect(window.history.replaceState.name).not.toBe("patchedHistoryMethod");
    expect(() => window.history.pushState({}, "", "/campus/course/lesson/A1/15?chapter=4.7&hub=1")).not.toThrow();
    expect(() => window.history.replaceState({}, "", "/campus/course/lesson/A1/15?chapter=4.7&hub=1&radio=done")).not.toThrow();
  });
});
