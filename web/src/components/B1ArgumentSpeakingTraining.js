import React from "react";
import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
  border: "1px solid #bfdbfe",
  background: "#f8fbff",
};

const phraseCard = {
  border: "1px solid #dbeafe",
  borderRadius: 10,
  padding: 12,
  background: "#ffffff",
  display: "grid",
  gap: 6,
  lineHeight: 1.65,
};

const promptStyle = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.75,
};

export default function B1ArgumentSpeakingTraining() {
  return (
    <section style={card} data-b1-argument-speaking-training="grammar">
      <div>
        <p style={{ margin: 0, color: "#1d4ed8", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: ".04em" }}>
          B1 Sprechtraining
        </p>
        <h2 style={{ margin: "4px 0 0" }}>Vorteile, Nachteile und Meinung ausdrücken</h2>
      </div>

      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Trainiere diese drei Schritte regelmäßig. So kannst du bei verschiedenen B1-Themen klar argumentieren und deine Meinung begründen.
      </p>

      <div style={phraseCard}>
        <strong>1. Vorteile ausdrücken</strong>
        <span>„Einerseits bietet dieses Thema viele Vorteile.“</span>
        <span>„Ein Beispiel dafür ist, dass ...“</span>
        <span><strong>Beispiel:</strong> Einerseits bietet das Leben in der Stadt viele Vorteile. Ein Beispiel dafür ist, dass man gute öffentliche Verkehrsmittel nutzen kann.</span>
      </div>

      <div style={phraseCard}>
        <strong>2. Nachteile ausdrücken</strong>
        <span>„Andererseits gibt es auch einige Nachteile.“</span>
        <span>„Ein Beispiel dafür ist, dass ...“</span>
        <span><strong>Beispiel:</strong> Andererseits gibt es auch einige Nachteile. Ein Beispiel dafür ist, dass die Mieten oft sehr hoch sind.</span>
      </div>

      <div style={phraseCard}>
        <strong>3. Die eigene Meinung ausdrücken</strong>
        <span>„Meiner Meinung nach ...“</span>
        <span>„Ich bin der Meinung, dass ...“</span>
        <span>„Ich glaube, dass ...“</span>
        <span><strong>Beispiel:</strong> Ich glaube, dass das Leben in der Stadt für junge Menschen praktisch ist.</span>
      </div>

      <div style={{ ...phraseCard, background: "#eff6ff" }}>
        <strong>Jetzt selbst bilden</strong>
        <ol style={promptStyle}>
          <li>Einerseits bietet __________ viele Vorteile.</li>
          <li>Ein Beispiel dafür ist, dass __________.</li>
          <li>Andererseits gibt es auch einige Nachteile.</li>
          <li>Ein Beispiel dafür ist, dass __________.</li>
          <li>Ich glaube, dass __________.</li>
        </ol>
      </div>
    </section>
  );
}
