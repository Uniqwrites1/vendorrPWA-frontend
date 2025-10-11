// Vendorr Brand Constants
export const COLORS = {
  primary: {
    blue: '#005A9C',
    blueDark: '#004080',
    blueLight: '#0066B3',
  },
  accent: {
    gold: '#FFD700',
    goldLight: '#FFED4A',
    goldDark: '#F6C23E',
  },
  neutral: {
    white: '#FFFFFF',
    gray: '#F5F5F5',
    grayDark: '#E5E5E5',
  }
}

export const FONTS = {
  primary: 'Poppins',
  secondary: 'Montserrat',
  fallback: 'system-ui, -apple-system, sans-serif'
}

export const RESTAURANT_INFO = {
  name: 'Vendorr',
  tagline: 'Eliminate waiting time',
  description: 'Pre-ordering and pickup coordination for your convenience',
  phone: '+1 (555) 123-4567',
  email: 'info@vendorr.com',
  address: '123 Main Street, Downtown, City 12345',
  hours: {
    monday: '11:00 AM - 9:00 PM',
    tuesday: '11:00 AM - 9:00 PM',
    wednesday: '11:00 AM - 9:00 PM',
    thursday: '11:00 AM - 9:00 PM',
    friday: '11:00 AM - 10:00 PM',
    saturday: '10:00 AM - 10:00 PM',
    sunday: '10:00 AM - 8:00 PM'
  }
}

export const ORDER_STATUSES = {
  PENDING_PAYMENT: 'pending_payment',
  PAYMENT_CONFIRMED: 'payment_confirmed',
  PREPARING: 'preparing',
  ALMOST_READY: 'almost_ready',
  READY: 'ready_for_pickup',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const USER_ROLES = {
  CUSTOMER: 'customer',
  KITCHEN_STAFF: 'kitchen_staff',
  COUNTER_STAFF: 'counter_staff',
  MANAGER: 'manager',
  ADMIN: 'admin'
}
