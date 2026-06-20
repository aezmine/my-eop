/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        portfolio: {
          white: '#FFFFFF',
          bg: '#F1F5F9',
          surface: '#FFFFFF',
          'surface-alt': '#F8FAFC',
          border: '#E2E8F0',
          'border-dark': '#CBD5E1',
          'text-primary': '#0F172A',
          'text-secondary': '#475569',
          'text-muted': '#94A3B8',
          accent: '#4F46E5',
          'accent-hover': '#4338CA',
          'accent-light': '#EEF2FF',
          'accent-border': '#C7D2FE',
          'tag-bg': '#F1F5F9',
          'tag-text': '#334155',
          success: '#10B981',
          error: '#EF4444',
          'error-bg': '#FEF2F2',
          'error-border': '#FCA5A5',
          
          // Dark Mode Overrides
          'dark-bg': '#0F172A',
          'dark-surface': '#1E293B',
          'dark-surface-alt': '#0F172A',
          'dark-border': '#334155',
          'dark-text-primary': '#F8FAFC',
          'dark-text-secondary': '#CBD5E1',
          'dark-text-muted': '#64748B',
          'dark-accent-light': '#1E1B4B',
          'dark-accent-border': '#312E81',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
      },
      boxShadow: {
        sm: '0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)',
        md: '0 4px 12px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.04)',
        lg: '0 10px 30px rgba(15, 23, 42, 0.1), 0 4px 8px rgba(15, 23, 42, 0.06)',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        lg: '16px',
      }
    },
  },
  plugins: [],
}
