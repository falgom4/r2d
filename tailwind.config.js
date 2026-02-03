/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fondo principal
        background: '#0a0a0a',
        surface: '#151515',
        'surface-hover': '#1f1f1f',

        // Bordes
        border: '#2a2a2a',
        'border-focus': '#3a3a3a',

        // Texto
        text: {
          primary: '#ffffff',
          secondary: '#a0a0a0',
          muted: '#707070',
        },

        // Acento (azul)
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          light: '#60a5fa',
        },

        // Estados
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
      },
    },
  },
  plugins: [],
}
