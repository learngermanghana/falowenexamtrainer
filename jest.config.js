/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/functions/functionz/__tests__", "<rootDir>/functions/functionz/tests"],
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
  clearMocks: true,
};
