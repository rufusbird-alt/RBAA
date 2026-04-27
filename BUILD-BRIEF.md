# Rufus Bird Art Advisory — Next.js Build Brief

**Version 1.0 · Hand-off document for local development in VS Code with Claude Code.**

This document is the complete specification for the build. Paired files in the same folder:
- `COPY-EN.md` — canonical English source copy, page by page.
- `rufusbirdartadvisory-prototype.html` — a single-file visual reference showing the look and feel (typography, palette, rhythm). Do not copy the HTML structure verbatim; the Next.js build supersedes it.

The target posture for this site is: *quiet, editorial, multilingual, fast, and visible in Google.* Everything below serves that.

---

## 1. Stack decisions

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | Stable, supported, best-in-class for content sites with good i18n and image stories. App Router is the go-forward path; use it. |
| Language | **TypeScript (strict)** | Strict mode catches real problems. Not optional. |
| Styling | **Tailwind CSS** + CSS variables for design tokens | Tailwind for productivity, CSS vars for palette + typography that is theme-switchable if ever needed. |
| Content | **MDX files in `/content`** via `@next/mdx` + `gray-matter` + `next-mdx-remote/rsc` | Git-versioned, edit in VS Code or Obsidian, no CMS. |
| Internationalisation | **`next-intl`** (App Router support) | Actively maintained, App Router native, supports locale-prefixed routing (`/de/...`, `/fr/...`), pluralisation, dates, and numbers. |
| Images | **`next/image`** with local assets in `/public` + AVIF/WebP generation | Built-in, handles srcset + lazy-load + placeholder. Reach for Cloudinary later only if the image archive grows beyond practical local sizes. |
| Fonts | **`next/font/google`** — Cormorant Garamond + EB Garamond | Self-hosted from Google via the Next mechanism. Zero layout shift. No third-party font request at runtime. |
| Forms | **Next.js server action** + **Resend** transactional email | One dependency, one API key, no form SaaS. |
| Analytics | **Plausible** (self-hosted or plausible.io) | Cookie-less, GDPR-compliant, single script tag. No cookie banner needed. |
| Sitemap / robots | **`next-sitemap`** | Generates at build. Handles i18n alternates automatically. |
| Deployment | **Vercel** (free tier is fine for this volume) | First-party hosting for Next.js, edge-cached, automatic preview deploys on every PR, zero DevOps. |
| Version control | GitHub repo, `main` is production | Every push to `main` deploys; every PR gets a preview URL. |
| Node version | **20 LTS** | Pin via `.nvmrc` and `engines` in `package.json`. |
| Package manager | **pnpm** | Fast, deterministic, disk-efficient. |

---

## 2. Folder structure

```
rufusbird/
├─ .env.local                          # RESEND_API_KEY, CONTACT_TO_EMAIL, NEXT_PUBLIC_SITE_URL
├─ .env.example                        # Committed; blank values
├─ .nvmrc                              # "20"
├─ .gitignore
├─ README.md                           # Deployment + local dev notes
├─ next.config.mjs
├─ next-sitemap.config.js
├─ tailwind.config.ts
├─ tsconfig.json
├─ package.json
├─ postcss.config.js
│
├─ content/                            # MDX source (Obsidian-compatible)
│  ├─ journal/
│  │  ├─ 2026-04-14-cremonese-panel-campi.mdx
│  │  ├─ 2026-04-02-relining-when-to-refuse.mdx
│  │  └─ ...
│  ├─ case-studies/
│  │  └─ venetian-palazzo.mdx
│  ├─ services/
│  │  ├─ seasoned-collector.mdx
│  │  ├─ family-office.mdx
│  │  ├─ interior-designer.mdx
│  │  └─ estate-trustee.mdx
│  └─ pages/                           # For static pages whose copy is edited often
│     ├─ approach.mdx
│     └─ about.mdx
│
├─ messages/                           # next-intl translation files
│  ├─ en.json
│  ├─ de.json
│  └─ fr.json
│
├─ public/
│  ├─ images/
│  │  ├─ case-studies/
│  │  ├─ journal/
│  │  └─ portrait.jpg
│  ├─ og/                              # OpenGraph cards
│  ├─ favicon.ico
│  ├─ apple-touch-icon.png
│  ├─ robots.txt                       # Generated
│  └─ sitemap.xml                      # Generated
│
├─ src/
│  ├─ app/
│  │  ├─ [locale]/                     # i18n root
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx                   # Home
│  │  │  ├─ approach/page.tsx
│  │  │  ├─ services/
│  │  │  │  ├─ page.tsx                # Index
│  │  │  │  └─ [slug]/page.tsx         # Dynamic from content/services
│  │  │  ├─ case-studies/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [slug]/page.tsx
│  │  │  ├─ journal/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [slug]/page.tsx
│  │  │  ├─ about/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ full-biography/page.tsx
│  │  │  ├─ contact/page.tsx
│  │  │  ├─ privacy/page.tsx
│  │  │  ├─ terms-of-engagement/page.tsx
│  │  │  └─ not-found.tsx
│  │  ├─ api/
│  │  │  └─ contact/route.ts           # Form backup endpoint (server action primary)
│  │  ├─ opengraph-image.tsx           # Dynamic OG card generator
│  │  ├─ favicon.ico
│  │  ├─ globals.css                   # Tailwind + CSS variables
│  │  ├─ sitemap.ts                    # Dynamic sitemap generation
│  │  └─ robots.ts                     # Dynamic robots.txt
│  │
│  ├─ components/
│  │  ├─ layout/
│  │  │  ├─ Masthead.tsx
│  │  │  ├─ Footer.tsx
│  │  │  ├─ LanguageSwitcher.tsx
│  │  │  └─ SkipLink.tsx
│  │  ├─ home/
│  │  │  ├─ QuotesCarousel.tsx         # The rotating literary-quote hero
│  │  │  ├─ DefiningStatement.tsx
│  │  │  ├─ OpeningParagraphs.tsx
│  │  │  ├─ ApproachTeaser.tsx
│  │  │  ├─ ServicesGrid.tsx
│  │  │  └─ FeaturedCaseStudy.tsx
│  │  ├─ journal/
│  │  │  ├─ JournalIndex.tsx
│  │  │  ├─ JournalEntry.tsx
│  │  │  └─ ThemeFilter.tsx
│  │  ├─ case-studies/
│  │  │  ├─ CaseStudyIndex.tsx
│  │  │  └─ CaseStudyEntry.tsx
│  │  ├─ about/
│  │  │  ├─ CareerTimeline.tsx
│  │  │  └─ PortraitFrame.tsx
│  │  ├─ contact/
│  │  │  └─ ContactForm.tsx             # Client component; submits to server action
│  │  ├─ mdx/
│  │  │  └─ mdxComponents.tsx           # Shared MDX renderer (h1/h2/p/blockquote)
│  │  └─ ui/
│  │     ├─ SectionTitle.tsx
│  │     ├─ Eyebrow.tsx
│  │     ├─ Pullquote.tsx
│  │     └─ Button.tsx
│  │
│  ├─ lib/
│  │  ├─ content.ts                    # MDX discovery + parsing helpers
│  │  ├─ seo.ts                        # Metadata builders
│  │  ├─ i18n.ts                       # next-intl config
│  │  └─ email.ts                      # Resend wrapper
│  │
│  ├─ actions/
│  │  └─ submitContactForm.ts           # Server action for contact form
│  │
│  └─ styles/
│     └─ tokens.css                    # Design tokens (CSS variables)
│
└─ scripts/
   ├─ validate-content.ts               # Pre-build check: frontmatter complete, images exist
   └─ build-sitemap.ts
```

---

## 3. Design tokens

Lift these into `src/styles/tokens.css` and reference from Tailwind config. The HTML prototype already uses them.

```css
:root {
  /* Palette */
  --ground:       #F4EFE4;
  --ground-soft:  #EFE8D6;
  --ink:          #1C1A17;
  --ink-soft:     #3E382D;
  --ink-muted:    #5A5140;
  --muted:        #7A6E55;
  --rule:         #C9BFA8;
  --rule-soft:    #DDD3BC;
  --accent:       #6B1F2A;  /* muted oxblood */
  --accent-soft:  #8F3842;

  /* Typography */
  --display:  'Cormorant Garamond', 'Garamond', serif;
  --body:     'EB Garamond', 'Garamond', Georgia, serif;

  /* Measure + spacing */
  --max:     1340px;
  --measure: 36rem;
  --gutter:  2rem;
}
```

**Typography rules (enforced via Tailwind utilities or custom classes):**
- Body size: 19px / 1.65 line-height.
- Display: `var(--display)`, regular weight, `letter-spacing: 0.005em`.
- Small caps: `font-variant-caps: all-small-caps; letter-spacing: 0.08em`. Used for artist names, place names, metadata labels.
- Italics for emphasis, not bold.

**Motion rules:**
- Default: no motion. Elements appear; they do not fade or slide in.
- Quotes carousel: 800ms crossfade; respects `prefers-reduced-motion` (shows static first frame with a pager).
- No scroll-triggered animation.

---

## 4. Internationalisation (`next-intl`)

Routing strategy: **locale as first URL segment**, defaulting to English without prefix for SEO cleanliness — i.e. `rufusbirdartadvisory.com/` is English, `rufusbirdartadvisory.com/de/` is German, `rufusbirdartadvisory.com/fr/` is French.

```ts
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'de', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',   // en has no prefix; de/fr do
  localeDetection: true,       // respect Accept-Language on first visit
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
```

**Translation workflow:**
1. All copy originates in English in `COPY-EN.md` and in `messages/en.json` (for UI strings) or in English MDX files (for long-form).
2. Claude drafts DE and FR versions — the user reviews and edits. **Literary quotes are not translated**; they appear in the original French, German, Italian etc. where applicable, with an English translation beneath as a footnote. The Douglas Cooper quote stays in English in all locales; Rumi appears in English in all locales.
3. Translated MDX files live alongside English with locale suffixes: `venetian-palazzo.en.mdx`, `venetian-palazzo.de.mdx`, `venetian-palazzo.fr.mdx`. The content loader picks the right one for the active locale.
4. Untranslated fallback: if a DE or FR version is missing, the English content is served with a banner at the top of that entry: *"This entry is not yet available in German. Showing English version."* The banner copy lives in `messages/de.json` and `messages/fr.json`.

**SEO for i18n:**
- Every page emits `<link rel="alternate" hreflang="en" href="..." />`, `hreflang="de"`, `hreflang="fr"`, plus `hreflang="x-default"` pointing to English.
- The sitemap includes all three locales for every page, with `alternate` entries.
- OpenGraph `og:locale` and `og:locale:alternate` set per page.

---

## 5. Content model

### 5.1 — Journal entry frontmatter (`content/journal/<slug>.<locale>.mdx`)

```yaml
---
title: "A Cremonese panel, rediscovered: notes on the workshop of Giulio Campi"
slug: "cremonese-panel-campi"
date: 2026-04-14
theme: "Attribution"
excerpt: "A small devotional panel surfaced at a provincial French sale in February, catalogued as circle of Parmigianino. The drapery said otherwise."
wordCount: 2400
footnoteCount: 12
author: "Rufus Bird"
coverImage: "/images/journal/cremonese-panel-cover.jpg"
coverAlt: "Detail of a small sixteenth-century panel in raking light"
published: true
---
```

Valid themes (for filter UI and structured data keywords):
`Attribution · Condition · Provenance · Rediscoveries · On the Market · On Collecting · On Valuation · Practice`

### 5.2 — Case study frontmatter

```yaml
---
title: "A Venetian Palazzo, Inherited in Full"
slug: "venetian-palazzo"
date: 2024-03-01                     # Start of mandate
status: "Ongoing"                    # or "Completed"
mandate: "Full-collection advisory and dispersal"
objectTypes: ["Paintings", "Furniture", "Objets", "Archives"]
location: "Venice"
client: "Trustees of a historic estate (confidential)"
duration: "2024 – ongoing"
scope: "Catalogue · valuation · storage · sale strategy · real-estate liaison"
heroImage: "/images/case-studies/venetian-palazzo-hero.jpg"
heroAlt: "Interior of a Venetian palazzo overlooking the Grand Canal"
published: true
---
```

### 5.3 — Service page frontmatter

```yaml
---
archetype: "The Seasoned Collector"
tagline: "Hunting the Elusive"
slug: "seasoned-collector"
order: 1
heroImage: "/images/services/seasoned-collector.jpg"
heroAlt: "Close examination of an Old Master drawing"
metaDescription: "For the experienced collector pursuing the elusive piece: discreet tracing, careful due diligence, and clarity about what your collection is really for."
published: true
---
```

### 5.4 — MDX components

Register these in `src/components/mdx/mdxComponents.tsx` so that prose content can include pull quotes, image figures, and small-caps:

```tsx
const components = {
  h2: SectionHeading,
  h3: Subhead,
  blockquote: Pullquote,
  img: Figure,
  SmallCaps,     // <SmallCaps>Pieter Claesz</SmallCaps>
  Footnote,      // Numbered footnote with backlink
  Plate,         // Image with plate number + caption
};
```

---

## 6. SEO (the part that matters for Google)

The site must be findable by collectors searching for terms like *"independent art advisor UK"*, *"art valuation advisor"*, *"Old Master advisor private collector"*, *"art advisor for family office"*. Competitors named in the brief (Beaumont Nathan, Omnia Art Agents, Fine Art Group) all rank for these terms.

### 6.1 — Metadata

Every page exports a `generateMetadata` function. Use the helper in `src/lib/seo.ts`:

```ts
// src/lib/seo.ts
export function buildMetadata({
  title,
  description,
  path,
  locale,
  ogImage,
  type = 'website',
}: BuildMetadataArgs): Metadata {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}${localePath(locale, path)}`;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type,
      locale,
      alternateLocale: (['en','de','fr'] as const).filter(l => l !== locale),
      images: [{ url: ogImage ?? '/og/default.png', width: 1200, height: 630 }],
      siteName: 'Rufus Bird Art Advisory',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: url,
      languages: {
        en: `${process.env.NEXT_PUBLIC_SITE_URL}${path}`,
        de: `${process.env.NEXT_PUBLIC_SITE_URL}/de${path}`,
        fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr${path}`,
        'x-default': `${process.env.NEXT_PUBLIC_SITE_URL}${path}`,
      },
    },
    robots: { index: true, follow: true },
  };
}
```

### 6.2 — Structured data (JSON-LD)

Emit per page, in the head, via a `<Script type="application/ld+json">` tag.

**Site-wide (in root layout):**
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://rufusbirdartadvisory.com/#organization",
  "name": "Rufus Bird Art Advisory",
  "url": "https://rufusbirdartadvisory.com",
  "logo": "https://rufusbirdartadvisory.com/og/logo.png",
  "founder": { "@type": "Person", "@id": "#rufus-bird" },
  "areaServed": ["United Kingdom", "Europe", "Middle East", "United States", "Asia"],
  "serviceType": ["Art advisory", "Art valuation", "Art acquisition", "Collection management"],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Shaftesbury",
    "addressRegion": "Dorset",
    "postalCode": "SP7",
    "addressCountry": "GB"
  },
  "email": "rufus@rufusbirdartadvisory.com",
  "telephone": "+441747000000",
  "knowsLanguage": ["en","de","fr","es","it"]
}
```

**Person (in About page):**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://rufusbirdartadvisory.com/#rufus-bird",
  "name": "Rufus Bird",
  "jobTitle": "Independent Art Advisor",
  "alumniOf": "University of Cambridge",
  "worksFor": { "@id": "#organization" },
  "knowsAbout": ["European paintings 1500-1950", "European furniture", "Silver", "Books", "Old Masters", "Art valuation", "Attribution"],
  "knowsLanguage": ["en","de","fr","es","it"]
}
```

**Article (each journal entry):** `@type: "Article"`, with `headline`, `datePublished`, `dateModified`, `author`, `image`, `wordCount`, `keywords`.

**CaseStudy (each case study):** use `@type: "Article"` with `articleSection: "Case Study"` — Schema.org has no formal CaseStudy type; Article with sectioning is correct.

### 6.3 — Sitemap

Generate at build via `next-sitemap.config.js`:

```js
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
  alternateRefs: [
    { href: 'https://rufusbirdartadvisory.com', hreflang: 'en' },
    { href: 'https://rufusbirdartadvisory.com/de', hreflang: 'de' },
    { href: 'https://rufusbirdartadvisory.com/fr', hreflang: 'fr' },
  ],
  exclude: ['/404', '/500'],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
    additionalSitemaps: [],
  },
};
```

### 6.4 — Performance (Core Web Vitals = SEO)

Target: LCP < 2.5s, CLS < 0.1, INP < 200ms, on mid-range mobile.

- Use `next/image` for every photograph; specify `sizes` prop correctly.
- Preload the hero font via `next/font`.
- No layout-shifting elements (no late-loading carousels without fixed height; the quotes carousel has a fixed aspect container).
- Ship no client JavaScript for pages that do not need it. The hero quotes carousel is the only interactive element on the home page — it is a small client component; the rest of the home page is server-rendered.
- Lighthouse target: 95+ on all four axes for the home page, 90+ on journal entries.

### 6.5 — Indexing checklist (post-launch)

1. Verify the domain in **Google Search Console**.
2. Submit `sitemap.xml` to Search Console (and to **Bing Webmaster Tools**).
3. Request indexing on the home page, `/approach`, `/services`, `/case-studies/venetian-palazzo`, `/about`, `/contact`.
4. Verify the three locale trees are crawled within two weeks.
5. Monitor CWV via Search Console for two months after launch; fix any "poor" URLs immediately.

### 6.6 — Target keyword set (initial)

Primary (page ownership):
- *"Rufus Bird"* — brand term, own the SERP.
- *"independent art advisor"* — home + about.
- *"art advisor UK"* — home.
- *"European art advisor"* — home.
- *"art valuation UK"* — services.
- *"art advisor family office"* — services/family-office.
- *"art advisor private collector"* — services/seasoned-collector.

Secondary (journal entries earn these over time):
- *"what is a valuation [insurance vs probate]"*
- *"how to start collecting Old Masters"*
- *"middle market Old Masters"*
- *"attribution vs copy vs workshop"*

The journal is the long-tail SEO engine. Twelve well-researched posts in year one will build organic traffic more reliably than any paid campaign.

---

## 7. The quotes carousel (design brief for the component)

This is the single interactive element on the home page and the most visible brand moment. It must not feel like a marketing carousel. Guidelines:

- Fixed container aspect (desktop ~480px tall, mobile ~560px). No layout shift when it loads.
- Text-only. No stock imagery behind.
- Quote is set in display serif at 3rem+ on desktop, 2rem on mobile, italic, justified centre. Attribution small-caps below. Service descriptor below that, in body face, ~1.1rem, non-italic, in the ink-soft colour.
- Crossfade 800ms. Dwell 9 seconds.
- Pagination: a row of twelve small vertical rules below; active is ink, inactive is rule colour. Clickable.
- Keyboard: left/right arrows when focused. Space to pause.
- `prefers-reduced-motion`: static first quote on load, no rotation, pager still works as manual navigation.
- Pause on hover. Resume on mouseleave.
- No swipe gesture required; site is content-first, not touch-first.

**Accessibility:**
- Carousel container has `role="region" aria-roledescription="carousel" aria-label="Collected reflections on art"`.
- Each slide has `role="group" aria-roledescription="slide" aria-label="1 of 12: Picasso on the soul"`.
- Live region: off (changing content is not urgent). Screen readers navigate via pager.

---

## 8. Forms (contact)

Use a Next.js **server action**. No third-party form SaaS.

```tsx
// src/actions/submitContactForm.ts
'use server';

import { z } from 'zod';
import { Resend } from 'resend';
import { headers } from 'next/headers';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  enquiryType: z.enum(['acquisition','sale','valuation','estate','general']),
  message: z.string().min(20).max(3000),
  // Honeypot
  website: z.string().max(0),
});

export async function submitContactForm(prevState: unknown, formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: 'validation' };
  if (parsed.data.website) return { ok: true };   // silently accept spam

  const resend = new Resend(process.env.RESEND_API_KEY!);
  await resend.emails.send({
    from: 'Enquiry <forms@rufusbirdartadvisory.com>',
    to: process.env.CONTACT_TO_EMAIL!,
    replyTo: parsed.data.email,
    subject: `New enquiry: ${parsed.data.enquiryType} — ${parsed.data.name}`,
    text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
  });

  return { ok: true };
}
```

**Resend setup:**
1. Register the domain in Resend. Set up SPF, DKIM, and DMARC DNS records.
2. `forms@rufusbirdartadvisory.com` is the sender; `rufus@rufusbirdartadvisory.com` is the recipient.
3. Rate-limit: Resend's free tier is ample for this site's traffic.

---

## 9. Accessibility

Target: **WCAG 2.2 AA** on every page.

- Colour contrast: ink on ground = 13:1 (passes). Accent on ground = 5.2:1 (passes AA for normal text). Muted on ground = 4.4:1 (marginal — use only for metadata, never body text).
- Every interactive element has a visible focus ring (2px accent outline, 2px offset).
- Skip link in the masthead.
- All images have descriptive alt text. Decorative images use `alt=""`.
- Form fields have associated labels. Errors announced via `aria-live="polite"`.
- Language attribute set on `<html>` per locale.
- No content communicated by colour alone.

Run `@axe-core/react` in dev. Run Lighthouse on every page before any launch.

---

## 10. Existing site migration

The current `rufusbirdartadvisory.com` has existing content and some Google rankings. I was unable to fetch it in this environment. **Action required from you:**

Either:
- Paste the list of existing URLs (just the paths — e.g. `/about`, `/services`, `/contact`), or
- Share a screenshot of the current site, or
- Run `curl -sL https://rufusbirdartadvisory.com | grep -oE 'href="[^"]*"'` and paste the output.

Once you provide that, I'll produce a full **301 redirect table** mapping old URLs to new URLs. For now, here is the template:

```ts
// next.config.mjs
export default {
  async redirects() {
    return [
      // { source: '/old-path', destination: '/new-path', permanent: true },
      // Examples we'll likely need:
      // { source: '/services.html', destination: '/services', permanent: true },
      // { source: '/about-rufus', destination: '/about', permanent: true },
      // { source: '/blog', destination: '/journal', permanent: true },
      // { source: '/blog/:slug', destination: '/journal/:slug', permanent: true },
    ];
  },
};
```

**SEO continuity rules for the migration:**
1. Every existing URL that ranks in Google must 301-redirect to the closest new equivalent.
2. If the new page does not exist, redirect to the nearest parent (e.g. old `/services/art-valuation.html` → new `/services` until a dedicated valuation page is built).
3. Do not use 302 redirects; they do not pass link equity.
4. Preserve H1 text on the most-linked pages where possible; this preserves relevance signals.
5. Keep the existing `robots.txt` rules for any archive or PDF that is indexed.
6. After launch, watch Search Console for 404 errors and crawl errors; fix any within 48 hours.

---

## 11. Environment variables

```bash
# .env.local (not committed)
NEXT_PUBLIC_SITE_URL=https://rufusbirdartadvisory.com
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=rufus@rufusbirdartadvisory.com
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=rufusbirdartadvisory.com
```

Commit `.env.example` with empty values. Set real values in Vercel's environment-variables panel, separately for Preview and Production environments.

---

## 12. Deployment checklist

**Before first production deploy:**

- [ ] Domain DNS: A/CNAME records pointing to Vercel. SSL certificate issued automatically.
- [ ] Custom `www` redirect set (either `www → apex` or `apex → www`; pick one and stick with it. Recommend apex: `rufusbirdartadvisory.com`).
- [ ] Email DNS: SPF, DKIM, DMARC records for Resend.
- [ ] Google Search Console verified via DNS TXT record.
- [ ] Bing Webmaster Tools verified.
- [ ] Plausible tracking snippet added (or site created on plausible.io).
- [ ] `sitemap.xml` and `robots.txt` accessible at root.
- [ ] OG cards test at [metatags.io](https://metatags.io) and [opengraph.xyz](https://opengraph.xyz).
- [ ] Favicons tested on iOS, Android, Safari, Chrome.
- [ ] Lighthouse: home page 95+, journal entry 90+.
- [ ] All three locales render at least the home, about, contact, and one case study.
- [ ] Contact form delivers a real email end-to-end.
- [ ] 301 redirect table for old URLs in place.

**Post-launch (week one):**

- [ ] Submit `sitemap.xml` to Google Search Console and Bing Webmaster.
- [ ] Request indexing on the six key pages (home, approach, services, one case study, about, contact — times three locales where available).
- [ ] Monitor CWV daily for a week; alert if any page drops to "poor."
- [ ] Write a launch journal entry. Tweet it if you feel like it, or don't.

---

## 13. Local dev — getting started

```bash
# Prereq: Node 20, pnpm 9
nvm use
pnpm install
cp .env.example .env.local   # fill in values

pnpm dev                       # http://localhost:3000
pnpm build                     # production build + sitemap
pnpm lint                      # eslint + typescript
pnpm content:validate          # validates frontmatter + image refs
```

**VS Code recommended extensions** (`.vscode/extensions.json`):
- `bradlc.vscode-tailwindcss`
- `esbenp.prettier-vscode`
- `dbaeumer.vscode-eslint`
- `unifiedjs.vscode-mdx`
- `yzhang.markdown-all-in-one`

**For Claude Code inside VS Code:**

When you start Claude Code in this repo, its first task should be: read `BUILD-BRIEF.md` and `COPY-EN.md` in full, then produce a scaffolding plan. I recommend giving it this opening prompt:

> *Read BUILD-BRIEF.md and COPY-EN.md in this folder. They are the specification for a Next.js 14 multilingual art advisory website. Produce a scaffolding plan as a numbered list of build phases, showing which files you will create in each phase. Do not start coding until I approve the plan.*

---

## 14. Build phases (suggested)

Six discrete phases, each a reviewable pull request.

1. **Foundation** — Next.js + TS + Tailwind + fonts + design tokens + masthead + footer + home page skeleton (without content). Live at a preview URL.
2. **Content layer** — MDX loading, frontmatter parsing, journal index + one entry, case study index + Venetian Palazzo. Site still English-only.
3. **i18n** — next-intl, locale routing, translated masthead/footer, translated meta. DE and FR versions of home, about, contact. Claude drafts translations; user edits.
4. **Interactive + forms** — Quotes carousel, contact form with Resend, language switcher.
5. **SEO + polish** — Sitemap, structured data, OG cards, redirects from old URLs, accessibility audit, performance pass. Lighthouse ≥ 95.
6. **Launch** — DNS cutover, Search Console submission, 48-hour monitoring.

Each phase is a merge to `main` and a production deploy. Phases 1–3 are roughly equal effort; phase 4 is smaller; phase 5 is where care pays off; phase 6 is ops.

**Estimated elapsed time** with a disciplined single developer + Claude Code pair: three to four weeks to phase 5. Phase 6 is a day.

---

## 15. Open decisions

Items I need from you before or during the build:

1. **Old URL list** — to populate the 301 redirect table (see §10).
2. **Images** — portrait of Rufus, any real photography for case studies (even phone photos, high resolution).
3. **PGP key** — generate a key pair for `rufus@rufusbirdartadvisory.com` and share the public key; I'll publish it.
4. **Telephone number** — the real number to replace the placeholder.
5. **Full biography copy** — from Zing Content (£120 quote) or drafted separately.
6. **Publications list** — for the About page and structured data.
7. **Second case study** — if possible, so that Venetian Palazzo does not stand alone at launch.

---

## 16. What this brief deliberately does not do

- **No A/B testing, no experimentation framework.** Wrong register for this audience.
- **No chat widget, no pop-ups, no exit-intent modals.** Ever.
- **No social sharing buttons on journal entries.** Copy-link is present; the rest is noise.
- **No marketing automation, no CRM integration.** Enquiries come to email; enquiries are replied to from email. The client list is in your head and on paper.
- **No cookie banner.** Plausible is cookie-less; the site stores no other cookies. Legally clean, aesthetically clean.
- **No AI chatbot pretending to be Rufus.** The proposition is that you get the person.

---

*End of build brief, v1.0. All decisions are reversible. Open questions are flagged in §15.*
