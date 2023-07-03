// @ts-check
/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  darkMode: 'class',
  presets: [require('@zenlink-interface/ui/tailwind')],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    '../../packages/wagmi/{components,systems}/**/*.{js,ts,jsx,tsx}',
    '../../packages/compat/{components,systems}/**/*.{js,ts,jsx,tsx}',
    '../../packages/parachains-impl/**/{components,systems}/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/{,!(node_modules)/**/}*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
}

module.exports = tailwindConfig
