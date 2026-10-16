// =========================================
// GLOBAL SOLAR CALCULATOR INJECTION & LOGIC
// =========================================

(function () {
  let isCalculatorInjected = false;

  // Complete popup modal HTML structure (PDF Download options removed)
  const modalHTML = `
  <div class="calc-modal" id="calcModal">
    <div class="calc-modal-overlay" id="calcModalOverlay"></div>
    <div class="calc-modal-content">
      <button class="calc-close" id="calcCloseBtn" aria-label="Close Calculator">&times;</button>
      
      <div class="calc-layout">
        <!-- Left Side: Calculator Form -->
        <div class="calc-card">
          <h2 style="font-size: 24px; margin-bottom: 8px; color: var(--ink);">Solar Savings Calculator</h2>
          <p style="color: var(--muted); font-size: 14px; margin: 0 0 24px 0; line-height: 1.6;">
            Enter your monthly electricity usage to see an indicative system size, project cost and potential savings.
          </p>
          
          <form id="calcForm" class="calc-form">
            <label>Monthly electricity consumption (units)</label>
            <input type="number" id="calcMonthlyUnits" min="1" max="100000" placeholder="300" required>
            <small>Find this number on your electricity bill (kWh / units).</small>

            <label>Property type</label>
            <select id="calcCustomerType">
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
            </select>

            <label>PIN Code</label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="calcPincode" placeholder="Enter PIN Code" pattern="[0-9]{6}" maxlength="6" style="flex: 1;" required>
              <button type="button" class="btn light" id="fetchLocBtn" style="padding: 10px 14px; font-size: 13px; white-space: nowrap; flex-shrink: 0;">
                📍 Fetch Location
              </button>
            </div>
            <small id="locStatusMsg" style="color: var(--muted); font-size: 11px; margin-top: 4px;"></small>

            <button type="submit" class="btn full" style="margin-top: 24px;">
              Calculate Solar Estimate &rarr;
            </button>
          </form>
        </div>

        <!-- Right Side: Dynamic Estimate Results Card -->
        <div class="calc-card" style="padding: 0; border: none; background: transparent;">
          <div class="calc-result-box theme-residential" id="calcResultContainer" style="transition: background 0.4s ease, color 0.4s ease; position: relative; overflow: hidden;">
            
            <div class="watermark-stamp">SunGET Solar Infra</div>
            
            <div class="calc-res-head" style="position: relative; z-index: 2;">
              <strong style="color: inherit;" id="resHeadTitle">Your preliminary estimate</strong>
              <span class="calc-pill" id="resTypePill">RESIDENTIAL</span>
            </div>
            
            <div class="calc-big-val" id="resSystemSize" style="position: relative; z-index: 2;">0.0 kW</div>
            <div class="calc-muted" id="resMutedText" style="position: relative; z-index: 2;">Suggested solar system size</div>
            
            <div class="calc-metrics" style="position: relative; z-index: 2;">
              <div class="calc-metric">
                <small>Estimated project cost</small>
                <strong id="resCost">₹0</strong>
              </div>
              <div class="calc-metric">
                <small>Annual savings</small>
                <strong id="resSavings">₹0</strong>
              </div>
              <div class="calc-metric">
                <small>Daily generation</small>
                <strong id="resGeneration">0 units</strong>
              </div>
              <div class="calc-metric">
                <small>Payback period</small>
                <strong id="resPayback">0 years</strong>
              </div>
            </div>
            
            <p class="calc-note" style="position: relative; z-index: 2;">
              This is a preliminary estimate generated for <span id="reportPropertyLabel">Residential</span> usage in PIN: <span id="reportPincodeLabel">-----</span>. Actual pricing and savings depend on roof conditions, shading, and local utility tariffs.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  // Inject calculator HTML dynamically into DOM body
  function injectCalculatorModal() {
    if (isCalculatorInjected) return;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    isCalculatorInjected = true;
    initCalculatorLogic();
  }

  // Attach event handlers to modal elements
  function initCalculatorLogic() {
    const calcModal = document.getElementById('calcModal');
    const calcModalOverlay = document.getElementById('calcModalOverlay');
    const calcCloseBtn = document.getElementById('calcCloseBtn');
    const calcForm = document.getElementById('calcForm');
    const calcCustomerTypeSelect = document.getElementById('calcCustomerType');
    const calcResultContainer = document.getElementById('calcResultContainer');
    const resTypePill = document.getElementById('resTypePill');
    const reportPropertyLabel = document.getElementById('reportPropertyLabel');
    const reportPincodeLabel = document.getElementById('reportPincodeLabel');
    const calcPincodeInput = document.getElementById('calcPincode');
    const fetchLocBtn = document.getElementById('fetchLocBtn');
    const locStatusMsg = document.getElementById('locStatusMsg');

    // Dynamic Theme Map
    const themeMap = {
      'Residential': 'theme-residential',
      'Commercial': 'theme-commercial',
      'Industrial': 'theme-industrial'
    };

    function updateTheme() {
      const selectedType = calcCustomerTypeSelect.value;
      Object.values(themeMap).forEach(theme => calcResultContainer.classList.remove(theme));
      const activeTheme = themeMap[selectedType] || 'theme-residential';
      calcResultContainer.classList.add(activeTheme);

      resTypePill.textContent = selectedType.toUpperCase();
      reportPropertyLabel.textContent = selectedType;
    }

    if (calcCustomerTypeSelect) {
      calcCustomerTypeSelect.addEventListener('change', updateTheme);
    }

    if (calcPincodeInput) {
      calcPincodeInput.addEventListener('input', (e) => {
        reportPincodeLabel.textContent = e.target.value || '-----';
      });
    }

    // Modal Close Action
    function closeCalculator() {
      calcModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (calcCloseBtn) calcCloseBtn.addEventListener('click', closeCalculator);
    if (calcModalOverlay) calcModalOverlay.addEventListener('click', closeCalculator);

    // Mathematical Solar Estimates
    const formatRupees = n => '₹' + Math.round(n).toLocaleString('en-IN');

    if (calcForm) {
      calcForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const units = Number(document.getElementById('calcMonthlyUnits').value);

        if (units > 0) {
          const systemSizeKw = Math.round((units / 120) * 10) / 10;
          const dailyGenerationUnits = Math.round(systemSizeKw * 4 * 10) / 10;
          const estimatedCostRupees = Math.round(systemSizeKw * 60000);
          const estimatedAnnualSavingsRupees = Math.round(units * 12 * 8 * 0.8);
          const paybackVal = estimatedCostRupees / Math.max(estimatedAnnualSavingsRupees, 1);
          const paybackYears = Math.round(paybackVal * 10) / 10;

          document.getElementById('resSystemSize').textContent = systemSizeKw + ' kW';
          document.getElementById('resCost').textContent = formatRupees(estimatedCostRupees);
          document.getElementById('resSavings').textContent = formatRupees(estimatedAnnualSavingsRupees);
          document.getElementById('resGeneration').textContent = dailyGenerationUnits + ' units';
          document.getElementById('resPayback').textContent = paybackYears + ' years';
        }
      });
    }

    // Geolocation and PIN code fetcher
    if (fetchLocBtn) {
      fetchLocBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
          locStatusMsg.textContent = "Geolocation is not supported by your browser.";
          locStatusMsg.style.color = "#d32f2f";
          return;
        }

        locStatusMsg.textContent = "Fetching your location...";
        locStatusMsg.style.color = "var(--muted)";
        fetchLocBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();

              if (data && data.address && data.address.postcode) {
                const pincodeMatch = data.address.postcode.match(/\d{6}/);
                const pincode = pincodeMatch ? pincodeMatch[0] : data.address.postcode;

                calcPincodeInput.value = pincode;
                reportPincodeLabel.textContent = pincode;
                locStatusMsg.textContent = `Detected: ${data.address.city || data.address.town || data.address.suburb || 'Pune'} (${pincode})`;
                locStatusMsg.style.color = "var(--green)";
              } else {
                locStatusMsg.textContent = "Could not detect PIN code automatically. Please enter manually.";
                locStatusMsg.style.color = "#d32f2f";
              }
            } catch (error) {
              locStatusMsg.textContent = "Error fetching location. Please enter PIN manually.";
              locStatusMsg.style.color = "#d32f2f";
            } finally {
              fetchLocBtn.disabled = false;
            }
          },
          () => {
            fetchLocBtn.disabled = false;
            locStatusMsg.textContent = "Location access denied or unavailable. Please enter PIN manually.";
            locStatusMsg.style.color = "#d32f2f";
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      });
    }
  }

  // Open modal click handler on elements with `.open-calc-btn`
  document.addEventListener('click', function (e) {
    const triggerBtn = e.target.closest('.open-calc-btn');
    if (triggerBtn) {
      e.preventDefault();

      // Ensure modal HTML exists in DOM
      injectCalculatorModal();

      const calcModal = document.getElementById('calcModal');
      if (calcModal) {
        calcModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      // Close mobile navigation dropdown if open
      const mobileMenu = document.getElementById('mobileMenu');
      const menuToggle = document.getElementById('menuToggle');
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
      }
    }
  });
})();

// =========================================
// NAVIGATION & FORM LISTENERS
// =========================================

// Mobile Hamburger Navigation
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link, #mobileCta');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const isActive = menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isActive);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Contact Form Notification Handler
function showToastNotification() {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3500);
  }
}

const leadForm = document.getElementById('leadForm');
if (leadForm) {
  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToastNotification();
  });
}

const heroLeadForm = document.getElementById('heroLeadForm');
if (heroLeadForm) {
  heroLeadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToastNotification();
  });
}