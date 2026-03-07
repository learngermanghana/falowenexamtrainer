import axios from "axios";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "../firebase";
import { getBackendUrl } from "./backendUrl";

const backendUrl = getBackendUrl();

const authHeaders = (idToken) =>
  idToken
    ? {
        Authorization: `Bearer ${idToken}`,
      }
    : {};

const buildFirebaseAudioPath = () => {
  const random = Math.random().toString(36).slice(2, 10);
  return `speech-trainer/${Date.now()}-${random}.webm`;
};

const uploadSpeechTrainerAudio = async (audioBlob) => {
  if (!app) {
    throw new Error("Firebase is not configured for storage uploads.");
  }

  const storage = getStorage(app);
  const storageRef = ref(storage, buildFirebaseAudioPath());

  await uploadBytes(storageRef, audioBlob, {
    contentType: audioBlob?.type || "audio/webm",
    cacheControl: "private, max-age=0, no-cache",
  });

  return {
    audioUrl: await getDownloadURL(storageRef),
    audioPath: storageRef.fullPath,
  };
};

const submitViaFirebaseUrl = async ({ audioBlob, note, level, idToken }) => {
  const uploadResult = audioBlob ? await uploadSpeechTrainerAudio(audioBlob) : { audioUrl: "", audioPath: "" };
  const payload = {
    audioUrl: uploadResult.audioUrl,
    audioPath: uploadResult.audioPath,
    note: note || "",
    level: level || "",
  };

  const response = await axios.post(`${backendUrl}/speech-trainer/feedback`, payload, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(idToken),
    },
  });

  return response.data;
};

const submitAsMultipartFallback = async ({ audioBlob, note, level, idToken }) => {
  const formData = new FormData();

  if (audioBlob) {
    formData.append("audio", audioBlob, "speech-trainer.webm");
  }

  if (note) {
    formData.append("note", note);
  }

  if (level) {
    formData.append("level", level);
  }

  const response = await axios.post(`${backendUrl}/speech-trainer/feedback`, formData, {
    headers: {
      ...authHeaders(idToken),
    },
  });

  return response.data;
};

export const sendSpeechTrainerAttempt = async ({ audioBlob, note, level, idToken }) => {
  if (!audioBlob) {
    return submitAsMultipartFallback({ audioBlob, note, level, idToken });
  }

  try {
    return await submitViaFirebaseUrl({ audioBlob, note, level, idToken });
  } catch (error) {
    console.warn("Falling back to direct audio upload for speech trainer", error);
    return submitAsMultipartFallback({ audioBlob, note, level, idToken });
  }
};
