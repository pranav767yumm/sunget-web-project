// =========================================
// ESG PAGE SCRIPT (src/esg.js)
// Scope 2 estimator. Tabs are handled by rooftop.js.
// =========================================
(function () {
  const bill = document.getElementById("esgBill");
  const range = document.getElementById("esgBillRange");
  const share = document.getElementById("esgShare");
  if (!bill || !range || !share) return;

  // ---- Assumptions (edit to match your reporting method) ----
  const TARIFF = 8;             // Rs per unit
  const CO2_PER_UNIT = 0.8;     // kg CO2 per unit of grid electricity (approx.)
  const UNITS_PER_KW_MONTH = 120;
  const KG_CO2_PER_TREE = 21;   // kg CO2 absorbed per tree per year (approx.)

  const out = {
    scope2: document.getElementById("esgScope2"),
    cut: document.getElementById("esgCut"),
    kw: document.getElementById("esgKw"),
    trees: document.getElementById("esgTrees"),
  };

  const fmt = (n) => Math.round(n).toLocaleString("en-IN");

  function update() {
    const monthly = Math.max(0, Number(bill.value) || 0);
    const s = Number(share.value);
    const unitsYear = (monthly / TARIFF) * 12;
    const co2Total = unitsYear * CO2_PER_UNIT;     // kg
    const co2Cut = co2Total * s;
    const kw = Math.max(1, Math.round((monthly / TARIFF) * s / UNITS_PER_KW_MONTH));

    out.scope2.textContent = (co2Total / 1000).toFixed(1) + " tonnes";
    out.cut.textContent = (co2Cut / 1000).toFixed(1) + " tonnes";
    out.kw.textContent = fmt(kw) + " kW";
    out.trees.textContent = fmt(co2Cut / KG_CO2_PER_TREE) + " trees";
  }

  bill.addEventListener("input", () => { range.value = bill.value; update(); });
  range.addEventListener("input", () => { bill.value = range.value; update(); });
  share.addEventListener("change", update);

  update();
})();
