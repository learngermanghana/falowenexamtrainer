const OpenAI = require("openai");
const { createLogger } = require("./logger");
const { incrementCounter } = require("./metrics");

let client;
const log = createLogger({ scope: "openai" });

const getOpenAIClient = () => {
  if (client) return client;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  client = new OpenAI({ apiKey });
  return client;
};

const createChatCompletion = async (messages, options = {}) => {
  const clientInstance = getOpenAIClient();
  const model = options.model || process.env.OPENAI_MODEL || "gpt-4o-mini";
  const startedAt = Date.now();

  incrementCounter("openai_requests", model);

  try {
    const response = await clientInstance.chat.completions.create({
      model,
      temperature: 0.4,
      max_tokens: 750,
      messages,
      ...options,
    });

    const reply = response?.choices?.[0]?.message?.content;
    if (!reply) {
      throw new Error("OpenAI response missing content");
    }

    incrementCounter("openai_success", model);
    log.info("openai.completion.success", {
      model,
      durationMs: Date.now() - startedAt,
      usage: response?.usage || null,
    });

    return reply;
  } catch (err) {
    incrementCounter("openai_errors", err?.code || err?.status || "unknown");
    log.error("openai.completion.error", {
      model,
      durationMs: Date.now() - startedAt,
      errorMessage: err?.message || "unknown",
      errorCode: err?.code || err?.status || "unknown",
    });
    throw err;
  }
};

module.exports = {
  createChatCompletion,
  getOpenAIClient,
};
