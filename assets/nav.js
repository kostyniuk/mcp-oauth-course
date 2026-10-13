// Course map + prev/next buttons. Pages opt in with <nav class="lesson-nav" data-auto></nav> (top and/or bottom).
// Add a lesson here when it's written: set `ready: true` and its file; the nav and the contents page pick it up.
window.COURSE = {
  lessons: [
    {n: '0001', title: 'Who talks to whom', file: 'lessons/0001-who-talks-to-whom.html', ready: true, teaser: 'Four roles, two channels, and why Claude gets a code before a token.'},
    {n: '0002', title: 'PKCE: the lock on the code', file: 'lessons/0002-pkce.html', ready: true, teaser: 'The attack a stolen code enables, and how a hashed secret stops it.'},
    {n: '0003', title: 'Discovery and the resource', file: 'lessons/0003-discovery-and-resource.html', ready: true, teaser: '401 → protected resource metadata → authorization server metadata; why tokens name /mcp.'},
    {n: '0004', title: 'Who may connect: CIMD, not DCR', file: 'lessons/0004-who-may-connect.html', ready: true, teaser: 'Client ids as URLs, our allowlist, pinned metadata, redirect rules.'},
    {n: '0005', title: 'Tokens, rotation and families', file: 'lessons/0005-tokens-rotation-families.html', ready: true, teaser: 'Lifetimes, replay detection and what the oauth_tokens table stores.'},
    {n: '0006', title: 'Scopes, read-only and step-up', file: 'lessons/0006-scopes-and-step-up.html', ready: true, teaser: 'mcp:read vs mcp:write, the 403 that asks for more, app-scoped identity.'},
    {n: '0007', title: 'Routing it to engine-service', file: 'lessons/0007-routing.html', ready: true, teaser: 'Root paths, ingress Exact rules and the deployment template gotcha.'},
    {n: '0008', title: 'Review drill: "why not just…?"', file: 'lessons/0008-review-drill.html', ready: true, teaser: 'Mixed practice on every design decision, ready for a real review.'}
  ],
  references: [
    {title: 'Glossary', file: 'reference/glossary.html'},
    {title: 'The AMFG handshake', file: 'reference/handshake.html'}
  ]
};

(() => {
  const path = location.pathname.replace(/\\/g, '/');
  const depth = /\/(lessons|reference)\/[^/]*$/.test(path) ? '../' : '';
  const here = path.split('/').slice(-2).join('/');
  const {lessons, references} = window.COURSE;
  const ready = lessons.filter((l) => l.ready);

  const style = document.createElement('style');
  style.textContent = `
    .lesson-nav[data-auto] { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 10px; }
    header .lesson-nav[data-auto], .lesson-nav[data-auto].top { position: sticky; top: 0; z-index: 40; background: var(--paper, #fffff8); padding: 10px 0; }
    .navbtn { display: inline-flex; flex-direction: column; gap: 2px; text-decoration: none; padding: 8px 14px; border: 1px solid var(--rule, #d9d6c8); border-radius: 8px; background: #fff; color: var(--ink, #1b1b1b); font: 600 0.78rem/1.25 var(--sans, system-ui); letter-spacing: 0; text-transform: none; max-width: 100%; }
    .navbtn small { font: 600 0.62rem/1 var(--sans, system-ui); letter-spacing: .12em; text-transform: uppercase; color: var(--accent, #1f6f78); }
    .navbtn:hover { border-color: var(--accent, #1f6f78); }
    .navbtn.next { justify-self: end; text-align: right; }
    .navbtn.prev { justify-self: start; }
    .navbtn.disabled { opacity: .45; pointer-events: none; }
    .navbtn.home { flex-direction: row; align-items: center; gap: 6px; }
    @media (max-width: 560px) { .navbtn span.t { display: none; } }
    @media print { .lesson-nav[data-auto] { position: static; } }
  `;
  document.head.appendChild(style);

  const btn = (cls, label, page, soon) => {
    if (!page) return `<span class="navbtn ${cls} disabled"><small>${label}</small><span class="t">—</span></span>`;
    const name = page.n ? `${page.n} — ${page.title}` : page.title;
    if (soon) return `<span class="navbtn ${cls} disabled" title="Not written yet"><small>${label} · soon</small><span class="t">${name}</span></span>`;
    return `<a class="navbtn ${cls}" href="${depth}${page.file}"><small>${label}</small><span class="t">${name}</span></a>`;
  };

  let prev = null, next = null, soon = false;
  const li = lessons.findIndex((l) => l.file === here);
  const ri = references.findIndex((r) => r.file === here);
  if (li >= 0) {
    prev = lessons.slice(0, li).reverse().find((l) => l.ready) ?? null;
    next = lessons[li + 1] ?? null;
    soon = next && !next.ready;
  } else if (ri >= 0) {
    prev = references[ri - 1] ?? ready[ready.length - 1] ?? null;
    next = references[ri + 1] ?? null;
  } else {
    next = ready[0] ?? null;
  }
  const html = `${btn('prev', '← Previous', prev)}<a class="navbtn home" href="${depth}index.html">☰ <span>Contents</span></a>${btn('next', 'Next →', next, soon)}`;
  document.querySelectorAll('.lesson-nav[data-auto]').forEach((nav, i) => {
    nav.innerHTML = html;
    if (i === 0) nav.classList.add('top');
  });
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea')) return;
    const target = document.querySelector(`.lesson-nav[data-auto] a.navbtn.${e.key === 'ArrowRight' ? 'next' : e.key === 'ArrowLeft' ? 'prev' : 'x'}`);
    if (target && (e.altKey || e.metaKey)) location.href = target.href;
  });
})();
