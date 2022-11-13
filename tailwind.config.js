/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  darkMode: 'class',
  important: true,
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        turquoise: '#73fff7',
      },
      // custom css properties set in src/components/styled/baseStyles.js
      backgroundColor: {
        primary: 'rgb(255,255,255)',
        highlight: 'rgb(56 189 248)',
      },
      borderColor: {
        highlight: 'rgb(56 189 248)',
      },
      textColor: {
        primary: 'rgb(75 85 99)',
        highlight: 'rgb(56 189 248)',
      },
    },
  },
  plugins: [],
}
