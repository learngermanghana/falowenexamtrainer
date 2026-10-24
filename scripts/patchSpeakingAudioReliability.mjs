import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function write(relativePath, value) {
  fs.writeFileSync(path.join(root, relativePath), value, "utf8");
}

function replaceOnce(source, before, after, label) {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`Speaking audio patch anchor missing: ${label}`);
  return source.replace(before, after);
}

function patchSpeakingPage() {
  const file = "web/src/components/SpeakingPage.js";
  let source = read(file);

  source = replaceOnce(
    source,
    'import { triggerInteractionFeedback } from "../services/interactionFeedback";',
    'import { triggerInteractionFeedback } from "../services/interactionFeedback";\nimport {\n  SPEAKING_AUDIO_MIN_SECONDS as MIN_RECORDING_SECONDS,\n  buildRecordedAudioBlob,\n  createSpeakingMediaRecorder,\n  maxSpeakingRecordingSeconds,\n  playAudioElement,\n  revokeObjectUrl,\n  userFacingAudioError,\n} from "../lib/speakingAudio";',
    "SpeakingPage helper import",
  );
  source = source.replace('const MIN_RECORDING_SECONDS = 3;\n', "");

  source = replaceOnce(
    source,
    '  const [playingMessageId, setPlayingMessageId] = useState("");\n  const [isCompactViewport, setIsCompactViewport] = useState(false);',
    '  const [playingMessageId, setPlayingMessageId] = useState("");\n  const [playbackError, setPlaybackError] = useState("");\n  const [isCompactViewport, setIsCompactViewport] = useState(false);',
    "SpeakingPage playback state",
  );
  source = replaceOnce(
    source,
    '  const audioRefs = useRef({});\n  const messagesEndRef = useRef(null);',
    '  const audioRefs = useRef({});\n  const audioObjectUrlsRef = useRef(new Set());\n  const messagesEndRef = useRef(null);',
    "SpeakingPage object URL ref",
  );
  source = replaceOnce(
    source,
    '  const isCustomSessionEnded = customSessionState === "ended";\n',
    '  const isCustomSessionEnded = customSessionState === "ended";\n  const recordingMaxSeconds = maxSpeakingRecordingSeconds({ level: selectedLevel, context: activeSpeakingTab === "custom" ? "presentation" : "exam" });\n',
    "SpeakingPage recording limit",
  );

  source = replaceOnce(
    source,
    `  useEffect(() => {\n    const audioElements = audioRefs.current;\n\n    return () => {\n      if (recordingIntervalRef.current) window.clearInterval(recordingIntervalRef.current);\n      if (streamRef.current) {\n        streamRef.current.getTracks().forEach((track) => track.stop());\n      }\n      Object.values(audioElements).forEach((audio) => {\n        if (audio) audio.pause();\n      });\n    };\n  }, []);`,
    `  useEffect(() => {\n    const audioElements = audioRefs.current;\n    const objectUrls = audioObjectUrlsRef.current;\n\n    return () => {\n      if (recordingIntervalRef.current) window.clearInterval(recordingIntervalRef.current);\n      if (streamRef.current) {\n        streamRef.current.getTracks().forEach((track) => track.stop());\n      }\n      Object.values(audioElements).forEach((audio) => {\n        if (audio) audio.pause();\n      });\n      objectUrls.forEach((url) => revokeObjectUrl(url));\n      objectUrls.clear();\n    };\n  }, []);`,
    "SpeakingPage cleanup",
  );

  source = replaceOnce(
    source,
    '      const recorder = new MediaRecorder(stream);',
    '      const recorder = createSpeakingMediaRecorder(stream);',
    "SpeakingPage recorder construction",
  );
  source = replaceOnce(
    source,
    '        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });\n        const url = URL.createObjectURL(blob);\n        const duration = elapsedRecordingSeconds;',
    `        let blob;\n        try {\n          blob = buildRecordedAudioBlob(audioChunksRef.current, recorder);\n        } catch (error) {\n          setRecordingError(userFacingAudioError(error));\n          setRecordingSeconds(0);\n          recordingSecondsRef.current = 0;\n          setIsRecording(false);\n          setRecordingMode("");\n          if (streamRef.current) {\n            streamRef.current.getTracks().forEach((track) => track.stop());\n            streamRef.current = null;\n          }\n          return;\n        }\n        const url = URL.createObjectURL(blob);\n        audioObjectUrlsRef.current.add(url);\n        const duration = elapsedRecordingSeconds;`,
    "SpeakingPage real audio blob",
  );
  source = source.replaceAll('              idToken,\n            });', '              idToken,\n              durationSeconds: duration,\n            });');
  source = source.replace(
    '            setCustomChatError(error?.message || "Could not reach the custom Sprechen chat.");\n            appendCustomCoachText("Der freie Sprechen-Chat ist gerade nicht verfügbar. Bitte versuche es gleich noch einmal.");',
    '            const message = userFacingAudioError(error, "Could not reach the custom Sprechen chat.");\n            setCustomChatError(message);\n            appendCustomCoachText(message);',
  );
  source = source.replace(
    '            setChatError(error?.message || "Could not reach the AI coach.");\n            appendCoachText("I couldn\'t analyze your recording right now. Please try again in a moment.");',
    '            const message = userFacingAudioError(error, "Could not reach the AI coach.");\n            setChatError(message);\n            appendCoachText(message);',
  );
  source = replaceOnce(source, '      recorder.start();', '      recorder.start(1000);', "SpeakingPage timeslice");
  source = replaceOnce(
    source,
    `      recordingIntervalRef.current = window.setInterval(() => {\n        setRecordingSeconds((value) => {\n          const nextValue = value + 1;\n          recordingSecondsRef.current = nextValue;\n          return nextValue;\n        });\n      }, 1000);`,
    `      recordingIntervalRef.current = window.setInterval(() => {\n        setRecordingSeconds((value) => {\n          const nextValue = value + 1;\n          recordingSecondsRef.current = nextValue;\n          if (nextValue >= recordingMaxSeconds && recorder.state === "recording") {\n            window.setTimeout(() => recorder.stop(), 0);\n          }\n          return nextValue;\n        });\n      }, 1000);`,
    "SpeakingPage automatic stop",
  );
  source = replaceOnce(
    source,
    `  const toggleAudioPlayback = (messageId) => {\n    const currentAudio = audioRefs.current[messageId];\n    if (!currentAudio) return;\n\n    if (playingMessageId && playingMessageId !== messageId) {\n      const previousAudio = audioRefs.current[playingMessageId];\n      if (previousAudio) {\n        previousAudio.pause();\n        previousAudio.currentTime = 0;\n      }\n    }\n\n    if (playingMessageId === messageId) {\n      currentAudio.pause();\n      setPlayingMessageId("");\n      return;\n    }\n\n    currentAudio.play();\n    setPlayingMessageId(messageId);\n  };`,
    `  const toggleAudioPlayback = async (messageId) => {\n    const currentAudio = audioRefs.current[messageId];\n    if (!currentAudio) return;\n    setPlaybackError("");\n\n    if (playingMessageId && playingMessageId !== messageId) {\n      const previousAudio = audioRefs.current[playingMessageId];\n      if (previousAudio) {\n        previousAudio.pause();\n        previousAudio.currentTime = 0;\n      }\n    }\n\n    if (playingMessageId === messageId) {\n      currentAudio.pause();\n      setPlayingMessageId("");\n      return;\n    }\n\n    try {\n      await playAudioElement(currentAudio);\n      setPlayingMessageId(messageId);\n    } catch (error) {\n      setPlayingMessageId("");\n      setPlaybackError(error?.message || "Playback could not start.");\n    }\n  };`,
    "SpeakingPage playback promise",
  );
  source = replaceOnce(
    source,
    '  const clearConversation = () => {',
    `  const releaseMessageAudio = (messages = []) => {\n    messages.forEach((message) => {\n      if (!message?.audioUrl) return;\n      revokeObjectUrl(message.audioUrl);\n      audioObjectUrlsRef.current.delete(message.audioUrl);\n    });\n  };\n\n  const clearConversation = () => {\n    setPlaybackError("");`,
    "SpeakingPage clear audio helper",
  );
  source = source.replace('    if (activeSpeakingTab === "custom") {\n      setCustomChatMessages([', '    if (activeSpeakingTab === "custom") {\n      releaseMessageAudio(customChatMessages);\n      setCustomChatMessages([');
  source = source.replace('    setChatMessages([', '    releaseMessageAudio(chatMessages);\n    setChatMessages([');
  source = source.replaceAll('node.onended = () => setPlayingMessageId("");', 'node.onended = () => setPlayingMessageId("");\n                                  node.onerror = () => { setPlayingMessageId(""); setPlaybackError("This device cannot play the recording format. Please record again."); };');
  source = source.replaceAll('recordingError && recordingMode === "custom"', 'recordingError');
  source = source.replaceAll('recordingError && recordingMode === "exam"', 'recordingError');
  source = source.replace(
    '              Listening tip: use a headset, reduce background noise, and speak for at least {MIN_RECORDING_SECONDS} seconds.',
    '              Listening tip: use a headset, reduce background noise, and speak for at least {MIN_RECORDING_SECONDS} seconds. Maximum {formatTime(recordingMaxSeconds)}; recording stops automatically.',
  );
  source = source.replace(
    '                {customChatError ? <p style={{ margin: 0, color: "#B91C1C", fontSize: 12 }}>{customChatError}</p> : null}',
    '                {customChatError ? <p style={{ margin: 0, color: "#B91C1C", fontSize: 12 }}>{customChatError}</p> : null}\n                {playbackError ? <p style={{ margin: 0, color: "#B91C1C", fontSize: 12 }}>{playbackError}</p> : null}',
  );
  source = source.replace(
    '            {recordingError ? <p style={{ ...styles.helperText, margin: 0, color: "#B91C1C" }}>{recordingError}</p> : null}',
    '            {recordingError ? <p style={{ ...styles.helperText, margin: 0, color: "#B91C1C" }}>{recordingError}</p> : null}\n            {playbackError ? <p style={{ ...styles.helperText, margin: 0, color: "#B91C1C" }}>{playbackError}</p> : null}',
  );

  write(file, source);
}

function patchInlineSpeechTrainer() {
  const file = "web/src/components/speechTrainer/InlineSpeechTrainer.js";
  let source = read(file);
  source = replaceOnce(
    source,
    'import { sendSpeechTrainerAttempt } from "../../services/speechTrainerService";',
    'import { sendSpeechTrainerAttempt } from "../../services/speechTrainerService";\nimport { buildRecordedAudioBlob, createSpeakingMediaRecorder, maxSpeakingRecordingSeconds, revokeObjectUrl, userFacingAudioError } from "../../lib/speakingAudio";',
    "InlineSpeechTrainer helper import",
  );
  source = replaceOnce(
    source,
    '  const mediaRecorderRef = useRef(null);\n  const timerRef = useRef(null);',
    '  const mediaRecorderRef = useRef(null);\n  const timerRef = useRef(null);\n  const recordingTimeRef = useRef(0);\n  const maxRecordingSeconds = maxSpeakingRecordingSeconds({ level: profileLevel, context: "presentation" });',
    "InlineSpeechTrainer limit",
  );
  source = source.replace('        URL.revokeObjectURL(audioUrl);', '        revokeObjectUrl(audioUrl);');
  source = replaceOnce(source, '      const recorder = new MediaRecorder(stream);', '      const recorder = createSpeakingMediaRecorder(stream);', "InlineSpeechTrainer recorder");
  source = replaceOnce(
    source,
    '        const blob = new Blob(chunks, { type: "audio/webm" });\n        setAudioBlob(blob);',
    '        let blob;\n        try {\n          blob = buildRecordedAudioBlob(chunks, recorder);\n        } catch (error) {\n          setError(userFacingAudioError(error));\n          stream.getTracks().forEach((track) => track.stop());\n          return;\n        }\n        setAudioBlob(blob);',
    "InlineSpeechTrainer real blob",
  );
  source = source.replace('          URL.revokeObjectURL(audioUrl);', '          revokeObjectUrl(audioUrl);');
  source = replaceOnce(source, '      recorder.start();', '      recorder.start(1000);', "InlineSpeechTrainer timeslice");
  source = source.replace('      setRecordingTime(0);\n      timerRef.current = setInterval(() => {\n        setRecordingTime((prev) => prev + 1);\n      }, 1000);', '      setRecordingTime(0);\n      recordingTimeRef.current = 0;\n      timerRef.current = setInterval(() => {\n        setRecordingTime((prev) => {\n          const next = prev + 1;\n          recordingTimeRef.current = next;\n          if (next >= maxRecordingSeconds && recorder.state === "recording") window.setTimeout(() => recorder.stop(), 0);\n          return next;\n        });\n      }, 1000);');
  source = source.replace('      setError("Microphone not available. Please allow access and try again.");', '      setError(userFacingAudioError(recordError, "Microphone not available. Please allow access and try again."));');
  source = source.replace('        "Could not reach the coach right now. Please try again in a moment.";', '        userFacingAudioError(submitError, "Could not reach the coach right now. Please try again in a moment.");');
  source = source.replace('Max 2 minutes is plenty.', 'Maximum ${formatTime(maxRecordingSeconds)}; recording stops automatically.');
  write(file, source);
}

function patchCoachService() {
  const file = "web/src/services/coachService.js";
  let source = read(file);
  source = replaceOnce(
    source,
    'import { getBackendUrl, getSpeakingApiUrl } from "./backendUrl";',
    'import { getBackendUrl, getSpeakingApiUrl } from "./backendUrl";\nimport { extensionForAudioMimeType, filenameForAudioBlob } from "../lib/speakingAudio";',
    "coachService helper import",
  );
  source = replaceOnce(
    source,
    'const buildSpeakingAudioPath = () => {\n  const random = Math.random().toString(36).slice(2, 10);\n  // Keep speaking uploads under the same Storage prefix covered by our\n  // authenticated Firebase Storage rules.\n  return `speech-trainer/speaking/${Date.now()}-${random}.webm`;\n};',
    'const buildSpeakingAudioPath = (audioBlob) => {\n  const random = Math.random().toString(36).slice(2, 10);\n  const extension = extensionForAudioMimeType(audioBlob?.type);\n  return `speech-trainer/speaking/${Date.now()}-${random}.${extension}`;\n};',
    "coachService storage extension",
  );
  source = source.replace('  const storageRef = ref(storage, buildSpeakingAudioPath());', '  const storageRef = ref(storage, buildSpeakingAudioPath(audioBlob));');
  source = source.replace('  idToken,\n}) => {', '  idToken,\n  durationSeconds,\n}) => {');
  source = source.replace('      audioUrl,\n    };', '      audioUrl,\n      audioMimeType: audioBlob?.type || "",\n      audioSizeBytes: Number(audioBlob?.size || 0),\n      durationSeconds: Number(durationSeconds || 0),\n    };');
  source = source.replace('    const filename = audioBlob?.name || "recording.webm";', '    const filename = audioBlob?.name || filenameForAudioBlob(audioBlob);');
  source = source.replace('    formData.append("userId", userId || "guest");', '    formData.append("userId", userId || "guest");\n    if (durationSeconds) formData.append("durationSeconds", String(durationSeconds));');
  source = replaceOnce(
    source,
    '  try {\n    return await submitViaFirebaseUrl();\n  } catch (error) {\n    console.warn("Falling back to direct audio upload for speaking analyze", error);\n    return submitAsMultipartFallback();\n  }',
    '  try {\n    const audioUrl = await uploadSpeakingAudio(audioBlob);\n    const payload = { teil, level, contextType, question, interactionMode, userId: userId || "guest", audioUrl, audioMimeType: audioBlob?.type || "", audioSizeBytes: Number(audioBlob?.size || 0), durationSeconds: Number(durationSeconds || 0) };\n    const response = await axios.post(`${speakingApiUrl}/speaking/analyze`, payload, { headers: { "Content-Type": "application/json", ...authHeaders(idToken) }, timeout: 120000 });\n    return response.data;\n  } catch (error) {\n    if (error?.response) throw error;\n    console.warn("Firebase audio upload failed; using direct speaking upload", error);\n    return submitAsMultipartFallback();\n  }',
    "coachService safe fallback",
  );
  write(file, source);
}

function patchSpeechTrainerService() {
  const file = "web/src/services/speechTrainerService.js";
  let source = read(file);
  source = replaceOnce(
    source,
    'import { getBackendUrl } from "./backendUrl";',
    'import { getBackendUrl } from "./backendUrl";\nimport { extensionForAudioMimeType, filenameForAudioBlob } from "../lib/speakingAudio";',
    "speechTrainerService helper import",
  );
  source = replaceOnce(
    source,
    'const buildFirebaseAudioPath = () => {\n  const random = Math.random().toString(36).slice(2, 10);\n  return `speech-trainer/${Date.now()}-${random}.webm`;\n};',
    'const buildFirebaseAudioPath = (audioBlob) => {\n  const random = Math.random().toString(36).slice(2, 10);\n  return `speech-trainer/${Date.now()}-${random}.${extensionForAudioMimeType(audioBlob?.type)}`;\n};',
    "speechTrainerService storage extension",
  );
  source = source.replace('  const storageRef = ref(storage, buildFirebaseAudioPath());', '  const storageRef = ref(storage, buildFirebaseAudioPath(audioBlob));');
  source = source.replace('    formData.append("audio", audioBlob, "speech-trainer.webm");', '    formData.append("audio", audioBlob, filenameForAudioBlob(audioBlob, "speech-trainer"));');
  source = replaceOnce(
    source,
    '  try {\n    return await submitViaFirebaseUrl({ audioBlob, note, level, idToken });\n  } catch (error) {\n    console.warn("Falling back to direct audio upload for speech trainer", error);\n    return submitAsMultipartFallback({ audioBlob, note, level, idToken });\n  }',
    '  try {\n    const audioUrl = await uploadSpeechTrainerAudio(audioBlob);\n    const response = await axios.post(`${backendUrl}/speech-trainer/feedback`, { audioUrl, note: note || "", level: level || "", audioMimeType: audioBlob?.type || "", audioSizeBytes: Number(audioBlob?.size || 0) }, { headers: { "Content-Type": "application/json", ...authHeaders(idToken) }, timeout: 120000 });\n    return response.data;\n  } catch (error) {\n    if (error?.response) throw error;\n    console.warn("Firebase audio upload failed; using direct speech trainer upload", error);\n    return submitAsMultipartFallback({ audioBlob, note, level, idToken });\n  }',
    "speechTrainerService safe fallback",
  );
  write(file, source);
}

function patchBackend() {
  const file = "functions/functionz/app.js";
  let source = read(file);
  source = replaceOnce(
    source,
    'const { createChatCompletion, getOpenAIClient } = require("./openaiClient");',
    'const { createChatCompletion, getOpenAIClient } = require("./openaiClient");\nconst { audioHttpError, extensionForRemoteAudio, transcribeAudioFile } = require("./speakingAudioReliability");',
    "backend reliability import",
  );
  source = replaceOnce(
    source,
    `const writeTempFile = async (file) => {\n  const fileName = file?.originalname || "audio.webm";\n  const tempPath = path.join(os.tmpdir(), \`${'${Date.now()}-${fileName}'}\`);\n  await fsPromises.writeFile(tempPath, file.buffer);\n  return tempPath;\n};\n\nconst transcribeAudio = async (fileBuffer) => {\n  const client = getOpenAIClient();\n  const tempPath = await writeTempFile(fileBuffer);\n\n  try {\n    const transcription = await client.audio.transcriptions.create({\n      file: fs.createReadStream(tempPath),\n      model: "whisper-1",\n      language: "de",\n    });\n\n    return transcription?.text?.trim();\n  } finally {\n    await fsPromises.unlink(tempPath).catch(() => undefined);\n  }\n};`,
    `const transcribeAudio = async (file) => {\n  const result = await transcribeAudioFile({ file, getOpenAIClient });\n  return result.text;\n};`,
    "backend transcription helper",
  );
  source = source.replace('    originalname: "speech-trainer-remote.webm",', '    originalname: `speech-trainer-remote.${extensionForRemoteAudio(contentType)}`,');
  source = source.replaceAll('.slice(0, 1800)', '.slice(0, 8000)');
  source = source.replaceAll('.slice(0, 1500)', '.slice(0, 8000)');
  source = source.replaceAll('.slice(0, 1200)', '.slice(0, 8000)');

  const speakingQuotaBefore = `    const quota = await enforceUserQuota({ uid: authedUser.uid, category: "speaking", limit: DAILY_LIMITS.speaking });\n    if (!quota.allowed) {\n      log.warn("quota.blocked", { route: "/speaking/analyze", uid: authedUser.uid, category: "speaking" });\n      return res.status(429).json({ error: "Daily speaking analysis limit reached" });\n    }\n\n    let audioFile = req.file;`;
  const speakingQuotaAfter = `    let audioFile = req.file;`;
  source = replaceOnce(source, speakingQuotaBefore, speakingQuotaAfter, "speaking quota relocation remove");
  source = replaceOnce(
    source,
    '    const transcript = ((await transcribeAudio(audioFile)) || "").slice(0, 8000);\n    if (!transcript) return res.status(500).json({ error: "Could not transcribe audio" });\n\n    const messages = [',
    '    const transcript = ((await transcribeAudio(audioFile)) || "").slice(0, 8000);\n\n    const quota = await enforceUserQuota({ uid: authedUser.uid, category: "speaking", limit: DAILY_LIMITS.speaking });\n    if (!quota.allowed) return res.status(429).json({ error: "Daily speaking analysis limit reached", code: "SPEAKING_QUOTA_REACHED" });\n\n    const messages = [',
    "speaking quota after transcription",
  );

  const trainerQuotaBefore = `    const quota = await enforceUserQuota({\n      uid: authedUser.uid,\n      category: "speechTrainer",\n      limit: DAILY_LIMITS.speechTrainer,\n    });\n\n    if (!quota.allowed) {\n      log.warn("quota.blocked", { route: "/speech-trainer/feedback", uid: authedUser.uid, category: "speechTrainer" });\n      return res.status(429).json({ error: "Daily speech trainer limit reached" });\n    }\n\n    let audioFile = req.file;`;
  source = replaceOnce(source, trainerQuotaBefore, '    let audioFile = req.file;', "speech trainer quota relocation remove");
  source = replaceOnce(
    source,
    '    const transcript = ((await transcribeAudio(audioFile)) || "").slice(0, 8000);\n\n    const messages = [',
    '    const transcript = ((await transcribeAudio(audioFile)) || "").slice(0, 8000);\n\n    const quota = await enforceUserQuota({ uid: authedUser.uid, category: "speechTrainer", limit: DAILY_LIMITS.speechTrainer });\n    if (!quota.allowed) return res.status(429).json({ error: "Daily speech trainer limit reached", code: "SPEAKING_QUOTA_REACHED" });\n\n    const messages = [',
    "speech trainer quota after transcription",
  );

  source = source.replace(
    '  } catch (err) {\n    console.error("/speaking/analyze error", err);\n    auditAIRequest({ route: "/speaking/analyze", uid: authedUser?.uid, email: authedUser?.email, success: false });\n    return res.status(500).json({ error: err.message || "Failed to analyze speaking" });\n  }',
    '  } catch (err) {\n    console.error("/speaking/analyze error", err);\n    auditAIRequest({ route: "/speaking/analyze", uid: authedUser?.uid, email: authedUser?.email, success: false });\n    if (/^(AUDIO_|NO_SPEECH_DETECTED|TRANSCRIPTION_)/.test(String(err?.code || ""))) { const mapped = audioHttpError(err); return res.status(mapped.status).json(mapped.body); }\n    return res.status(500).json({ error: err.message || "Failed to analyze speaking", code: "SPEAKING_ANALYSIS_FAILED" });\n  }',
  );
  source = source.replace(
    '  } catch (err) {\n    console.error("/speech-trainer/feedback error", err);\n    auditAIRequest({ route: "/speech-trainer/feedback", uid: authedUser?.uid, email: authedUser?.email, success: false });\n    return res.status(500).json({ error: err.message || "Failed to run speech trainer" });\n  }',
    '  } catch (err) {\n    console.error("/speech-trainer/feedback error", err);\n    auditAIRequest({ route: "/speech-trainer/feedback", uid: authedUser?.uid, email: authedUser?.email, success: false });\n    if (/^(AUDIO_|NO_SPEECH_DETECTED|TRANSCRIPTION_)/.test(String(err?.code || ""))) { const mapped = audioHttpError(err); return res.status(mapped.status).json(mapped.body); }\n    return res.status(500).json({ error: err.message || "Failed to run speech trainer", code: "SPEECH_TRAINER_FAILED" });\n  }',
  );
  write(file, source);
}

patchSpeakingPage();
patchInlineSpeechTrainer();
patchCoachService();
patchSpeechTrainerService();
patchBackend();
console.log("Applied speaking audio reliability patches.");
