const crypto = require("crypto");

const COURSE_LISTENING_DAYS = Object.freeze({
  A1: new Set([13, "14.1"]),
  A2: new Set([6, 7, 8, 9, 10, 24, 26, 27, 28]),
  B1: new Set([15, 16]),
  B2: new Set([2, 6, 10, 14, 18, 22, 26]),
  C2: new Set([2, 6, 10, 14, 18, 22, 26]),
});
const A1_LISTENING_DAYS = COURSE_LISTENING_DAYS.A1;
const A2_LISTENING_DAYS = COURSE_LISTENING_DAYS.A2;
const B1_LISTENING_DAYS = COURSE_LISTENING_DAYS.B1;
const C2_LISTENING_DAYS = COURSE_LISTENING_DAYS.C2;
const B2_LISTENING_DAYS = COURSE_LISTENING_DAYS.B2;
const DEFAULT_EXPIRES_SECONDS = 60 * 60;
const MIN_EXPIRES_SECONDS = 60;
const MAX_EXPIRES_SECONDS = 60 * 60 * 24 * 7;
const DEFAULT_COURSE_MEDIA_STAFF_EMAILS = Object.freeze(["staff@falowen.app"]);
const COURSE_MEDIA_STAFF_ROLES = new Set(["admin", "teacher", "tutor", "staff", "instructor"]);
const COURSE_LEVEL_ORDER = Object.freeze(["A1", "A2", "B1", "B2", "C1", "C2"]);

const clean = (value) => String(value || "").trim();
const normalizeLevel = (value) => String(value || "").trim().toUpperCase();
const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const getCourseMediaStaffEmails = (env = process.env) => {
  const configured = String(env.COURSE_MEDIA_STAFF_EMAILS || "")
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);
  return new Set(configured.length ? configured : DEFAULT_COURSE_MEDIA_STAFF_EMAILS);
};

const hasCourseMediaStaffAccess = ({ authedUser = {}, student = {}, env = process.env } = {}) => {
  if (authedUser?.admin === true) return true;

  const hasStaffRole = [authedUser?.role, student?.role]
    .map((value) => String(value || "").trim().toLowerCase())
    .some((role) => COURSE_MEDIA_STAFF_ROLES.has(role));
  if (hasStaffRole) return true;

  const email = normalizeEmail(authedUser?.email || student?.email);
  return Boolean(email && getCourseMediaStaffEmails(env).has(email));
};

const getCourseLevelIndex = (value) => {
  const match = String(value || "").toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/);
  return match ? COURSE_LEVEL_ORDER.indexOf(match[1]) : -1;
};

const hasCourseMediaLevelAccess = ({ student = {}, requiredLevel = "" } = {}) => {
  const requiredIndex = getCourseLevelIndex(requiredLevel);
  if (requiredIndex < 0) return false;

  return [
    student?.level,
    student?.currentLevel,
    student?.courseLevel,
    student?.className,
  ].some((value) => getCourseLevelIndex(value) >= requiredIndex);
};

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
  const allowedDays = COURSE_LISTENING_DAYS[normalizedLevel];
  const raw = clean(value);

  if (normalizedLevel === "A1" && raw === "14.1" && allowedDays?.has("14.1")) {
    return "14.1";
  }

  const day = Number(raw);
  return Number.isInteger(day) && allowedDays?.has(day) ? day : null;
};

const expectedPrefixForDay = (level, day) => {
  const dayToken = String(day).replace(".", "-").padStart(2, "0");
  return `${normalizeLevel(level).toLowerCase()}/day-${dayToken}/`;
};

const isAudioObjectKey = (key) =>
  /\.(?:mp3|m4a|aac|wav|ogg|webm)$/i.test(key);

const validateCourseAudioKey = ({ level, day, key }) => {
  const normalizedLevel = normalizeLevel(level);
  const normalizedDay = normalizeDay(normalizedLevel, day);
  const normalizedKey = clean(key).replace(/^\/+/, "");

  if (!COURSE_LISTENING_DAYS[normalizedLevel]) return null;
  if (!normalizedDay || !normalizedKey) return null;
  if (normalizedKey.includes("..") || normalizedKey.includes("\\")) return null;
  if (normalizedLevel === "B1") {
    const expectedStem = `audio/day_${normalizedDay}.`;
    if (!normalizedKey.startsWith(expectedStem)) return null;
  } else if (!normalizedKey.startsWith(expectedPrefixForDay(normalizedLevel, normalizedDay))) {
    return null;
  }
  if (!isAudioObjectKey(normalizedKey)) return null;

  return { level: normalizedLevel, day: normalizedDay, key: normalizedKey };
};

const validateA1AudioKey = ({ day, key }) => {
  const validated = validateCourseAudioKey({ level: "A1", day, key });
  return validated ? { day: validated.day, key: validated.key } : null;
};

const validateA1MockAudioKey = ({ mockId, part, key }) => {
  const normalizedMockId = clean(mockId).toLowerCase();
  const normalizedPart = clean(part).toLowerCase();
  const normalizedKey = clean(key).replace(/^\/+/, "");

  if (!/^mock-\d{2}$/.test(normalizedMockId)) return null;
  if (!/^teil-[123]$/.test(normalizedPart)) return null;
  if (!normalizedKey || normalizedKey.includes("..") || normalizedKey.includes("\\")) return null;

  const expectedPrefix = `a1/mock-hoeren/${normalizedMockId}/`;
  const expectedKey = `${expectedPrefix}${normalizedPart}`;
  if (!normalizedKey.startsWith(expectedKey)) return null;
  if (!isAudioObjectKey(normalizedKey)) return null;

  return {
    level: "A1",
    mockId: normalizedMockId,
    part: normalizedPart,
    key: normalizedKey,
  };
};

const validateA2MockAudioKey = ({ mockId, part, key }) => {
  const normalizedMockId = clean(mockId).toLowerCase();
  const normalizedPart = clean(part).toLowerCase();
  const normalizedKey = clean(key).replace(/^\/+/, "");

  if (!/^mock-\d{2}$/.test(normalizedMockId)) return null;
  if (!/^teil-[1234]$/.test(normalizedPart)) return null;
  if (!normalizedKey || normalizedKey.includes("..") || normalizedKey.includes("\\")) return null;

  const expectedPrefix = `a2/mock-hoeren/${normalizedMockId}/`;
  const expectedKey = `${expectedPrefix}${normalizedPart}`;
  if (!normalizedKey.startsWith(expectedKey)) return null;
  if (!isAudioObjectKey(normalizedKey)) return null;

  return {
    level: "A2",
    mockId: normalizedMockId,
    part: normalizedPart,
    key: normalizedKey,
  };
};

const validateA2AudioKey = ({ day, key }) => {
  const validated = validateCourseAudioKey({ level: "A2", day, key });
  return validated ? { day: validated.day, key: validated.key } : null;
};

const validateB1AudioKey = ({ day, key }) => {
  const validated = validateCourseAudioKey({ level: "B1", day, key });
  return validated ? { day: validated.day, key: validated.key } : null;
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

const createA1AudioSignedUrl = ({ day, key, env = process.env, now = new Date() }) =>
  createCourseAudioSignedUrl({ level: "A1", day, key, env, now });

const createA1MockAudioSignedUrl = async ({
  mockId,
  part,
  key,
  env = process.env,
  now = new Date(),
}) => {
  const validated = validateA1MockAudioKey({ mockId, part, key });
  if (!validated) {
    const error = new Error("Invalid A1 mock audio object key");
    error.code = "INVALID_A1_MOCK_AUDIO_KEY";
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
    mockId: validated.mockId,
    part: validated.part,
    key: validated.key,
    expiresIn: config.expiresIn,
    expiresAt: new Date(requestDate.getTime() + config.expiresIn * 1000).toISOString(),
  };
};

const createA2AudioSignedUrl = ({ day, key, env = process.env, now = new Date() }) =>
  createCourseAudioSignedUrl({ level: "A2", day, key, env, now });

const createA2MockAudioSignedUrl = async ({
  mockId,
  part,
  key,
  env = process.env,
  now = new Date(),
}) => {
  const validated = validateA2MockAudioKey({ mockId, part, key });
  if (!validated) {
    const error = new Error("Invalid A2 mock audio object key");
    error.code = "INVALID_A2_MOCK_AUDIO_KEY";
    throw error;
  }

  const config = getR2AudioConfig(env);
  const requestDate = now instanceof Date ? now : new Date(now);
  if (Number.isNaN(requestDate.getTime())) throw new Error("Invalid signing date");

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
    mockId: validated.mockId,
    part: validated.part,
    key: validated.key,
    expiresIn: config.expiresIn,
    expiresAt: new Date(requestDate.getTime() + config.expiresIn * 1000).toISOString(),
  };
};

const createB1AudioSignedUrl = ({ day, key, env = process.env, now = new Date() }) =>
  createCourseAudioSignedUrl({ level: "B1", day, key, env, now });

const createC2AudioSignedUrl = ({ day, key, env = process.env, now = new Date() }) =>
  createCourseAudioSignedUrl({ level: "C2", day, key, env, now });

const createB2AudioSignedUrl = ({ day, key, env = process.env, now = new Date() }) =>
  createCourseAudioSignedUrl({ level: "B2", day, key, env, now });

module.exports = {
  COURSE_LISTENING_DAYS,
  A1_LISTENING_DAYS,
  A2_LISTENING_DAYS,
  B1_LISTENING_DAYS,
  C2_LISTENING_DAYS,
  B2_LISTENING_DAYS,
  DEFAULT_EXPIRES_SECONDS,
  DEFAULT_COURSE_MEDIA_STAFF_EMAILS,
  getCourseMediaStaffEmails,
  hasCourseMediaStaffAccess,
  hasCourseMediaLevelAccess,
  validateCourseAudioKey,
  validateA1AudioKey,
  validateA1MockAudioKey,
  validateA2MockAudioKey,
  validateA2AudioKey,
  validateB1AudioKey,
  validateC2AudioKey,
  validateB2AudioKey,
  getR2AudioConfig,
  createCourseAudioSignedUrl,
  createA1AudioSignedUrl,
  createA1MockAudioSignedUrl,
  createA2AudioSignedUrl,
  createA2MockAudioSignedUrl,
  createB1AudioSignedUrl,
  createC2AudioSignedUrl,
  createB2AudioSignedUrl,
};
