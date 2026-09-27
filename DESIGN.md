# DESIGN.md - Prakash Shelke Portfolio

Source: user-supplied direction, 2026-09-27. Antislop mode: DURING.
Reading this as: single-page backend engineer portfolio for mixed audience (recruiters + systems peers), in a light editorial with engineering-systems language, dial ENERGY 2 / RHYTHM 2 / MOTION 2.

## Identity
- Senior Backend Engineer, 9 years. Java 8/11/17/21, Spring Boot, Kafka, Microservices, GCP.
- Voice: direct, evidence-backed, no buzzwords. No em dashes, use commas, colons, parentheses.
- Motif: pipeline trace. Thin horizontal connector line with node dots linking hero to experience timeline to projects. Repeated once per section divider. Reason: backend data flow identity, specific to Kafka/systems work.

## Palette (2 cores + 1 accent, neutrals excluded)
- Core paper: #F7F4ED (warm paper light base). Reason: editorial calm for recruiter reading, avoids sterile white.
- Core ink: #1B1E24 (soft black text/surfaces). Reason: high contrast on paper, reuses as dark mode base.
- Accent ember: #B94E2A (fired copper). Reason: one deliberate accent for key moments only (active nav, timeline nodes, primary CTA hover), signals reliability, not AI blue-purple.
- Dark mode: base #121417, surface #1B1E24, text #EDE8DE, same ember accent darkened to #D46A42 for 4.5:1 contrast. Both modes verified per R-34.
- Forbidden: blue-purple gradients, radial orbs, grid backgrounds, glow everywhere.

## Typography
- Display: Fraunces 600 for H1/H2 only. Reason: editorial character for mixed audience, distinct from AI-default Inter/Space Grotesk headings.
- Body: Inter 400/500 for body, labels. Reason: legibility for recruiters scanning experience.
- Mono: JetBrains Mono 400 for eyebrow labels, dates, code-adjacent tags (Kafka, CQRS). Reason: backend systems voice, used sparingly, not large headings (R-06).

## Dials
- ENERGY 2 (balanced, Stripe-like, professional but alive)
- RHYTHM 2 (consistent with breaks: hero asymmetric, timeline left rail, skills grouped list, projects 2-col, contact full width)
- MOTION 2 (scroll-reveal once per section + subtle parallax on hero diagram + 3D tilt on project cards + custom cursor ring on desktop only). Each motion has UX purpose, no endless loops, respects prefers-reduced-motion, disabled on touch.

Motion purposes (R-19):
- Scroll reveal: guide attention down long single page.
- Hero parallax (max 12px): depth for pipeline diagram, stops after hero.
- Card tilt (max 6deg, desktop pointer only): affordance that cards are links to GitHub.
- Cursor ring: highlights interactive targets only, hidden on touch/keyboard.

## Structure (single-page, all nav anchors must exist)
1. #top hero: name, role, location Bhilai India, 3 line value prop from resume, CTAs: View experience (#experience), GitHub profile (external), email (mailto).
2. #about: 2-3 sentences from GitHub bio + currently improving GraphQL, Spring WebFlux. Link prakashok.co.in and tech.prakashok.co.in.
3. #experience: vertical timeline, 5 roles (Healimpilo Apr 2024-Present, Publicis Sapient Jun 2022-Apr 2024, Mphasis Mar 2021-Jun 2022, Brillio Sep 2020-Mar 2021, TechMahindra Feb 2017-Sep 2020). Bullets condensed from resume, no fabrication.
4. #skills: grouped lists (Languages, Frameworks, Data/Messaging, Ops/Observability, Tools). No proficiency bars (R-17, no source).
5. #projects: 6 real repos only (data-structures-and-algo, my-cheatsheets, d2h-java-backend, covid-hms, Ludo-SpringBoot-Application, saga-choreography-pattern-example) with language + one-line description from GitHub, link to github.com/avikdigidev. No invented stats.
6. #education: CSVTU BE 2011-2015 Bhilai.
7. #contact: email, LinkedIn, GitHub, location. Form with mailto fallback + empty/loading/error states.
Footer: single row, real links only.

## Hard constraints
- No testimonials (no source, R-18). No stats bar (R-17). No FAQ (R-28). No logo generation, text wordmark Prakash Shelke only (R-23). No em dashes (R-02).
- Contrast AA 4.5:1 normal, 3:1 large (R-25). Keyboard Tab/Enter/Escape + visible focus (R-32). Tap 44px (R-03).
- Every button has real href, toggle, or mailto (R-26). Theme toggle must work both modes (R-34).
