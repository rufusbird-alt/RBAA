# _archive

Code, content and images retired from the site during the simplification described in `SIMPLIFY-PLAN.md`. Nothing here is deleted; files are moved with `git mv` and keep their original relative path (for example `_archive/src/app/[locale]/approach/page.tsx`).

This folder is not part of the build:

- `tsconfig.json` excludes `_archive`, so `tsc` does not type-check it.
- Next.js only compiles `src/`, Tailwind only scans `src/`, and `next lint` only lints `src/`.
- `scripts/validate-content.ts` only reads `content/`, `messages/`, `src/` and `public/`.
- Images under `_archive/public/` are not served.

To restore something, `git mv` it back to its original path.
