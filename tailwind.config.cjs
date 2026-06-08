/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}"],
  darkMode: "class", // allows toggling dark mode manually
  theme: {
    extend: {
      colors: {
        lt: {
          bg: '#EDE6D6',
          surface: '#E4DCC8',
          border: '#C8BFA8',
          ink: '#1A1814',
          muted: '#6B6456',
          ghost: '#A89F90',
          accent: '#D4621A',
        },
        rl: {
          teal: '#4B8D9E',
          gold: '#C29145',
          red: '#A33332',
        },
        primary: "var(--primary)",
        page: "var(--page-bg)",
        card: "var(--card-bg)",
        "deep-text": "var(--deep-text)",
        "line-divider": "var(--line-divider)",
        "line-color": "var(--line-color)",
        "float-panel": "var(--float-panel-bg)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
        google: ["Google Sans Flex", "Google Sans", "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "sans-serif"],
      },
      borderRadius: {
        'large': 'var(--radius-large)',
        'medium': 'var(--radius-medium)',
        'small': 'var(--radius-small)',
      }
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate")
  ],
}