/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F4F8FF',
        section: '#EAF2FF',
        card: '#FFFFFF',
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B', // Secondary Text
          600: '#475569',
          700: '#334155', // Main Text
          800: '#1E293B',
          900: '#0F172A',
        },
        primary: {
          DEFAULT: '#8AB4F8',
          50: '#F4F8FF',
          100: '#EAF2FF',
          200: '#D5E5FD',
          300: '#B0CFFB',
          400: '#8AB4F8',
          500: '#669DF6',
          600: '#4285F4',
          700: '#3367D6',
          800: '#2A56C6',
          900: '#1E3A8A',
          950: '#172554',
        },
        secondary: {
          DEFAULT: '#A5B4FC',
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        accent: {
          DEFAULT: '#A7E8D0', // Mint green success
          50: '#F0FDF8',
          100: '#DCFCEE',
          200: '#C0F6DE',
          300: '#A7E8D0',
          400: '#7CD9B7',
          500: '#48C798',
          600: '#22A375',
          700: '#17805C',
          800: '#14654A',
          900: '#13533E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 2px 10px 0 rgba(138, 180, 248, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        'card': '0 2px 8px 0 rgba(148, 163, 184, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'card-hover': '0 8px 24px 0 rgba(138, 180, 248, 0.16), 0 2px 6px 0 rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
