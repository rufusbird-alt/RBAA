# Simplify the RBAA site: 17 pages to 3

Status: plan. Commits 1 and 2 have been applied to the working tree (not committed); nothing else has. Branch `legal-identity`. Section 9 records Rufus's decisions; where it differs from sections 1–8, section 9 wins.

## 0. Today's 17 pages

| # | Route | Source |
|---|---|---|
| 1 | `/` Home | `src/app/[locale]/page.tsx` |
| 2 | `/about` | `src/app/[locale]/about/page.tsx` |
| 3 | `/approach` | `src/app/[locale]/approach/page.tsx` |
| 4 | `/services` | `src/app/[locale]/services/page.tsx` |
| 5–8 | `/services/{seasoned-collector, family-office, interior-designer, estate-trustee}` | `services/[slug]/page.tsx` + `content/services/*.mdx` |
| 9 | `/case-studies` | `case-studies/page.tsx` |
| 10–12 | `/case-studies/{hilliard-miniatures, thursby-pelham-collection, venetian-palazzo}` | `case-studies/[slug]/page.tsx` + `content/case-studies/*.mdx` |
| 13 | `/contact` | `contact/page.tsx` + `components/contact/ContactForm.tsx` |
| 14 | `/journal` (0 entries; `/journal/[slug]` currently returns 500) | `journal/page.tsx`, `journal/[slug]/page.tsx` |
| 15–17 | `/privacy`, `/terms-of-engagement`, `/anti-money-laundering-policy` | legal pages |

Each exists in en (no prefix), `/de/…` and `/fr/…`.

## 1. Route and component table

Archive means `git mv` into `_archive/` at the repo root, keeping the original relative path (e.g. `_archive/src/app/[locale]/approach/page.tsx`). Nothing is deleted. `_archive/` is excluded from the build (commit 1).

### Routes

| Item | Decision | Detail |
|---|---|---|
| `[locale]/page.tsx` Home | **Keep, rebuild** | Section order in §9 |
| `[locale]/about/page.tsx` | **Keep, rebuild** | §2 |
| `[locale]/recent-projects/page.tsx` | **New** | Merges all three case studies; anchors `#hilliard-miniatures`, `#thursby-pelham-collection`, `#venetian-palazzo` |
| `[locale]/approach/page.tsx` | **Merge into** Home (independence lines), then **archive** | Redirect to `/` |
| `[locale]/services/page.tsx` | **Merge into** Home services list, then **archive** | Redirect to `/` |
| `[locale]/services/[slug]/page.tsx` | **Archive** | Four slugs redirect to `/` |
| `[locale]/case-studies/page.tsx` | **Merge into** Recent projects, then **archive** | Redirect to `/recent-projects` |
| `[locale]/case-studies/[slug]/page.tsx` | **Merge into** Recent projects, then **archive** | Each slug redirects to its anchor |
| `[locale]/contact/page.tsx` | **Merge into** header + Home contact section, then **archive** | Redirect to `/#contact` |
| `[locale]/journal/page.tsx`, `journal/[slug]/page.tsx` | **Archive** | Redirect to `/` |
| `[locale]/privacy`, `terms-of-engagement`, `anti-money-laundering-policy` | **Keep** | Footer links only |
| `[locale]/layout.tsx`, `[locale]/not-found.tsx` | **Keep** | not-found: change `/contact` button to `/#contact` |
| `app/layout.tsx`, `app/page.tsx`, `opengraph-image.tsx`, `globals.css` | **Keep** | `layout.tsx`: JSON-LD telephone replaced (§9) |
| `app/robots.ts` | **Keep** | |
| `app/sitemap.ts` | **Keep, edit** | Fixed in the first redirect commit (§9) |
| `app/api/contact/route.ts` | **Archive** | No form; nothing posts to it |

### Components and lib

| Item | Decision | Detail |
|---|---|---|
| `layout/Masthead.tsx` | **Keep, rewrite** | Wordmark, visible contact line, visible language switcher, `NavMenu` with three links |
| `layout/NavMenu.tsx` (hamburger) | **Keep** | Not archived. Receives three links: Home, About, Recent projects. Aria labels to be translated (§9) |
| `layout/LanguageSwitcher.tsx`, `layout/SkipLink.tsx` | **Keep** | |
| `layout/Footer.tsx` | **Keep, edit** | "The Site" list to 3 links; PGP link from `/contact#pgp` to `/#pgp`. Legal block untouched |
| `home/QuotesCarousel.tsx` | **Keep** | Unchanged (report in §7) |
| `about/CareerTimeline.tsx`, `about/PortraitFrame.tsx` | **Keep** | Timeline facts need checking (open question 6) |
| `contact/ContactForm.tsx` | **Archive** | |
| `mdx/mdxComponents.tsx`, `ui/Pullquote.tsx` | **Archive** | Already unused today (nothing imports them) |
| `ui/Button`, `Eyebrow`, `SectionTitle`, `JsonLd`, `UntranslatedBanner` | **Keep** | |
| `actions/submitContactForm.ts` (empty placeholder) | **Archive** | |
| `lib/email.ts` | **Archive** | Already unused today |
| `lib/content.ts`, `lib/seo.ts`, `lib/i18n.ts` | **Keep** | Journal and service getters stay exported but unused; harmless |

### Content and images

| Item | Decision |
|---|---|
| `content/case-studies/*.mdx` (3) | **Keep**; rendered on Recent projects |
| `content/services/*.mdx` (4) | **Archive** to `_archive/content/services/`; `content/services/.gitkeep` keeps the folder |
| `content/journal/` (empty) | `content/journal/.gitkeep` keeps the folder in a clone |
| `public/images/journal/*` (11 files) | **Stay in `public/`** (§9) |
| `public/images/approach/*` (3), `public/images/services/rbaa-Isenbrandt-triptych.jpg`, `rbaa-riesener-bureau.jpg`, `rbaa-giltwood-console.jpg` | **Archive** to `_archive/public/images/…` by `git mv`, once nothing references them |
| All other images | **Untouched** |

## 2. Target structure

### Navigation and header (every page)
- **Hamburger stays.** `NavMenu` opens a panel with three items: **Home · About · Recent projects**.
- **Contact line stays visible** in the header, outside the menu: email (`mailto:rufus@rufusbirdartadvisory.com`), telephone (`tel:+447815588181`), WhatsApp (`https://wa.me/447815588181`). Plain text links.
- **Language switcher stays visible**, outside the menu.
- Layout: the wordmark on the left; the contact line, language switcher and menu button on the right. On narrow screens the contact line drops to its own row beneath the wordmark (see risk 9).

### Home
Order in §9: statement, carousel, independence, credentials, services, contact.
- **Statement**: the H1 and one statement, shown once. Today `home.definingStatement` renders twice; the second block goes. Wording: §9.
- **QuotesCarousel**: unchanged.
- **Independence, four lines**: acts as agent for the client · never takes title to works · accepts no commissions, rebates or introductory fees from dealers or auction houses · the fee is agreed in writing before work begins.
- **Credentials strip**: facts only, one line each, no adjectives.
- **Services list**: one list, wording in §9.
- **Contact** (`id="contact"`): email, telephone, WhatsApp, post address, hours, languages, PGP fingerprint (`id="pgp"`). Reuses the `contact.*` keys.

### About
Portrait (`PortraitFrame`) · short bio (fed by former `home.opening.p4`, §9) · career timeline (`CareerTimeline`) · affiliations · Substack link (`https://rufusbird.substack.com/`). Publications and lectures stay hidden until the lists exist (§9). The 'Begin a conversation' button to `/contact` goes.

### Recent projects
One page with three `<article id="{slug}">` blocks in date order. Each has one image, a title, a meta line (mandate · location · year) and the body. The body comes from the existing MDX through `getAllCaseStudies()`, `getCaseStudy()` and `compileMDX()` in `src/lib/content.ts`. The text is not shortened in this plan; at about 120 words each it becomes a single block. The image is the frontmatter `heroImage`, except Thursby-Pelham, which uses the Claeissens panel (§9). `UntranslatedBanner` shows on `/de` and `/fr`, because the MDX is English only. Metadata comes from `buildMetadata({ path: '/recent-projects' })`.

## 3. Redirect map (`next.config.mjs`)

Next's `permanent: true` sends **308**, not 301, so use `statusCode: 301`. Redirects in `next.config.mjs` run before the next-intl middleware, so each old path needs an unprefixed rule, an `/en/…` rule (one hop instead of two) and a `de|fr` rule. The specific case-study slugs must come before the generic `/case-studies/:slug`.

```js
// next.config.mjs (replaces the current redirects() body)
const MOVED = [
  // [old path, new path]
  ['/approach', '/'],
  ['/services', '/'],
  ['/services/:slug', '/'],
  ['/contact', '/#contact'],
  ['/journal', '/'],
  ['/journal/:slug', '/'],
  ['/case-studies', '/recent-projects'],
  ['/case-studies/hilliard-miniatures', '/recent-projects#hilliard-miniatures'],
  ['/case-studies/thursby-pelham-collection', '/recent-projects#thursby-pelham-collection'],
  ['/case-studies/venetian-palazzo', '/recent-projects#venetian-palazzo'],
  ['/case-studies/:slug', '/recent-projects'],
  ['/about/full-biography', '/about'],
  // Legacy patterns already in the file, re-pointed so none chains through a removed page
  ['/about-rufus', '/about'],
  ['/about-us', '/about'],
  ['/contact-us', '/#contact'],
  ['/our-services', '/'],
  ['/services.html', '/'],
  ['/blog', '/'],
  ['/blog/:slug', '/'],
  ['/news', '/'],
  ['/news/:slug', '/'],
];

// '/' -> '/:locale'; '/#contact' -> '/:locale#contact'; '/x' -> '/:locale/x'
const localised = (to) => (to.startsWith('/#') ? `/:locale${to.slice(1)}` : to === '/' ? '/:locale' : `/:locale${to}`);

async redirects() {
  return MOVED.flatMap(([from, to]) => [
    { source: from, destination: to, statusCode: 301 },
    { source: `/en${from}`, destination: to, statusCode: 301 },
    { source: `/:locale(de|fr)${from}`, destination: localised(to), statusCode: 301 },
  ]);
},
```

Examples: `/approach` → `/`; `/de/approach` → `/de`; `/contact` → `/#contact`; `/fr/contact` → `/fr#contact`; `/fr/case-studies/venetian-palazzo` → `/fr/recent-projects#venetian-palazzo`; `/en/journal` → `/`.

## 4. i18n keys

All changes apply to `en.json`, `de.json` and `fr.json`. German and French values are drafts for Rufus's review. Unused keys are removed only in the last commit, after no code reads them.

### Becoming unused
- `nav.approach`, `nav.services`, `nav.caseStudies`, `nav.journal`, `nav.contact`
- `home.opening.p1`, `p2`, `p3`, `p5` (retired); `home.opening.p4` moves to About (§9)
- `home.approachTeaser.*` (13 keys)
- `home.servicesSection`, `home.caseStudy.eyebrow`, `.headline`, `.pull`, `.cta`
- `home.journalSection`, `home.journalCta`, `home.contactCta.cta`
- `about.cta`
- `contact.formNote` (already unused)
- `common.beginConversation`, `common.allJournalEntries`, `common.readTheApproach`, `common.readFullStudy`, `common.readMore` (all already unused)
- `about.publicationsHeading`, `.publicationsNote`, `.lecturesNote`, `.publicationsLabel`, `.lecturesLabel`: stay in the files but unrendered until the lists exist
- `common.skipToMain` is unused today because `SkipLink` hard-codes English; recommend wiring it up rather than removing it

### Kept and reused
- `nav.about`
- `home.definingStatement` (once; wording per §9)
- `home.contactCta.heading` and `.body` (Home contact section)
- `contact.headline`, `.sub`, `.emailLabel`, `.phoneLabel`, `.postLabel`, `.hoursLabel`, `.languagesLabel`, `.pgpLabel`, `.pgpNote`, `.hours`, `.languages`
- `about.eyebrow`, `.headline`, `.bio.p1`–`p3`, `.careerHeading`, `.affiliationsLabel`
- `footer.*` all stay. `common.untranslated` stays.

### Written (commit 2)
- `nav.home`, `nav.recentProjects`
- `header.contactLabel`, `contact.whatsappLabel`
- `home.credentials.heading`, `home.credentials.c1`–`c5`
- `home.independence.heading`, `home.independence.l1`–`l4`
- `home.services.heading`, `home.services.s1`–`s5`
- `about.substack`
- `projects.eyebrow`, `.headline`, `.intro`, `.metaTitle`, `.metaDescription`, `projects.labels.mandate`, `.location`, `.year`

### Proposed, not yet written
- `nav.openMenu`, `nav.closeMenu`, `nav.menuLabel`, for the NavMenu aria labels (§9)

## 5. What stays untouched
- **Footer legal block**: the `footer.legal.*` keys and their paragraph in `Footer.tsx`. Only the site-link list and the PGP href change.
- **Legal pages**: privacy, terms and AML. The privacy wording is proposed in §9 but not applied.
- **hreflang**: `buildMetadata` in `src/lib/seo.ts` is unchanged; the new page uses it.
- **robots**: `src/app/robots.ts` unchanged.
- **sitemap**: changed once, in the first redirect commit (§9).
- **content:validate**: the existing checks are unchanged. It gains the Lorem ipsum and placeholder checks (§9). The `.gitkeep` files keep `content/journal` and `content/services` present, so the existing 'directory missing' ERROR cannot fire.
- **Unchanged as well**: middleware, routing, `LanguageSwitcher`, `UntranslatedBanner`, tokens, fonts, and the legal-identity changes on this branch.

## 6. Journal code, images and the Substack link
- **Code**: `journal/page.tsx` and `journal/[slug]/page.tsx` move to `_archive/src/app/[locale]/journal/`. `getAllJournalEntries`, `getJournalEntry` and `readingTime` stay in `content.ts`, unused, so the journal can return without rework. This also removes today's 500 on `/journal/<anything>`; those URLs now 301 to Home.
- **Images**: the 11 files in `public/images/journal/` stay in `public/` and are still served (§9).
- **Substack link**: on About (link text `about.substack`), and in the footer's social links.

## 7. Risks, and the commit sequence

### Risks
1. **Placeholder text.** `hilliard-miniatures.mdx` and `venetian-palazzo.mdx` are mostly Lorem ipsum, and they are already live. Merging them onto one page puts them on a top-level page. The new validator check (§9) makes this an ERROR, so real text is needed before launch.
2. **CLAUDE.md conflicts.** It says the client-not-dealer message must lead Home *and Approach*, describes a contact form, and names `99_Archive/` outside the repo, whereas this plan uses `_archive/` in the repo. CLAUDE.md, BUILD-BRIEF.md and COPY-EN.md need proposed updates; they are not edited here.
3. **Status codes.** `permanent: true` sends 308; the map uses `statusCode: 301`.
4. **Build scope.** `tsconfig.json` includes `**/*.ts(x)`, so archived files would be type-checked and fail on their imports. `"_archive"` is added to `exclude` (commit 1). Tailwind globs and `next lint` only cover `src/`, so they are unaffected.
5. **Removing the form.** `api/contact` and the `RESEND_*` env vars become unused. Leave the `resend` dependency installed: CLAUDE.md forbids changing dependencies without instruction. The privacy text needs the correction proposed in §9.
6. **SEO.** 14 indexed URLs per locale disappear. Mitigated by one-hop 301s and anchors. Watch Search Console for 404s for 48 hours after deploy (BUILD-BRIEF §10).
7. **Discretion.** The Thursby-Pelham study names the family and the sales. That is fine only if those are already published (CLAUDE.md case-study rule).
8. **Structured data.** `app/layout.tsx` gives `telephone: '+441747000000'`, a placeholder. Decision in §9.
9. **Header crowding at 360px and 768px.** The header holds the wordmark (about 220px at `text-xl`), the contact line (an email of about 30 characters plus two short links), the language switcher (about 80px) and the menu button (32px).
   - At **360px**, after the gutters there is roughly 320px for one row, which fits the wordmark and the menu button but not the full contact line. Planned layout:
     - row 1: wordmark and menu button
     - row 2: contact line and language switcher, wrapping
     - The email shows as the full address, not truncated. On very narrow screens the telephone and WhatsApp links may need short labels ('Tel', 'WhatsApp').
   - At **768px**, wordmark plus contact line plus switcher plus button is about 700px and fits only just. Planned layout:
     - row 1: wordmark, switcher and button
     - row 2: contact line
     - a single row only from about 1024px
   - Check at 360, 768 and 1024px, with 200% text zoom, in all three locales; the German labels are longer.
10. **Uncommitted work.** This branch carries unreviewed changes from the legal-identity work. Commit or park that before starting.
11. **NavMenu semantics.** The panel uses `role="menu"` and `role="menuitem"`. The ARIA menu pattern expects arrow-key handling, which the component doesn't have. For site navigation, a `<nav aria-label>` with plain links is the expected pattern. Not changed in this plan; worth a later fix.

### QuotesCarousel report (kept, not changed yet)
- **Content**: 12 quotes, all historical figures, none of them clients:
  1. Picasso
  2. Matisse
  3. Degas
  4. Louis I. Kahn
  5. Rumi
  6. Mark Rothko
  7. Marcel Proust
  8. Thomas Fuller
  9. John Keats
  10. John Ruskin
  11. Winston Churchill
  12. Leonardo da Vinci

  Each quote carries a 'We…' service line. The text is hard-coded English, so the 12 service lines also show in English on `/de` and `/fr`. House-rule breaches:
  - typographic double quotation marks
  - an em dash in the Rothko line
  - 'fulfillment' (US spelling) in the Kahn quote

  Several attributions are commonly repeated but doubtful or paraphrased: Picasso, Matisse, Leonardo, Rumi (a modern rendering), Proust (a paraphrase) and Ruskin.
- **Pauses?** Partly. It pauses on mouse hover and toggles with Space while focused. There is no visible pause control, so touch and screen-reader users cannot stop it. That falls short of WCAG 2.2.2, which requires a way to pause content that moves automatically for more than 5 seconds. It does not pause when keyboard focus moves onto the pager.
- **Respects prefers-reduced-motion?** Yes. Rotation stops and transitions are removed; the pager still works.
- **Keyboard accessible?** Mostly:
  - The region is focusable, the arrow keys move between slides, and the 12 pager buttons are focusable with a visible ring.
  - The region suppresses its own focus outline, against BUILD-BRIEF §9.
  - The Space handler on the region captures Space on the pager buttons, so those activate only with Enter.
- **Timing against the brief**: it waits 3 s per quote and fades over 500 ms; BUILD-BRIEF §7 specifies 9 s and 800 ms.

### Commits
Each commit is small and ends with `npx tsc --noEmit && npx pnpm build && npx pnpm content:validate`. After the redirect commits, also run `curl -sI` on each old URL in all three locales and expect `301` plus the correct `Location`.

0. *(Prerequisite, Rufus's call)* Commit or set aside the pending legal-identity changes.
1. **Archive scaffolding** *(applied, uncommitted)*: add `"_archive"` to `tsconfig.json` `exclude`; add `_archive/README.md`; add `content/journal/.gitkeep` and `content/services/.gitkeep`.
2. **New i18n keys** *(applied, uncommitted)*: the §4 'written' keys in en, with de and fr drafts. Nothing removed.
2a. **Validator checks**: ERROR on 'Lorem ipsum' in `content/` or `messages/`; WARN on 'to be supplied' and 'TBC' (§9).
3. **Recent projects page**: add `[locale]/recent-projects/page.tsx`. Old routes still work.
4. **Header and nav**: rewrite `Masthead` to pass three links (Home, About, Recent projects) to `NavMenu`, and add the visible contact line outside the menu. The language switcher stays visible. `NavMenu.tsx` is kept, not archived; translate its aria labels with the proposed `nav.openMenu`, `nav.closeMenu` and `nav.menuLabel` keys once approved. Point the footer site list at the three pages and the PGP link at `/#pgp`; point the not-found button at `/#contact`.
5. **Home**: rebuild in the §9 order with `id="contact"` and `id="pgp"`; remove all links to old routes.
6. **About**: portrait, short bio (from former `home.opening.p4`), timeline, affiliations, Substack link. Publications and lectures stay hidden. Remove the `/contact` button.
7. **Archive the journal, add its redirects and fix the sitemap**, together. The sitemap drops `/approach`, `/services`, `/case-studies` and `/contact`, and adds `/recent-projects`.
8. **Archive approach and add its redirect.**
9. **Archive services**: the two route files, the four MDX files and their redirects.
10. **Archive case studies**: both routes and their redirects, including the per-slug anchors.
11. **Archive contact**: the page, `ContactForm`, `api/contact`, `submitContactForm.ts` and `lib/email.ts`, plus the `/contact` → `/#contact` redirect and the re-pointed legacy redirects.
12. **Archive dead code**: `mdxComponents.tsx` and `Pullquote.tsx`.
13. **Archive orphaned images**: approach and services only (§1); the journal images stay.
14. **Remove unused i18n keys** (§4) from all three files.
15. **JSON-LD telephone**: replace the placeholder in `app/layout.tsx` with the number in §9.
16. *(Later, only if approved)* Carousel fixes; NavMenu semantics; proposed wording for CLAUDE.md, BUILD-BRIEF.md and COPY-EN.md.

## 8. Open questions
1. ~~Home statement~~ Decided in §9; wording to be pasted.
2. ~~Opening paragraphs~~ Decided in §9.
3. **Recent projects copy.** Real text is needed for Hilliard and Venetian palazzo (currently Lorem ipsum), and all three need cutting to about 120 words. Who writes them, and when?
4. ~~Thursby-Pelham image~~ Decided in §9.
5. **Discretion.** Are the Thursby-Pelham family name and the sale details already published, so they can stay?
6. **Credentials and timeline dates.**
   - Royal Household: the timeline says 'Surveyor' from 2010, but the bio says Deputy Surveyor in 2010 and Surveyor in 2018.
   - Duke's is listed as 2021–2022.
   - Gurr Johns: the timeline says 'Director of Decorative Arts' but `home.opening.p4` says he led 'European Furniture & Works of Art'.
   - COPY-EN §6.4 lists different affiliations from the code. Which set is correct?
7. ~~Privacy text~~ Wording proposed in §9; not applied.
8. ~~Sitemap~~ Decided in §9.
9. ~~Services wording~~ Decided in §9. New point: the list now has two valuation lines ('price advice and valuation' and 'valuation for probate, insurance and inheritance tax'). Keep both?
10. ~~Publications and lectures~~ Decided in §9.
11. ~~URL~~ Decided in §9.
12. ~~Journal images~~ Decided in §9.
13. **JSON-LD telephone.** The decision reads 'replace with [number]'. Is the number +44 7815 588181, the one shown on the site?

## 9. Decisions

Recorded 13 October 2026. These override sections 1–8 where they differ.

1. **Home statement**: option [A]. Wording from Rufus's notes; **not yet pasted**. Until it arrives, `home.definingStatement` is unchanged.
2. **Home order**: statement, carousel, independence, credentials, services, contact.
3. **Opening paragraphs**: retire `home.opening.p1`, `p2`, `p3` and `p5`. `p4` feeds the About short bio.
4. **Thursby-Pelham image**: the Claeissens panel (`/images/case-studies/Claeissens1.jpg`).
5. **Services wording**: the fifth item becomes 'Valuation for probate, insurance and inheritance tax' (replacing 'estate and IHT planning').
6. **Publications and lectures**: hidden until the lists exist.
7. **Contact redirect**: `/contact` → `/#contact`, `/de/contact` → `/de#contact`, `/fr/contact` → `/fr#contact` (§3 updated).
8. **Sitemap**: fixed in the first redirect commit (commit 7).
9. **Privacy text**: wording proposed below; **not applied**.
10. **URL**: `/recent-projects` in all locales.
11. **Journal images**: stay in `public/`.
12. **JSON-LD telephone**: replace `+441747000000` with [number] (commit 15; open question 13).
13. **Carousel**: keep; do not change it yet.
14. **content:validate**: ERROR on 'Lorem ipsum' in `content/` or `messages/`; WARN on 'to be supplied' and 'TBC' (commit 2a).
15. **Navigation**: keep the hamburger. `NavMenu.tsx` stays, with three items: Home, About, Recent projects. The contact line (email, telephone, WhatsApp) and the language switcher stay visible in the header outside the menu on every page (§1, §2, commit 4 and risk 9 updated).
16. **Discretion, Thursby-Pelham**: the collection was named in the auction catalogue, so the case study stays as is (resolves open question 5).
17. **Confirmed facts** (resolves part of open question 6):
    - Deputy Surveyor of the Queen's Works of Art, 2010 to 2017.
    - Surveyor of the Queen's Works of Art, 2018 to 2021.
    - Fellow of the Society of Antiquaries of London (FSA).
    - Lieutenant of the Royal Victorian Order (LVO), appointed 2021.
    - No connection with SOFAA, CINOA or the Burlington Magazine. None of these may appear anywhere.
    - Remaining dates to be confirmed by Rufus.
18. **Confirmed facts, complete set** (13 October; extends item 17 and resolves open question 6):
    - Christie's, 1997 to 2010.
    - The Royal Household: Deputy Surveyor of the Queen's Works of Art, 2010 to 2017; Surveyor of the Queen's Works of Art, 2018 to 2021.
    - Duke's, 2021 to 2022.
    - Gurr Johns, Director of Decorative Arts, 2022 to 2024.
    - Independent practice from 2024.
    - Fellow of the Society of Antiquaries of London (FSA).
    - Lieutenant of the Royal Victorian Order (LVO), 2021.
    - Trustee, Thirlestane Castle Trust, since 2014.
    - Committee member, The Beckford Society.
19. **Credentials strip**: seven lines, `home.credentials.c1` to `c7`, replacing the five written in commit 2. Display order:
    - Royal Household
    - LVO
    - FSA
    - Christie's
    - Gurr Johns
    - Thirlestane Castle Trust
    - Beckford Society
20. **Decisions of 14 October** (recorded in `COPY-EN.md` v2.0, the corrected copy source; v1.0 archived at `_archive/COPY-EN-v1.0.md`):
    - **Voice**: first person singular; CLAUDE.md's rules override COPY-EN's old tone rules.
    - **Confirmed facts**:
      - Cambridge, History of Art, 1996.
      - Member, Furniture History Society.
      - Member, Society for the History of Collecting.
      - 'In the art world since 1997' (no count of years).
      - Whilst at Gurr Johns, as Director of Decorative Arts, led the revival of Mallett, the famous antique dealers.
    - **About headline**: 'In the art world since 1997.' `about.bio.p1` is retired.
    - **Telephone**: +44 (0)7815 588181 is approved for public use (resolves open question 13).
    - **Valuation lines**: both stay in the services list.
    - **Oxford comma**: used.
    - **Hilliard and Venetian palazzo**: placeholder text until Rufus supplies it.
    - **German and French credentials c1**: now carry the end years 2017 and 2021, matching the English.
    - **Home statement** (option A): 'Rufus Bird is an art advisor, providing independent counsel for private and institutional clients.' Written to `home.definingStatement` in en, with de and fr drafts.

### NavMenu aria labels
They are hard-coded English: `aria-label={open ? 'Close menu' : 'Open menu'}` (`NavMenu.tsx:53`) and `aria-label="Primary"` (`NavMenu.tsx:78`). German and French screen-reader users hear English. Proposed keys, passed from `Masthead` as props in the way the link labels already are:

| Key | en | de (draft) | fr (draft) |
|---|---|---|---|
| `nav.openMenu` | Open menu | Menü öffnen | Ouvrir le menu |
| `nav.closeMenu` | Close menu | Menü schließen | Fermer le menu |
| `nav.menuLabel` | Main navigation | Hauptnavigation | Navigation principale |

The same problem affects `LanguageSwitcher` (`aria-label="Language"`) and `SkipLink` ('Skip to main content'; the key `common.skipToMain` already exists).

### Proposed privacy wording (not applied)
Replace the paragraph under 'This website':

> This site collects no advertising or personalisation cookies. Anonymised analytics are provided by Plausible, which sets no cookies and collects no personally identifiable information. There is no contact form on this site. If you contact us by email, telephone or WhatsApp, we use what you send only to respond to your enquiry. WhatsApp is operated by WhatsApp Ireland Limited, part of Meta Platforms, Inc.; messages sent through it are also subject to WhatsApp's own privacy policy.

Rufus to confirm the WhatsApp entity name against his account's terms before use.
