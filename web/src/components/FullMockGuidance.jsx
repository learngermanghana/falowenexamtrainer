import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FULL_MOCK_SKILLS,
  getFullMockPracticeRoutes,
  getFullMockProgress,
  getFullMockWeakestSkills,
} from "../utils/fullMockProgress";
import "./FullMockGuidance.css";

export function FullMockGuide({ level, stage, completedSkills = [], complete = false, detail = "" }) {
  const progress = getFullMockProgress({ stage, completedSkills, complete });
  return (
    <section className="full-mock-guide" aria-label={`${level} full mock exam progress`}>
      <div className="full-mock-guide-title">
        <strong>{progress.complete ? "All 4 modules completed" : `${progress.count} of 4 modules completed`}</strong>
        <span>Final result only after Lesen, Hören, Schreiben and Sprechen</span>
      </div>
      <ol className="full-mock-guide-steps">
        {FULL_MOCK_SKILLS.map((skill, index) => {
          const finished = completedSkills.includes(skill.key);
          const active = !complete && progress.current === skill.key;
          return (
            <li key={skill.key} className={finished ? "complete" : active ? "active" : "pending"} aria-current={active ? "step" : undefined}>
              <span className="full-mock-guide-marker">{finished ? "✓" : index + 1}</span>
              <span className="full-mock-guide-label"><strong>{skill.label}</strong><small>{finished ? "Completed" : active ? "Current module" : "Still to do"}</small></span>
            </li>
          );
        })}
      </ol>
      {detail ? <p className="full-mock-guide-detail">{detail}</p> : null}
      {!complete && stage !== "intro" ? <p className="full-mock-guide-detail">
        {progress.current === "sprechen"
          ? "Finish Sprechen to complete all four modules and receive your final result."
          : "Keep going after this section. Finishing one module does not complete the full mock."}
      </p> : null}
    </section>
  );
}

export function FullMockRecovery({ level, sectionScores = {}, onRetake, retakeDisabled = false, retakeNote = "" }) {
  const navigate = useNavigate();
  const skills = getFullMockWeakestSkills(sectionScores);
  const routes = getFullMockPracticeRoutes(level);
  return (
    <section className="full-mock-recovery">
      <h2>Choose your next step</h2>
      <p>Practise your weaker skills before another attempt, or retake all four modules for a new full-mock score.</p>
      <div className="full-mock-recovery-actions">
        {skills.map((skill) => (
          <button key={skill.key} type="button" onClick={() => navigate(routes[skill.key])}>
            Practise {skill.label} · {skill.score}/25
          </button>
        ))}
      </div>
      {onRetake ? <button type="button" className="full-mock-recovery-retake" disabled={retakeDisabled} onClick={onRetake}>
        Retake full mock (all 4 modules)
      </button> : null}
      {retakeNote ? <p className="full-mock-guide-detail">{retakeNote}</p> : null}
    </section>
  );
}
