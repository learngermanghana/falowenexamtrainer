import React, { useMemo, useState } from "react";
import { styles } from "../styles";

export const C1_TOPIC_COLLOCATIONS = {
  1: { topic: "Ziele und Lernweg", items: [
    ["sich konzentrieren auf + Akk", "to focus on", "Ich konzentriere mich auf meine Schwächen im schriftlichen Ausdruck."],
    ["sich vorbereiten auf + Akk", "to prepare for", "Ich bereite mich gezielt auf die C1-Prüfung vor."],
    ["arbeiten an + Dat", "to work on", "Ich arbeite an meiner sprachlichen Präzision."],
    ["abhängen von + Dat", "to depend on", "Der Lernerfolg hängt von regelmäßiger Übung ab."],
  ]},
  2: { topic: "Kultur und Identität", items: [
    ["sich identifizieren mit + Dat", "to identify with", "Viele Menschen identifizieren sich mit mehreren kulturellen Traditionen."],
    ["gehören zu + Dat", "to belong to", "Sprache gehört zu den wichtigsten Merkmalen kultureller Identität."],
    ["geprägt sein von + Dat", "to be shaped by", "Das Selbstbild ist von persönlichen und gesellschaftlichen Erfahrungen geprägt."],
    ["sich abgrenzen von + Dat", "to distance oneself from", "Manche Jugendliche grenzen sich bewusst von traditionellen Erwartungen ab."],
  ]},
  3: { topic: "Medien und Informationskompetenz", items: [
    ["sich informieren über + Akk", "to inform oneself about", "Nutzer sollten sich über die Herkunft einer Meldung informieren."],
    ["warnen vor + Dat", "to warn against", "Fachleute warnen vor der unkritischen Verbreitung falscher Informationen."],
    ["zweifeln an + Dat", "to doubt", "Viele Menschen zweifeln an der Glaubwürdigkeit anonymer Quellen."],
    ["sich beziehen auf + Akk", "to refer to", "Der Artikel bezieht sich auf eine aktuelle Studie."],
  ]},
  4: { topic: "Beziehungen und Teamarbeit", items: [
    ["sich verlassen auf + Akk", "to rely on", "In einem guten Team muss man sich aufeinander verlassen können."],
    ["umgehen mit + Dat", "to deal with", "Führungskräfte müssen konstruktiv mit Konflikten umgehen."],
    ["sich einigen auf + Akk", "to agree on", "Das Team einigte sich auf eine gemeinsame Lösung."],
    ["beitragen zu + Dat", "to contribute to", "Klare Kommunikation trägt zu einer besseren Zusammenarbeit bei."],
  ]},
  5: { topic: "Berufliche Entwicklung", items: [
    ["sich bewerben um + Akk", "to apply for", "Sie bewirbt sich um eine leitende Position."],
    ["sich bewerben bei + Dat", "to apply to a company", "Er bewirbt sich bei einem internationalen Unternehmen."],
    ["verfügen über + Akk", "to possess / have", "Bewerber sollten über relevante Berufserfahrung verfügen."],
    ["sich spezialisieren auf + Akk", "to specialize in", "Sie hat sich auf digitales Projektmanagement spezialisiert."],
  ]},
  6: { topic: "Gesundheit und Lebensstil", items: [
    ["leiden an + Dat", "to suffer from an illness", "Viele Beschäftigte leiden an chronischen Rückenschmerzen."],
    ["leiden unter + Dat", "to suffer under a condition", "Viele Menschen leiden unter dauerhaftem Stress."],
    ["verzichten auf + Akk", "to do without", "Aus gesundheitlichen Gründen verzichtet er auf Alkohol."],
    ["sich erholen von + Dat", "to recover from", "Der Körper muss sich von hoher Belastung erholen."],
  ]},
  7: { topic: "Reisen und Nachhaltigkeit", items: [
    ["verzichten auf + Akk", "to do without", "Reisende können auf besonders klimaschädliche Kurzstreckenflüge verzichten."],
    ["sich entscheiden für + Akk", "to decide in favor of", "Viele Reisende entscheiden sich für die Bahn."],
    ["abhängen von + Dat", "to depend on", "Die Umweltbilanz hängt von Verkehrsmittel und Reisedauer ab."],
    ["beitragen zu + Dat", "to contribute to", "Bewusste Reiseentscheidungen können zum Klimaschutz beitragen."],
  ]},
  8: { topic: "Wohnen und Stadtentwicklung", items: [
    ["investieren in + Akk", "to invest in", "Städte sollten stärker in bezahlbaren Wohnraum investieren."],
    ["führen zu + Dat", "to lead to", "Steigende Mieten können zur Verdrängung einkommensschwacher Haushalte führen."],
    ["protestieren gegen + Akk", "to protest against", "Anwohner protestieren gegen den Abriss historischer Gebäude."],
    ["abhängen von + Dat", "to depend on", "Lebensqualität hängt auch von einer guten Infrastruktur ab."],
  ]},
  9: { topic: "Konsum und Werbung", items: [
    ["sich entscheiden für + Akk", "to decide in favor of", "Verbraucher entscheiden sich häufig für bekannte Marken."],
    ["beeinflusst werden von + Dat", "to be influenced by", "Kaufentscheidungen werden stark von Werbung beeinflusst."],
    ["warnen vor + Dat", "to warn against", "Verbraucherschützer warnen vor manipulativen Werbestrategien."],
    ["verzichten auf + Akk", "to refrain from", "Manche Menschen verzichten bewusst auf personalisierte Werbung."],
  ]},
  10: { topic: "Integration und Gesellschaft", items: [
    ["teilhaben an + Dat", "to participate in / share in", "Gute Sprachkenntnisse ermöglichen Zugewanderten, aktiv an der Gesellschaft teilzuhaben."],
    ["teilnehmen an + Dat", "to take part in", "Viele Zugewanderte nehmen an Integrationskursen teil."],
    ["sich anpassen an + Akk", "to adapt to", "Neuankömmlinge müssen sich an bestimmte gesellschaftliche Regeln anpassen."],
    ["sich einsetzen für + Akk", "to advocate for", "Viele Initiativen setzen sich für gleiche Chancen ein."],
  ]},
  11: { topic: "Engagement und Ehrenamt", items: [
    ["sich engagieren für + Akk", "to volunteer / campaign for", "Viele junge Menschen engagieren sich für soziale Projekte."],
    ["sich einsetzen für + Akk", "to advocate for", "Der Verein setzt sich für benachteiligte Familien ein."],
    ["mitwirken an + Dat", "to participate in shaping", "Ehrenamtliche wirken an zahlreichen lokalen Projekten mit."],
    ["beitragen zu + Dat", "to contribute to", "Freiwilliges Engagement trägt zum gesellschaftlichen Zusammenhalt bei."],
  ]},
  12: { topic: "Freizeit und Kultur", items: [
    ["teilnehmen an + Dat", "to participate in", "Viele Menschen nehmen regelmäßig an kulturellen Veranstaltungen teil."],
    ["sich interessieren für + Akk", "to be interested in", "Junge Erwachsene interessieren sich zunehmend für internationale Kulturangebote."],
    ["sich begeistern für + Akk", "to be enthusiastic about", "Viele Jugendliche begeistern sich für digitale Kunstformen."],
    ["sich beschäftigen mit + Dat", "to engage with", "Museen beschäftigen sich zunehmend mit gesellschaftlichen Kontroversen."],
  ]},
  13: { topic: "Mehrsprachigkeit", items: [
    ["verfügen über + Akk", "to possess / have", "Mehrsprachige Personen verfügen oft über flexible Kommunikationsstrategien."],
    ["zurückgreifen auf + Akk", "to draw on", "Lernende greifen beim Verstehen auf bereits bekannte Sprachen zurück."],
    ["beitragen zu + Dat", "to contribute to", "Mehrsprachigkeit kann zu einer differenzierten Wahrnehmung beitragen."],
    ["abhängen von + Dat", "to depend on", "Der Spracherwerb hängt von vielen individuellen Faktoren ab."],
  ]},
  14: { topic: "Innovation und Zukunft", items: [
    ["forschen an + Dat", "to research / work on", "Forschende arbeiten an neuen Energiespeichern."],
    ["investieren in + Akk", "to invest in", "Unternehmen investieren verstärkt in künstliche Intelligenz."],
    ["sich befassen mit + Dat", "to deal with / study", "Die Forschung befasst sich mit langfristigen Folgen neuer Technologien."],
    ["basieren auf + Dat", "to be based on", "Viele Innovationen basieren auf wissenschaftlichen Erkenntnissen."],
  ]},
  15: { topic: "Bildung und lebenslanges Lernen", items: [
    ["teilnehmen an + Dat", "to participate in", "Beschäftigte nehmen regelmäßig an Weiterbildungen teil."],
    ["sich vorbereiten auf + Akk", "to prepare for", "Weiterbildung bereitet Beschäftigte auf neue Anforderungen vor."],
    ["profitieren von + Dat", "to benefit from", "Lernende profitieren von individuellem Feedback."],
    ["sich beschäftigen mit + Dat", "to engage with", "Studierende beschäftigen sich intensiv mit wissenschaftlichen Texten."],
  ]},
  16: { topic: "Technologie im Alltag", items: [
    ["zugreifen auf + Akk", "to access", "Nutzer können jederzeit auf digitale Dienste zugreifen."],
    ["verfügen über + Akk", "to have at one's disposal", "Nicht alle Haushalte verfügen über eine stabile Internetverbindung."],
    ["abhängen von + Dat", "to depend on", "Digitale Teilhabe hängt von technischer Infrastruktur ab."],
    ["umgehen mit + Dat", "to deal with", "Nutzer müssen verantwortungsvoll mit persönlichen Daten umgehen."],
  ]},
  17: { topic: "Umwelt und Verantwortung", items: [
    ["beitragen zu + Dat", "to contribute to", "Individuelles Verhalten kann zum Klimaschutz beitragen."],
    ["verzichten auf + Akk", "to refrain from", "Verbraucher können auf unnötige Einwegprodukte verzichten."],
    ["führen zu + Dat", "to lead to", "Hoher Ressourcenverbrauch führt zu erheblichen Umweltbelastungen."],
    ["sich auswirken auf + Akk", "to affect", "Klimapolitische Entscheidungen wirken sich auf Unternehmen und Haushalte aus."],
  ]},
  18: { topic: "Gesellschaft und Zusammenhalt", items: [
    ["beitragen zu + Dat", "to contribute to", "Soziale Begegnungsräume können zum gesellschaftlichen Zusammenhalt beitragen."],
    ["sich einsetzen für + Akk", "to advocate for", "Viele Organisationen setzen sich für soziale Teilhabe ein."],
    ["abhängen von + Dat", "to depend on", "Gesellschaftliches Vertrauen hängt von fairen Institutionen ab."],
    ["führen zu + Dat", "to lead to", "Dauerhafte Ausgrenzung kann zu gesellschaftlichen Spannungen führen."],
  ]},
  19: { topic: "Arbeit der Zukunft", items: [
    ["sich einstellen auf + Akk", "to adjust to / prepare for", "Beschäftigte müssen sich auf neue Tätigkeitsprofile einstellen."],
    ["abhängen von + Dat", "to depend on", "Der Erfolg von Weiterbildung hängt von Zeit und Zugang ab."],
    ["profitieren von + Dat", "to benefit from", "Unternehmen profitieren von gut qualifizierten Fachkräften."],
    ["führen zu + Dat", "to lead to", "Automatisierung kann zu einem Wandel beruflicher Aufgaben führen."],
  ]},
  20: { topic: "Digitale Gesundheit", items: [
    ["zugreifen auf + Akk", "to access", "Patientinnen und Patienten können auf digitale Gesundheitsdaten zugreifen."],
    ["schützen vor + Dat", "to protect from", "Strenge Regeln sollen sensible Daten vor Missbrauch schützen."],
    ["warnen vor + Dat", "to warn against", "Fachleute warnen vor unkontrollierten KI-Empfehlungen."],
    ["abhängen von + Dat", "to depend on", "Der Nutzen digitaler Angebote hängt von ihrer Zuverlässigkeit ab."],
  ]},
  21: { topic: "Migration und Teilhabe", items: [
    ["teilhaben an + Dat", "to participate in", "Sprachkenntnisse erleichtern es, aktiv am gesellschaftlichen Leben teilzuhaben."],
    ["Zugang haben zu + Dat", "to have access to", "Alle Zugewanderten sollten Zugang zu Sprachkursen haben."],
    ["sich einsetzen für + Akk", "to advocate for", "Initiativen setzen sich für faire Bildungschancen ein."],
    ["abhängen von + Dat", "to depend on", "Erfolgreiche Teilhabe hängt von individuellen und institutionellen Faktoren ab."],
  ]},
  22: { topic: "Politik und Mitbestimmung", items: [
    ["teilnehmen an + Dat", "to participate in", "Viele Bürger nehmen an Wahlen und öffentlichen Debatten teil."],
    ["sich beteiligen an + Dat", "to participate in", "Junge Menschen sollten sich stärker an politischen Prozessen beteiligen."],
    ["sich einsetzen für + Akk", "to advocate for", "Bürgerinitiativen setzen sich für mehr Transparenz ein."],
    ["protestieren gegen + Akk", "to protest against", "Demonstrierende protestieren gegen eine geplante Reform."],
  ]},
  23: { topic: "Freizeit und Work-Life-Balance", items: [
    ["sich erholen von + Dat", "to recover from", "Beschäftigte müssen sich ausreichend von beruflicher Belastung erholen."],
    ["verzichten auf + Akk", "to refrain from", "Nach Feierabend sollte man möglichst auf dienstliche Nachrichten verzichten."],
    ["leiden unter + Dat", "to suffer under", "Viele Beschäftigte leiden unter ständiger Erreichbarkeit."],
    ["sich auswirken auf + Akk", "to affect", "Dauerhafter Stress wirkt sich negativ auf die Gesundheit aus."],
  ]},
  24: { topic: "Mobilität und Infrastruktur", items: [
    ["investieren in + Akk", "to invest in", "Die Regierung sollte stärker in öffentliche Verkehrsmittel investieren."],
    ["führen zu + Dat", "to lead to", "Ein zuverlässiges Verkehrsnetz kann zu höherer wirtschaftlicher Produktivität führen."],
    ["abhängen von + Dat", "to depend on", "Die Attraktivität des Nahverkehrs hängt von Preis und Zuverlässigkeit ab."],
    ["beitragen zu + Dat", "to contribute to", "Ein gut ausgebauter Nahverkehr trägt zur sozialen Teilhabe bei."],
  ]},
  25: { topic: "Wissenschaft und Forschung", items: [
    ["forschen an + Dat", "to conduct research on", "Forschende arbeiten an neuen medizinischen Therapien."],
    ["sich befassen mit + Dat", "to deal with / investigate", "Die Studie befasst sich mit den Folgen künstlicher Intelligenz."],
    ["zurückführen auf + Akk", "to attribute to", "Die Forschenden führen den Effekt auf mehrere Faktoren zurück."],
    ["deuten auf + Akk hin", "to indicate", "Die Ergebnisse deuten auf einen deutlichen Zusammenhang hin."],
  ]},
  26: { topic: "Nachhaltiger Konsum", items: [
    ["achten auf + Akk", "to pay attention to", "Verbraucher können stärker auf Herkunft und Produktionsbedingungen achten."],
    ["verzichten auf + Akk", "to refrain from", "Viele Menschen verzichten auf besonders ressourcenintensive Produkte."],
    ["sich entscheiden für + Akk", "to decide in favor of", "Immer mehr Kunden entscheiden sich für langlebige Produkte."],
    ["beitragen zu + Dat", "to contribute to", "Bewusster Konsum kann zu einem geringeren Ressourcenverbrauch beitragen."],
  ]},
  27: { topic: "Digitalisierung und Verwaltung", items: [
    ["zugreifen auf + Akk", "to access", "Bürger sollten einfach auf digitale Verwaltungsdienste zugreifen können."],
    ["abhängen von + Dat", "to depend on", "Der Erfolg digitaler Verwaltung hängt von nutzerfreundlichen Systemen ab."],
    ["schützen vor + Dat", "to protect from", "Sicherheitsmaßnahmen schützen persönliche Daten vor Missbrauch."],
    ["führen zu + Dat", "to lead to", "Digitalisierte Prozesse können zu kürzeren Bearbeitungszeiten führen."],
  ]},
  28: { topic: "Demografischer Wandel und Generationengerechtigkeit", items: [
    ["führen zu + Dat", "to lead to", "Eine alternde Bevölkerung kann zu einem höheren Pflegebedarf führen."],
    ["abhängen von + Dat", "to depend on", "Die langfristige Finanzierung des Rentensystems hängt von mehreren demografischen und wirtschaftlichen Faktoren ab."],
    ["beitragen zu + Dat", "to contribute to", "Gezielte Fachkräftezuwanderung kann zur Entlastung des Arbeitsmarktes beitragen."],
    ["sich auswirken auf + Akk", "to affect", "Der demografische Wandel wirkt sich auf Renten, Pflege, Arbeitsmarkt und öffentliche Haushalte aus."],
  ]},
};

const card = { ...styles.card, display: "grid", gap: 14, border: "1px solid #bfdbfe", borderRadius: 18, background: "linear-gradient(180deg,#eff6ff 0%,#ffffff 100%)" };

export const getC1TopicCollocations = (day) => C1_TOPIC_COLLOCATIONS[Number(day)] || null;

export default function C1TopicCollocationPractice({ day }) {
  const lesson = useMemo(() => getC1TopicCollocations(day), [day]);
  const [answers, setAnswers] = useState({});
  if (!lesson) return null;

  const quizItems = lesson.items.slice(0, 3);
  const patterns = lesson.items.map((item) => item[0]);
  const correctCount = quizItems.filter((item, index) => answers[index] === item[0]).length;

  return (
    <section data-c1-topic-collocations={`day-${Number(day)}`} style={card}>
      <div style={{ display: "grid", gap: 5 }}>
        <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e3a8a" }}>C1 Kollokationen · Verben mit Präpositionen</span>
        <h2 style={{ margin: 0 }}>Passende Verbindungen für: {lesson.topic}</h2>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>Lerne nicht nur das Verb. Lerne die ganze Verbindung mit Präposition und Kasus, damit du sie beim Sprechen und Schreiben automatisch richtig bildest.</p>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {lesson.items.map(([pattern, meaning, example]) => (
          <div key={pattern} style={{ border: "1px solid #dbeafe", borderRadius: 14, padding: 12, background: "#fff", display: "grid", gap: 5 }}>
            <strong>{pattern}</strong>
            <span style={{ color: "#475569" }}>{meaning}</span>
            <span style={{ lineHeight: 1.6 }}><strong>Beispiel:</strong> {example}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <div><strong>Kurz prüfen</strong><div style={{ color: "#475569", fontSize: 14 }}>Wähle die Verbindung, die zur englischen Bedeutung passt.</div></div>
        {quizItems.map(([pattern, meaning], index) => {
          const choices = [pattern, ...patterns.filter((candidate) => candidate !== pattern)].slice(0, 4);
          const selected = answers[index] || "";
          return (
            <div key={`${pattern}-quiz`} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, display: "grid", gap: 8 }}>
              <strong>{index + 1}. {meaning}</strong>
              {choices.map((choice) => {
                const chosen = selected === choice;
                const correct = choice === pattern;
                return <button key={choice} type="button" onClick={() => setAnswers((old) => ({ ...old, [index]: choice }))} style={{ ...styles.secondaryButton, textAlign: "left", background: chosen ? (correct ? "#f0fdf4" : "#fef2f2") : undefined }}>{choice}</button>;
              })}
              {selected ? <div style={{ fontWeight: 700, color: selected === pattern ? "#166534" : "#991b1b" }}>{selected === pattern ? "Richtig." : `Noch nicht. Richtig ist: ${pattern}`}</div> : null}
            </div>
          );
        })}
        <strong>{correctCount}/{quizItems.length} richtig</strong>
      </div>

      <div style={{ border: "1px solid #bbf7d0", borderRadius: 14, padding: 12, background: "#f0fdf4", color: "#14532d", lineHeight: 1.65 }}>
        <strong>Jetzt produzieren:</strong> Formuliere zwei eigene C1-Sätze zum heutigen Thema und benutze dabei mindestens zwei der Verbindungen oben.
      </div>
    </section>
  );
}
