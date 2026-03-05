/**
 * precision-animations.js
 * Lightweight scroll/load animations for Precision Consulting Group
 * Zero dependencies — vanilla JS + CSS only (replaces GSAP + ScrollTrigger)
 *
 * Sections covered:
 *  1. CSS injection (keyframes, transitions, hover effects)
 *  2. Reduced-motion guard
 *  3. Background orb
 *  4. Hero on-load sequence
 *  5. Scroll-reveal (IntersectionObserver)
 *  6. Stagger index assignment
 */

(function () {
  'use strict';

  /* CSS is now in precision-runtime.css (static stylesheet) */


  /* ============================================================
     2. REDUCED-MOTION GUARD
     ============================================================ */

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;


  /* ============================================================
     3. BACKGROUND ORB
     ============================================================ */

  var orb = document.createElement('div');
  orb.className = 'precision-bg-orb';
  orb.setAttribute('aria-hidden', 'true');
  document.body.appendChild(orb);


  /* ============================================================
     4. HERO ON-LOAD SEQUENCE
     Headline → subtext → CTA → stats card, staggered fade-up
     ============================================================ */

  var heroSelectors = [
    { sel: '.hero-headline',  delay: '0.1s' },
    { sel: '.hero-subtext',   delay: '0.3s' },
    { sel: '.hero-cta-row',   delay: '0.5s' },
    { sel: '.hero-stats-card', delay: '0.7s' }
  ];

  heroSelectors.forEach(function (item) {
    var el = document.querySelector(item.sel);
    if (!el) return;
    el.classList.add('hero-animate');
    el.style.setProperty('--hero-delay', item.delay);
  });

  // Trigger after paint
  if (!prefersReducedMotion) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        heroSelectors.forEach(function (item) {
          var el = document.querySelector(item.sel);
          if (el) el.classList.add('is-visible');
        });
      });
    });
  } else {
    // Show immediately for reduced-motion users
    heroSelectors.forEach(function (item) {
      var el = document.querySelector(item.sel);
      if (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    });
  }


  /* ============================================================
     5. SCROLL REVEAL — IntersectionObserver
     ============================================================ */

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    // Collect all scroll-reveal targets
    var revealTargets = [
      { selector: '.why-card', stagger: true },
      { selector: '.case-study-card', stagger: true },
      { selector: '.section-header', stagger: false }
    ];

    revealTargets.forEach(function (group) {
      var els = document.querySelectorAll(group.selector);
      if (!els.length) return;

      // Assign stagger index
      els.forEach(function (el, i) {
        el.classList.add('scroll-reveal');
        if (group.stagger) {
          el.style.setProperty('--stagger', i);
        }
      });

      // Observe
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px -15% 0px' });

      els.forEach(function (el) { observer.observe(el); });
    });
  } else {
    // No observer or reduced motion: show everything
    document.querySelectorAll('.why-card, .case-study-card, .section-header').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }


  /* ============================================================
     6. GRACEFUL DEGRADATION
     Remove any leftover .gsap-hidden classes from old markup
     ============================================================ */

  document.querySelectorAll('.gsap-hidden').forEach(function (el) {
    el.classList.remove('gsap-hidden');
  });

})();
