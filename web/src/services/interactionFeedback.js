const SOUND_FREQUENCIES = {
  success: [880, 1175],
  info: [740, 880],
  open: [660],
  error: [320, 220],
};

let sharedAudioContext = null;

const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  const ContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!ContextCtor) return null;

  if (!sharedAudioContext) {
    sharedAudioContext = new ContextCtor();
  }

  return sharedAudioContext;
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
    new Notification(title || "Falowen update", {
      body: body || "",
      tag: tag || "falowen-interaction",
    });
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
  vibratePattern,
} = {}) => {
  if (typeof showToast === "function" && toastMessage) {
    showToast(toastMessage, toastVariant, { playSound: false });
  }

  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function" && Array.isArray(vibratePattern)) {
    navigator.vibrate(vibratePattern);
  }

  await Promise.allSettled([
    playFeedbackSound(sound),
    notificationTitle
      ? sendBrowserNotification({ title: notificationTitle, body: notificationBody, tag: notificationTag })
      : Promise.resolve(false),
  ]);
};
