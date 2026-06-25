import React from "react";

const B1_DAY_4_DRIVE_ID = "1zErUZFGcTIUw_I3aasDXM2VlAoPfKsBP";

const CoursebookAudioPlayer = ({ url, linkLabel = "Open audio in a new tab" }) => {
  if (String(url || "").includes(B1_DAY_4_DRIVE_ID)) {
    return (
      <iframe
        src="https://www.youtube.com/embed/Gijr5NHNJ_o?rel=0"
        title="B1 Day 4 Wohnung suchen listening exercise"
        style={{ width: "100%", aspectRatio: "16 / 9", border: 0, borderRadius: 10 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <a href={url} target="_blank" rel="noreferrer">
      {linkLabel}
    </a>
  );
};

export default CoursebookAudioPlayer;
