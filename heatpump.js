// =========================================
// HEAT PUMP PAGE SCRIPT (src/heatpump.js)
// Running-cost estimator. Tabs are handled by rooftop.js.
// =========================================
(function () {
  const lpd = document.getElementById("hpLpd");
  const range = document.getElementById("hpLpdRange");
  const fuel = document.getElementById("hpFuel");
  if (!lpd || !range || !fuel) return;

  // ---- Assumptions (edit these to match current prices) ----
  const TARIFF = 9;             // Rs per electricity unit
  const LPG_PRICE = 70;         // Rs per kg
  const DIESEL_PRICE = 90;      // Rs per litre
  const COP = 3.5;              // heat pump efficiency
  const DELTA_T = 30;           // 25C to 55C
  const KWH_PER_LITRE = (DELTA_T * 4.186) / 3600; // ~0.035 kWh of heat per litre
  const HEAT_HOURS = 8;         // hours the heat pump runs per day

  // Useful heat delivered per unit of fuel
  const USEFUL_KWH = {
    electric: 0.95,             // per kWh of electricity
    lpg: 8.3,                   // per kg of LPG
    diesel: 8.0,                // per litre of diesel
  };
  const PRICE = {
    electric: TARIFF,
    lpg: LPG_PRICE,
    diesel: DIESEL_PRICE,
  };

  const out = {
    now: document.getElementById("hpNow"),
    next: document.getElementById("hpNew"),
    save: document.getElementById("hpSave"),
    kw: document.getElementById("hpKw"),
  };

  function inr(n) {
    return "\u20b9" + Math.round(n).toLocaleString("en-IN");
  }

  function update() {
    const litres = Math.max(0, Number(lpd.value) || 0);
    const type = fuel.value;

    const heatPerDay = litres * KWH_PER_LITRE;         // kWh of heat needed
    const heatPerYear = heatPerDay * 365;

    const costNow = (heatPerYear / USEFUL_KWH[type]) * PRICE[type];
    const costHP = (heatPerYear / COP) * TARIFF;
    const saving = Math.max(0, costNow - costHP);

    // Approx. heating capacity needed, rounded up to the nearest 0.5 kW, min 1 kW
    const kw = Math.max(1, Math.ceil((heatPerDay / HEAT_HOURS) * 2) / 2);

    out.now.textContent = inr(costNow);
    out.next.textContent = inr(costHP);
    out.save.textContent = inr(saving);
    out.kw.textContent = kw + " kW";
  }

  lpd.addEventListener("input", () => {
    range.value = lpd.value;
    update();
  });
  range.addEventListener("input", () => {
    lpd.value = range.value;
    update();
  });
  fuel.addEventListener("change", update);

  update();
})();
