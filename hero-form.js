// =========================================================
// HERO ENQUIRY FORM  (src/hero-form.js)
// - Validates: WhatsApp = exactly 10 digits, PIN = exactly 6 digits
// - Saves the enquiry to Supabase (admin panel > Enquiries)
// - Shows "success" only when the save really worked, and an
//   error message only when it really failed
// - Empties the form after a successful send
// - "Use my location" button fills the PIN code automatically
// Load AFTER script.js:  <script src="src/hero-form.js"></script>
// =========================================================
(function () {
  "use strict";

  var SB_URL = "https://lsfwdoyqxlblvxlxwmbi.supabase.co";
  var SB_KEY = "sb_publishable_CjdM1_XUqYWaPeTxs6AmJA_5qBtSW9u";

  var BILL = {
    less_1500: "Less than Rs 1500",
    "1500_2500": "Rs 1500 - 2500",
    "2500_4000": "Rs 2500 - 4000",
    "4000_8000": "Rs 4000 - 8000",
    more_8000: "More than Rs 8000"
  };

  var form = document.getElementById("heroLeadForm");
  if (!form) return;

  var phone = form.elements.whatsapp;
  var pin = form.elements.pincode;
  var msg = document.getElementById("heroFormMsg");
  var btn = form.querySelector('button[type="submit"]');
  var fetchBtn = document.getElementById("pinFetchBtn");
  var sending = false;

  // ---------- number-only inputs ----------
  function digitsOnly(el, max) {
    el.addEventListener("input", function () {
      var v = el.value.replace(/\D/g, "").slice(0, max);
      if (el.value !== v) el.value = v;
    });
  }
  digitsOnly(phone, 10);
  digitsOnly(pin, 6);

  // ---------- message helper ----------
  function say(text, type) {
    if (!msg) return;
    msg.textContent = text || "";
    msg.className = "hero-form-msg" + (type ? " " + type : "");
  }

  // ---------- fetch PIN from the visitor's location ----------
  if (fetchBtn) {
    var fetchLabel = fetchBtn.textContent;

    fetchBtn.addEventListener("click", function () {
      if (!navigator.geolocation) {
        say("Your browser cannot detect location. Please type your PIN code.", "err");
        return;
      }
      fetchBtn.disabled = true;
      fetchBtn.textContent = "Detecting location…";
      say("");

      function done() {
        fetchBtn.disabled = false;
        fetchBtn.textContent = fetchLabel;
      }

      navigator.geolocation.getCurrentPosition(
        function (pos) {
          var url =
            "https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18" +
            "&lat=" + encodeURIComponent(pos.coords.latitude) +
            "&lon=" + encodeURIComponent(pos.coords.longitude);

          fetch(url, { headers: { "Accept-Language": "en" } })
            .then(function (r) {
              if (!r.ok) throw new Error("geo " + r.status);
              return r.json();
            })
            .then(function (data) {
              var code = String((data.address && data.address.postcode) || "").replace(/\D/g, "");
              if (code.length === 6) {
                pin.value = code;
                say("PIN code " + code + " filled from your location.", "ok");
              } else {
                say("Could not find a PIN code for your location. Please type it.", "err");
              }
            })
            .catch(function () {
              say("Could not fetch your PIN code. Please type it.", "err");
            })
            .then(done);
        },
        function (err) {
          if (err && err.code === 1) {
            say("Location permission was blocked. Allow it in the browser, or type your PIN code.", "err");
          } else {
            say("Could not detect your location. Please type your PIN code.", "err");
          }
          done();
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      );
    });
  }

  // ---------- submit ----------
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (sending) return;

    var name = form.elements.name.value.trim();
    var wa = phone.value.replace(/\D/g, "");
    var email = (form.elements.Email.value || "").trim();
    var pc = pin.value.replace(/\D/g, "");
    var billEl = form.querySelector('input[name="bill"]:checked');
    var terms = form.elements.terms_agree;

    if (!name) { form.elements.name.focus(); return say("Please enter your full name.", "err"); }
    if (!/^\d{10}$/.test(wa)) { phone.focus(); return say("WhatsApp number must be exactly 10 digits.", "err"); }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { form.elements.Email.focus(); return say("Please enter a valid email address.", "err"); }
    if (!/^\d{6}$/.test(pc)) { pin.focus(); return say("PIN code must be exactly 6 digits.", "err"); }
    if (!billEl) return say("Please select your monthly electricity bill.", "err");
    if (terms && !terms.checked) return say("Please accept the Terms & Privacy Policy.", "err");

    var row = {
      name: name,
      phone: wa,
      email: email,
      city: pc,
      requirement: "Monthly bill: " + (BILL[billEl.value] || billEl.value),
      enquiry_type: "Rooftop Solar Enquiry",
      source: "index hero form",
      status: "new"
    };

    sending = true;
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Sending…";
    say("");

    fetch(SB_URL + "/rest/v1/enquiries", {
      method: "POST",
      headers: {
        apikey: SB_KEY,
        Authorization: "Bearer " + SB_KEY,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(row)
    })
      .then(function (r) {
        if (!r.ok) throw new Error("save " + r.status);
        // success: empty the form completely
        form.reset();
        say("✓ Thank you! Your details were sent successfully. Our team will call you shortly.", "ok");
        // on mobile the form is a popup: close it after a moment
        setTimeout(function () {
          var close = document.getElementById("closeHeroForm");
          var card = document.getElementById("heroFormCard");
          if (close && card && card.classList.contains("open")) close.click();
        }, 2500);
        setTimeout(function () { say(""); }, 8000);
      })
      .catch(function (err) {
        console.error("Hero form error:", err);
        say("There is some issue sending your details. Please try again, or call +91 98818 55770.", "err");
      })
      .then(function () {
        sending = false;
        btn.disabled = false;
        btn.textContent = label;
      });
  });
})();