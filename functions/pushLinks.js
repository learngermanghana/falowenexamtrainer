const PUSH_ORIGIN = "https://www.falowen.app";

const absolutePushLink = (route = "/campus/account") => {
  const url = new URL(route, PUSH_ORIGIN);
  if (url.origin !== PUSH_ORIGIN) return `${PUSH_ORIGIN}/campus/account`;
  return url.href;
};

module.exports = { absolutePushLink };
