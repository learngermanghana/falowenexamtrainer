// Device-specific push token helpers. The legacy messagingToken field is intentionally
// not used to identify this device: it may belong to another browser or phone.
export const getMessagingTokenForDevice = (profile, deviceId) => {
  if (!profile || !deviceId) return null;
  const entries = Array.isArray(profile.messagingTokens) ? profile.messagingTokens : [];
  const match = entries.find(
    (entry) => entry?.deviceId === deviceId && typeof entry?.token === "string" && entry.token.trim()
  );
  return match?.token || null;
};

export const mergeMessagingTokenForDevice = (existingTokens, { deviceId, token, platform, lastSeen }) => {
  if (!deviceId || !token) return Array.isArray(existingTokens) ? existingTokens : [];
  const byDevice = new Map();
  for (const entry of Array.isArray(existingTokens) ? existingTokens : []) {
    if (!entry?.deviceId || !entry?.token) continue;
    // A refreshed token belongs to one device; drop stale copies of it.
    if (entry.deviceId === deviceId || entry.token === token) continue;
    byDevice.set(entry.deviceId, entry);
  }
  byDevice.set(deviceId, { deviceId, token, platform: platform || "web", lastSeen });
  return [...byDevice.values()];
};

export const removeMessagingTokenForDevice = (existingTokens, deviceId, token) =>
  (Array.isArray(existingTokens) ? existingTokens : []).filter(
    (entry) => entry?.deviceId && entry?.token && entry.deviceId !== deviceId && entry.token !== token
  );
