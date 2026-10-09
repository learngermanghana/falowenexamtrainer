// The optional "Kurz lernen · dann anwenden" card has been removed from
// the A2 and B1 workbook experience. Keep this compatibility component so
// existing grammar and workbook callers can render normally without it.
export default function A2MiniLearningBlock() {
  return null;
}
