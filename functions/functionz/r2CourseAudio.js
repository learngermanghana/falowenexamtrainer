const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const C2_LISTENING_DAYS = new Set([2, 6, 10, 14, 18, 22, 26]);
const DEFAULT_EXPIRES_SECONDS = 60 * 60;
const MIN_EXPIRES_SECONDS = 60;
const MAX_EXPIRES_SECONDS = 60 * 60 * 24 * 7;

const clean = (value) => String(value || "").trim();

const clampExpiry = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_EXPIRES_SECONDS;
  return Math.min(
    MAX_EXPIRES_SECONDS,
    Math.max(MIN_EXPIRES_SECONDS, Math.round(parsed)),
  );
};

const normalizeDay = (value) => {
  const day = Number(value);
  return Number.isInteger(day) && C2_LISTENING_DAYS.has(day) ? day : null;
};

const expectedPrefixForDay = (day) =>
  `c2/day-${String(day).padStart(2, "0")}/`;

const isAudioObjectKey = (key) =>
  /\.(?:mp3|m4a|aac|wav|ogg|webm)$/i.test(key);

const validateC2AudioKey = ({ day, key }) => {
  const normalizedDay = normalizeDay(day);
  const normalizedKey = clean(key).replace(/^\/+/, "");

  if (!normalizedDay || !normalizedKey) return null;
  if (normalizedKey.includes("..") || normalizedKey.includes("\\")) return null;
  if (!normalizedKey.startsWith(expectedPrefixForDay(normalizedDay))) return null;
  if (!isAudioObjectKey(normalizedKey)) return null;

  return { day: normalizedDay, key: normalizedKey };
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

  return { accountId, accessKeyId, secretAccessKey, bucket, expiresIn };
};

const createR2Client = ({ accountId, accessKeyId, secretAccessKey }) =>
  new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

const createC2AudioSignedUrl = async ({ day, key, env = process.env }) => {
  const validated = validateC2AudioKey({ day, key });
  if (!validated) {
    const error = new Error("Invalid C2 audio object key");
    error.code = "INVALID_C2_AUDIO_KEY";
    throw error;
  }

  const config = getR2AudioConfig(env);
  const client = createR2Client(config);
  const url = await getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: config.bucket,
      Key: validated.key,
    }),
    { expiresIn: config.expiresIn },
  );

  return {
    url,
    key: validated.key,
    expiresIn: config.expiresIn,
    expiresAt: new Date(Date.now() + config.expiresIn * 1000).toISOString(),
  };
};

module.exports = {
  C2_LISTENING_DAYS,
  DEFAULT_EXPIRES_SECONDS,
  validateC2AudioKey,
  getR2AudioConfig,
  createC2AudioSignedUrl,
};
