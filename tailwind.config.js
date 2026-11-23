/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F6F4EF',
        'paper-deep': '#ECE8DF',
        ink: '#1A1A1A',
        'ink-soft': '#3D3A35',
        muted: '#5A5650',
        rule: '#DDD8CE',
        'rule-strong': '#BDB6A8',
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
