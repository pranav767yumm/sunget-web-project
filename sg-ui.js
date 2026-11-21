/* SunGET UI layer. Add before </body> on every page:  <script src="src/sg-ui.js" defer></script>
   (use ../src/sg-ui.js inside /pgs/). No dependencies. */
(function () {
  "use strict";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WA_NUMBER = "919881855770"; // from the existing site footer
  var WA_TEXT = "Hi SunGET Solar, I would like a free solar quote.";

  // 1. Auto-tag common blocks so existing pages animate without editing every file.
  //    Children of a grid get a stagger index (--i) for a smooth cascade.
  var groups = [".cards", ".why-grid", ".process", ".rt-segments", ".rt-steps", ".epc-pillars", ".values-grid"];
  document.querySelectorAll(groups.join(",")).forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) {
      if (!c.hasAttribute("data-reveal")) { c.setAttribute("data-reveal", ""); c.style.setProperty("--i", Math.min(i, 8)); }
    });
  });
  document.querySelectorAll(".section-head,.rt-head,.pf-head,.rt-panel,.rt-subsidy,.rt-est,.rt-faq details,.cta-box,.contact-hub-card")
    .forEach(function (el) { if (!el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", ""); });

  var targets = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (t) { t.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { var el=e.target; el.classList.add("is-in"); io.unobserve(el); setTimeout(function(){el.removeAttribute("data-reveal");el.classList.remove("is-in");},1200); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  }

  // 2. Header: compact + shadow after scrolling (rAF-throttled, passive)
  var nav = document.querySelector(".nav"), tick = false;
  function onScroll() {
    if (tick) return; tick = true;
    requestAnimationFrame(function () { tick = false; if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 24); });
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // 3. Mark the current page in the desktop nav (keyboard + screen reader friendly)
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".links a[href], .dropdown-menu a[href]").forEach(function (a) {
    var f = (a.getAttribute("href") || "").split("#")[0].split("/").pop();
    if (f && f === here) a.setAttribute("aria-current", "page");
  });

  // 4. Count-up numbers: <b data-count="12" data-suffix="+">0</b>. Only use VERIFIED figures.
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var end = parseFloat(el.dataset.count), suf = el.dataset.suffix || "";
    if (reduce) { el.textContent = end + suf; return; }
    var o = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; o.disconnect();
      var t0 = performance.now(), d = 1400;
      (function step(t) {
        var p = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * e) + suf;
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }, { threshold: 0.6 });
    o.observe(el);
  });

  // 5. Smooth in-page anchors that account for the sticky header
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a || a.classList.contains("open-calc-btn")) return;
    var id = a.getAttribute("href"); if (id.length < 2) return;
    var t = document.querySelector(id); if (!t) return;
    e.preventDefault();
    var y = t.getBoundingClientRect().top + window.scrollY - (nav ? nav.offsetHeight : 0) - 8;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", id);
    t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true });
  });

  
})();
