// =========================================
// SOLAR EPC PAGE SCRIPT (src/epc.js)
// Plant output estimator. Tabs are handled by rooftop.js.
// =========================================
(function () {
  const kwInput = document.getElementById("epcKw");
  const range = document.getElementById("epcKwRange");
  const type = document.getElementById("epcType");
  if (!kwInput || !range || !type) return;

  // ---- Assumptions (edit to match your data) ----
  const UNITS_PER_KW_YEAR = 1440; // units generated per kW per year (approx., Pune)
  const TARIFF = 8;               // Rs per unit (approx., commercial/industrial)
  const CO2_PER_UNIT = 0.8;       // kg CO2 per unit of grid electricity (approx.)
  const SQFT_PER_KW_ROOF = 100;   // shadow-free roof area per kW
  const ACRES_PER_MW_GROUND = 4.5;

  const out = {
    area: document.getElementById("epcArea"),
    gen: document.getElementById("epcGen"),
    save: document.getElementById("epcSave"),
    co2: document.getElementById("epcCo2"),
  };

  function inr(n) {
    // Show in lakh / crore for readability
    if (n >= 10000000) return "\u20b9" + (n / 10000000).toFixed(2) + " Cr";
    if (n >= 100000) return "\u20b9" + (n / 100000).toFixed(1) + " lakh";
    return "\u20b9" + Math.round(n).toLocaleString("en-IN");
  }

  function update() {
    const kw = Math.max(1, Number(kwInput.value) || 1);
    const units = kw * UNITS_PER_KW_YEAR;

    if (type.value === "ground") {
      out.area.textContent = ((kw / 1000) * ACRES_PER_MW_GROUND).toFixed(2) + " acres";
    } else {
      out.area.textContent = Math.round(kw * SQFT_PER_KW_ROOF).toLocaleString("en-IN") + " sq ft";
    }

    out.gen.textContent = Math.round(units).toLocaleString("en-IN");
    out.save.textContent = inr(units * TARIFF);
    out.co2.textContent = Math.round((units * CO2_PER_UNIT) / 1000).toLocaleString("en-IN") + " tonnes";
  }

  kwInput.addEventListener("input", () => {
    range.value = kwInput.value;
    update();
  });
  range.addEventListener("input", () => {
    kwInput.value = range.value;
    update();
  });
  type.addEventListener("change", update);

  update();
})();
