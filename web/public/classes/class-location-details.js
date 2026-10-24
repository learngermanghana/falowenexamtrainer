(function () {
  const FALLBACK_LOCATION = "Awoshie, Accra, Ghana";
  const FALLBACK_MAPS_URL = "https://maps.app.goo.gl/CPYX7uCj9YSELc1Q9";

  function academyLocation() {
    return window.FalowenClassBrochureData?.academyProfile?.locationLabel
      || window.currentBrochureCourse?.location
      || FALLBACK_LOCATION;
  }

  function mapsUrl() {
    return window.currentBrochureCourse?.mapsUrl
      || window.FalowenClassBrochureData?.academyProfile?.mapsUrl
      || FALLBACK_MAPS_URL;
  }

  function injectStyles() {
    if (document.getElementById("classLocationStyles")) return;
    const style = document.createElement("style");
    style.id = "classLocationStyles";
    style.textContent = `
      .class-location-card {
        padding: 12px;
        gap: 8px;
        border: 1px solid #bfdbfe;
        background: #eff6ff;
        border-radius: 14px;
        display: grid;
      }
      .class-location-card h3 {
        font-size: 15px;
        margin: 0;
      }
      .class-location-card p {
        margin: 0;
        color: #334155;
        font-size: 14px;
        line-height: 1.55;
      }
      .class-location-map {
        width: fit-content;
        color: #1d4ed8;
        font-size: 13px;
        font-weight: 800;
        text-decoration: none;
      }
      .class-location-map:hover { text-decoration: underline; }
      @media (min-width: 900px) {
        #classLocationCard { grid-column: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  function addLocationToMeta() {
    const meta = document.getElementById("blueClassMeta");
    if (!meta) return;
    let span = document.getElementById("classLocationMeta");
    if (!span) {
      span = document.createElement("span");
      span.id = "classLocationMeta";
      meta.appendChild(span);
    }
    span.textContent = `📍 ${academyLocation()}`;
  }

  function addLocationCard() {
    if (document.getElementById("classDecisionSummary")) {
      document.getElementById("classLocationCard")?.remove();
      return;
    }
    const modeCard = document.getElementById("classModeCard");
    const scheduleButton = document.getElementById("classScheduleCta");
    const signupButton = document.getElementById("mainSignupCta");
    const anchor = modeCard || scheduleButton || signupButton;
    if (!anchor) return;

    let card = document.getElementById("classLocationCard");
    if (!card) {
      card = document.createElement("div");
      card.id = "classLocationCard";
      card.className = "class-location-card";
      anchor.insertAdjacentElement(modeCard ? "beforebegin" : "afterend", card);
    }

    card.innerHTML = `
      <h3>Class location</h3>
      <p><strong>${academyLocation()}</strong>. This is a hybrid class, so students may join in person at Awoshie or join online when needed.</p>
      <a class="class-location-map" href="${mapsUrl()}" target="_blank" rel="noreferrer">Open exact location in Google Maps</a>
    `;
  }

  function run() {
    injectStyles();
    addLocationToMeta();
    addLocationCard();
  }

  window.addEventListener("load", run);
  window.addEventListener("falowen:brochure-rendered", run);
  [250, 700, 1400, 2200].forEach((delay) => setTimeout(run, delay));
})();
