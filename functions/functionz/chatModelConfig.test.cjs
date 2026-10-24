const { test } = require("node:test");
const assert = require("node:assert/strict");
const { DEFAULT_CHAT_MODEL, resolveChatModel, buildChatRequest } = require("./chatModelConfig");

test("all Falowen text/chat requests are pinned to GPT-6 Luna despite previous overrides", () => {
  assert.equal(DEFAULT_CHAT_MODEL, "gpt-6-luna");
  for (const requested of [
    undefined, "", " ", "gpt-4o", "gpt-4o-mini",
    "gpt-4.1", "gpt-4.1-mini-2025-04-14",
    "gpt-5.1", "gpt-5.5", "custom-model", "gpt-6-luna",
  ]) assert.equal(resolveChatModel(requested), DEFAULT_CHAT_MODEL);
});

test("text AI JSON contracts, sampling and token budgets survive the pin without reasoning spend", () => {
  const options = { model: "gpt-4o-mini", messages: [{ role: "user", content: "Hallo" }],
    temperature: 0.1, max_tokens: 2200, response_format: { type: "json_object" } };
  const request = buildChatRequest(options);
  assert.equal(request.model, "gpt-6-luna");
  assert.equal(request.reasoning_effort, "none");
  assert.equal(request.max_completion_tokens, 2200);
  assert.equal(request.max_tokens, undefined);
  assert.equal(request.temperature, 0.1);
  assert.deepEqual(request.messages, options.messages);
  assert.deepEqual(request.response_format, options.response_format);
  assert.equal(options.max_tokens, 2200);
});

test("even explicit per-call chat model overrides cannot leave GPT-6 Luna", () => {
  const options = { model: "custom-model", max_tokens: 160, temperature: 0.5 };
  assert.deepEqual(buildChatRequest(options), {
    model: "gpt-6-luna", max_completion_tokens: 160,
    temperature: 0.5, reasoning_effort: "none",
  });
  assert.equal(options.model, "custom-model");
  assert.equal(options.max_tokens, 160);
});
