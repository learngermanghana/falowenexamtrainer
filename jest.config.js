/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/functionz/__tests__", "<rootDir>/functionz/tests"],
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
  clearMocks: true,
};
