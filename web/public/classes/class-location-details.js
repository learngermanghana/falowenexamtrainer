(function () {
  const LOCATION_TEXT = "Ghana, Accra - Awoshie";

  function injectStyles() {
    if (document.getElementById("classLocationStyles")) return;
    const style = document.createElement("style");
    style.id = "classLocationStyles";
    style.textContent = `
      .class-location-card {
        padding: 12px;
        gap: 6px;
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
      @media (min-width: 900px) {
        #classLocationCard { grid-column: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  function addLocationToMeta() {
    const meta = document.getElementById("blueClassMeta");
    if (!meta || meta.dataset.locationAdded === "true") return;
    const span = document.createElement("span");
    span.textContent = `📍 ${LOCATION_TEXT}`;
    meta.appendChild(span);
    meta.dataset.locationAdded = "true";
  }

  function addLocationCard() {
    if (document.getElementById("classLocationCard")) return;
    const modeCard = document.getElementById("classModeCard");
    const scheduleButton = document.getElementById("classScheduleCta");
    const signupButton = document.getElementById("mainSignupCta");
    const anchor = modeCard || scheduleButton || signupButton;
    if (!anchor) return;

    const card = document.createElement("div");
    card.id = "classLocationCard";
    card.className = "class-location-card";
    card.innerHTML = `
      <h3>Class location</h3>
      <p><strong>${LOCATION_TEXT}</strong>. This is a hybrid class, so students may join in person at Awoshie or join online when needed.</p>
    `;
    anchor.insertAdjacentElement(modeCard ? "beforebegin" : "afterend", card);
  }

  function run() {
    injectStyles();
    addLocationToMeta();
    addLocationCard();
  }

  window.addEventListener("load", run);
  [250, 700, 1400, 2200].forEach((delay) => setTimeout(run, delay));
})();
