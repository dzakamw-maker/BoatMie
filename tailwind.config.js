/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dossier: {
          bg: "#111215",
          panel: "#1a1b1f",
          blue: "#2554d7",
          "blue-dark": "#1d44b0",
          red: "#c92a2a",
          "red-dark": "#a61e1e",
          green: "#087f5b",
          "green-dark": "#056346",
          purple: "#5f3dc4",
          "purple-dark": "#4a2d9e",
          yellow: "#d97706",
          "yellow-dark": "#b45309",
          black: "#1e2229",
          "black-dark": "#13161c",
          paper: "#fcfbf7",
          "paper-dim": "#f3eee3",
          ink: "#111111",
          typewriter: "#2b2b2b",
          blueprint: "#0c2340",
        },
      },
      fontFamily: {
        sans: ["var(--font-headline)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-editorial)", "Georgia", "Cambria", "serif"],
        mono: ["var(--font-mono)", "Courier New", "Courier", "monospace"],
      },
      boxShadow: {
        folder: "0 10px 30px -10px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.2)",
        paper: "0 4px 20px -2px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)",
        "inner-folder": "inset 0 2px 6px rgba(255,255,255,0.15), inset 0 -3px 8px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};
