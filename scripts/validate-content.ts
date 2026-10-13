/**
 * Pre-launch content check. Run: pnpm content:validate
 * Exits 1 if any ERROR is found. WARNINGs are advisory.
 * Read-only: this script never writes to the repo.
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'content');
const PUBLIC = path.join(ROOT, 'public');
const MESSAGES = path.join(ROOT, 'messages');
const LOCALES = ['en', 'de', 'fr'] as const;

const BANNED = [
  'bespoke', 'journey', 'luxury',
  'world-class', 'world class', 'unique', 'elevate',
];
// Matched as word prefixes: 'passion' covers passionate, 'curat' covers curated, curatorial, curator.
const BANNED_PREFIXES = ['passion', 'curat'];
const COMPANY_NUMBER = '17360856';

type Level = 'ERROR' | 'WARN';
const findings: { level: Level; where: string; msg: string }[] = [];
const report = (level: Level, where: string, msg: string) =>
  findings.push({ level, where, msg });

// ---------- schemas (mirror src/lib/content.ts) ----------
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be YYYY-MM-DD');
const nonEmpty = z.string().min(1, 'must not be empty');

const journalSchema = z.object({
  title: nonEmpty,
  slug: z.string().optional(),
  date: isoDate,
  theme: nonEmpty,
  excerpt: nonEmpty,
  wordCount: z.number().int().nonnegative(),
  footnoteCount: z.number().int().nonnegative(),
  author: nonEmpty,
  coverImage: z.string().optional(),
  coverAlt: z.string().optional(),
  published: z.boolean(),
});

const caseStudySchema = z.object({
  title: nonEmpty,
  slug: nonEmpty,
  date: isoDate,
  status: z.enum(['Ongoing', 'Completed']),
  mandate: nonEmpty,
  objectTypes: z.array(nonEmpty).min(1),
  location: nonEmpty,
  client: nonEmpty,
  duration: nonEmpty,
  year: nonEmpty,
  scope: nonEmpty,
  heroImage: z.string().optional(),
  heroAlt: z.string().optional(),
  published: z.boolean(),
});

const serviceSchema = z.object({
  archetype: nonEmpty,
  tagline: nonEmpty,
  slug: nonEmpty,
  order: z.number().int(),
  heroImage: z.string().optional(),
  heroAlt: z.string().optional(),
  metaDescription: nonEmpty,
  published: z.boolean(),
});

const TYPES = [
  { dir: 'journal', schema: journalSchema },
  { dir: 'case-studies', schema: caseStudySchema },
  { dir: 'services', schema: serviceSchema },
] as const;

// ---------- helpers ----------
const rel = (p: string) => path.relative(ROOT, p);

function normalise(data: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [
      k,
      v instanceof Date ? v.toISOString().slice(0, 10) : v,
    ]),
  );
}

function checkImage(where: string, src: string) {
  if (/^https?:\/\//.test(src)) return;
  if (!src.startsWith('/')) {
    report('ERROR', where, `image path should start with '/': ${src}`);
    return;
  }
  const file = path.join(PUBLIC, decodeURI(src));
  if (!fs.existsSync(file)) report('ERROR', where, `image not found in public/: ${src}`);
}

function checkVoice(where: string, text: string) {
  const lower = text.toLowerCase();
  for (const w of BANNED) {
    const re = new RegExp(`\\b${w.replace(/[-]/g, '[- ]')}\\b`, 'i');
    if (re.test(lower)) report('WARN', where, `banned word: '${w}'`);
  }
  for (const p of BANNED_PREFIXES) {
    const hits = new Set(lower.match(new RegExp(`\\b${p}\\w*`, 'g')) ?? []);
    for (const h of hits) report('WARN', where, `banned word: '${h}' (prefix '${p}')`);
  }
  if (text.includes('—')) report('WARN', where, 'contains an em dash');
}

// ---------- content files ----------
const slugsSeen: Record<string, Set<string>> = {};
const referencedImages = new Set<string>();

for (const { dir, schema } of TYPES) {
  const full = path.join(CONTENT, dir);
  slugsSeen[dir] = new Set();
  if (!fs.existsSync(full)) {
    report('ERROR', `content/${dir}`, 'directory missing');
    continue;
  }
  const files = fs.readdirSync(full).filter((f) => f.endsWith('.mdx'));
  if (files.length === 0) report('WARN', `content/${dir}`, 'no .mdx files');

  for (const file of files) {
    const fp = path.join(full, file);
    const where = rel(fp);
    const raw = fs.readFileSync(fp, 'utf8');

    if (raw.trim().length === 0) {
      report('ERROR', where, 'file is empty (0 bytes of content)');
      continue;
    }

    const parsed = matter(raw);
    if (Object.keys(parsed.data).length === 0) {
      report('ERROR', where, 'no frontmatter found');
      continue;
    }
    const fm = normalise(parsed.data as Record<string, unknown>);
    const result = schema.safeParse(fm);
    if (!result.success) {
      for (const issue of result.error.issues) {
        report('ERROR', where, `frontmatter '${issue.path.join('.')}': ${issue.message}`);
      }
      continue;
    }
    const data = result.data as Record<string, unknown>;

    // slug: frontmatter wins, else derived from filename (as content.ts does)
    const fileSlug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.mdx$/, '');
    const slug = (data.slug as string | undefined) || fileSlug;
    if (slugsSeen[dir].has(slug)) report('ERROR', where, `duplicate slug '${slug}'`);
    slugsSeen[dir].add(slug);
    if (data.slug && data.slug !== fileSlug) {
      report('WARN', where, `slug '${data.slug}' differs from filename slug '${fileSlug}'`);
    }

    // journal: filename date prefix must match frontmatter date
    if (dir === 'journal') {
      const m = file.match(/^(\d{4}-\d{2}-\d{2})-/);
      if (!m) report('ERROR', where, 'journal filename must start YYYY-MM-DD-');
      else if (m[1] !== data.date) {
        report('ERROR', where, `filename date ${m[1]} does not match frontmatter date ${data.date}`);
      }
    }

    // images + alt text in frontmatter
    for (const [imgKey, altKey] of [['heroImage', 'heroAlt'], ['coverImage', 'coverAlt']]) {
      const img = data[imgKey] as string | undefined;
      if (img) {
        referencedImages.add(img);
        checkImage(where, img);
        if (!(data[altKey] as string | undefined)?.trim()) {
          report('ERROR', where, `${imgKey} set but ${altKey} is missing`);
        }
      }
    }

    // body
    const body = parsed.content;
    if (data.published !== false && body.trim().length < 200) {
      report('ERROR', where, `published but body is only ${body.trim().length} characters`);
    }
    for (const m of body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) {
      referencedImages.add(m[2]);
      checkImage(where, m[2]);
      if (!m[1].trim()) report('ERROR', where, `image with empty alt text: ${m[2]}`);
    }
    for (const m of body.matchAll(/<Plate\b[^>]*>/g)) {
      const src = m[0].match(/src="([^"]*)"/)?.[1];
      const alt = m[0].match(/alt="([^"]*)"/)?.[1];
      if (src) {
        referencedImages.add(src);
        checkImage(where, src);
      } else report('ERROR', where, '<Plate> without src');
      if (!alt?.trim()) report('ERROR', where, `<Plate> without alt text (${src ?? '?'})`);
    }
    if (data.published !== false) checkVoice(where, `${fm.title ?? ''}\n${body}`);
  }
}

// ---------- translations ----------
type Flat = Record<string, string>;
function flatten(obj: unknown, prefix = '', out: Flat = {}): Flat {
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      flatten(v, prefix ? `${prefix}.${k}` : k, out);
    }
  } else out[prefix] = String(obj ?? '');
  return out;
}

const msgs: Partial<Record<(typeof LOCALES)[number], Flat>> = {};
for (const l of LOCALES) {
  const fp = path.join(MESSAGES, `${l}.json`);
  if (!fs.existsSync(fp)) {
    report('ERROR', `messages/${l}.json`, 'missing');
    continue;
  }
  try {
    msgs[l] = flatten(JSON.parse(fs.readFileSync(fp, 'utf8')));
  } catch (e) {
    report('ERROR', `messages/${l}.json`, `invalid JSON: ${(e as Error).message}`);
  }
}
const en = msgs.en;
if (en) {
  for (const l of ['de', 'fr'] as const) {
    const other = msgs[l];
    if (!other) continue;
    const where = `messages/${l}.json`;
    for (const k of Object.keys(en)) {
      if (!en[k].trim()) continue; // nothing to translate yet
      if (!(k in other)) report('ERROR', where, `missing key: ${k}`);
      else if (!other[k].trim()) report('ERROR', where, `empty value: ${k}`);
      else if (other[k] === en[k] && en[k].length > 25) {
        report('WARN', where, `identical to English (untranslated?): ${k}`);
      }
    }
    for (const k of Object.keys(other)) {
      if (!(k in en)) report('WARN', where, `extra key not in en: ${k}`);
    }
  }
  checkVoice('messages/en.json', Object.values(en).join('\n'));
}

// ---------- legal identity (Companies Act 2006) ----------
function grepTree(dir: string, needle: string): boolean {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (grepTree(p, needle)) return true;
    } else if (/\.(tsx?|json|mdx?)$/.test(entry.name)) {
      if (fs.readFileSync(p, 'utf8').includes(needle)) return true;
    }
  }
  return false;
}
if (!grepTree(path.join(ROOT, 'src'), COMPANY_NUMBER) && !grepTree(MESSAGES, COMPANY_NUMBER)) {
  report('ERROR', 'site', `company number ${COMPANY_NUMBER} appears nowhere in src/ or messages/ (required on the website)`);
}
if (!grepTree(path.join(ROOT, 'src'), 'England and Wales') && !grepTree(MESSAGES, 'England and Wales')) {
  report('ERROR', 'site', "'Registered in England and Wales' appears nowhere in src/ or messages/");
}

// ---------- em dashes in source (advisory) ----------
(function scanSrc(d: string) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) scanSrc(p);
    else if (/\.tsx?$/.test(e.name)) {
      const lines = fs.readFileSync(p, 'utf8').split('\n');
      const at = lines.flatMap((l, i) => (l.includes('—') ? [i + 1] : []));
      if (at.length) report('WARN', rel(p), `contains an em dash (line ${at.join(', ')})`);
    }
  }
})(path.join(ROOT, 'src'));

// ---------- unreferenced images (advisory) ----------
const IMG_DIR = path.join(PUBLIC, 'images');
if (fs.existsSync(IMG_DIR)) {
  const all: string[] = [];
  (function walk(d: string) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(jpe?g|png|webp|avif)$/i.test(e.name)) all.push('/' + path.relative(PUBLIC, p).split(path.sep).join('/'));
    }
  })(IMG_DIR);
  const codeBlob = (function collect(d: string): string {
    let s = '';
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) s += collect(p);
      else if (/\.(tsx?|json|mdx?)$/.test(e.name)) s += fs.readFileSync(p, 'utf8');
    }
    return s;
  })(path.join(ROOT, 'src')) + fs.readdirSync(MESSAGES).map((f) => fs.readFileSync(path.join(MESSAGES, f), 'utf8')).join('');
  const unused = all.filter((p) => !referencedImages.has(p) && !codeBlob.includes(p));
  if (unused.length) {
    report('WARN', 'public/images', `${unused.length} image file(s) not referenced by content, src or messages (variants may be used via next/image srcset; review before deleting): ${unused.slice(0, 8).join(', ')}${unused.length > 8 ? ', ...' : ''}`);
  }
}

// ---------- output ----------
const errors = findings.filter((f) => f.level === 'ERROR');
const warns = findings.filter((f) => f.level === 'WARN');
for (const f of [...errors, ...warns]) console.log(`${f.level.padEnd(5)}  ${f.where}\n       ${f.msg}`);
console.log(`\n${errors.length} error(s), ${warns.length} warning(s).`);
process.exit(errors.length ? 1 : 0);
