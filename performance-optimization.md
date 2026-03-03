# Precision Website — Page Load Speed Optimization

## Baseline Scores (March 4, 2026)
### Mobile
- **Performance: 38** (critical) | Accessibility: 86 | Best Practices: 77 | SEO: 92

| Metric | Value | Status |
|--------|-------|--------|
| FCP | 8.4s | Red |
| LCP | 36.1s | Red — catastrophic |
| TBT | 760ms | Red |
| CLS | 0 | Green |
| Speed Index | 10.4s | Red |

### Desktop
- **Performance: 63** (orange) | Accessibility: 88 | Best Practices: 77 | SEO: 92
- Captured: Mar 4, 2026 12:41 AM GMT+4 | Lighthouse 13.0.1 | HeadlessChromium 144.0.7559.132

| Metric | Value | Status |
|--------|-------|--------|
| FCP | 1.0s | Orange |
| LCP | 1.3s | Orange |
| TBT | 1,410ms | Red — main bottleneck |
| CLS | 0.08 | Green |
| Speed Index | 1.4s | Orange |

### Desktop vs Mobile Key Differences
- LCP is 27x faster on desktop (1.3s vs 36.1s) — mobile network throttling is the killer
- TBT is actually WORSE on desktop (1,410ms vs 760ms) — same JS bloat, less throttled so it executes faster but blocks longer
- CLS slightly worse on desktop (0.08 vs 0) — likely from image layout shifts at larger viewport
- Accessibility 88 vs 86 — desktop slightly better (mobile menu trigger issue doesn't apply)

## Desktop-Specific Image Findings
### Improve Image Delivery — Est savings 5,434 KiB (desktop)
Total 1st-party: 5,548.4 KiB resource → 5,433.8 KiB savings

| Image | File | Resource | Savings | Native | Displayed | WebP Savings | Resize Savings |
|-------|------|----------|---------|--------|-----------|-------------|---------------|
| Weave Social | logo-weave-social-scaled.png | 2,538.7 KiB | 2,538.2 KiB | 2560x1919 | 59x44 | 1,739.1 KiB | 2,537.3 KiB |
| Rask | logo-rask-scaled.png | 610.7 KiB | 609.7 KiB | 2560x803 | 140x44 | 276.1 KiB | 608.9 KiB |
| Hero dashboard (LCP) | hero-dashboard-v2.png | 549.5 KiB | 500.4 KiB | 1448x1391 | 560x538 | 221.6 KiB | 467.3 KiB |
| Case study (food) | case-study-value-proposition.webp | 368.9 KiB | 340.4 KiB | 2048x1149 | 426x426 | — | 340.4 KiB |
| Case study (q-comm) | case-study-scaling-revenue.webp | 352.8 KiB | 325.5 KiB | 2048x1149 | 426x426 | — | 325.5 KiB |
| Snapp Express | logo-snapp-express-scaled.png | 271.0 KiB | 270.7 KiB | 2560x1450 | 78x44 | — | 270.7 KiB |
| Delivery Hero | logo-delivery-hero-scaled.png | 248.0 KiB | 247.7 KiB | — | — | — | — |
| Alibaba Group | logo-alibaba-group.png | 181.5 KiB | 180.7 KiB | 1424x602 | 104x44 | 42.0 KiB | 180.5 KiB |
| Talabat | logo-talabat-scaled.png | 114.0 KiB | 113.8 KiB | 2560x889 | 127x44 | — | 113.8 KiB |
| Star Rapid | logo-star-rapid-v2.png | 81.7 KiB | 80.5 KiB | 1268x176 | 231x32 | 45.4 KiB | 79.0 KiB |
| Foodpanda | logo-foodpanda.png | 81.6 KiB | 80.9 KiB | 1280x650 | 114x58 | — | 80.9 KiB |
| Daraz | logo-daraz.png | 45.7 KiB | 45.0 KiB | 1024x455 | 131x58 | — | 45.0 KiB |
| Bazaar | logo-bazaar.png | 38.4 KiB | 37.7 KiB | 438x369 | 74x62 | 12.1 KiB | 37.3 KiB |
| InstaGopher | logo-instagopher.png | 36.8 KiB | 35.2 KiB | 479x96 | 220x44 | 29.3 KiB | 29.1 KiB |
| GrowthMentor | logo-growthmentor.png | 17.0 KiB | 16.0 KiB | 421x79 | 181x34 | 11.6 KiB | 13.9 KiB |
| Petal | logo-petal.png | 12.2 KiB | 11.2 KiB | (partial) | (partial) | 7.8 KiB (est) | — |

- Hero dashboard on desktop: `width="1184" height="1058" loading="eager"` — has dimensions but still oversized
- Both case study images: already WebP but still massively oversized (2048x1149 displayed at 426x426)
- Logos with `-scaled` suffix: WordPress auto-scaled to 2560px — need manual resize + re-upload
- Logos without `-scaled` (alibaba, foodpanda, daraz, bazaar, star-rapid, instagopher, growthmentor, petal): still oversized but smaller originals

### Desktop Render-Blocking Requests — Est savings 700ms
Requests blocking the page's initial render, delaying LCP and FCP.

| Source | Files | Transfer Size | Duration |
|--------|-------|--------------|----------|
| **goprecision.co (1st Party)** | 5 files | **37.1 KiB** | **760ms** |
| — frontend-layer.min.css?ver=177... | | 20.1 KiB | 240ms |
| — components/style.min.css?ver=6.9.1 | | 13.4 KiB | 100ms |
| — build/latest.css?ver=2.0.2 | | 2.0 KiB | 140ms |
| — bricks-child/style.css?ver=177... | | 0.8 KiB | 140ms |
| — css/style-manager.min.css?ver=177... | | 0.8 KiB | 140ms |
| **JSDelivr CDN** | 3 files | **19.2 KiB** | **640ms** |
| — precision-styles.css | | 10.2 KiB | 240ms |
| — precision-tokens.css | | 3.7 KiB | 200ms |
| — precision-mobile.css | | 5.3 KiB | 200ms |
| **Google Fonts CDN** | 1 file | **1.5 KiB** | **200ms** |
| — Inter (wght@300-900, display=swap) | | 1.5 KiB | 200ms |

**Total: 9 render-blocking requests, 57.8 KiB, ~1,600ms combined (700ms est savings after optimization)**

### Desktop Forced Reflow — 183ms total (Unscored)
Forced reflows occur when JS queries geometric properties (offsetWidth etc.) after style invalidation.

**Top function call:** GSAP ScrollTrigger.min.js:11:17321 — 3ms

| Source | Total Reflow Time |
|--------|------------------|
| [unattributed] | 14ms |
| goprecision.co:1380:19 (1st party JS) | 24ms |
| goprecision.co:2902:19 (1st party JS) | 37ms |
| goprecision.co:3787:19 (1st party JS) | 41ms |
| ScrollTrigger.min.js:10:16743 | 49ms |
| ScrollTrigger.min.js:10:33734 | 2ms |
| ScrollTrigger.min.js:10:13363 | 2ms |
| gsap.min.js:10:55073 | 7ms |
| ScrollTrigger.min.js:10:9918 | 1ms |
| gsap.min.js:10:59619 | 0ms |
| ScrollTrigger.min.js:10:3496 | 1ms |
| GTM gtm.js:643:376 | 2ms |

- **1st-party goprecision.co**: 102ms (3 inline scripts at lines 1380, 2902, 3787 — likely header/section JS doing DOM measurements)
- **GSAP/ScrollTrigger**: 62ms (ScrollTrigger reflows are expected — reads scroll positions)
- **GTM**: 2ms (negligible)
- **Unattributed**: 14ms

### Desktop LCP Request Discovery
LCP element: hero-dashboard-v2.png (`<img>` tag)
- `width="1184" height="1058" loading="eager"`
- **Lazy load not applied** — correct (green check)
- **`fetchpriority=high` NOT applied** — needs fix (red X)
- **Request is discoverable in initial document** — correct (green check)
- Alt text: "Conversion performance dashboard showing +58% growth over 6 months with CR Rate..."

### Desktop Network Dependency Tree — Max Critical Path: 5,414ms
**Critical chain (LCP-blocking):**
```
Initial Navigation
└── https://goprecision.co — 133ms, 38.37 KiB
    └── components/style.min.css?ver=6.9.1 (goprecision.co) — 750ms, 13.42 KiB
        └── /6 (m.stripe.com) — 5,414ms, 0.72 KiB
```
- **Stripe is the tail of the critical dependency chain** — it's loaded as a dependency of components/style.min.css
- Removing Stripe would cut critical path from **5,414ms → ~883ms** (133 + 750)
- This confirms Stripe removal is the #1 priority fix

### Desktop 3rd-Party Resource Breakdown (Full Inventory)

| 3rd Party | Tag | Transfer Size | Main Thread Time |
|-----------|-----|--------------|-----------------|
| **Calendly** | Other | **3,537 KiB** | **1,710ms** |
| — booking-757b50672.js (assets.calendly.com) | | 2,320 KiB | 1,657ms |
| — pxwebj3qd.js (assets.calendly.com) | | 142 KiB | 37ms |
| — external/widget.js (assets.calendly.com) | | 5 KiB | 8ms |
| — 246-bc9c5d1e2.chunk.js | | 12 KiB | 2ms |
| — /ammarah-bumx/30min?embed_domain=... (calendly.com) | | 5 KiB | 2ms |
| — 284-c06726a22.chunk.js | | 3 KiB | 1ms |
| — 363-ac716c00e.chunk.js | | 3 KiB | 1ms |
| — 462-59de337c9.chunk.js | | 3 KiB | 1ms |
| — 41-f45527172.chunk.js | | 3 KiB | 1ms |
| — booking/initial_settings (calendly.com) | | 4 KiB | 0ms |
| — css/booking-7705ad762.css (assets.calendly.com) | | 1,038 KiB | 0ms |
| **Stripe** | Utility | **459 KiB** | **399ms** |
| — /v3 (js.stripe.com) | | 425 KiB | 255ms |
| — /inner.html (m.stripe.network) | | 0 KiB | 99ms |
| — /out-4.5.45.js (m.stripe.network) | | 29 KiB | 44ms |
| — /inner.html (m.stripe.network) | | 3 KiB | 1ms |
| — /6 (m.stripe.com) | | 1 KiB | 0ms |
| **Google Tag Manager** | Tag-Manager | **269 KiB** | **278ms** |
| — /gtag/js?id=G-34JWPG0P71&cx=c&gtm=4e6320 | | 150 KiB | 150ms |
| — /gtm.js?id=GTM-PVCW885H | | 119 KiB | 128ms |
| **Cloudflare CDN** | Cdn | **42 KiB** | **61ms** |
| — gsap.min.js (v3.12.5) | | 26 KiB | 39ms |
| — ScrollTrigger.min.js (v3.12.5) | | 17 KiB | 22ms |
| **GoDaddy** | Utility | **29 KiB** | **50ms** |
| — scc-c2/scc-c2.min.js (img1.wsimg.com) | | 21 KiB | 42ms |
| — js/tccl-tti.min.js (img1.wsimg.com) | | 0 KiB | 7ms |
| — tti/tti.min.js (img1.wsimg.com) | | 8 KiB | 0ms |
| **JSDelivr CDN** | Cdn | **32 KiB** | **23ms** |
| — precision-animations.js | | 4 KiB | 18ms |
| — precision-interactions.js | | 8 KiB | 5ms |
| — precision-styles.css | | 10 KiB | 0ms |
| — precision-mobile.css | | 5 KiB | 0ms |
| — precision-tokens.css | | 4 KiB | 0ms |
| **myftpupload.com** | — | **7 KiB** | **0ms** |
| — precision-logo.svg | | 5 KiB | 0ms |
| — icon-arrow-right.svg | | 1 KiB | 0ms |
| **Google Fonts** | Cdn | **50 KiB** | **0ms** |
| — Inter woff2 (fonts.gstatic.com) | | 48 KiB | 0ms |
| — /css2?family=Inter:wght@300-900&display=swap | | 2 KiB | 0ms |
| **Google Analytics** | Analytics | **1 KiB** | **0ms** |
| — /g/collect?v=... (analytics.google.com) | | 1 KiB | 0ms |
| **secureserver.net** | — | **1 KiB** | **0ms** |
| — /eventbus/web?clientid=b18ef4f... (csp.secureserver.net) | | 0 KiB | 0ms |
| — /eventbus/web?clientid=8da2217... (csp.secureserver.net) | | 0 KiB | 0ms |

**Total 3rd-party: ~4,496 KiB transfer, ~2,521ms main thread time**
- Calendly alone: 79% of 3P transfer size, 68% of 3P main thread time
- Stripe: 10% transfer, 16% main thread
- GTM: 6% transfer, 11% main thread

### Desktop JS Execution Time — 2.5s total (TBT-impacting)

| Source | Tag | Total CPU Time | Script Eval | Script Parse |
|--------|-----|---------------|-------------|-------------|
| **Calendly** | Other | **1,726ms** | **988ms** | **718ms** |
| — booking-757b50672.js | | 1,726ms | 988ms | 718ms |
| **Stripe** | Utility | **573ms** | **291ms** | **135ms** |
| — /v3 (js.stripe.com) | | 398ms | 136ms | 122ms |
| — /inner.html (m.stripe.network) | | 111ms | 110ms | 0ms |
| — /out-4.5.45.js (m.stripe.network) | | 63ms | 45ms | 13ms |
| **goprecision.co** | 1st Party | **458ms** | **37ms** | **9ms** |
| — https://goprecision.co (inline scripts) | | 458ms | 37ms | 9ms |
| **Cloudflare CDN** | Cdn | **357ms** | **50ms** | **15ms** |
| — gsap.min.js | | 274ms | 34ms | 10ms |
| — ScrollTrigger.min.js | | 82ms | 16ms | 5ms |
| **Google Tag Manager** | Tag-Manager | **287ms** | **193ms** | **88ms** |
| — /gtag/js?id=G-34JWPG0P71&cx=c&gtm=4e6320 | | 151ms | 107ms | 43ms |
| — /gtm.js?id=GTM-PVCW885H | | 136ms | 86ms | 45ms |
| **Unattributable** | — | **269ms** | **4ms** | **0ms** |
| — (browser internals / layout / GC) | | 269ms | 4ms | 0ms |

- **Total accounted: ~3,670ms** (Calendly 47% + Stripe 16% + 1P 12% + GSAP 10% + GTM 8% + Unattributable 7%)
- 1st-party 458ms CPU time but only 37ms eval + 9ms parse = 412ms is **other work** (DOM manipulation, layout, reflows from inline section JS)
- Calendly booking JS is single biggest offender: 1,726ms CPU from ONE file
- Unattributable 269ms with only 4ms eval — likely browser layout/paint/GC work triggered by other scripts

### Desktop Minimize Main-Thread Work — 3.9s total (TBT-impacting)

| Category | Time Spent |
|----------|-----------|
| Script Evaluation | 1,672ms |
| Script Parsing & Compilation | 1,039ms |
| Other | 508ms |
| Style & Layout | 286ms |
| Garbage Collection | 187ms |
| Rendering | 165ms |
| Parse HTML & CSS | 59ms |

- **Total: 3,916ms** (vs 4,300ms on mobile — desktop is ~9% faster due to less CPU throttling)
- Script work (eval + parse) = **2,711ms** = 69% of all main-thread work
- Removing Calendly (1,726ms) + Stripe (573ms) = 2,299ms savings → would reduce to ~1,617ms total
- Style & Layout (286ms) + Rendering (165ms) = 451ms — reasonable for page complexity

### Desktop Images Missing Explicit Width/Height (CLS-impacting, Unscored)
All social proof logos missing `width` and `height` attributes — each appears ×3 (3 marquee sets):
- Weave Social (×3): logo-weave-social-scaled.png
- Snapp Express (×3): logo-snapp-express-scaled.png
- Delivery Hero (×3): logo-delivery-hero-scaled.png
- Talabat (×2+ visible): logo-talabat-scaled.png
- (list continues — same logos as mobile audit Issue #12)

### Desktop Minify CSS — Est savings 3 KiB (Unscored)
| URL | Source | Transfer Size | Est Savings |
|-----|--------|--------------|-------------|
| precision-mobile.css | JSDelivr CDN | 5.3 KiB | 2.9 KiB |

### Desktop Minify JavaScript — Est savings 2 KiB (LCP, FCP, Unscored)
| URL | Source | Transfer Size | Est Savings |
|-----|--------|--------------|-------------|
| precision-interactions.js | JSDelivr CDN | 7.2 KiB | 2.2 KiB |

### Desktop Reduce Unused CSS — Est savings 13 KiB (LCP, FCP, Unscored)
| URL | Source | Transfer Size | Est Savings |
|-----|--------|--------------|-------------|
| components/style.min.css?ver=6.9.1 | goprecision.co (1st Party) | 12.8 KiB | 12.7 KiB |

- Note: Mobile audit showed Calendly booking CSS as 518.4 KiB unused — desktop shows only 1P CSS here
- Calendly CSS (1,038 KiB) likely not flagged separately because it's loaded by Calendly's own embed, not by the page

### Desktop Reduce Unused JavaScript — Est savings 2,210 KiB (LCP, FCP, Unscored)
| URL | Source | Transfer Size | Est Savings |
|-----|--------|--------------|-------------|
| **Stripe** | Utility | **211.9 KiB** (×2) | **153.5 KiB** (×2) |
| — /v3 (js.stripe.com) | | 211.9 KiB | 153.5 KiB |
| — /v3 (js.stripe.com) | | 211.9 KiB | 153.5 KiB |
| **Google Tag Manager** | Tag-Manager | **267.2 KiB** | **111.5 KiB** |
| — /gtag/js?id=G-34JWPG0P71&cx=c&gtm=4e6320 | | 149.1 KiB | 56.4 KiB |
| — /gtm.js?id=GTM-PVCW885H | | 118.1 KiB | 55.1 KiB |
| **goprecision.co** | 1st Party | **37.9 KiB** | **33.3 KiB** |
| — bricks.min.js?ver=177... | | 37.9 KiB | 33.3 KiB |

- Stripe /v3 loaded TWICE — 211.9 KiB each, 153.5 KiB unused each
- Calendly JS not shown here (loaded via embed, not page JS) — but 2,320 KiB booking JS is mostly unused on initial load
- bricks.min.js has 88% unused code (33.3 of 37.9 KiB)

### Desktop Enormous Network Payloads — Total 10,114 KiB
| Source | Transfer Size |
|--------|--------------|
| **goprecision.co (1st Party)** | **4,695.1 KiB** |
| — logo-weave-social-scaled.png | 2,539.3 KiB |
| — logo-rask-scaled.png | 611.3 KiB |
| — hero-dashboard-v2.png | 550.1 KiB |
| — case-study-value-proposition.webp | 369.5 KiB |
| — case-study-scaling-revenue.webp | 353.4 KiB |
| — logo-snapp-express-scaled.png | 271.6 KiB |
| **Calendly** | **3,357.8 KiB** |
| — booking-757b50672.js (×2) | 1,159.9 KiB + 1,159.9 KiB |
| — css/booking-7705ad762.css (×2) | 519.0 KiB + 519.0 KiB |

- **Total page payload: 10,114 KiB** (vs 9,399 KiB on mobile — desktop loads slightly more due to larger image renders)
- 1P images: 46% of total payload
- Calendly: 33% of total payload
- Calendly booking JS and CSS each loaded **TWICE** (duplicate resources confirmed on desktop too)

### Desktop Long Main-Thread Tasks — 12 found (TBT-impacting, Unscored)

| Source | Tag | Total Duration |
|--------|-----|---------------|
| **Calendly** | Other | **1,673ms** |
| — /pxwebj3qd.js | Start: 7,470ms | 868ms |
| — booking-757b50672.js | Start: 2,279ms | 805ms |
| **Stripe** | Utility | **539ms** |
| — /v3 (js.stripe.com) | Start: 8,978ms | 147ms |
| — /v3 (js.stripe.com) | Start: 8,858ms | 120ms |
| — /v3 (js.stripe.com) | Start: 7,352ms | 118ms |
| — /out-4.5.45.js | Start: 629ms | 95ms |
| — /out-4.5.45.js | Start: 570ms | 59ms |
| **Google Tag Manager** | Tag-Manager | **231ms** |
| — /gtag/js?id=G-34JWPG0P71 | Start: 1,645ms | 148ms |
| — /gtm.js?id=GTM-PVCW885H | Start: 1,123ms | 83ms |
| **Cloudflare CDN** | Cdn | **132ms** |
| — gsap.min.js | Start: 907ms | 67ms |
| — gsap.min.js | Start: 842ms | 65ms |
| **goprecision.co** | 1st Party | **64ms** |
| — https://goprecision.co (inline) | Start: 359ms | 64ms |

- **12 long tasks total** (vs 9 on mobile) — desktop has more because Stripe /v3 fires 3 separate long tasks
- Calendly pxwebj3qd.js starts at 7.47s and blocks for 868ms — single worst task
- Calendly booking JS starts at 2.28s and blocks for 805ms — second worst
- Stripe /v3 fires 3 times (147ms + 120ms + 118ms) — suggests retry or multi-instance loading
- GSAP fires 2 long tasks (67ms + 65ms) — both during initial page setup (~900ms)
- 1st-party inline JS: 64ms at 359ms — early page setup (header/section DOM work)

### Desktop Non-Composited Animations — 6 animated elements found (CLS, Unscored)
All in the Accelerator section sidebar. Unsupported CSS property: `color` (not GPU-compositable).

| Element | Class | Unsupported Property |
|---------|-------|---------------------|
| "Quick Fixes" | `<span class="acc-sidebar-name">` | color |
| "Deep Dive Audit" | `<span class="acc-sidebar-name">` | color |
| "MONTH 1" | `<span class="acc-sidebar-period">` | color |
| "MONTH 1–2" | `<span class="acc-sidebar-period">` | color |
| (icon wrap) | `<div class="acc-sidebar-icon-wrap" aria-hidden="true">` | color |
| (icon wrap) | `<div class="acc-sidebar-icon-wrap" aria-hidden="true">` | color |

- **6 elements on desktop** (vs 2 on mobile) — desktop shows all sidebar items; mobile collapses to icons only
- All are `color` transitions on text/icon elements in the accelerator sidebar
- Fix: Use `opacity` transition instead of `color`, or accept the minor jank (unscored)

### Desktop Accessibility — Score: 88

#### ARIA: `[role]`s not contained by required parent element (Failing)
Failing Elements:
- `<article class="srv-card srv-card--cyan" role="listitem">` — "The Deep Dive" service card
- `<div class="srv-popular-wrap" role="listitem">` — "The CRO Sprint" popular card wrapper
- `<article class="srv-card srv-card--crimson" role="listitem">` — "The Conversion Accelerator" service card

All three have `role="listitem"` without a `role="list"` parent container.

#### ARIA: `[aria-hidden="true"]` elements contain focusable descendants (Failing)
Failing Elements:
- `<div class="fdr-card-overlay" aria-hidden="true">` — Founder bio section card overlay
  - Contains: "FOUNDER & LEAD STRATEGIST Ammarah Ahmed" content
- `<a class="fdr-linkedin" href="https://www.linkedin.com/in/ammarah-ahmed/" target="_blank" rel="noopener noreferrer" aria-label="Ammarah Ahmed on LinkedIn">` — LinkedIn link inside aria-hidden container

**Desktop-specific finding**: This is a DIFFERENT element than mobile (mobile flagged the header menu trigger). Desktop flags the founder bio card overlay which has a focusable `<a>` link inside an `aria-hidden="true"` container.

---

## Issue #1: Oversized Images (~4,798 KiB savings)
Social proof logos served at 2560px wide, displayed at 40-60px:
- Weave Social: 2,539.3 KiB (2560x1919 → 53x40 display)
- Rask: 611.3 KiB (2560x803 → 128x40 display)
- Hero Dashboard: 550.1 KiB (1448x1391 → 364x350 display)
- Snapp Express: 271.6 KiB (2560x1450 → 71x40 display)
- Delivery Hero: 248.6 KiB (similarly oversized)
- All other logos similarly oversized
- **Total 1st-party image payload: 4,220.8 KiB**
### Fix
- Resize all logos to 2x their display size (e.g., 53x40 display → 106x80 export)
- Convert to WebP format
- Re-upload to WordPress Media Library
- Update URLs in `section-social-proof.html`
- **Status: NOT STARTED**

## Issue #2: Render-Blocking CSS (~1,240ms savings)
- 5 WordPress/Bricks CSS files (37.1 KiB, 3,550ms)
- 3 jsDelivr CSS files (18.9 KiB, 3,000ms) — precision-styles.css, precision-mobile.css, precision-tokens.css
- Google Fonts Inter (1.5 KiB, 780ms)
### Fix
- Defer non-critical CSS
- Inline critical above-the-fold styles
- Use `font-display: swap` on Google Fonts (already in URL but verify)
- Add preload for critical CSS
- **Status: NOT STARTED**

## Issue #3: Stripe.js (458 KiB + 5,808ms critical path)
- Stripe.js loading site-wide — no payments on the site
- It's the bottleneck in the critical dependency chain (5,808ms)
- Unused JS savings from Stripe: 307.0 KiB
- Long main-thread tasks: 440ms total (149ms + 147ms from /v3, 85ms + 59ms from out-4.5.45.js)
### Fix
- Identify and deactivate the Stripe/WooCommerce plugin in WP Admin → Plugins
- **Status: NOT STARTED**

## Issue #4: Calendly Eager Loading (3,541 KiB, 1,687ms main thread)
- Calendly widget.js + assets loading eagerly on page load
- Only needed when user scrolls to CTA section
- **Unused JS: 2,455.2 KiB transfer → 1,758.4 KiB savings** (booking JS loaded twice)
- **Unused CSS: 518.4 KiB transfer → 516.7 KiB savings** (booking CSS)
- **Long main-thread tasks: 1,420ms** (887ms + 533ms from booking JS)
- **Enormous payload: 3,360.1 KiB** (booking JS ×2: 1,160.6 KiB each; booking CSS ×2: ~519 KiB each)
- NOTE: Calendly JS is being loaded TWICE (duplicate script tags)
### Fix
- Lazy-load Calendly using IntersectionObserver — only load when CTA section enters viewport
- Remove duplicate Calendly script loads
- Update `section-cta.html` (and `section-faq.html` if applicable)
- **Status: NOT STARTED**

## Issue #5: Hero Dashboard Image (LCP Element)
- 550.1 KiB PNG (hero-dashboard-v2.png) at 1448x1391, displayed at 364x350
- Missing `fetchpriority="high"` attribute
### Fix
- Resize to ~728x700 (2x display size)
- Convert to WebP
- Add `fetchpriority="high"` and explicit `width`/`height` attributes
- Add `<link rel="preload" as="image">` in head
- Update `section-hero.html`
- **Status: NOT STARTED**

## Issue #6: No Preconnect Hints
- Zero origins preconnected
### Fix
- Add to Bricks → Settings → Custom Code (head):
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
  <link rel="preconnect" href="https://assets.calendly.com" crossorigin>
  ```
- **Status: NOT STARTED**

## Issue #7: Third-Party Script Bloat (~4.3 MB total)
| 3rd Party | Transfer Size | Main Thread Time |
|-----------|--------------|-----------------|
| Calendly | 3,541 KiB | 1,687ms |
| Stripe | 463 KiB | 373ms |
| GTM + GA4 | 268 KiB | 249ms |
| GSAP | 42 KiB | 68ms |
| GoDaddy | 29 KiB | 43ms |
| JSDelivr (ours) | 31 KiB | 19ms |

## Issue #8: Reduce JavaScript Execution Time — 2.9s total
| Source | Total | Script Eval | Parse & Compile |
|--------|-------|-------------|-----------------|
| Calendly | 2,102ms | 1,085ms | 919ms |
| Stripe | 480ms | 311ms | 163ms |
| Unattributable | 468ms | 4ms | 0ms |
| Google Tag Manager | 338ms | 207ms | 99ms |
| Cloudflare CDN (GSAP) | 315ms | 61ms | 11ms |
| goprecision.co (1st party) | 293ms | 41ms | 9ms |

## Issue #9: Minimize Main-Thread Work — 4.3s total
| Category | Time |
|----------|------|
| Script Evaluation | 1,833ms |
| Script Parsing & Compilation | 1,289ms |
| Other | 568ms |
| Style & Layout | 238ms |
| Garbage Collection | 193ms |
| Parse HTML & CSS | 77ms |
| Rendering | 61ms |

## Issue #10: Reduce Unused CSS — 529 KiB savings
- Calendly booking CSS: 518.4 KiB → 516.7 KiB savings
- goprecision.co components/style.min.css?ver=6.9.1: 12.8 KiB → 12.7 KiB savings

## Issue #11: Reduce Unused JavaScript — 2,211 KiB savings
- Calendly: 2,455.2 KiB → 1,758.4 KiB savings (booking JS ×2, pxwebj3qd.js ×2)
- Stripe: 423.7 KiB → 307.0 KiB savings (/v3 ×2)
- Google Tag Manager: 267.0 KiB → 112.2 KiB savings
- goprecision.co bricks.min.js: 37.9 KiB → 33.3 KiB savings

## Issue #12: Images Missing Explicit Width/Height
All social proof logos missing `width` and `height` attributes (causes CLS):
- Weave Social (×3 sets), Snapp Express (×3), Delivery Hero (×3), Talabat (×6), Rask (×3)
- All served as `-scaled.png` from `/wp-content/uploads/2026/02/`
### Fix
- Add explicit `width` and `height` attributes to all `<img>` tags in `section-social-proof.html`
- **Status: NOT STARTED**

## Issue #13: Minify CSS — 3 KiB savings
- precision-mobile.css (jsDelivr): 5.3 KiB → 2.9 KiB savings
### Fix
- Minify CSS files before pushing to GitHub (jsDelivr serves from repo)
- **Status: NOT STARTED**

## Issue #14: Minify JavaScript — 2 KiB savings
- precision-interactions.js (jsDelivr): 7.2 KiB → 2.2 KiB savings
### Fix
- Minify JS files before pushing to GitHub
- **Status: NOT STARTED**

## Issue #15: Enormous Network Payloads — Total 9,399 KiB
Top offenders:
- goprecision.co (1st Party): **4,220.8 KiB** (logos + hero image)
- Calendly: **3,360.1 KiB** (JS ×2, CSS ×2 — duplicates!)
- Stripe: **212.7 KiB**

## Issue #16: Long Main-Thread Tasks — 9 found
| Source | Duration | Start Time |
|--------|----------|-----------|
| Calendly booking JS | 887ms | 44,339ms |
| Calendly booking JS | 533ms | 43,612ms |
| Stripe /v3 | 149ms | 44,190ms |
| Stripe /v3 | 147ms | 49,245ms |
| Stripe out-4.5.45.js | 85ms | 2,743ms |
| GTM gtag/js | 165ms | 7,921ms |
| GTM gtm.js | 77ms | 5,258ms |
| Stripe out-4.5.45.js | 59ms | 2,592ms |
| Unattributable | 137ms | 1,132ms |

## Issue #17: Non-Composited Animations — 6 elements (desktop) / 2 elements (mobile)
- Accelerator sidebar: `acc-sidebar-name`, `acc-sidebar-period`, `acc-sidebar-icon-wrap`
- Unsupported CSS Property: `color` — color transitions aren't GPU-composited
- Desktop shows all 6 (2× name, 2× period, 2× icon-wrap); mobile only shows 2 (icon-wraps, text hidden)
### Fix
- Change color animation to use `opacity` or `transform` instead, or accept the minor CLS impact
- File: `section-accelerator.html`
- **Status: NOT STARTED**

## Issue #18: ARIA Roles on Incompatible Elements (Best Practices — Unscored)
### `<article>` elements with `role="listitem"` (invalid — `<article>` has implicit `role="article"`)
- Case Studies: `<article class="cs-card cs-card--cyan" role="listitem" aria-labelledby="cs-1-title">`
- Case Studies: `<article class="cs-card cs-card--purple" role="listitem" aria-labelledby="cs-2-title">`
- Services: `<article class="srv-card srv-card--cyan" role="listitem">`
- Services: `<article class="srv-card srv-card--crimson" role="listitem">`
### `[role]`s not in required parent element
- Services section cards have `role="listitem"` without a `role="list"` parent:
  - `<article class="srv-card srv-card--cyan" role="listitem">`
  - `<div class="srv-popular-wrap" role="listitem">`
  - `<article class="srv-card srv-card--crimson" role="listitem">`
### Fix
- **Option A**: Change `<article>` to `<div>` and keep `role="listitem"`, wrap in `role="list"` parent
- **Option B**: Remove `role="listitem"` from `<article>` tags entirely, use semantic `<ul>/<li>` wrapper
- Wrap service cards in a container with `role="list"`
- Files: `section-case-studies.html`, `section-services.html`
- **Status: NOT STARTED**

## Issue #19: `[aria-hidden="true"]` Contains Focusable Descendants (Accessibility)
### Mobile
- Header mobile menu trigger: `<div class="pcg-menu-trigger" role="button" tabindex="0" style="display: flex !important;">`
- The trigger has `tabindex="0"` (focusable) but is inside an `aria-hidden="true"` container
### Desktop
- Founder bio card: `<div class="fdr-card-overlay" aria-hidden="true">` contains focusable LinkedIn link
- `<a class="fdr-linkedin" href="https://www.linkedin.com/in/ammarah-ahmed/" target="_blank" aria-label="Ammarah Ahmed on LinkedIn">` — focusable `<a>` inside aria-hidden overlay
### Fix
- **Mobile**: Remove `aria-hidden="true"` from parent, OR remove `tabindex="0"` when menu trigger is hidden
- **Desktop**: Remove `aria-hidden="true"` from `fdr-card-overlay`, or move the LinkedIn link outside the overlay
- Files: `section-header.html` (Bricks Header Template), `section-founder.html`
- **Status: NOT STARTED**

## Issue #20: Insufficient Color Contrast (Accessibility — Multiple Sections)
### Accelerator Section (most failures — 16+ elements flagged on desktop)
- `<span class="acc-sidebar-period">` — sidebar period labels: "MONTH 1", "MONTH 1–2", "MONTHS 2–4", "ONGOING" (×4)
- `<div class="acc-wrapper" id="acc-wrapper" style="--acc-color: #F97316; --acc-color-bg: rgba(249,115,22,0.12);">` — flagged ×8 (each panel wrapper — text inside inherits low-contrast colors)
- `<span class="acc-panel-period-badge">` — "MONTHS 5–6" badge text
- `<span class="acc-panel-phase-label">` — "PHASE 04" text
- `<p class="acc-goal-text">` — "Compounding gains from every validated test into sustainable, measurable revenu..."
- `<div class="acc-goal-card">` — entire goal card container text
### ROI Calculator Section
- `<span class="roi-scenario-label">` — "MONTHLY LIFT" labels (×3 — one per scenario: +$15K, +$30K, +$66.75K)
- `<span class="roi-scenario-value roi-scenario-value--purple">` — "+$15,000" value
- `<span class="roi-scenario-value roi-scenario-value--magenta">` — "+$30,000" value
- `<div class="roi-scenario" role="listitem">` — scenario container text (×3)
- `<div class="roi-card">` — main ROI card container (×3 occurrences)
- `<div class="roi-results-panel" style="background: rgb(26, 26, 54) !important;">` — results panel text
### Services Section (3 card types, multiple elements each)
- `<span class="srv-for-label">` — "FOR YOU IF" label text (×2 — CRO Sprint + Conversion Accelerator cards)
- `<span class="srv-includes-label">` — "WHAT IT INCLUDES" label text (×2 — one per card)
- `<article class="srv-card srv-card--popular">` — CRO Sprint card container (×2)
- `<article class="srv-card srv-card--crimson" role="listitem">` — Conversion Accelerator card container (×2)
### Founder Bio Section (NEW — 3 stat labels + section)
- `<span class="fdr-stat-label">` — stat labels: "YEARS AS OPERATOR & LEADER IN CORPORATES", "TEAM MEMBERS LED", "MARKETS WORKED ACROSS" (×3)
- `<section class="pcg-founder" id="founder-bio">` — whole section flagged (×4 — once per stat context)
### CTA Section (NEW)
- `<span class="cta-checklist-label">` — "PREFER A QUICK GUIDE?" label
- `<div class="cta-checklist-link">` — "Download our Free 10-Point CRO Checklist →" link container
- `<section class="pcg-cta" id="cta-contact">` — whole CTA section container
### Footer (extensive — nearly all text/links)
- `<p class="ftr-tagline">` — tagline description
- `<p class="ftr-copyright">` — "© 2026 Precision Consulting Group LLC..."
- All `<a class="ftr-nav-link">` — About Us, Conversion Accelerator, ROI Calculator, Case Studies, FAQs, Partners
- All `<a class="ftr-nav-link ftr-social-link">` — LinkedIn, GrowthMentor, Email
- `<a class="ftr-legal-link">` — Privacy Policy, Terms of Service
### Fix
- Audit all text colors against their backgrounds using WCAG AA contrast checker (4.5:1 for normal text, 3:1 for large text)
- Likely issue: muted grays (#7B7B8E, #D1D5DC) on dark backgrounds (#0B0B1E, #1A1A36) — need to lighten text colors
- Accelerator: sidebar period text + goal text are the worst offenders (low-opacity orange/white on dark bg)
- ROI: scenario labels and values use accent colors that don't meet 4.5:1 against #1A1A36
- Services: `srv-for-label` and `srv-includes-label` use muted text colors; entire card containers flagged
- Founder Bio: `fdr-stat-label` (stat descriptor text beneath numbers) — likely muted gray on dark bg
- CTA: checklist label + link text insufficient contrast
- Footer: `ftr-nav-link` and `ftr-legal-link` colors likely too dim; entire `<footer>` element flagged
- Files: `section-accelerator.html`, `section-roi-calculator.html`, `section-services.html`, `section-founder.html`, `section-cta.html`, `section-footer.html`
- **Status: NOT STARTED**

## Issue #21: Redundant Image `alt` Text (Best Practices — Unscored)
- Header logo: `<img src="...precision-logo-..." alt="Precision" height="40" width="auto">`
- The alt text "Precision" is redundant with adjacent visible "Precision" text
### Fix
- Change to `alt=""` (decorative) since the brand name is already displayed as text, OR make alt more descriptive (e.g., "Precision Consulting Group logo")
- File: `section-header.html`
- **Status: NOT STARTED**

## Issue #22: Third-Party Cookies — Calendly (Best Practices)
- Calendly sets 2 third-party cookies: `__cf_bm` and `_cfuvid` (Cloudflare)
- Chrome DevTools also flags cookie issues from Calendly embed
### Fix
- Lazy-loading Calendly (Issue #4) will defer these cookies until user interaction
- No further action needed beyond Issue #4 fix — cookies are functional, not tracking
- **Status: BLOCKED by Issue #4**

## Issue #23: Security Headers Missing (Trust & Safety — Informational)
All unchecked:
- **CSP** (Content Security Policy) — not set
- **HSTS** (HTTP Strict Transport Security) — not set
- **COOP** (Cross-Origin Opener Policy) — not set
- **XFO/CSP** (Clickjacking protection) — not set
- **Trusted Types** (DOM XSS mitigation) — not set
### Fix
- Configure security headers at GoDaddy/server level or via WordPress plugin (e.g., "HTTP Headers" or `.htaccess`)
- Priority: HSTS + CSP are most impactful
- Note: CSP requires careful configuration to not break Calendly, GTM, GA4, GSAP, jsDelivr
- **Status: NOT STARTED** (low priority — informational only, doesn't affect scores)

## Issue #24: Missing Meta Description (SEO — Scored)
- "Document does not have a meta description"
- This is why SEO is 92 instead of 100
### Fix
- Add `<meta name="description" content="...">` via WordPress → Settings → General, or Yoast/RankMath SEO plugin, or Bricks → Settings → Custom Code (head)
- Suggested: "Precision Consulting Group — Psychology-driven CRO and Product UX/UI that transforms traffic into revenue. Book a free 30-minute discovery call."
- **Status: NOT STARTED**

---

## Desktop Audit Summary Stats
### Accessibility (Score: 88)
- Failed audits: 4 (contrast, ARIA roles, aria-hidden focusable, redundant alt)
- Additional items to manually check: 10
- Passed audits: 24
- Not applicable: 31

### Best Practices (Score: 77)
- Failed/Warning: 2 (third-party cookies, Chrome DevTools issues)
- Trust & Safety: 5 unchecked (CSP, HSTS, COOP, XFO, Trusted Types)
- Detected JS libraries: WordPress 6.9.1
- Passed audits: 11
- Not applicable: 1

### SEO (Score: 92)
- Failed: 1 (missing meta description)
- Additional items to manually check: 1

## Priority Order (by impact)
### Performance (Score: 38)
1. **Remove Stripe.js** (plugin deactivation) — eliminates 5.8s critical path + 458 KiB
2. **Resize/compress images + WebP** — ~4,800 KiB saved, fixes LCP
3. **Lazy-load Calendly + remove duplicates** — 3,541 KiB deferred, 1,420ms off main thread (also fixes #22 cookies)
4. **Hero image optimization + fetchpriority** — faster LCP
5. **Add preconnect hints** — ~500-1000ms off critical path
6. **Add width/height to images** — prevents CLS
7. **Defer render-blocking CSS** — ~1,240ms saved
8. **Minify CSS/JS** — small wins (5 KiB total)

### Accessibility (Score: 88 desktop / 86 mobile)
9. **Fix color contrast** (#20) — biggest a11y issue, 40+ elements across 7 sections (accelerator, ROI, services, founder, CTA, footer)
10. **Fix aria-hidden focusable** (#19) — mobile: header menu trigger; desktop: founder bio LinkedIn link
11. **Fix ARIA roles** (#18) — case studies + services cards (`<article>` with `role="listitem"`)

### Best Practices (Score: 77)
12. **Fix redundant alt text** (#21) — header logo
13. **Fix non-composited animations** (#17) — accelerator sidebar color transitions

### SEO (Score: 92)
14. **Add meta description** (#24) — only SEO failure, easy fix via WP or Bricks custom code

### Low Priority / Informational
15. **Security headers** (#23) — doesn't affect Lighthouse scores

## Fixes Applied
_(none yet)_
