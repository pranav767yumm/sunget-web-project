// =========================================
// GLOBAL SOLAR CALCULATOR INJECTION & LOGIC
// =========================================

(function () {
  "use strict";

  let isCalculatorInjected = false;

  // Background images for Residential vs. Commercial
  const BG_IMAGES = {
    residential: "url('images/calc-residential.jpg')", // Update path to your residential background image
    commercial: "url('images/calc-commercial.jpg')"   // Update path to your commercial background image
  };

  const CONFIG = {
    whatsappNumber: "919881855770",
    gstRate: 0,
    slabs: [
      { maxUnits: 150, kw: 1 },
      { maxUnits: 250, kw: 2 }
    ],
    aboveSlabs: {
      baseKw: 3,
      unitsPerExtraKw: 100
    },
    fixedPrices: {
      1: 120000,
      2: 160000
    },
    pricePerKw: 70000,
    subsidy: {
      1: 30000,
      2: 60000,
      max: 78000
    }
  };

  // Popup modal HTML structure
  const modalHTML = `
  <div class="calc-modal" id="calcModal">
    <div class="calc-modal-overlay" id="calcModalOverlay"></div>
    <div class="calc-modal-content">
      <button class="calc-close" id="calcCloseBtn" aria-label="Close Calculator">&times;</button>
      
      <div class="calc-layout">
        <!-- Left Side: Calculator Form -->
        <div class="calc-card">
          <h2 style="font-size: 24px; margin-bottom: 8px; color: var(--ink);">Solar Savings Calculator</h2>
          <p style="color: var(--muted); font-size: 14px; margin: 0 0 20px 0; line-height: 1.6;">
            Find the right rooftop solar system size, indicative cost & PM Surya Ghar subsidy for your setup.
          </p>
          
          <form id="calcForm" class="calc-form">
            <label style="display: block; font-weight: 600; margin-bottom: 8px;">Connection Category</label>
            <div class="type-selector" id="typeSelector" style="display: flex; gap: 8px; margin-bottom: 16px; background: #f1f6f2; padding: 4px; border-radius: 12px; border: 1px solid var(--line);">
              <button type="button" class="type-btn active" data-type="residential" style="flex: 1; padding: 10px; border: none; background: #ffffff; color: var(--green); border-radius: 8px; font-weight: 700; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.06);">Residential</button>
              <button type="button" class="type-btn" data-type="commercial" style="flex: 1; padding: 10px; border: none; background: transparent; color: var(--muted); border-radius: 8px; font-weight: 600; cursor: pointer;">Commercial</button>
            </div>

            <label for="calcMonthlyUnits" style="display: block; font-weight: 600; margin-bottom: 8px;">Monthly electricity units consumed (kWh)</label>
            <input type="number" id="calcMonthlyUnits" inputmode="numeric" min="1" step="1" placeholder="e.g. 200" required style="width: 100%; font-size: 1.1rem; padding: 12px 14px; border: 2px solid var(--line); border-radius: 12px; outline: none;">
            <small style="color: var(--muted); font-size: 12px; margin-top: 4px; display: block;">Find this number on your monthly electricity bill.</small>

            <div id="calcError" style="display: none; margin-top: 10px; padding: 10px 12px; border-radius: 10px; background: #fdecea; color: #b3261e; font-size: 0.9rem;"></div>

            <div style="display: flex; gap: 10px; margin-top: 20px;">
              <button type="submit" class="btn full" style="flex: 2; margin: 0;">Calculate Solar Estimate &rarr;</button>
              <button type="button" id="calcResetBtn" class="btn light" style="flex: 1; margin: 0;">Reset</button>
            </div>
          </form>
        </div>

        <!-- Right Side: Dynamic Estimate Results Card with Background Swapping -->
        <div class="calc-card" style="padding: 0; border: none; background: transparent;">
          <div class="calc-result-box theme-residential" id="calcResultContainer" style="position: relative; overflow: hidden; padding: 24px; border-radius: 18px; background-size: cover; background-position: center; background-repeat: no-repeat; transition: background-image 0.4s ease-in-out, background-color 0.4s ease;">
            
            <!-- Semi-transparent overlay to keep text legible over background images -->
            <div style="position: absolute; inset: 0; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(2px); z-index: 1;"></div>

            <div class="watermark-stamp" style="position: absolute; right: 10px; bottom: 10px; opacity: 0.05; font-size: 28px; font-weight: 900; pointer-events: none; z-index: 2;">SunGET Solar Infra</div>
            
            <div class="calc-res-head" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; position: relative; z-index: 2;">
              <strong style="color: var(--ink); font-size: 15px;" id="resHeadTitle">Preliminary Estimate</strong>
              <span class="calc-pill" id="resTypePill" style="background: #eaf4ed; color: var(--green); padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase;">RESIDENTIAL</span>
            </div>
            
            <div class="calc-big-val" id="resSystemSize" style="font-size: 36px; font-weight: 800; color: var(--green); line-height: 1.1; position: relative; z-index: 2;">0 kW</div>
            <div class="calc-muted" id="resMutedText" style="color: var(--muted); font-size: 13px; margin-bottom: 18px; position: relative; z-index: 2;">Recommended Solar System Size</div>
            
            <div class="calc-metrics" style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; position: relative; z-index: 2;">
              <div class="calc-metric" style="background: rgba(255, 255, 255, 0.95); padding: 12px; border-radius: 12px; border: 1px solid var(--line);">
                <small style="display: block; font-size: 11px; color: var(--muted); text-transform: uppercase; font-weight: 700;">Base System Price</small>
                <strong id="resCost" style="font-size: 16px; color: var(--ink);">₹0</strong>
              </div>
              <div class="calc-metric" style="background: rgba(255, 255, 255, 0.95); padding: 12px; border-radius: 12px; border: 1px solid var(--line);">
                <small style="display: block; font-size: 11px; color: var(--muted); text-transform: uppercase; font-weight: 700;">Govt. Subsidy (PM Surya Ghar)</small>
                <strong id="resSubsidy" style="font-size: 16px; color: var(--green);">₹0</strong>
              </div>
            </div>

            <div style="background: rgba(255, 255, 255, 0.95); padding: 16px; border-radius: 14px; border: 1.5px solid var(--green); margin-bottom: 16px; text-align: center; position: relative; z-index: 2;">
              <small style="display: block; font-size: 12px; color: var(--muted); text-transform: uppercase; font-weight: 700;">Effective Net Cost (Approx.)</small>
              <strong id="resFinalPrice" style="font-size: 26px; font-weight: 800; color: var(--green); display: block; margin-top: 2px;">₹0</strong>
            </div>

            <!-- WhatsApp Direct Action Button -->
            <a id="calcWaBtn" href="#" target="_blank" rel="noopener noreferrer" class="btn" style="background: #25d366; color: #ffffff; width: 100%; text-align: center; display: block; text-decoration: none; font-weight: 700; border-radius: 12px; padding: 14px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25); position: relative; z-index: 2;">
              💬 Get Detailed Quote on WhatsApp &rarr;
            </a>

            <p class="calc-note" style="margin-top: 14px; text-align: center; color: var(--muted); font-size: 11px; line-height: 1.4; position: relative; z-index: 2;">
              Indicative estimate. Final quote & subsidy claims are subject to DISCOM site survey & grid feasibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  function injectCalculatorModal() {
    if (isCalculatorInjected) return;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    isCalculatorInjected = true;
    initCalculatorLogic();
  }

  function getSystemKw(units) {
    for (const s of CONFIG.slabs) {
      if (units <= s.maxUnits) return s.kw;
    }
    const lastMax = CONFIG.slabs[CONFIG.slabs.length - 1].maxUnits;
    const extra = Math.floor((units - lastMax - 1) / CONFIG.aboveSlabs.unitsPerExtraKw);
    return CONFIG.aboveSlabs.baseKw + extra;
  }

  function getPrice(kw) {
    if (CONFIG.fixedPrices[kw] !== undefined) return CONFIG.fixedPrices[kw];
    return kw * CONFIG.pricePerKw;
  }

  function getSubsidyAmount(kw, category) {
    if (category === "commercial") return 0;
    if (kw === 1) return CONFIG.subsidy[1];
    if (kw === 2) return CONFIG.subsidy[2];
    return CONFIG.subsidy.max;
  }

  function formatINR(n) {
    return "₹" + Math.round(n).toLocaleString("en-IN");
  }

  function initCalculatorLogic() {
    const calcModal = document.getElementById("calcModal");
    const calcModalOverlay = document.getElementById("calcModalOverlay");
    const calcCloseBtn = document.getElementById("calcCloseBtn");
    const calcForm = document.getElementById("calcForm");
    const calcResetBtn = document.getElementById("calcResetBtn");
    const calcMonthlyUnits = document.getElementById("calcMonthlyUnits");
    const calcError = document.getElementById("calcError");
    const resTypePill = document.getElementById("resTypePill");
    const calcResultContainer = document.getElementById("calcResultContainer");
    const typeBtns = document.querySelectorAll("#typeSelector .type-btn");

    let selectedCategory = "residential";

    // Set initial default background image
    calcResultContainer.style.backgroundImage = BG_IMAGES.residential;

    // Handle Connection Category Toggles & Dynamic Background Switching
    typeBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        typeBtns.forEach((b) => {
          b.classList.remove("active");
          b.style.background = "transparent";
          b.style.color = "var(--muted)";
          b.style.fontWeight = "600";
          b.style.boxShadow = "none";
        });
        
        const target = e.currentTarget;
        target.classList.add("active");
        target.style.background = "#ffffff";
        target.style.color = "var(--green)";
        target.style.fontWeight = "700";
        target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)";

        selectedCategory = target.dataset.type;
        resTypePill.textContent = selectedCategory.toUpperCase();

        // Dynamically swap the background image based on selected category
        if (BG_IMAGES[selectedCategory]) {
          calcResultContainer.style.backgroundImage = BG_IMAGES[selectedCategory];
        }

        // Re-calculate automatically if units input is filled
        if (calcMonthlyUnits.value.trim() !== "") {
          calcForm.dispatchEvent(new Event("submit"));
        }
      });
    });

    function closeCalculator() {
      calcModal.classList.remove("active");
      document.body.style.overflow = "";
    }

    if (calcCloseBtn) calcCloseBtn.addEventListener("click", closeCalculator);
    if (calcModalOverlay) calcModalOverlay.addEventListener("click", closeCalculator);

    // Form Submit Event
    calcForm.addEventListener("submit", (e) => {
      e.preventDefault();
      calcError.style.display = "none";

      const raw = calcMonthlyUnits.value.trim();
      const units = Math.round(Number(raw));

      if (raw === "" || !isFinite(units) || units <= 0) {
        calcError.textContent = "Please enter a valid number of units greater than 0.";
        calcError.style.display = "block";
        return;
      }

      const kw = getSystemKw(units);
      const basePrice = getPrice(kw);
      const subsidy = getSubsidyAmount(kw, selectedCategory);
      
      const gstAmount = Math.round(basePrice * CONFIG.gstRate);
      const totalPriceWithGst = basePrice + gstAmount;
      const netEffectivePrice = Math.max(0, totalPriceWithGst - subsidy);

      // Render Outputs
      document.getElementById("resSystemSize").textContent = kw + " kW";
      document.getElementById("resCost").textContent = formatINR(basePrice) + " + GST";

      if (selectedCategory === "commercial") {
        document.getElementById("resSubsidy").textContent = "₹0 (N/A)";
      } else {
        document.getElementById("resSubsidy").textContent = formatINR(subsidy);
      }

      document.getElementById("resFinalPrice").textContent = formatINR(netEffectivePrice) + " + GST*";

      // Pre-fill WhatsApp message text
      const msg =
        "Hello SunGET Solar Infra, I generated a solar estimate on your website.\n\n" +
        "• Category: " + selectedCategory.toUpperCase() + "\n" +
        "• Monthly Usage: " + units + " kWh/units\n" +
        "• Recommended System: " + kw + " kW\n" +
        "• Base Price: " + formatINR(basePrice) + " + GST\n" +
        "• Govt. Subsidy: " + formatINR(subsidy) + "\n" +
        "• Estimated Net Cost: " + formatINR(netEffectivePrice) + "\n\n" +
        "Please provide a detailed site feasibility inspection and quote.";

      document.getElementById("calcWaBtn").href =
        "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(msg);
    });

    // Reset Event
    calcResetBtn.addEventListener("click", () => {
      calcMonthlyUnits.value = "";
      calcError.style.display = "none";
      document.getElementById("resSystemSize").textContent = "0 kW";
      document.getElementById("resCost").textContent = "₹0";
      document.getElementById("resSubsidy").textContent = "₹0";
      document.getElementById("resFinalPrice").textContent = "₹0";
      document.getElementById("calcWaBtn").href = "#";
      calcMonthlyUnits.focus();
    });
  }

  // Open modal trigger handler on elements with `.open-calc-btn`
  document.addEventListener("click", function (e) {
    const triggerBtn = e.target.closest(".open-calc-btn");
    if (triggerBtn) {
      e.preventDefault();

      injectCalculatorModal();

      const calcModal = document.getElementById("calcModal");
      if (calcModal) {
        calcModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }

      const mobileMenu = document.getElementById("mobileMenu");
      const menuToggle = document.getElementById("menuToggle");
      if (mobileMenu && mobileMenu.classList.contains("active")) {
        mobileMenu.classList.remove("active");
        if (menuToggle) menuToggle.classList.remove("active");
      }
    }
  });
})();
// =========================================
// NAVIGATION & FORM LISTENERS
// =========================================
// Mobile Hamburger Navigation
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

function closeMobileMenu() {
  menuToggle.classList.remove("active");
  mobileMenu.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  // collapse all submenus
  document.querySelectorAll(".mobile-group").forEach((g) => {
    g.classList.remove("open");
    g.querySelector(".mobile-sub").style.maxHeight = null;
    g.querySelector(".mobile-sub-toggle").setAttribute("aria-expanded", "false");
  });
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isActive = menuToggle.classList.toggle("active");
    mobileMenu.classList.toggle("active", isActive);
    menuToggle.setAttribute("aria-expanded", isActive);
    if (!isActive) closeMobileMenu();
  });

  // Close menu when any real link is clicked
  mobileMenu
    .querySelectorAll(".mobile-link, .mobile-sub a, #mobileCta")
    .forEach((link) => link.addEventListener("click", closeMobileMenu));

  // Expand / collapse mobile submenus via the arrow button
  document.querySelectorAll(".mobile-group").forEach((group) => {
    const btn = group.querySelector(".mobile-sub-toggle");
    const sub = group.querySelector(".mobile-sub");

    btn.addEventListener("click", () => {
      const isOpen = group.classList.toggle("open");
      sub.style.maxHeight = isOpen ? sub.scrollHeight + "px" : null;
      btn.setAttribute("aria-expanded", isOpen);
    });
  });
}

// Close mobile menu with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMobileMenu();
});

// Contact Form Notification Handler
// Shows the pop-up message at the bottom right. Pass isError = true for a red error message.
function showToastNotification(message, isError) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  const originalText = toast.textContent;
  const originalBg = toast.style.background;
  if (message) toast.textContent = message;
  if (isError) toast.style.background = "#b3261e";
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
    toast.textContent = originalText;
    toast.style.background = originalBg;
  }, isError ? 6000 : 3500);
}

// Sends a form to your email (see src/leads.js), then shows the result
function handleLeadForm(form, label) {
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn ? btn.textContent : "";
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Sending...";
    }

    const request = window.SungetLeads
      ? window.SungetLeads.send(window.SungetLeads.formToObject(form), label)
      : Promise.reject(new Error("leads.js is not loaded"));

    request
      .then(() => {
        form.reset();
        showToastNotification();
      })
      .catch((err) => {
        console.error("Enquiry could not be sent:", err);
        showToastNotification(
          "Sorry, we could not send your enquiry. Please call +91 98818 55770.",
          true,
        );
      })
      .finally(() => {
        if (btn) {
          btn.disabled = false;
          btn.textContent = btnText;
        }
      });
  });
}

handleLeadForm(document.getElementById("leadForm"), "Contact form");
handleLeadForm(document.getElementById("heroLeadForm"), "Hero form");

/* =========== slide chenging  and dots arros for slide change ============ */
(function () {
  var slides = document.querySelectorAll(".hero-slide");
  var dotsBox = document.getElementById("heroDots");
  var hero = document.querySelector(".hero");
  // Only run on pages that really have the home-page hero slider
  if (!slides.length || !dotsBox || !hero) return;
  var DELAY = 3000; // 3 seconds
  var current = 0;
  var timer;

  // build dots
  slides.forEach(function (_, i) {
    var d = document.createElement("button");
    d.type = "button";
    d.className = "hero-dot" + (i === 0 ? " active" : "");
    d.setAttribute("aria-label", "Go to slide " + (i + 1));
    d.addEventListener("click", function () {
      goTo(i);
      restart();
    });
    dotsBox.appendChild(d);
  });
  var dots = dotsBox.querySelectorAll(".hero-dot");

  function goTo(n) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (n + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
  }

  function start() {
    clearInterval(timer);
    timer = setInterval(function () {
      goTo(current + 1);
    }, DELAY);
  }
  function stop() {
    clearInterval(timer);
  }
  function restart() {
    stop();
    start();
  }

  document.getElementById("heroNext").addEventListener("click", function () {
    goTo(current + 1);
    restart();
  });
  document.getElementById("heroPrev").addEventListener("click", function () {
    goTo(current - 1);
    restart();
  });

  // pause on hover (mouse devices only, so touch screens never get stuck paused)
  if (window.matchMedia("(hover: hover)").matches) {
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
  }

  // ----- Mobile: open / close the enquiry form popup -----
  var formCard = document.getElementById("heroFormCard");
  var backdrop = document.getElementById("heroFormBackdrop");

  function openForm() {
    formCard.classList.add("open");
    backdrop.classList.add("show");
    hero.classList.add("form-open");
    document.body.style.overflow = "hidden";
    stop();
  }
  function closeForm() {
    formCard.classList.remove("open");
    backdrop.classList.remove("show");
    hero.classList.remove("form-open");
    document.body.style.overflow = "";
    start();
  }
  document.getElementById("openHeroForm").addEventListener("click", openForm);
  document.getElementById("closeHeroForm").addEventListener("click", closeForm);
  backdrop.addEventListener("click", closeForm);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeForm();
  });

  // if the screen is resized back to desktop, reset the popup state
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768 && formCard.classList.contains("open"))
      closeForm();
  });

  // pause when the tab is hidden
  document.addEventListener("visibilitychange", function () {
    document.hidden ? stop() : restart();
  });

  // preload images so slides don't flash blank
  slides.forEach(function (s) {
    var url = s.style.backgroundImage.replace(/^url\(["']?|["']?\)$/g, "");
    new Image().src = url;
  });

  start();
})();
