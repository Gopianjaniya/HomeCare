/** @type {import('tailwindcss').Config} */
  export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
      extend: {
        colors: {
          brand: {
            50: "#fff7ed",
            100: "#ffedd5",
            200: "#fed7aa",
            300: "#fdba74",
            400: "#fb923c",
            500: "#f97316",
            600: "#ea580c",
            700: "#c2410c",
            800: "#9a3412",
            900: "#7c2d12",
          },
        },
        fontFamily: {
          sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        },
        boxShadow: {
          soft: "0 10px 40px 0 rgba(249,115,22,0.12)",
          card: "0 1px 4px 0 rgba(0,0,0,0.06)",
        },
      },
    },
    plugins: [],
  };
