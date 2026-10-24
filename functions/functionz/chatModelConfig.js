// Single model for Falowen text/chat AI: examiner, tutor, feedback and marking.
// Audio transcription and speech synthesis have their own dedicated API models;
// never pass audio model IDs through this chat-only resolver.
const DEFAULT_CHAT_MODEL = "gpt-6-luna";

// An old OPENAI_MODEL, LIVE_SPEAK_CHAT_MODEL, or per-call model override must
// not silently downgrade any Falowen text AI feature away from the chosen
// examiner model. The unused input is retained for backwards compatibility.
function resolveChatModel(_requestedModel) {
  return DEFAULT_CHAT_MODEL;
}
function buildChatRequest(options) {
  const request = { ...options, model: resolveChatModel(options.model) };
  request.reasoning_effort = "none";
  if (request.max_tokens != null) {
    request.max_completion_tokens = request.max_completion_tokens ?? request.max_tokens;
    delete request.max_tokens;
  }
  return request;
}
module.exports = { DEFAULT_CHAT_MODEL, resolveChatModel, buildChatRequest };
