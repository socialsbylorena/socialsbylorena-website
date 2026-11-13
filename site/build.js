// Build: content.de.json / content.en.json -> dist/index.html (DE) + dist/en/index.html (EN)
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://socialsbylorena.com';
const CAL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1Q0AQjMYLyxXIBxzxRn_-DG8yFVFCI0eLqEIePxVlgabGEev_OtlBa3I_4yR5f6J8RwqbrVKcY?gv=true';
const CAL_LINK = 'https://calendar.app.google/oPzhh3n4ErNP8d8t5';

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const stars = (label) => `<span class="stars" role="img" aria-label="${esc(label)}">${'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"/></svg>'.repeat(5)}</span>`;

const ico = {
  hello: '<path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M19 9h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2v3l-4-3h-4"/>',
  offer: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h7M9 17h5"/>',
  form: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M9 10l1.5 1.5L13 9M9 16l1.5 1.5L13 15"/><path d="M15 11h2M15 16h2"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  film: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M8 5v4M13 5v4M18 5v4"/><path d="M10.5 13l3 2-3 2z"/>',
  chart: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 15l4-4 3 3 5-6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  minus: '<path d="M6 12h12"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  insta: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
  linkedin: '<rect x="3" y="9" width="4" height="12"/><circle cx="5" cy="4.5" r="2"/><path d="M10 21V9h4v2c1-1.6 2.6-2.4 4.2-2.4 3 0 3.8 2 3.8 4.9V21h-4v-6.5c0-1.4-.4-2.3-1.8-2.3-1.5 0-2.2 1-2.2 2.5V21z"/>'
};
const svg = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ico[n]}</svg>`;
const stepIcons = ['hello', 'form', 'compass', 'film', 'check', 'up', 'chat'];

// Wörter in Headlines für das Einfahren umschließen
const words = (t) => esc(t).split(' ').map((w) => `<span class="w"><span class="wi">${w}</span></span>`).join(' ');
const head = (eyebrow, title, extra = '') => `
      <header class="sec-head ${extra}">
        <p class="eyebrow reveal">${esc(eyebrow)}</p>
        <h2 class="h2" data-split>${words(title)}</h2>
      </header>`;

function render(c, lang) {
  const de = lang === 'de';
  const base = de ? '' : '/en';
  const nav = c.nav, h = c.hero, pr = c.problem, ab = c.about, le = c.leistungen, ap = c.ablauf, fi = c.fit, st = c.stimmen, k = c.kontakt, f = c.footer, a = c.a11y;
  const fm = k.form;
  const otherHref = de ? '/en/' : '/';

  const navLinks = [['ueber-uns', nav.about], ['leistungen', nav.leistungen], ['ablauf', nav.ablauf], ['stimmen', nav.stimmen], ['kontakt', nav.kontakt]]
    .map(([id, l]) => `<a href="#${id}">${esc(l)}</a>`).join('');

  const person = (src, p, side) => `
        <figure class="hero-person hero-person--${side}">
          <div class="arch"><img src="/images/hero-${side === 'l' ? 'christian' : 'lorena'}.jpg" alt="${esc(p.name)}" width="900" height="1125" ${side === 'l' ? 'fetchpriority="high"' : ''}></div>
          <figcaption><strong>${esc(p.name)}</strong><span>${esc(p.role)}</span></figcaption>
        </figure>`;

  const tabs = le.tabs.map((t, i) => `<button role="tab" id="tab-${i}" aria-controls="panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" class="tab">${esc(t.label)}</button>`).join('');
  const panels = le.tabs.map((t, i) => `
          <div role="tabpanel" id="panel-${i}" aria-labelledby="tab-${i}" class="panel" ${i === 0 ? '' : 'hidden'}>
            <div class="panel-main">
              <span class="panel-num" aria-hidden="true">0${i + 1}</span>
              <h3 class="h3">${esc(t.label)}</h3>
              <p class="lead">${esc(t.text)}</p>
            </div>
          </div>`).join('');

  const nodes = ap.steps.map((s, i) => `<li class="node" data-i="${i}"><span class="dot">${svg(stepIcons[i])}</span><span class="node-label">${esc(s.title)}</span></li>`).join('');
  const cards = ap.steps.map((s, i) => `
          <article class="step-card" data-i="${i}">
            <p class="step-no">0${i + 1}</p>
            <h3 class="h3">${esc(s.title)}</h3>
            <p>${esc(s.text)}</p>
          </article>`).join('');
  const mobileSteps = ap.steps.map((s, i) => `
          <li class="vstep reveal"><span class="dot">${svg(stepIcons[i])}</span><div><p class="step-no">0${i + 1}</p><h3 class="h3">${esc(s.title)}</h3><p>${esc(s.text)}</p></div></li>`).join('');

  const initials = (n) => n.split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase();
  const testi = st.items.map((t, i) => `
        <figure class="tcard reveal" style="--d:${i * 90}ms">
          <div class="tcard-stars">${stars(a.rating)}</div>
          <blockquote>${esc(t.quote)}</blockquote>
          <figcaption><span class="avatar" aria-hidden="true">${esc(initials(t.name))}</span><span><strong>${esc(t.name)}</strong><em>${esc(t.role)}</em></span></figcaption>
        </figure>`).join('');

  const jsonld = {
    '@context': 'https://schema.org', '@type': 'ProfessionalService', name: 'Socials by Lorena',
    description: c.meta.description, url: SITE + base + '/', telephone: '+4917235182008', email: 'lb@socialsbylorena.com',
    founder: { '@type': 'Person', name: 'Lorena Bindszus' },
    address: { '@type': 'PostalAddress', streetAddress: 'Carl-Zeiß-Str. 40', addressLocality: 'Dresden', postalCode: '01129', addressCountry: 'DE' },
    areaServed: ['DE', 'AT', 'CH'],
    sameAs: ['https://www.instagram.com/socialsbylorena/', 'https://www.linkedin.com/in/lorena-bindszus/', 'https://www.linkedin.com/in/christian-mattukat/']
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(c.meta.title)}</title>
<meta name="description" content="${esc(c.meta.description)}">
<meta name="theme-color" content="#31031F">
<meta name="google-site-verification" content="googlec5e3e08d9972386b">
<link rel="canonical" href="${SITE}${base}/">
<link rel="alternate" hreflang="de" href="${SITE}/">
<link rel="alternate" hreflang="en" href="${SITE}/en/">
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(c.meta.title)}">
<meta property="og:description" content="${esc(c.meta.description)}">
<meta property="og:url" content="${SITE}${base}/">
<meta property="og:image" content="${SITE}/images/hero-1.jpg">
<link rel="icon" href="/images/favicon.png" type="image/png">
<link rel="preload" href="/assets/fonts/PlayfairDisplay-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/styles.css">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<script>document.documentElement.classList.add('js')</script>
</head>
<body>
<a class="skip" href="#main">${de ? 'Zum Inhalt springen' : 'Skip to content'}</a>

<header class="nav" id="nav">
  <div class="nav-in">
    <a class="logo" href="${base}/" aria-label="Socials by Lorena">Socials <span>by</span> Lorena</a>
    <nav class="nav-links" id="nav-links" aria-label="Navigation">${navLinks}</nav>
    <div class="nav-end">
      <div class="lang" role="group" aria-label="Sprache / Language">
        <a href="/" ${de ? 'aria-current="true"' : ''} hreflang="de" lang="de" title="${esc(a.langDe)}">DE</a><i aria-hidden="true">|</i><a href="/en/" ${de ? '' : 'aria-current="true"'} hreflang="en" lang="en" title="${esc(a.langEn)}">EN</a>
      </div>
      <a class="btn btn--sm nav-cta" href="#kontakt">${esc(nav.cta)}</a>
      <button class="burger" id="burger" aria-expanded="false" aria-controls="nav-links" aria-label="${esc(nav.menu)}"><span></span><span></span></button>
    </div>
  </div>
</header>

<main id="main">

<!-- HERO -->
<section class="hero" id="top">
  <div class="hero-bg" aria-hidden="true"><img src="/images/hero-1.jpg" alt="" width="1920" height="1080" fetchpriority="high"><img class="hero-bg-2" src="/images/hero-2.jpg" alt="" width="1920" height="1080"><img class="hero-bg-3" src="/images/hero-3.jpg" alt="" width="1920" height="1080"></div>
  <div class="wrap hero-center">
    <p class="eyebrow eyebrow--light reveal">${esc(h.eyebrow)}</p>
    <h1 class="h1 h1--light" data-split>${words(h.title)}</h1>
    <p class="hero-sub reveal">${esc(h.sub)}</p>
    <div class="hero-actions reveal">
      <div class="hero-btns"><a class="btn btn--light" href="#kontakt">${esc(h.cta)} ${svg('arrow', 'btn-ico')}</a><a class="btn btn--ghost" href="mailto:lb@socialsbylorena.com">${esc(h.cta2)}</a></div>
      <p class="trust">${stars(a.rating)}<span>${esc(h.trust)}</span></p>
    </div>
  </div>
</section>

<!-- PROBLEM (dunkel) -->
<section class="sec sec--dark" id="problem">
  <div class="wrap wrap--narrow">
    <p class="eyebrow reveal">${esc(pr.eyebrow)}</p>
    <h2 class="h2 h2--light" data-split>${words(pr.title)}</h2>
    <p class="lead lead--light">${esc(pr.text)}</p>
  </div>
</section>

<!-- ÜBER UNS -->
<section class="sec aura" id="ueber-uns">
  <div class="aura-bg" aria-hidden="true"><i class="b1"></i><i class="b2"></i></div>
  <div class="wrap about-grid">
    <figure class="about-photo arch reveal"><img src="/images/about-lorena.jpg" alt="Lorena &amp; Christian" loading="lazy" width="900" height="1125"></figure>
    <div class="about-text">
      ${head(ab.eyebrow, ab.title)}
      ${[ab.intro, ...ab.people.map((p) => p.text), ab.outro].map((p) => `<p class="lead reveal">${esc(p)}</p>`).join('')}
    </div>
  </div>
</section>

<!-- LEISTUNGEN -->
<section class="sec sec--tint" id="leistungen">
  <div class="wrap">
    ${head(le.eyebrow, le.title, 'sec-head--center')}
    <p class="lead lead--center reveal">${esc(le.intro)}</p>
    <div class="tabs reveal" id="tabs">
      <div class="tablist" role="tablist" aria-label="${esc(a.tabs)}">${tabs}</div>
      <div class="panels">${panels}</div>
    </div>
    <div class="extras reveal">
      <p class="sub">${esc(le.extrasTitle)}</p>
      <ul class="xlist" role="list">${le.extras.map((x, i) => `<li><button type="button" class="xchip" aria-expanded="false" aria-controls="xd-${i}" data-x="${i}"><span>${esc(x.label)}</span><i aria-hidden="true"></i></button></li>`).join('')}</ul>
      <p class="xhint">${esc(le.extrasHint)}</p>
      ${le.extras.map((x, i) => `<div class="xdetail" id="xd-${i}" role="region" hidden><h3 class="h3">${esc(x.label)}</h3><p>${esc(x.text)}</p></div>`).join('')}
    </div>
  </div>
</section>

<!-- ABLAUF (dunkel, Timeline) -->
<section class="sec sec--dark timeline" id="ablauf" data-steps="${ap.steps.length}" style="--n:${ap.steps.length}" aria-label="${esc(a.steps)}">
  <div class="tl-sticky">
    <div class="wrap">
      <header class="sec-head sec-head--center">
        <p class="eyebrow reveal">${esc(ap.eyebrow)}</p>
        <h2 class="h2 h2--light" data-split>${words(ap.title)}</h2>
        ${ap.intro ? `<p class="lead lead--light lead--center reveal">${esc(ap.intro)}</p>` : ''}
      </header>
      <div class="tl-track">
        <div class="tl-line"><i id="tl-fill"></i></div>
        <ol class="nodes">${nodes}</ol>
      </div>
      <div class="step-stage" id="stage">${cards}</div>
    </div>
  </div>
  <div class="wrap tl-mobile"><ol class="vsteps">${mobileSteps}</ol></div>
</section>

<!-- FIT-FILTER -->
<section class="sec aura" id="fit">
  <div class="aura-bg" aria-hidden="true"><i class="b1"></i><i class="b3"></i></div>
  <div class="wrap">
    ${head(fi.eyebrow, fi.title, 'sec-head--center')}
    <div class="match reveal" style="--rows:${fi.yes.length}">
      <div class="match-col match-col--yes" style="grid-row:span ${fi.yes.length + 1}">
        <h3 class="h3">${esc(fi.yesTitle)}</h3>
        ${fi.yes.map((y) => `<p><span class="mi">${svg('check')}</span><span>${esc(y)}</span></p>`).join('')}
      </div>
      <div class="match-col match-col--no" style="grid-row:span ${fi.no.length + 1}">
        <h3 class="h3">${esc(fi.noTitle)}</h3>
        ${fi.no.map((y) => `<p><span class="mi">${svg('minus')}</span><span>${esc(y)}</span></p>`).join('')}
      </div>
    </div>
  </div>
</section>

<!-- STIMMEN -->
<section class="sec sec--tint" id="stimmen">
  <div class="wrap">
    ${head(st.eyebrow, st.title, 'sec-head--center')}
    <div class="tgrid">${testi}</div>
  </div>
</section>

<!-- KONTAKT -->
<section class="sec aura" id="kontakt">
  <div class="aura-bg" aria-hidden="true"><i class="b1"></i><i class="b2"></i><i class="b3"></i></div>
  <div class="wrap">
    <header class="sec-head sec-head--center">
      <p class="eyebrow reveal">${esc(k.eyebrow)}</p>
      <h2 class="h2" data-split>${words(k.title)}</h2>
      <p class="sub reveal">${esc(k.sub)}</p>
    </header>
    <div class="k-grid">
      <div class="card k-cal reveal">
        <p class="k-intro">${esc(k.calendarIntro)}</p>
        <!-- Google Calendar Appointment Scheduling begin -->
        <div class="cal-consent" id="cal-consent">
          <p>${esc(k.calendarConsent)} <button type="button" class="link" data-open="dlg-dsg">${esc(k.form.privacy)}</button></p>
          <button type="button" class="btn" id="cal-load">${esc(k.calendarLoad)}</button>
          <a class="cal-alt" href="${CAL_LINK}" target="_blank" rel="noopener">${esc(k.calendarOpen)}</a>
        </div>
        <iframe id="cal-frame" data-src="${CAL}" hidden style="border:0" width="100%" height="600" frameborder="0" title="${esc(k.calendarTitle)}"></iframe>
        <!-- end Google Calendar Appointment Scheduling -->
      </div>
      <div class="k-side">
        <div class="card reveal" style="--d:80ms">
          <p class="sub">${esc(k.writeFirst)}</p>
          <ul class="clinks">
            <li><a href="mailto:lb@socialsbylorena.com"><span class="cico">${svg('mail')}</span>lb@socialsbylorena.com</a></li>
            <li><a href="tel:+4917235182008"><span class="cico">${svg('phone')}</span>0172 3518208</a></li>
            <li><a href="https://www.instagram.com/socialsbylorena/" target="_blank" rel="noopener"><span class="cico">${svg('insta')}</span>@socialsbylorena</a></li>
            <li><a href="https://www.linkedin.com/in/lorena-bindszus/" target="_blank" rel="noopener"><span class="cico">${svg('linkedin')}</span>Lorena Bindszus</a></li>
            <li><a href="https://www.linkedin.com/in/christian-mattukat/" target="_blank" rel="noopener"><span class="cico">${svg('linkedin')}</span>Christian Mattukat</a></li>
          </ul>
        </div>
        <div class="card reveal" style="--d:140ms">
          <form id="contact-form" name="kontakt" method="POST" data-netlify="true" netlify-honeypot="bot-field">
            <input type="hidden" name="form-name" value="kontakt">
            <p class="hp"><label>Nicht ausfüllen <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
            <div class="field"><label for="f-name">${esc(fm.name)}</label><input id="f-name" type="text" name="name" required placeholder="${esc(fm.namePh)}" autocomplete="name"></div>
            <div class="field"><label for="f-mail">${esc(fm.email)}</label><input id="f-mail" type="email" name="email" required placeholder="${esc(fm.emailPh)}" autocomplete="email"></div>
            <div class="field"><label for="f-msg">${esc(fm.message)}</label><textarea id="f-msg" name="nachricht" rows="3" required placeholder="${esc(fm.messagePh)}"></textarea></div>
            <label class="consent"><input type="checkbox" required><span>${esc(fm.consent)} <button type="button" class="link" data-open="dlg-dsg">${esc(fm.privacy)}</button></span></label>
            <button type="submit" class="btn btn--block">${esc(fm.submit)}</button>
            <p class="form-error" id="form-error" role="alert" hidden>${esc(fm.error)}</p>
          </form>
          <div id="success-message" hidden>
            <h3 class="h3">${esc(fm.thanksTitle)}</h3>
            <p>${esc(fm.thanksText)}</p>
          </div>
        </div>
      </div>
    </div>
    <p class="footnote">${esc(k.footnote)}</p>
  </div>
</section>

</main>

<footer class="footer">
  <div class="wrap footer-grid">
    <div>
      <a class="logo logo--light" href="${base}/">Socials <span>by</span> Lorena</a>
      <p class="footer-tag">${esc(f.tagline)}</p>
    </div>
    <div>
      <p class="sub sub--light">${esc(f.navTitle)}</p>
      <ul>${[['leistungen', nav.leistungen], ['ablauf', nav.ablauf], ['stimmen', nav.stimmen], ['kontakt', nav.kontakt]].map(([id, l]) => `<li><a href="#${id}">${esc(l)}</a></li>`).join('')}</ul>
    </div>
    <div>
      <p class="sub sub--light">${esc(f.contactTitle)}</p>
      <ul>
        <li><a href="mailto:lb@socialsbylorena.com">lb@socialsbylorena.com</a></li>
        <li><a href="tel:+4917235182008">0172 3518208</a></li>
        <li><a href="https://www.instagram.com/socialsbylorena/" target="_blank" rel="noopener">Instagram</a></li>
        <li><a href="https://www.linkedin.com/in/lorena-bindszus/" target="_blank" rel="noopener">LinkedIn Lorena</a></li>
        <li><a href="https://www.linkedin.com/in/christian-mattukat/" target="_blank" rel="noopener">LinkedIn Christian</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <p>© ${new Date().getFullYear()} Socials by Lorena. ${esc(f.rights)}${f.legalNote ? ' ' + esc(f.legalNote) : ''}</p>
    <p><button class="link" data-open="dlg-imp">${esc(f.imprint)}</button><button class="link" data-open="dlg-dsg">${esc(f.privacy)}</button><button class="link" id="consent-reset">${esc(c.consent.settings)}</button></p>
  </div>
</footer>

<button id="scrolltop" class="scrolltop" aria-label="${esc(f.top)}">${svg('up')}</button>

<dialog id="dlg-imp" class="dlg" aria-labelledby="t-imp">
  <div class="dlg-head"><h2 class="h3" id="t-imp">Impressum</h2><button class="dlg-x" data-close aria-label="${esc(a.close)}">✕</button></div>
  <div class="dlg-body">${read('partials/legal-imp.html')}</div>
</dialog>
<dialog id="dlg-dsg" class="dlg" aria-labelledby="t-dsg">
  <div class="dlg-head"><h2 class="h3" id="t-dsg">Datenschutzerklärung</h2><button class="dlg-x" data-close aria-label="${esc(a.close)}">✕</button></div>
  <div class="dlg-body">${read('partials/legal-dsg.html')}</div>
</dialog>

<script src="/assets/js/main.js" defer></script>
<div class="consent-banner" id="consent" role="dialog" aria-live="polite" hidden>
  <p>${esc(c.consent.text)} <button type="button" class="link" data-open="dlg-dsg">${esc(f.privacy)}</button></p>
  <div class="consent-actions"><button type="button" class="btn btn--sm" id="consent-yes">${esc(c.consent.accept)}</button><button type="button" class="btn btn--sm" id="consent-no">${esc(c.consent.decline)}</button></div>
</div>
</body>
</html>
`;
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dest, e.name);
    e.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'en'), { recursive: true });
fs.writeFileSync(path.join(DIST, 'index.html'), render(JSON.parse(read('content.de.json')), 'de'));
fs.writeFileSync(path.join(DIST, 'en', 'index.html'), render(JSON.parse(read('content.en.json')), 'en'));
['assets', 'images', 'admin'].forEach((d) => copyDir(path.join(ROOT, d), path.join(DIST, d)));
fs.copyFileSync(path.join(ROOT, 'googlec5e3e08d9972386b.html'), path.join(DIST, 'googlec5e3e08d9972386b.html'));
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${['/', '/en/'].map((u) => `  <url><loc>${SITE}${u}</loc><xhtml:link rel="alternate" hreflang="de" href="${SITE}/"/><xhtml:link rel="alternate" hreflang="en" href="${SITE}/en/"/></url>`).join('\n')}\n</urlset>\n`);
console.log('Build ok -> dist/ (DE + EN)');
