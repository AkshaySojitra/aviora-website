// AVIORA MEDTECH — shared site behavior
document.addEventListener('DOMContentLoaded', function () {

  /* Sticky header: solid after scrolling past hero */
  var header = document.querySelector('.site-header');
  if (header) {
    var toggleSolid = function () {
      if (window.scrollY > 40 || !document.querySelector('.hero')) {
        header.classList.add('is-solid');
      } else {
        header.classList.remove('is-solid');
      }
    };
    toggleSolid();
    window.addEventListener('scroll', toggleSolid, { passive: true });
  }

  /* Mobile menu */
  var toggleBtn = document.querySelector('.mobile-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
      document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* Accordion (FAQ / spec panels) */
  document.querySelectorAll('.accordion-item').forEach(function (item) {
    var trigger = item.querySelector('.accordion-trigger');
    var panel = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      item.closest('.accordion').querySelectorAll('.accordion-item').forEach(function (i) {
        i.classList.remove('is-open');
        i.querySelector('.accordion-panel').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Counters (spec-strip / stat numbers with data-count) */
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1200;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var value = (target * progress).toFixed(target % 1 !== 0 ? 1 : 0);
          el.textContent = value + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterIO.observe(el); });
  }

  /* Active nav link highlight */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .mobile-menu a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.style.color = 'var(--primary)';
    }
  });
});
