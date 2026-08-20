/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Гадаргуу — давхарга бүр илүү ялгагдана (хар-саарал биш, хөхөвтөр)
        ink: {
          950: '#070A12',
          900: '#0C1220',
          800: '#141C2E',
          700: '#1E2A40',
          600: '#2A3A55',
          500: '#3D5070',
        },
        // Текст — secondary ч уншигдахуйц тод
        mist: {
          500: '#6B7A94',
          400: '#8B9BB5',
          300: '#A8B6CC',
          200: '#CDD6E4',
          100: '#E6ECF5',
          50: '#F5F8FC',
        },
        // Өгүүлбэрийн гишүүдийг ялгах "color-coding" систем
        subject: { DEFAULT: '#6EA8FF', dim: '#2A4A7A' },
        verb: { DEFAULT: '#FF9A6B', dim: '#6B4536' },
        object: { DEFAULT: '#3DDC97', dim: '#1F5C45' },
        modifier: { DEFAULT: '#FFD166', dim: '#6B5A2C' },
        // Brand — тод цэнхэр, хар дээр илүү ялгарна
        brand: {
          DEFAULT: '#4F8CFF',
          hover: '#6BA0FF',
          muted: '#1A335F',
        },
        danger: '#FF6B7A',
        success: '#3DDC97',
        warning: '#FFB020',
      },
      fontFamily: {
        display: ['var(--font-ibm-plex-mono)', 'ui-monospace', 'monospace'],
        body: ['var(--font-ibm-plex-mono)', 'ui-monospace', 'monospace'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(79, 140, 255, 0.25), 0 8px 28px rgba(79, 140, 255, 0.12)',
        card: '0 1px 0 rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'word-cycle': {
          '0%, 100%': { opacity: '0' },
          '10%, 30%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
