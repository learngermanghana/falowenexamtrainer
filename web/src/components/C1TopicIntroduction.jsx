import React from "react";
import { getC1ContentProfile } from "../data/c1ContentRefresh";
import { styles } from "../styles";

const C1_TOPIC_FOUNDATIONS = Object.freeze({
  1: {
    intro: "Anspruchsvolle Lernziele funktionieren besser, wenn sie in überprüfbare Etappen zerlegt werden. Gleichzeitig muss ein guter Lernplan flexibel genug bleiben, um auf Zeitprobleme, Rückschläge und neues Feedback reagieren zu können.",
    example: "Eine Lernende plant vier Wochen lang täglich 45 Minuten Deutsch, überprüft jeden Sonntag ihre Fehler und passt die nächste Woche entsprechend an.",
    tension: "klare Planung und messbare Ziele ↔ notwendige Flexibilität bei Rückschlägen",
  },
  2: {
    intro: "Kulturelle Identität entsteht nicht nur aus Herkunft. Sprache, Familie, Erfahrungen, Migration, soziale Beziehungen und persönliche Entscheidungen können gleichzeitig prägen, wie Menschen sich selbst verstehen und zu welcher Gruppe sie sich zugehörig fühlen.",
    example: "Eine Person wächst mit zwei Sprachen auf, lebt später in einem dritten Land und verbindet Werte und Gewohnheiten aus mehreren Lebenswelten.",
    tension: "Zugehörigkeit und gemeinsame Traditionen ↔ individuelle Mehrfachidentität und Veränderung",
  },
  3: {
    intro: "Informationskompetenz bedeutet, Behauptungen, Quellen und Belege voneinander zu unterscheiden. Gerade online reicht es nicht, dass eine Aussage oft geteilt wird oder professionell aussieht; entscheidend ist, ob sie überprüfbar und nachvollziehbar belegt ist.",
    example: "Ein viraler Beitrag nennt eine angebliche Studie, verlinkt aber weder die Originalquelle noch eine seriöse wissenschaftliche Institution.",
    tension: "schnelle Verbreitung und Meinungsfreiheit ↔ sorgfältige Prüfung und Schutz vor Desinformation",
  },
  4: {
    intro: "Erfolgreiche Teamarbeit hängt nicht nur von Sympathie ab. Rollen, Erwartungen, Verantwortung, Kommunikation und Konfliktlösung müssen so organisiert sein, dass Beiträge fair verteilt und Probleme früh angesprochen werden.",
    example: "In einem Projekt erledigt eine Person fast alle Aufgaben, obwohl die Verantwortung ursprünglich auf vier Teammitglieder verteilt war.",
    tension: "harmonische Zusammenarbeit ↔ klare Verantwortung und notwendige Konfliktklärung",
  },
  5: {
    intro: "Berufliche Entwicklung entsteht aus Erfahrung, Weiterbildung, Eigeninitiative und den Möglichkeiten, die Arbeitgeber oder Institutionen anbieten. Nicht alle Beschäftigten haben jedoch denselben Zugang zu Zeit, Finanzierung oder passenden Lernangeboten.",
    example: "Ein Unternehmen führt neue Software ein und finanziert Schulungen für Beschäftigte, statt von ihnen zu erwarten, dass sie sich ausschließlich privat weiterbilden.",
    tension: "Eigenverantwortung der Beschäftigten ↔ Verantwortung von Arbeitgebern für Weiterbildung",
  },
  6: {
    intro: "Gesundheit wird durch persönliche Gewohnheiten und äußere Bedingungen beeinflusst. Ernährung, Bewegung und Schlaf sind wichtig, aber auch Arbeitszeiten, Stress, Wohnbedingungen und Zugang zu Prävention können gesundheitliche Entscheidungen erleichtern oder erschweren.",
    example: "Eine Beschäftigte möchte regelmäßig Sport treiben, arbeitet aber dauerhaft in wechselnden Nachtschichten und schläft dadurch unregelmäßig.",
    tension: "persönliche Eigenverantwortung ↔ gesellschaftliche und berufliche Rahmenbedingungen",
  },
  7: {
    intro: "Nachhaltiges Reisen bedeutet, Umweltwirkung, Verkehrsmittel, Reisedauer, lokale Wirtschaft und soziale Zugänglichkeit gemeinsam zu betrachten. Eine Reise kann wirtschaftlich nützlich sein und gleichzeitig Umwelt oder lokale Lebensqualität belasten.",
    example: "Eine Region profitiert stark vom Tourismus, leidet aber in der Hauptsaison unter Verkehr, hohen Mieten und überfüllten Orten.",
    tension: "Mobilität und wirtschaftlicher Nutzen ↔ Umweltbelastung und lokale Lebensqualität",
  },
  8: {
    intro: "Stadtentwicklung muss mehrere Ziele gleichzeitig berücksichtigen: bezahlbares Wohnen, Infrastruktur, Grünflächen, Verkehr und wirtschaftliche Entwicklung. Maßnahmen helfen oft einer Gruppe stärker als einer anderen und erzeugen neue Zielkonflikte.",
    example: "Eine Stadt verdichtet ein Wohngebiet, um mehr Wohnungen zu schaffen, verliert dadurch aber einen Teil der freien Grünfläche.",
    tension: "mehr Wohnraum und wirtschaftliche Nutzung ↔ Grünflächen und Lebensqualität",
  },
  9: {
    intro: "Werbung beeinflusst Kaufentscheidungen durch Sprache, Bilder, Wiederholung und persönliche Daten. Besonders personalisierte Werbung kann relevant wirken, wirft aber Fragen nach Transparenz, Manipulation und digitaler Selbstbestimmung auf.",
    example: "Eine Plattform zeigt nach mehreren Produktsuchen gezielt Werbung, die auf das vermutete Interesse einer Person zugeschnitten ist.",
    tension: "relevante Angebote und wirtschaftliche Interessen ↔ Verbraucherautonomie und Datenschutz",
  },
  10: {
    intro: "Integration ist kein einseitiger Anpassungsprozess. Sprache, Bildung, Arbeitsmarkt, soziale Kontakte, Anerkennung von Qualifikationen und faire Institutionen beeinflussen gemeinsam, ob gesellschaftliche Teilhabe gelingt.",
    example: "Eine ausgebildete Pflegekraft lernt Deutsch, kann aber lange nicht im Beruf arbeiten, weil die Anerkennung ihrer Qualifikation noch fehlt.",
    tension: "Eigeninitiative der Zugewanderten ↔ institutionelle Unterstützung und faire Zugangsbedingungen",
  },
  11: {
    intro: "Ehrenamt stärkt Gemeinschaft und kann wichtige soziale Aufgaben unterstützen. Es sollte jedoch nicht dazu führen, dass dauerhaft notwendige öffentliche Leistungen auf unbezahlte Einzelpersonen verlagert werden.",
    example: "Freiwillige organisieren regelmäßig Nachbarschaftshilfe, merken aber nach einigen Monaten, dass wenige Personen fast die gesamte Arbeit übernehmen.",
    tension: "gesellschaftliches Engagement ↔ Überlastung und staatliche Verantwortung",
  },
  12: {
    intro: "Kultur- und Freizeitangebote beeinflussen Lebensqualität, Begegnung und gesellschaftliche Teilhabe. Zugang hängt jedoch oft von Kosten, Ort, Zeit, Barrierefreiheit und öffentlicher Förderung ab.",
    example: "Ein städtisches Kulturzentrum bietet günstige Veranstaltungen an, erreicht aber Menschen aus abgelegenen Stadtteilen nur schwer.",
    tension: "vielfältiges Kulturangebot ↔ faire Zugänglichkeit und Finanzierung",
  },
  13: {
    intro: "Mehrsprachigkeit kann Kommunikation, Identität und berufliche Chancen erweitern. Gleichzeitig braucht sie gute Lernbedingungen, damit vorhandene Sprachen nicht als Hindernis behandelt, sondern sinnvoll in Bildung und Alltag genutzt werden.",
    example: "Ein Kind spricht zu Hause zwei Sprachen und nutzt beide beim Lernen, erhält in der Schule aber nur Unterstützung in einer davon.",
    tension: "gemeinsame Bildungssprache ↔ Förderung sprachlicher Vielfalt",
  },
  14: {
    intro: "Innovation kann große Vorteile schaffen, obwohl ihre langfristigen Folgen nicht immer sicher vorhersehbar sind. Gesellschaften müssen deshalb Nutzen, Risiken, Zugang, Regulierung und Vorsorge gleichzeitig berücksichtigen.",
    example: "Eine neue Technologie senkt Produktionskosten, aber ihre Auswirkungen auf Beschäftigung und Datenschutz sind noch nicht vollständig geklärt.",
    tension: "schnelle Innovation und wirtschaftlicher Nutzen ↔ Vorsorge und gesellschaftliche Verantwortung",
  },
  15: {
    intro: "Lebenslanges Lernen wird wichtiger, weil sich Berufe, Technologien und Kompetenzanforderungen verändern. Weiterbildung bleibt jedoch ungleich zugänglich, wenn Zeit, Geld oder Unterstützung fehlen.",
    example: "Eine Beschäftigte möchte einen berufsbegleitenden Kurs besuchen, kann die Kosten aber ohne Unterstützung des Arbeitgebers nicht tragen.",
    tension: "individuelle Lernbereitschaft ↔ fairer Zugang und institutionelle Finanzierung",
  },
  16: {
    intro: "Digitale Dienste können Alltag und Verwaltung vereinfachen, schaffen aber auch neue Abhängigkeiten. Menschen ohne passende Geräte, Internetzugang oder digitale Kompetenzen dürfen dadurch nicht vom Zugang zu wichtigen Leistungen ausgeschlossen werden.",
    example: "Eine Behörde bietet fast alle Termine online an, während ältere Personen Schwierigkeiten mit der digitalen Anmeldung haben.",
    tension: "Effizienz und Bequemlichkeit ↔ Datenschutz, Barrierefreiheit und analoger Zugang",
  },
  17: {
    intro: "Umweltverantwortung verteilt sich auf Privatpersonen, Unternehmen und öffentliche Institutionen. Individuelles Verhalten ist wichtig, reicht aber allein nicht aus, wenn Infrastruktur, Produktion oder gesetzliche Regeln nachhaltiges Handeln erschweren.",
    example: "Menschen sollen weniger Auto fahren, haben in einer ländlichen Region aber kaum zuverlässige öffentliche Verkehrsmittel.",
    tension: "individuelle Verantwortung ↔ strukturelle und politische Verantwortung",
  },
  18: {
    intro: "Gesellschaftlicher Zusammenhalt entsteht dort, wo Menschen trotz unterschiedlicher Interessen Vertrauen, Teilhabe und faire Regeln erleben. Soziale Ungleichheit, Ausgrenzung und fehlende Begegnungsmöglichkeiten können dieses Vertrauen schwächen.",
    example: "In einem Stadtteil gibt es kaum gemeinsame öffentliche Räume, sodass verschiedene soziale Gruppen nur selten miteinander in Kontakt kommen.",
    tension: "individuelle Freiheit und unterschiedliche Interessen ↔ Solidarität und gemeinsame Verantwortung",
  },
  19: {
    intro: "Die Arbeitswelt verändert sich durch Automatisierung, digitale Technologien und flexible Arbeitsmodelle. Nicht jede Veränderung führt automatisch zu Arbeitsplatzverlust; oft verändern sich Aufgaben und damit die benötigten Kompetenzen.",
    example: "Eine Software übernimmt Routineberichte, während Beschäftigte stärker Beratung, Kontrolle und komplexe Entscheidungen übernehmen.",
    tension: "Produktivität und flexible Arbeit ↔ Arbeitsplatzsicherheit, Weiterbildung und Belastungsgrenzen",
  },
  20: {
    intro: "Digitale Gesundheitsangebote können Zugang und Kommunikation verbessern, ersetzen aber nicht jede medizinische Untersuchung. Besonders wichtig sind medizinische Qualität, Datenschutz und klare Verantwortlichkeit.",
    example: "Eine Patientin bespricht einen Laborbefund online, benötigt für eine körperliche Untersuchung aber weiterhin einen Termin in der Praxis.",
    tension: "leichter Zugang und Effizienz ↔ medizinische Grenzen und Schutz sensibler Daten",
  },
  21: {
    intro: "Langfristige gesellschaftliche Teilhabe hängt nicht nur von Sprachkenntnissen ab. Bildung, Arbeit, Anerkennung von Qualifikationen, soziale Kontakte und diskriminierungsarme Institutionen beeinflussen, ob Menschen tatsächlich Zugang zu wichtigen Bereichen erhalten.",
    example: "Ein Ingenieur spricht gut Deutsch, findet aber lange keine passende Arbeit, weil sein ausländischer Abschluss noch nicht anerkannt wurde.",
    tension: "persönliche Eigeninitiative ↔ institutionelle Zugangsbarrieren und Unterstützung",
  },
  22: {
    intro: "Demokratische Mitbestimmung findet auf unterschiedlichen Ebenen statt: durch Wahlen, Bürgerinitiativen, Beteiligungsverfahren oder politische Diskussionen. Mehr Beteiligung ist nur dann sinnvoll, wenn Menschen informiert teilnehmen können und Entscheidungen transparent bleiben.",
    example: "Eine Kommune lässt Einwohner über die Gestaltung eines öffentlichen Platzes beraten, muss aber am Ende auch Finanzierung und rechtliche Vorgaben berücksichtigen.",
    tension: "direkte Beteiligung und Mitsprache ↔ fachliche, rechtliche und repräsentative Entscheidungsverantwortung",
  },
  23: {
    intro: "Work-Life-Balance hängt nicht nur von persönlicher Disziplin ab. Arbeitszeit, Erreichbarkeit, Homeoffice-Regeln, Betreuungspflichten und betriebliche Erwartungen bestimmen mit, ob ausreichende Erholung möglich ist.",
    example: "Ein Unternehmen erlaubt Homeoffice, erwartet aber gleichzeitig, dass Beschäftigte auch abends schnell auf Nachrichten reagieren.",
    tension: "Flexibilität und betriebliche Erreichbarkeit ↔ verlässliche Erholung und private Grenzen",
  },
  24: {
    intro: "Verkehrsinfrastruktur soll Mobilität zuverlässig, bezahlbar und möglichst umweltverträglich ermöglichen. Stadt und Land haben dabei unterschiedliche Bedürfnisse, weshalb dieselbe Lösung nicht überall gleich sinnvoll ist.",
    example: "Eine Großstadt investiert in Straßenbahn und Radwege, während eine ländliche Region vor allem bessere Busverbindungen benötigt.",
    tension: "individuelle Mobilität und kurze Reisezeiten ↔ Kosten, Umweltwirkung und öffentlicher Raum",
  },
  25: {
    intro: "Wissenschaftlicher Fortschritt braucht Forschungsfreiheit, aber auch Regeln für Sicherheit, Ethik und verantwortliche Anwendung. Besonders schwierige Fragen entstehen, wenn möglicher Nutzen und mögliche Schäden beide erheblich sind.",
    example: "Eine medizinische Forschung könnte schwere Krankheiten behandeln helfen, wirft aber gleichzeitig erhebliche ethische Fragen zum Eingriff in menschliches Erbgut auf.",
    tension: "Forschungsfreiheit und Erkenntnisgewinn ↔ ethische Grenzen und gesellschaftliche Verantwortung",
  },
  26: {
    intro: "Nachhaltiger Konsum hängt von Produktqualität, Reparierbarkeit, Preis, Information und Lieferketten ab. Verbraucher können Entscheidungen treffen, aber Hersteller und Handel bestimmen wesentlich mit, welche Alternativen überhaupt verfügbar und bezahlbar sind.",
    example: "Ein langlebiges reparierbares Gerät ist teurer als ein billiges Modell, verursacht aber möglicherweise über mehrere Jahre weniger Ressourcenverbrauch.",
    tension: "günstige Preise und Bequemlichkeit ↔ Langlebigkeit, Transparenz und Produzentenverantwortung",
  },
  27: {
    intro: "Digitale Verwaltung kann Wege und Bearbeitungszeiten verkürzen. Gleichzeitig müssen Datenschutz, Barrierefreiheit, verständliche Sprache und persönliche Alternativen erhalten bleiben, damit Digitalisierung nicht neue Ausschlüsse erzeugt.",
    example: "Ein Online-Antrag spart Zeit, ist aber für eine Person ohne digitale Identifikation oder ausreichende Sprachkenntnisse kaum nutzbar.",
    tension: "Effizienz und Automatisierung ↔ Zugänglichkeit, Datenschutz und persönliche Beratung",
  },
  28: {
    intro: "Demografischer Wandel verändert das Verhältnis zwischen jüngeren und älteren Bevölkerungsgruppen. Dadurch geraten Rentenfinanzierung, Pflege, Fachkräftebedarf und Generationengerechtigkeit langfristig stärker unter Druck.",
    example: "Immer mehr Menschen beziehen lange Rente, während relativ weniger Erwerbstätige Beiträge zahlen und gleichzeitig mehr Pflegepersonal benötigt wird.",
    tension: "finanzielle Tragfähigkeit ↔ soziale Absicherung und faire Belastung zwischen Generationen",
  },
});

export const getC1TopicFoundation = (day) => {
  const base = C1_TOPIC_FOUNDATIONS[Number(day)] || null;
  const profile = getC1ContentProfile(day);
  return base && profile ? { ...base, day: Number(day), question: profile.question } : null;
};

const infoBox = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  padding: 12,
  background: "#ffffff",
  lineHeight: 1.7,
  display: "grid",
  gap: 4,
};

export default function C1TopicIntroduction({ day, title }) {
  const topic = getC1TopicFoundation(day);
  if (!topic) return null;

  return (
    <section
      style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #bfdbfe", borderRadius: 18, background: "#f8fbff" }}
      data-c1-topic-intro={topic.day}
    >
      <div>
        <div style={{ fontWeight: 900, color: "#1d4ed8" }}>C1 · Thema verstehen</div>
        <h2 style={{ margin: "4px 0 0", fontSize: "1.2rem" }}>{title || `C1 Day ${topic.day}`}</h2>
      </div>

      <p style={{ margin: 0, lineHeight: 1.75 }}>{topic.intro}</p>

      <div style={infoBox}>
        <strong>Konkretes Beispiel</strong>
        <span>{topic.example}</span>
      </div>

      <div style={{ ...infoBox, background: "#fffbeb", borderColor: "#fde68a" }}>
        <strong>Zielkonflikt / Perspektiven</strong>
        <span>{topic.tension}</span>
      </div>

      <div style={{ ...infoBox, background: "#eff6ff" }}>
        <strong>Leitfrage</strong>
        <span>{topic.question}</span>
      </div>
    </section>
  );
}

export { C1_TOPIC_FOUNDATIONS };
