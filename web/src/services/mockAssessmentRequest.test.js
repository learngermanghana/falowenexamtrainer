import axios from "axios";
import { postMockAssessment } from "./mockAssessmentRequest";
jest.mock("axios", () => ({ post: jest.fn() }));
beforeEach(() => jest.resetAllMocks());

test("retries a 502 with unchanged answers and attempt ID", async () => {
  const payload = { text: "Meine Antwort", attemptId: "attempt-1" };
  axios.post.mockRejectedValueOnce({ response: { status: 502 } }).mockResolvedValueOnce({ data: { result: { score: 20 } } });
  await expect(postMockAssessment("/api/writing/a1-mock-score", payload)).resolves.toMatchObject({ data: { result: { score: 20 } } });
  expect(axios.post.mock.calls[0]).toEqual(axios.post.mock.calls[1]);
  expect(axios.post.mock.calls[0][2].timeout).toBe(55000);
});

test.each([401, 403, 409, 429])("does not repeat rejected or quota-limited requests (%i)", async (status) => {
  axios.post.mockRejectedValue({ response: { status, data: { error: "Rejected" } } });
  await expect(postMockAssessment("/mark", {})).rejects.toMatchObject({ message: "Rejected" });
  expect(axios.post).toHaveBeenCalledTimes(1);
});

test("does not multiply retries already exhausted by the backend", async () => {
  axios.post.mockRejectedValue({ response: { status: 503, data: { code: "MOCK_MARKING_UNAVAILABLE", error: "Please retry marking" } } });
  await expect(postMockAssessment("/mark", {})).rejects.toMatchObject({ message: "Please retry marking" });
  expect(axios.post).toHaveBeenCalledTimes(1);
});

test("reports a persistent gateway failure with recovery instructions", async () => {
  axios.post.mockRejectedValue({ response: { status: 502 }, message: "Request failed with status code 502" });
  await expect(postMockAssessment("/mark", {})).rejects.toMatchObject({ message: expect.stringContaining("retry marking") });
  expect(axios.post).toHaveBeenCalledTimes(2);
});

test('sends the bundled question version without changing the caller answers', async () => {
  const versions = require('../data/assessmentTaskVersions.json');
  const payload = { text: 'Meine Antwort', attemptId: 'same-attempt' };
  axios.post.mockResolvedValue({ data: {} });
  await postMockAssessment('/api/writing/b1-mock-score', payload);
  expect(axios.post.mock.calls[0][1]).toEqual({ ...payload, taskVersion: versions.B1.writing });
  expect(payload.taskVersion).toBeUndefined();
});
