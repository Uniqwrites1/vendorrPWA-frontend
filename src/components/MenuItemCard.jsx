import React, { useState } from 'react'
import { Card, Badge, Button } from '../design-system/components'
import { Icons } from '../design-system/icons'
import { useCart } from '../context/CartContext'

export default function MenuItemCard({
  item,
  onClick, // Click handler for opening customization modal
  showCustomization = true,
  className = ''
}) {
  const { addToCart, isInCart, getCartItemQuantity } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const inCart = isInCart(item.id)
  const cartQuantity = getCartItemQuantity(item.id)

  const handleAddToCart = async (e) => {
    e?.stopPropagation() // Prevent card click when clicking add to cart
    setIsLoading(true)
    try {
      console.log('Adding to cart:', { item, quantity })
      console.log('Cart context available:', !!addToCart)
      addToCart(item, {}, quantity)
      console.log('Item added to cart successfully')
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCustomize = (e) => {
    e?.stopPropagation() // Prevent card click when clicking customize
    if (onClick) {
      onClick(item)
    }
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick(item)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getSpiceLevel = (level) => {
    const levels = {
      0: { label: 'Mild', color: 'bg-green-100 text-green-800' },
      1: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
      2: { label: 'Hot', color: 'bg-orange-100 text-orange-800' },
      3: { label: 'Very Hot', color: 'bg-red-100 text-red-800' }
    }
    return levels[level] || levels[0]
  }

  const spiceLevel = getSpiceLevel(item.spice_level || item.spiceLevel || 0)

  return (
    <Card
      className={`group hover:shadow-vendorr-md transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={item.image_url || item.image || '/assets/placeholder-food.svg'}
          alt={item.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/assets/placeholder-food.svg'
          }}
        />

        {/* Availability Overlay */}
        {!item.is_available && item.is_available !== undefined && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="error" size="lg">
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Featured Item Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {(item.is_special || item.popular) && (
            <Badge variant="gold" size="sm">
              <Icons.Star className="w-3 h-3 mr-1" />
              {item.popular ? 'Popular' : 'Featured'}
            </Badge>
          )}
          {(item.is_vegetarian || (item.dietary && item.dietary.includes('vegetarian'))) && (
            <Badge variant="success" size="sm">
              <Icons.Leaf className="w-3 h-3 mr-1" />
              Veg
            </Badge>
          )}
          {(item.is_vegan || (item.dietary && item.dietary.includes('vegan'))) && (
            <Badge variant="success" size="sm">
              <Icons.Leaf className="w-3 h-3 mr-1" />
              Vegan
            </Badge>
          )}
          {item.is_halal && (
            <Badge variant="info" size="sm">
              Halal
            </Badge>
          )}
        </div>

        {/* Spice Level */}
        {(item.spice_level > 0 || item.spiceLevel > 0) && (
          <div className="absolute top-2 right-2">
            <Badge variant="warning" size="sm" className={spiceLevel.color}>
              <Icons.Fire className="w-3 h-3 mr-1" />
              {spiceLevel.label}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {item.name}
          </h3>
          <div className="text-right ml-2">
            <div className="text-xl font-bold text-vendorr-blue">
              {formatPrice(item.price)}
            </div>
            {item.original_price && item.original_price > item.price && (
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(item.original_price)}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Rating and Reviews (for menu page format) */}
        {(item.rating || item.reviewCount) && (
          <div className="flex items-center mb-3">
            <Icons.Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-medium mr-1">{item.rating}</span>
            {item.reviewCount && (
              <span className="text-xs text-gray-500">({item.reviewCount} reviews)</span>
            )}
          </div>
        )}

        {/* Allergens */}
        {((item.allergens && item.allergens.length > 0)) && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-gray-500">Contains:</span>
              {item.allergens.map((allergen, index) => (
                <Badge key={index} variant="outline" size="xs">
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Preparation Time */}
        {(item.prep_time || item.prepTime) && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Icons.Clock className="w-4 h-4 mr-1" />
            {item.prep_time || item.prepTime} min prep time
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Quantity Selector */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              disabled={quantity <= 1 || !item.is_available}
            >
              <Icons.Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              disabled={!item.is_available}
            >
              <Icons.Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {showCustomization && item.customizable && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCustomize}
                disabled={!item.is_available}
              >
                <Icons.Settings className="w-4 h-4 mr-1" />
                Customize
              </Button>
            )}

            <Button
              variant={inCart ? "success" : "primary"}
              size="sm"
              onClick={handleAddToCart}
              disabled={!item.is_available || isLoading}
              className="relative"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                  Adding...
                </>
              ) : inCart ? (
                <>
                  <Icons.CheckCircle className="w-4 h-4 mr-1" />
                  In Cart ({cartQuantity})
                </>
              ) : (
                <>
                  <Icons.Plus className="w-4 h-4 mr-1" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
