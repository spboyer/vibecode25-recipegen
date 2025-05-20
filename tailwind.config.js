/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      // Custom colors for hotdog theme
      colors: {
        hotdog: {
          red: '#FF0000',
          yellow: '#FFFF00',
          mustard: '#E1AD01',
          bun: '#C68E17',
        },
      },
    },
  },
  plugins: [
    // Plugin to add the hotdog theme variant
    function({ addVariant, e }) {
      addVariant('hotdog', ({ container }) => {
        container.walkRules(rule => {
          rule.selector = `:is(.hotdog) ${rule.selector}`;
        });
      });
    }
  ],
};
