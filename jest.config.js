/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/functions/functionz/__tests__", "<rootDir>/functions/functionz/tests"],
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
  // These three suites use Node's built-in node:test runner, not Jest.
  // They are executed separately with node --test in the integration workflow.
  testPathIgnorePatterns: [
    "/functions/functionz/tests/b1Day25ClassAudio\\.test\\.js$",
    "/functions/functionz/tests/a2Day18BankAudio\\.test\\.js$",
    "/functions/functionz/tests/a2Day20ReklamationAudio\\.test\\.js$",
  ],
  clearMocks: true,
  transformIgnorePatterns: ["/node_modules/"],
};
