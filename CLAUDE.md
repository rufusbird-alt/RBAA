# RBAA website

Public site for Rufus Bird Art Advisory Ltd. Staging: rbaa.vercel.app. Production domain: rufusbirdartadvisory.com. Global rules in `~/Documents/Claude/Workspace/00_Context/CLAUDE.md` apply here; this file adds the site specifics.

## Stack
Next.js 14, App Router only (never Pages Router). TypeScript strict. Tailwind with CSS variables in `src/styles/tokens.css`. next-intl with locales en, de, fr (`localePrefix: as-needed`). Content is MDX in `content/` (journal, case-studies, services), read by `src/lib/content.ts`. Contact form: server action in `src/actions/submitContactForm.ts`, sent via Resend. Package manager pnpm, Node 20.

## Sources of truth
`BUILD-BRIEF.md` for architecture and design tokens. `COPY-EN.md` for canonical English copy. Where code and these disagree, ask before choosing.

## Commands
`pnpm dev`, `pnpm build`, `pnpm lint`, `npx tsc --noEmit`. Run build and tsc before saying any change is done.

## Legal identity (required on the site)
The registered name is Rufus Bird Art Advisory Ltd, registered in England and Wales, company number 17360856, registered office Buddens Farm, Twyford, Shaftesbury, SP7 0JE. The full block must appear in the footer and on the terms and privacy pages. The company is not VAT registered: never show a VAT line. Never describe the company as dealing in or holding title to works; it acts as agent only.

## Copy rules
The core message: Rufus works for the client only. It is central to the practice but does not lead the Home page; where it is used is to be decided. Wherever it appears, do not weaken it.
Never use: passionate, bespoke, curated, journey, luxury, world-class, unique, elevate. No superlatives, no vague credentials, no brochure language.
Register: scholarly, understated, personal; short precise sentences. British spelling. Single inverted commas for quotation. No em dashes. GBP by default; prices include buyer's premium. Attribution ladder exact: by, attributed to, studio of, workshop of, circle of, follower of, manner of, after, anonymous.
Do not rewrite existing copy unless asked. Propose wording; Rufus decides. German and French copy is translated from English and must be flagged for his review, not shipped silently.
Case studies are discreet: no client names or identifying detail unless already published.

## Images
Never compress, resample or overwrite originals. Naming: `maker-or-type_short-description_nn.ext`. Add alt text for every image. Check `public/images` for an existing file before adding one.

## Never, without explicit instruction
git push or commit. Edit `.env*` or touch secrets. Install or upgrade dependencies. Delete files (move to `~/Documents/Claude/Workspace/99_Archive/` instead). Change `CLAUDE.md`, `BUILD-BRIEF.md` or `COPY-EN.md`; propose the change first.
