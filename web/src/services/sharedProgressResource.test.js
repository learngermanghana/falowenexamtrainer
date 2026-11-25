import { createSharedProgressResource } from "./sharedProgressResource";

test("simultaneous views reuse one subscription and fallback load, closing the last view stops it", () => {
  const stop = jest.fn();
  const start = jest.fn((identity, emit) => { emit(identity); return stop; });
  const resource = createSharedProgressResource(start, null);
  const first = jest.fn(), second = jest.fn();
  const a = resource.subscribe("student-a/A1", "A", first);
  const b = resource.subscribe("student-a/A1", "A", second);
  expect(start).toHaveBeenCalledTimes(1);
  expect(second).toHaveBeenLastCalledWith("A");
  a();
  expect(stop).not.toHaveBeenCalled();
  b();
  expect(stop).toHaveBeenCalledTimes(1);
  const c = resource.subscribe("student-a/A1", "A", first);
  expect(start).toHaveBeenCalledTimes(2);
  c();
});
test("refresh is shared and callbacks from retired generations cannot leak into another view", () => {
  const callbacks = [];
  const stop = jest.fn();
  const resource = createSharedProgressResource((identity, emit) => { callbacks.push(emit); return stop; }, null);
  const a = jest.fn(), b = jest.fn();
  const closeA = resource.subscribe("a", "a", a);
  const closeB = resource.subscribe("b", "b", b);
  resource.refresh("a");
  callbacks[0]("stale");
  callbacks[2]("new");
  expect(a).toHaveBeenLastCalledWith("new");
  expect(b).toHaveBeenLastCalledWith(null);
  closeA(); closeB();
  callbacks[2]("after-close");
  expect(a).toHaveBeenLastCalledWith("new");
});
