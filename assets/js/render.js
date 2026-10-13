// Page renderers: fill [data-render] containers from window.SITE before animations start.
(() => {
  const S = window.SITE;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const param = (k) => new URLSearchParams(location.search).get(k);
  const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  // A cover can be a CSS background (gradient), an image path or a video path.
  const isVideo = (c) => /\.(mp4|webm|mov)(\?.*)?$/i.test(c);
  const isImage = (c) => /\.(jpe?g|png|webp|avif|gif|svg)(\?.*)?$/i.test(c);
  const mediaInner = (cover, { poster = '', cls = 'media-inner', eager = false } = {}) => {
    if (isVideo(cover)) {
      return `<div class="${cls}"><video src="${esc(cover)}"${poster ? ` poster="${esc(poster)}"` : ''} muted loop playsinline autoplay preload="${eager ? 'auto' : 'metadata'}"></video></div>`;
    }
    if (isImage(cover)) return `<div class="${cls}"><img src="${esc(cover)}" alt=""${eager ? '' : ' loading="lazy"'}></div>`;
    return `<div class="${cls}" style="background:${cover}"></div>`;
  };
  window.mediaInner = mediaInner;

  const media = (cover, ratio, cls = '', poster = '') =>
    `<div class="media ${cls}" style="aspect-ratio:${ratio}">${mediaInner(cover, { poster })}</div>`;

  const projectCard = (p, tag = 'h3') => `
    <article data-card data-skills="${esc(p.skills.join('|'))}" data-types="${esc(p.type.join('|'))}">
      <a href="project.html?p=${p.slug}" data-tip="See the project">
        ${media(p.cover, p.ratio, '', p.poster)}
        <${tag}>${esc(p.title)}</${tag}>
        <div class="grey">${esc(p.tagline)}</div>
      </a>
    </article>`;

  const articleCard = (a, tag = 'h3') => `
    <article data-card>
      <a href="article.html?a=${a.slug}" data-tip="Read the article">
        ${media(a.cover, a.ratio, '', a.poster)}
        <${tag}>${esc(a.title)}</${tag}>
      </a>
    </article>`;

  const fill = (name, html) => {
    const el = document.querySelector(`[data-render="${name}"]`);
    if (el) el.innerHTML = html;
    return el;
  };

  const renderers = {
    home() {
      fill('featured', S.projects.filter((p) => p.featured).slice(0, 4).map((p) => projectCard(p)).join(''));
      fill('latest', S.articles.slice(0, 4).map((a) => articleCard(a)).join(''));
      fill('hero', (S.hero || S.projects.map((p) => p.cover)).map((c, i) => mediaInner(c, { cls: `slide${i === 0 ? ' is-active' : ''}`, eager: true })).join(''));
    },

    projects() {
      fill('projects', S.projects.map((p) => projectCard(p, 'h2')).join(''));
      const uniq = (key) => [...new Set(S.projects.flatMap((p) => p[key]))].sort();
      const opts = (key, attr) => uniq(key).map((v) =>
        `<div class="mask"><button data-filter-${attr}="${esc(v)}">${esc(v)} <span class="x" aria-hidden="true">×</span></button></div>`).join('');
      fill('filter-skills', opts('skills', 'skill'));
      fill('filter-types', opts('type', 'type'));
      fill('projects-count', String(S.projects.length));
    },

    project() {
      const i = Math.max(0, S.projects.findIndex((p) => p.slug === param('p')));
      const p = S.projects[i];
      const next = S.projects[(i + 1) % S.projects.length];
      document.title = `${p.title} — ${S.fullName}`;
      fill('p-title', `<span class="block">${esc(p.title)}</span><span class="block grey">${esc(p.tagline)}</span>`);
      fill('p-meta', [['Skills', p.skills], ['Type', p.type], ['Year', [p.year]]].map(([k, vs]) => `
        <div class="meta-item"><span class="border-t show-mobile-inline"></span><dt>${k}</dt>${vs.map((v) => `<dd>${esc(v)}</dd>`).join('')}</div>`).join(''));
      fill('p-intro', `<p>${esc(p.intro)}</p>`);
      fill('p-sections', p.sections.map((s) => `
        <div class="acc-section"><span class="border-t"></span><h2>${esc(s.title)}</h2><div class="prose"><p>${esc(s.body)}</p></div></div>`).join(''));
      // Gallery entries: '3/2' (placeholder) or { src: 'assets/video/x.mp4', ratio: '3/2', poster: '...' }
      fill('p-gallery', p.gallery.map((g, k) => {
        const item = typeof g === 'string' ? { ratio: g } : g;
        const src = item.src || (isVideo(p.cover) || isImage(p.cover) ? p.cover
          : `linear-gradient(${40 + k * 50}deg, rgba(0,0,0,.15), rgba(255,255,255,.15)), ${p.cover}`);
        return media(src, item.ratio, item.ratio === '3/4' ? '' : 'full', item.poster);
      }).join(''));
      fill('p-credits', p.credits.map(([k, v]) => `<div class="credit"><span class="grey">${esc(k)}</span><span>${esc(v)}</span></div>`).join(''));
      fill('p-next', `
        <a href="project.html?p=${next.slug}" class="next-link" data-tip="Next project" data-label="${esc(next.title)}">
          <span class="grey text-small">Next project</span>
          <span class="text-big" data-reveal>${esc(next.title)}</span>
          ${media(next.cover, '3/2', '', next.poster)}
        </a>`);
    },

    about() {
      fill('approach', S.approach.map((s, i) => `
        <div class="step${i === 0 ? ' is-active' : ''}" data-step data-cover="${esc(s.cover)}">
          <span class="border-t"></span>
          <div class="step-head"><span class="num"><span class="filled">${'❶❷❸❹❺❻❼❽❾'[i]}</span><span class="outline">${'①②③④⑤⑥⑦⑧⑨'[i]}</span></span> <h3>${esc(s.title)}</h3></div>
          <div class="step-body" data-step-body><div><p>${esc(s.body)}</p></div></div>
        </div>`).join(''));
      fill('approach-img', mediaInner(S.approach[0].cover));
      fill('skills', S.skills.map((s) => `<li data-skill>${esc(s)}</li>`).join(''));
    },

    writing() {
      fill('articles', S.articles.map((a) => articleCard(a, 'h2')).join(''));
    },

    article() {
      const i = Math.max(0, S.articles.findIndex((a) => a.slug === param('a')));
      const a = S.articles[i];
      document.title = `${a.title} — ${S.fullName}`;
      fill('a-title', esc(a.title));
      fill('a-date', fmtDate(a.date));
      fill('a-cover', media(a.cover, '3/2', '', a.poster));
      fill('a-body', a.body.map((t) => `<p>${esc(t)}</p>`).join(''));
      fill('a-more', S.articles.filter((x) => x !== a).slice(0, 4).map((x) => articleCard(x)).join(''));
    },
  };

  renderers[document.body.dataset.page]?.();
})();
