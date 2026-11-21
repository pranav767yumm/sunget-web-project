// =========================================================
// ABOUT PAGE SCRIPT  (src/about.js) for pgs/about_us.html
// Reads src/team-data.js and builds: hero carousel, culture
// grid, timeline, team (filters + profile popup), values and
// certificates. Also handles scroll reveals, parallax and the
// back-to-top button. Respects "reduce motion" settings.
// =========================================================
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var DATA = window.ABOUT_DATA || {};
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- helpers ----------
  function $(id) { return document.getElementById(id); }
  function esc(t) {
    return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  // "images/x.webp" works from /pgs/ (adds ../ for relative paths)
  function asset(p) {
    if (!p) return "";
    if (/^(https?:)?\/\//i.test(p) || p.charAt(0) === "/" || /^data:/i.test(p)) return p;
    return "../" + p;
  }

  var ICON = {
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
    people: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0012 2z"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z"/></svg>',
    cert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="M8.5 14.5L7 22l5-3 5 3-1.5-7.5"/></svg>'
  };

  // Placeholder silhouette shown when a member has no photo
  var PALETTES = [["#0b4d38", "#2a9b72"], ["#116b4b", "#8ccfae"], ["#0a3a2b", "#3f8f6e"], ["#164f3a", "#a6d8bd"]];
  function avatar(i) {
    var p = PALETTES[i % PALETTES.length], id = "av" + i + "_" + Math.floor(Math.random() * 1e5);
    return '<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + p[0] + '"/><stop offset="1" stop-color="' + p[1] + '"/></linearGradient></defs>' +
      '<rect width="400" height="500" fill="url(#' + id + ')"/>' +
      '<circle cx="200" cy="190" r="72" fill="#fff" fill-opacity=".55"/>' +
      '<path d="M50 500C50 385 120 320 200 320s150 65 150 180z" fill="#fff" fill-opacity=".42"/></svg>';
  }
  function photoHTML(m, i, eager) {
    if (m.photo) {
      return '<img src="' + esc(asset(m.photo)) + '" alt="' + esc(m.name) + ', ' + esc(m.role) + '" ' + (eager ? "" : 'loading="lazy" ') + 'decoding="async" onerror="this.outerHTML=window.__avatar(' + i + ')">';
    }
    return avatar(i);
  }
  window.__avatar = avatar;

  // ---------- demo bar ----------
  (function () {
    var bar = $("demoBar");
    if (!bar) return;
    var hidden = false;
    try { hidden = sessionStorage.getItem("sg_demo_bar") === "0"; } catch (e) {}
    if (DATA.demo && !hidden) bar.hidden = false;
    var x = $("demoClose");
    if (x) x.addEventListener("click", function () {
      bar.hidden = true;
      try { sessionStorage.setItem("sg_demo_bar", "0"); } catch (e) {}
    });
  })();

  // ---------- hero carousel ----------
  (function () {
    var track = $("abTrack"), dots = $("abDots"), cap = $("abCap");
    var slides = DATA.hero || [];
    if (!track || !slides.length) return;

    track.innerHTML = slides.map(function (s, i) {
      return '<div class="slide' + (i === 0 ? " active" : "") + '" aria-hidden="' + (i === 0 ? "false" : "true") + '">' +
        '<img src="' + esc(s.img.indexOf("http") === 0 ? s.img : asset(s.img)) + '" alt="' + esc(s.caption) + '"' + (i === 0 ? "" : ' loading="lazy"') + ' decoding="async"></div>';
    }).join("");
    dots.innerHTML = slides.map(function (s, i) {
      return '<button type="button" aria-label="Show photo ' + (i + 1) + '"' + (i === 0 ? ' class="active"' : "") + "></button>";
    }).join("");

    var els = track.querySelectorAll(".slide"), db = dots.querySelectorAll("button");
    var cur = 0, timer = null;

    function show(n) {
      cur = (n + slides.length) % slides.length;
      els.forEach(function (el, i) {
        el.classList.toggle("active", i === cur);
        el.setAttribute("aria-hidden", i === cur ? "false" : "true");
      });
      db.forEach(function (d, i) { d.classList.toggle("active", i === cur); });
      cap.textContent = slides[cur].caption;
    }
    function play() {
      if (reduceMotion || slides.length < 2) return;
      stop();
      timer = setInterval(function () { if (!document.hidden) show(cur + 1); }, 5200);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    $("abPrev").addEventListener("click", function () { show(cur - 1); play(); });
    $("abNext").addEventListener("click", function () { show(cur + 1); play(); });
    db.forEach(function (d, i) { d.addEventListener("click", function () { show(i); play(); }); });

    var box = $("abCarousel");
    box.addEventListener("mouseenter", stop);
    box.addEventListener("mouseleave", play);
    box.addEventListener("focusin", stop);
    box.addEventListener("focusout", play);

    // swipe on touch screens
    var sx = null;
    box.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) { show(cur + (dx < 0 ? 1 : -1)); play(); }
      sx = null;
    }, { passive: true });

    show(0);
    play();
  })();

  // ---------- culture grid ----------
  (function () {
    var grid = $("cultureGrid");
    if (!grid || !DATA.culture) return;
    grid.innerHTML = DATA.culture.map(function (c, i) {
      return '<figure class="c-tile reveal" style="--d:' + (i * 0.06).toFixed(2) + 's"><img src="' + esc(c.img.indexOf("http") === 0 ? c.img : asset(c.img)) +
        '" alt="' + esc(c.label) + '" loading="lazy" decoding="async"><figcaption>' + esc(c.label) + "</figcaption></figure>";
    }).join("");
  })();

  // ---------- timeline ----------
  (function () {
    var list = $("timeline");
    if (!list || !DATA.timeline) return;
    list.innerHTML = DATA.timeline.map(function (t) {
      return '<li class="tl-item"><span class="tl-year">' + esc(t.year) + '</span><article class="tl-card">' +
        (t.img ? '<img src="' + esc(t.img.indexOf("http") === 0 ? t.img : asset(t.img)) + '" alt="" loading="lazy" decoding="async">' : "") +
        '<div class="tl-body"><h3>' + esc(t.title) + "</h3><p>" + esc(t.text) + "</p></div></article></li>";
    }).join("");

    var items = Array.prototype.slice.call(list.querySelectorAll(".tl-item"));
    var ticking = false;

    function update() {
      ticking = false;
      var vh = window.innerHeight, mid = vh * 0.5;
      var lr = list.getBoundingClientRect();
      var prog = Math.max(0, Math.min(1, (mid - lr.top) / lr.height));
      list.style.setProperty("--p", (prog * 100).toFixed(1) + "%");

      var best = -1, bestDist = Infinity;
      items.forEach(function (el, i) {
        var r = el.getBoundingClientRect();
        var d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      items.forEach(function (el, i) {
        el.classList.toggle("active", i === best && lr.top < mid && lr.bottom > mid * 0.6);
        el.classList.toggle("past", i < best && lr.top < mid);
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  })();

  // ---------- team: filters, cards, profile popup ----------
  (function () {
    var grid = $("teamGrid"), filterBox = $("teamFilters"), count = $("teamCount");
    var team = DATA.team || [], cats = DATA.categories || [];
    if (!grid) return;

    var active = "all";

    filterBox.innerHTML = cats.map(function (c) {
      return '<button type="button" class="tf-btn" data-cat="' + esc(c.id) + '" aria-pressed="' + (c.id === "all") + '">' + esc(c.label) + "</button>";
    }).join("");

    function socials(m) {
      var out = "";
      if (m.linkedin) out += '<a href="' + esc(m.linkedin) + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(m.name) + ' on LinkedIn">' + ICON.linkedin + "</a>";
      if (m.instagram) out += '<a href="' + esc(m.instagram) + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(m.name) + ' on Instagram">' + ICON.instagram + "</a>";
      return out ? '<div class="tm-social">' + out + "</div>" : "";
    }

    function render() {
      var shown = team.map(function (m, i) { return { m: m, i: i }; }).filter(function (x) {
        return active === "all" || x.m.category === active;
      });
      grid.innerHTML = shown.length ? shown.map(function (x, n) {
        var m = x.m;
        return '<article class="tm-card" data-idx="' + x.i + '" style="animation-delay:' + (reduceMotion ? 0 : n * 0.04).toFixed(2) + 's">' +
          '<div class="tm-photo"><button type="button" class="tm-open" data-idx="' + x.i + '" aria-haspopup="dialog" aria-label="View profile: ' + esc(m.name) + ', ' + esc(m.role) + '">' +
          photoHTML(m, x.i, false) + "</button>" + socials(m) + "</div>" +
          '<div class="tm-info"><h3 class="tm-name">' + esc(m.name) + '</h3><p class="tm-role">' + esc(m.role) + '</p><p class="tm-bio">' + esc(m.bio) + "</p></div></article>";
      }).join("") : '<p class="team-empty">No team members in this group yet.</p>';
      count.textContent = "Showing " + shown.length + " of " + team.length + " team members";
    }

    filterBox.addEventListener("click", function (e) {
      var b = e.target.closest(".tf-btn");
      if (!b) return;
      active = b.getAttribute("data-cat");
      filterBox.querySelectorAll(".tf-btn").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      render();
    });

    // ----- modal -----
    var modal = document.createElement("div");
    modal.className = "tm-modal";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="tm-back" data-close></div>' +
      '<div class="tm-dialog" role="dialog" aria-modal="true" aria-labelledby="tmMName" tabindex="-1">' +
      '<button type="button" class="tm-m-close" aria-label="Close profile" data-close>&times;</button>' +
      '<div class="tm-m-photo" id="tmMPhoto"></div>' +
      '<div class="tm-m-body"><h3 id="tmMName"></h3><p class="tm-m-role" id="tmMRole"></p><p class="tm-m-bio" id="tmMBio"></p>' +
      '<div id="tmMSkillsWrap"><p class="tm-m-label">Skills &amp; expertise</p><ul class="tm-skills" id="tmMSkills"></ul></div>' +
      '<div class="tm-m-links" id="tmMLinks"></div></div></div>';
    document.body.appendChild(modal);

    var dialog = modal.querySelector(".tm-dialog"), lastFocus = null, isOpen = false;

    function openProfile(i) {
      var m = team[i];
      if (!m) return;
      $("tmMPhoto").innerHTML = photoHTML(m, i, true);
      $("tmMName").textContent = m.name;
      $("tmMRole").textContent = m.role;
      $("tmMBio").textContent = m.bio;
      var sk = (m.skills || []);
      $("tmMSkillsWrap").style.display = sk.length ? "" : "none";
      $("tmMSkills").innerHTML = sk.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
      var links = "";
      if (m.linkedin) links += '<a href="' + esc(m.linkedin) + '" target="_blank" rel="noopener noreferrer">' + ICON.linkedin + " LinkedIn profile</a>";
      if (m.instagram) links += '<a href="' + esc(m.instagram) + '" target="_blank" rel="noopener noreferrer">' + ICON.instagram + " Instagram</a>";
      $("tmMLinks").innerHTML = links;

      lastFocus = document.activeElement;
      isOpen = true;
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      void modal.offsetWidth;
      modal.classList.add("open");
      setTimeout(function () { var c = modal.querySelector(".tm-m-close"); if (c) c.focus(); }, 60);
    }
    function closeProfile() {
      if (!isOpen) return;
      isOpen = false;
      modal.classList.remove("open");
      document.body.style.overflow = "";
      setTimeout(function () { modal.hidden = true; }, 280);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    modal.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closeProfile(); });
    modal.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.stopPropagation(); closeProfile(); return; }
      if (e.key !== "Tab") return;
      var f = Array.prototype.filter.call(dialog.querySelectorAll("button, a[href]"), function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // click anywhere on a card (except social links) opens the profile
    grid.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      var card = e.target.closest(".tm-card");
      if (card) openProfile(Number(card.getAttribute("data-idx")));
    });

    render();
  })();

  // ---------- values ----------
  (function () {
    var g = $("valuesGrid");
    if (!g || !DATA.values) return;
    g.innerHTML = DATA.values.map(function (v, i) {
      return '<article class="v-card reveal" style="--d:' + ((i % 3) * 0.08).toFixed(2) + 's"><span class="v-icon">' + (ICON[v.icon] || ICON.star) +
        "</span><h3>" + esc(v.title) + "</h3><p>" + esc(v.text) + "</p></article>";
    }).join("");
  })();

  // ---------- certificates ----------
  (function () {
    var g = $("certGrid");
    if (!g || !DATA.certs) return;
    g.innerHTML = DATA.certs.map(function (c, i) {
      return '<div class="cert reveal" style="--d:' + (i * 0.07).toFixed(2) + 's">' +
        (c.img ? '<img src="' + esc(asset(c.img)) + '" alt="' + esc(c.name) + '" loading="lazy">' : '<span class="cert-ph">' + ICON.cert + "</span>") +
        "<b>" + esc(c.name) + "</b><span>" + esc(c.note || "") + "</span></div>";
    }).join("");
  })();

  // ---------- scroll reveal ----------
  (function () {
    var els = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { io.observe(el); });
  })();

  // ---------- parallax (group photo) ----------
  (function () {
    var imgs = document.querySelectorAll(".parallax");
    if (!imgs.length || reduceMotion) return;
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      imgs.forEach(function (img) {
        var box = img.parentElement.getBoundingClientRect();
        if (box.bottom < -100 || box.top > vh + 100) return;
        var speed = parseFloat(img.getAttribute("data-speed")) || 0.07;
        var offset = (box.top + box.height / 2 - vh / 2) * -speed;
        img.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
      });
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update);
    update();
  })();

  // ---------- back to top ----------
  (function () {
    var b = $("toTop");
    if (!b) return;
    function toggle() { b.classList.toggle("show", window.scrollY > 700); }
    window.addEventListener("scroll", toggle, { passive: true });
    b.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });
    toggle();
  })();
})();
