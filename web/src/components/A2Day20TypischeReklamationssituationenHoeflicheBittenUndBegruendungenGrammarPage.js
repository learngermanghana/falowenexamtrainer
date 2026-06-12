import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 12 };
const heroImageStyle = {
  width: "100%",
  maxHeight: 280,
  objectFit: "cover",
  borderRadius: 12,
  border: "1px solid rgba(148,163,184,0.35)",
};
const listStyle = { margin: 0, paddingLeft: 20, display: "grid", gap: 6 };
const noteStyle = {
  borderRadius: 12,
  padding: 12,
  background: "rgba(16,185,129,0.1)",
  border: "1px solid rgba(16,185,129,0.35)",
};

const SectionCard = ({ title, children }) => (
  <section style={cardStyle} aria-label={title}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const A2Day20TypischeReklamationssituationenHoeflicheBittenUndBegruendungenGrammarPage = () => {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <AppBackButton label="Back" fallbackPath="/campus/course" />

        <header style={{ ...styles.card, display: "grid", gap: 10, marginBottom: 18 }}>
          <h1 style={{ margin: 0 }}>A2 • 7.20 Typische Reklamationssituationen üben</h1>
          <img
            src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&q=80"
            alt="Customer speaking with support staff at a service counter"
            style={heroImageStyle}
            loading="lazy"
          />
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.72 }}>Header image source: Unsplash</p>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Grammar focus: <strong>Höfliche Bitten und Begründungen</strong>
          </p>
          <p style={{ margin: 0, opacity: 0.8 }}>
            English support: This page explains how to make <strong>polite complaints</strong> in German and how to
            give clear <strong>reasons</strong> for your request.
          </p>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) Höfliche Bitten in Reklamationen">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Bei einer Reklamation bleiben Sie ruhig, präzise und höflich. Nutzen Sie <strong>Sie-Form</strong>,
              Konjunktiv-II-Strukturen und <strong>bitte</strong>, um professionell zu klingen.
            </p>
            <p style={{ margin: 0, lineHeight: 1.7, opacity: 0.9 }}>
              <strong>English:</strong> In a complaint, stay calm, precise, and polite. Use the formal{" "}
              <strong>Sie</strong> form, <strong>Konjunktiv II</strong> (for polite requests like <em>könnten</em>{" "}
              and <em>wäre</em>), and <strong>bitte</strong> to sound professional.
            </p>
            <div style={noteStyle}>
              <strong>Nützliche Satzanfänge:</strong>
              <ul style={listStyle}>
                <li>Entschuldigung, ich habe ein Problem mit ...</li>
                <li>Könnten Sie bitte prüfen, was passiert ist?</li>
                <li>Ich würde gern eine Lösung finden.</li>
              </ul>
              <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}>
                <strong>English:</strong> Useful openings: “Excuse me, I have a problem with …”, “Could you please
                check what happened?”, “I would like to find a solution.”
              </p>
            </div>
          </SectionCard>

          <SectionCard title="2) Begründungen geben: weil / da / denn">
            <p style={{ margin: 0 }}>Begründungen helfen, Ihre Reklamation klar und nachvollziehbar zu machen.</p>
            <p style={{ margin: 0, opacity: 0.9 }}>
              <strong>English:</strong> Reasons make your complaint clear and logical. The key grammar difference is
              word order.
            </p>
            <ul style={listStyle}>
              <li>
                <strong>weil</strong>: Nebensatz, Verb am Ende. <em>Ich reklamiere, weil der Artikel defekt ist.</em>
              </li>
              <li>
                <strong>da</strong>: formeller als „weil“. <em>Da die Lieferung verspätet war, ...</em>
              </li>
              <li>
                <strong>denn</strong>: Hauptsatz, Verb auf Position 2. <em>Ich brauche Hilfe, denn das Gerät funktioniert nicht.</em>
              </li>
            </ul>
            <p style={{ margin: 0, lineHeight: 1.7, opacity: 0.9 }}>
              <strong>English grammar note:</strong> <em>weil</em> and <em>da</em> start a subordinate clause, so the
              conjugated verb goes to the end. <em>denn</em> connects two main clauses, so normal main-clause word
              order stays the same (verb in second position).
            </p>
          </SectionCard>

          <SectionCard title="3) Typische Reklamationssituationen (A2)">
            <ul style={listStyle}>
              <li>Ein Produkt ist kaputt oder unvollständig.</li>
              <li>Eine Lieferung kommt zu spät oder gar nicht an.</li>
              <li>Auf der Rechnung steht ein falscher Betrag.</li>
              <li>Eine Dienstleistung entspricht nicht der Beschreibung.</li>
            </ul>
            <p style={{ margin: 0, opacity: 0.9 }}>
              <strong>English:</strong> Typical situations: damaged/incomplete product, late or missing delivery,
              wrong amount on the bill, or service not matching the description.
            </p>
          </SectionCard>

          <SectionCard title="4) Knowledge: Redemittel für Lösungsvorschläge">
            <p style={{ margin: 0 }}>Kombinieren Sie Problem + Begründung + Wunsch nach Lösung:</p>
            <p style={{ margin: 0, opacity: 0.9 }}>
              <strong>English:</strong> Build a strong complaint with this structure:{" "}
              <em>problem + reason + preferred solution</em>.
            </p>
            <ul style={listStyle}>
              <li>Ich möchte den Artikel umtauschen, weil er defekt ist.</li>
              <li>Könnten Sie mir bitte den korrekten Betrag zurückerstatten?</li>
              <li>Wäre es möglich, dass Sie eine Ersatzlieferung schicken?</li>
              <li>Ich bitte um eine kurze Rückmeldung, da ich das Produkt dringend brauche.</li>
            </ul>
          </SectionCard>

          <SectionCard title="5) Mini-Übung: höflich + Begründung">
            <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8 }}>
              <li>Könnten Sie mir bitte helfen, ___ der Artikel beschädigt ist? (weil / denn)</li>
              <li>Ich möchte reklamieren, ___ die Rechnung nicht stimmt. (weil / da)</li>
              <li>Wir brauchen eine Lösung, ___ die Lieferung zu spät gekommen ist. (denn / weil)</li>
              <li>Wählen Sie den höflicheren Satz: A) Das ist falsch. Machen Sie das neu. B) Könnten Sie das bitte prüfen?</li>
            </ol>
            <p style={{ margin: 0, opacity: 0.9 }}>
              <strong>English task:</strong> Fill in <em>weil / da / denn</em> and choose the more polite sentence.
            </p>

            <button type="button" onClick={() => setShowAnswers((prev) => !prev)} style={styles.secondaryBtn}>
              {showAnswers ? "Hide answers" : "Show answers"}
            </button>

            {showAnswers ? (
              <div style={{ border: "1px solid rgba(148,163,184,0.35)", borderRadius: 10, padding: 12 }}>
                <strong>Answers:</strong>
                <ol style={{ margin: "8px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                  <li>weil</li>
                  <li>weil / da</li>
                  <li>denn</li>
                  <li>B</li>
                </ol>
              </div>
            ) : null}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default A2Day20TypischeReklamationssituationenHoeflicheBittenUndBegruendungenGrammarPage;
