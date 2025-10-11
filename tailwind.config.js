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
          blue: '#005A9C',
          gold: '#FFD700',
          white: '#FFFFFF',
          gray: '#F5F5F5'
        },
        vendorr: {
          blue: '#005A9C',
          'blue-light': '#0066B3',
          'blue-dark': '#004080',
          gold: '#FFD700',
          'gold-light': '#FFED4A',
          'gold-dark': '#F6C23E',
          gray: '#F5F5F5',
          'gray-dark': '#E5E5E5'
        }
      },
      fontFamily: {
        'sans': ['Poppins', 'Montserrat', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulseGold: {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': { 
            opacity: '0.8',
            transform: 'scale(1.05)'
          }
        }
      },
      boxShadow: {
        'vendorr': '0 4px 14px 0 rgba(0, 90, 156, 0.1)',
        'vendorr-gold': '0 4px 14px 0 rgba(255, 215, 0, 0.2)'
      }
    },
  },
  plugins: [],
}