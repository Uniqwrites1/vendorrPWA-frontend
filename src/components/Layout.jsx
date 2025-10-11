import React from 'react'

// Layout Components
export function PageContainer({ children, className = '' }) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {children}
    </div>
  )
}

export function ContentContainer({ children, className = '', maxWidth = 'max-w-7xl' }) {
  return (
    <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

export function Section({ children, className = '', padding = 'py-12' }) {
  return (
    <section className={`${padding} ${className}`}>
      {children}
    </section>
  )
}

// Grid Components
export function Grid({ children, cols = 'md:grid-cols-2 lg:grid-cols-3', gap = 'gap-6', className = '' }) {
  return (
    <div className={`grid ${cols} ${gap} ${className}`}>
      {children}
    </div>
  )
}

export function GridItem({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

// Responsive Layout Components
export function MobileLayout({ children, className = '' }) {
  return (
    <div className={`block md:hidden ${className}`}>
      {children}
    </div>
  )
}

export function TabletLayout({ children, className = '' }) {
  return (
    <div className={`hidden md:block lg:hidden ${className}`}>
      {children}
    </div>
  )
}

export function DesktopLayout({ children, className = '' }) {
  return (
    <div className={`hidden lg:block ${className}`}>
      {children}
    </div>
  )
}

export function ResponsiveLayout({
  mobile,
  tablet = mobile,
  desktop = tablet,
  className = ''
}) {
  return (
    <div className={className}>
      <MobileLayout>{mobile}</MobileLayout>
      <TabletLayout>{tablet}</TabletLayout>
      <DesktopLayout>{desktop}</DesktopLayout>
    </div>
  )
}

// Flexbox Components
export function FlexContainer({
  children,
  direction = 'flex-row',
  justify = 'justify-start',
  align = 'items-start',
  wrap = 'flex-nowrap',
  gap = '',
  className = ''
}) {
  return (
    <div className={`flex ${direction} ${justify} ${align} ${wrap} ${gap} ${className}`}>
      {children}
    </div>
  )
}

export function FlexItem({ children, flex = '', className = '' }) {
  return (
    <div className={`${flex} ${className}`}>
      {children}
    </div>
  )
}

// Header Components
export function PageHeader({ title, subtitle, actions, className = '' }) {
  return (
    <div className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <ContentContainer className="py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-lg text-gray-600">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-3">
              {actions}
            </div>
          )}
        </div>
      </ContentContainer>
    </div>
  )
}

export function SectionHeader({ title, subtitle, actions, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-gray-600">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center space-x-3">
          {actions}
        </div>
      )}
    </div>
  )
}

// Loading Components
export function LoadingSpinner({ size = 'w-6 h-6', className = '' }) {
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-vendorr-blue ${size} ${className}`} />
  )
}

export function LoadingSkeleton({ className = '', lines = 3 }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 rounded h-4 mb-2 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  )
}

export function FullPageLoader({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="w-12 h-12" className="mx-auto mb-4" />
        <p className="text-lg text-gray-600">{message}</p>
      </div>
    </div>
  )
}

// Empty State Components
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = ''
}) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  )
}

// Error Components
export function ErrorBoundary({ children, fallback }) {
  return (
    <div>
      {children}
    </div>
  )
}

export function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
  className = ''
}) {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-6 text-center ${className}`}>
      <div className="text-red-600 mb-2">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-red-900 mb-2">{title}</h3>
      <p className="text-red-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

// Divider Components
export function Divider({ className = '', vertical = false }) {
  return (
    <div
      className={`${
        vertical ? 'w-px h-full bg-gray-200' : 'h-px w-full bg-gray-200'
      } ${className}`}
    />
  )
}

export function SectionDivider({ className = '' }) {
  return <Divider className={`my-8 ${className}`} />
}

// Sticky Components
export function StickyContainer({ children, className = '', top = 'top-0' }) {
  return (
    <div className={`sticky ${top} z-10 ${className}`}>
      {children}
    </div>
  )
}

// Animation Components
export function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <div
      className={`animate-fade-in ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function SlideUp({ children, delay = 0, className = '' }) {
  return (
    <div
      className={`animate-slide-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// Responsive Text Components
export function ResponsiveText({
  size = 'base',
  weight = 'normal',
  color = 'text-gray-900',
  className = '',
  children
}) {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  }

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }

  return (
    <span className={`${sizeClasses[size]} ${weightClasses[weight]} ${color} ${className}`}>
      {children}
    </span>
  )
}
