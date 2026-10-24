export function readSpeakingRecovery(storage, key, strict = false) {
  try {
    const saved = JSON.parse(storage.getItem(`${key}:recovery`) || '[]');
    if (!Array.isArray(saved)) throw new Error('Saved speaking recovery data could not be read.');
    return saved;
  } catch (error) { if (strict) throw error; return []; }
}

// Archive before replacing a draft. If storage fails, callers must stop rather than overwrite it.
export function preserveSpeakingRecovery(storage, key, draft) {
  const saved = readSpeakingRecovery(storage, key, true);
  if (!draft?.results?.length) return saved;
  if (saved.some(entry => JSON.stringify(entry.draft) === JSON.stringify(draft))) return saved;
  const next = [...saved, { savedAt: new Date().toISOString(), draft }];
  storage.setItem(`${key}:recovery`, JSON.stringify(next));
  return next;
}
