import axios from "axios";
import { uploadBytes } from "firebase/storage";
import { analyzeAudio } from "./coachService";
jest.mock("axios", () => ({ post: jest.fn() }));
jest.mock("firebase/auth", () => ({ getAuth: () => ({ currentUser: { uid: "student" } }) }));
jest.mock("firebase/storage", () => ({ getStorage: jest.fn(), ref: jest.fn(), uploadBytes: jest.fn(), getDownloadURL: async () => "https://example.com/audio.webm" }));
jest.mock("../firebase", () => ({ app: {} }));
jest.mock("./backendUrl", () => ({ getBackendUrl: () => "https://api.example.com", getSpeakingApiUrl: () => "https://api.example.com" }));
jest.mock("./mockAssessmentRequest", () => ({ postMockAssessment: jest.fn() }));
beforeEach(() => { jest.clearAllMocks(); });
const args = { audioBlob: new Blob(["voice"]), teil: "1", level: "A1", transcriptionOnly: true };
test("multipart retry preserves a URL uploaded before URL analysis failed", async () => {
  uploadBytes.mockResolvedValue({});
  axios.post.mockRejectedValueOnce(new Error("URL analysis unavailable")).mockResolvedValueOnce({ data: { transcript: "Meine Familie." } });
  const result = await analyzeAudio(args);
  expect(result.audioUrl).toBe("https://example.com/audio.webm");
  expect(axios.post.mock.calls[1][1].get("transcriptionOnly")).toBe("true");
});
test("failed storage never invents a playable URL for a multipart transcript", async () => {
  uploadBytes.mockRejectedValue(new Error("Storage unavailable"));
  axios.post.mockResolvedValue({ data: { transcript: "Meine Familie." } });
  expect((await analyzeAudio(args)).audioUrl).toBe("");
});


test("A2 Mock 2 transcribes directly in memory without Firebase Storage or a per-clip AI evaluation", async () => {
  axios.post.mockResolvedValue({ data: { transcript: "Wir treffen uns am Samstag." } });
  const result = await analyzeAudio({ ...args, level: "A2", persistAudio: false, transcriptionOnly: true });
  expect(result.transcript).toBe("Wir treffen uns am Samstag.");
  expect(result.audioUrl).toBe("");
  expect(uploadBytes).not.toHaveBeenCalled();
  expect(axios.post).toHaveBeenCalledTimes(1);
  expect(axios.post.mock.calls[0][1]).toBeInstanceOf(FormData);
  expect(axios.post.mock.calls[0][1].get("transcriptionOnly")).toBe("true");
});

test("an ephemeral audio transcription failure never falls back to Firebase upload", async () => {
  axios.post.mockRejectedValue(new Error("Transcription unavailable"));
  await expect(analyzeAudio({ ...args, level: "A2", persistAudio: false, transcriptionOnly: true })).rejects.toThrow("Transcription unavailable");
  expect(uploadBytes).not.toHaveBeenCalled();
  expect(axios.post).toHaveBeenCalledTimes(1);
});
