(function () {
  'use strict';
  var d = document, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  /* Navigation: Hintergrund beim Scrollen, Burger, Scroll-Top */
  var nav = $('#nav'), topBtn = $('#scrolltop'), burger = $('#burger'), links = $('#nav-links');
  function onScroll() {
    var y = window.scrollY || 0;
    nav.classList.toggle('scrolled', y > 24);
    topBtn.classList.toggle('show', y > 700);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  topBtn.addEventListener('click', function () { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  burger.addEventListener('click', function () {
    var o = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!o)); links.classList.toggle('open', !o);
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { burger.setAttribute('aria-expanded', 'false'); links.classList.remove('open'); }
  });

  /* Reveal + Headlines einfahren */
  $$('[data-split]').forEach(function (h) { $$('.wi', h).forEach(function (w, i) { w.style.setProperty('--i', i); }); });
  var targets = $$('.reveal,[data-split]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  } else targets.forEach(function (t) { t.classList.add('in'); });

  /* Wort-für-Wort-Hervorhebung beim Scrollen (Problem-Section) */
  var scrub = $('#scrub');
  if (scrub) {
    var sp = $$('span', scrub);
    var upd = function () {
      if (reduce) { sp.forEach(function (s) { s.classList.add('on'); }); return; }
      var r = scrub.getBoundingClientRect(), vh = innerHeight;
      var p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.45 + r.height * 0.5)));
      var n = Math.round(p * sp.length);
      sp.forEach(function (s, i) { s.classList.toggle('on', i < n); });
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }

  /* Tabs (ARIA, Tastatur) */
  var tabs = $$('.tab'), panels = $$('.panel');
  function select(i, focus) {
    tabs.forEach(function (t, j) { var on = i === j; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; panels[j].hidden = !on; });
    if (focus) tabs[i].focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(i); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = tabs.length;
      if (k === 'ArrowRight') select((i + 1) % n, true);
      else if (k === 'ArrowLeft') select((i - 1 + n) % n, true);
      else if (k === 'Home') select(0, true);
      else if (k === 'End') select(n - 1, true);
    });
  });

  /* Zusatzleistungen: Klick zeigt Erklärung */
  var chips = $$('.xchip');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var open = c.getAttribute('aria-expanded') === 'true';
      chips.forEach(function (o) { o.setAttribute('aria-expanded', 'false'); d.getElementById(o.getAttribute('aria-controls')).hidden = true; });
      if (!open) { c.setAttribute('aria-expanded', 'true'); d.getElementById(c.getAttribute('aria-controls')).hidden = false; }
    });
  });

  /* Horizontale Prozess-Timeline: Scrollen führt von Punkt zu Punkt (Desktop) */
  var tl = $('#ablauf'), mq = matchMedia('(min-width:901px)');
  if (tl) {
    var n = +tl.dataset.steps, nodes = $$('.node', tl), cards = $$('.step-card', tl), fill = $('#tl-fill'), cur = -1;
    var setActive = function (i) {
      if (i === cur) return; cur = i;
      nodes.forEach(function (nd, j) { nd.classList.toggle('active', j === i); nd.classList.toggle('done', j < i); });
      cards.forEach(function (c, j) { c.classList.toggle('active', j === i); });
      fill.style.width = (i / (n - 1) * 100) + '%';
    };
    var timer = null, hover = false, seen = false, DELAY = 3000;
    var next = function () { setActive((cur + 1) % n); };
    var stop = function () { clearInterval(timer); timer = null; };
    var start = function () { stop(); if (reduce || hover || !seen) return; timer = setInterval(next, DELAY); };
    fill.style.transition = 'width .7s cubic-bezier(.22,.8,.24,1)';
    setActive(0);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { seen = es[0].isIntersecting; start(); }, { threshold: 0.35 }).observe(tl);
    } else { seen = true; start(); }
    tl.addEventListener('mouseenter', function () { hover = true; stop(); });
    tl.addEventListener('mouseleave', function () { hover = false; start(); });
    nodes.forEach(function (nd, i) {
      nd.style.cursor = 'pointer';
      nd.addEventListener('click', function () { setActive(i); start(); });
    });
  }

  /* Dialoge (Impressum / Datenschutz) */
  $$('[data-open]').forEach(function (b) {
    b.addEventListener('click', function () { var dlg = d.getElementById(b.dataset.open); if (dlg && dlg.showModal) dlg.showModal(); });
  });
  $$('dialog').forEach(function (dlg) {
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.hasAttribute('data-close')) dlg.close(); });
  });

  /* Google-Kalender: nur nach Einwilligung laden */
  var KEY = 'sbl-calendar', store = {
    get: function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    set: function (v) { try { localStorage.setItem(KEY, v); } catch (e) {} },
    del: function () { try { localStorage.removeItem(KEY); } catch (e) {} }
  };
  function loadCal() { var fr = $('#cal-frame'); if (!fr) return; fr.src = fr.dataset.src; fr.hidden = false; $('#cal-consent').hidden = true; }
  var banner = $('#consent');
  if (store.get() === '1') loadCal(); else if (store.get() === null && banner) banner.hidden = false;
  var calBtn = $('#cal-load'); if (calBtn) calBtn.addEventListener('click', loadCal);
  var yes = $('#consent-yes'), no = $('#consent-no'), rst = $('#consent-reset');
  if (yes) yes.addEventListener('click', function () { store.set('1'); banner.hidden = true; loadCal(); });
  if (no) no.addEventListener('click', function () { store.set('0'); banner.hidden = true; });
  if (rst) rst.addEventListener('click', function () { store.del(); location.reload(); });

  /* Kontaktformular (Netlify Forms) */
  var form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = $('#form-error'); err.hidden = true;
      var btn = $('button[type=submit]', form); btn.disabled = true;
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() })
        .then(function (r) { if (!r.ok) throw 0; form.hidden = true; $('#success-message').hidden = false; })
        .catch(function () { err.hidden = false; btn.disabled = false; });
    });
  }
})();
