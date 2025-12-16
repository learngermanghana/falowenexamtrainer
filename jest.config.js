/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/functionz/__tests__"],
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
  clearMocks: true,
};
