/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    colors: {
      // Base colors
      white: '#FFFFFF',
      transparent: 'transparent',
      black: '#000000',
      gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
      },
      red: {
        50: '#FEF2F2',
        100: '#FEE2E2',
        200: '#FECACA',
        600: '#DC2626',
      },
      // SoGood theme - Organic & Fresh
      sogood: {
        bg: '#F9FBF9',          // Background principal
        surface: '#FFFFFF',     // Cartes
        primary: '#2E7D32',     // Couleur primaire (vert forêt)
        'primary-hover': '#1B5E20', // Vert foncé
        accent: '#81C784',      // Vert clair
        'text-primary': '#0F1A10', // Noir verdâtre
        'text-secondary': '#4A5D4E', // Gris-vert
        border: '#E2E8E4',      // Gris très clair
      },
      // Nutri-Score colors
      nutriscore: {
        a: '#038141',
        b: '#85BB2F',
        c: '#FECB02',
        d: '#EE8100',
        e: '#E63E11',
      },
      // NOVA colors
      nova: {
        1: '#00A05A',
        2: '#FFC800',
        3: '#FF8200',
        4: '#FF0000',
      },
    },
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
      },
      spacing: {
        gutter: '1.5rem',
      },
      letterSpacing: {
        label: '0.2em',
      },
      boxShadow: {
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'search-glow': '0 0 20px rgba(129, 199, 132, 0.2)',
      },
      backdropBlur: {
        xl: '20px',
      },
    },
  },
  plugins: [],
}
