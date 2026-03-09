/**
 * precision-interactions.js
 * All interactive elements — no jQuery, no GSAP dependency (standalone)
 *
 * Sections:
 *  1. ROI Calculator — live calculation from 3 sliders
 *  2. Conversion Accelerator — handled by section-accelerator.html inline script
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

  /* CSS is now in precision-runtime.css (static stylesheet) */


  /* ============================================================
     DEFERRED INIT HELPER
     Runs callback only when element enters viewport (+ 200px margin)
     ============================================================ */

  function deferUntilVisible(selector, callback) {
    var el = document.querySelector(selector);
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      // Fallback: run immediately
      callback();
      return;
    }
    var observer = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        callback();
        observer.disconnect();
      }
    }, { rootMargin: '200px' });
    observer.observe(el);
  }


  /* ============================================================
     1. ROI CALCULATOR
     3 sliders → live computation → animated value updates
     ============================================================ */

  deferUntilVisible('#roi-calculator', function initROICalculator() {
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
  });


  /* ============================================================
     2. CONVERSION ACCELERATOR
     Handled entirely by the inline <script> in section-accelerator.html
     (which carries all fixes: fadeTimer, currentIndex timing, explicit
     icon colour management). Do NOT duplicate here.
     ============================================================ */


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
        // Why Precision, Testimonials, and Services each have their own
        // inline arrow JS now — no generic carousel calls needed.
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
