import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PageContainer, Section, ContentContainer } from '../components/Layout';
import { Card, Button, Typography } from '../design-system/components';
import { Icons } from '../design-system/icons';
import Navbar from '../components/Navbar';
import { orders as ordersAPI } from '../services/api';
import { formatPrice } from '../utils/currency';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated, token } = useAuth();

  const [orderInfo, setOrderInfo] = useState({
    orderType: 'pickup', // 'pickup' or 'dine-in'
    phone: '',
    specialInstructions: '',
    paymentMethod: 'bank-transfer',
    proofOfPayment: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // formatPrice is now imported from '../utils/currency'

  const validateForm = () => {
    const newErrors = {};

    if (!orderInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{11}$/.test(orderInfo.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 11-digit phone number';
    }

    if (!orderInfo.proofOfPayment) {
      newErrors.proofOfPayment = 'Proof of payment is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check authentication first
    if (!isAuthenticated || !user || !token) {
      setErrors({
        submit: 'You must be logged in to place an order. Please log in and try again.'
      });
      setTimeout(() => {
        navigate('/login', { state: { from: '/checkout' } });
      }, 2000);
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      let receiptUrl = null;

      // Upload receipt if provided
      if (orderInfo.proofOfPayment) {
        const formData = new FormData();
        formData.append('file', orderInfo.proofOfPayment);

        const uploadResponse = await ordersAPI.uploadReceipt(formData);
        receiptUrl = uploadResponse.data.file_url;
      }

      // Generate payment reference
      const paymentRef = `ORDER-${Date.now().toString().slice(-6)}`;

      // Prepare order data for API
      const orderData = {
        order_type: orderInfo.orderType,
        customer_phone: orderInfo.phone,
        special_instructions: orderInfo.specialInstructions,
        payment_method: 'bank_transfer',
        payment_reference: paymentRef,
        bank_transfer_receipt: receiptUrl,
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          customizations: item.customizations || {},
          special_instructions: item.special_instructions || ''
        }))
      };

      // Create order via API
      const response = await ordersAPI.createOrder(orderData);
      const order = response.data;

      // Clear cart
      clearCart();

      // Navigate to order confirmation
      navigate(`/order-confirmation/${order.id}`, { state: { order } });

    } catch (error) {
      console.error('Order placement error:', error);

      let errorMessage = 'Failed to place order. Please try again.';

      // Handle specific error types
      if (error.response) {
        const status = error.response.status;
        const detail = error.response.data?.detail;

        switch (status) {
          case 401:
            errorMessage = 'Your session has expired. Please log in again to place your order.';
            setTimeout(() => {
              navigate('/login', { state: { from: '/checkout' } });
            }, 2000);
            break;
          case 403:
            errorMessage = 'You are not authorized to place orders. Please log in with a valid customer account.';
            setTimeout(() => {
              navigate('/login', { state: { from: '/checkout' } });
            }, 2000);
            break;
          case 404:
            errorMessage = 'One or more items in your cart are no longer available. Please refresh and try again.';
            break;
          case 400:
            errorMessage = detail || 'Invalid order data. Please check your information and try again.';
            break;
          case 500:
            errorMessage = 'Server error occurred. Please try again later or contact support.';
            break;
          default:
            errorMessage = detail || 'Failed to place order. Please try again.';
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
      }

      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setOrderInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Navigate to cart if empty (use useEffect to avoid navigation during display)
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart.length, navigate]);

  if (cart.length === 0) {
    return null;
  }

  return (
    <PageContainer>
      <Navbar />
      <Section className="min-h-screen bg-gray-50 py-8">
        <ContentContainer>
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center text-vendorr-blue hover:text-vendorr-blue-dark transition-colors mr-4"
            >
              <Icons.ArrowLeft className="w-5 h-5 mr-2" />
              Back to Cart
            </button>
            <Typography variant="h1" className="text-2xl font-bold text-gray-900">
              Checkout
            </Typography>
          </div>

          {/* Authentication Status */}
          {!isAuthenticated || !user ? (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <Icons.AlertTriangle className="w-5 h-5 text-yellow-500 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Authentication Required</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    You must be logged in to place an order.
                    <button
                      onClick={() => navigate('/login', { state: { from: '/checkout' } })}
                      className="ml-1 underline hover:no-underline"
                    >
                      Click here to log in
                    </button>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <Icons.CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">Logged in as {user.email}</h4>
                  <p className="text-sm text-green-700">You can proceed with your order</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <Card className="p-6 mb-6">
                <Typography variant="h3" className="font-semibold text-gray-900 mb-6">
                  Order Information
                </Typography>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Order Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Order Type *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          orderInfo.orderType === 'pickup'
                            ? 'border-vendorr-blue-500 bg-vendorr-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => handleInputChange('orderType', 'pickup')}
                      >
                        <div className="flex items-center space-x-3">
                          <Icons.ShoppingCart className="w-5 h-5 text-vendorr-blue-500" />
                          <div>
                            <h4 className="font-medium text-gray-900">Pickup</h4>
                            <p className="text-sm text-gray-600">Collect your order from our store</p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          orderInfo.orderType === 'dine-in'
                            ? 'border-vendorr-blue-500 bg-vendorr-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => handleInputChange('orderType', 'dine-in')}
                      >
                        <div className="flex items-center space-x-3">
                          <Icons.User className="w-5 h-5 text-vendorr-blue-500" />
                          <div>
                            <h4 className="font-medium text-gray-900">Dine In</h4>
                            <p className="text-sm text-gray-600">Enjoy your meal at our restaurant</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={orderInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-vendorr-blue focus:border-vendorr-blue ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  {/* Extra Instructions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extra Instructions (Optional)
                    </label>
                    <textarea
                      value={orderInfo.specialInstructions}
                      onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                      placeholder="Any special instructions for your order..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendorr-blue focus:border-vendorr-blue"
                    />
                  </div>
                </form>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <Typography variant="h3" className="font-semibold text-gray-900 mb-6">
                  Payment Method
                </Typography>

                <div className="space-y-6">
                  {/* Bank Transfer choice */}
                  <div className="p-4 border-2 border-vendorr-blue-200 bg-vendorr-blue-50 rounded-lg">
                    <div className="flex items-center mb-4">
                      <input
                        type="radio"
                        id="bank-transfer"
                        name="payment"
                        value="bank-transfer"
                        checked={true}
                        readOnly
                        className="mr-3"
                      />
                      <label htmlFor="bank-transfer" className="flex items-center flex-1">
                        <Icons.CreditCard className="w-5 h-5 mr-3 text-vendorr-blue-600" />
                        <div>
                          <div className="font-medium text-vendorr-blue-900">Bank Transfer</div>
                          <div className="text-sm text-vendorr-blue-700">Transfer to our bank account and upload proof</div>
                        </div>
                      </label>
                    </div>

                    {/* Bank Details */}
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-900 mb-3">Bank Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bank Name:</span>
                          <span className="font-medium">Kuda Bank</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Name:</span>
                          <span className="font-medium">Uniqwrites Edtech Services-Vendorr</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Number:</span>
                          <span className="font-mono font-bold text-lg">3002871052</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reference:</span>
                          <span className="font-mono font-medium">ORDER-{Date.now().toString().slice(-6)}</span>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Important:</strong> Please use the reference number above when making your transfer.
                        </p>
                      </div>
                    </div>

                    {/* Proof of Payment Upload */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Proof of Payment
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-vendorr-blue-400 transition-colors">
                        <input
                          type="file"
                          id="proof-of-payment"
                          accept="image/*,.pdf"
                          onChange={(e) => handleInputChange('proofOfPayment', e.target.files[0])}
                          className="hidden"
                        />
                        <label htmlFor="proof-of-payment" className="cursor-pointer">
                          <Icons.Plus className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, PDF up to 10MB
                          </p>
                        </label>
                      </div>
                      {orderInfo.proofOfPayment && (
                        <p className="mt-2 text-sm text-green-600">
                          ✓ {orderInfo.proofOfPayment.name} uploaded
                        </p>
                      )}
                      {errors.proofOfPayment && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.proofOfPayment}
                        </p>
                      )}
                    </div>

                    {/* Instructions */}
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-2">Payment Instructions:</h5>
                      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Transfer the exact amount to the bank account above</li>
                        <li>Use the provided reference number</li>
                        <li>Upload your proof of payment (bank receipt/screenshot)</li>
                        <li>We'll verify payment and prepare your order</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <Typography variant="h3" className="font-semibold text-gray-900 mb-4">
                  Order Summary
                </Typography>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={`${item.id}-${JSON.stringify(item.customizations)}`} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-gray-600">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {errors.submit && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                      <Icons.AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-red-800 mb-1">Order Failed</h4>
                        <p className="text-sm text-red-600">{errors.submit}</p>
                        {(errors.submit.includes('log in') || errors.submit.includes('session') || errors.submit.includes('authorized')) && (
                          <p className="text-xs text-red-500 mt-2">
                            You will be redirected to the login page in a moment...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isLoading || !isAuthenticated || !user}
                  className="w-full"
                >
                  {isLoading ? 'Placing Order...' :
                   !isAuthenticated || !user ? 'Please Log In to Place Order' :
                   `Place Order - ${formatPrice(total)}`}
                </Button>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center text-sm text-gray-600">
                    <Icons.Clock className="w-4 h-4 mr-2" />
                    {orderInfo.orderType === 'pickup'
                      ? 'Estimated pickup time: 15-25 minutes'
                      : 'Your table will be ready upon arrival'
                    }
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

export default CheckoutPage;
