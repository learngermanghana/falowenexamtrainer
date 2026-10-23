// Compatibility entry point kept for the existing GitHub Actions workflow.
// The renderer now implements printable section capture and strict hydration
// directly. Do not rewrite its source at runtime (the old patch was brittle).
import "./renderA1Bundle.mjs";
