// AVIORA MedTech — Site JS v3
(function () {
  'use strict';

  /* ── Sticky header ────────────────────────────────────────── */
  var header = document.querySelector('.site-header');
  if (header) {
    function toggleSolid() {
      var onHero = !!document.querySelector('.hero');
      header.classList.toggle('is-solid', window.scrollY > 60 || !onHero);
    }
    toggleSolid();
    window.addEventListener('scroll', toggleSolid, { passive: true });
  }

  /* ── Mobile menu ──────────────────────────────────────────── */
  var openBtn = document.querySelector('.mobile-toggle');
  var closeBtn = document.querySelector('.mm-close');
  var mobileMenu = document.querySelector('.mobile-menu');
  function openMenu() { mobileMenu.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { mobileMenu.classList.remove('is-open'); document.body.style.overflow = ''; }
  if (openBtn && mobileMenu) {
    openBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  }

  /* ── Accordion ────────────────────────────────────────────── */
  document.querySelectorAll('.accordion-item').forEach(function (item) {
    var trigger = item.querySelector('.accordion-trigger');
    var panel   = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', function () {
      var open = item.classList.contains('is-open');
      var parent = item.closest('.accordion');
      if (parent) {
        parent.querySelectorAll('.accordion-item.is-open').forEach(function (i) {
          i.classList.remove('is-open');
          i.querySelector('.accordion-panel').style.maxHeight = null;
        });
      }
      if (!open) { item.classList.add('is-open'); panel.style.maxHeight = panel.scrollHeight + 'px'; }
    });
  });

  /* ── Scroll reveal ────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ── Counters ─────────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseFloat(el.dataset.count);
        var suffix = el.dataset.suffix || '';
        var dur = 1400; var start = null;
        requestAnimationFrame(function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var ease = p < 0.5 ? 2*p*p : -1+(4-2*p)*p;
          el.textContent = (target * ease).toFixed(target % 1 !== 0 ? 1 : 0) + suffix;
          if (p < 1) requestAnimationFrame(step);
        });
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  /* ── Category filter (products page) ─────────────────────── */
  var tabs = document.querySelectorAll('.cat-tab');
  var cards = document.querySelectorAll('.product-card[data-cat]');
  if (tabs.length && cards.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var cat = tab.dataset.cat;
        cards.forEach(function (card) {
          var show = cat === 'all' || card.dataset.cat === cat;
          card.parentElement.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ── Active nav highlight ─────────────────────────────────── */
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .mobile-menu a').forEach(function (a) {
    if (a.getAttribute('href') === path) a.setAttribute('aria-current', 'page');
  });

  /* ── Lazy-load images ─────────────────────────────────────── */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[data-src]').forEach(function (img) { img.src = img.dataset.src; });
  } else if ('IntersectionObserver' in window) {
    var lzio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting && e.target.dataset.src) { e.target.src = e.target.dataset.src; lzio.unobserve(e.target); } });
    });
    document.querySelectorAll('img[data-src]').forEach(function (img) { lzio.observe(img); });
  }

})();
