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

  /* ============================================================
     1. CSS INJECTION
     All animations defined in CSS — JS only toggles classes
     ============================================================ */

  var style = document.createElement('style');
  style.textContent =
    /* --- Keyframes --- */
    '@keyframes fadeUp{' +
      'from{opacity:0;transform:translateY(28px)}' +
      'to{opacity:1;transform:translateY(0)}' +
    '}' +

    '@keyframes orbDrift{' +
      '0%{transform:translate(0,0);opacity:0.1}' +
      '50%{transform:translate(18vw,10vh);opacity:0.18}' +
      '100%{transform:translate(0,0);opacity:0.1}' +
    '}' +

    '@keyframes btnGlowPulse{' +
      '0%,100%{opacity:0.5;transform:scale(1)}' +
      '50%{opacity:1;transform:scale(1.1)}' +
    '}' +

    /* --- Hero on-load animation --- */
    '.hero-animate{opacity:0;transform:translateY(28px)}' +
    '.hero-animate.is-visible{' +
      'animation:fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards;' +
      'animation-delay:var(--hero-delay,0s)' +
    '}' +

    /* --- Scroll reveal --- */
    '.scroll-reveal{opacity:0;transform:translateY(40px)}' +
    '.scroll-reveal.is-visible{' +
      'animation:fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) forwards;' +
      'animation-delay:calc(var(--stagger,0) * 0.15s)' +
    '}' +

    /* --- Background orb --- */
    '.precision-bg-orb{animation:orbDrift 9s ease-in-out infinite}' +

    /* --- Button golden glow --- */
    '.btn-primary{position:relative;isolation:isolate}' +
    '.btn-primary::after{' +
      'content:"";position:absolute;inset:-16px -24px;border-radius:80px;' +
      'background:radial-gradient(ellipse at center,rgba(255,209,102,0.38) 0%,rgba(255,180,50,0.14) 42%,transparent 70%);' +
      'animation:btnGlowPulse 2.8s ease-in-out infinite;z-index:-1;pointer-events:none' +
    '}' +
    '.btn-primary:hover::after{' +
      'background:radial-gradient(ellipse at center,rgba(255,209,102,0.58) 0%,rgba(255,180,50,0.22) 42%,transparent 68%)' +
    '}' +
    '.btn-primary:hover,.header-btn:hover{' +
      'box-shadow:0 0 24px rgba(255,209,102,0.45),0 4px 28px rgba(255,209,102,0.30)!important' +
    '}' +

    /* --- Hover: Why cards --- */
    '.why-card{transition:transform 0.3s ease,box-shadow 0.3s ease,background-color 0.3s ease}' +
    '.why-card:hover{' +
      'transform:translateY(-4px);' +
      'box-shadow:0 0 0 1px rgba(255,255,255,0.2),0 16px 48px rgba(0,0,0,0.4);' +
      'background-color:rgba(25,25,55,1)' +
    '}' +
    '.why-card .why-card-icon-wrap{transition:filter 0.3s ease}' +
    '.why-card:hover .why-card-icon-wrap{filter:brightness(1.4)}' +

    /* --- Hover: Service cards --- */
    '.service-card{transition:transform 0.3s ease}' +
    '.service-card:hover{transform:scale(1.03)}' +

    /* --- Hover: Testimonial cards --- */
    '.testimonial-card{transition:transform 0.3s ease,box-shadow 0.3s ease}' +
    '.testimonial-card:hover{' +
      'transform:scale(1.02);' +
      'box-shadow:0 0 0 1px rgba(255,255,255,0.2),0 8px 32px rgba(0,0,0,0.3)' +
    '}' +

    /* --- Hover: Case study images --- */
    '.cs-card-image{transition:transform 0.4s ease}' +
    '.case-study-card:hover .cs-card-image{transform:scale(1.05)}' +

    /* --- Reduced motion: disable everything --- */
    '@media(prefers-reduced-motion:reduce){' +
      '.hero-animate{opacity:1;transform:none}' +
      '.scroll-reveal{opacity:1;transform:none}' +
      '.hero-animate.is-visible,.scroll-reveal.is-visible{animation:none}' +
      '.precision-bg-orb{animation:none}' +
      '.btn-primary::after{animation:none}' +
      '.why-card,.service-card,.testimonial-card,.cs-card-image{transition:none}' +
    '}';

  document.head.appendChild(style);


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
