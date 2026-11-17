# AIC Website TODO

## Public competition experience

- [ ] The public site communicates that AIC is the inaugural, professionally organized Applied Intelligence Challenge, open to all students in Grades 9–12 across Canada, including every province and territory, without inventing previous participants, winners, sponsors, partnerships, awards, or statistics.
- [ ] The site uses an original editorial visual identity with Fraunces-style display typography, DM Sans-style interface typography, deep navy/ink, warm off-white, cobalt interaction color, restrained coral accents, custom SVG/math/connected-node visuals, and no generic robot imagery, excessive gradients, glassmorphism, or emoji-based icons.
- [ ] Navigation includes Home, About AIC, The Challenge, Timeline, Prizes, FAQ, and Register; Register is visually prominent; navigation works on desktop, tablet, and phones with sticky behavior, an animated active underline, and a clean animated mobile menu.
- [ ] The home page includes the exact hero headline “Think Beyond the Classroom. Solve What’s Next.”, supporting copy about solving real-world problems through artificial intelligence, mathematics, computer science, engineering, and business, the eligibility label “OPEN TO CANADIAN HIGH SCHOOL STUDENTS | GRADES 9–12”, “Register Your Team”, and “Explore the Challenge” CTAs.
- [ ] The home page includes About AIC, Why Participate benefits (real-world application, critical thinking, collaboration, presentations to industry professionals, experienced feedback, technology/innovation/entrepreneurship experience), clear nationwide eligibility, virtual format, and eligible teammates in an editorial layout rather than six repeated cards.
- [ ] The home page includes an interactive six-stage process: Form a Team, Register, Develop a Solution, Submit, Finalist Presentations, Awards.
- [ ] The timeline includes editable-looking organizer-controlled entries for registration, submission deadlines, judging, finalist presentations, and awards, and clearly identifies unconfirmed schedule items as tentative rather than presenting unconfirmed dates as official.
- [ ] The prizes section includes First Place, Second Place, Third Place, Special Recognition, and Certificate of Participation for all members, without inventing prize values or sponsor claims.
- [ ] The home page ends with “Your Ideas Deserve a Bigger Stage.” and a “Register for AIC” CTA.
- [ ] Scroll reveal, moving geometry, timeline animation, button hover states, subtle image/diagram transitions, FAQ accordion, focus states, and reduced-motion support are implemented intentionally and accessibly.

## Registration and FAQ

- [ ] The registration page includes “Your AIC Journey Starts Here.” and the exact supporting copy “Ready to challenge yourself? Register your team for the Applied Intelligence Challenge and join students from across Canada.”
- [ ] The registration page clearly states Grades 9–12, available across Canada, virtual competition, May 1st, and registration deadline April 10th.
- [ ] The form includes Full Name, Email Address, Phone (Optional), School, Grade dropdown with Grade 9/10/11/12, Team Name, Number of Team Members dropdown constrained to 2–4, Additional Information optional, and honeypot protection.
- [ ] Full Name and Email Address are described as the designated team contact. Required indicators, placeholders, clear errors, valid email validation, grade/team-size validation, loading state, duplicate-submission prevention, spam protection, privacy notice, and professional submit UI are present.
- [ ] Success is shown only after the backend confirms Google Apps Script successfully wrote the Sheet row, using “You’re Registered!” and “Your AIC registration has been successfully received.”; failed requests preserve entered information and show a clear retryable error.
- [ ] FAQ answers cover Grades 9–12; Canada-wide eligibility; cross-school teams; virtual delivery; online registration; team size 2–4; 6 hours to design, 2 hours mentorship, and 1 hour break after registration; judging rubric provided closer to the date; Certificates of Excellence for winning teams; and participation without prior coding or AI experience. No unfinalized policies are invented.

## Secure registration infrastructure

- [ ] Registration follows Website Form → Netlify Serverless Function → Google Apps Script Web App → Private Google Sheet. The browser never contacts Google Sheets directly and never receives credentials.
- [ ] Backend environment variables are named GOOGLE_APPS_SCRIPT_URL and GOOGLE_APPS_SCRIPT_SECRET and are read only from backend runtime configuration.
- [ ] Backend validation covers required fields, email format, grade, team size, honeypot, normalized-email duplicate prevention, appropriate error handling, and duplicate-click prevention. Google Apps Script uses a shared secret and concurrency protection.
- [ ] The Google Sheet setup documentation creates columns Submission Date and Time, Full Name, Email, School, Grade, Team Name, Team Size, and Additional Information; bold/frozen header, filters, readable column sizing, consistent Canadian timezone, private access, and one row per successful registration are specified.
- [ ] Until the organizer configures the integration, the site honestly shows a setup/unavailable message and never creates fake registrations or claims a registration succeeded.
- [ ] Documentation covers creating a private Sheet, Extensions → Apps Script, adding code, storing the shared secret in Script Properties, deploying as a Web App, copying the URL, setting Netlify environment variables, redeploying, and testing against a separate test spreadsheet.

## Technical quality and delivery

- [ ] Site is responsive, semantic, fast-loading, SEO-friendly, keyboard navigable, accessible in color contrast, has clear focus states, and supports reduced motion.
- [ ] Netlify remains the hosting target; Netlify Functions are used for secure backend operations; no unnecessary external database is introduced.
- [ ] `public/manus-routes.json` stays synchronized with the public route set and `public/robots.txt` / `public/sitemap.xml` are present.
- [ ] Build and preview checks pass, including a listening app on port 3000, a successful production build, route manifest availability, and no actionable TypeScript/JavaScript/JSON/CSS diagnostics.
