import { useCallback, useEffect, useRef } from "react";
import { requestCoachSpeech } from "../services/presentationCoachService";

export const COACH_TTS_LEVELS = new Set(["A2", "B1", "B2", "C1"]);

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
      return { ...message, audioUrl, audioLoading: false, audioError: false };
    });
  }, [revokeCoachAudioUrl, updateCustomCoachMessage]);

  const markCustomCoachAudioFailed = useCallback((messageId) => {
    updateCustomCoachMessage(messageId, (message) => ({ ...message, audioLoading: false, audioError: true }));
  }, [updateCustomCoachMessage]);

  const requestSpeechForMessage = useCallback((messageId, text) => {
    if (!audioRepliesEnabled || !isCoachTtsEligible() || !text) return;
    const generation = customConversationGenerationRef.current;
    const controller = new AbortController();
    speechControllersRef.current[messageId]?.abort();
    speechControllersRef.current[messageId] = controller;
    updateCustomCoachMessage(messageId, (message) => ({ ...message, audioLoading: true, audioError: false }));

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
        if (error?.name !== "AbortError") markCustomCoachAudioFailed(messageId);
      });
  }, [attachCustomCoachAudio, audioRefs, audioRepliesEnabled, autoPlayRepliesEnabled, idToken, isCoachTtsEligible, markCustomCoachAudioFailed, selectedLevel, setPlayingMessageId, updateCustomCoachMessage]);

  const retrySpeechForMessage = useCallback((message) => {
    if (!message?.id || !message?.text) return;
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
        return { ...message, audioUrl: null, audioLoading: false, audioError: false };
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
