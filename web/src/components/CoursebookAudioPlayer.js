import React from "react";

const CoursebookAudioPlayer = ({ url, linkLabel = "Open audio in a new tab" }) => (
  <a href={url} target="_blank" rel="noreferrer">
    {linkLabel}
  </a>
);

export default CoursebookAudioPlayer;
