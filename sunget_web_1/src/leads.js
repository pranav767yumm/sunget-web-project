// =========================================================
// LEAD EMAIL SENDER  (src/leads.js)
// Sends every enquiry form on the site to your email inbox.
// Used by: hero form, contact form, and the timed popup.
//
// Uses FormSubmit (formsubmit.co): free, no account, no server.
// ONE-TIME SETUP: the first time any form is submitted, FormSubmit
// emails an "Activate Form" link to the address below. Click it once.
// After that, every enquiry arrives in your inbox.
// =========================================================
(function () {
  "use strict";

  // ---------- SETTINGS: change these ----------
  var CONFIG = {
    // Inbox that should receive the enquiries
    email: "atharvagavali788@gmail.com",

    // OPTIONAL: after activation, FormSubmit gives you a private ID-based
    // URL (https://formsubmit.co/ajax/xxxxxxxx...). Paste it here to keep
    // your email address out of the page source and reduce spam.
    endpoint: "",

    // Start of the email subject line
    subjectPrefix: "New website enquiry"
  };

  // Readable names for the bill ranges used in your forms
  var BILL_LABELS = {
    less_1500: "Less than ₹1,500",
    "1500_2500": "₹1,500 – ₹2,500",
    "2500_4000": "₹2,500 – ₹4,000",
    "4000_8000": "₹4,000 – ₹8,000",
    more_8000: "More than ₹8,000"
  };

  function url() {
    return CONFIG.endpoint || "https://formsubmit.co/ajax/" + encodeURIComponent(CONFIG.email);
  }

  // Turn a <form> into a plain object (skips honeypot and empty values)
  function formToObject(form) {
    var out = {};
    new FormData(form).forEach(function (value, key) {
      if (key === "website" || key === "_honey") return; // spam traps
      value = String(value).trim();
      if (!value) return;
      out[key] = out[key] !== undefined ? out[key] + ", " + value : value;
    });
    return out;
  }

  // data: object of fields, label: where it came from (shown in the subject)
  function send(data, label) {
    var payload = {};
    Object.keys(data || {}).forEach(function (k) {
      payload[k] = data[k];
    });

    if (payload.bill && BILL_LABELS[payload.bill]) payload.bill = BILL_LABELS[payload.bill];
    if (payload.terms_agree) payload.terms_agree = "Agreed";

    payload.form = label || "Website form";
    payload.page = location.href;
    payload.submitted_at = new Date().toLocaleString("en-IN");

    // FormSubmit options (start with an underscore)
    var who = payload.name || payload.Name || "";
    payload._subject = CONFIG.subjectPrefix + " – " + payload.form + (who ? " – " + who : "");
    payload._template = "table";
    payload._captcha = "false";
    payload._honey = "";
    var replyTo = payload.email || payload.Email;
    if (replyTo) payload._replyto = replyTo;

    return fetch(url(), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed (" + res.status + ")");
        return res.json();
      })
      .then(function (json) {
        if (json && (json.success === false || json.success === "false")) {
          throw new Error(json.message || "FormSubmit rejected the request");
        }
        return json;
      });
  }

  window.SungetLeads = { send: send, formToObject: formToObject, config: CONFIG };
})();
