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

  test.each(["pushState", "replaceState"])(
    "restores a writable non-configurable WebView %s property without changing its descriptor flags",
    (methodName) => {
      let restoreHistoryMethodOnTarget;
      jest.isolateModules(() => {
        ({ restoreHistoryMethodOnTarget } = require("../historyApiSafetyRuntime"));
      });

      const fakeHistory = {};
      const prototype = {
        [methodName]: function nativeHistoryMethod() {
          return this;
        },
      };

      Object.defineProperty(fakeHistory, methodName, {
        configurable: false,
        enumerable: true,
        writable: true,
        value: function patchedHistoryMethod() {
          return "legacy";
        },
      });

      expect(restoreHistoryMethodOnTarget(fakeHistory, prototype, methodName)).toBe(true);

      const descriptor = Object.getOwnPropertyDescriptor(fakeHistory, methodName);
      expect(descriptor).toEqual(expect.objectContaining({
        configurable: false,
        enumerable: true,
        writable: true,
      }));
      expect(fakeHistory[methodName].name).not.toBe("patchedHistoryMethod");
      expect(fakeHistory[methodName]()).toBe(fakeHistory);
    },
  );
});
