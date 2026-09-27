# Prakash Shelke Portfolio

Static single-page portfolio for GitHub Pages. No build step, no runtime fetch, no CSS frameworks.

## Files

- `index.html`, `styles.css`, `script.js`
- `.nojekyll` (tells Pages to serve files as is)

## Deploy

1. Push this folder to a repo, then open repo Settings, Pages.
2. Source: Deploy from a branch, branch `main`, folder `/ (root)`.
3. Site serves `index.html` directly.

## Local preview

```bash
python -m http.server 8080
# open http://localhost:8080/
```

## Verification (R-35, 2026-09-27)

- `node --check script.js` PASS, zero console errors expected.
- Local server `python -m http.server 8123`: index.html 200, styles.css 200, script.js 200.
- Anchors: #top #about #experience #skills #projects #education #contact #main all resolve, zero missing.
- Theme toggle flips data-theme, persists ps-theme, both light and dark vars present.
- Mobile menu toggles .open, closes on link and Escape. Footer year auto sets.
- Hero CTAs: #experience, GitHub profile, mailto all real. 6 project cards link to github.com/avikdigidev/<repo>.
- Contact form: empty submit shows inline errors with aria-describedby, valid submit shows Sending then success plus mailto fallback.
- Copy scan: zero em dashes, zero buzzwords, no testimonials, stats, FAQ.
- Motion gated behind prefers-reduced-motion and pointer:fine. 44px targets, 360px single column, focus-visible 2px ember.
