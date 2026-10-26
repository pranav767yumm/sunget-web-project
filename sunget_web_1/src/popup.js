// =========================================================
// TIMED ENQUIRY POPUP  (src/popup.js)
// Opens a short enquiry form after the visitor has spent
// 90 seconds on the site.
//
// - Counts only time the tab is visible (pauses when hidden).
// - Time carries across pages in the same visit, so moving
//   between index.html and pgs/*.html does not restart it.
// - Waits if the visitor is typing, or the calculator, hero
//   form popup or mobile menu is open.
// - If the visitor closes it without submitting, it comes
//   back after another REPEAT_SECONDS on the site, up to
//   MAX_SHOWS times per visit (0 = no limit).
// - Once a form is submitted (here or in any site form),
//   it stays away for SUBMIT_DAYS.
//
// Test it:  open the console and run  SungetPopup.open()
// Reset it: SungetPopup.reset()
// =========================================================
(function () {
  "use strict";

  // ---------- Settings ----------
  var DELAY_SECONDS = 5; // first appearance: 1.5 minutes on the site
  var REPEAT_SECONDS = 30; // after it is closed, show again after this many more seconds
  var MAX_SHOWS = 100; // most times it can appear in one visit (0 = no limit)
  var SUBMIT_DAYS = 0; // stay hidden this long after a form is submitted

  var KEY_ELAPSED = "sg_popup_elapsed"; // sessionStorage: seconds spent this visit
  var KEY_COUNT = "sg_popup_count"; // sessionStorage: times shown this visit
  var KEY_NEXT = "sg_popup_next"; // sessionStorage: elapsed seconds at which to show next
  var KEY_UNTIL = "sg_popup_until"; // localStorage: do not show before this time

  // ---------- Safe storage helpers (private mode can throw) ----------
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
    return Number(sGet("sessionStorage", KEY_COUNT)) || 0;
  }
  function isSuppressed() {
    var until = Number(sGet("localStorage", KEY_UNTIL)) || 0;
    if (Date.now() < until) return true; // already submitted recently
    if (MAX_SHOWS > 0 && shownCount() >= MAX_SHOWS) return true; // shown enough this visit
    return false;
  }

  // ---------- Page-aware link (works from / and from /pgs/) ----------
  var privacyHref = location.pathname.indexOf("/pgs/") !== -1
    ? "privacy-policy.html"
    : "pgs/privacy-policy.html";

  // ---------- Markup ----------
  var html =
    '<div class="tp" id="tpPopup" hidden aria-hidden="true">' +
    '  <div class="tp-overlay" data-tp-close></div>' +
    '  <div class="tp-dialog" role="dialog" aria-modal="true" aria-labelledby="tpTitle" tabindex="-1">' +
    '    <button class="tp-close" type="button" aria-label="Close" data-tp-close>&times;</button>' +
    '    <aside class="tp-promo">' +
    '      <span class="tp-eyebrow">Free consultation</span>' +
    '      <h2 id="tpTitle">Save up to <em>₹78,000</em> with solar subsidy</h2>' +
    '      <ul class="tp-points">' +
    '        <li>Free site survey in Pune</li>' +
    '        <li>Subsidy and net-metering paperwork handled by us</li>' +
    '        <li>Easy EMI options</li>' +
    '      </ul>' +
    '    </aside>' +
    '    <div class="tp-body">' +
    '      <div class="tp-form-wrap">' +
    '        <h3>Get your free solar quote</h3>' +
    '        <p class="tp-sub">Share a few details and our team will call you.</p>' +
    '        <form class="tp-form" id="tpForm">' +
    '          <div class="tp-field">' +
    '            <label for="tpName">Full name</label>' +
    '            <input id="tpName" name="name" type="text" required autocomplete="name" placeholder="Your name">' +
    '          </div>' +
    '          <div class="tp-row">' +
    '            <div class="tp-field">' +
    '              <label for="tpPhone">WhatsApp number</label>' +
    '              <input id="tpPhone" name="phone" type="tel" required inputmode="numeric" autocomplete="tel-national"' +
    '                     pattern="[0-9]{10}" maxlength="10" placeholder="10-digit number" title="Enter a 10-digit mobile number">' +
    '            </div>' +
    '            <div class="tp-field">' +
    '              <label for="tpPin">PIN code</label>' +
    '              <input id="tpPin" name="pincode" type="text" required inputmode="numeric" autocomplete="postal-code"' +
    '                     pattern="[0-9]{6}" maxlength="6" placeholder="6-digit PIN" title="Enter a 6-digit PIN code">' +
    '            </div>' +
    '          </div>' +
    '          <div class="tp-field">' +
    '            <label for="tpBill">Monthly electricity bill</label>' +
    '            <select id="tpBill" name="bill" required>' +
    '              <option value="">Select your bill range</option>' +
    '              <option value="less_1500">Less than ₹1,500</option>' +
    '              <option value="1500_2500">₹1,500 – ₹2,500</option>' +
    '              <option value="2500_4000">₹2,500 – ₹4,000</option>' +
    '              <option value="4000_8000">₹4,000 – ₹8,000</option>' +
    '              <option value="more_8000">More than ₹8,000</option>' +
    '            </select>' +
    '          </div>' +
    '          <div class="tp-hp" aria-hidden="true">' +
    '            <label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label>' +
    '          </div>' +
    '          <button class="tp-submit" type="submit">Book my FREE consultation</button>' +
    '        </form>' +
    '        <p class="tp-fine">By submitting, you agree to our <a href="' + privacyHref + '" target="_blank" rel="noopener">Privacy Policy</a>.</p>' +
    '        <button class="tp-skip" type="button" data-tp-close>No thanks, maybe later</button>' +
    '      </div>' +
    '      <div class="tp-done" role="status" aria-live="polite">' +
    '        <div class="tp-tick" aria-hidden="true">✓</div>' +
    '        <h3>Thank you!</h3>' +
    '        <p>Your request has been received. Our team will contact you shortly.</p>' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '</div>';

  var root, dialog, form, lastFocus = null, injected = false, isOpen = false;

  function inject() {
    if (injected) return;
    document.body.insertAdjacentHTML("beforeend", html);
    root = document.getElementById("tpPopup");
    dialog = root.querySelector(".tp-dialog");
    form = document.getElementById("tpForm");
    injected = true;

    // Close buttons / overlay
    root.addEventListener("click", function (e) {
      if (e.target.closest("[data-tp-close]")) dismiss();
    });

    // Keyboard: Escape closes, Tab stays inside the dialog
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

    // Only digits in phone / PIN
    ["tpPhone", "tpPin"].forEach(function (id) {
      var el = document.getElementById(id);
      el.addEventListener("input", function () {
        el.value = el.value.replace(/\D/g, "");
      });
    });

    form.addEventListener("submit", onSubmit);
  }

  // ---------- Open / close ----------
  function open() {
    inject();
    if (isOpen) return;
    isOpen = true;
    sSet("sessionStorage", KEY_COUNT, String(shownCount() + 1));
    lastFocus = document.activeElement;

    // Make sure the popup is the LAST element in <body>, so it wins any stacking tie
    document.body.appendChild(root);

    // Helpful warning if popup.css was not loaded (wrong path or not linked)
    if (window.getComputedStyle(root).position !== "fixed") {
      console.warn(
        "SungetPopup: popup.css is not loaded. Add <link rel=\"stylesheet\" href=\"style/popup.css\"> " +
        "(use ../style/popup.css inside /pgs/) to the <head>."
      );
    }

    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    void root.offsetWidth; // force reflow so the transition runs
    root.classList.add("is-open");

    setTimeout(function () {
      var first = document.getElementById("tpName");
      if (first) first.focus();
    }, 120);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(function () {
      root.hidden = true;
      dialog.classList.remove("is-done");
    }, 300);
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  // Closed without submitting: schedule the next appearance
  function dismiss() {
    nextAt = elapsed + REPEAT_SECONDS;
    sSet("sessionStorage", KEY_NEXT, String(nextAt));
    close();
    start();
  }

  // ---------- Lead handling ----------
  // The site's other forms currently only show a toast and do not send data.
  // Connect your real backend inside sendLead (Formspree, Google Sheets
  // Apps Script, your own API, etc.). It must return a Promise.
  function sendLead(data) {
    // Example:
    // return fetch("https://YOUR-ENDPOINT", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data)
    // });
    document.dispatchEvent(new CustomEvent("sunget:lead", { detail: data }));
    return Promise.resolve();
  }

  function onSubmit(e) {
    e.preventDefault();
    var fd = new FormData(form);
    var btn = form.querySelector(".tp-submit");

    // Honeypot filled in = bot. Pretend success, send nothing.
    if (fd.get("website")) {
      finishSuccess();
      return;
    }

    var data = {
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      pincode: String(fd.get("pincode") || "").trim(),
      bill: String(fd.get("bill") || ""),
      source: "timed-popup",
      page: location.pathname,
      submittedAt: new Date().toISOString()
    };

    btn.disabled = true;
    btn.textContent = "Sending…";

    sendLead(data)
      .then(finishSuccess)
      .catch(function () {
        btn.disabled = false;
        btn.textContent = "Something went wrong, try again";
      });
  }

  function finishSuccess() {
    suppressFor(SUBMIT_DAYS);
    dialog.classList.add("is-done");
    setTimeout(close, 3200);
  }

  // ---------- When is it OK to interrupt? ----------
  function isBusy() {
    if (document.querySelector(".calc-modal.active")) return true; // calculator open
    if (document.querySelector(".hero-form-card.open")) return true; // mobile hero form open
    if (document.querySelector(".mobile-menu.active")) return true; // nav menu open
    var a = document.activeElement;
    if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && !(root && root.contains(a))) {
      return true; // visitor is typing in a form
    }
    return false;
  }

  // ---------- Timer ----------
  var elapsed = Number(sGet("sessionStorage", KEY_ELAPSED)) || 0;
  var nextAt = Number(sGet("sessionStorage", KEY_NEXT)) || DELAY_SECONDS;
  var timer = null;

  function tick() {
    if (document.hidden) return; // pause while the tab is in the background
    elapsed += 1;
    sSet("sessionStorage", KEY_ELAPSED, String(elapsed));

    if (isSuppressed()) {
      stopTimer();
      return;
    }
    if (elapsed >= nextAt && !isBusy()) {
      stopTimer();
      open();
    }
  }
  function stopTimer() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  // A submission through any other form on the site also stops the popup.
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

  // ---------- Public helpers for testing ----------
  window.SungetPopup = {
    open: open,
    close: close,
    reset: function () {
      sDel("sessionStorage", KEY_ELAPSED);
      sDel("sessionStorage", KEY_COUNT);
      sDel("sessionStorage", KEY_NEXT);
      sDel("localStorage", KEY_UNTIL);
      elapsed = 0;
      nextAt = DELAY_SECONDS;
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
