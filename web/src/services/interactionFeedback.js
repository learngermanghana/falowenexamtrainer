const SOUND_FREQUENCIES = {
  success: [880, 1175],
  info: [740, 880],
  open: [660],
  error: [320, 220],
};

const LOCAL_EVENT_KEY = "falowen_local_notification_events_v1";
const MAX_LOCAL_EVENTS = 30;

let sharedAudioContext = null;

const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  const ContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!ContextCtor) return null;
  if (!sharedAudioContext) sharedAudioContext = new ContextCtor();
  return sharedAudioContext;
};

const readLocalEvents = () => {
  try {
    if (typeof window === "undefined") return [];
    const parsed = JSON.parse(window.localStorage.getItem(LOCAL_EVENT_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
};

const writeLocalEvents = (events = []) => {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LOCAL_EVENT_KEY, JSON.stringify(events.slice(0, MAX_LOCAL_EVENTS)));
  } catch (_error) {}
};

const inferEventType = (title = "", body = "") => {
  const text = `${title} ${body}`.toLowerCase();
  if (text.includes("feedback") || text.includes("score") || text.includes("result") || text.includes("marked")) return "Feedback";
  if (text.includes("assignment") || text.includes("submission") || text.includes("resubmission") || text.includes("draft")) return "Assignment";
  if (text.includes("class note") || text.includes("vocabulary")) return "Class Notes";
  if (text.includes("payment") || text.includes("contract") || text.includes("account") || text.includes("login")) return "Account";
  return "Update";
};

const inferEventRoute = (type = "") => {
  if (type === "Feedback") return "/campus/results";
  if (type === "Assignment") return "/campus/submit";
  if (type === "Account") return "/campus/account";
  return "/campus/course";
};

export const getLocalNotificationEvents = () => readLocalEvents();

export const createLocalNotificationEvent = ({ title, body = "", type = "", route = "", tag = "" } = {}) => {
  if (!title || typeof window === "undefined") return null;
  const timestamp = Date.now();
  const resolvedType = type || inferEventType(title, body);
  const event = {
    id: tag || `local-${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
    type: resolvedType,
    title,
    body,
    timestamp,
    source: "interaction",
    route: route || inferEventRoute(resolvedType),
    data: { route: route || inferEventRoute(resolvedType) },
  };
  const existing = readLocalEvents().filter((item) => item.id !== event.id);
  writeLocalEvents([event, ...existing]);
  try {
    window.dispatchEvent(new CustomEvent("falowen:push-notification", { detail: { notification: event } }));
  } catch (_error) {}
  return event;
};

export const playFeedbackSound = async (kind = "info") => {
  const context = getAudioContext();
  if (!context) return false;
  const frequencies = SOUND_FREQUENCIES[kind] || SOUND_FREQUENCIES.info;
  if (context.state === "suspended") {
    try {
      await context.resume();
    } catch (error) {
      return false;
    }
  }
  const startAt = context.currentTime;
  frequencies.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gainNode.gain.setValueAtTime(0.0001, startAt + index * 0.11);
    gainNode.gain.exponentialRampToValueAtTime(0.14, startAt + index * 0.11 + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + index * 0.11 + 0.12);
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start(startAt + index * 0.11);
    oscillator.stop(startAt + index * 0.11 + 0.12);
  });
  return true;
};

export const sendBrowserNotification = async ({ title, body, tag } = {}) => {
  if (typeof window === "undefined" || typeof Notification === "undefined") return false;
  let permission = Notification.permission;
  if (permission === "default") {
    try {
      permission = await Notification.requestPermission();
    } catch (error) {
      return false;
    }
  }
  if (permission !== "granted") return false;
  try {
    new Notification(title || "Falowen update", { body: body || "", tag: tag || "falowen-interaction" });
    return true;
  } catch (error) {
    return false;
  }
};

export const triggerInteractionFeedback = async ({
  sound = "info",
  toastMessage = "",
  toastVariant = "info",
  showToast,
  notificationTitle,
  notificationBody,
  notificationTag,
  notificationRoute,
  notificationType,
  vibratePattern,
} = {}) => {
  if (typeof showToast === "function" && toastMessage) showToast(toastMessage, toastVariant, { playSound: false });
  if (notificationTitle) {
    createLocalNotificationEvent({
      title: notificationTitle,
      body: notificationBody || "",
      type: notificationType || inferEventType(notificationTitle, notificationBody),
      route: notificationRoute,
      tag: notificationTag,
    });
  }
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function" && Array.isArray(vibratePattern)) {
    navigator.vibrate(vibratePattern);
  }
  await Promise.allSettled([
    playFeedbackSound(sound),
    notificationTitle ? sendBrowserNotification({ title: notificationTitle, body: notificationBody, tag: notificationTag }) : Promise.resolve(false),
  ]);
};
