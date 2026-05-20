# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

ASSET+ Fleet Solutions — official Burgers Carrosserie distributor website for double deck trailers in UAE/GCC. Static HTML/CSS/JS site, no build tools or frameworks.

- **Primary domain:** assetplusgcc.com
- **Secondary domain:** assetplus.ae (301 redirects to primary)
- **Repository:** github.com/aymvnn/assetplus
- **Hosting:** Vercel (auto-deploys from `main`)

## Development

Start the local dev server:
```
# Configured in .claude/launch.json — use preview_start with name "dev"
# Serves static files on http://localhost:8080
```

No build step, no package.json, no npm. Edit HTML/CSS/JS directly.

## Deployment

```bash
git push origin main          # Vercel auto-deploys main to production within ~1 min
```

Preview deploys are created automatically for every branch push (URL: `assetplus-git-<branch>-aymadvies-2742s-projects.vercel.app`, auth-gated by Vercel Deployment Protection).

## Architecture

**Pure static site** — vanilla HTML5, CSS3, ES6+ JavaScript. No React, no jQuery, no bundler.

### Pages (13 HTML files)
All pages share the same navbar, footer, flickering grid background, and cookie consent banner. Each page includes identical `<head>` boilerplate (fonts, preconnect, hreflang, OG tags, canonical).

- Core: `index.html`, `double-deck-trailer.html`, `elc-trailers.html`, `about.html`, `contact.html`
- Tools: `savings-calculator.html`
- Marketing: `double-deck-brochure.html`, `elc-brochure.html`, `elc-onepager.html`
- Legal: `privacy-policy.html`, `terms-of-service.html`
- Error: `404.html`

### CSS (styles/)
Modular split, no preprocessor:
- **main.css** — Design tokens (CSS custom properties), font-face, root variables
- **layout.css** — Grid, containers, responsive breakpoints
- **components.css** — Buttons, navbar, cards, forms, modules
- **animations.css** — Scroll reveals (IntersectionObserver), parallax, keyframes

Key variables: `--accent: #CC0000`, `--bg-dark: #0A0A0A`, `--bg-light: #F5F5F3`, `--text-muted: #4A4A4A`

### JavaScript (js/)
- **main.js** — Navbar shrink, mobile menu, scroll reveal, parallax, count-up counters, video autoplay, flickering grid canvas, FAQ accordion
- **contact.js** — Form validation, Formspree submission (fetch API), GA4 `generate_lead` event
- **cookie-consent.js** — Self-contained IIFE, localStorage consent, brutalist design

### Server config
- **vercel.json** — Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). HTTPS, HSTS, GZIP/Brotli, asset caching, and the apex→www + assetplus.ae→assetplusgcc.com redirects are handled by Vercel itself (domain settings + edge defaults).

## Key conventions

- **Design language:** Brutalist-industrial. Space Mono for tech labels, Inter for body text.
- **Phone number:** +971 58 580 5907 (WhatsApp link: wa.me/971585805907)
- **Email:** info@assetplusgcc.com
- **Form handler:** Formspree (https://formspree.io/f/xvzwvrjr)
- **Images:** WebP with PNG/JPG fallback via `<picture>` tags. All non-hero images use `loading="lazy"`.
- **Scroll animations:** Add class `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale`, or `.clip-reveal` — IntersectionObserver handles the rest.
- **Parallax:** Add `data-parallax` attribute to elements.

## SEO structure

- Schema.org: Organization (index), Product (double-deck, elc), FAQPage (index, elc)
- Hreflang: en + ar + x-default on all pages (Arabic version planned)
- Canonical URLs: all point to www.assetplusgcc.com
- sitemap.xml and robots.txt at root

## Media

- `assets/images/` — Logos, hero images, product renders (tracked in git)
- `mediatouse/` — Photography, partner logos, videos (1.4GB, large videos git-ignored)
- WebP versions sit alongside originals (same name, .webp extension)
