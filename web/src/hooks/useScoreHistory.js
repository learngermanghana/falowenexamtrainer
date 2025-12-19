import { useEffect, useState } from "react";
import { getBackendBaseUrl } from "../services/backendConfig";

function normalizeScoreRow(r) {
  return {
    id: r.id || `${r.studentCode || r.studentcode}-${r.date || ""}-${r.assignment || ""}`,
    mode: "Score",
    assignment: r.assignment,
    score: r.score,
    comments: r.comments,
    date: r.date,
    level: r.level,
    link: r.link,
    name: r.name,
  };
}

export function useScoreHistory({ studentCode, email }) {
  const [results, setResults] = useState([]);
  const [loadingScores, setLoadingScores] = useState(false);
  const [scoresError, setScoresError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoadingScores(true);
      setScoresError("");

      try {
        const qs = studentCode
          ? `studentCode=${encodeURIComponent(studentCode)}`
          : email
          ? `email=${encodeURIComponent(email)}`
          : "";

        if (!qs) {
          setResults([]);
          return;
        }

        const backendUrl = getBackendBaseUrl();
        const res = await fetch(`${backendUrl}/api/scores?${qs}`, {
          headers: { Accept: "application/json" },
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || data.ok === false) {
          throw new Error(data.error || `Failed to load scores (${res.status})`);
        }

        const rows = data.rows || data.results || [];
        const normalized = rows.map(normalizeScoreRow);

        if (mounted) setResults(normalized);
      } catch (e) {
        console.error(e);
        if (mounted) {
          setScoresError(e.message || "Could not load scores");
          setResults([]);
        }
      } finally {
        if (mounted) setLoadingScores(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [studentCode, email]);

  return { results, loadingScores, scoresError };
}
