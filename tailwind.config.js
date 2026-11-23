/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FFFFFF',
        'paper-deep': '#F2F2F2',
        ink: '#171717',
        'ink-soft': '#3A3A3A',
        muted: '#5C5C5C',
        rule: '#E4E4E4',
        'rule-strong': '#BDBDBD',
        accent: '#B3330E',
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
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
