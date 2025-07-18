/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#2563EB',
        secondary: '#64748B',
        accent: '#3B82F6',
        surface: '#F8FAFC',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#6366F1',
      },
      boxShadow: {
        'premium': '0 4px 20px -4px rgba(0, 0, 0, 0.15)',
        'card': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'floating': '0 8px 32px -8px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}