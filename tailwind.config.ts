import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ground: 'var(--ground)',
        'ground-soft': 'var(--ground-soft)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        'ink-muted': 'var(--ink-muted)',
        muted: 'var(--muted)',
        rule: 'var(--rule)',
        'rule-soft': 'var(--rule-soft)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Garamond', 'serif'],
        body: ['var(--font-body)', 'Garamond', 'Georgia', 'serif'],
      },
      maxWidth: {
        site: 'var(--max)',
        measure: 'var(--measure)',
      },
    },
  },
  plugins: [],
};

export default config;
