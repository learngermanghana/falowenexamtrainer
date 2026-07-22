import { useCallback, useEffect, useRef } from "react";
import { requestCoachSpeech } from "../services/presentationCoachService";

export const COACH_TTS_LEVELS = new Set(["A2", "B1", "B2", "C1"]);

export const describeCoachSpeechError = (error = {}) => {
  const status = Number(error?.status || 0);
  const code = String(error?.code || "speech_request_failed");

  if (status === 429 || code === "quota_reached") {
    return {
      message: "Daily German audio limit reached. Text chat still works; audio will be available again after the quota resets.",
      code,
      retryable: false,
    };
  }

  if (status === 401 || status === 403) {
    return {
      message: "Your audio session is no longer authorised. Refresh the page and sign in again.",
      code,
      retryable: false,
    };
  }

  if (status === 400 || code === "missing_text" || code === "text_too_long" || code === "invalid_level") {
    return {
      message: error?.message || "This reply cannot be converted to audio. Continue with the written reply.",
      code,
      retryable: false,
    };
  }

  if (code === "invalid_audio_response") {
    return {
      message: "The audio service returned an invalid file. Try the audio again.",
      code,
      retryable: true,
    };
  }

  if (status >= 500 || code === "network_error" || error?.retryable === true) {
    return {
      message: "The German audio service is temporarily unavailable. Try this reply again.",
      code,
      retryable: true,
    };
  }

  return {
    message: error?.message || "The German audio reply could not be prepared.",
    code,
    retryable: error?.retryable !== false,
  };
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

  const stopAudio = useCallback((messageId) => {
    const audio = audioRefs.current[messageId];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    if (playingMessageId === messageId) setPlayingMessageId("");
  }, [audioRefs, playingMessageId, setPlayingMessageId]);

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
      audioLoading: false,
      audioError: true,
      audioErrorMessage: details.message,
      audioErrorCode: details.code,
      audioRetryable: details.retryable,
    }));
  }, [updateCustomCoachMessage]);

  const requestSpeechForMessage = useCallback((messageId, text) => {
    if (!audioRepliesEnabled || !isCoachTtsEligible() || !text) return;
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
        if (error?.name !== "AbortError") markCustomCoachAudioFailed(messageId, error);
      });
  }, [attachCustomCoachAudio, audioRefs, audioRepliesEnabled, autoPlayRepliesEnabled, idToken, isCoachTtsEligible, markCustomCoachAudioFailed, selectedLevel, setPlayingMessageId, updateCustomCoachMessage]);

  const retrySpeechForMessage = useCallback((message) => {
    if (!message?.id || !message?.text || message?.audioRetryable === false) return;
    requestSpeechForMessage(message.id, message.text);
  }, [requestSpeechForMessage]);

  const cleanupCoachSpeech = useCallback((messages = []) => {
    customConversationGenerationRef.current += 1;
    abortPendingSpeechRequests();
    Object.values(audioRefs.current).forEach((audio) => audio?.pause());
    messages.forEach((message) => revokeCoachAudioUrl(message?.audioUrl));
    coachAudioUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    coachAudioUrlsRef.current.clear();
  }, [abortPendingSpeechRequests, audioRefs, revokeCoachAudioUrl]);

  useEffect(() => {
    if (!audioRepliesEnabled) {
      abortPendingSpeechRequests();
      setCustomChatMessages((current) => current.map((message) => {
        if (message.audioUrl) revokeCoachAudioUrl(message.audioUrl);
        return {
          ...message,
          audioUrl: null,
          audioLoading: false,
          audioError: false,
          audioErrorMessage: "",
          audioErrorCode: "",
          audioRetryable: true,
        };
      }));
    }
  }, [abortPendingSpeechRequests, audioRepliesEnabled, revokeCoachAudioUrl, setCustomChatMessages]);

  useEffect(() => () => cleanupCoachSpeech(), []);

  return {
    requestSpeechForMessage,
    retrySpeechForMessage,
    abortPendingSpeechRequests,
    revokeCoachAudioUrl,
    cleanupCoachSpeech,
    isCoachTtsEligible,
  };
};
