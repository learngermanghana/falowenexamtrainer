// A single active read/listener set per student identity and course level.
// No background timers or persistent cross-account cache.
export function createSharedProgressResource(start, initialValue) {
  const entries = new Map();
  function launch(entry) {
    const generation = ++entry.generation;
    entry.stop = start(entry.identity, value => {
      if (entry.generation !== generation || !entry.listeners.size) return;
      entry.value = value;
      entry.listeners.forEach(listener => listener(value));
    });
  }
  return {
    subscribe(key, identity, listener) {
      let entry = entries.get(key);
      const first = !entry;
      if (!entry) {
        entry = { identity, value: initialValue, listeners: new Set(), generation: 0, stop: null };
        entries.set(key, entry);
      }
      entry.listeners.add(listener);
      listener(entry.value);
      if (first) launch(entry);
      return () => {
        if (entries.get(key) !== entry) return;
        entry.listeners.delete(listener);
        if (!entry.listeners.size) {
          entry.generation++;
          entry.stop?.();
          entries.delete(key);
        }
      };
    },
    refresh(key) {
      const entry = entries.get(key);
      if (!entry || !entry.listeners.size) return;
      entry.generation++;
      entry.stop?.();
      launch(entry);
    },
  };
}
