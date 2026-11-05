// =========================================
// SOLAR ROOFTOP PAGE SCRIPT (src/rooftop.js)
// =========================================

// ---------- System type tabs ----------
(function () {
  const tabs = Array.from(document.querySelectorAll(".rt-tab"));
  if (!tabs.length) return;

  function activate(tab) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) {
        panel.classList.toggle("active", on);
        panel.hidden = !on;
      }
    });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => activate(tab));
    // Arrow-key navigation for accessibility
    tab.addEventListener("keydown", (e) => {
      let next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) {
        e.preventDefault();
        next.focus();
        activate(next);
      }
    });
  });
})();

// ---------- Quick size estimator ----------
(function () {
  const bill = document.getElementById("rtBill");
  const range = document.getElementById("rtBillRange");
  if (!bill || !range) return;

  const TARIFF = 9;          // ₹ per unit (approx.)
  const UNITS_PER_KW = 120;  // units generated per kW per month (approx., Pune)
  const SQFT_PER_KW = 100;   // shadow-free roof area per kW

  const out = {
    kw: document.getElementById("rtKw"),
    area: document.getElementById("rtArea"),
    units: document.getElementById("rtUnits"),
    sub: document.getElementById("rtSub"),
  };

  // PM Surya Ghar: ₹30,000 per kW for first 2 kW, +₹18,000 for 3rd kW, max ₹78,000
  function subsidy(kw) {
    const k = Math.floor(kw);
    if (k <= 0) return 0;
    if (k === 1) return 30000;
    if (k === 2) return 60000;
    return 78000;
  }

  function inr(n) {
    return "₹" + n.toLocaleString("en-IN");
  }

  function update(value) {
    const amount = Math.max(0, Number(value) || 0);
    const unitsUsed = amount / TARIFF;
    // Round up to the nearest 0.5 kW, minimum 1 kW
    const kw = Math.max(1, Math.ceil((unitsUsed / UNITS_PER_KW) * 2) / 2);

    out.kw.textContent = kw + " kW";
    out.area.textContent = Math.round(kw * SQFT_PER_KW) + " sq ft";
    out.units.textContent = Math.round(kw * UNITS_PER_KW).toLocaleString("en-IN");
    // Subsidy applies to home systems up to 10 kW
    out.sub.textContent = kw <= 10 ? inr(subsidy(kw)) : "Commercial";
  }

  bill.addEventListener("input", () => {
    range.value = bill.value;
    update(bill.value);
  });
  range.addEventListener("input", () => {
    bill.value = range.value;
    update(range.value);
  });

  update(bill.value);
})();
