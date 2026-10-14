// Site content. Edit this file to change projects and articles.
// `cover` can be:
//   - a video:  'assets/video/project-one.mp4'   (optional `poster: 'assets/img/project-one.jpg'` shown while it loads)
//   - an image: 'assets/img/project-one.jpg'
//   - a CSS background (the gradients used as placeholders)
// `gallery` entries can be a ratio string ('3/2' = placeholder) or { src: 'assets/video/x.mp4', ratio: '3/2', poster: '...' }.
// Optional `hero: [...]` at the top level lists the home-page slideshow files; otherwise project covers are used.
window.SITE = {
  name: 'maxime',
  fullName: 'Maxime Danion',
  tagline: 'systems, networks and security student',
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
      slug: 'homelab', title: 'Homelab', tagline: 'Self-hosted K3s cluster, fully provisioned as code',
      ratio: '3/2', skills: ['Infrastructure', 'IaC'], type: ['Self-hosted'], year: 2026, featured: true,
      cover: 'images/hero/server-aisle.jpg',
      intro: 'A self-hosted K3s cluster running on Proxmox, provisioned entirely as code with Terraform and Ansible. Zero-trust remote access through Tailscale with SSO-based RBAC, and a Prometheus/Grafana observability stack.',
      sections: [
        { title: 'Infrastructure as code', body: 'The whole cluster — VMs, networking, secrets and workloads — is declared in Terraform and Ansible with encrypted secret management, so it can be rebuilt from scratch reproducibly.' },
        { title: 'Zero-trust access', body: 'Remote access is handled by Tailscale with SSO identity, mapped to Kubernetes RBAC so API access is tied to real identities rather than static kubeconfigs.' },
        { title: 'Observability', body: 'A Prometheus and Grafana stack provides metrics and dashboards across the nodes and workloads.' },
      ],
      gallery: ['3/2', '3/4', '3/4', '3/2'],
      credits: [['Infrastructure', 'Maxime Danion'], ['Year', '2026']],
    },
    {
      slug: 'corporate-infrastructure', title: 'Corporate Infrastructure', tagline: 'A hardened, monitored enterprise security lab',
      ratio: '3/4', skills: ['Infrastructure', 'Security'], type: ['Security lab'], year: 2026, featured: true,
      cover: 'images/hero/network-switch.jpg',
      intro: 'A corporate-grade secure infrastructure built on OpenStack and partially automated with Ansible: a hardened Windows Active Directory, a segmented network with a DMZ, and a full detection and identity stack.',
      sections: [
        { title: 'Network & perimeter', body: 'A segmented architecture with a DMZ behind a pfSense firewall running Squid (SSL/TLS interception, mTLS), Suricata IDS/IPS and threat-intelligence feeds.' },
        { title: 'Identity & hardening', body: 'Windows Active Directory hardened to security standards, hardened application services (Nginx, SSH with Fail2Ban), and a SIEM/PKI stack for detection and secure identity management.' },
        { title: 'Detection & offensive testing', body: 'Security monitoring with MISP and Graylog, plus offensive testing to map and validate the environment against real attack paths.' },
      ],
      gallery: ['3/2', '3/4', '3/4'],
      credits: [['Security', 'Maxime Danion'], ['Year', '2026']],
    },
    {
      slug: 'acda', title: 'ACDA', tagline: 'Active Directory penetration test',
      ratio: '3/4', skills: ['Security'], type: ['Pentest'], year: 2025, featured: true,
      cover: 'images/hero/board-cluster.jpg',
      intro: 'An offensive security project auditing a Windows Active Directory environment: enumeration, privilege escalation and lateral movement, ending in a remediation report.',
      sections: [
        { title: 'The approach', body: 'Mapping the domain, identifying misconfigurations and abusable privileges, then chaining them into realistic attack paths to domain compromise.' },
        { title: 'The result', body: 'A documented set of findings with concrete hardening recommendations.' },
      ],
      gallery: ['3/2', '3/2'],
      credits: [['Security', 'Maxime Danion'], ['Year', '2025']],
    },
    {
      slug: 'adlin', title: 'ADLIN', tagline: 'Infrastructure as code',
      ratio: '3/2', skills: ['IaC', 'Infrastructure'], type: ['Automation'], year: 2025, featured: true,
      cover: 'images/hero/fiber-panel.jpg',
      intro: 'An infrastructure-as-code project automating the deployment and configuration of a set of Linux services, from provisioning to a reproducible running state.',
      sections: [
        { title: 'The approach', body: 'Describing the target infrastructure declaratively and automating its provisioning and configuration so it can be deployed consistently and repeatably.' },
      ],
      gallery: ['3/2', '3/4', '3/4'],
      credits: [['Infrastructure', 'Maxime Danion'], ['Year', '2025']],
    },
    {
      slug: 'incyber-ctf', title: 'InCyber CTF', tagline: 'CTF challenge design',
      ratio: '1/1', skills: ['Security'], type: ['CTF'], year: 2025,
      cover: 'radial-gradient(90% 90% at 50% 50%, #ff4b14 0%, #2b0a00 60%, #000 100%)',
      intro: 'Designing and building Capture-The-Flag challenges: writing exploitable scenarios, deploying the infrastructure to host them and validating the intended solution paths.',
      sections: [
        { title: 'The approach', body: 'Building self-contained, deployable challenges across security categories, each with a controlled vulnerability and a verifiable flag.' },
      ],
      gallery: ['3/2'],
      credits: [['Security', 'Maxime Danion'], ['Year', '2025']],
    },
    {
      slug: '42sh', title: '42sh', tagline: 'A POSIX shell in C',
      ratio: '1/1', skills: ['Infrastructure'], type: ['Systems'], year: 2024,
      cover: 'images/hero/microcontroller.jpg',
      intro: 'A Unix shell written in C implementing a large part of the POSIX specification: lexing, parsing and executing shell grammar, built-ins, redirections, pipelines and control flow.',
      sections: [
        { title: 'The approach', body: 'A lexer and grammar-driven parser building an AST, an execution engine for pipelines, redirections and control structures, and built-in commands — tested against the POSIX reference behaviour.' },
      ],
      gallery: ['3/4', '3/4'],
      credits: [['Development', 'Maxime Danion'], ['Year', '2024']],
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
