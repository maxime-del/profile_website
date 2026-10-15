// Shared header / footer markup. Each page calls Layout.header() and Layout.footer()
// from an inline <script> so the markup is inserted synchronously (no flash).
(() => {
  const S = window.SITE;
  const page = document.body.dataset.page;

  const navLink = (href, label, key) =>
    `<a href="${href}" class="link-u${page === key ? ' is-current' : ''}" data-nav-char>${label}<span class="link-u-line"></span></a>`;

  const arrow = '<span class="arrow"><i>→</i><i>→</i></span>';

  const header = () => `
    <div class="curtain" data-curtain><span class="curtain-label" data-curtain-label></span></div>

    <header>
      <nav class="nav${page === 'home' ? ' nav-home is-intro' : ''}" data-nav>
        <ul class="grid-12 px-base">
          <li class="nav-title" data-nav-title><a href="index.html">${S.name}</a></li>
          <li class="nav-links hide-mobile" data-nav-links>
            <ul>
              <li>${navLink('projects.html', 'Projects', 'projects')}</li>
              <li>${navLink('about.html', 'About', 'about')}</li>
              <li class="has-sub" data-sub>
                <span class="link-u" data-nav-char>Skills<span class="link-u-line"></span></span>
                <ul class="sub">
                  <li><a href="projects.html?skill=Infrastructure" class="link-u">Infrastructure<span class="link-u-line"></span></a></li>
                  <li><a href="projects.html?skill=Security" class="link-u">Security<span class="link-u-line"></span></a></li>
                  <li><a href="projects.html?skill=IaC" class="link-u">IaC<span class="link-u-line"></span></a></li>
                  <li><a href="projects.html?skill=Kubernetes" class="link-u">Kubernetes<span class="link-u-line"></span></a></li>
                  <li><a href="projects.html?skill=Networking" class="link-u">Networking<span class="link-u-line"></span></a></li>
                </ul>
              </li>
              <li>${navLink('writing.html', 'Writing', 'writing')}</li>
            </ul>
          </li>
          <li class="nav-subtitle hide-mobile" data-nav-subtitle>${S.tagline}</li>
          <li class="nav-contact" data-nav-contact><button class="link-u" data-contact-toggle data-nav-char>Contact<span class="link-u-line"></span></button></li>
          <li class="nav-burger show-mobile"><button data-mobile-toggle aria-label="Menu"><span></span><span></span></button></li>
        </ul>
      </nav>

      <nav class="mobile-menu px-base" data-mobile-menu>
        <ul class="mobile-main">
          <li><a href="projects.html"><span>projects</span></a></li>
          <li><a href="about.html"><span>about</span></a></li>
          <li><a href="writing.html"><span>writing</span></a></li>
          <li><button data-contact-toggle><span>contact</span></button></li>
        </ul>
        <div class="mobile-foot grey">${S.social.map((s) => `<a href="${s.href}">${s.label}</a>`).join('<br>')}</div>
      </nav>

      <aside class="chat" data-chat aria-hidden="true" data-lenis-prevent>
        <button class="chat-close" data-chat-close aria-label="Close">×</button>
        <div class="chat-scroll" data-chat-scroll>
          <div class="chat-head">
            <div class="avatar">${S.fullName.split(' ').map((w) => w[0]).join('')}</div>
            <div>${S.fullName}</div>
            <div class="grey">${S.tagline}</div>
          </div>
          <div class="bubbles" data-bubbles></div>
        </div>
      </aside>
    </header>

    <span class="tip" data-tip-el aria-hidden="true"></span>
  `;

  const footer = () => `
    <footer class="footer px-base" data-footer>
      <div class="footer-grid">
        <div class="f-col f-span">
          <span class="border-t"></span>
          <p class="f-label">Contact</p>
          <button data-contact-toggle class="link-u">Tell me about your project<span class="link-u-line"></span></button>
          <div class="show-mobile f-mobile-mail"><a href="mailto:${S.email}" class="grey">${S.email}</a></div>
        </div>
        <div class="f-col f-start-3">
          <span class="border-t"></span>
          <p class="f-label">Elsewhere</p>
          ${S.social.map((s) => `<div><a href="${s.href}" class="link-u">${s.label}<span class="link-u-line"></span></a></div>`).join('')}
        </div>
        <div class="f-col">
          <span class="border-t"></span>
          <p class="f-label">Based in</p>
          <address>${S.location.join('<br>')}</address>
        </div>
        <div class="hide-mobile"><a href="mailto:${S.email}" class="grey hover-white">${S.email}</a></div>
        <div class="f-start-3 f-span">
          <form class="newsletter" data-mail-form>
            <input type="email" name="email" required placeholder="Leave your email, I'll get back to you">
            <button type="submit" class="cta-2" aria-label="Send">${arrow}</button>
            <span class="nl-line"><i></i></span>
          </form>
        </div>
      </div>
      <p class="grey copy">© ${new Date().getFullYear()} ${S.fullName}</p>
      <div class="footer-word" aria-hidden="true" data-footer-word>${S.name}</div>
    </footer>
  `;

  const insert = (html) => document.currentScript.insertAdjacentHTML('beforebegin', html);

  window.Layout = {
    arrow,
    header: () => insert(header()),
    footer: () => insert(footer()),
    cta: (href, label, attrs = '') =>
      `<a href="${href}" class="cta" ${attrs}><span class="cta-line"><i class="l1"></i><i class="l2"></i></span><span>${label}</span>${arrow}</a>`,
    cta2: (href, label, cls = '') => `<a href="${href}" class="cta-2 grey ${cls}">${label} ${arrow}</a>`,
  };
})();
