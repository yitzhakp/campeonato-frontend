module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ], // ajusta según tu proyecto
    theme: {
        extend: {
            colors: {
                'verde-cesped': '#28A745',
                'azul-noche': '#002B5B',
                'amarillo-dorado': '#FFC107',
                'gris-claro': '#F8F9FA',
                'gris-oscuro': '#343A40',
                'gris-medio': '#6C757D',
            }
        }
    },
    plugins: [],
}