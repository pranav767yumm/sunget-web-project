// =========================================
// SOLAR WATER HEATING PAGE SCRIPT (src/waterheater.js)
// Tank-size estimator. Tabs are handled by rooftop.js.
// =========================================
(function () {
  const people = document.getElementById("swhPeople");
  const range = document.getElementById("swhPeopleRange");
  const use = document.getElementById("swhUse");
  if (!people || !range || !use) return;

  const TARIFF = 9;            // Rs per unit (approx.)
  const DELTA_T = 30;          // heated from 25C to 55C
  const KWH_PER_LITRE = (DELTA_T * 4.186) / 3600; // ~0.035 kWh per litre
  const SQFT_PER_100L = 28;    // shadow-free roof area per 100 LPD (approx.)
  const SOLAR_FRACTION = 0.8;  // share of heating done by the sun over a year

  const out = {
    lpd: document.getElementById("swhLpd"),
    area: document.getElementById("swhArea"),
    units: document.getElementById("swhUnits"),
    save: document.getElementById("swhSave"),
  };

  function roundSize(litres) {
    // Standard sizes: 100, 150, 200, 300, 500, then steps of 500
    const std = [100, 150, 200, 300, 500];
    for (const s of std) if (litres <= s) return s;
    return Math.ceil(litres / 500) * 500;
  }

  function inr(n) {
    return "\u20b9" + Math.round(n).toLocaleString("en-IN");
  }

  function update() {
    const n = Math.max(1, Number(people.value) || 1);
    const litres = n * Number(use.value);
    const size = roundSize(litres);

    const unitsPerYear = litres * KWH_PER_LITRE * 365 * SOLAR_FRACTION;

    out.lpd.textContent = size.toLocaleString("en-IN") + " L";
    out.area.textContent = Math.round((size / 100) * SQFT_PER_100L) + " sq ft";
    out.units.textContent = Math.round(unitsPerYear).toLocaleString("en-IN");
    out.save.textContent = inr(unitsPerYear * TARIFF);
  }

  people.addEventListener("input", () => {
    range.value = people.value;
    update();
  });
  range.addEventListener("input", () => {
    people.value = range.value;
    update();
  });
  use.addEventListener("change", update);

  update();
})();
