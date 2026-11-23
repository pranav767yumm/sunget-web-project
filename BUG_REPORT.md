# SunGET website — review, bug report and test report

Review date: 20 November 2026 · Scope: all 48 files in the uploaded project (16 HTML pages,
22 JS files, 12 CSS files, `launch.json`). The `images/` folder was **not** part of the
upload, so image files could not be checked (see §7).

Status values: **Fixed** = changed and covered by a test or a static check ·
**Fixed (untested)** = changed, but it needs the live database/images to confirm ·
**Manual** = needs a decision or access that only the owner has.

---

## 1. Critical bugs (leads lost / pages broken)

| # | Bug | File(s) | Problem | Fix | Status |
|---|---|---|---|---|---|
| C1 | Water-heater contact form lost every lead | solar-water-heater.html | Form had no handler and a duplicate `id="leadForm"`; submitting did a native GET reload — nothing saved, customer details ended up in the URL | Form uses the shared `data-sg-enquiry` handler; estimator uses its own class/id | Fixed |
| C2 | Heat pump, O&M, Energy Audit, CSR, EPC contact forms never saved | those 5 pages | Pages loaded `src/leads.js`, which does not exist; forms showed an error (or nothing) and saved nothing | All use `sg-config.js` + `sg-enquiry.js` | Fixed |
| C3 | Rooftop page: two forms with `id="leadForm"` | solar-rooftop.html | The estimator was saved as a junk enquiry and the real contact form did a GET reload with personal data in the URL | Estimator is `<form class="rt-est">` and never submits; one real lead form | Fixed |
| C4 | Success message shown even when saving failed | script.js, sg-enquiry.js | Toast appeared regardless of the HTTP result | Success only on HTTP 2xx; error toast with phone number otherwise | Fixed |
| C5 | Missing stylesheet | solar-water-heater.html | Linked `waterheatr.css` (typo) → 404, page unstyled | File renamed to `waterheater.css`, link fixed | Fixed |
| C6 | Missing stylesheet | solar-rooftop.html | Linked `rooftop-guide.css`, which does not exist | Link removed; styles live in `rooftop.css` | Fixed |
| C7 | Broken navigation links on every sub-page | all pgs/*.html | Menu linked to `project-gallery.html` and `our-team.html` (do not exist); mobile menu used `pgs/…` links from inside `pgs/` (→ `pgs/pgs/…`); footer links and `#process/#contact/#solutions` anchors pointed to sections that only exist on the home page | One generated nav/footer (`tools/build.py`) with correct relative paths; anchors go to `../index.html#…` where needed; checked by a link scanner | Fixed |
| C8 | JavaScript crash on pages without the mobile menu | script.js | Escape key handler threw `TypeError` when `#mobileMenu` was missing | Null guards | Fixed |
| C9 | Careers page loaded missing scripts | careers.html | `leads.js` and `sg-extras.js` do not exist (404 + console errors) | Removed; logic moved to `src/careers.js` | Fixed |
| C10 | Gallery froze the page | gallery.html | Three **synchronous** XHR requests to Supabase blocked the browser while loading | Asynchronous `fetch` in `src/gallery.js` | Fixed |
| C11 | Gallery empty when the database had no photos | gallery.html | The built-in photos had been removed from the HTML, so a fresh/failed database showed an empty page | Falls back to the 30 built-in photos (`images/gallery/ (1..30).jpg`) unless the admin has imported them | Fixed (images not in upload) |
| C12 | Utility products page: menu and calculator broken | solar-utility-products.html | Page did not load `script.js`; its own copy of the menu code conflicted with the shared CSS | Loads `script.js`; duplicate menu code removed | Fixed |
| C13 | Mobile hero form opened off-screen | sg-design.css | Entrance animation's `transform` overrode the mobile pop-up position | Animation limited to ≥769 px | Fixed |
| C14 | Pop-ups every 10 seconds, forever | popup.js | 10 s first delay, 10 s gap, 10 rounds, and never suppressed after a form was sent (`SUBMIT_DAYS = 0`) | 15 s / 60 s / once per visit / none for 7 days after any successful form | Fixed |

## 2. Major bugs

| # | Bug | File(s) | Problem | Fix | Status |
|---|---|---|---|---|---|
| M1 | Heat-pump card linked to the rooftop page | index.html | Wrong `href` | → `pgs/heat-pump.html` | Fixed |
| M2 | Heat-pump and rooftop "process" sections showed water-heater text | heat-pump.html, solar-rooftop.html | Copy-paste content | Rewritten for each product | Fixed |
| M3 | Pop-up images swapped | popup.js | Heat-pump pop-up used the water-heater image and vice-versa; absolute paths | Swapped back; relative paths | Fixed (images not in upload) |
| M4 | Enquiry type wrong in admin | sg-enquiry.js | Keyword guessing labelled e.g. heat-pump "house" enquiries as "Residential Solar" | Page type wins; guessing only on rooftop/EPC pages; `data-sg-type` override | Fixed |
| M5 | Rooftop subsidy rounded down | rooftop.js | 1.5 kW got the 1 kW subsidy | Pro-rata PM Surya Ghar: ₹30k/kW up to 2 kW, ₹18k for the 3rd, max ₹78k | Fixed |
| M6 | Location (PIN) button erased its own icon | hero-form.js | Button text replaced its SVG while loading | Loading state uses a CSS class | Fixed |
| M7 | Broken `<img>` markup | index.html | `<img … "Client Partner 2">` (missing `alt=`) | Corrected | Fixed |
| M8 | Broken image paths on About | about_us.html, team-data.js | `src="/images/our-team-images/"` (folder, no file) and root-absolute `/images/…` paths that fail when the site is not at the domain root | Real image / relative paths | Fixed |
| M9 | Visible developer note on the live About page | about_us.html | "Edit this text in about_us.html…" shown to visitors | Turned into an HTML comment | Fixed |
| M10 | "Explore careers" opened the mail app | about_us.html | `mailto:` instead of the careers page | → `careers.html` | Fixed |
| M11 | Careers: roles stuck on "Loading open roles…" when the request failed | careers.html | Error silently ignored | Fallback message; tested with a 500 response | Fixed |
| M12 | Careers: any file type accepted as a resume | careers.html | Only `accept=` (bypassable) | JS checks .pdf/.doc/.docx and 5 MB | Fixed |
| M13 | Logo ticker jumped | style.css | Animation maths assumed 7 logos; there are 8 (clients) and 6 (brands) | Uses `--slides` per ticker; seamless loop | Fixed |
| M14 | Calculator background images never applied / overridden | script.js, style.css | Dead `BG_IMAGES` code; one theme hot-linked a third-party image | Theme classes only, hot-link removed | Fixed |
| M15 | Calculator WhatsApp button usable before a calculation | script.js | Sent an empty message | `aria-disabled` until a result exists | Fixed |
| M16 | Privacy policy page had its own copy of all site CSS + its own menu script | privacy-policy.html | Overrode `style.css`, mobile menu broken, no calculator | Page-specific CSS only; shared scripts | Fixed |
| M17 | Privacy policy referred to a non-existent "Cookie Policy" and a "Last updated" date that was not there | privacy-policy.html | Misleading legal text | Sentence rewritten to describe what the site actually stores (browser storage for pop-ups); date added | Fixed — **legal review: Manual** |
| M18 | Sticky product toolbar hidden under the sticky nav | solar-utility-products.html | `top:0` | `top:62px` (static on phones) | Fixed |
| M19 | Product detail showed a broken image when a product had no photo | solar-utility-products.html | `<img src="">` | Placeholder icon | Fixed |
| M20 | Admin product form stuck on "Saving…" | sun.html | Invalid JSON threw after the button was disabled | Validated first, clear error, button restored | Fixed |
| M21 | Admin CSV import reported success before anything was saved | sun.html | Requests fired without waiting; invalid JSON crashed the loop | Waits for all rows; reports saved/failed/skipped | Fixed (untested against DB) |
| M22 | Admin "Pages" edits are never shown on the site | sg-content.js | The file was entirely commented out in the upload | Rewritten safely (text only, http(s) images only) but left **disabled**; admin shows a notice | Manual (see README §6) |
| M23 | Certificates could not be opened with the keyboard | certifications.html | `<div onclick>` | `<button data-full>`; focus returns after closing | Fixed |
| M24 | Dropdown menus not keyboard accessible | all pages | `<a>` without `href` as toggles | `<button aria-expanded>` toggles | Fixed |
| M25 | Gallery/admin built-in photo paths only worked at the domain root | gallery, admin | `/images/gallery/…` | Converted to `../images/…` when displayed | Fixed |

## 3. Minor bugs

| # | Bug | File(s) | Fix | Status |
|---|---|---|---|---|
| m1 | Missing/meaningless `alt` text on many images | index, about, gallery | Added; decorative images `alt=""` | Fixed |
| m2 | Form fields without labels (placeholder only) | all lead forms, careers | Visually hidden `<label>`s / `aria-label` | Fixed |
| m3 | Duplicate CSS blocks (hero mobile, mascot, pf-section, sg-badge, rt-guide) | style.css, waterheater.css | Deduplicated | Fixed |
| m4 | Footer typos "primier", "creat" | footer | Corrected | Fixed |
| m5 | Footer badge path with a space not encoded | footer | `FOOTER%20(1).jpeg` | Fixed |
| m6 | Dangling "•" and empty "Terms" link in footer | footer | Removed | Fixed |
| m7 | X (Twitter) icon linked to the x.com home page | footer | Hidden until a real profile URL is added | Manual |
| m8 | Certifications page had no meta description; obsolete `align` attribute | certifications.html | Added / removed | Fixed |
| m9 | Inline `onclick`/`onerror` handlers | certifications, about | Replaced by event listeners (no inline JS anywhere now) | Fixed |
| m10 | Grammar on service pages ("a investment", "soft water supply") | rooftop, water heater | Corrected | Fixed |
| m11 | Team data: founder in wrong category, "/" shown as a skill, placeholder LinkedIn links | team-data.js | Corrected; empty links hidden | Fixed |
| m12 | Tabs not operable with arrow keys; one tab script controlled all tab groups | rooftop.js | Scoped per tablist; ←/→/Home/End | Fixed |
| m13 | Heading levels skipped (h2 → h4) on certifications | certifications.html | Proper h2/h3 | Fixed |
| m14 | No `robots.txt` / `sitemap.xml`; no canonical/OG tags on sub-pages | — | Added | Fixed |
| m15 | Stats differ between pages: home "12+ yrs / 800+ homes / 50 MW+", About & EPC "10+ yrs / 60,000+ homes / 200 MW+" | index, about_us, solar-epc | **Not changed** – only the company knows the correct figures | Manual |
| m16 | "Rated 4.8 on Google, 25+ ratings" is hard-coded | index.html | Not changed; keep it in sync with the Google profile | Manual |

## 4. Security issues

| # | Issue | Where | Fix | Status |
|---|---|---|---|---|
| S1 | Database protection depends entirely on RLS | Supabase | The publishable key is public by design. `supabase/schema.sql` defines insert-only access to lead tables, read-only access to published content, admin-only everything else, private `resumes` bucket | **Manual – apply & verify** |
| S2 | Supabase key duplicated in 5 files | gallery, careers, utility products, admin, enquiry | One place: `src/sg-config.js` (still the publishable key — no secret was ever in the code, and none was added) | Fixed |
| S3 | Unpinned third-party script | solar-utility-products.html | `@supabase/supabase-js@2` from a CDN (any future 2.x would run on the site) → replaced with plain `fetch` | Fixed |
| S4 | Personal Gmail address exposed in a `mailto:` cc | index.html | Removed | Fixed |
| S5 | Pre-ticked consent checkbox | index.html hero form | Unticked by default (consent must be active under the DPDP Act) | Fixed |
| S6 | Unsafe URLs from the database | gallery, products, about, content | Only `http(s)` or relative URLs accepted; text inserted with `textContent`/escaping | Fixed (tested with `javascript:` URLs) |
| S7 | Spreadsheet formula injection in exports | admin Excel/CSV export | Cells starting with `= + - @` are prefixed with `'` | Fixed |
| S8 | Admin page is "hidden" only | pgs/sun.html | `noindex` + `robots.txt` disallow; real protection is S1 + disabling public sign-ups | Manual |
| S9 | SheetJS 0.18.5 from cdnjs | sun.html | Known advisories affect *parsing* untrusted files; the admin only *writes* exports. Consider self-hosting a current SheetJS build with an SRI hash | Manual (low) |
| S10 | Spam on lead forms | all forms | Honeypot field + validation + DB length limits (schema.sql). A CAPTCHA (e.g. Cloudflare Turnstile) needs a server-side check — not added | Manual (optional) |

## 5. Performance

| # | Issue | Fix | Status |
|---|---|---|---|
| P1 | Synchronous network requests on the gallery | Async (C10) | Fixed |
| P2 | Whole supabase-js SDK (~100 KB) loaded for 4 REST calls | Removed (S3) | Fixed |
| P3 | Hot-linked third-party images (Webflow, gstatic, iStock preview with watermark) | Replaced with images already used elsewhere on the site | Fixed |
| P4 | Gallery full-size images loaded up-front | Lazy loading + preload on hover/focus | Fixed |
| P5 | Animations ignored "reduce motion" | Tickers, gallery, hero video respect `prefers-reduced-motion` | Fixed |
| P6 | Images are not optimised (size unknown – folder not provided) | Convert large JPG/PNG to WebP, max ~1600 px wide | Manual |

## 6. Testing report

**Environment:** headless Google Chrome via Playwright, site served by a local static
server. **All Supabase requests were intercepted and answered by mocks** (success and
HTTP 500 failure); no real database was contacted. External fonts/CDNs/Unsplash were
stubbed. The `images/` folder was absent, so image 404s were expected and excluded.

Result: **100 of 100 automated checks passed** (after fixing two mistakes in the test
script itself). The suite is included as `tools/test_site.py` so it can be re-run.

| Area | What was checked | Result |
|---|---|---|
| Syntax | `node --check` on all 24 JS files; JSON-LD parses | Pass |
| Links | Every `href`/`src` in all 16 pages resolves to an existing file (except images/); every `#anchor` exists; no duplicate `id`s; every `<img>` has `alt`; no inline scripts/handlers | Pass |
| Page load | 16 pages × desktop 1366 px, tablet 820 px, mobile 390 px: no JS errors, no horizontal overflow | 48/48 pass |
| Mobile menu | Opens, `aria-expanded`, Escape closes, all links valid (4 pages) | Pass |
| Calculator | Opens; WhatsApp button disabled until a result, then links to wa.me with the estimate; Escape closes (3 pages) | Pass |
| Lead forms | 8 service pages: valid lead → correct row posted (phone normalised to 10 digits, correct enquiry type), success toast, no reload; HTTP 500 → error toast | 16/16 pass |
| Validation | Invalid phone and honeypot → nothing sent; estimator form never submits | Pass |
| Estimator | Rooftop size and subsidy for ₹1,080/2,160/2,700/3,240/5,400 bills → 1/2/2.5/3/5 kW, ₹30k/60k/69k/78k/78k | Pass |
| Home hero form | Saves lead; consent not pre-ticked | Pass |
| Careers | Roles load into grid and dropdown; .exe resume rejected; PDF uploaded + row saved; failure message when roles API fails | Pass |
| Gallery | 30 built-in photos fallback with correct paths; lightbox keyboard; admin-only mode after import; `javascript:` URL dropped; HTML in titles escaped | Pass |
| Utility products | Renders from REST API without SDK; details + specs tab; phone validation; enquiry saved with product name; sticky offset | Pass |
| Certifications | Keyboard opens certificate, Escape closes, focus returns; press stack advances | Pass |
| About | Team renders; no edit note; careers link; no broken/absolute image paths | Pass |
| Admin | Enter-key login (mocked), dashboard (10 cards), Pages editor + "live editing off" notice, invalid-JSON handling | Pass |

**Not tested (cannot be, without access):**
* Real Supabase: table columns, RLS policies, storage uploads, admin authentication.
  The request shapes are unchanged from the original code apart from the fixes above, but
  they still need one real end-to-end submission per form after deployment.
* Images, logo, videos (folder not uploaded) — layout was checked with images missing.
* Real devices / Safari / Firefox (only Chromium was available).
* Excel export file contents, CSV import, drag-and-drop ordering in the admin.

## 7. Remaining manual configuration / decisions

1. **Copy the `images/` folder** into the project root — `IMAGES_REQUIRED.txt` lists the 110 paths used.
2. **Apply and verify RLS** with `supabase/schema.sql` (review first; it was reconstructed from the code). Remove any older permissive policies.
3. **Make admin users admins** (`app_metadata.role = 'admin'`) and **disable public sign-ups** in Supabase Auth.
4. Make the `resumes` storage bucket private and set a 5 MB limit.
5. After deploying, send one test enquiry from every form and check it in the admin.
6. Decide the correct company figures (years, homes, MW) and make them consistent (m15).
7. Add the real X/Twitter profile URL or leave the icon removed (m7).
8. Have the privacy policy reviewed (DPDP Act 2023); confirm `info@sungetsolarinfra.com` is a monitored mailbox; confirm `hr@sungetsolarinfra.com` exists.
9. Check that the PM Surya Ghar subsidy amounts in `src/rooftop.js` are still current before relying on them.
10. Admin "Pages" live editing stays off until you re-check saved edits (README §6).
11. Team photos/bios in `src/team-data.js` — replace any remaining placeholders.
12. Optional: self-host SheetJS (S9), add a CAPTCHA (S10), convert images to WebP (P6).
