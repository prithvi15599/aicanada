# AIC Website Implementation Plan

## Product scope

The Applied Intelligence Challenge (AIC) site presents an inaugural, Canada-wide virtual competition for students in Grades 9–12. The public site is a content-rich single-page experience with focused routes for Home, About AIC, The Challenge, Timeline, Prizes, FAQ, and Register. The site must be credible to students, teachers, judges, universities, and industry professionals without claiming unconfirmed sponsors, awards, statistics, past winners, or policies.

Registration is a real form with honest configuration handling. The browser posts only to a same-origin server endpoint. The Netlify-compatible backend validates the request, applies a honeypot and normalized-email duplicate guard, forwards only validated records to Google Apps Script with a backend-only shared secret, and returns success only after Apps Script confirms a Google Sheet row was written. Until environment variables are configured, the form communicates that registration is not yet available instead of claiming success.

## Design direction

Three possible directions were considered:

1. **Editorial Systems Journal** - structured typography, ink-blue authority, cobalt interaction, and diagrammatic layouts that make innovation feel rigorous. (0.06)
2. **Campus Future Lab** - brighter academic warmth, more photography, and workshop-like navigation. (0.08)
3. **Signal / North** - high-contrast competition identity with sharp geometry, map-line motifs, and restrained coral. (0.07)

### Chosen direction: Editorial Systems Journal

- **Design Movement:** contemporary editorial design fused with scientific notebook systems and Canadian civic wayfinding.
- **Core Principles:** confident restraint; information hierarchy over decoration; human warmth inside technical precision; motion that reveals structure.
- **Color Philosophy:** warm paper establishes approachability and gives navy authority. Cobalt is the active “signal” color for action and progress. Coral is used sparingly as a human spark: deadlines, accents, and emphasis. Ink-black text and muted slate preserve readability.
- **Layout Paradigm:** asymmetric editorial columns, numbered rails, overlapping diagrams, and long-form sections that alternate between wide narrative bands and narrow proof points. Avoid a repeated card grid.
- **Signature Elements:** a modular “A” mark built from two intersecting strokes; a thin coordinate/grid pattern used as a quiet field; animated node-and-line diagrams that connect competition stages.
- **Interaction Philosophy:** every interaction should make the system clearer-hover states expose the next action, the FAQ opens like a reference index, and timeline steps brighten in sequence. No motion is required for comprehension.
- **Animation:** hero copy reveals by line, diagram nodes drift slowly, section reveals use opacity/translate only, active navigation uses a short cobalt underline, and reduced-motion users receive instant states.
- **Typography System:** Fraunces for H1–H3 and display numerals; DM Sans for body copy, labels, navigation, controls, and utility text. Headings are expressive but not all-caps; labels use compact uppercase with tracking.
- **Brand Essence:** A serious, open stage where Canadian high-school teams turn an AIC-provided real-world challenge into evidence-backed ideas. Personality: rigorous, generous, forward-looking.
- **Brand Voice:** direct, invitational, and specific. Example lines: “The prompt arrives on competition day.” / “Your team does not need a perfect answer-just a strong way to find one.”
- **Wordmark & Logo:** “AIC” is paired with a split-chevron mark: two cobalt strokes meet at an offset point to suggest applied intelligence moving from prompt to outcome. The wordmark uses a compact sans lockup while Fraunces carries editorial headlines.
- **Signature Brand Color:** AIC Cobalt `#2357E6`, used as a visible signal against paper and ink.

## Implementation approach

- **Frontend:** React + TypeScript + Vite, with a lightweight hash/history router implemented in the app so each named section is addressable without a full routing dependency. Content is present in initial HTML via a meaningful app shell and static SEO metadata; the app renders full public copy immediately on load.
- **Styling:** one global CSS file with custom properties, responsive breakpoints, focus-visible styles, reduced-motion media query, and a small reveal-on-scroll utility using IntersectionObserver.
- **Illustration:** inline SVG / CSS geometry for the hero constellation and section diagrams. This keeps loading fast and avoids generic stock or robot imagery.
- **Backend:** an Express server exposes `POST /api/register` for Preview and a Netlify Functions-compatible `netlify/functions/register.mjs` implementation. The shared validation module is reused by both. `GOOGLE_APPS_SCRIPT_URL` and `GOOGLE_APPS_SCRIPT_SECRET` are read only at request time on the server. No browser bundle receives them.
- **Netlify serving:** `netlify.toml` publishes the Vite `dist` output, maps `/api/register` and `/api/registration-status` to Netlify Functions, and preserves SPA fallback for the named public routes.
- **Persistence contract:** the Google Apps Script snippet in `docs/google-sheets-setup.md` initializes the private sheet, checks a Script Properties secret, rejects malformed requests and normalized-email duplicates under `LockService`, and appends exactly one row on success.
- **SEO / discoverability:** `index.html` includes title, description, Open Graph/Twitter metadata without guessed canonical URLs, `public/robots.txt`, `public/sitemap.xml`, and `public/manus-routes.json` covering the public routes.
- **Project assets:** `public/favicon.svg` and an AIC mark are checked in. `app.config.ts` contains the required quoted `logoUrl` placeholder comment for replacement with a durable HTTPS asset before the first checkpoint.

## Project structure

```text
/home/ubuntu/aiccanada/
├── app.config.ts
├── package.json
├── pnpm-workspace.yaml
├── vite.config.ts
├── tsconfig.json
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── styles.css
│   └── registration.ts
├── server/
│   ├── index.mjs
│   └── validation.mjs
├── netlify/functions/register.mjs
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── manus-routes.json
└── docs/
    └── google-sheets-setup.md
```

## Content boundaries and tentative information

The brief supplies May 1st for the virtual competition and April 10th for registration. These are displayed as organizer-provided dates in the registration page, while the broader schedule labels remain clearly marked tentative until finalized. Prizes are described as certificate recognition and reserved categories; no monetary value, sponsor, or past outcome is invented. The registration setup banner is explicit whenever backend environment variables are absent.
