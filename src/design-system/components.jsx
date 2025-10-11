import React from 'react'
import { tokens } from './tokens'

// Button Component with Vendorr Design System
export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 focus:outline-none focus:ring-2
    focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
  `

  const variants = {
    primary: `
      bg-vendorr-blue hover:bg-vendorr-blue-dark text-white
      focus:ring-vendorr-blue shadow-vendorr
    `,
    secondary: `
      border-2 border-vendorr-gold text-vendorr-blue
      hover:bg-vendorr-gold hover:text-vendorr-blue
      focus:ring-vendorr-gold
    `,
    gold: `
      bg-vendorr-gold hover:bg-vendorr-gold-dark text-vendorr-blue
      focus:ring-vendorr-gold shadow-vendorr-gold font-semibold
    `,
    outline: `
      border-2 border-vendorr-blue text-vendorr-blue
      hover:bg-vendorr-blue hover:text-white
      focus:ring-vendorr-blue
    `,
    ghost: `
      text-vendorr-blue hover:bg-vendorr-gray
      focus:ring-vendorr-blue
    `
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
      )}
      {children}
    </button>
  )
}

// Card Component
export const Card = ({ children, className = '', padding = 'md', ...props }) => {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-vendorr border border-gray-100 ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// Input Component
export const Input = ({
  label,
  error,
  help,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-vendorr-blue
          focus:border-transparent transition-colors duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {help && !error && (
        <p className="text-sm text-gray-500">{help}</p>
      )}
    </div>
  )
}

// Loading Spinner Component
export const Spinner = ({ size = 'md', color = 'primary' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  const colors = {
    primary: 'border-vendorr-blue',
    gold: 'border-vendorr-gold',
    white: 'border-white'
  }

  return (
    <div className={`
      animate-spin ${sizes[size]} ${colors[color]}
      border-2 border-t-transparent rounded-full
    `}></div>
  )
}

// Badge Component
export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const variants = {
    primary: 'bg-vendorr-blue text-white',
    gold: 'bg-vendorr-gold text-vendorr-blue',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  }

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${variants[variant]} ${sizes[size]} ${className}
    `}>
      {children}
    </span>
  )
}

// Typography Components
export const Heading = ({
  level = 1,
  children,
  className = '',
  color = 'primary',
  ...props
}) => {
  const Tag = `h${level}`

  const sizes = {
    1: 'text-4xl md:text-5xl font-bold',
    2: 'text-3xl md:text-4xl font-bold',
    3: 'text-2xl md:text-3xl font-semibold',
    4: 'text-xl md:text-2xl font-semibold',
    5: 'text-lg md:text-xl font-medium',
    6: 'text-base md:text-lg font-medium'
  }

  const colors = {
    primary: 'text-vendorr-blue',
    gold: 'text-vendorr-gold',
    dark: 'text-gray-900',
    white: 'text-white'
  }

  return (
    <Tag
      className={`${sizes[level]} ${colors[color]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}

export const Text = ({
  children,
  size = 'base',
  weight = 'normal',
  color = 'dark',
  className = '',
  ...props
}) => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }

  const colors = {
    primary: 'text-vendorr-blue',
    gold: 'text-vendorr-gold',
    dark: 'text-gray-900',
    muted: 'text-gray-600',
    light: 'text-gray-400',
    white: 'text-white'
  }

  return (
    <p
      className={`${sizes[size]} ${weights[weight]} ${colors[color]} ${className}`}
      {...props}
    >
      {children}
    </p>
  )
}

// Typography Component (wrapper for Heading and Text)
export const Typography = ({
  variant = 'body1',
  children,
  className = '',
  color = 'dark',
  ...props
}) => {
  const variantMap = {
    h1: { component: 'h1', styles: 'text-4xl md:text-5xl font-bold' },
    h2: { component: 'h2', styles: 'text-3xl md:text-4xl font-bold' },
    h3: { component: 'h3', styles: 'text-2xl md:text-3xl font-semibold' },
    h4: { component: 'h4', styles: 'text-xl md:text-2xl font-semibold' },
    h5: { component: 'h5', styles: 'text-lg md:text-xl font-medium' },
    h6: { component: 'h6', styles: 'text-base md:text-lg font-medium' },
    body1: { component: 'p', styles: 'text-base' },
    body2: { component: 'p', styles: 'text-sm' },
    caption: { component: 'span', styles: 'text-xs' },
    overline: { component: 'span', styles: 'text-xs uppercase tracking-wide' }
  }

  const colors = {
    primary: 'text-vendorr-blue',
    gold: 'text-vendorr-gold',
    dark: 'text-gray-900',
    muted: 'text-gray-600',
    light: 'text-gray-400',
    white: 'text-white'
  }

  const { component: Component, styles } = variantMap[variant] || variantMap.body1

  return (
    <Component
      className={`${styles} ${colors[color]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

// Loading Spinner Component
export const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colors = {
    primary: 'text-vendorr-blue',
    gold: 'text-vendorr-gold',
    white: 'text-white',
    gray: 'text-gray-500'
  }

  return (
    <div
      className={`${sizes[size]} ${colors[color]} animate-spin ${className}`}
      {...props}
    >
      <svg
        className="w-full h-full"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}
