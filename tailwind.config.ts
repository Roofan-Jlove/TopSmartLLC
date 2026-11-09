import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1rem', md: '1.5rem', lg: '2rem' }, screens: { xl: '1200px' } },
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-subtle': 'var(--bg-subtle)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        text: 'var(--text)',
        muted: 'var(--text-muted)',
        brand: { DEFAULT: 'var(--brand)', strong: 'var(--brand-strong)', fg: 'var(--brand-fg)' },
        accent: { DEFAULT: 'var(--accent)', strong: 'var(--accent-strong)' },
        success: 'var(--success)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
      },
      fontFamily: {
        heading: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: { sm: '8px', md: '14px', lg: '24px' },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        glow: 'var(--shadow-glow)',
      },
      backgroundImage: { 'brand-gradient': 'linear-gradient(135deg, var(--brand), var(--accent))' },
      transitionTimingFunction: { soft: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-up': 'fade-up 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
