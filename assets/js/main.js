(() => {
  const S = window.SITE;
  const html = document.documentElement;
  const body = document.body;
  const page = body.dataset.page;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const A = !!(window.gsap && window.ScrollTrigger) && !reduce; // animations enabled
  const DESKTOP = '(min-width: 64rem)';
  const isDesktop = () => matchMedia(DESKTOP).matches;
  const EASE = 'power4.out';
  const EASE_IO = 'power4.inOut';

  // Without GSAP (CDN blocked, reduced motion): drop the hidden initial states and show everything.
  if (!A) {
    html.classList.remove('js');
    $$('.slide.is-active').forEach((s) => s.style.opacity = 1);
  } else {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* =========================================================
     Smooth scroll
     ========================================================= */
  let lenis = null;
  if (A && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const lockScroll = (lock) => {
    if (lenis) lock ? lenis.stop() : lenis.start();
    else body.style.overflow = lock ? 'hidden' : '';
  };

  /* =========================================================
     Text splitting
     ========================================================= */
  // Wrap every character of the element's direct text nodes in a mask (keeps child elements like underlines).
  function splitChars(el) {
    const chars = [];
    [...el.childNodes].forEach((n) => {
      if (n.nodeType !== 3 || !n.textContent.trim()) return;
      const frag = document.createDocumentFragment();
      for (const c of n.textContent.replace(/\s+/g, ' ').trim()) {
        const mask = document.createElement('span');
        mask.className = 'char-mask';
        const ch = document.createElement('span');
        ch.className = 'char';
        ch.textContent = c;
        mask.appendChild(ch);
        frag.appendChild(mask);
        chars.push(ch);
      }
      n.replaceWith(frag);
    });
    return chars;
  }

  // Split an element into masked visual lines. Returns the inner spans to animate.
  function splitLines(el) {
    const blocks = $$(':scope > .block', el);
    if (blocks.length) return blocks.flatMap(splitLines);

    const units = [];
    [...el.childNodes].forEach((n) => {
      if (n.nodeType === 3) n.textContent.split(/(\s+)/).forEach((p) => p && units.push(/^\s+$/.test(p) ? ' ' : p));
      else if (n.nodeType === 1) units.push(n.cloneNode(true));
    });
    el.textContent = '';
    const words = [];
    units.forEach((u) => {
      if (u === ' ') { el.append(' '); return; }
      const w = document.createElement('span');
      w.style.display = 'inline-block';
      w.append(u);
      el.append(w);
      words.push(w);
    });

    const lines = [];
    let top = null;
    words.forEach((w) => {
      if (top === null || Math.abs(w.offsetTop - top) > 2) { lines.push([]); top = w.offsetTop; }
      lines[lines.length - 1].push(w);
    });

    el.textContent = '';
    return lines.map((ws) => {
      const line = document.createElement('span');
      line.className = 'line';
      const inner = document.createElement('span');
      inner.className = 'line-inner';
      ws.forEach((w, i) => { if (i) inner.append(' '); inner.append(w); });
      line.append(inner);
      el.append(line);
      return inner;
    });
  }

  // Prepare a [data-reveal] element: split, hide, and return a function that plays the reveal.
  function prepareReveal(el) {
    const original = el.innerHTML;
    const inners = splitLines(el);
    gsap.set(inners, { yPercent: 110 });
    return (delay = 0) => gsap.to(inners, {
      yPercent: 0, duration: 1.2, stagger: 0.08, ease: EASE, delay,
      onComplete: () => { el.innerHTML = original; },
    });
  }

  /* =========================================================
     Page transitions (curtain)
     ========================================================= */
  const curtain = $('[data-curtain]');
  const curtainLabel = $('[data-curtain-label]');
  const LABEL_KEY = 'curtain-label';

  function curtainIn() {
    if (!A) return Promise.resolve();
    let label = '';
    try { label = sessionStorage.getItem(LABEL_KEY) || ''; sessionStorage.removeItem(LABEL_KEY); } catch {}
    curtainLabel.textContent = label;
    const chars = splitChars(curtainLabel);
    gsap.set(curtain, { yPercent: 0 });
    return new Promise((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve });
      if (chars.length) tl.fromTo(chars, { yPercent: 0 }, { yPercent: -110, duration: 0.6, stagger: 0.015, ease: 'power3.in' }, 0.05);
      tl.to(curtain, { yPercent: -100, duration: 1, ease: EASE_IO }, chars.length ? 0.3 : 0);
      tl.call(resolve, null, chars.length ? 0.75 : 0.45); // start page animations while the curtain is lifting
    });
  }

  function curtainOut(href, label) {
    try { sessionStorage.setItem(LABEL_KEY, label); } catch {}
    curtainLabel.textContent = label;
    const chars = splitChars(curtainLabel);
    lockScroll(true);
    const tl = gsap.timeline({ onComplete: () => { location.href = href; } });
    tl.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: EASE_IO });
    if (chars.length) tl.fromTo(chars, { yPercent: 110 }, { yPercent: 0, duration: 0.6, stagger: 0.015, ease: EASE }, 0.45);
  }

  const pageLabel = (href, a) => {
    const file = new URL(href, location.href).pathname.split('/').pop() || 'index.html';
    const map = { 'index.html': S.name, 'projects.html': 'projects', 'about.html': 'about', 'writing.html': 'writing' };
    if (map[file]) return map[file];
    if (a.dataset.label) return a.dataset.label;
    const h = a.querySelector('h2, h3');
    return h ? h.textContent.trim() : '';
  };

  if (A) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || a.target === '_blank' || a.hasAttribute('data-contact-toggle')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.protocol.startsWith('mailto')) return;
      if (url.pathname === location.pathname && url.search === location.search) {
        if (url.hash) return; // same-page anchor
        e.preventDefault();
        lenis ? lenis.scrollTo(0) : scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      e.preventDefault();
      closeMenu(); setChat(false);
      curtainOut(url.href, pageLabel(url.href, a));
    });
    // Coming back through the back/forward cache: hide the curtain again.
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) { gsap.set(curtain, { yPercent: -100 }); lockScroll(false); }
    });
  }

  /* =========================================================
     Hover: underline links (enter from left, leave to right)
     ========================================================= */
  if (A) {
    $$('.link-u').forEach((el) => {
      if (el.classList.contains('is-current')) return;
      el.addEventListener('mouseenter', () => gsap.fromTo(el, { '--u': '-110%' }, { '--u': '0%', duration: 0.6, ease: EASE_IO, overwrite: true }));
      el.addEventListener('mouseleave', () => gsap.to(el, { '--u': '110%', duration: 0.6, ease: EASE_IO, overwrite: true }));
    });
  }

  /* =========================================================
     Cursor tooltip
     ========================================================= */
  const tip = $('[data-tip-el]');
  if (A && tip && matchMedia('(hover: hover)').matches) {
    const xTo = gsap.quickTo(tip, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(tip, 'y', { duration: 0.5, ease: 'power3.out' });
    window.addEventListener('mousemove', (e) => { xTo(e.clientX + 16); yTo(e.clientY + 16); });
    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('[data-tip]');
      if (!t || t.contains(e.relatedTarget)) return;
      tip.textContent = t.dataset.tip;
      const chars = splitChars(tip);
      gsap.set(tip, { opacity: 1 });
      gsap.fromTo(chars, { yPercent: 110 }, { yPercent: 0, duration: 0.6, stagger: 0.012, ease: EASE });
    });
    document.addEventListener('mouseout', (e) => {
      const t = e.target.closest('[data-tip]');
      if (!t || t.contains(e.relatedTarget)) return;
      gsap.to(tip, { opacity: 0, duration: 0.3 });
    });
  }

  /* =========================================================
     Mobile menu
     ========================================================= */
  const menu = $('[data-mobile-menu]');
  let menuTl = null;
  if (A) {
    menuTl = gsap.timeline({ paused: true })
      .set(menu, { visibility: 'visible' })
      .fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: EASE_IO })
      .fromTo($$('.mobile-main span', menu), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.06, ease: EASE }, 0.4)
      .fromTo($('.mobile-foot', menu), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.6);
  }
  function openMenu() {
    body.classList.add('menu-open');
    lockScroll(true);
    if (menuTl) menuTl.timeScale(1).play(); else { menu.style.visibility = 'visible'; menu.style.clipPath = 'none'; }
  }
  function closeMenu() {
    if (!body.classList.contains('menu-open')) return;
    body.classList.remove('menu-open');
    lockScroll(false);
    if (menuTl) menuTl.timeScale(2).reverse(); else { menu.style.visibility = ''; menu.style.clipPath = ''; }
  }
  $('[data-mobile-toggle]').addEventListener('click', () => body.classList.contains('menu-open') ? closeMenu() : openMenu());

  /* =========================================================
     Contact chat
     ========================================================= */
  const chat = $('[data-chat]');
  const bubbles = $('[data-bubbles]');
  const chatScroll = $('[data-chat-scroll]');
  const answers = {};
  let chatStarted = false;
  let chatOpen = false;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const chatScript = [
    { from: 'host', text: 'Hi 👋<br>Thanks for stopping by. Tell me a little about what you have in mind.' },
    { from: 'host', text: `Short on time? Just write to me at <a href="mailto:${S.email}">${S.email}</a>.` },
    { from: 'input', key: 'name', label: 'My name is' },
    { from: 'host', text: 'Nice to meet you, %name%.' },
    { from: 'host', text: 'What are you working on?' },
    { from: 'input', key: 'project', label: 'My project is', multiline: true },
    { from: 'host', text: 'Sounds interesting. Where can I reach you?' },
    { from: 'input', key: 'email', label: 'My email is', type: 'email' },
    { from: 'host', text: 'Thanks! Your mail app will open with everything filled in. I usually reply within two days.' },
  ];

  const addBubble = (inner, cls = '') => {
    const b = document.createElement('div');
    b.className = `bubble ${cls}`;
    b.innerHTML = inner;
    bubbles.appendChild(b);
    if (A) gsap.from(b, { opacity: 0, scale: 0.85, y: 20, duration: 0.6, ease: 'back.out(1.6)' });
    chatScroll.scrollTo({ top: chatScroll.scrollHeight, behavior: 'smooth' });
    return b;
  };

  const askInput = (step) => new Promise((resolve) => {
    const field = step.multiline ? '<textarea rows="3" required></textarea>' : `<input type="${step.type || 'text'}" required>`;
    const b = addBubble(`<label>${step.label}${field}</label><button class="send" type="button">Send</button>`, 'me input');
    const input = $('input, textarea', b);
    input.focus({ preventScroll: true });
    const submit = () => {
      if (!input.value.trim() || !input.checkValidity()) { input.reportValidity(); return; }
      answers[step.key] = input.value.trim();
      b.classList.remove('input');
      b.innerHTML = `${step.label} ${esc(answers[step.key])}`;
      resolve();
    };
    $('.send', b).addEventListener('click', submit);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } });
  });

  async function runChat() {
    for (const step of chatScript) {
      if (step.from === 'host') {
        const b = addBubble('<span class="typing"><i></i><i></i><i></i></span>');
        await sleep(800);
        b.innerHTML = step.text.replace(/%(\w+)%/g, (_, k) => esc(answers[k] || ''));
        await sleep(350);
      } else {
        await askInput(step);
      }
    }
    await sleep(900);
    const subject = encodeURIComponent(`Project enquiry from ${answers.name}`);
    const text = encodeURIComponent(`${answers.project}\n\n— ${answers.name} (${answers.email})`);
    location.href = `mailto:${S.email}?subject=${subject}&body=${text}`;
  }

  function setChat(open) {
    if (open === chatOpen) return;
    chatOpen = open;
    chat.setAttribute('aria-hidden', String(!open));
    if (open) closeMenu();
    lockScroll(open);
    if (A) {
      gsap.killTweensOf(chat);
      if (open) {
        gsap.set(chat, { visibility: 'visible' });
        gsap.fromTo(chat, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: EASE_IO });
      } else {
        gsap.to(chat, { clipPath: 'inset(0 0 100% 0)', duration: 0.7, ease: EASE_IO, onComplete: () => gsap.set(chat, { visibility: 'hidden' }) });
      }
    } else {
      chat.style.visibility = open ? 'visible' : 'hidden';
      chat.style.clipPath = open ? 'none' : '';
    }
    if (open && !chatStarted) { chatStarted = true; setTimeout(runChat, A ? 500 : 0); }
  }
  $$('[data-contact-toggle]').forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); setChat(!chatOpen); }));
  $('[data-chat-close]').addEventListener('click', () => setChat(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setChat(false); closeMenu(); } });

  // Footer mail form
  $('[data-mail-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    const from = e.target.email.value;
    location.href = `mailto:${S.email}?subject=${encodeURIComponent('Hello')}&body=${encodeURIComponent(`From: ${from}`)}`;
  });

  /* =========================================================
     Accordions (project page)
     ========================================================= */
  $$('[data-accordion]').forEach((acc) => {
    const content = $('[data-acc-content]', acc);
    $('[data-acc-toggle]', acc).addEventListener('click', () => {
      const open = !acc.classList.contains('is-open');
      acc.classList.toggle('is-open', open);
      if (!A) { content.style.height = open ? 'auto' : '0'; return; }
      gsap.to(content, { height: open ? 'auto' : 0, duration: 1.1, ease: EASE_IO, onComplete: () => ScrollTrigger.refresh() });
      if (open) {
        const borders = $$('.border-t', content);
        borders.forEach((b) => b.classList.remove('is-drawn'));
        borders.forEach((b, i) => setTimeout(() => b.classList.add('is-drawn'), 250 + i * 120));
      }
    });
  });

  /* =========================================================
     Projects filters
     ========================================================= */
  function initFilters() {
    const wrap = $('[data-filters]');
    if (!wrap) return;
    const cards = $$('[data-render="projects"] [data-card]');
    const empty = $('[data-empty]');
    const sel = { skills: new Set(), types: new Set() };
    let openGroup = null;

    const optButtons = (g) => $$(`[data-opts="${g}"] button`);
    if (A) gsap.set($$('.opts button'), { y: 0, yPercent: -110 });
    const showOpts = (g, show) => {
      const box = $(`[data-opts="${g}"]`);
      box.classList.toggle('is-open', show);
      const btns = optButtons(g);
      if (A) gsap.to(btns, { yPercent: show ? 0 : -110, duration: 0.7, stagger: show ? 0.04 : 0.02, ease: show ? EASE : 'power3.in', overwrite: true });
      else btns.forEach((b) => b.style.transform = show ? 'none' : '');
    };

    $$('[data-filter-group]').forEach((btn) => btn.addEventListener('click', () => {
      const g = btn.dataset.filterGroup;
      if (openGroup) { showOpts(openGroup, false); $(`[data-filter-group="${openGroup}"]`).classList.remove('is-open'); }
      openGroup = openGroup === g ? null : g;
      if (openGroup) { showOpts(g, true); btn.classList.add('is-open'); }
      wrap.classList.toggle('has-open', !!openGroup);
    }));

    const apply = () => {
      const match = (c) =>
        (!sel.skills.size || c.dataset.skills.split('|').some((v) => sel.skills.has(v))) &&
        (!sel.types.size || c.dataset.types.split('|').some((v) => sel.types.has(v)));
      $$('[data-group-count]').forEach((s) => { const n = sel[s.dataset.groupCount].size; s.textContent = n || ''; });
      wrap.classList.toggle('has-active', sel.skills.size + sel.types.size > 0);
      const visible = cards.filter(match);
      const swap = () => {
        cards.forEach((c) => c.style.display = visible.includes(c) ? '' : 'none');
        empty.hidden = visible.length > 0;
        if (A) {
          ScrollTrigger.refresh();
          gsap.fromTo(visible, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.06, ease: EASE });
        }
      };
      if (A) gsap.to(cards.filter((c) => c.style.display !== 'none'), { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in', onComplete: swap, overwrite: true });
      else swap();
    };

    const bind = (g, attr) => optButtons(g).forEach((b) => b.addEventListener('click', () => {
      const v = b.dataset[attr];
      sel[g].has(v) ? sel[g].delete(v) : sel[g].add(v);
      b.classList.toggle('is-active', sel[g].has(v));
      apply();
    }));
    bind('skills', 'filterSkill');
    bind('types', 'filterType');

    $('[data-filter-reset]').addEventListener('click', () => {
      sel.skills.clear(); sel.types.clear();
      $$('.opts button').forEach((b) => b.classList.remove('is-active'));
      apply();
    });

    // Preselect from the URL (?skill=Development), used by the nav "skills" submenu.
    const pre = new URLSearchParams(location.search).get('skill');
    const preBtn = pre && optButtons('skills').find((b) => b.dataset.filterSkill === pre);
    if (preBtn) {
      sel.skills.add(pre); preBtn.classList.add('is-active');
      cards.forEach((c) => { if (!c.dataset.skills.split('|').includes(pre)) c.style.display = 'none'; });
      $$('[data-group-count="skills"]').forEach((s) => s.textContent = '1');
      wrap.classList.add('has-active');
      $('[data-filter-group="skills"]').click();
    }
  }
  initFilters();

  // Videos only play while on screen (saves battery and bandwidth).
  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) e.target.play().catch(() => {});
      else e.target.pause();
    }));
    const watch = (root) => $$('video', root).forEach((v) => vio.observe(v));
    watch(document);
    new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && watch(n)))).observe(body, { childList: true, subtree: true });
  }

  /* =========================================================
     Everything below is animation only
     ========================================================= */
  if (!A) return;

  // ---- Nav: intro on the home page, simple char rise elsewhere ----
  const nav = $('[data-nav]');
  const navTitle = $('[data-nav-title]');
  const navSub = $('[data-nav-subtitle]');
  const titleChars = splitChars($('a', navTitle));
  const subChars = splitChars(navSub);
  const linkChars = $$('[data-nav-char]', nav).flatMap(splitChars);
  const allNavChars = [...titleChars, ...subChars, ...linkChars];
  gsap.set(allNavChars, { yPercent: 110 });

  function navIntroFull(tl) {
    // Title and subtitle start side by side in the middle of the screen, then slide to their places.
    const GAP = 150;
    const tr = $('a', navTitle).getBoundingClientRect();
    const sr = navSub.getBoundingClientRect();
    const start = (innerWidth - (tr.width + GAP + sr.width)) / 2;
    gsap.set(navTitle, { x: start - tr.left });
    gsap.set(navSub, { x: start + tr.width + GAP - sr.left });
    nav.classList.remove('is-intro');
    tl.to(titleChars, { yPercent: 0, duration: 1.5, stagger: 0.012, ease: EASE })
      .to(subChars, { yPercent: 0, duration: 1, stagger: 0.01, ease: EASE }, '-=1')
      .to([navTitle, navSub], { x: 0, duration: 2, ease: EASE })
      .to(linkChars, { yPercent: 0, duration: 1, stagger: 0.01, ease: EASE }, '-=1.5');
    return '-=1.5';
  }

  function navIntroShort(tl) {
    nav.classList.remove('is-intro');
    tl.to(allNavChars, { yPercent: 0, duration: 1, stagger: 0.008, ease: EASE });
    return 0.2;
  }

  // ---- Home: hero ----
  function initHero(tl, pos) {
    const hero = $('[data-hero]');
    if (!hero) return;
    const slides = $$('.slide', hero);
    const zoom = $('[data-hero-zoom]', hero);

    // Hero is black while the title appears; the images fade in as the menu links rise into place.
    // Slideshow: each image stays SHOW seconds with a slow zoom, then crossfades into the next.
    const SHOW = 5;   // seconds each image is fully visible
    const FADE = 1.8; // seconds of crossfade between two images
    const ZOOM = 1.1; // starting scale; eases down to 1 while the image is on screen
    let current = 0;
    let z = 1;

    const showSlide = (i) => {
      const s = slides[i];
      const prev = slides[current];
      current = i;
      gsap.set(s, { zIndex: ++z });
      gsap.fromTo(s, { opacity: 0 }, { opacity: 1, duration: FADE, ease: 'power2.inOut', overwrite: 'auto' });
      gsap.fromTo(s, { scale: ZOOM }, { scale: 1, duration: SHOW + FADE * 2, ease: 'none' });
      if (prev !== s) gsap.to(prev, { opacity: 0, duration: 0.01, delay: FADE, overwrite: 'auto' });
      if (slides.length > 1) gsap.delayedCall(SHOW + FADE, () => showSlide((i + 1) % slides.length));
    };

    gsap.set(slides, { opacity: 0 });
    tl.call(() => { hero.classList.add('is-on'); showSlide(0); }, null, pos);

    gsap.fromTo(zoom, { scale: 1, opacity: 1 }, {
      scale: 2, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });

    // Nav reads normally over the hero, then switches to difference blending.
    ScrollTrigger.create({
      trigger: hero, start: 'top top', end: () => `bottom top+=${nav.offsetHeight}`,
      onToggle: (self) => nav.classList.toggle('over-hero', self.isActive),
    });
    nav.classList.add('over-hero');

    // Desktop: nav sits mid-hero, then sticks to the top once it reaches it.
    ScrollTrigger.create({
      start: () => innerHeight / 2 - nav.offsetHeight / 2, end: 'max',
      onToggle: (self) => nav.classList.toggle('is-stuck', self.isActive),
    });
  }

  // ---- Generic scroll animations ----
  function initScrollAnimations() {
    // Text lines
    $$('[data-reveal]').forEach((el) => {
      if (el.closest('[data-acc-content]')) return;
      const play = prepareReveal(el);
      ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => play() });
    });

    // Lines that draw themselves
    $$('.border-t').forEach((b) => {
      if (b.closest('[data-acc-content]')) return;
      ScrollTrigger.create({ trigger: b.closest('[data-approach]') || b.parentElement, start: 'top 92%', once: true, onEnter: () => b.classList.add('is-drawn') });
    });
    $$('.cta').forEach((c) => ScrollTrigger.create({ trigger: c, start: 'top 95%', once: true, onEnter: () => c.classList.add('is-drawn') }));

    // Images
    $$('.media').forEach((m) => {
      const inner = $('.media-inner', m);
      if (!inner || m.closest('[data-approach-img]')) return;
      gsap.set(m, { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(inner, { scale: 1.25, transition: 'none' });
      ScrollTrigger.create({
        trigger: m, start: 'top 95%', once: true,
        onEnter: () => {
          gsap.to(m, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: EASE_IO });
          gsap.to(inner, { scale: 1, duration: 1.8, ease: EASE, onComplete: () => gsap.set(inner, { clearProps: 'transform,transition' }) });
        },
      });
    });

    // Card captions
    $$('[data-card]').forEach((card) => {
      const text = $$('h2, h3, .grey', card);
      gsap.set(text, { opacity: 0, y: 16 });
      ScrollTrigger.create({
        trigger: card, start: 'top 90%', once: true,
        onEnter: () => gsap.to(text, { opacity: 1, y: 0, duration: 1, stagger: 0.08, delay: 0.4, ease: EASE }),
      });
    });

    // Small parallax on large standalone images
    $$('.about-block + .media .media-inner, .a-cover .media-inner').forEach((inner) => {
      gsap.fromTo(inner, { yPercent: -8 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: inner.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
      gsap.set(inner, { scale: 1.2 });
    });

    // Footer
    const word = $('[data-footer-word]');
    const wordChars = splitChars(word);
    gsap.set(wordChars, { yPercent: 105 });
    ScrollTrigger.create({
      trigger: '[data-footer]', start: 'top 55%', once: true,
      onEnter: () => gsap.to(wordChars, { yPercent: 0, duration: 1.6, stagger: 0.06, ease: EASE }),
    });
    gsap.fromTo('.footer-grid', { y: -80 }, {
      y: 0, ease: 'none',
      scrollTrigger: { trigger: '[data-footer]', start: 'top bottom', end: 'top top', scrub: true },
    });
  }

  // ---- About: pinned approach steps + skills highlight ----
  function initAbout() {
    const approach = $('[data-approach]');
    if (!approach) return;
    const steps = $$('[data-step]', approach);
    const bodies = steps.map((s) => $('[data-step-body]', s));
    const imgBox = $('[data-approach-img]');
    let active = 0;

    const setActive = (i, animate = true) => {
      if (i === active && animate) return;
      active = i;
      steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
      // Crossfade image
      imgBox.insertAdjacentHTML('beforeend', window.mediaInner(steps[i].dataset.cover));
      const layer = imgBox.lastElementChild;
      gsap.fromTo(layer, { clipPath: 'inset(100% 0 0 0)' }, {
        clipPath: 'inset(0% 0 0 0)', duration: 0.9, ease: EASE_IO,
        onComplete: () => { while (imgBox.children.length > 1) imgBox.firstElementChild.remove(); },
      });
    };

    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      bodies.forEach((b, k) => gsap.set(b, { height: k === active ? 'auto' : 0 }));
      const st = ScrollTrigger.create({
        trigger: approach, start: 'top top', end: () => `+=${(steps.length - 1) * innerHeight * 0.6}`,
        pin: true, scrub: true,
        onUpdate: (self) => {
          const i = Math.min(steps.length - 1, Math.round(self.progress * (steps.length - 1)));
          if (i === active) return;
          setActive(i);
          bodies.forEach((b, k) => gsap.to(b, { height: k === i ? 'auto' : 0, duration: 0.9, ease: EASE_IO, overwrite: true }));
        },
      });
      return () => st.kill();
    });
    mm.add('(max-width: 63.99rem)', () => {
      gsap.set(bodies, { height: 'auto' });
      const sts = steps.map((s, k) => ScrollTrigger.create({
        trigger: s, start: 'top 60%', end: 'bottom 60%',
        onToggle: (self) => self.isActive && setActive(k),
      }));
      return () => sts.forEach((t) => t.kill());
    });

    // Skills list lights up item by item while the section is pinned
    const section = $('[data-skills-section]');
    const items = $$('[data-skill]', section);
    const light = (p) => {
      const n = Math.round(p * (items.length - 1));
      items.forEach((li, k) => li.classList.toggle('is-active', k === n));
    };
    mm.add(DESKTOP, () => {
      const st = ScrollTrigger.create({
        trigger: section, start: 'center center', end: () => `+=${items.length * innerHeight * 0.12}`,
        pin: true, scrub: true, onUpdate: (self) => light(self.progress),
      });
      light(0);
      return () => st.kill();
    });
    mm.add('(max-width: 63.99rem)', () => {
      const st = ScrollTrigger.create({ trigger: section, start: 'top 70%', end: 'bottom 30%', scrub: true, onUpdate: (self) => light(self.progress) });
      return () => st.kill();
    });
  }

  // ---- Boot sequence ----
  const ready = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 1500))]);

  ready.then(async () => {
    initAbout();
    initScrollAnimations();
    const isHome = page === 'home';
    const tl = gsap.timeline({ paused: true });
    let pos;
    if (isHome && isDesktop()) {
      // Full intro every time the home page opens. Coming from another page, lift the curtain first.
      let fromInternal = false;
      try { fromInternal = sessionStorage.getItem(LABEL_KEY) !== null; } catch {}
      if (fromInternal) await curtainIn();
      else gsap.set(curtain, { yPercent: -100 });
      pos = navIntroFull(tl);
    } else {
      await curtainIn();
      pos = navIntroShort(tl);
    }
    if (isHome) initHero(tl, pos);
    tl.play();
    ScrollTrigger.refresh();
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
