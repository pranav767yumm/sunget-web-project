// =========================================
// O&M REPAIR PAGE SCRIPT (src/om.js)
// Yearly loss estimator. Tabs are handled by rooftop.js.
// =========================================
(function () {
  const kwInput = document.getElementById("omKw");
  const range = document.getElementById("omKwRange");
  const care = document.getElementById("omCare");
  if (!kwInput || !range || !care) return;

  // ---- Assumptions (edit to match your data) ----
  const UNITS_PER_KW_YEAR = 1440; // approx., Pune
  const TARIFF = 8;               // Rs per unit
  const WELL_KEPT_LOSS = 0.02;    // normal wear that cannot be avoided

  const out = {
    gen: document.getElementById("omGen"),
    lost: document.getElementById("omLost"),
    value: document.getElementById("omValue"),
    back: document.getElementById("omBack"),
  };

  function inr(n) {
    if (n >= 10000000) return "\u20b9" + (n / 10000000).toFixed(2) + " Cr";
    if (n >= 100000) return "\u20b9" + (n / 100000).toFixed(1) + " lakh";
    return "\u20b9" + Math.round(n).toLocaleString("en-IN");
  }

  function update() {
    const kw = Math.max(1, Number(kwInput.value) || 1);
    const lossRate = Number(care.value);

    const expected = kw * UNITS_PER_KW_YEAR;
    const lostUnits = expected * lossRate;
    const recoverable = expected * Math.max(0, lossRate - WELL_KEPT_LOSS);

    out.gen.textContent = Math.round(expected).toLocaleString("en-IN") + " units";
    out.lost.textContent = Math.round(lostUnits).toLocaleString("en-IN") + " units";
    out.value.textContent = inr(lostUnits * TARIFF);
    out.back.textContent = inr(recoverable * TARIFF);
  }

  kwInput.addEventListener("input", () => {
    range.value = kwInput.value;
    update();
  });
  range.addEventListener("input", () => {
    kwInput.value = range.value;
    update();
  });
  care.addEventListener("change", update);

  update();
})();
