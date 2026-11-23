/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Graphite neutrals: the surfaces stay out of the way; colour lives in the work.
        paper: '#FAFAFA',
        'paper-deep': '#F4F4F5',
        ink: '#171717',
        'ink-soft': '#525252',
        muted: '#6B6B6B',
        rule: '#E5E5E5',
        'rule-strong': '#D4D4D4',
        // Ledger crimson, after the red cloth of an Indian bahi-khata account book.
        accent: '#B42318',
        // The accent on dark surfaces (the call cards), where crimson is too dark to read.
        'accent-on-dark': '#F0877B',
        // Status: only where something has that status, always with text or an icon.
        // Negative is a deeper rose-red so it never reads as the crimson "act here" accent.
        positive: { DEFAULT: '#166534', tint: '#EEF7F0', line: '#C6E3CF' },
        warning: { DEFAULT: '#8A4B08', tint: '#FDF6EA', line: '#EFD9B0' },
        negative: { DEFAULT: '#9F1239', tint: '#FDF1F4', line: '#F2C4D0' },
      },
      fontFamily: {
        // Anek Latin, by the Indian foundry Ek Type, for headlines only.
        display: ['"Anek Latin"', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        page: '1120px',
      },
    },
  },
  plugins: [],
};
