import React, { useState } from 'react'
import {
  Navbar,
  MenuItemCard,
  Cart,
  OrderStatus,
  CustomizationModal,
  PageContainer,
  ContentContainer,
  Grid,
  SectionHeader
} from '../components'

// Sample data for testing components
const sampleMenuItem = {
  id: 1,
  name: "Grilled Chicken Burger",
  description: "Juicy grilled chicken breast with lettuce, tomato, and our special sauce on a brioche bun",
  price: 89.99,
  original_price: 99.99,
  image_url: "/assets/placeholder-food.jpg",
  is_available: true,
  is_special: true,
  is_vegetarian: false,
  is_vegan: false,
  is_halal: true,
  spice_level: 1,
  prep_time: 15,
  allergens: ["gluten", "eggs"],
  customizable: true
}

const sampleCartItems = [
  {
    id: 1,
    name: "Grilled Chicken Burger",
    price: 89.99,
    quantity: 2,
    image_url: "/assets/placeholder-food.jpg",
    customizations: ["Extra cheese", "No onions"]
  },
  {
    id: 2,
    name: "Classic Beef Burger",
    price: 79.99,
    quantity: 1,
    image_url: "/assets/placeholder-food.jpg",
    customizations: []
  }
]

const sampleOrder = {
  id: "ORD-001",
  status: "preparing",
  payment_status: "confirmed",
  total_amount: 259.97,
  subtotal: 225.97,
  tax_amount: 33.90,
  created_at: new Date().toISOString(),
  estimated_prep_time: 20,
  customer_notes: "Please make it extra crispy",
  items: [
    {
      quantity: 2,
      menu_item_name: "Grilled Chicken Burger",
      price: 89.99,
      customizations: ["Extra cheese", "No onions"]
    },
    {
      quantity: 1,
      menu_item_name: "Classic Beef Burger",
      price: 79.99,
      customizations: []
    }
  ]
}

const sampleCustomizationOptions = [
  {
    id: 1,
    name: "Cheese Selection",
    is_required: false,
    max_selections: 1,
    options: [
      { id: 1, name: "Cheddar", description: "Classic aged cheddar", price_modifier: 0 },
      { id: 2, name: "Swiss", description: "Mild Swiss cheese", price_modifier: 5 },
      { id: 3, name: "Blue Cheese", description: "Tangy blue cheese", price_modifier: 10 }
    ]
  },
  {
    id: 2,
    name: "Extra Toppings",
    is_required: false,
    max_selections: 3,
    options: [
      { id: 4, name: "Extra Bacon", description: "Crispy bacon strips", price_modifier: 15 },
      { id: 5, name: "Avocado", description: "Fresh sliced avocado", price_modifier: 20 },
      { id: 6, name: "Mushrooms", description: "Sautéed mushrooms", price_modifier: 10 }
    ]
  }
]

export default function ComponentDemo() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false)

  const handleAddToCart = (item, quantity) => {
    console.log('Adding to cart:', item, 'quantity:', quantity)
    // Mock add to cart functionality
  }

  const handleCustomize = (item) => {
    setIsCustomizationOpen(true)
  }

  const handleUpdateQuantity = (item, quantity) => {
    console.log('Updating quantity:', item, 'to:', quantity)
  }

  const handleRemoveItem = (item) => {
    console.log('Removing item:', item)
  }

  const handleCheckout = () => {
    console.log('Proceeding to checkout')
  }

  const handleTrackOrder = (orderId) => {
    console.log('Tracking order:', orderId)
  }

  return (
    <PageContainer>
      <Navbar />

      <ContentContainer className="py-8">
        {/* Components Demo Header */}
        <SectionHeader
          title="Vendorr Core Components Demo"
          subtitle="Testing all the fundamental UI components for the restaurant ordering system"
        />

        {/* Menu Item Card Demo */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Menu Item Card</h3>
          <Grid cols="lg:grid-cols-2 xl:grid-cols-3">
            <MenuItemCard
              item={sampleMenuItem}
              onAddToCart={handleAddToCart}
              onCustomize={handleCustomize}
            />
            <MenuItemCard
              item={{
                ...sampleMenuItem,
                id: 2,
                name: "Veggie Delight",
                is_vegetarian: true,
                is_vegan: true,
                is_halal: false,
                spice_level: 2,
                is_special: false,
                price: 69.99
              }}
              onAddToCart={handleAddToCart}
              onCustomize={handleCustomize}
            />
            <MenuItemCard
              item={{
                ...sampleMenuItem,
                id: 3,
                name: "Spicy Wings",
                spice_level: 3,
                is_available: false,
                customizable: false
              }}
              onAddToCart={handleAddToCart}
              onCustomize={handleCustomize}
            />
          </Grid>
        </div>

        {/* Order Status Demo */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h3>
          <Grid cols="lg:grid-cols-2">
            <OrderStatus
              order={sampleOrder}
              onTrackOrder={handleTrackOrder}
              showDetails={true}
            />
            <OrderStatus
              order={{
                ...sampleOrder,
                id: "ORD-002",
                status: "ready",
                payment_status: "confirmed"
              }}
              onTrackOrder={handleTrackOrder}
              showDetails={false}
            />
          </Grid>
        </div>

        {/* Action Buttons */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Interactive Demos</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-vendorr-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Open Cart Demo
            </button>
            <button
              onClick={() => setIsCustomizationOpen(true)}
              className="bg-vendorr-gold-500 text-vendorr-blue-500 px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
            >
              Open Customization Demo
            </button>
          </div>
        </div>

        {/* Component Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">✅ Core Components Complete</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="text-green-700">✓ Navbar</div>
            <div className="text-green-700">✓ MenuItemCard</div>
            <div className="text-green-700">✓ Cart</div>
            <div className="text-green-700">✓ OrderStatus</div>
            <div className="text-green-700">✓ CustomizationModal</div>
            <div className="text-green-700">✓ Layout Components</div>
          </div>
          <p className="text-green-700 mt-3">
            All core React components are implemented with Vendorr's blue/white/gold design system and are ready for integration into the main application.
          </p>
        </div>
      </ContentContainer>

      {/* Cart Modal */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={sampleCartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Customization Modal */}
      <CustomizationModal
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
        menuItem={sampleMenuItem}
        onAddToCart={handleAddToCart}
        customizationOptions={sampleCustomizationOptions}
      />
    </PageContainer>
  )
}
