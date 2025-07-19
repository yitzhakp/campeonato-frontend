/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'verde-bosque': '#013023',
        'verde-win': '#39B57A',
        'verde-menta': '#b4e3d9',
        'verde-pasto': '#2b5a4e',
        'azul-noche': '#002B5B',
        'amarillo-dorado': '#FFC107',
        'gris-claro': '#F1F3F5',
        'gris-oscuro': '#343A40',
        'rojo-alerta': '#D62828',
        'blanco-puro': '#FFFFFF',
        'negro-suave': '#121212',
      }
    },
  },
  plugins: [],
}