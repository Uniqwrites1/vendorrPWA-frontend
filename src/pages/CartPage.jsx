import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { PageContainer, Section, ContentContainer } from '../components/Layout';
import { Card, Button, Typography } from '../design-system/components';
import { Icons } from '../design-system/icons';
import Navbar from '../components/Navbar';
import { formatPrice } from '../utils/currency';

const CartPage = () => {
  const navigate = useNavigate();
  const cartContext = useCart();

  if (!cartContext) {
    console.error('Cart context not available');
    return (
      <PageContainer>
        <Navbar />
        <Section className="min-h-screen bg-gray-50 py-8">
          <ContentContainer>
            <div className="text-center py-16">
              <Typography variant="h2" className="text-xl font-semibold text-red-600 mb-2">
                Error: Cart not available
              </Typography>
              <Typography variant="body1" className="text-gray-600 mb-8">
                There was an error loading the cart. Please refresh the page.
              </Typography>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>
          </ContentContainer>
        </Section>
      </PageContainer>
    );
  }

  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = cartContext;
  const [isLoading, setIsLoading] = useState(false);

  console.log('CartPage rendered, cart:', cart);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsLoading(true);
    try {
      // Navigate to checkout page
      navigate('/checkout');
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // formatPrice is now imported from '../utils/currency'

  if (cart.length === 0) {
    return (
      <PageContainer>
        <Navbar />
        <Section className="min-h-screen bg-gray-50 py-8">
          <ContentContainer>
            {/* Header */}
            <div className="flex items-center mb-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-vendorr-blue hover:text-vendorr-blue-dark transition-colors mr-4"
              >
                <Icons.ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <Typography variant="h1" className="text-2xl font-bold text-gray-900">
                Your Cart
              </Typography>
            </div>

            {/* Empty Cart */}
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 rounded-full p-6">
                  <Icons.ShoppingCart className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              <Typography variant="h2" className="text-xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </Typography>
              <Typography variant="body1" className="text-gray-600 mb-8">
                Add some delicious items from our menu to get started
              </Typography>
              <Button
                variant="primary"
                onClick={() => navigate('/menu')}
                className="inline-flex items-center"
              >
                <Icons.Search className="w-5 h-5 mr-2" />
                Browse Menu
              </Button>
            </div>
          </ContentContainer>
        </Section>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Navbar />
      <Section className="min-h-screen bg-gray-50 py-8">
        <ContentContainer>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-vendorr-blue hover:text-vendorr-blue-dark transition-colors mr-4"
              >
                <Icons.ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <Typography variant="h1" className="text-2xl font-bold text-gray-900">
                Your Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </Typography>
            </div>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={`${item.id}-${JSON.stringify(item.customizations)}`} className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.image || '/assets/placeholder-food.svg'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/assets/placeholder-food.svg'
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Typography variant="h3" className="font-semibold text-gray-900 mb-1">
                            {item.name}
                          </Typography>
                          <Typography variant="body2" className="text-gray-600 mb-2">
                            {formatPrice(item.price)}
                          </Typography>
                          {item.customizations && Object.keys(item.customizations).length > 0 && (
                            <div className="mb-3">
                              <Typography variant="body2" className="text-gray-700 font-medium mb-1">
                                Customizations:
                              </Typography>
                              {Object.entries(item.customizations).map(([key, value]) => (
                                <Typography key={key} variant="body2" className="text-gray-600 text-sm">
                                  {key}: {value}
                                </Typography>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.customizations)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Icons.X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.customizations, Math.max(0, item.quantity - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Icons.Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.customizations, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Icons.Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <Typography variant="body1" className="font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <Typography variant="h3" className="font-semibold text-gray-900 mb-4">
                  Order Summary
                </Typography>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatPrice(getCartTotal() * 0.08)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">{formatPrice(2.99)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(getCartTotal() + (getCartTotal() * 0.08) + 2.99)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={handleCheckout}
                  disabled={isLoading || cart.length === 0}
                  className="w-full"
                >
                  {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                </Button>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center text-sm text-gray-600">
                    <Icons.Clock className="w-4 h-4 mr-2" />
                    Estimated delivery: 25-35 minutes
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </ContentContainer>
      </Section>
    </PageContainer>
  );
};

export default CartPage;
