const DEFAULT_PLAYLISTS = {
  A1: ["PL5vnwpT4NVTdwFarD9kwm1HONsqQ11l-b"],
  A2: [
    "PLs7zUO7VPyJ7YxTq_g2Rcl3Jthd5bpTdY",
    "PLquImyRfMt6dVHL4MxFXMILrFh86H_HAc",
    "PLs7zUO7VPyJ5Eg0NOtF9g-RhqA25v385c",
  ],
  B1: ["PLs7zUO7VPyJ5razSfhOUVbTv9q6SAuPx-", "PLB92CD6B288E5DB61"],
  B2: [
    "PLs7zUO7VPyJ5XMfT7pLvweRx6kHVgP_9C",
    "PLs7zUO7VPyJ6jZP-s6dlkINuEjFPvKMG0",
    "PLs7zUO7VPyJ4SMosRdB-35Q07brhnVToY",
  ],
};

function parsePlaylistConfig() {
  const raw = process.env.REACT_APP_YOUTUBE_PLAYLIST_IDS || process.env.YOUTUBE_PLAYLIST_IDS;
  if (!raw) return DEFAULT_PLAYLISTS;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch (error) {
    console.warn("Failed to parse YOUTUBE_PLAYLIST_IDS", error);
  }

  return DEFAULT_PLAYLISTS;
}

const playlistConfig = parsePlaylistConfig();

export function getPlaylistIdsForLevel(level) {
  if (!level) return [];
  const normalized = String(level).trim().toUpperCase();
  return playlistConfig[normalized] || [];
}

export { playlistConfig as youtubePlaylistConfig };
