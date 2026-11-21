/* SunGET: shows text/pictures edited in the admin page. Add at the END of <body> on every page:
   <script src="../src/sg-content.js"></script>   (for index.html use src/sg-content.js) 
(function () {
  var C = {
    SUPABASE_URL: "https://lsfwdoyqxlblvxlxwmbi.supabase.co",
    SUPABASE_ANON_KEY: "sb_publishable_CjdM1_XUqYWaPeTxs6AmJA_5qBtSW9u"
  };
  var page = (location.pathname.split("/").pop() || "index").replace(/\.html?$/i, "") || "index";
  if (!C.SUPABASE_URL) return;
  var root = document.querySelector("main") || document.body;
  var els = [].filter.call(root.querySelectorAll("h1,h2,h3,h4,p,img"), function (e) { return e.tagName === "IMG" || (e.children.length === 0 && e.textContent.trim()); });
  fetch(C.SUPABASE_URL + "/rest/v1/page_content?page=eq." + encodeURIComponent(page) + "&select=key,value", { headers: { apikey: C.SUPABASE_ANON_KEY } })
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (rows) {
      var m = {}; rows.forEach(function (r) { m[r.key] = r.value; });
      els.forEach(function (e, i) {
        var v = m[e.tagName.toLowerCase() + ":" + i]; if (v == null) return;
        if (e.tagName === "IMG") { e.removeAttribute("srcset"); e.removeAttribute("loading"); e.src = v; } else e.textContent = v;
      });
    }).catch(function () {});
})();
*/