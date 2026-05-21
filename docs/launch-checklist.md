# Launch Checklist

Use this checklist before announcing ContributorOps publicly. Work through it top to bottom — each section depends on the previous one being solid.

---

## Pre-launch Technical

- [ ] GitHub Pages enabled in repo settings (Settings > Pages > Source: GitHub Actions)
- [ ] `deploy-site.yml` workflow runs successfully end-to-end
- [ ] Custom domain configured (optional — update `vite.config.ts` base path if used)
- [ ] SEO meta tags present in `apps/site/index.html` (title, description, og:title, og:description, og:url)
- [ ] `og:image` accessible at `/og-image.svg` (or `.png`) from the deployed site root
- [ ] `sitemap.xml` present in `apps/site/public/`
- [ ] `robots.txt` present in `apps/site/public/`
- [ ] `site.webmanifest` present in `apps/site/public/`
- [ ] Favicon present and linked in `index.html`
- [ ] No broken console errors on the deployed site
- [ ] Lighthouse score > 90 on the home page (performance, accessibility, best practices, SEO)

---

## Product Readiness

- [ ] All site pages loading without errors:
  - [ ] `/` — Home
  - [ ] `/#/features` — Features
  - [ ] `/#/use-cases` — Use Cases
  - [ ] `/#/demo` — Demo
  - [ ] `/#/waitlist` — Waitlist
  - [ ] `/#/pricing` — Pricing
  - [ ] `/#/docs` — Documentation
  - [ ] `/#/safety` — Safety
  - [ ] `/#/roadmap` — Roadmap
- [ ] Waitlist form tested end-to-end (fill form → submit → success state shown)
- [ ] Waitlist localStorage submission working on static site (no API dependency)
- [ ] Pricing page toggle working (monthly/yearly price switch)
- [ ] Demo page showing polished mock data (no placeholder text visible)
- [ ] Mobile navigation hamburger opening and closing correctly
- [ ] All footer links resolve to valid anchors or pages (no dead links)
- [ ] All CTA buttons link to the right destinations
- [ ] No "lorem ipsum" or placeholder text visible on any page

---

## API / Backend

- [ ] `data/waitlist.json` file exists (can be empty `[]`)
- [ ] `POST /api/waitlist` accepts a valid body and returns `{ success: true, position: N }`
- [ ] `GET /api/waitlist/stats` returns aggregate stats without error
- [ ] `GET /api/meta` returns version and feature flags without error
- [ ] `GET /api/launch-offer` returns offer details without error
- [ ] `GET /api/health` returns `{ status: "ok" }` in both mock and live mode
- [ ] `npm run build` succeeds (builds api and web)
- [ ] `npm run build:all` succeeds (builds api, web, and site)
- [ ] `npm run typecheck` completes without TypeScript errors
- [ ] CI workflow runs on push to main and all jobs pass
- [ ] No secrets or tokens committed in source files (secret-scan job passes)

---

## Documentation

- [ ] `README.md` updated with new pages, features, and badges
- [ ] `docs/architecture.md` created and accurate
- [ ] `docs/api-reference.md` created and covers all endpoints
- [ ] `docs/founder-notes.md` created
- [ ] `docs/launch-checklist.md` created (this file)
- [ ] `docs/customer-development.md` created
- [ ] `docs/safety-policy.md` reflects current three-level safety model
- [ ] `docs/monetization-plan.md` reflects current pricing tiers
- [ ] All doc links in README are valid and point to existing files
- [ ] Docs page on the site (`/#/docs`) links to the correct GitHub doc files

---

## Launch

- [ ] Product Hunt draft prepared (tagline, description, first comment, gallery screenshots)
- [ ] GitHub repo description updated (one-line description + website URL filled in)
- [ ] GitHub repo topics added (e.g., `open-source`, `developer-tools`, `career`, `typescript`, `react`)
- [ ] First demo video planned or recorded (even a simple screen recording works)
- [ ] Social proof placeholder added to homepage (or remove the section entirely until real proof exists)
- [ ] README badges verified working (CI badge, GitHub Pages badge)
- [ ] Announce in relevant communities:
  - [ ] `r/cscareerquestions` — problem-focused post, not promotional
  - [ ] `r/webdev` or `r/javascript` — show the project
  - [ ] JavaScript/TypeScript Discord servers
  - [ ] Dev.to — founder story post
  - [ ] Hashnode — technical deep-dive post
  - [ ] X/Twitter — launch thread
  - [ ] LinkedIn — founder announcement
- [ ] Submit to GitHub Trending watch lists or newsletters (e.g., JavaScript Weekly, Node Weekly)
- [ ] Respond to all early comments and questions within 24 hours
- [ ] Set up a simple way to track waitlist signups (even a spreadsheet works)
