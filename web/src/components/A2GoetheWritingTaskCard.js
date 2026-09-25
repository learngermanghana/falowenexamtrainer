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
    </WorkbookTaskCard>
  );
}
