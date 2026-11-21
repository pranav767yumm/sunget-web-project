/* Adds photos uploaded from the admin page to the top of the gallery.
   Your 30 existing photos in gallery.html stay as they are. Must load BEFORE the gallery's own inline script. */
(function () {
  var c = window.SG_CONFIG || {};
  var g = document.getElementById("gGrid");
  if (!g || !c.SUPABASE_URL || !c.SUPABASE_ANON_KEY) return;
  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  try {
    var x = new XMLHttpRequest();
    x.open("GET", c.SUPABASE_URL + "/rest/v1/photos?select=*&order=created_at.desc", false); // synchronous on purpose: gallery script runs right after
    x.setRequestHeader("apikey", c.SUPABASE_ANON_KEY);
    x.send();
    if (x.status !== 200) return;
    var rows = JSON.parse(x.responseText);
    if (!rows.length) return;
    g.insertAdjacentHTML("afterbegin", rows.map(function (p) {
      return '<button type="button" class="g-item" data-cat="' + esc(p.cat) + '" data-full="' + esc(p.src) + '">' +
        '<img src="' + esc(p.thumb || p.src) + '" alt="' + esc(p.title) + '" loading="lazy" decoding="async" />' +
        '<span class="g-zoom" aria-hidden="true">+</span>' +
        '<span class="g-cap"><strong>' + esc(p.title) + '</strong><em>' + esc(p.place) + '</em></span></button>';
    }).join(""));
  } catch (e) { /* if anything fails, the normal gallery still shows */ }
})();
