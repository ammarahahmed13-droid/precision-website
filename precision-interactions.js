/**
 * precision-interactions.js
 * All interactive elements — no jQuery, no GSAP dependency (standalone)
 *
 * Sections:
 *  1. ROI Calculator — live calculation from 3 sliders
 *  2. Conversion Accelerator — auto-cycling tabs + click pause
 *  3. Mobile hamburger menu toggle
 *  4. Mobile carousel arrows — Why Precision, Testimonials, Services
 */

(function () {
  'use strict';

  /* ============================================================
     UTILITIES
     ============================================================ */

  /** Format a number as $1,234,567 */
  function formatCurrency(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  /** Format a number as $1,234 (no decimals) */
  function formatNum(n) {
    return Math.round(n).toLocaleString('en-US');
  }

  /** Brief flash animation on a value element when it updates */
  function flashUpdate(el) {
    el.classList.remove('value-flash');
    // Force reflow
    void el.offsetWidth;
    el.classList.add('value-flash');
  }

  /** Inject global style for flash + carousel arrows + hamburger overlay */
  (function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Value flash on calculator update */
      @keyframes precision-flash {
        0%   { opacity: 1; }
        30%  { opacity: 0.4; }
        100% { opacity: 1; }
      }
      .value-flash {
        animation: precision-flash 0.35s ease forwards;
      }

      /* Carousel nav row — prev on left, next on right */
      .carousel-nav {
        display: flex;
        justify-content: space-between;
        margin-top: 16px;
        padding: 4px 16px;
      }

      /* Carousel arrow buttons */
      .carousel-arrow {
        position: relative;
        z-index: 10;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(11,11,30,0.85);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.2s, background 0.2s;
        flex-shrink: 0;
      }
      .carousel-arrow:hover {
        border-color: rgba(0,191,255,0.5);
        background: rgba(0,191,255,0.08);
      }
      .carousel-arrow.is-hidden { visibility: hidden; pointer-events: none; }
      .carousel-arrow svg { display: block; }

      /* ROI trend arrow ↗ */
      .roi-trend-arrow {
        font-size: 0.8rem;
        color: #00BFFF;
        opacity: 0.75;
        margin-left: 4px;
        vertical-align: middle;
        display: inline-block;
      }

      /* Hamburger nav overlay */
      .mobile-nav-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(11,11,30,0.97);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        z-index: 99;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0;
        padding: 80px 24px 40px;
      }
      .mobile-nav-overlay.is-open {
        display: flex;
      }
      .mobile-nav-overlay .mobile-nav-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        width: 100%;
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .mobile-nav-overlay .mobile-nav-link {
        display: block;
        width: 100%;
        text-align: center;
        padding: 16px 24px;
        font-size: 1.25rem;
        font-weight: 600;
        color: #D1D5DC;
        text-decoration: none;
        border-radius: 16px;
        transition: color 0.18s, background 0.18s;
      }
      .mobile-nav-overlay .mobile-nav-link:hover,
      .mobile-nav-overlay .mobile-nav-link:focus {
        color: #fff;
        background: rgba(255,255,255,0.06);
      }
      .mobile-nav-overlay .mobile-nav-link--cta {
        background: #FFD166;
        color: #0B0B1E;
        border: none;
        border-radius: 999px;
        font-weight: 600;
        box-shadow: 0 0 24px rgba(255,209,102,0.35);
        margin-top: 16px;
      }
      .mobile-nav-overlay .mobile-nav-link--cta:hover,
      .mobile-nav-overlay .mobile-nav-link--cta:focus {
        background: #FFD166;
        color: #0B0B1E;
        opacity: 0.92;
      }
      .mobile-nav-close {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        background: transparent;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 50%;
        color: #D1D5DC;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        line-height: 1;
        transition: border-color 0.18s, color 0.18s;
      }
      .mobile-nav-close:hover { border-color: rgba(255,255,255,0.3); color: #fff; }

      /* Accelerator panel fade transition — handled by .acc-panel-wrap.is-transitioning in main CSS */

      /* ROI range slider thumb (cross-browser) */
      .roi-range::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #00BFFF;
        border: none;
        cursor: pointer;
        box-shadow: 0 0 8px rgba(0,191,255,0.5);
      }
    `;
    document.head.appendChild(style);
  })();


  /* ============================================================
     1. ROI CALCULATOR
     3 sliders → live computation → animated value updates
     ============================================================ */

  (function initROICalculator() {
    const visitorsInput = document.getElementById('monthly-visitors');
    const crInput       = document.getElementById('conversion-rate');
    const aovInput      = document.getElementById('avg-order-value');

    if (!visitorsInput || !crInput || !aovInput) return;

    // Display elements for current slider values
    const visitorsDisplay = visitorsInput.closest('.roi-field').querySelector('.roi-current-value');
    const crDisplay       = crInput.closest('.roi-field').querySelector('.roi-current-value');
    const aovDisplay      = aovInput.closest('.roi-field').querySelector('.roi-current-value');

    // Output elements
    const baselineEl     = document.querySelector('.roi-baseline-value');
    const conservativeEl = document.querySelector('.roi-scenario-value--cyan');
    const achievableEl   = document.querySelector('.roi-scenario-value--purple');
    const optimalEl      = document.querySelector('.roi-scenario-value--magenta');
    const maxAnnualEl    = document.querySelector('.roi-maximum-value');

    /** Update the visual fill gradient of a range input */
    function updateSliderFill(input) {
      const min = parseFloat(input.min);
      const max = parseFloat(input.max);
      const val = parseFloat(input.value);
      const pct = ((val - min) / (max - min)) * 100;
      input.style.background =
        'linear-gradient(to right, #00BFFF ' + pct + '%, rgba(255,255,255,0.1) ' + pct + '%)';
    }

    /** Run all calculations and update DOM */
    function calculate() {
      const v   = parseFloat(visitorsInput.value);
      const cr  = parseFloat(crInput.value) / 100;
      const aov = parseFloat(aovInput.value);

      // Slider display labels
      if (visitorsDisplay) {
        visitorsDisplay.textContent = v >= 1000000
          ? '1M'
          : v >= 1000
          ? (v / 1000).toFixed(0) + 'k'
          : v.toString();
      }
      if (crDisplay) {
        crDisplay.textContent = parseFloat(crInput.value).toFixed(1) + '%';
      }
      if (aovDisplay) {
        aovDisplay.textContent = '$' + formatNum(aov);
      }

      // Core calculations
      const baseline     = v * cr * aov;
      const conservative = baseline * 0.20;              // 20% CR improvement
      const achievable   = baseline * 0.40;              // 40% CR improvement
      const optimalBase  = v * (cr * 1.40) * (aov * 1.35); // 40% CR + 35% AOV
      const optimal      = optimalBase - baseline;
      const maxAnnual    = optimal * 12;

      // Update outputs with flash animation
      function updateEl(el, value) {
        if (!el) return;
        const newText = formatCurrency(value);
        if (el.textContent !== newText) {
          el.textContent = newText;
          flashUpdate(el);
        }
      }

      function updateLift(el, value) {
        if (!el) return;
        const newText = '+' + formatCurrency(value);
        if (el.textContent !== newText) {
          el.textContent = newText;
          flashUpdate(el);
        }
      }

      updateEl(baselineEl, baseline);
      updateLift(conservativeEl, conservative);
      updateLift(achievableEl, achievable);
      updateLift(optimalEl, optimal);
      updateEl(maxAnnualEl, maxAnnual);

      // Refresh slider fills
      updateSliderFill(visitorsInput);
      updateSliderFill(crInput);
      updateSliderFill(aovInput);
    }

    // Attach event listeners
    [visitorsInput, crInput, aovInput].forEach(function (input) {
      input.addEventListener('input', calculate);
      updateSliderFill(input); // initial fill
    });

    // Run once on init to populate outputs
    calculate();
  })();


  /* ============================================================
     2. CONVERSION ACCELERATOR — SIDEBAR + PANEL TABS
     Sidebar nav on left, panel content on right.
     Auto-advances every 3.5s. Click pauses 20s then resumes.
     Accent color updates via CSS custom properties on #acc-wrapper.
     ============================================================ */

  (function initAcceleratorTabs() {
    var PHASES = [
      {
        phase: 'Phase 01', period: 'Month 1', title: 'Deep Dive Audit',
        body: 'In-depth analysis of platform analytics, user behavior, and customer journey to identify high-impact opportunities.',
        deliverables: ['Comprehensive audit report', 'User journey mapping', 'Competitive benchmarking', '90-day experimentation roadmap'],
        goal: 'Accelerating your growth through prioritized, psychology-backed execution.',
        color: '#22D3EE', colorBg: 'rgba(34,211,238,0.12)', colorBorder: 'rgba(34,211,238,0.22)',
      },
      {
        phase: 'Phase 02', period: 'Month 1–2', title: 'Quick Fixes',
        body: 'Rapid deployment of high-impact, low-effort wins identified in the audit — generating immediate conversion lift with minimal overhead.',
        deliverables: ['Priority quick-win implementation', 'Copy & CTA optimisations', 'UX friction removal', 'Baseline A/B test setup'],
        goal: 'Building early momentum and stakeholder confidence through fast, visible results.',
        color: '#7C3AED', colorBg: 'rgba(124,58,237,0.12)', colorBorder: 'rgba(124,58,237,0.22)',
      },
      {
        phase: 'Phase 03', period: 'Months 2–4', title: 'Experimentation',
        body: 'Structured, hypothesis-driven A/B testing across your highest-impact conversion points, validated to statistical significance before scaling.',
        deliverables: ['2–3 A/B tests per month', 'Statistical significance reporting', 'Winner documentation & rollout', 'Funnel-level conversion analysis'],
        goal: 'Building a validated evidence base that makes every future growth decision data-backed.',
        color: '#8B5CF6', colorBg: 'rgba(139,92,246,0.12)', colorBorder: 'rgba(139,92,246,0.22)',
      },
      {
        phase: 'Phase 04', period: 'Months 5–6', title: 'Optimisation',
        body: 'Scaling validated winners across the full funnel, introducing segment-based personalisation, and optimising the end-to-end customer journey.',
        deliverables: ['Winning variant rollout at scale', 'Segment-based personalisation', 'Lifecycle & retention optimisation', 'Revenue-per-visitor benchmarking'],
        goal: 'Compounding gains from every validated test into sustainable, measurable revenue growth.',
        color: '#F97316', colorBg: 'rgba(249,115,22,0.12)', colorBorder: 'rgba(249,115,22,0.22)',
      },
      {
        phase: 'Phase 05', period: 'Ongoing', title: 'Scaling Playbook',
        body: 'A documented, repeatable growth system your team can run independently — with continued oversight, quarterly strategy reviews, and a living playbook.',
        deliverables: ['Full growth playbook documentation', 'Team training & knowledge transfer', 'Quarterly strategy reviews', 'Performance benchmarking dashboard'],
        goal: 'Building internal capability so your growth compounds long after our engagement ends.',
        color: '#EC4899', colorBg: 'rgba(236,72,153,0.12)', colorBorder: 'rgba(236,72,153,0.22)',
      },
    ];

    var wrapper      = document.getElementById('acc-wrapper');
    var sidebarItems = document.querySelectorAll('.acc-sidebar-item');
    var panelWrap    = document.getElementById('acc-panel-wrap');

    if (!wrapper || !sidebarItems.length || !panelWrap) return;

    var currentIndex = 0;
    var autoTimer    = null;
    var pauseTimer   = null;
    var AUTO_INTERVAL  = 3500;
    var PAUSE_DURATION = 20000;

    var arrowSVG =
      '<svg width="18" height="18" viewBox="0 0 18 18" fill="none">' +
      '<path d="M3 9h12M9 3l6 6-6 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';

    function renderPhase(index) {
      var p = PHASES[index];
      if (!p) return;

      var checkSVG =
        '<svg width="12" height="12" viewBox="0 0 12 12" fill="none">' +
        '<path d="M2 6l3 3 5-5.5" stroke="' + p.color + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>';

      var deliverableCards = p.deliverables.map(function(d) {
        return (
          '<div class="acc-deliverable">' +
          '<span class="acc-deliverable-check">' + checkSVG + '</span>' +
          d +
          '</div>'
        );
      }).join('');

      panelWrap.innerHTML =
        '<div class="acc-panel-badges">' +
        '  <span class="acc-panel-period-badge">' + p.period + '</span>' +
        '  <span class="acc-panel-phase-label">' + p.phase + '</span>' +
        '</div>' +
        '<div class="acc-panel-main">' +
        '  <h3 class="acc-panel-title">' + p.title + '</h3>' +
        '  <p class="acc-panel-desc">' + p.body + '</p>' +
        '  <div class="acc-deliverables">' + deliverableCards + '</div>' +
        '</div>' +
        '<div class="acc-goal-card">' +
        '  <div class="acc-goal-arrow-btn" aria-hidden="true">' + arrowSVG + '</div>' +
        '  <h4 class="acc-goal-title">Phase Goal</h4>' +
        '  <p class="acc-goal-text">' + p.goal + '</p>' +
        '  <div class="acc-goal-progress"><div class="acc-goal-progress-fill" style="width:' + ((index + 1) * 20) + '%"></div></div>' +
        '</div>';
    }

    function activateTab(index) {
      var p = PHASES[index];
      if (!p) return;

      // Update CSS accent color on wrapper
      wrapper.style.setProperty('--acc-color',        p.color);
      wrapper.style.setProperty('--acc-color-bg',     p.colorBg);
      wrapper.style.setProperty('--acc-color-border', p.colorBorder);

      // Update sidebar active states
      sidebarItems.forEach(function(item, i) {
        item.classList.toggle('acc-sidebar-item--active', i === index);
        item.setAttribute('aria-selected', i === index ? 'true' : 'false');
        item.setAttribute('tabindex', i === index ? '0' : '-1');
      });

      // Fade out → update content → fade in
      panelWrap.classList.add('is-transitioning');
      setTimeout(function() {
        renderPhase(index);
        panelWrap.classList.remove('is-transitioning');
      }, 200);

      currentIndex = index;
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoTimer = setInterval(function() {
        activateTab((currentIndex + 1) % sidebarItems.length);
      }, AUTO_INTERVAL);
    }

    function stopAutoPlay() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    function pauseAndResume() {
      stopAutoPlay();
      if (pauseTimer) clearTimeout(pauseTimer);
      pauseTimer = setTimeout(startAutoPlay, PAUSE_DURATION);
    }

    sidebarItems.forEach(function(item, i) {
      item.addEventListener('click', function() { activateTab(i); pauseAndResume(); });
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateTab(i); pauseAndResume(); }
      });
    });

    // Init: render phase 0, start auto-play
    activateTab(0);
    startAutoPlay();
  })();


  /* ============================================================
     3. MOBILE HAMBURGER MENU
     Toggles a full-screen nav overlay built from existing nav links
     ============================================================ */

  (function initHamburger() {
    const hamburger = document.querySelector('.header-hamburger');
    if (!hamburger) return;

    // Build overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    overlay.setAttribute('id', 'mobile-nav');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Mobile navigation');

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-nav-close';
    closeBtn.setAttribute('aria-label', 'Close navigation menu');
    closeBtn.innerHTML = '&#x2715;'; // ×
    overlay.appendChild(closeBtn);

    // Nav links (mirror from header)
    const NAV_LINKS = [
      { text: 'Home',       href: '#' },
      { text: 'About Us',   href: '#why-precision' },
      { text: 'Partners',   href: '#services' },
      { text: 'FAQs',       href: '/faq' },
      { text: 'Book a Call', href: '#cta-contact', cta: true },
    ];

    const navList = document.createElement('ul');
    navList.className = 'mobile-nav-list';
    navList.setAttribute('role', 'list');

    NAV_LINKS.forEach(function (link) {
      const li = document.createElement('li');
      const a  = document.createElement('a');
      a.href      = link.href;
      a.textContent = link.text;
      a.className = 'mobile-nav-link' + (link.cta ? ' mobile-nav-link--cta' : '');
      li.appendChild(a);
      navList.appendChild(li);
    });

    overlay.appendChild(navList);
    document.body.appendChild(overlay);

    /** Open overlay */
    function openMenu() {
      overlay.classList.add('is-open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    /** Close overlay */
    function closeMenu() {
      overlay.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }

    hamburger.addEventListener('click', function () {
      if (overlay.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    closeBtn.addEventListener('click', closeMenu);

    // Close on overlay link click
    navList.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeMenu();
      }
    });
  })();


  /* ============================================================
     4. MOBILE CAROUSEL ARROWS
     Injects prev/next arrow buttons into carousel wrappers.
     Arrow logic:
       - First card visible: hide prev, show next
       - Last card visible:  show prev, hide next
       - Middle:             show both
     Applied to: #why-precision, #testimonials, #services
     ============================================================ */

  (function initCarousels() {

    /**
     * Make a section's grid scrollable as a carousel on mobile.
     * @param {string} sectionId   - The section element ID
     * @param {string} trackSelector - CSS selector for the scrollable grid
     */
    function buildCarousel(sectionId, trackSelector) {
      var section = document.getElementById(sectionId);
      if (!section) return;
      var track = section.querySelector(trackSelector);
      if (!track) return;

      // Wrap track in a relative container for arrow positioning
      var wrapper = document.createElement('div');
      wrapper.className = 'carousel-wrapper';
      wrapper.style.cssText = 'position:relative; width:100%;';
      track.parentNode.insertBefore(wrapper, track);
      wrapper.appendChild(track);

      // Create arrows — prevBtn is NOT added to DOM yet (only injected on scroll)
      var prevBtn = createArrowBtn('prev', 'Previous');
      var nextBtn = createArrowBtn('next', 'Next');
      var prevInNav = false;
      var nav = document.createElement('div');
      nav.className = 'carousel-nav';
      nav.style.justifyContent = 'flex-end'; // only next arrow initially
      nav.appendChild(nextBtn);
      wrapper.parentNode.insertBefore(nav, wrapper.nextSibling);

      /** Scroll track by one card width */
      function scrollBy(direction) {
        var cardWidth = track.firstElementChild
          ? track.firstElementChild.offsetWidth + parseInt(getComputedStyle(track).gap || '0')
          : 280;
        track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
      }

      prevBtn.addEventListener('click', function () { scrollBy(-1); });
      nextBtn.addEventListener('click', function () { scrollBy(1); });

      /** Update arrow visibility based on scroll position */
      function updateArrows() {
        var atStart = track.scrollLeft <= 4;
        var atEnd   = track.scrollLeft + track.clientWidth >= track.scrollWidth - 20;

        // Add prevBtn to DOM only when user has scrolled past start
        if (!atStart && !prevInNav) {
          nav.insertBefore(prevBtn, nextBtn);
          prevInNav = true;
        } else if (atStart && prevInNav) {
          nav.removeChild(prevBtn);
          prevInNav = false;
        }

        // Show/hide next arrow
        nextBtn.style.display = atEnd ? 'none' : 'flex';

        // Align nav based on which arrows are present
        if (!prevInNav && !atEnd) {
          nav.style.justifyContent = 'flex-end';       // first card: next → right
        } else if (prevInNav && atEnd) {
          nav.style.justifyContent = 'flex-start';     // last card: prev → left
        } else {
          nav.style.justifyContent = 'space-between';  // middle: both
        }
      }

      track.addEventListener('scroll', updateArrows, { passive: true });
      window.addEventListener('resize', updateArrows, { passive: true });
    }

    function createArrowBtn(direction, label) {
      var btn = document.createElement('button');
      btn.className = 'carousel-arrow carousel-arrow--' + direction;
      btn.setAttribute('aria-label', label + ' slide');
      btn.innerHTML =
        direction === 'prev'
          ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3L5 8l5 5" stroke="#D1D5DC" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>'
          : '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3l5 5-5 5" stroke="#D1D5DC" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      return btn;
    }

    // Only activate on mobile widths
    function maybeInitCarousels() {
      if (window.innerWidth < 768) {
        // Carousels are activated via CSS (horizontal scroll)
        // We just need the arrow buttons present in DOM
        buildCarousel('why-precision',        '.why-cards');
        buildCarousel('testimonials',         '.testimonials-grid');
        buildCarousel('services',             '.services-grid');
      }
    }

    // Run once — carousels built once and CSS handles the layout
    // ResizeObserver handles layout changes
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function () {
        // Only run if not already initialised
        if (!document.querySelector('.carousel-wrapper')) {
          maybeInitCarousels();
        }
      });
      ro.observe(document.body);
    } else {
      // Fallback
      window.addEventListener('load', maybeInitCarousels);
    }

    maybeInitCarousels();

  })();


})(); // end IIFE
