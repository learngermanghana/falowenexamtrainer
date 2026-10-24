const formats = {
  4: {
    label: "Leserbrief",
    targetWords: 350,
    instruction: (title) => `Schreiben Sie einen Leserbrief von circa 350 Wörtern an die Redaktion zum Thema „${title}“. Reagieren Sie auf die drei Positionen, begründen Sie Ihre Bewertung und entwickeln Sie eine eigene Schlussfolgerung.`,
    template: (title) => `Sehr geehrte Damen und Herren,

die Diskussion über „${title}“ ...

Der erste Beitrag hebt hervor, dass ...

Im zweiten Beitrag wird die Auffassung vertreten, dass ...

Der dritte Beitrag weist darauf hin, dass ...

Meines Erachtens ...

Zusammenfassend ...

Mit freundlichen Grüßen
[Name]`,
  },
  8: {
    label: "Formelle E-Mail",
    targetWords: 320,
    instruction: (title) => `Schreiben Sie eine formelle E-Mail von circa 320 Wörtern an eine zuständige Institution zum Thema „${title}“. Stellen Sie das Problem differenziert dar, beziehen Sie Gegenargumente ein und formulieren Sie konkrete Empfehlungen.`,
    template: (title) => `Sehr geehrte Damen und Herren,

ich wende mich an Sie bezüglich „${title}“.

Zunächst ist festzustellen, dass ...

Gleichzeitig ist zu berücksichtigen, dass ...

Ein möglicher Einwand besteht darin, dass ...

Aus meiner Sicht wäre es sinnvoll, ...

Zusammenfassend ...

Mit freundlichen Grüßen
[Name]`,
  },
  12: {
    label: "Argumentativer Beitrag",
    targetWords: 330,
    instruction: (title) => `Verfassen Sie einen argumentativen Beitrag von circa 330 Wörtern zum Thema „${title}“. Entwickeln Sie eine klare These, prüfen Sie mindestens ein Gegenargument und stützen Sie Ihre Position mit einem konkreten Beispiel.`,
    template: (title) => `Thema: ${title}

Ausgangspunkt der Diskussion ist ...

Für die Auffassung, dass ..., spricht ...

Dem lässt sich entgegenhalten, dass ...

Ein konkretes Beispiel hierfür ist ...

Meines Erachtens ...

Zusammenfassend ...`,
  },
  16: {
    label: "Zusammenfassung + Bewertung",
    targetWords: 320,
    instruction: (title) => `Fassen Sie die drei Positionen zum Thema „${title}“ knapp zusammen und bewerten Sie anschließend ihre Tragfähigkeit. Schreiben Sie insgesamt circa 320 Wörter und trennen Sie Wiedergabe und eigene Bewertung sprachlich klar.`,
    template: (title) => `Thema: ${title}

Die drei Beiträge setzen unterschiedliche Schwerpunkte.

Der erste Beitrag hebt hervor, dass ...

Im zweiten Beitrag wird die Auffassung vertreten, dass ...

Der dritte Beitrag weist darauf hin, dass ...

Bei der Bewertung dieser Positionen ist entscheidend, dass ...

Besonders überzeugend / nur bedingt überzeugend erscheint ...

Zusammenfassend ...`,
  },
  20: {
    label: "Stellungnahme",
    targetWords: 350,
    instruction: (title) => `Schreiben Sie eine differenzierte Stellungnahme von circa 350 Wörtern zum Thema „${title}“. Formulieren Sie eine eigene Position, wägen Sie Interessen gegeneinander ab und reagieren Sie auf mindestens einen ernstzunehmenden Einwand.`,
    template: (title) => `Thema: ${title}

Dieses Thema ist von großer Bedeutung, weil ...

Zunächst ist festzustellen, dass ...

Andererseits ...

Ein ernstzunehmender Einwand lautet, dass ...

Dieser Einwand greift insofern zu kurz / ist insofern berechtigt, als ...

Meines Erachtens ...

Zusammenfassend ...`,
  },
  24: {
    label: "Synthese mehrerer Positionen",
    targetWords: 350,
    instruction: (title) => `Verfassen Sie eine Synthese von circa 350 Wörtern zum Thema „${title}“. Ordnen Sie die drei Positionen nach Gemeinsamkeiten und Konflikten, statt sie nur nacheinander zusammenzufassen, und entwickeln Sie daraus eine eigene Lösung.`,
    template: (title) => `Thema: ${title}

Die Beiträge unterscheiden sich weniger in der Frage, ob ..., als vielmehr darin, wie ...

Während die erste und die zweite Position darin übereinstimmen, dass ..., setzt die dritte einen anderen Schwerpunkt.

Der zentrale Zielkonflikt besteht zwischen ... und ...

Eine tragfähige Verbindung der Positionen könnte darin bestehen, ...

Meines Erachtens ...

Zusammenfassend ...`,
  },
  28: {
    label: "Prüfungssimulation",
    targetWords: 350,
    instruction: (title) => `Bearbeiten Sie die Schreibaufgabe zu „${title}“ unter Prüfungsbedingungen. Schreiben Sie circa 350 Wörter, entwickeln Sie eine kohärente Argumentation und kontrollieren Sie Register, Evidenz, Rektion, Wortstellung und Kohäsion vor dem Abschluss.`,
    template: (title) => `Thema: ${title}

Einleitung:

Argumentation:

Gegenargument und Reaktion:

Synthese / Schluss:`,
  },
};

export const getC2WritingFormat = (day, title = "[Thema]") => {
  const config = formats[Number(day)] || formats[20];
  return {
    ...config,
    instruction: config.instruction(title),
    template: config.template(title),
  };
};

export const C2_WRITING_DAYS = Object.freeze(Object.keys(formats).map(Number));

export default getC2WritingFormat;
