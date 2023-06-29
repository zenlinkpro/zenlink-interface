const defaultTheme = require('tailwindcss/defaultTheme')

// @ts-check
/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
  theme: {
    screens: {
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        sans: ['Inter Variable', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: () => ({
        'gradient-radial': 'radial-gradient(#13213E, #111829)',
        'radial-light': 'radial-gradient(rgba(205, 232, 251, 0.5) 0%, #EAEAEA)',
        'rainbow-gradient':
          'linear-gradient(90deg, #8100E1 0%, #008EF3 41%, #00CCD5 63%, #F2B082 75%, #F20082 100%)',
        'shimmer-gradient':
          'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.03) 30%, rgba(255, 255, 255, 0.06) 50%, rgba(255, 255, 255, 0.03) 70%, rgba(255, 255, 255, 0) 100%)',
        'shimmer-gradient-dark':
          'linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.03) 30%, rgba(0, 0, 0, 0.06) 50%, rgba(0, 0, 0, 0.03) 70%, rgba(0, 0, 0, 0) 100%)',
      }),
      boxShadow: {
        'depth-1': '0px 3px 6px rgba(15, 15, 15, 0.5)',
        'hover-card': 'rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px',
        'table-root': 'rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 16px 24px, rgba(0, 0, 0, 0.01) 0px 24px 32px',
        'dropdown': '0px 4px 12px 0px rgba(0, 0, 0, 0.15)',
      },
      colors: {
        blue: {
          DEFAULT: '#3b82f6',
        },
        pink: {
          DEFAULT: '#ec4899',
        },
        green: {
          DEFAULT: '#22c55e',
        },
        red: {
          DEFAULT: '#ef4444',
        },
        yellow: {
          DEFAULT: '#eab308',
        },
      },
      animation: {
        'ellipsis': 'ellipsis 1.25s infinite',
        'spin-slow': 'spin 2s linear infinite',
        'heartbeat': 'heartbeat 1s ease 0.2s infinite normal forwards',
        'rotate': 'rotate360 1s cubic-bezier(0.83, 0, 0.17, 1) infinite',
        'wave': 'shimmer 1.25s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave-fast': 'shimmer 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'dash': 'dash 1.5s 2s ease-out infinite',
        'dash-check': 'dash-check 1.5s 2s ease-out infinite',
      },
      keyframes: {
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
        'ellipsis': {
          '0%': { content: '"."' },
          '33%': { content: '".."' },
          '66%': { content: '"..."' },
        },
        'heartbeat': {
          '0%': {
            transform: 'scale(1)',
            transformOrigin: 'center center',
            animationTimingFunction: 'ease-out',
          },
          '10%': {
            animationTimingFunction: 'ease-out',
            transform: 'scale(0.91)',
          },
          '17%': {
            animationTimingFunction: 'ease-out',
            transform: 'scale(0.98)',
          },
          '33%': {
            animationTimingFunction: 'ease-out',
            transform: 'scale(0.87)',
          },
          '45%': { animationTimingFunction: 'ease-out', transform: 'scale(1)' },
        },
        'rotate360': {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },
        'dash': {
          '0%': {
            strokeDashoffset: 1000,
          },
          '100%': {
            strokeDashoffset: 0,
          },
        },
        'dash-check': {
          '0%': {
            strokeDashoffset: -100,
          },
          '100%': {
            strokeDashoffset: 900,
          },
        },
      },
    },
  },
}
