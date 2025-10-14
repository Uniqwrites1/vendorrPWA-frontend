import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { VendorrLogo, Icons } from '../design-system/icons'
import { Button } from '../design-system/components'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Cart from './Cart'
import NotificationBell from './NotificationBell'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { isAuthenticated, user, logout, isStaff } = useAuth()
  const { getCartItemCount } = useCart()
  const location = useLocation()
  const navigate = useNavigate()

  const cartItemCount = getCartItemCount()

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const closeCart = () => {
    setIsCartOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-vendorr sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" onClick={closeMenu}>
            <VendorrLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/')
                    ? 'bg-vendorr-blue text-white'
                    : 'text-vendorr-blue hover:bg-vendorr-gray'
                }`}
              >
                Home
              </Link>
              <Link
                to="/menu"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/menu')
                    ? 'bg-vendorr-blue text-white'
                    : 'text-vendorr-blue hover:bg-vendorr-gray'
                }`}
              >
                Menu
              </Link>
              {isAuthenticated && (
                <Link
                  to="/orders"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/orders')
                      ? 'bg-vendorr-blue text-white'
                      : 'text-vendorr-blue hover:bg-vendorr-gray'
                  }`}
                >
                  My Orders
                </Link>
              )}
              {isStaff() && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/admin')
                      ? 'bg-vendorr-blue text-white'
                      : 'text-vendorr-blue hover:bg-vendorr-gray'
                  }`}
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              {/* Notification Bell (only for authenticated users) */}
              {isAuthenticated && <NotificationBell />}

              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-vendorr-blue hover:bg-vendorr-gray rounded-lg transition-colors duration-200"
              >
                <Icons.ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-vendorr-gold text-vendorr-blue text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">
                    Hi, {user?.first_name}!
                  </span>
                  <Link to="/profile">
                    <Button variant="outline" size="sm">
                      Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-vendorr-blue hover:bg-vendorr-gray focus:outline-none focus:ring-2 focus:ring-vendorr-blue"
            >
              {isMenuOpen ? <Icons.Close /> : <Icons.Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-slide-up">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive('/')
                  ? 'bg-vendorr-blue text-white'
                  : 'text-vendorr-blue hover:bg-vendorr-gray'
              }`}
            >
              Home
            </Link>
            <Link
              to="/menu"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive('/menu')
                  ? 'bg-vendorr-blue text-white'
                  : 'text-vendorr-blue hover:bg-vendorr-gray'
              }`}
            >
              Menu
            </Link>
            {isAuthenticated && (
              <Link
                to="/orders"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive('/orders')
                    ? 'bg-vendorr-blue text-white'
                    : 'text-vendorr-blue hover:bg-vendorr-gray'
                }`}
              >
                My Orders
              </Link>
            )}
            {isStaff() && (
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive('/dashboard')
                    ? 'bg-vendorr-blue text-white'
                    : 'text-vendorr-blue hover:bg-vendorr-gray'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Auth Section */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-5 space-y-3">
              {/* Notification Bell (only for authenticated users) */}
              {isAuthenticated && (
                <div className="flex items-center w-full p-2">
                  <NotificationBell />
                </div>
              )}

              {/* Cart Button */}
              <button
                onClick={() => {
                  toggleCart()
                  closeMenu()
                }}
                className="flex items-center justify-between w-full p-2 text-vendorr-blue hover:bg-vendorr-gray rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center">
                  <Icons.ShoppingCart className="w-5 h-5" />
                  <span className="ml-3">Cart</span>
                </div>
                {cartItemCount > 0 && (
                  <span className="bg-vendorr-gold text-vendorr-blue text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-700 px-2">
                    Hi, {user?.first_name}!
                  </div>
                  <Link to="/profile" onClick={closeMenu}>
                    <Button variant="outline" size="sm" className="w-full">
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link to="/login" onClick={closeMenu}>
                    <Button variant="outline" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={closeMenu}>
                    <Button variant="primary" size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={closeCart} />
    </nav>
  )
}
