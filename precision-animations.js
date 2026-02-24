/**
 * precision-animations.js
 * GSAP + ScrollTrigger animations for Precision Consulting Group
 * Dependencies: GSAP 3.x, ScrollTrigger plugin
 *
 * Sections covered:
 *  1. Init & plugin registration
 *  2. Reduced-motion guard
 *  3. Background orb
 *  4. Hero on-load sequence
 *  5. Hero floating tags (bobbing)
 *  6. Hero stats-card progress bar pulse
 *  7. Methodology cards scroll fade-up
 *  8. Case studies scroll fade-up
 *  9. Founder bio count-up stats
 * 10. Book a Call golden glow (CSS class injection)
 * 11. How-We-Work cards hover scale
 * 12. General scroll fade-up utility
 */

/* ============================================================
   1. INIT & PLUGIN REGISTRATION
   ============================================================ */

(function () {
  'use strict';

  // Graceful degradation: bail early if GSAP is not loaded
  if (typeof gsap === 'undefined') {
    console.warn('[Precision] GSAP not found — animations skipped.');
    document.querySelectorAll('.gsap-hidden').forEach(function (el) {
      el.classList.remove('gsap-hidden');
    });
    return;
  }

  // Register ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ============================================================
     2. REDUCED-MOTION GUARD
     ============================================================ */

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;


  /* ============================================================
     3. BACKGROUND ORB
     Slow-pulsing radial gradient orb, 20% opacity max, 8–10s cycle
     Injected once into <body>, position: fixed
     ============================================================ */

  const orb = document.createElement('div');
  orb.className = 'precision-bg-orb';
  orb.setAttribute('aria-hidden', 'true');
  document.body.appendChild(orb);

  if (!prefersReducedMotion) {
    // Slow drift + pulse
    gsap.to(orb, {
      x: '18vw',
      y: '10vh',
      duration: 9,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    gsap.to(orb, {
      opacity: 0.18,
      duration: 4.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }


  /* ============================================================
     4. HERO ON-LOAD SEQUENCE
     Headline → subtext → CTA button, staggered fade-up
     ============================================================ */

  const heroHeadline = document.querySelector('.hero-headline');
  const heroSubtext  = document.querySelector('.hero-subtext');
  const heroCta      = document.querySelector('.hero-cta-row');
  const heroStatsCard = document.querySelector('.hero-stats-card');

  if (heroHeadline) {
    // Set initial state
    gsap.set(
      [heroHeadline, heroSubtext, heroCta, heroStatsCard].filter(Boolean),
      { opacity: 0, y: 28 }
    );

    if (!prefersReducedMotion) {
      const heroTl = gsap.timeline({ delay: 0.1 });

      heroTl
        .to(heroHeadline, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
        .to(heroSubtext,  { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .to(heroCta,      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.35')
        .to(heroStatsCard,{ opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
    } else {
      // Reduced motion: just show immediately
      gsap.set(
        [heroHeadline, heroSubtext, heroCta, heroStatsCard].filter(Boolean),
        { opacity: 1, y: 0 }
      );
    }
  }


  /* ============================================================
     5. HERO FLOATING TAGS (BOBBING)
     .stats-tag elements bob up/down continuously,
     staggered 0.5s between each, 6–8px travel
     ============================================================ */

  const statsTags = document.querySelectorAll('.stats-tag');

  if (statsTags.length && !prefersReducedMotion) {
    statsTags.forEach(function (tag, i) {
      gsap.to(tag, {
        y: -7,
        duration: 2.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.5,   // 0.5s stagger between tags
      });
    });
  }


  /* ============================================================
     6. HERO STATS-CARD PROGRESS BAR PULSE
     Injects a thin gradient progress bar into the stats card
     and pulses its opacity 0.6 → 1 → 0.6 on a 2s loop
     ============================================================ */

  const statsCard = document.querySelector('.hero-stats-card');

  if (statsCard) {
    // Inject progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'hero-stats-progress-bar';
    progressBar.setAttribute('aria-hidden', 'true');
    statsCard.appendChild(progressBar);

    if (!prefersReducedMotion) {
      gsap.to(progressBar, {
        opacity: 1,
        duration: 1,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        defaults: { duration: 1 },
      });
    }
  }


  /* ============================================================
     7. METHODOLOGY CARDS — SCROLL FADE-UP WITH STAGGER
     .why-card elements fade up when section enters viewport
     Stagger: 0.15s between each card
     ============================================================ */

  const whyCards = document.querySelectorAll('.why-card');

  if (whyCards.length && typeof ScrollTrigger !== 'undefined') {
    gsap.set(whyCards, { opacity: 0, y: 40 });

    ScrollTrigger.batch(whyCards, {
      start: 'top 85%',
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.15,
          ease: 'power3.out',
        });
      },
      once: true,
    });
  }


  /* ============================================================
     8. CASE STUDY CARDS — SCROLL FADE-UP WITH STAGGER
     Image zoom on hover handled via CSS class .cs-hover
     ============================================================ */

  const caseStudyCards = document.querySelectorAll('.case-study-card');

  if (caseStudyCards.length && typeof ScrollTrigger !== 'undefined') {
    gsap.set(caseStudyCards, { opacity: 0, y: 40 });

    ScrollTrigger.batch(caseStudyCards, {
      start: 'top 85%',
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.15,
          ease: 'power3.out',
        });
      },
      once: true,
    });

    // Image zoom on hover via GSAP (overflow: hidden on .cs-card-image required)
    caseStudyCards.forEach(function (card) {
      const img = card.querySelector('.cs-card-image');
      if (!img) return;

      card.addEventListener('mouseenter', function () {
        gsap.to(img, { scale: 1.05, duration: 0.4, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out' });
      });
    });
  }


  /* ============================================================
     9. FOUNDER BIO — COUNT-UP STATS
     Numbers count up from 0 to final value when section enters viewport
     Colors: 10+ → cyan, 200+ → purple, 15 → magenta, 8 → coral
     ============================================================ */

  const founderSection = document.getElementById('founder-bio');

  if (founderSection && typeof ScrollTrigger !== 'undefined') {
    // Stat config: selector order matches DOM order (10+, 200+, 15, 8)
    const STAT_CONFIG = [
      { target: 10,  suffix: '+', color: '#00BFFF' },  // Operator years
      { target: 200, suffix: '+', color: '#7B68EE' },  // Team members
      { target: 15,  suffix: '',  color: '#C71585' },  // Markets
      { target: 8,   suffix: '',  color: '#FF7F50' },  // Industries
    ];

    const statValueEls = founderSection.querySelectorAll('.founder-stat-value');

    ScrollTrigger.create({
      trigger: founderSection,
      start: 'top 70%',
      once: true,
      onEnter: function () {
        statValueEls.forEach(function (el, i) {
          const cfg = STAT_CONFIG[i];
          if (!cfg) return;

          // Override gradient with solid accent color during count
          el.style.webkitTextFillColor = cfg.color;
          el.style.backgroundImage     = 'none';
          el.style.color               = cfg.color;

          const counter = { val: 0 };

          gsap.to(counter, {
            val: cfg.target,
            duration: prefersReducedMotion ? 0 : 2,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = Math.round(counter.val) + cfg.suffix;
            },
            onComplete: function () {
              el.textContent = cfg.target + cfg.suffix;
              // Restore gradient after count finishes
              el.style.webkitTextFillColor = 'transparent';
              el.style.backgroundImage     = '';
              el.style.color               = '';
            },
          });
        });
      },
    });
  }


  /* ============================================================
     10. BOOK A CALL — GOLDEN GLOW ON HOVER
     Injects a CSS class that overrides box-shadow on hover
     Targets: .btn-primary — the golden glow replaces cyan glow
     ============================================================ */

  // Inject style rule dynamically
  const glowStyle = document.createElement('style');
  glowStyle.textContent = `
    /* Precision: Book a Call — always-on pulsing golden glow */
    @keyframes btn-glow-pulse {
      0%, 100% { opacity: 0.5;  transform: scale(1); }
      50%       { opacity: 1;   transform: scale(1.1); }
    }

    /* Containment so the pseudo-element doesn't bleed into siblings */
    .btn-primary {
      position: relative;
      isolation: isolate;
    }

    /* Ambient radial glow behind every .btn-primary — always visible, slowly pulsing */
    .btn-primary::after {
      content: '';
      position: absolute;
      inset: -16px -24px;
      border-radius: 80px;
      background: radial-gradient(
        ellipse at center,
        rgba(255, 209, 102, 0.38) 0%,
        rgba(255, 180,  50, 0.14) 42%,
        transparent 70%
      );
      animation: btn-glow-pulse 2.8s ease-in-out infinite;
      z-index: -1;
      pointer-events: none;
    }

    /* Stronger glow on hover */
    .btn-primary:hover::after {
      background: radial-gradient(
        ellipse at center,
        rgba(255, 209, 102, 0.58) 0%,
        rgba(255, 180,  50, 0.22) 42%,
        transparent 68%
      );
    }

    .btn-primary:hover,
    .header-btn:hover {
      box-shadow: 0 0 24px rgba(255, 209, 102, 0.45),
                  0 4px 28px rgba(255, 209, 102, 0.30) !important;
    }
  `;
  document.head.appendChild(glowStyle);


  /* ============================================================
     11. "HOW WE WORK TOGETHER" CARDS — SCALE ON HOVER
     scale(1.03), 0.3s ease, no outline change
     ============================================================ */

  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      gsap.to(card, { scale: 1.03, duration: 0.3, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', function () {
      gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });
  });


  /* ============================================================
     12. TESTIMONIAL CARDS — SUBTLE SCALE + OUTLINE ON HOVER
     ============================================================ */

  const testimonialCards = document.querySelectorAll('.testimonial-card');

  testimonialCards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      gsap.to(card, {
        scale: 1.02,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.2), 0 8px 32px rgba(0,0,0,0.3)',
        duration: 0.3,
        ease: 'power2.out',
      });
    });
    card.addEventListener('mouseleave', function () {
      gsap.to(card, {
        scale: 1,
        boxShadow: '',
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  });


  /* ============================================================
     13. METHODOLOGY CARDS — HOVER (icon brightness, lift, border)
     ============================================================ */

  whyCards.forEach(function (card) {
    const iconWrap = card.querySelector('.why-card-icon-wrap');

    card.addEventListener('mouseenter', function () {
      gsap.to(card, {
        y: -4,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.2), 0 16px 48px rgba(0,0,0,0.4)',
        backgroundColor: 'rgba(25, 25, 55, 1)',
        duration: 0.3,
        ease: 'power2.out',
      });
      if (iconWrap) {
        gsap.to(iconWrap, { filter: 'brightness(1.4)', duration: 0.3 });
      }
    });

    card.addEventListener('mouseleave', function () {
      gsap.to(card, {
        y: 0,
        boxShadow: '',
        backgroundColor: '',
        duration: 0.3,
        ease: 'power2.out',
      });
      if (iconWrap) {
        gsap.to(iconWrap, { filter: 'brightness(1)', duration: 0.3 });
      }
    });
  });


  /* ============================================================
     14. GENERAL SCROLL FADE-UP — SECTION HEADINGS & LABELS
     Any element with class .gsap-fade-up animates in on scroll
     ============================================================ */

  const fadeUpEls = document.querySelectorAll('.section-header');

  if (fadeUpEls.length && typeof ScrollTrigger !== 'undefined') {
    gsap.set(fadeUpEls, { opacity: 0, y: 30 });

    fadeUpEls.forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: function () {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
        },
      });
    });
  }


  /* ============================================================
     15. REFRESH SCROLLTRIGGER after all images load
     ============================================================ */

  window.addEventListener('load', function () {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });

})(); // end IIFE
