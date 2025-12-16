const SPEAKING_FORMATS = {
  A1: [
    { id: "a1_vorstellung", label: "Teil 1 – Vorstellung" },
    { id: "a1_fragen", label: "Teil 2 – Fragen" },
    { id: "a1_planen", label: "Teil 3 – Bitten / Planen" },
  ],
  A2: [
    { id: "a2_vorstellung", label: "Teil 1 – Vorstellung" },
    { id: "a2_fragen", label: "Teil 2 – Fragen" },
    { id: "a2_planen", label: "Teil 3 – Bitten / Planen" },
  ],
  B1: [
    { id: "b1_praesentation", label: "Teil 1 – Präsentation" },
    { id: "b1_diskussion", label: "Teil 2 – Diskussion / Fragen" },
    { id: "b1_planung", label: "Teil 3 – Gemeinsame Planung" },
  ],
  B2: [
    { id: "b2_praesentation", label: "Teil 1 – Präsentation mit Stellungnahme" },
    { id: "b2_diskussion", label: "Teil 2 – Diskussion / Streitgespräch" },
    { id: "b2_verhandlung", label: "Teil 3 – Verhandeln / Planung auf B2" },
  ],
};

const ALLOWED_LEVELS = Object.keys(SPEAKING_FORMATS);

function getAllowedTeile(level) {
  return (SPEAKING_FORMATS[level] || []).map((format) => format.label);
}

module.exports = {
  SPEAKING_FORMATS,
  ALLOWED_LEVELS,
  getAllowedTeile,
};
