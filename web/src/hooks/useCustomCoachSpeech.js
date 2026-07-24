import { useCallback, useEffect, useRef } from "react";
import { requestCoachSpeech } from "../services/presentationCoachService";

export const COACH_TTS_LEVELS = new Set(["A2", "B1", "B2", "C1"]);

export const describeCoachSpeechError = (error = {}) => {
  const status = Number(error?.status || 0);
  const code = String(error?.code || "speech_request_failed");

  if (status === 429 || code === "quota_reached") {
    return {
      message: "Daily German audio limit reached. Using your device's German voice for this reply.",
      code,
      retryable: false,
    };
  }

  if (status === 404 || code === "speech_route_unavailable") {
    return {
      message: "The studio German audio route is unavailable. Using your device's German voice for coach replies.",
      code,
      retryable: false,
    };
  }

  if (status === 401 || status === 403) {
    return {
      message: "The server audio session is no longer authorised. Using your device's German voice; refresh and sign in again for the studio voice.",
      code,
      retryable: false,
    };
  }

  if (status === 400 || code === "missing_text" || code === "text_too_long" || code === "invalid_level") {
    return {
      message: error?.message || "This reply cannot be converted by the server voice.",
      code,
      retryable: false,
    };
  }

  if (code === "invalid_audio_response") {
    return {
      message: "The server returned an invalid audio file. Using your device's German voice instead.",
      code,
      retryable: true,
    };
  }

  if (status >= 500 || code === "network_error" || error?.retryable === true) {
    return {
      message: "The studio German voice is temporarily unavailable. Using your device's German voice instead.",
      code,
      retryable: true,
    };
  }

  return {
    message: error?.message || "The studio German audio reply could not be prepared.",
    code,
    retryable: error?.retryable !== false,
  };
};

const supportsBrowserSpeech = () =>
  typeof window !== "undefined" &&
  Boolean(window.speechSynthesis) &&
  typeof window.SpeechSynthesisUtterance === "function";

const browserSpeechRateForLevel = (level = "") => {
  const normalized = String(level || "").toUpperCase();
  if (normalized === "A2") return 0.88;
  if (normalized === "B1") return 0.94;
  if (normalized === "C1") return 1.03;
  return 1;
};

export const useCustomCoachSpeech = ({
  selectedLevel,
  activeSpeakingTab,
  idToken,
  audioRepliesEnabled,
  autoPlayRepliesEnabled,
  audioRefs,
  playingMessageId,
  setPlayingMessageId,
  setCustomChatMessages,
}) => {
  const coachAudioUrlsRef = useRef(new Set());
  const speechControllersRef = useRef({});
  const customConversationGenerationRef = useRef(0);
  const browserSpeechMessageIdRef = useRef("");
  const serverSpeechUnavailableRef = useRef(false);

  const stopBrowserSpeech = useCallback(() => {
    if (supportsBrowserSpeech()) window.speechSynthesis.cancel();
    browserSpeechMessageIdRef.current = "";
    setPlayingMessageId("");
  }, [setPlayingMessageId]);

  const playBrowserSpeechForMessage = useCallback((messageId, text) => {
    if (!supportsBrowserSpeech() || !messageId || !String(text || "").trim()) return false;

    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(String(text).trim());
    utterance.lang = "de-DE";
    utterance.rate = browserSpeechRateForLevel(selectedLevel);
    const germanVoice = window.speechSynthesis
      .getVoices()
      .find((voice) => String(voice?.lang || "").toLowerCase().startsWith("de"));
    if (germanVoice) utterance.voice = germanVoice;

    browserSpeechMessageIdRef.current = messageId;
    utterance.onstart = () => setPlayingMessageId(messageId);
    utterance.onend = () => {
      if (browserSpeechMessageIdRef.current === messageId) {
        browserSpeechMessageIdRef.current = "";
        setPlayingMessageId("");
      }
    };
    utterance.onerror = () => {
      if (browserSpeechMessageIdRef.current === messageId) {
        browserSpeechMessageIdRef.current = "";
        setPlayingMessageId("");
      }
    };
    window.speechSynthesis.speak(utterance);
    return true;
  }, [selectedLevel, setPlayingMessageId]);

  const stopAudio = useCallback((messageId) => {
    const audio = audioRefs.current[messageId];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    if (browserSpeechMessageIdRef.current === messageId) stopBrowserSpeech();
    if (playingMessageId === messageId) setPlayingMessageId("");
  }, [audioRefs, playingMessageId, setPlayingMessageId, stopBrowserSpeech]);

  const revokeCoachAudioUrl = useCallback((url) => {
    if (!url || !coachAudioUrlsRef.current.has(url)) return;
    Object.entries(audioRefs.current).forEach(([messageId, audio]) => {
      if (audio?.src === url) stopAudio(messageId);
    });
    URL.revokeObjectURL(url);
    coachAudioUrlsRef.current.delete(url);
  }, [audioRefs, stopAudio]);

  const abortPendingSpeechRequests = useCallback(() => {
    Object.values(speechControllersRef.current).forEach((controller) => controller.abort());
    speechControllersRef.current = {};
  }, []);

  const isCoachTtsEligible = useCallback(
    () => activeSpeakingTab === "custom" && COACH_TTS_LEVELS.has(String(selectedLevel || "").toUpperCase()),
    [activeSpeakingTab, selectedLevel],
  );

  const updateCustomCoachMessage = useCallback((messageId, updater) => {
    setCustomChatMessages((current) => current.map((message) => (message.id === messageId ? updater(message) : message)));
  }, [setCustomChatMessages]);

  const attachCustomCoachAudio = useCallback((messageId, audioUrl) => {
    coachAudioUrlsRef.current.add(audioUrl);
    updateCustomCoachMessage(messageId, (message) => {
      if (message.audioUrl && message.audioUrl !== audioUrl) revokeCoachAudioUrl(message.audioUrl);
      return {
        ...message,
        audioUrl,
        browserSpeech: false,
        audioLoading: false,
        audioError: false,
        audioErrorMessage: "",
        audioErrorCode: "",
        audioRetryable: true,
      };
    });
  }, [revokeCoachAudioUrl, updateCustomCoachMessage]);

  const markCustomCoachAudioFailed = useCallback((messageId, error) => {
    const details = describeCoachSpeechError(error);
    console.warn("Goethe coach audio request failed", {
      messageId,
      status: Number(error?.status || 0),
      code: details.code,
      retryable: details.retryable,
    });
    updateCustomCoachMessage(messageId, (message) => ({
      ...message,
      browserSpeech: false,
      audioLoading: false,
      audioError: true,
      audioErrorMessage: details.message,
      audioErrorCode: details.code,
      audioRetryable: details.retryable,
    }));
  }, [updateCustomCoachMessage]);

  const useBrowserSpeechFallback = useCallback((messageId, text, error) => {
    if (!supportsBrowserSpeech()) return false;
    const details = describeCoachSpeechError(error);
    updateCustomCoachMessage(messageId, (message) => ({
      ...message,
      audioUrl: null,
      browserSpeech: true,
      audioLoading: false,
      audioError: false,
      audioErrorMessage: details.message,
      audioErrorCode: details.code,
      audioRetryable: details.retryable,
    }));
    if (autoPlayRepliesEnabled) {
      window.setTimeout(() => playBrowserSpeechForMessage(messageId, text), 0);
    }
    return true;
  }, [autoPlayRepliesEnabled, playBrowserSpeechForMessage, updateCustomCoachMessage]);

  const requestSpeechForMessage = useCallback((messageId, text) => {
    if (!audioRepliesEnabled || !isCoachTtsEligible() || !text) return;
    if (serverSpeechUnavailableRef.current) {
      if (!useBrowserSpeechFallback(messageId, text, { status: 404, code: "speech_route_unavailable", retryable: false })) {
        markCustomCoachAudioFailed(messageId, {
          status: 404,
          code: "speech_route_unavailable",
          message: "The studio German audio route is unavailable. Please use the visible coach reply text.",
          retryable: false,
        });
      }
      return;
    }
    const generation = customConversationGenerationRef.current;
    const controller = new AbortController();
    speechControllersRef.current[messageId]?.abort();
    speechControllersRef.current[messageId] = controller;
    updateCustomCoachMessage(messageId, (message) => ({
      ...message,
      audioLoading: true,
      audioError: false,
      audioErrorMessage: "",
      audioErrorCode: "",
      audioRetryable: true,
    }));

    requestCoachSpeech({ text, level: selectedLevel, idToken, signal: controller.signal })
      .then((audioUrl) => {
        delete speechControllersRef.current[messageId];
        if (generation !== customConversationGenerationRef.current) {
          URL.revokeObjectURL(audioUrl);
          return;
        }
        attachCustomCoachAudio(messageId, audioUrl);
        if (autoPlayRepliesEnabled) {
          window.setTimeout(() => {
            const audio = audioRefs.current[messageId];
            if (!audio) return;
            Object.entries(audioRefs.current).forEach(([id, other]) => {
              if (id !== messageId && other) {
                other.pause();
                other.currentTime = 0;
              }
            });
            audio.play().then(() => setPlayingMessageId(messageId)).catch(() => {});
          }, 0);
        }
      })
      .catch((error) => {
        delete speechControllersRef.current[messageId];
        if (error?.name === "AbortError") return;
        if (Number(error?.status || 0) === 404) serverSpeechUnavailableRef.current = true;
        if (!useBrowserSpeechFallback(messageId, text, error)) {
          markCustomCoachAudioFailed(messageId, error);
        }
      });
  }, [attachCustomCoachAudio, audioRefs, audioRepliesEnabled, autoPlayRepliesEnabled, idToken, isCoachTtsEligible, markCustomCoachAudioFailed, selectedLevel, setPlayingMessageId, updateCustomCoachMessage, useBrowserSpeechFallback]);

  const retrySpeechForMessage = useCallback((message) => {
    if (!message?.id || !message?.text) return;
    if (message.browserSpeech) {
      playBrowserSpeechForMessage(message.id, message.text);
      return;
    }
    if (message?.audioRetryable === false) return;
    requestSpeechForMessage(message.id, message.text);
  }, [playBrowserSpeechForMessage, requestSpeechForMessage]);

  const cleanupCoachSpeech = useCallback((messages = []) => {
    customConversationGenerationRef.current += 1;
    abortPendingSpeechRequests();
    stopBrowserSpeech();
    Object.values(audioRefs.current).forEach((audio) => audio?.pause());
    messages.forEach((message) => revokeCoachAudioUrl(message?.audioUrl));
    coachAudioUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    coachAudioUrlsRef.current.clear();
  }, [abortPendingSpeechRequests, audioRefs, revokeCoachAudioUrl, stopBrowserSpeech]);

  useEffect(() => {
    if (!audioRepliesEnabled) {
      abortPendingSpeechRequests();
      stopBrowserSpeech();
      setCustomChatMessages((current) => current.map((message) => {
        if (message.audioUrl) revokeCoachAudioUrl(message.audioUrl);
        return {
          ...message,
          audioUrl: null,
          browserSpeech: false,
          audioLoading: false,
          audioError: false,
          audioErrorMessage: "",
          audioErrorCode: "",
          audioRetryable: true,
        };
      }));
    }
  }, [abortPendingSpeechRequests, audioRepliesEnabled, revokeCoachAudioUrl, setCustomChatMessages, stopBrowserSpeech]);

  useEffect(() => () => cleanupCoachSpeech(), []);

  return {
    requestSpeechForMessage,
    retrySpeechForMessage,
    playBrowserSpeechForMessage,
    stopBrowserSpeech,
    abortPendingSpeechRequests,
    revokeCoachAudioUrl,
    cleanupCoachSpeech,
    isCoachTtsEligible,
  };
};
