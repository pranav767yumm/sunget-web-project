// =========================================================
// ENQUIRY POPUPS, ONE BY ONE  (src/popup.js)
//
// Shows 3 different popup forms, one after another:
//   1. Heat pump   2. Solar panels (rooftop)   3. Solar water heater
//
// Timing (edit the settings below):
//   - popup 1 appears FIRST_DELAY_SECONDS after the visitor arrives
//   - when it is closed, popup 2 appears GAP_SECONDS later
//   - when that is closed, popup 3 appears GAP_SECONDS later
//
// - Counts only time the tab is visible (pauses when hidden).
// - Time and progress carry across pages in the same visit.
// - Waits if the visitor is typing, or the calculator, hero form
//   or mobile menu is open.
// - Once ANY popup form is submitted (or your hero / contact form),
//   the remaining popups stay hidden for SUBMIT_DAYS.
// - Enquiries are emailed through src/leads.js, so leads.js must be
//   loaded on the page BEFORE this file.
//
// Test it:  SungetPopup.open("heatpump" | "solar" | "water")
// Reset it: SungetPopup.reset()
// =========================================================
// =========================================================
// ENQUIRY POPUPS, ONE BY ONE  (src/popup.js)
// =========================================================
(function () {
  "use strict";

  // ---------- Settings ----------
  var FIRST_DELAY_SECONDS = 10; 
  var GAP_SECONDS = 10; 
  var ROUNDS = 10; 
  var SUBMIT_DAYS = 0; 

  var KEY_ELAPSED = "sg_popup_elapsed"; 
  var KEY_IDX = "sg_popup_idx"; 
  var KEY_NEXT = "sg_popup_next"; 
  var KEY_UNTIL = "sg_popup_until"; 

  var STD = {
    name: { name: "name", label: "Full name", type: "text", placeholder: "Your name", autocomplete: "name" },
    phone: { name: "phone", label: "WhatsApp number", type: "tel", placeholder: "10-digit number", digits: 10, half: true, autocomplete: "tel-national" },
    pin: { name: "pincode", label: "PIN code", type: "text", placeholder: "6-digit PIN", digits: 6, half: true, autocomplete: "postal-code" }
  };

  // ---------- Provide your poster image paths here ----------
  var POPUPS = [
    {
      id: "heatpump",
      product: "Heat pump",
      image: "/images/pages/heater/img/popup.webp", // Add your heat pump poster image URL/path here
      heading: "Get a free heat pump quote",
      sub: "Tell us your hot water need and our team will call you.",
      cta: "Get my heat pump quote",
      thanks: "Thank you! Our team will call you about your heat pump quote shortly.",
      fields: [
        STD.name, STD.phone, STD.pin,
        { name: "use", label: "Where will you use it?", type: "select", placeholder: "Select one",
          options: ["Home or bungalow", "Hotel or hostel", "Hospital or clinic", "Factory or canteen", "Swimming pool"] },
        { name: "current_heating", label: "How do you heat water today?", type: "select", placeholder: "Select one",
          options: ["Electric geyser", "LPG or gas", "Diesel boiler", "Solar water heater", "No hot water system yet"] }
      ]
    },
    {
      id: "solar",
      product: "Solar panels (rooftop)",
      image: "/images/pages/solarpanel/img/popup.webp", // Add your solar rooftop poster image URL/path here
      heading: "Book your free solar consultation",
      sub: "Share a few details and our team will call you.",
      cta: "Book my FREE consultation",
      thanks: "Thank you! Our team will call you about your solar rooftop consultation shortly.",
      fields: [
        STD.name, STD.phone, STD.pin,
        { name: "bill", label: "Monthly electricity bill", type: "select", placeholder: "Select your bill range",
          options: ["Less than ₹1,500", "₹1,500 – ₹2,500", "₹2,500 – ₹4,000", "₹4,000 – ₹8,000", "More than ₹8,000"] },
        { name: "property", label: "Property type", type: "select", placeholder: "Select one",
          options: ["Home or bungalow", "Housing society", "Shop or office", "Factory or warehouse"] }
      ]
    },
    {
      id: "water",
      product: "Solar water heater",
      image: "/images/pages/heatpump/img/popup.webp", // Add your water heater poster image URL/path here
      heading: "Get a free solar water heater quote",
      sub: "Tell us who uses hot water and we will call you.",
      cta: "Get my water heater quote",
      thanks: "Thank you! Our team will call you about your solar water heater quote shortly.",
      fields: [
        STD.name, STD.phone, STD.pin,
        { name: "users", label: "How many people use hot water?", type: "select", placeholder: "Select one",
          options: ["1 – 2 people", "3 – 4 people", "5 – 6 people", "7 or more people", "Hostel, hotel or commercial"] },
        { name: "current_heater", label: "What do you use today?", type: "select", placeholder: "Select one",
          options: ["Electric geyser", "Gas geyser", "Nothing yet"] }
      ]
    }
  ];

  // ---------- Safe storage helpers ----------
  function sGet(store, key) {
    try { return window[store].getItem(key); } catch (e) { return null; }
  }
  function sSet(store, key, val) {
    try { window[store].setItem(key, val); } catch (e) {}
  }
  function sDel(store, key) {
    try { window[store].removeItem(key); } catch (e) {}
  }

  function suppressFor(days) {
    sSet("localStorage", KEY_UNTIL, String(Date.now() + days * 864e5));
  }
  function shownCount() {
    return Number(sGet("sessionStorage", KEY_IDX)) || 0;
  }
  function isSuppressed() {
    var until = Number(sGet("localStorage", KEY_UNTIL)) || 0;
    if (Date.now() < until) return true;
    if (shownCount() >= POPUPS.length * ROUNDS) return true;
    return false;
  }

  // ---------- Helpers ----------
  function esc(t) {
    return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function assetPath(p) {
    if (!p) return "";
    if (/^(https?:)?\/\//i.test(p) || p.charAt(0) === "/" || /^data:/i.test(p)) return p;
    return (location.pathname.indexOf("/pgs/") !== -1 ? "../" : "") + p;
  }
  var privacyHref = location.pathname.indexOf("/pgs/") !== -1 ? "privacy-policy.html" : "pgs/privacy-policy.html";

  // ---------- Fixed shell ----------
  var shell =
    '<div class="tp" id="tpPopup" hidden aria-hidden="true">' +
    '  <div class="tp-overlay" data-tp-close></div>' +
    '  <div class="tp-dialog" role="dialog" aria-modal="true" aria-labelledby="tpTitle" tabindex="-1">' +
    '    <button class="tp-close" type="button" aria-label="Close" data-tp-close>&times;</button>' +
    '    <aside class="tp-promo" id="tpPromo"></aside>' +
    '    <div class="tp-body">' +
    '      <div class="tp-form-wrap" id="tpFormWrap"></div>' +
    '      <div class="tp-done" id="tpDone" role="status" aria-live="polite"></div>' +
    '    </div>' +
    '  </div>' +
    '</div>';

  var root, dialog, form, current = null, lastFocus = null, injected = false, isOpen = false, closeTimer = null;

  function inject() {
    if (injected) return;
    document.body.insertAdjacentHTML("beforeend", shell);
    root = document.getElementById("tpPopup");
    dialog = root.querySelector(".tp-dialog");
    injected = true;

    root.addEventListener("click", function (e) {
      if (e.target.closest("[data-tp-close]")) dismiss();
    });

    root.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        dismiss();
        return;
      }
      if (e.key !== "Tab") return;
      var focusables = dialog.querySelectorAll(
        'button:not([disabled]), input:not([tabindex="-1"]):not([disabled]), select:not([disabled]), a[href]'
      );
      var visible = Array.prototype.filter.call(focusables, function (el) {
        return el.offsetParent !== null;
      });
      if (!visible.length) return;
      var first = visible[0], last = visible[visible.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // ---------- Build field HTML ----------
  function fieldHTML(f) {
    var id = "tpf_" + f.name;
    var req = f.required === false ? "" : " required";
    var control;
    if (f.type === "select") {
      control = '<select id="' + id + '" name="' + esc(f.name) + '"' + req + ">" +
        '<option value="">' + esc(f.placeholder || "Select one") + "</option>" +
        f.options.map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + "</option>"; }).join("") +
        "</select>";
    } else {
      var digits = f.digits
        ? ' inputmode="numeric" pattern="[0-9]{' + f.digits + '}" maxlength="' + f.digits + '" data-digits title="Enter ' + f.digits + ' digits"'
        : "";
      control = '<input id="' + id + '" name="' + esc(f.name) + '" type="' + (f.type || "text") + '"' + req + digits +
        (f.autocomplete ? ' autocomplete="' + f.autocomplete + '"' : "") +
        ' placeholder="' + esc(f.placeholder || "") + '">';
    }
    return '<div class="tp-field"><label for="' + id + '">' + esc(f.label) + "</label>" + control + "</div>";
  }

  function fieldsHTML(fields) {
    var out = "", i = 0;
    while (i < fields.length) {
      if (fields[i].half && fields[i + 1] && fields[i + 1].half) {
        out += '<div class="tp-row">' + fieldHTML(fields[i]) + fieldHTML(fields[i + 1]) + "</div>";
        i += 2;
      } else {
        out += fieldHTML(fields[i]);
        i += 1;
      }
    }
    return out;
  }

function render(p) {
    current = p;
    var promo = document.getElementById("tpPromo");

    // Force left promo container to strip padding and fill height edge-to-edge
    promo.style.padding = "0";
    promo.style.margin = "0";
    promo.style.overflow = "hidden";
    promo.style.display = "flex";
    promo.style.alignItems = "stretch";

    // Display image poster full-bleed on left side
    if (p.image) {
      promo.innerHTML = '<img src="' + assetPath(p.image) + '" alt="' + esc(p.product) + '" style="width:100%; height:100%; object-fit:cover; display:block; vertical-align:middle;">';
    } else {
      promo.innerHTML = '';
    }

    // Right side: the form for this product
    document.getElementById("tpFormWrap").innerHTML =
      '<h3 id="tpTitle">' + esc(p.heading) + "</h3>" +
      '<p class="tp-sub">' + esc(p.sub) + "</p>" +
      '<form class="tp-form" id="tpForm">' + fieldsHTML(p.fields) +
      '<div class="tp-hp" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>' +
      '<button class="tp-submit" type="submit">' + esc(p.cta) + "</button></form>" +
      '<p class="tp-fine">By submitting, you agree to our <a href="' + privacyHref + '" target="_blank" rel="noopener">Privacy Policy</a>.</p>' +
      '<button class="tp-skip" type="button" data-tp-close>No thanks, maybe later</button>';

    document.getElementById("tpDone").innerHTML =
      '<div class="tp-tick" aria-hidden="true">✓</div><h3>Thank you!</h3><p>' + esc(p.thanks) + "</p>";

    dialog.classList.remove("is-done");
    form = document.getElementById("tpForm");
    form.addEventListener("submit", onSubmit);
    Array.prototype.forEach.call(form.querySelectorAll("[data-digits]"), function (el) {
      el.addEventListener("input", function () { el.value = el.value.replace(/\D/g, ""); });
    });
  }

  // ---------- Open / close ----------
  function find(which) {
    if (typeof which === "number") return POPUPS[which];
    for (var i = 0; i < POPUPS.length; i++) if (POPUPS[i].id === which) return POPUPS[i];
    return null;
  }

  function open(which) {
    inject();
    if (isOpen) return;

    var p;
    if (which !== undefined && find(which)) {
      p = find(which);
    } else {
      var idx = shownCount();
      p = POPUPS[idx % POPUPS.length];
      sSet("sessionStorage", KEY_IDX, String(idx + 1));
      nextAt = elapsed + GAP_SECONDS;
      sSet("sessionStorage", KEY_NEXT, String(nextAt));
    }

    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    render(p);
    isOpen = true;
    lastFocus = document.activeElement;

    document.body.appendChild(root);

    if (window.getComputedStyle(root).position !== "fixed") {
      console.warn(
        "SungetPopup: popup.css is not loaded. Add <link rel=\"stylesheet\" href=\"style/popup.css\"> " +
        "(use ../style/popup.css inside /pgs/) to the <head>."
      );
    }

    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    void root.offsetWidth;
    root.classList.add("is-open");

    setTimeout(function () {
      var first = form && form.querySelector("input, select");
      if (first) first.focus();
    }, 120);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    closeTimer = setTimeout(function () {
      root.hidden = true;
      dialog.classList.remove("is-done");
      closeTimer = null;
    }, 300);
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function dismiss() {
    nextAt = elapsed + GAP_SECONDS;
    sSet("sessionStorage", KEY_NEXT, String(nextAt));
    close();
    start();
  }

  // ---------- Sending lead ----------
  function sendLead(data) {
    document.dispatchEvent(new CustomEvent("sunget:lead", { detail: data }));

    var SB_URL = "https://lsfwdoyqxlblvxlxwmbi.supabase.co";
    var SB_KEY = "sb_publishable_CjdM1_XUqYWaPeTxs6AmJA_5qBtSW9u";
    var TYPE = { heatpump: "Heat Pump Enquiry", solar: "Rooftop Solar Enquiry", water: "Solar Water Heater Enquiry" };

    // build the row saved in the admin panel (Enquiries)
    var skip = { product: 1, name: 1, phone: 1, pincode: 1, source: 1, page: 1, submittedAt: 1 };
    var details = [];
    Object.keys(data).forEach(function (k) { if (!skip[k] && data[k]) details.push(k + ": " + data[k]); });
    var row = {
      name: data.name || "",
      phone: data.phone || "",
      city: data.pincode || "",
      requirement: details.join(" | "),
      enquiry_type: TYPE[current && current.id] || "General Enquiry",
      source: data.source || "popup",
      status: "new"
    };

    // save to Supabase (admin panel)
    var saved = fetch(SB_URL + "/rest/v1/enquiries", {
      method: "POST",
      keepalive: true,
      headers: { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(row)
    }).then(function (r) { if (!r.ok) throw new Error("save " + r.status); });

    // optional: also send the email if leads.js is on the page (never blocks success)
    if (window.SungetLeads) {
      try { Promise.resolve(window.SungetLeads.send(data, "Popup – " + data.product)).catch(function () {}); } catch (e) {}
    }
    return saved;
  }

  function onSubmit(e) {
    e.preventDefault();
    var fd = new FormData(form);
    var btn = form.querySelector(".tp-submit");
    var label = btn.textContent;

    if (fd.get("website")) {
      finishSuccess();
      return;
    }

    var data = { product: current.product };
    current.fields.forEach(function (f) { data[f.name] = String(fd.get(f.name) || "").trim(); });
    data.source = "popup-" + current.id;
    data.page = location.pathname;
    data.submittedAt = new Date().toISOString();

    btn.disabled = true;
    btn.textContent = "Sending…";

    sendLead(data)
      .then(finishSuccess)
      .catch(function () {
        btn.disabled = false;
        btn.textContent = "Something went wrong, try again";
        setTimeout(function () { if (btn && !btn.disabled) btn.textContent = label; }, 4000);
      });
  }

  function finishSuccess() {
    suppressFor(SUBMIT_DAYS);
    dialog.classList.add("is-done");
    setTimeout(close, 3200);
  }

  // ---------- Checks ----------
  function isBusy() {
    if (document.querySelector(".calc-modal.active")) return true;
    if (document.querySelector(".hero-form-card.open")) return true;
    if (document.querySelector(".mobile-menu.active")) return true;
    var a = document.activeElement;
    if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && !(root && root.contains(a))) {
      return true;
    }
    return false;
  }

  // ---------- Timer ----------
  var elapsed = Number(sGet("sessionStorage", KEY_ELAPSED)) || 0;
  var nextAt = Number(sGet("sessionStorage", KEY_NEXT)) || FIRST_DELAY_SECONDS;
  var timer = null;

  function tick() {
    if (document.hidden) return;
    elapsed += 1;
    sSet("sessionStorage", KEY_ELAPSED, String(elapsed));

    if (isSuppressed()) {
      stopTimer();
      return;
    }
    if (isOpen) return;
    if (elapsed >= nextAt && !isBusy()) {
      stopTimer();
      open();
    }
  }
  function stopTimer() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  document.addEventListener("submit", function (e) {
    var id = e.target && e.target.id;
    if (id === "heroLeadForm" || id === "leadForm") {
      suppressFor(SUBMIT_DAYS);
      if (!isOpen) stopTimer();
    }
  });

  function start() {
    if (isSuppressed() || timer) return;
    timer = setInterval(tick, 1000);
  }

  // ---------- Public window methods ----------
  window.SungetPopup = {
    open: open,
    close: close,
    reset: function () {
      sDel("sessionStorage", KEY_ELAPSED);
      sDel("sessionStorage", KEY_IDX);
      sDel("sessionStorage", KEY_NEXT);
      sDel("localStorage", KEY_UNTIL);
      elapsed = 0;
      nextAt = FIRST_DELAY_SECONDS;
      stopTimer();
      start();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();