const crypto = require("crypto");

const COURSE_LISTENING_DAYS = Object.freeze({
  B2: new Set([2, 6, 10, 14, 18, 22, 26]),
  C2: new Set([2, 6, 10, 14, 18, 22, 26]),
});
const C2_LISTENING_DAYS = COURSE_LISTENING_DAYS.C2;
const B2_LISTENING_DAYS = COURSE_LISTENING_DAYS.B2;
const DEFAULT_EXPIRES_SECONDS = 60 * 60;
const MIN_EXPIRES_SECONDS = 60;
const MAX_EXPIRES_SECONDS = 60 * 60 * 24 * 7;

const clean = (value) => String(value || "").trim();
const normalizeLevel = (value) => String(value || "").trim().toUpperCase();

const clampExpiry = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_EXPIRES_SECONDS;
  return Math.min(
    MAX_EXPIRES_SECONDS,
    Math.max(MIN_EXPIRES_SECONDS, Math.round(parsed)),
  );
};

const normalizeDay = (level, value) => {
  const normalizedLevel = normalizeLevel(level);
  const day = Number(value);
  const allowedDays = COURSE_LISTENING_DAYS[normalizedLevel];
  return Number.isInteger(day) && allowedDays?.has(day) ? day : null;
};

const expectedPrefixForDay = (level, day) =>
  `${normalizeLevel(level).toLowerCase()}/day-${String(day).padStart(2, "0")}/`;

const isAudioObjectKey = (key) =>
  /\.(?:mp3|m4a|aac|wav|ogg|webm)$/i.test(key);

const validateCourseAudioKey = ({ level, day, key }) => {
  const normalizedLevel = normalizeLevel(level);
  const normalizedDay = normalizeDay(normalizedLevel, day);
  const normalizedKey = clean(key).replace(/^\/+/, "");

  if (!COURSE_LISTENING_DAYS[normalizedLevel]) return null;
  if (!normalizedDay || !normalizedKey) return null;
  if (normalizedKey.includes("..") || normalizedKey.includes("\\")) return null;
  if (!normalizedKey.startsWith(expectedPrefixForDay(normalizedLevel, normalizedDay))) return null;
  if (!isAudioObjectKey(normalizedKey)) return null;

  return { level: normalizedLevel, day: normalizedDay, key: normalizedKey };
};

const validateC2AudioKey = ({ day, key }) => {
  const validated = validateCourseAudioKey({ level: "C2", day, key });
  return validated ? { day: validated.day, key: validated.key } : null;
};

const validateB2AudioKey = ({ day, key }) => {
  const validated = validateCourseAudioKey({ level: "B2", day, key });
  return validated ? { day: validated.day, key: validated.key } : null;
};

const getR2AudioConfig = (env = process.env) => {
  const accountId = clean(env.R2_ACCOUNT_ID);
  const accessKeyId = clean(env.R2_ACCESS_KEY_ID);
  const secretAccessKey = clean(env.R2_SECRET_ACCESS_KEY);
  const bucket = clean(env.R2_AUDIO_BUCKET);
  const expiresIn = clampExpiry(env.R2_AUDIO_URL_EXPIRES_SECONDS);

  const missing = [
    ["R2_ACCOUNT_ID", accountId],
    ["R2_ACCESS_KEY_ID", accessKeyId],
    ["R2_SECRET_ACCESS_KEY", secretAccessKey],
    ["R2_AUDIO_BUCKET", bucket],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length) {
    const error = new Error(`Missing R2 audio configuration: ${missing.join(", ")}`);
    error.code = "R2_AUDIO_NOT_CONFIGURED";
    error.missing = missing;
    throw error;
  }

  if (!/^[a-z0-9][a-z0-9.-]*[a-z0-9]$|^[a-z0-9]$/i.test(bucket)) {
    const error = new Error("Invalid R2 bucket name");
    error.code = "R2_AUDIO_NOT_CONFIGURED";
    error.missing = ["R2_AUDIO_BUCKET"];
    throw error;
  }

  return { accountId, accessKeyId, secretAccessKey, bucket, expiresIn };
};

const awsEncode = (value) =>
  encodeURIComponent(String(value)).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );

const encodePath = (value) =>
  String(value)
    .split("/")
    .map((segment) => awsEncode(segment))
    .join("/");

const sha256Hex = (value) =>
  crypto.createHash("sha256").update(value, "utf8").digest("hex");

const hmac = (key, value, encoding) =>
  crypto.createHmac("sha256", key).update(value, "utf8").digest(encoding);

const formatAmzDate = (date) =>
  date.toISOString().replace(/[:-]|\.\d{3}/g, "");

const buildCanonicalQuery = (entries) =>
  entries
    .map(([key, value]) => [awsEncode(key), awsEncode(value)])
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

const createCourseAudioSignedUrl = async ({
  level,
  day,
  key,
  env = process.env,
  now = new Date(),
}) => {
  const validated = validateCourseAudioKey({ level, day, key });
  if (!validated) {
    const error = new Error("Invalid course audio object key");
    error.code = "INVALID_COURSE_AUDIO_KEY";
    throw error;
  }

  const config = getR2AudioConfig(env);
  const requestDate = now instanceof Date ? now : new Date(now);
  if (Number.isNaN(requestDate.getTime())) {
    throw new Error("Invalid signing date");
  }

  const amzDate = formatAmzDate(requestDate);
  const dateStamp = amzDate.slice(0, 8);
  const region = "auto";
  const service = "s3";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const host = `${config.bucket}.${config.accountId}.r2.cloudflarestorage.com`;
  const canonicalUri = `/${encodePath(validated.key)}`;

  const queryEntries = [
    ["X-Amz-Algorithm", "AWS4-HMAC-SHA256"],
    ["X-Amz-Content-Sha256", "UNSIGNED-PAYLOAD"],
    ["X-Amz-Credential", `${config.accessKeyId}/${credentialScope}`],
    ["X-Amz-Date", amzDate],
    ["X-Amz-Expires", String(config.expiresIn)],
    ["X-Amz-SignedHeaders", "host"],
  ];
  const canonicalQuery = buildCanonicalQuery(queryEntries);
  const canonicalHeaders = `host:${host}\n`;
  const canonicalRequest = [
    "GET",
    canonicalUri,
    canonicalQuery,
    canonicalHeaders,
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const dateKey = hmac(`AWS4${config.secretAccessKey}`, dateStamp);
  const regionKey = hmac(dateKey, region);
  const serviceKey = hmac(regionKey, service);
  const signingKey = hmac(serviceKey, "aws4_request");
  const signature = hmac(signingKey, stringToSign, "hex");

  return {
    url: `https://${host}${canonicalUri}?${canonicalQuery}&X-Amz-Signature=${signature}`,
    level: validated.level,
    key: validated.key,
    expiresIn: config.expiresIn,
    expiresAt: new Date(requestDate.getTime() + config.expiresIn * 1000).toISOString(),
  };
};

const createC2AudioSignedUrl = ({ day, key, env = process.env, now = new Date() }) =>
  createCourseAudioSignedUrl({ level: "C2", day, key, env, now });

const createB2AudioSignedUrl = ({ day, key, env = process.env, now = new Date() }) =>
  createCourseAudioSignedUrl({ level: "B2", day, key, env, now });

module.exports = {
  COURSE_LISTENING_DAYS,
  C2_LISTENING_DAYS,
  B2_LISTENING_DAYS,
  DEFAULT_EXPIRES_SECONDS,
  validateCourseAudioKey,
  validateC2AudioKey,
  validateB2AudioKey,
  getR2AudioConfig,
  createCourseAudioSignedUrl,
  createC2AudioSignedUrl,
  createB2AudioSignedUrl,
};
