/* SunGET: saves website enquiry forms into the admin page (Enquiries).
   Works next to your existing form code (leads.js); it only ADDS a saved copy. */
(function () {
  var C = {
    SUPABASE_URL: "https://lsfwdoyqxlblvxlxwmbi.supabase.co",
    SUPABASE_ANON_KEY: "sb_publishable_CjdM1_XUqYWaPeTxs6AmJA_5qBtSW9u"
  };
  var BILL = { less_1500: "Less than Rs 1500", "1500_2500": "Rs 1500 - 2500", "2500_4000": "Rs 2500 - 4000", "4000_8000": "Rs 4000 - 8000", more_8000: "More than Rs 8000" };
  var PAGE_TYPE = { "solar-rooftop": "Rooftop Solar Enquiry", "solar-epc": "Solar Installation Enquiry", "solar-water-heater": "Solar Water Heater Enquiry", "heat-pump": "Heat Pump Enquiry",
    "solar-utility-products": "Solar Utility Products Enquiry", "o-and-m-repair": "O&M Service Enquiry", "energy-audit": "Energy Audit Enquiry", "csr-and-awareness": "CSR Enquiry" };
  document.addEventListener("submit", function (e) {
    var f = e.target; if (!f || !f.hasAttribute || !f.hasAttribute("data-sg-enquiry")) return;
    var d = {}; new FormData(f).forEach(function (v, k) { if (typeof v === "string" && v.trim()) d[k] = v.trim(); });
    delete d.terms_agree;
    var bill = d.bill ? (BILL[d.bill] || d.bill) : ""; delete d.bill;
    var all = Object.keys(d).map(function (k) { return d[k]; }).join(" ");
    function pick(re) { for (var k in d) if (re.test(k)) { var v = d[k]; delete d[k]; return v; } return ""; }
    var page = (location.pathname.split("/").pop() || "index").replace(/\.html?$/i, "") || "index";
    var type = f.getAttribute("data-sg-type") ||
      (/industr|factory|warehouse/i.test(all) ? "Industrial Solar Enquiry" : /commercial|shop|office|business/i.test(all) ? "Commercial Solar Enquiry" : /residential|home|bungalow|house|society|flat/i.test(all) ? "Residential Solar Enquiry" : "") ||
      PAGE_TYPE[page] || "General Enquiry";
    var row = {
      name: pick(/name/i), phone: pick(/phone|mobile|whats|tel|number/i), email: pick(/mail/i),
      city: pick(/city|location|area|place|pin/i), message: pick(/message|msg|comment|detail|query/i),
      requirement: pick(/requirement|capacity|kw|system|load/i), enquiry_type: type,
      source: page + " form", status: "new"
    };
    if (bill) row.requirement = (row.requirement ? row.requirement + " | " : "") + "Monthly bill: " + bill;
    var rest = Object.keys(d).map(function (k) { return k + ": " + d[k]; }).join(" | "); if (rest) row.extra = rest;
    try {
      fetch(C.SUPABASE_URL + "/rest/v1/enquiries", { method: "POST", keepalive: true,
        headers: { apikey: C.SUPABASE_ANON_KEY, "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(row) });
    } catch (x) {}
  }, true);
})();
