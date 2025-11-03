import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Card, Button, Badge } from '../design-system/components'
import { Icons } from '../design-system/icons'
import { formatPrice } from '../utils/currency'

export default function Cart({
  isOpen,
  onClose
}) {
  const navigate = useNavigate()
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartItemCount } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  // Calculate totals
  const subtotal = getCartTotal()
  const total = subtotal

  // formatPrice is now imported from '../utils/currency'

  const handleCheckout = () => {
    if (cart.length === 0) return
    onClose()
    navigate('/cart')
  }

  const handleViewCart = () => {
    onClose()
    navigate('/cart')
  }

  // Close cart when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Your Cart ({cart.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icons.Close className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <Icons.ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-4">
                Add some delicious items to get started!
              </p>
              <Button variant="primary" onClick={onClose}>
                Browse Menu
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <Card key={`${item.id}-${JSON.stringify(item.customizations) || 'default'}`} className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* Item Image */}
                    <img
                      src={item.image || '/api/placeholder/60/60'}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>

                      {/* Customizations */}
                      {item.customizations && Object.keys(item.customizations).length > 0 && (
                        <div className="mt-1">
                          {Object.entries(item.customizations).map(([key, value], index) => (
                            <Badge key={index} variant="outline" size="xs" className="mr-1 mb-1">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Price and Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-vendorr-blue font-semibold">
                          {formatPrice(item.price)}
                        </div>

                        <div className="flex items-center space-x-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.customizations, Math.max(1, item.quantity - 1))}
                              className="p-1 hover:bg-gray-50 rounded-l-lg"
                              disabled={item.quantity <= 1}
                            >
                              <Icons.Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.customizations, item.quantity + 1)}
                              className="p-1 hover:bg-gray-50 rounded-r-lg"
                            >
                              <Icons.Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id, item.customizations)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Icons.X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right text-sm text-gray-500 mt-1">
                        Total: {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Section */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            {/* Order Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                <span>Total</span>
                <span className="text-vendorr-blue">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Cart Actions */}
            <div className="space-y-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleCheckout}
                disabled={cart.length === 0}
              >
                <Icons.CreditCard className="w-5 h-5 mr-2" />
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleViewCart}
                disabled={cart.length === 0}
              >
                View Full Cart
              </Button>

              {/* Continue Shopping */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={onClose}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
