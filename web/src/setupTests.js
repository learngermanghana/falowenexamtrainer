// jest-dom adds custom Jest matchers for asserting on DOM nodes.
import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// React Router's web APIs expect these browser globals. Node provides the
// standards-compatible implementation, but jsdom does not expose it by default.
if (!globalThis.TextEncoder) {
  Object.defineProperty(globalThis, "TextEncoder", {
    configurable: true,
    writable: true,
    value: TextEncoder,
  });
}

if (!globalThis.TextDecoder) {
  Object.defineProperty(globalThis, "TextDecoder", {
    configurable: true,
    writable: true,
    value: TextDecoder,
  });
}

// Firebase checks for fetch while modules are imported. Tests remain offline,
// and individual suites can replace this fallback with their own mock.
if (!globalThis.fetch) {
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    writable: true,
    value: jest.fn(() =>
      Promise.reject(new Error("Network requests are disabled in Jest tests.")),
    ),
  });
}
