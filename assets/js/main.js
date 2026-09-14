/* Pega.com clone — interactions (mobile-first) */
(function () {
  'use strict';

  var MOBILE = '(max-width: 1024px)';
  function isMobile() { return window.matchMedia(MOBILE).matches; }

  /* ---------- hero carousel ---------- */
  var track = document.querySelector('.js-hero-track');
  var dotWrap = document.querySelector('.js-hero-dots');

  if (track && dotWrap) {
    var slides = Array.prototype.slice.call(track.querySelectorAll('.hero__slide'));
    var dots = Array.prototype.slice.call(dotWrap.querySelectorAll('.hero__dot'));
    var index = 0;
    var timer = null;
    var DELAY = 7000;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle('is-active', n === index); });
      dots.forEach(function (d, n) {
        d.classList.toggle('is-active', n === index);
        d.setAttribute('aria-selected', n === index ? 'true' : 'false');
      });
    }

    function start() {
      stop();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      timer = window.setInterval(function () { show(index + 1); }, DELAY);
    }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }

    dots.forEach(function (d, n) {
      d.addEventListener('click', function () { show(n); start(); });
    });

    track.addEventListener('mouseenter', stop);
    track.addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else { start(); }
    });

    /* swipe on touch devices */
    var startX = null, startY = null;
    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX; startY = e.touches[0].clientY; stop();
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
      startX = startY = null;
      start();
    }, { passive: true });

    show(0);
    start();
  }

  /* ---------- logo marquee: duplicate the set so the loop is seamless ---------- */
  var logoTrack = document.querySelector('.js-logo-track');
  if (logoTrack) {
    var set = logoTrack.querySelector('.logos__set');
    if (set) logoTrack.appendChild(set.cloneNode(true));
  }

  /* ---------- blueprint tabs (+ mobile "More" dropdown) ---------- */
  var tabNav = document.querySelector('.tabs__nav');
  var tabBtns = Array.prototype.slice.call(document.querySelectorAll('.tabs__btn'));
  var tabPanels = Array.prototype.slice.call(document.querySelectorAll('.tabs__panel'));

  if (tabNav && tabBtns.length) {
    var more = document.createElement('div');
    more.className = 'tabs__more';
    more.innerHTML =
      '<button type="button" class="tabs__more-btn" aria-expanded="false">More</button>' +
      '<div class="tabs__dropdown"></div>';
    tabNav.appendChild(more);

    var moreBtn = more.querySelector('.tabs__more-btn');
    var dropdown = more.querySelector('.tabs__dropdown');

    function buildDropdown() {
      dropdown.innerHTML = '';
      tabBtns.forEach(function (btn, i) {
        if (btn.classList.contains('is-active')) return;
        var item = document.createElement('button');
        item.type = 'button';
        item.textContent = btn.textContent;
        item.addEventListener('click', function () {
          select(i);
          closeMore();
        });
        dropdown.appendChild(item);
      });
    }

    function closeMore() {
      more.classList.remove('is-open');
      moreBtn.setAttribute('aria-expanded', 'false');
    }

    function select(i) {
      tabBtns.forEach(function (b, n) {
        b.classList.toggle('is-active', n === i);
        b.setAttribute('aria-selected', n === i ? 'true' : 'false');
      });
      tabPanels.forEach(function (p, n) { p.classList.toggle('is-active', n === i); });
      buildDropdown();
    }

    tabBtns.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        if (isMobile()) { more.classList.toggle('is-open'); moreBtn.setAttribute('aria-expanded', more.classList.contains('is-open') ? 'true' : 'false'); return; }
        select(i);
      });
    });

    moreBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !more.classList.contains('is-open');
      more.classList.toggle('is-open', open);
      moreBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', function (e) {
      if (!more.contains(e.target)) closeMore();
    });

    buildDropdown();
  }

  /* ---------- header search ---------- */
  var searchToggle = document.querySelector('.js-search-toggle');
  var searchPanel = document.querySelector('.header-search');
  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', function () {
      var open = searchPanel.hidden;
      searchPanel.hidden = !open;
      searchToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        var input = searchPanel.querySelector('input');
        if (input) input.focus();
      }
    });
  }

  /* ---------- mobile drawer ---------- */
  var burger = document.querySelector('.js-burger');
  var nav = document.querySelector('.main-nav');

  function closeDrawer() {
    if (!nav) return;
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && searchPanel && !searchPanel.hidden) {
        searchPanel.hidden = true;
        if (searchToggle) searchToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* below 1024 the top-level items expand in place instead of hovering */
  Array.prototype.slice.call(document.querySelectorAll('.main-nav__trigger')).forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      if (!isMobile()) return;
      e.preventDefault();
      var item = trigger.closest('.main-nav__item');
      var open = !item.classList.contains('is-open');
      /* accordion: only one section open at a time, like the live drawer */
      Array.prototype.slice.call(document.querySelectorAll('.main-nav__item')).forEach(function (other) {
        if (other !== item) {
          other.classList.remove('is-open');
          var t = other.querySelector('.main-nav__trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* reset drawer state when crossing back to desktop */
  window.matchMedia(MOBILE).addEventListener('change', function (ev) {
    if (!ev.matches) {
      closeDrawer();
      Array.prototype.slice.call(document.querySelectorAll('.main-nav__item.is-open'))
        .forEach(function (i) { i.classList.remove('is-open'); });
    }
  });

  /* ---------- footer accordions (mobile) ---------- */
  Array.prototype.slice.call(document.querySelectorAll('.js-footer-acc')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!isMobile()) return;
      var col = btn.closest('.site-footer__col');
      var open = !col.classList.contains('is-open');
      col.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------- scroll reveal ---------- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (!('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    revealables.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 80) + 'ms';
      io.observe(el);
    });
  }
})();
