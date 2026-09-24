/** @jest-environment node */
import { __private__ } from "./serviceWorkerRegistration";

let originalNavigator;
let registration;

beforeEach(() => {
  originalNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  globalThis.window = Object.assign(new EventTarget(), { location: { reload: jest.fn() } });
  globalThis.document = Object.assign(new EventTarget(), { visibilityState: "visible" });
  const serviceWorker = Object.assign(new EventTarget(), {
    controller: { id: "active" },
    register: jest.fn(),
  });
  Object.defineProperty(globalThis, "navigator", {
    configurable: true, value: { serviceWorker },
  });
  registration = Object.assign(new EventTarget(), {
    waiting: { postMessage: jest.fn() },
    update: jest.fn().mockResolvedValue(undefined),
  });
  serviceWorker.register.mockResolvedValue(registration);
});

afterEach(() => {
  delete globalThis.window;
  delete globalThis.document;
  if (originalNavigator) Object.defineProperty(globalThis, "navigator", originalNavigator);
  else delete globalThis.navigator;
  jest.restoreAllMocks();
});

it("activates a waiting worker without reloading the open lesson on controller change", () => {
  __private__.setupUpdateHandlers(registration);
  expect(registration.waiting.postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });
  navigator.serviceWorker.dispatchEvent(new Event("controllerchange"));
  navigator.serviceWorker.dispatchEvent(new Event("controllerchange"));
  expect(window.location.reload).not.toHaveBeenCalled();
});

it("activates a newly installed worker without discarding in-memory page state", () => {
  registration.waiting = null;
  registration.installing = Object.assign(new EventTarget(), {
    state: "installing", postMessage: jest.fn(),
  });
  __private__.setupUpdateHandlers(registration);
  registration.dispatchEvent(new Event("updatefound"));
  registration.installing.state = "installed";
  registration.installing.dispatchEvent(new Event("statechange"));
  expect(registration.installing.postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });
  navigator.serviceWorker.dispatchEvent(new Event("controllerchange"));
  expect(window.location.reload).not.toHaveBeenCalled();
});

it("still checks for updates on resume and reconnect, without forcing a reload", async () => {
  __private__.setupUpdateChecks(registration);
  document.visibilityState = "hidden";
  document.dispatchEvent(new Event("visibilitychange"));
  expect(registration.update).not.toHaveBeenCalled();
  document.visibilityState = "visible";
  document.dispatchEvent(new Event("visibilitychange"));
  window.dispatchEvent(new Event("online"));
  await Promise.resolve();
  expect(registration.update).toHaveBeenCalledTimes(2);
  expect(window.location.reload).not.toHaveBeenCalled();
});

it("does not refresh the page on first registration or run a daily forced reload", async () => {
  __private__.startRegistration();
  await Promise.resolve();
  await Promise.resolve();
  expect(navigator.serviceWorker.register).toHaveBeenCalledTimes(1);
  expect(registration.update).toHaveBeenCalledTimes(1);
  expect(window.location.reload).not.toHaveBeenCalled();
});
