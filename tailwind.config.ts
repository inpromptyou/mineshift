import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Mining industry professional dark theme
        background: '#0f0f0f',
        surface: '#1a1a1a',
        card: '#262626',
        border: '#404040',
        'border-light': '#525252',
        
        // Text colors
        foreground: '#f5f5f5',
        muted: '#a3a3a3',
        'muted-dark': '#737373',
        
        // Safety orange - mining industry standard
        primary: '#f59e0b',
        'primary-dark': '#d97706',
        'primary-light': '#fbbf24',
        
        // Status colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        
        // Shift status colors
        'status-open': '#3b82f6',
        'status-in-progress': '#f59e0b',
        'status-closed': '#10b981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Large touch targets for tablet use
        'touch-sm': '1.125rem',
        'touch-base': '1.25rem',
        'touch-lg': '1.375rem',
      },
      spacing: {
        // Touch-friendly spacing
        'touch': '44px',
        'touch-lg': '56px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 2s linear infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}
export default config