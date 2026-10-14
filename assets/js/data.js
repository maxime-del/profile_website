// Site content. Edit this file to change projects and articles.
// `cover` can be:
//   - a video:  'assets/video/project-one.mp4'   (optional `poster: 'assets/img/project-one.jpg'` shown while it loads)
//   - an image: 'assets/img/project-one.jpg'
//   - a CSS background (the gradients used as placeholders)
// `gallery` entries can be a ratio string ('3/2' = placeholder) or { src: 'assets/video/x.mp4', ratio: '3/2', poster: '...' }.
// Optional `hero: [...]` at the top level lists the home-page slideshow files; otherwise project covers are used.
window.SITE = {
  name: 'Maxime',
  fullName: 'Maxime Danion',
  tagline: 'IT Student',
  email: 'danion.maxime12@gmail.com',
  location: ['Paris', 'France'],
  social: [
    { label: 'GitHub', href: 'https://github.com/maxime-del' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/maximedanion' },
  ],

  // Home-page slideshow (alternates between these). Spaces in file names must be written as %20.
  hero: [
    'images/hero/server-aisle.jpg',
    'images/hero/board-cluster.jpg',
    'images/hero/fiber-panel.jpg',
    'images/hero/microcontroller.jpg',
    'images/hero/network-switch.jpg',
  ],

  projects: [
    {
      slug: 'project-one', title: 'Project one', tagline: 'A short line describing the project',
      ratio: '3/2', skills: ['Development'], type: ['Web app'], year: 2026, featured: true,
      cover: 'images/hero/server-aisle.jpg',
      intro: 'Describe the project in two or three sentences: who it was for, what problem it solved and what you built.',
      sections: [
        { title: 'The challenge', body: 'What made this project hard or interesting? Constraints, goals, context.' },
        { title: 'The approach', body: 'How you tackled it: architecture, tools, design decisions and trade-offs.' },
        { title: 'The result', body: 'Outcomes, numbers, feedback, what you learned.' },
      ],
      gallery: ['3/2', '3/4', '3/4', '3/2'],
      credits: [['Development', 'Maxime Danion'], ['Design', 'Name'], ['Client', 'Name']],
    },
    {
      slug: 'project-two', title: 'Project two', tagline: 'A short line describing the project',
      ratio: '3/4', skills: ['Design', 'Development'], type: ['Website'], year: 2025, featured: true,
      cover: 'images/hero/fiber-panel.jpg',
      intro: 'Describe the project in two or three sentences: who it was for, what problem it solved and what you built.',
      sections: [
        { title: 'The challenge', body: 'What made this project hard or interesting?' },
        { title: 'The result', body: 'Outcomes, numbers, feedback, what you learned.' },
      ],
      gallery: ['3/2', '3/4', '3/4'],
      credits: [['Development', 'Maxime Danion']],
    },
    {
      slug: 'project-three', title: 'Project three', tagline: 'A short line describing the project',
      ratio: '3/4', skills: ['Product'], type: ['Mobile app'], year: 2025, featured: true,
      cover: 'images/hero/board-cluster.jpg',
      intro: 'Describe the project in two or three sentences.',
      sections: [{ title: 'The approach', body: 'How you tackled it.' }],
      gallery: ['3/2', '3/2'],
      credits: [['Product', 'Maxime Danion']],
    },
    {
      slug: 'project-four', title: 'Project four', tagline: 'A short line describing the project',
      ratio: '3/2', skills: ['Development'], type: ['Tooling'], year: 2024, featured: true,
      cover: 'images/hero/microcontroller.jpg',
      intro: 'Describe the project in two or three sentences.',
      sections: [{ title: 'The approach', body: 'How you tackled it.' }],
      gallery: ['3/2', '3/4', '3/4'],
      credits: [['Development', 'Maxime Danion']],
    },
    {
      slug: 'project-five', title: 'Project five', tagline: 'A short line describing the project',
      ratio: '1/1', skills: ['Design'], type: ['Website'], year: 2024,
      cover: 'radial-gradient(90% 90% at 50% 50%, #e8ff3a 0%, #2b3300 60%, #000 100%)',
      intro: 'Describe the project in two or three sentences.',
      sections: [{ title: 'The approach', body: 'How you tackled it.' }],
      gallery: ['3/2'],
      credits: [['Design', 'Maxime Danion']],
    },
    {
      slug: 'project-six', title: 'Project six', tagline: 'A short line describing the project',
      ratio: '1/1', skills: ['Product', 'Development'], type: ['Web app'], year: 2023,
      cover: 'linear-gradient(20deg, #000 0%, #505050 100%)',
      intro: 'Describe the project in two or three sentences.',
      sections: [{ title: 'The approach', body: 'How you tackled it.' }],
      gallery: ['3/4', '3/4'],
      credits: [['Development', 'Maxime Danion']],
    },
  ],

  articles: [
    {
      slug: 'article-one', title: 'Article title one', ratio: '1/1', date: '2026-09-01',
      cover: 'radial-gradient(circle at 30% 30%, #ff4b14, #000)',
      body: ['Opening paragraph of the article.', 'Second paragraph. Replace with your own writing.'],
    },
    {
      slug: 'article-two', title: 'Article title two', ratio: '1/1', date: '2026-07-14',
      cover: 'radial-gradient(circle at 70% 40%, #0077ff, #000)',
      body: ['Opening paragraph of the article.'],
    },
    {
      slug: 'article-three', title: 'Article title three', ratio: '3/4', date: '2026-05-02',
      cover: 'linear-gradient(#c8c8c8, #505050)',
      body: ['Opening paragraph of the article.'],
    },
    {
      slug: 'article-four', title: 'Article title four', ratio: '1/1', date: '2026-02-20',
      cover: 'radial-gradient(circle at 50% 80%, #8c8c8c, #000)',
      body: ['Opening paragraph of the article.'],
    },
    {
      slug: 'article-five', title: 'Article title five', ratio: '3/2', date: '2025-11-08',
      cover: 'linear-gradient(120deg, #0077ff, #ff4b14)',
      body: ['Opening paragraph of the article.'],
    },
  ],

  // Steps shown in the pinned "Approach" section on the about page
  approach: [
    { title: 'Understand', body: 'Listening first: goals, users, constraints. Mapping what exists before deciding what to build.', cover: 'radial-gradient(circle at 30% 30%, #ff4b14, #000)' },
    { title: 'Design & prototype', body: 'Sketching structure and interactions, then testing the riskiest ideas quickly with real code.', cover: 'radial-gradient(circle at 70% 60%, #0077ff, #000)' },
    { title: 'Build & ship', body: 'Clean, tested, documented code. Performance and accessibility from day one, not as an afterthought.', cover: 'linear-gradient(160deg, #c8c8c8, #111)' },
    { title: 'Iterate', body: 'Measuring, listening again, and improving. Good products are never really finished.', cover: 'conic-gradient(from 90deg, #ff4b14, #0077ff, #ff4b14)' },
  ],

  skills: ['Linux', 'Kubernetes', 'Docker', 'Terraform', 'Ansible', 'Helm', 'Proxmox', 'pfSense', 'Suricata', 'SIEM', 'PKI', 'Tailscale', 'Python', 'Go', 'C', 'Git'],
};
