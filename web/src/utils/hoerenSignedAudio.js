// Private R2 URLs expire while learners read questions. Refresh shortly before use.
export function signedAudioExpiresAt(uri) {
  try {
    const url = new URL(uri);
    const stamp = url.searchParams.get("X-Amz-Date");
    const ttl = Number(url.searchParams.get("X-Amz-Expires"));
    if (!stamp || !/^\d{8}T\d{6}Z$/.test(stamp) || !Number.isInteger(ttl) || ttl <= 0) return null;
    const issued = Date.UTC(
      Number(stamp.slice(0, 4)), Number(stamp.slice(4, 6)) - 1, Number(stamp.slice(6, 8)),
      Number(stamp.slice(9, 11)), Number(stamp.slice(11, 13)), Number(stamp.slice(13, 15)),
    );
    return Number.isFinite(issued) ? issued + ttl * 1000 : null;
  } catch { return null; }
}
export function needsFreshSignedAudio(uri, now = Date.now(), leewayMs = 60_000) {
  const expires = signedAudioExpiresAt(uri);
  return expires != null && expires - now <= leewayMs;
}
