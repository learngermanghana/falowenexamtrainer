export const PUBLIC_MUSIC_ORIGIN = "https://music.falowen.app";

// Curated introductions to the existing public catalogue, not a second song list.
const FEATURED_IDS = [
  "r2-a2-day-12-b64_VHLDpHVtZSDDpG5kZXJuIHNpY2gubXAz",
  "r2-a1-day-04-b64_TWVpbmUgTnVtbWVyLCBtZWluZSBBZHJlc3NlLm1wMw",
  "r2-a2-day-23-b64_RmFocnJhZCB6dXIgU2NodWxlLm1wMw",
  "gemeinsam-schaffen-wir-das",
];

export function selectHomepageSongs(catalogue, artwork = {}, sources = {}) {
  const rows = Array.isArray(catalogue?.tracks) ? catalogue.tracks : [];
  return FEATURED_IDS.flatMap((id) => {
    const track = rows.find((row) => row.id === id && row.approved !== false);
    if (!track?.title || !track.audioUrl) return [];
    try {
      const audio = new URL(track.audioUrl);
      if (audio.protocol !== "https:" || !["www.falowen.app", "music.falowen.app", "admin.falowen.app"].includes(audio.hostname)) return [];
      const artName = artwork.byObjectKey?.[track.objectKey] || artwork.byTrackId?.[id] || artwork.default;
      const artPath = sources[artName]?.path;
      const cover = typeof artPath === "string" && /^\/music\/covers\/[a-z0-9/_.-]+$/i.test(artPath)
        ? PUBLIC_MUSIC_ORIGIN + artPath : "";
      return [{ id, title: track.title, level: track.level, genre: track.genre || "Falowen Music", audioUrl: audio.href, cover,
        songUrl: `${PUBLIC_MUSIC_ORIGIN}/?track=${encodeURIComponent(id)}` }];
    } catch { return []; }
  });
}

export async function loadHomepageSongs(signal) {
  const [catalogue, artwork, sources] = await Promise.all([
    "/music/catalog.json", "/music/covers/artwork-map.json", "/music/covers/photo-sources.json",
  ].map(async (path) => {
    const response = await fetch(PUBLIC_MUSIC_ORIGIN + path, { signal, credentials: "omit" });
    if (!response.ok) throw new Error("Music unavailable");
    return response.json();
  }));
  const tracks = selectHomepageSongs(catalogue, artwork, sources);
  if (!tracks.length) throw new Error("No featured public songs");
  return tracks;
}
