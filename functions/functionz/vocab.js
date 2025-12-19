const RAW_VOCAB_ENTRIES = [
];

const VOCAB_ENTRIES = RAW_VOCAB_ENTRIES.map((entry, index) => {
  const level = entry.Level || entry.level || "";
  const german = entry.German || entry.german || "";
  const english = entry.English || entry.english || "";
  const audioNormal = entry["Audio (normal)"] || entry.audio_normal || entry.audioNormal || "";
  const audioSlow = entry["Audio (slow)"] || entry.audio_slow || entry.audioSlow || "";

  return {
    id: entry.id || `vocab-${index + 1}-${german || english || level || "entry"}`,
    level,
    german,
    english,
    audio_normal: audioNormal,
    audio_slow: audioSlow,
  };
});

module.exports = {
  VOCAB_ENTRIES,
};
