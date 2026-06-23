import React from "react";
import B1Day3ErfolgsgeschichtenWorkbookPageLegacy from "./B1Day3ErfolgsgeschichtenWorkbookPageLegacy";
import { styles } from "../styles";
import { WORKBOOK_HOEREN_VIDEOS } from "./WorkbookHoerenVideoConfig";
import "./workbookHoerenVideoRefresh.css";

const video = WORKBOOK_HOEREN_VIDEOS.b1Day3;

const B1Day3ErfolgsgeschichtenWorkbookPage = () => (
  <div className="workbook-hoeren-refresh show-hoeren">
    <div className="legacy-workbook">
      <B1Day3ErfolgsgeschichtenWorkbookPageLegacy />
    </div>

    <section className="workbook-hoeren-replacement" style={styles.card}>
      <h2 style={{ margin: 0 }}>Teil 4 · Hören video</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Watch and listen to the video, then answer the Teil 4 questions.
      </p>
      <a
        href={video.youtubeUrl}
        target="_blank"
        rel="noreferrer"
        style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
      >
        Open Hören video on YouTube
      </a>
      <iframe
        src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0`}
        title="B1 Day 3 Erfolgsgeschichten Teil 4 Hören video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </section>
  </div>
);

export default B1Day3ErfolgsgeschichtenWorkbookPage;
