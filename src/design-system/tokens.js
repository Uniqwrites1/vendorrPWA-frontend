// Design tokens for Vendorr PWA
// Following the blue, white, and gold color palette

export const tokens = {
  // Colors
  colors: {
    // Primary Blues
    primary: {
      50: '#E6F2FF',
      100: '#CCE5FF',
      200: '#99CCFF',
      300: '#66B3FF',
      400: '#3399FF',
      500: '#005A9C',  // Main brand blue
      600: '#004080',  // Darker blue
      700: '#003366',
      800: '#00264D',
      900: '#001A33',
    },

    // Gold Accents
    gold: {
      50: '#FFFEF0',
      100: '#FFFDE1',
      200: '#FFFAC2',
      300: '#FFF7A3',
      400: '#FFF485',
      500: '#FFD700',  // Main brand gold
      600: '#F6C23E',  // Slightly darker gold
      700: '#E6B800',
      800: '#CC9F00',
      900: '#B38600',
    },

    // Neutrals
    neutral: {
      0: '#FFFFFF',    // Pure white
      50: '#F9FAFB',
      100: '#F5F5F5',  // Light gray background
      200: '#E5E5E5',  // Darker gray
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },

    // Semantic colors
    success: {
      50: '#F0FDF4',
      500: '#10B981',
      600: '#059669',
    },
    warning: {
      50: '#FFFBEB',
      500: '#F59E0B',
      600: '#D97706',
    },
    error: {
      50: '#FEF2F2',
      500: '#EF4444',
      600: '#DC2626',
    },
    info: {
      50: '#EFF6FF',
      500: '#3B82F6',
      600: '#2563EB',
    }
  },

  // Typography
  typography: {
    fontFamily: {
      primary: ['Poppins', 'sans-serif'],
      secondary: ['Montserrat', 'sans-serif'],
      fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
    },

    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },

    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },

    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },

    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    }
  },

  // Spacing
  spacing: {
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    32: '8rem',      // 128px
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    // Custom Vendorr shadows
    vendorr: '0 4px 14px 0 rgba(0, 90, 156, 0.1)',
    vendorrGold: '0 4px 14px 0 rgba(255, 215, 0, 0.2)',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },

  // Z-index scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  }
}

export default tokens
