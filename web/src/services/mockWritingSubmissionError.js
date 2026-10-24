// Mock-writing answers are autosaved in the current browser. A marking
// request failure must never be presented as an exam failure or prompt a reset.
export const getMockWritingSubmissionError = (error) => {
  const status = Number(error?.response?.status || 0);
  if ([502, 503, 504].includes(status)) {
    return `Falowen could not finish marking Schreiben (server ${status}). Your draft is still on this page and saved in this browser. Copy your answers as a backup, then try submitting again. Do not restart the mock.`;
  }

  if (!error?.response) {
    return "Could not reach the marking service. Your draft is still on this page and saved in this browser. Copy the answers as a backup and try again without restarting the mock.";
  }

  return String(error?.response?.data?.error || error?.message || "Schreiben marking failed. Please retry without restarting the mock.");
};
