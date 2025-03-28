/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          coral: '#E98074',
          purple: '#44318D',
          light: '#F7E5E3', // Lighter version of coral
          dark: '#332561',  // Darker version of purple
        },
        accent: {
          coral: {
            100: '#FDF1EF',
            200: '#F7D8D4',
            300: '#F2BFB9',
            400: '#EDA69E',
            500: '#E98074',
            600: '#E35F51',
            700: '#D93D2B',
          },
          purple: {
            100: '#EAE6F4',
            200: '#D5CCE9',
            300: '#A697D3',
            400: '#7761BD',
            500: '#44318D',
            600: '#362571',
            700: '#281A54',
          }
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1A1225',
        },
        text: {
          primary: '#332561',
          secondary: '#666666',
          light: '#FFFFFF',
          dark: '#1A1225',
        }
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(68, 49, 141, 0.1), 0 2px 4px -1px rgba(68, 49, 141, 0.06)',
        'medium': '0 10px 15px -3px rgba(68, 49, 141, 0.1), 0 4px 6px -2px rgba(68, 49, 141, 0.05)',
      }
    },
  },
  plugins: [],
}