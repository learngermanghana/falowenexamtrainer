jest.mock("../openaiClient", () => ({ createChatCompletion: jest.fn() }));
const { createChatCompletion } = require("../openaiClient");
const { createMockAssessment } = require("../mockAssessment");
const messages = [{ role: "user", content: "Return JSON" }];
beforeEach(() => jest.resetAllMocks());

test("requests JSON with a bounded timeout and disables nested SDK retries", async () => {
  createChatCompletion.mockResolvedValue('{"score":15}');
  await expect(createMockAssessment(messages)).resolves.toBe('{"score":15}');
  expect(createChatCompletion).toHaveBeenCalledWith(messages,
    expect.objectContaining({ response_format: { type: "json_object" }, max_tokens: 2200 }),
    { timeout: 20000, maxRetries: 0 });
});

test.each([
  new Error("unused"),
  Object.assign(new Error("unavailable"), { status: 503 }),
  Object.assign(new Error("timeout"), { name: "APIConnectionTimeoutError" }),
])("recovers from malformed JSON or a transient upstream failure", async (failure) => {
  if (failure.message === "unused") createChatCompletion.mockResolvedValueOnce('{"score":');
  else createChatCompletion.mockRejectedValueOnce(failure);
  createChatCompletion.mockResolvedValueOnce('{"score":20}');
  await expect(createMockAssessment(messages)).resolves.toBe('{"score":20}');
  expect(createChatCompletion).toHaveBeenCalledTimes(2);
});

test("incomplete part scores are retried instead of converted to zero", async () => {
  createChatCompletion.mockResolvedValueOnce('{"score":20}').mockResolvedValueOnce('{"score":20,"parts":{"teil1":{"score":10}}}');
  const result = await createMockAssessment(messages, {}, { partKeys: ["teil1"] });
  expect(JSON.parse(result).parts.teil1.score).toBe(10);
});

test("missing required task flags never yield a grade", async () => {
  createChatCompletion.mockResolvedValue('{"score":20,"parts":{"teil1":{"score":10}}}');
  await expect(createMockAssessment(messages, {}, { partKeys: ["teil1"], pointCounts: { teil1: 3 } }))
    .rejects.toMatchObject({ code: "MOCK_MARKING_UNAVAILABLE", status: 503 });
  expect(createChatCompletion).toHaveBeenCalledTimes(2);
});

test("permanent authentication failures are not retried", async () => {
  createChatCompletion.mockRejectedValue(Object.assign(new Error("invalid key"), { status: 401 }));
  await expect(createMockAssessment(messages)).rejects.toMatchObject({ status: 401 });
  expect(createChatCompletion).toHaveBeenCalledTimes(1);
});
