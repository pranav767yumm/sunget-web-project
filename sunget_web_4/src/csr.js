// =========================================
// CSR & AWARENESS PAGE SCRIPT (src/csr.js)
// Impact estimator. Tabs are handled by rooftop.js.
// =========================================
(function () {
  const kwInput = document.getElementById("csrKw");
  const range = document.getElementById("csrKwRange");
  if (!kwInput || !range) return;

  // ---- Assumptions (edit to match your reporting method) ----
  const UNITS_PER_KW_YEAR = 1440; // units generated per kW per year (approx., Pune)
  const CO2_PER_UNIT = 0.8;       // kg CO2 per unit of grid electricity (approx.)
  const HOME_UNITS_YEAR = 1200;   // average home electricity use per year
  const KG_CO2_PER_TREE = 21;     // kg CO2 absorbed by one tree per year (approx.)

  const out = {
    units: document.getElementById("csrUnits"),
    co2: document.getElementById("csrCo2"),
    homes: document.getElementById("csrHomes"),
    trees: document.getElementById("csrTrees"),
  };

  const fmt = (n) => Math.round(n).toLocaleString("en-IN");

  function update() {
    const kw = Math.max(1, Number(kwInput.value) || 1);
    const units = kw * UNITS_PER_KW_YEAR;
    const co2Kg = units * CO2_PER_UNIT;

    out.units.textContent = fmt(units) + " units";
    out.co2.textContent = (co2Kg / 1000).toFixed(1) + " tonnes";
    out.homes.textContent = fmt(units / HOME_UNITS_YEAR) + " homes";
    out.trees.textContent = fmt(co2Kg / KG_CO2_PER_TREE) + " trees";
  }

  kwInput.addEventListener("input", () => {
    range.value = kwInput.value;
    update();
  });
  range.addEventListener("input", () => {
    kwInput.value = range.value;
    update();
  });

  update();
})();
