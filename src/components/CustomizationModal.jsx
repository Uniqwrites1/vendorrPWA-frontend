import React, { useState, useEffect } from 'react'
import { Button, Badge } from '../design-system/components'
import { Icons } from '../design-system/icons'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/currency'

export default function CustomizationModal({
  isOpen,
  onClose,
  menuItem,
  item, // Alternative prop name from MenuPage
  customizationOptions = []
}) {
  const { addToCart } = useCart()
  const [selectedCustomizations, setSelectedCustomizations] = useState({})
  const [extraInstructions, setExtraInstructions] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Use either menuItem or item prop
  const currentItem = menuItem || item

  // Don't display if no item is provided
  if (!currentItem) {
    console.warn('CustomizationModal: No item provided')
    return null
  }

  // Reset state when modal opens/closes or item changes
  useEffect(() => {
    if (isOpen && currentItem) {
      setSelectedCustomizations({})
      setExtraInstructions('')
      setQuantity(1)
      calculateTotalPrice(currentItem.price, {}, 1)
    }
  }, [isOpen, currentItem])

  // Calculate total price with customizations
  const calculateTotalPrice = (basePrice, customizations, qty) => {
    let customizationTotal = 0

    Object.values(customizations).forEach(group => {
      if (Array.isArray(group)) {
        group.forEach(option => {
          customizationTotal += option.price_modifier || 0
        })
      } else if (group) {
        customizationTotal += group.price_modifier || 0
      }
    })

    setTotalPrice((basePrice + customizationTotal) * qty)
  }

  const handleCustomizationChange = (groupId, option, isMultiSelect = false) => {
    setSelectedCustomizations(prev => {
      const newCustomizations = { ...prev }

      if (isMultiSelect) {
        if (!newCustomizations[groupId]) {
          newCustomizations[groupId] = []
        }

        const existingIndex = newCustomizations[groupId].findIndex(
          item => item.id === option.id
        )

        if (existingIndex >= 0) {
          newCustomizations[groupId].splice(existingIndex, 1)
        } else {
          newCustomizations[groupId].push(option)
        }

        if (newCustomizations[groupId].length === 0) {
          delete newCustomizations[groupId]
        }
      } else {
        if (newCustomizations[groupId]?.id === option.id) {
          delete newCustomizations[groupId]
        } else {
          newCustomizations[groupId] = option
        }
      }

      calculateTotalPrice(currentItem.price, newCustomizations, quantity)
      return newCustomizations
    })
  }

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity)
    calculateTotalPrice(currentItem.price, selectedCustomizations, newQuantity)
  }

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      // Prepare customizations object for cart
      const customizations = {
        ...selectedCustomizations,
        ...(extraInstructions && { instructions: extraInstructions })
      }

      addToCart(currentItem, customizations, quantity)
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !currentItem) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">
              Customize {currentItem?.name || 'Item'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Base price: {formatPrice(currentItem?.price || 0)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icons.Close className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Item Image and Description */}
          <div className="flex space-x-4 mb-6">
            <img
              src={currentItem.image || '/api/placeholder/80/80'}
              alt={currentItem.name}
              className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">{currentItem.name}</h3>
              <p className="text-sm text-gray-600">{currentItem.description}</p>

              {/* Item Badges */}
              <div className="flex flex-wrap gap-1 mt-2">
                {currentItem.is_vegetarian && (
                  <Badge variant="success" size="xs">Vegetarian</Badge>
                )}
                {currentItem.is_vegan && (
                  <Badge variant="success" size="xs">Vegan</Badge>
                )}
                {currentItem.is_halal && (
                  <Badge variant="info" size="xs">Halal</Badge>
                )}
                {currentItem.spice_level > 0 && (
                  <Badge variant="warning" size="xs">
                    Spice Level: {currentItem.spice_level}/3
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Customization Options */}
          {customizationOptions.map((group) => (
            <div key={group.id} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{group.name}</h4>
                <div className="flex items-center space-x-2">
                  {group.is_required && (
                    <Badge variant="error" size="xs">Required</Badge>
                  )}
                  {group.max_selections > 1 && (
                    <span className="text-xs text-gray-500">
                      Max {group.max_selections}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {group.options.map((option) => {
                  const isSelected = group.max_selections > 1
                    ? selectedCustomizations[group.id]?.some(item => item.id === option.id)
                    : selectedCustomizations[group.id]?.id === option.id

                  const isDisabled = group.max_selections > 1 &&
                    selectedCustomizations[group.id]?.length >= group.max_selections &&
                    !isSelected

                  return (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-vendorr-blue bg-blue-50'
                          : isDisabled
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center flex-1">
                        <input
                          type={group.max_selections > 1 ? 'checkbox' : 'radio'}
                          name={`customization-${group.id}`}
                          checked={isSelected}
                          disabled={isDisabled}
                          onChange={() => handleCustomizationChange(
                            group.id,
                            option,
                            group.max_selections > 1
                          )}
                          className="mr-3 text-vendorr-blue focus:ring-vendorr-blue"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {option.name}
                          </div>
                          {option.description && (
                            <div className="text-sm text-gray-500">
                              {option.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {option.price_modifier > 0 && `+${formatPrice(option.price_modifier)}`}
                        {option.price_modifier < 0 && formatPrice(option.price_modifier)}
                        {option.price_modifier === 0 && 'Free'}
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Custom Instructions */}
          <div className="mb-6">
            <label className="block font-medium text-gray-900 mb-2">
              Custom Instructions (Optional)
            </label>
            <textarea
              value={extraInstructions}
              onChange={(e) => setExtraInstructions(e.target.value)}
              placeholder="Any special requests or dietary requirements..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendorr-blue focus:border-transparent resize-none"
              maxLength={200}
            />
            <div className="text-xs text-gray-500 mt-1">
              {extraInstructions.length}/200 characters
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          {/* Quantity and Price */}
          <div className="flex items-center justify-between mb-4">
            {/* Quantity Selector */}
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-900">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-50 rounded-l-lg"
                  disabled={quantity <= 1}
                >
                  <Icons.Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="p-2 hover:bg-gray-50 rounded-r-lg"
                >
                  <Icons.Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="text-right">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-xl font-bold text-vendorr-blue">
                {formatPrice(totalPrice)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Icons.Plus className="w-5 h-5 mr-2" />
                  Add to Cart - {formatPrice(totalPrice)}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
