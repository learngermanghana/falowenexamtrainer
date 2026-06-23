import React from "react";
import A2Day15MeinLieblingssportWorkbookPageLegacy from "./A2Day15MeinLieblingssportWorkbookPageLegacy";
import { styles } from "../styles";
import "./workbookHoerenVideoRefresh.css";

const YOUTUBE_URL = "https://youtu.be/p_OE59m0J-Y";
const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/p_OE59m0J-Y?rel=0";

const A2Day15MeinLieblingssportWorkbookPage = () => (
  <div className="workbook-hoeren-refresh show-hoeren">
    <div className="legacy-workbook">
      <A2Day15MeinLieblingssportWorkbookPageLegacy />
    </div>

    <section className="workbook-hoeren-replacement" style={styles.card}>
      <h2 style={{ margin: 0 }}>Teil 4 · Hören video</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Watch and listen to the video, then answer the Teil 4 questions.
      </p>
      <a
        href={YOUTUBE_URL}
        target="_blank"
        rel="noreferrer"
        style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
      >
        Open Hören video on YouTube
      </a>
      <iframe
        src={YOUTUBE_EMBED_URL}
        title="A2 Day 15 Mein Lieblingssport Teil 4 Hören video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </section>
  </div>
);

export default A2Day15MeinLieblingssportWorkbookPage;
