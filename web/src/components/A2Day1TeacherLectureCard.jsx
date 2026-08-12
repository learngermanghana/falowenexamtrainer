import React from "react";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const VIDEO_ID = "70AgN5VKeqc";

export default function A2Day1TeacherLectureCard() {
  return (
    <WorkbookTaskCard eyebrow="Teacher lecture" title="Watch the teacher lesson before you speak" practiceOnly>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Watch the recorded teacher explanation first. Then use the brain map below to build your own introduction instead of memorising a full text.
      </p>
      <div style={{ aspectRatio: "16 / 9", background: "#000", borderRadius: 14, overflow: "hidden", position: "relative", width: "100%" }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`}
          title="A2 Day 1 teacher lecture"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ border: 0, height: "100%", inset: 0, position: "absolute", width: "100%" }}
        />
      </div>
    </WorkbookTaskCard>
  );
}
