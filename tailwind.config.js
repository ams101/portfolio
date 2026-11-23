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
