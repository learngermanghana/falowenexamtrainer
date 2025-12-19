const OpenAI = require("openai");

let client;

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

  const response = await clientInstance.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.4,
    max_tokens: 750,
    messages,
    ...options,
  });

  const reply = response?.choices?.[0]?.message?.content;
  if (!reply) {
    throw new Error("OpenAI response missing content");
  }

  return reply;
};

module.exports = {
  createChatCompletion,
  getOpenAIClient,
};
