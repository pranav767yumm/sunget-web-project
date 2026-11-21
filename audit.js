// =========================================
// ENERGY AUDIT PAGE SCRIPT (src/audit.js)
// Savings estimator. Tabs are handled by rooftop.js.
// =========================================
(function () {
  const bill = document.getElementById("audBill");
  const range = document.getElementById("audBillRange");
  const type = document.getElementById("audType");
  if (!bill || !range || !type) return;

  // ---- Assumptions (edit to match your experience) ----
  // Typical share of the bill that audits identify as savings [low, high]
  const SAVING_RANGE = {
    industry: [0.06, 0.12],
    commercial: [0.08, 0.15],
    institution: [0.05, 0.10],
  };
  const TARIFF = 8;            // Rs per unit
  const UNITS_PER_KW_MONTH = 120;
  const SOLAR_SHARE = 0.7;     // portion of use offset by solar

  const out = {
    year: document.getElementById("audYear"),
    save: document.getElementById("audSave"),
    kw: document.getElementById("audKw"),
    solar: document.getElementById("audSolar"),
  };

  function inr(n) {
    if (n >= 10000000) return "\u20b9" + (n / 10000000).toFixed(2) + " Cr";
    if (n >= 100000) return "\u20b9" + (n / 100000).toFixed(1) + " lakh";
    return "\u20b9" + Math.round(n).toLocaleString("en-IN");
  }

  function update() {
    const monthly = Math.max(0, Number(bill.value) || 0);
    const yearly = monthly * 12;
    const [lo, hi] = SAVING_RANGE[type.value];

    const unitsPerMonth = monthly / TARIFF;
    const kw = Math.max(1, Math.round((unitsPerMonth * SOLAR_SHARE) / UNITS_PER_KW_MONTH));
    const solarSave = unitsPerMonth * SOLAR_SHARE * TARIFF * 12;

    out.year.textContent = inr(yearly);
    out.save.textContent = inr(yearly * lo) + " – " + inr(yearly * hi);
    out.kw.textContent = kw.toLocaleString("en-IN") + " kW";
    out.solar.textContent = inr(solarSave);
  }

  bill.addEventListener("input", () => {
    range.value = bill.value;
    update();
  });
  range.addEventListener("input", () => {
    bill.value = range.value;
    update();
  });
  type.addEventListener("change", update);

  update();
})();
