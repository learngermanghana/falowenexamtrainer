import React from "react";
import { getA2GoetheWritingTask } from "../data/a2GoetheWritingTasks";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const paragraph = { margin: 0, lineHeight: 1.7 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.8 };

export default function A2GoetheWritingTaskCard({ day }) {
  const task = getA2GoetheWritingTask(day);
  if (!task) return null;

  return (
    <WorkbookTaskCard
      eyebrow="Teil 2 · Schreiben"
      title={task.title}
      submissionNote="Schreiben Sie einen zusammenhängenden Text und bearbeiten Sie alle drei Punkte."
    >
      <p style={paragraph}>{task.situation}</p>
      <p style={paragraph}><strong>Schreiben Sie zu allen drei Punkten:</strong></p>
      <ul style={list}>
        {task.points.map((point) => <li key={point}>{point}</li>)}
      </ul>
      {Number(day) === 16 && (
        <section aria-label="A2 Redemittel zur Entspannung" style={{ display: "grid", gap: 10, lineHeight: 1.65 }}>
          <p style={paragraph}><strong>Umfang: 20–30 Wörter.</strong> Schreibe mit informeller Anrede und Grußformel. Das Wortlimit gilt für die gesamte E-Mail einschließlich Anrede und Gruß.</p>
          <details>
            <summary style={{ cursor: "pointer", fontWeight: 700 }}>A2-Redemittel · Hilfe anzeigen</summary>
            <ul style={list}>
              <li><strong>Anrede:</strong> Lieber Markus, / Hallo Markus,</li>
              <li><strong>Aktivität:</strong> Zur Entspannung gehe ich gerne in die Sauna / im Park spazieren / zum Yoga.</li>
              <li><strong>Begründung:</strong> Das tut mir gut, weil ich mich dort entspannen kann.</li>
              <li><strong>Einladung:</strong> Wollen wir nächstes Wochenende zusammen in den Park gehen? / Hast du am Samstag Lust mitzukommen?</li>
              <li><strong>Gruß:</strong> Viele Grüße / Liebe Grüße + dein Name.</li>
            </ul>
            <p style={paragraph}><strong>Grammatik-Tipp:</strong> Nach <em>weil</em> steht das konjugierte Verb am Satzende.</p>
          </details>
          <details>
            <summary style={{ cursor: "pointer", fontWeight: 700 }}>Musterlösung (23 Wörter) anzeigen</summary>
            <p style={{ ...paragraph, whiteSpace: "pre-line" }}>{"Lieber Markus,\n\nzur Entspannung gehe ich im Park spazieren, weil ich danach ruhig bin. Hast du Lust, nächstes Wochenende mitzukommen?\n\nViele Grüße\nAnna"}</p>
            <p style={paragraph}>Checkliste: Entspannungsaktivität, Begründung, Einladung für nächstes Wochenende, Anrede und Gruß.</p>
          </details>
        </section>
      )}
    </WorkbookTaskCard>
  );
}
