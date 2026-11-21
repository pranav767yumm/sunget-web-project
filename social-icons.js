// =========================================================
// FOOTER SOCIAL ICONS: BRAND HOVER EFFECT  (src/social-icons.js)
//
// Upgrades the round social icons in the footer (.sg-social):
//   - Normal: your existing look (white icon, translucent circle)
//   - Hover / tap: the official brand logo in its brand colour on a
//     glossy white circle, with a glow, zoom, a sweeping shine and a
//     gentle float + tilt.
//
// It does NOT touch your footer layout, text, links or URLs. It only
// swaps the icon artwork inside each existing link and adds the effect.
// Add ONE line to every page, just before </body>:
//     <script src="src/social-icons.js"></script>        (pages in the main folder)
//     <script src="../src/social-icons.js"></script>     (pages inside /pgs/)
//
// Icon artwork:
//   Facebook, Instagram, YouTube, WhatsApp, X: Simple Icons (CC0 licence)
//   LinkedIn: Font Awesome Free 7 (Icons: CC BY 4.0, fontawesome.com/license/free)
//   Brand names and logos belong to their respective owners.
// =========================================================
(function () {
  "use strict";

  var ICONS = {
    fb: { vb: "0 0 24 24", d: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a9 9 0 0 1 1.141.195v3.325a9 9 0 0 0-.653-.036 27 27 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.7 1.7 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647" },
    ig: { vb: "0 0 24 24", d: "M7.03.084c-1.277.06-2.149.264-2.91.563a5.9 5.9 0 0 0-2.124 1.388 5.9 5.9 0 0 0-1.38 2.127C.321 4.926.12 5.8.064 7.076s-.069 1.688-.063 4.947.021 3.667.083 4.947c.061 1.277.264 2.149.563 2.911.308.789.72 1.457 1.388 2.123a5.9 5.9 0 0 0 2.129 1.38c.763.295 1.636.496 2.913.552 1.278.056 1.689.069 4.947.063s3.668-.021 4.947-.082c1.28-.06 2.147-.265 2.91-.563a5.9 5.9 0 0 0 2.123-1.388 5.9 5.9 0 0 0 1.38-2.129c.295-.763.496-1.636.551-2.912.056-1.28.07-1.69.063-4.948-.006-3.258-.02-3.667-.081-4.947-.06-1.28-.264-2.148-.564-2.911a5.9 5.9 0 0 0-1.387-2.123 5.86 5.86 0 0 0-2.128-1.38C19.074.322 18.202.12 16.924.066 15.647.009 15.236-.006 11.977 0S8.31.021 7.03.084m.14 21.693c-1.17-.05-1.805-.245-2.228-.408a3.7 3.7 0 0 1-1.382-.895 3.7 3.7 0 0 1-.9-1.378c-.165-.423-.363-1.058-.417-2.228-.06-1.264-.072-1.644-.08-4.848-.006-3.204.006-3.583.061-4.848.05-1.169.246-1.805.408-2.228.216-.561.477-.96.895-1.382a3.7 3.7 0 0 1 1.379-.9c.423-.165 1.057-.361 2.227-.417 1.265-.06 1.644-.072 4.848-.08 3.203-.006 3.583.006 4.85.062 1.168.05 1.804.244 2.227.408.56.216.96.475 1.382.895s.681.817.9 1.378c.165.422.362 1.056.417 2.227.06 1.265.074 1.645.08 4.848.005 3.203-.006 3.583-.061 4.848-.051 1.17-.245 1.805-.408 2.23-.216.56-.477.96-.896 1.38a3.7 3.7 0 0 1-1.378.9c-.422.165-1.058.362-2.226.418-1.266.06-1.645.072-4.85.079s-3.582-.006-4.848-.06m9.783-16.192a1.44 1.44 0 1 0 1.437-1.442 1.44 1.44 0 0 0-1.437 1.442M5.839 12.012a6.161 6.161 0 1 0 12.323-.024 6.162 6.162 0 0 0-12.323.024M8 12.008A4 4 0 1 1 12.008 16 4 4 0 0 1 8 12.008" },
    li: { vb: "0 32 448 448", d: "M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3M135.4 416H69V202.2h66.5V416zM102.2 96a38.5 38.5 0 1 1 0 77 38.5 38.5 0 1 1 0-77m282.1 320h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9z" },
    yt: { vb: "0 0 24 24", d: "M23.498 6.186a3.02 3.02 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.02 3.02 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.02 3.02 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.02 3.02 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814M9.545 15.568V8.432L15.818 12z" },
    wa: { vb: "0 0 24 24", d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52s.198-.298.298-.497c.099-.198.05-.371-.025-.52s-.669-1.612-.916-2.207c-.242-.579-.487-.5-.669-.51a13 13 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074s2.096 3.2 5.077 4.487c.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413s.248-1.289.173-1.413c-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413" },
    x: { vb: "0 0 24 24", d: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" }
  };

  // which link is which network (matched on the address, so URLs stay as they are)
  var MATCH = [
    ["facebook.com", "fb"], ["instagram.com", "ig"], ["linkedin.com", "li"],
    ["youtube.com", "yt"], ["youtu.be", "yt"], ["wa.me", "wa"], ["whatsapp.com", "wa"],
    ["x.com", "x"], ["twitter.com", "x"]
  ];

  // brand colour, soft tint for the circle, glow colour
  var BRAND = {
    fb: ["#0866FF", "rgba(8,102,255,.14)", "rgba(8,102,255,.6)"],
    ig: ["#D62976", "rgba(214,41,118,.13)", "rgba(214,41,118,.6)"],
    li: ["#0A66C2", "rgba(10,102,194,.14)", "rgba(10,102,194,.6)"],
    yt: ["#FF0000", "rgba(255,0,0,.12)", "rgba(255,0,0,.55)"],
    wa: ["#25D366", "rgba(37,211,102,.16)", "rgba(37,211,102,.6)"],
    x:  ["#000000", "rgba(0,0,0,.10)", "rgba(255,255,255,.55)"]
  };

  var CSS = [
    /* the circle: keeps your existing size/border, adds what the effect needs */
    ".sg-footer .sg-social a.sg-so{position:relative;overflow:hidden;isolation:isolate;-webkit-tap-highlight-color:transparent;",
    "transition:transform .35s cubic-bezier(.2,.8,.2,1),background .3s ease,color .3s ease,border-color .3s ease,box-shadow .35s ease}",
    ".sg-footer .sg-social a.sg-so svg{position:relative;z-index:1;transition:transform .35s ease,fill .3s ease}",

    /* the shine that sweeps across (hidden until hover) */
    ".sg-footer .sg-social a.sg-so::after{content:'';position:absolute;z-index:2;top:-15%;bottom:-15%;left:0;width:55%;pointer-events:none;",
    "background:linear-gradient(100deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.95) 50%,rgba(255,255,255,0) 100%);",
    "transform:translateX(-160%) skewX(-18deg);opacity:0}",

    /* hover (mouse), keyboard focus and touch/tap */
    ".sg-footer .sg-social a.sg-so:hover,.sg-footer .sg-social a.sg-so:focus-visible,.sg-footer .sg-social a.sg-so:active,.sg-footer .sg-social a.sg-so.is-tap{",
    "color:var(--so-brand);border-color:#fff;",
    "background:linear-gradient(145deg,#ffffff 25%,var(--so-tint) 100%);",
    "transform:translateY(-5px) scale(1.18);",
    "box-shadow:0 0 0 4px var(--so-ring),0 12px 28px var(--so-glow),0 0 24px var(--so-glow);",
    "animation:sgSoFloat 2.4s ease-in-out .35s infinite}",

    ".sg-footer .sg-social a.sg-so:hover::after,.sg-footer .sg-social a.sg-so:focus-visible::after,.sg-footer .sg-social a.sg-so:active::after,.sg-footer .sg-social a.sg-so.is-tap::after{",
    "opacity:1;animation:sgSoShine 2.4s ease-in-out .1s infinite}",

    ".sg-footer .sg-social a.sg-so:hover svg,.sg-footer .sg-social a.sg-so:focus-visible svg,.sg-footer .sg-social a.sg-so:active svg,.sg-footer .sg-social a.sg-so.is-tap svg{",
    "animation:sgSoTilt 1.8s ease-in-out .3s infinite}",

    /* Instagram gets its official multi-colour gradient */
    ".sg-footer .sg-social a.sg-ig:hover svg path,.sg-footer .sg-social a.sg-ig:focus-visible svg path,.sg-footer .sg-social a.sg-ig:active svg path,.sg-footer .sg-social a.sg-ig.is-tap svg path{fill:url(#sgIgGradient)}",

    "@keyframes sgSoFloat{0%,100%{transform:translateY(-5px) scale(1.18)}50%{transform:translateY(-9px) scale(1.18)}}",
    "@keyframes sgSoTilt{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}",
    "@keyframes sgSoShine{0%{transform:translateX(-160%) skewX(-18deg)}38%,100%{transform:translateX(330%) skewX(-18deg)}}",

    /* reduce motion: keep colour + zoom, drop the movement */
    "@media (prefers-reduced-motion:reduce){",
    ".sg-footer .sg-social a.sg-so:hover,.sg-footer .sg-social a.sg-so:focus-visible,.sg-footer .sg-social a.sg-so:active,.sg-footer .sg-social a.sg-so.is-tap{animation:none}",
    ".sg-footer .sg-social a.sg-so:hover svg,.sg-footer .sg-social a.sg-so:focus-visible svg,.sg-footer .sg-social a.sg-so:active svg,.sg-footer .sg-social a.sg-so.is-tap svg{animation:none}",
    ".sg-footer .sg-social a.sg-so::after{display:none}}"
  ].join("");

  function init() {
    var links = document.querySelectorAll(".sg-social a");
    if (!links.length) return;

    // style sheet (added once)
    if (!document.getElementById("sg-social-css")) {
      var st = document.createElement("style");
      st.id = "sg-social-css";
      st.appendChild(document.createTextNode(CSS));
      document.head.appendChild(st);
    }

    // Instagram gradient definition (added once, kept out of the layout)
    if (!document.getElementById("sgIgGradient")) {
      var defs = document.createElement("div");
      defs.setAttribute("aria-hidden", "true");
      defs.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
      defs.innerHTML =
        '<svg width="0" height="0" focusable="false"><defs><linearGradient id="sgIgGradient" x1="0" y1="1" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#FEDA75"/><stop offset=".25" stop-color="#FA7E1E"/><stop offset=".5" stop-color="#D62976"/>' +
        '<stop offset=".75" stop-color="#962FBF"/><stop offset="1" stop-color="#4F5BD5"/></linearGradient></defs></svg>';
      document.body.appendChild(defs);
    }

    Array.prototype.forEach.call(links, function (a) {
      var href = (a.getAttribute("href") || "").toLowerCase(), key = null;
      for (var i = 0; i < MATCH.length; i++) {
        if (href.indexOf(MATCH[i][0]) !== -1) { key = MATCH[i][1]; break; }
      }
      if (!key || !ICONS[key]) return;                      // unknown network: leave it alone

      var ic = ICONS[key], br = BRAND[key];
      a.classList.add("sg-so", "sg-" + key);
      a.style.setProperty("--so-brand", br[0]);
      a.style.setProperty("--so-tint", br[1]);
      a.style.setProperty("--so-glow", br[2]);
      a.style.setProperty("--so-ring", br[2].replace(/[\d.]+\)$/, ".22)"));

      // swap ONLY the artwork; href, target, rel, title and aria-label stay as they were
      var old = a.querySelector("svg");
      var svg = '<svg viewBox="' + ic.vb + '" fill="currentColor" aria-hidden="true" focusable="false"><path d="' + ic.d + '"/></svg>';
      if (old) old.outerHTML = svg; else a.insertAdjacentHTML("afterbegin", svg);
    });

    // touch screens: show the effect on tap, and let iOS react to :active
    var box = document.querySelector(".sg-social");
    if (box) {
      box.addEventListener("touchstart", function () {}, { passive: true });
      box.addEventListener("pointerdown", function (e) {
        if (e.pointerType === "mouse") return;
        var a = e.target.closest("a.sg-so");
        if (!a) return;
        a.classList.add("is-tap");
        setTimeout(function () { a.classList.remove("is-tap"); }, 1100);
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
