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
      slug: 'homelab', title: 'Homelab', tagline: 'A GitOps Kubernetes homelab, fully provisioned as code',
      ratio: '3/2', skills: ['Infrastructure', 'Kubernetes', 'IaC', 'Security'], type: ['Self-hosted'], year: 2026, featured: true,
      cover: 'images/hero/server-aisle.jpg',
      intro: 'A 3-node K3s cluster virtualized on Proxmox and provisioned entirely as code with Terraform and Ansible. Everything is deployed through GitOps and reconciled automatically — from ingress and SSO to secrets and observability.',
      sections: [
        { title: 'Cluster & provisioning', body: 'Three K3s nodes on Proxmox, provisioned with Terraform and configured with Ansible. Raw manifests are managed with Kustomize and complex components with Helm.' },
        { title: 'GitOps delivery', body: 'ArgoCD deploys everything with auto-sync, self-heal and prune, so the running state always matches Git — including this website.' },
        { title: 'Access & identity', body: 'Traefik ingress paired with the Tailscale operator gives dual LAN/remote access with automatic HTTPS, and Authelia provides SSO across all services via OIDC and Traefik forward-auth.' },
        { title: 'Secrets & RBAC', body: 'Secrets live in OpenBao (Vault-compatible) and sync into Kubernetes through the External Secrets Operator using Kubernetes auth, with RBAC-based access control across the stack.' },
      ],
      gallery: ['3/2', '3/4', '3/4', '3/2'],
      credits: [['Infrastructure', 'Maxime Danion'], ['Year', '2026']],
    },
    {
      slug: 'sna', title: 'SNA', tagline: 'A hardened enterprise security architecture on OpenStack',
      ratio: '3/4', skills: ['Security', 'Infrastructure', 'Networking'], type: ['Secure Network Architecture'], year: 2026, featured: true,
      cover: 'images/hero/network-switch.jpg',
      intro: 'A full enterprise IT infrastructure designed and hardened from the ground up on OpenStack, covering the entire security stack — from identity and endpoints to perimeter, PKI, detection and offensive testing.',
      sections: [
        { title: 'Identity & endpoints', body: 'Windows Active Directory (domain controller, GPOs, LAPS, BitLocker) with Debian clients joined via SSSD and LUKS full-disk encryption.' },
        { title: 'Perimeter & PKI', body: 'A pfSense firewall with a Squid forward proxy doing SSL-Bump/TLS interception and ClamAV content inspection, mutual-TLS client authentication, and a custom internal Certificate Authority.' },
        { title: 'DMZ & web services', body: 'An Nginx reverse proxy (vhosts, TLS termination) in front of Apache/WordPress, deployed and hardened with Ansible — nftables, fail2ban, SSH/sudo hardening and user management.' },
        { title: 'Threat intel & SIEM', body: 'MISP for IOC and feed management, exporting Snort IDS rules and blocklists to pfSense/Squid, and a Dockerized Graylog SIEM (OpenSearch/MongoDB) centralizing firewall, Apache, Nginx and fail2ban logs.' },
        { title: 'Vulnerability & pentest', body: 'Network and host audits from Kali Linux with OpenVAS/GVM, web testing with Burp Suite, OWASP ZAP and sqlmap, and Windows hardening baselines from Microsoft’s Security Compliance Toolkit.' },
      ],
      gallery: ['3/2', '3/4', '3/4'],
      credits: [['Security', 'Maxime Danion'], ['Year', '2025 – 2026']],
    },
    {
      slug: 'ad-pentest', title: 'Active Directory Pentest', tagline: 'Black-box offensive assessment of an AD domain',
      ratio: '3/4', skills: ['Security'], type: ['Pentest'], year: 2025, featured: true,
      cover: 'images/projects/cybersecurity.jpg',
      intro: 'A black-box offensive assessment of a Windows Active Directory domain, from reconnaissance to full domain compromise, delivered with a complete remediation plan.',
      sections: [
        { title: 'Reconnaissance', body: 'Mapped 2,500+ accounts with BloodHound CE using LDAP and Cypher queries to identify attack paths to Domain Admins.' },
        { title: 'Exploitation', body: 'Chained 10+ techniques — Kerberoasting, AS-REP Roasting, Pass-the-Hash, Silver and Golden Tickets, ACL abuse (GenericAll, WriteOwner), RBCD, password spraying and DCSync — reaching full domain compromise and krbtgt hash extraction.' },
        { title: 'Remediation', body: 'A full hardening plan: gMSA, Protected Users, krbtgt rotation, lockout policy, least-privilege and GPO tightening.' },
      ],
      gallery: ['3/2', '3/2'],
      credits: [['Security', 'Maxime Danion'], ['Year', '2025']],
    },
    {
      slug: 'adlin', title: 'ADLIN', tagline: 'A fully automated Linux infrastructure',
      ratio: '3/2', skills: ['IaC', 'Infrastructure'], type: ['Automation'], year: 2026, featured: true,
      cover: 'images/projects/cable-closet.jpg',
      intro: 'A fully automated infrastructure built with Terraform and Ansible on Linux: a multi-server setup with DNS and a complete monitoring stack, deployable end-to-end from code.',
      sections: [
        { title: 'The approach', body: 'Terraform provisions the servers and Ansible configures the services — DNS, a multi-server topology and a Grafana + Prometheus monitoring stack — so the whole environment can be stood up reproducibly.' },
      ],
      gallery: ['3/2', '3/4', '3/4'],
      credits: [['Infrastructure', 'Maxime Danion'], ['Year', '2026']],
    },
    {
      slug: 'tinyx', title: 'TinyX', tagline: 'A Twitter-like API, built in a team of 14',
      ratio: '1/1', skills: ['Kubernetes', 'Development'], type: ['Backend'], year: 2025,
      cover: 'images/hero/board-cluster.jpg',
      intro: 'Backend design and development of a small Twitter-like API, built in a team of 14 with a polyglot persistence stack and deployed on Kubernetes.',
      sections: [
        { title: 'The approach', body: 'A Java/Quarkus backend backed by Redis, MongoDB, ElasticSearch and Neo4j, deployed with K3s and built through a full GitLab workflow — issues, merge requests, reviews and milestones.' },
      ],
      gallery: ['3/2', '3/4'],
      credits: [['Backend', 'Maxime Danion'], ['Team', '14 people'], ['Year', '2025']],
    },
    {
      slug: '42sh', title: '42sh', tagline: 'A POSIX-compliant UNIX shell in C',
      ratio: '1/1', skills: ['Systems'], type: ['Systems'], year: 2025,
      cover: 'images/hero/microcontroller.jpg',
      intro: 'A POSIX-compliant UNIX command interpreter written in C: simple and complex commands, process management, redirections, pipelines, control structures, variables and built-ins.',
      sections: [
        { title: 'Parsing & execution', body: 'A lexer, parser and executor following the POSIX specification, running shell grammar including if/while/for and built-ins such as cd, export and echo.' },
        { title: 'Process management', body: 'fork, exec, pipelines and file-descriptor redirections, with careful dynamic memory handling and resource optimization.' },
        { title: 'Testing', body: 'A robust test suite integrated with an Autotools build system.' },
      ],
      gallery: ['3/4', '3/4'],
      credits: [['Development', 'Maxime Danion'], ['Year', '2025']],
    },
    {
      slug: 'bittorrent', title: 'BitTorrent Client', tagline: 'A decentralized file-sharing client in C',
      ratio: '3/2', skills: ['Networking'], type: ['Networking'], year: 2024,
      cover: 'images/hero/fiber-panel.jpg',
      intro: 'A BitTorrent client written in C for decentralized file sharing: it talks to peers and trackers, manages segmented transfers, verifies integrity and optimizes downloads.',
      sections: [
        { title: 'Peer-to-peer networking', body: 'TCP socket connections, protocol message exchange and peer management, with torrent metadata parsing and tracker announces for segmented downloads.' },
        { title: 'Integrity & performance', body: 'SHA-1 integrity checks for valid file reconstruction, and epoll-based asynchronous I/O with parallel connections to maximize throughput.' },
        { title: 'Validation', body: 'Real-world testing with Wireshark and tcpdump, interoperating with existing BitTorrent clients.' },
      ],
      gallery: ['3/2', '3/2'],
      credits: [['Development', 'Maxime Danion'], ['Year', '2024']],
    },
    {
      slug: 'malloc', title: 'Malloc', tagline: 'A custom memory allocator in C',
      ratio: '1/1', skills: ['Systems'], type: ['Systems'], year: 2024,
      cover: 'images/projects/ram-memory.jpg',
      intro: 'A custom memory allocator in C implementing malloc, free, realloc and calloc, managing dynamic memory with mmap while minimizing fragmentation.',
      sections: [
        { title: 'Memory management', body: 'Page and metadata management with free lists and block splitting/merging to optimize space usage and reduce fragmentation.' },
        { title: 'Testing', body: 'Validated with LD_PRELOAD against real-world programs to ensure stability and efficiency.' },
      ],
      gallery: ['3/4', '3/4'],
      credits: [['Development', 'Maxime Danion'], ['Year', '2024']],
    },
    {
      slug: 'ocr', title: 'OCR Sudoku Solver', tagline: 'An OCR system that solves Sudoku from images',
      ratio: '3/2', skills: ['Development'], type: ['Computer vision'], year: 2024,
      cover: 'images/projects/sudoku.jpg',
      intro: 'An OCR system in C that automatically solves Sudoku grids from scanned images: it processes the image, extracts the grid, recognizes the digits and computes the solution.',
      sections: [
        { title: 'Image pipeline', body: 'Preprocessing and filtering to improve detection, then edge detection to extract the Sudoku grid from the image.' },
        { title: 'Recognition & solving', body: 'A trained neural network recognizes digits 1–9, and a backtracking algorithm computes the solution from the extracted grid.' },
      ],
      gallery: ['3/2', '3/2'],
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
