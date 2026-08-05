import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export interface JournalFrontmatter {
  title: string;
  slug: string;
  date: string;
  theme: string;
  excerpt: string;
  wordCount: number;
  footnoteCount: number;
  author: string;
  coverImage?: string;
  coverAlt?: string;
  published: boolean;
}

export interface CaseStudyFrontmatter {
  title: string;
  slug: string;
  date: string;
  status: 'Ongoing' | 'Completed';
  mandate: string;
  objectTypes: string[];
  location: string;
  client: string;
  duration: string;
  year: string;
  scope: string;
  heroImage?: string;
  heroAlt?: string;
  published: boolean;
}

export interface ServiceFrontmatter {
  archetype: string;
  tagline: string;
  slug: string;
  order: number;
  heroImage?: string;
  heroAlt?: string;
  metaDescription: string;
  published: boolean;
}

// gray-matter parses YAML dates as Date objects; convert to ISO strings
function normaliseFrontmatter(data: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [
      k,
      v instanceof Date ? v.toISOString().slice(0, 10) : v,
    ]),
  );
}

// Journal filenames are YYYY-MM-DD-slug.mdx; slug also appears in frontmatter
function resolveSlug(filename: string, fm: Record<string, unknown>): string {
  if (typeof fm.slug === 'string' && fm.slug) return fm.slug;
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.mdx$/, '');
}

function readAllInDir<T>(
  type: string,
  sortBy: 'date' | 'order' = 'date',
): T[] {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];

  const entries = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { data } = matter(raw);
      const fm = normaliseFrontmatter(data as Record<string, unknown>);
      const slug = resolveSlug(file, fm);
      return { ...fm, slug } as T;
    })
    .filter((e) => (e as Record<string, unknown>).published !== false);

  if (sortBy === 'date') {
    return entries.sort(
      (a, b) =>
        new Date((b as { date: string }).date).getTime() -
        new Date((a as { date: string }).date).getTime(),
    );
  }
  return entries.sort(
    (a, b) =>
      ((a as { order?: number }).order ?? 0) -
      ((b as { order?: number }).order ?? 0),
  );
}

function readBySlug(
  type: string,
  slug: string,
): { frontmatter: Record<string, unknown>; content: string } | null {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return null;

  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data, content } = matter(raw);
    const fm = normaliseFrontmatter(data as Record<string, unknown>);
    const fileSlug = resolveSlug(file, fm);
    if (fileSlug === slug) {
      return { frontmatter: { ...fm, slug: fileSlug }, content };
    }
  }
  return null;
}

export const getAllJournalEntries = (): JournalFrontmatter[] =>
  readAllInDir<JournalFrontmatter>('journal', 'date');

export const getJournalEntry = (
  slug: string,
): { frontmatter: JournalFrontmatter; content: string } | null =>
  readBySlug('journal', slug) as {
    frontmatter: JournalFrontmatter;
    content: string;
  } | null;

export const getAllCaseStudies = (): CaseStudyFrontmatter[] =>
  readAllInDir<CaseStudyFrontmatter>('case-studies', 'date');

export const getCaseStudy = (
  slug: string,
): { frontmatter: CaseStudyFrontmatter; content: string } | null =>
  readBySlug('case-studies', slug) as {
    frontmatter: CaseStudyFrontmatter;
    content: string;
  } | null;

export const getAllServices = (): ServiceFrontmatter[] =>
  readAllInDir<ServiceFrontmatter>('services', 'order');

export const getService = (
  slug: string,
): { frontmatter: ServiceFrontmatter; content: string } | null =>
  readBySlug('services', slug) as {
    frontmatter: ServiceFrontmatter;
    content: string;
  } | null;

export function formatDate(iso: string, locale = 'en-GB'): string {
  return new Date(iso).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function readingTime(wordCount: number): string {
  const mins = Math.max(1, Math.ceil(wordCount / 200));
  return `${mins} min read`;
}

const md = new MarkdownIt({ html: true, linkify: false, typographer: true });

// Pre-process MDX custom components to HTML equivalents before rendering.
// SmallCaps → <span class="small-caps">, Footnote → superscript, Plate → figure.
function preprocessCustomComponents(source: string): string {
  return source
    .replace(/<SmallCaps>([\s\S]*?)<\/SmallCaps>/g, '<span class="small-caps">$1</span>')
    .replace(
      /<Footnote\s+number=\{(\d+)\}\s*\/>/g,
      '<sup class="text-xs text-[var(--accent)] ml-0.5">[$1]</sup>',
    )
    .replace(
      /<Plate\s[^>]*alt="([^"]*)"[^>]*\/>/g,
      '<figure class="my-10"><figcaption class="mt-2 text-sm text-[var(--muted)] small-caps">$1</figcaption></figure>',
    );
}

export function compileMDX(mdxSource: string): string {
  const processed = preprocessCustomComponents(mdxSource);
  return md.render(processed);
}
