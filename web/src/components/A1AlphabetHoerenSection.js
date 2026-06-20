import React from "react";
import { styles } from "../styles";
import { listeningItems } from "../data/a1AlphabetWorkbookData";

const box = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 6,
  background: "#fff",
};

const A1AlphabetHoerenSection = ({ sectionStyle }) => (
  <section style={sectionStyle}>
    <h2 style={{ margin: 0 }}>Teil 3 · Hören</h2>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      <strong>Instruction:</strong> Watch and listen to the video. Write the missing letters to
      complete each German word, then open the Submit tab and send your answers.
    </p>

    <div
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "56.25%",
        overflow: "hidden",
        borderRadius: 12,
        background: "#0f172a",
      }}
    >
      <iframe
        src="https://www.youtube-nocookie.com/embed/DeE6LKXyLWs"
        title="German alphabet listening exercise"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
      />
    </div>

    <div style={{ display: "grid", gap: 10 }}>
      {listeningItems.map((item) => (
        <div key={item.number} style={box}>
          <strong style={{ fontSize: 17 }}>{item.number}. {item.prompt}</strong>
        </div>
      ))}
    </div>

    <p style={{ ...styles.helperText, margin: 0 }}>
      Listen more than once when necessary. Submit only the completed words.
    </p>
  </section>
);

export default A1AlphabetHoerenSection;
