import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Navbar,
  PageContainer,
  ContentContainer,
  Section
} from '../components'
import {
  Button,
  Card,
  Typography,
  Badge
} from '../design-system/components'
import { Icons } from '../design-system/icons'
import { useCart } from '../context/CartContext'
import { orders as ordersAPI } from '../services/api'

// Static bank details for display
const BANK_DETAILS = {
  accountName: 'Vendorr Restaurant',
  bank: 'First National Bank (FNB)',
  accountNumber: '62 1234 5678 90',
  branchCode: '250655'
}

export default function OrderConfirmationPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { clearCart } = useCart()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load order data from location state or fetch from API
  useEffect(() => {
    const loadOrder = async () => {
      try {
        // First try to get order from navigation state
        if (location.state?.order) {
          setOrder(location.state.order)
          setLoading(false)
          return
        }

        // If not in state, fetch from API
        const response = await ordersAPI.getOrder(orderId)
        setOrder(response.data)
      } catch (error) {
        console.error('Error loading order:', error)
        // Fallback to mock order if API fails
        const mockOrder = {
          id: orderId || 'VEN-' + Date.now(),
          order_number: 'ORD' + Date.now().toString().slice(-6),
          status: 'pending_payment',
          orderType: 'pickup',
          customer_name: 'Valued Customer',
          customer_phone: '+27 11 123 4567',
          customer_email: 'customer@example.com',
          items: [],
          subtotal: 0,
          total_amount: 0,
          tax_amount: 0,
          created_at: new Date().toISOString(),
          payment_method: 'bank_transfer'
        }
        setOrder(mockOrder)
      } finally {
        setLoading(false)
        // Clear cart after successful order
        clearCart()
      }
    }

    loadOrder()
  }, [orderId, location.state, clearCart])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price)
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending_payment': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'preparing': 'bg-orange-100 text-orange-800',
      'ready': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status) => {
    const texts = {
      'pending_payment': 'Pending Payment',
      'confirmed': 'Order Confirmed',
      'preparing': 'Being Prepared',
      'ready': 'Ready for Pickup',
      'completed': 'Completed'
    }
    return texts[status] || status
  }

  if (loading) {
    return (
      <PageContainer>
        <Navbar />
        <Section className="py-16">
          <ContentContainer>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendorr-blue-500 mx-auto mb-4"></div>
              <Typography variant="body1">Loading your order details...</Typography>
            </div>
          </ContentContainer>
        </Section>
      </PageContainer>
    )
  }

  if (!order) {
    return (
      <PageContainer>
        <Navbar />
        <Section className="py-16">
          <ContentContainer>
            <div className="text-center">
              <Icons.AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <Typography variant="h2" className="mb-4">Order Not Found</Typography>
              <Typography variant="body1" className="mb-8">
                We couldn't find the order you're looking for.
              </Typography>
              <Link to="/menu">
                <Button variant="primary">Continue Shopping</Button>
              </Link>
            </div>
          </ContentContainer>
        </Section>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Navbar />

      {/* Success Header */}
      <Section className="bg-green-50 py-12">
        <ContentContainer>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <Typography variant="h1" className="text-green-800 mb-2">
              Order Placed Successfully!
            </Typography>
            <Typography variant="body1" className="text-green-700 mb-4 text-lg">
              Your order #{order.id} has been received
            </Typography>
            <Badge className={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Badge>
          </div>
        </ContentContainer>
      </Section>

      {/* Payment Instructions */}
      <Section className="py-8">
        <ContentContainer>
          <Card className="mb-8">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Icons.CreditCard className="w-6 h-6 text-vendorr-blue-500 mr-3" />
                <Typography variant="h3">Payment Instructions</Typography>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <Icons.AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                                        <Typography variant="body1" className="text-yellow-800 font-medium">
                      Please complete your payment to confirm your order
                    </Typography>
                    <Typography variant="caption" className="text-yellow-700">
                      Your food will be prepared once payment is confirmed
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Typography variant="h4" className="mb-3">Bank Transfer Details</Typography>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Name:</span>
                      <span className="font-medium">{BANK_DETAILS.accountName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank:</span>
                      <span className="font-medium">{BANK_DETAILS.bank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Number:</span>
                      <span className="font-medium font-mono">{BANK_DETAILS.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Branch Code:</span>
                      <span className="font-medium font-mono">{BANK_DETAILS.branchCode}</span>
                    </div>
                                        <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Payment Reference:</span>
                      <span className="font-bold text-vendorr-blue-600">{order.payment_reference || order.bankDetails?.reference || order.order_number}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-vendorr-blue-600 border-t pt-2">
                      <span>Amount to Pay:</span>
                      <span>{formatPrice(order.total_amount || order.total)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Typography variant="h4" className="mb-3">What's Next?</Typography>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start mb-3">
                      <Icons.Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <Typography variant="body1" className="font-medium text-green-800">Payment Proof Received</Typography>
                        <Typography variant="caption" className="text-green-700">
                          We've received your payment proof from checkout
                        </Typography>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700 ml-7">
                      <p>• We'll verify your payment (usually within 5-10 minutes)</p>
                      <p>• Once confirmed, we'll start preparing your order</p>
                      <p>• Track your order status in real-time using the button below</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Order Summary */}
          <Card>
            <div className="p-6">
              <Typography variant="h3" className="mb-4">Order Summary</Typography>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Typography variant="h4" className="mb-3">Order Details</Typography>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Type:</span>
                      <span className="font-medium capitalize">{order.orderType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">{formatDateTime(order.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Time:</span>
                      <span className="font-medium">{order.estimatedTime}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Typography variant="h4" className="mb-3">Customer Information</Typography>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{order.customer_name || order.customerInfo?.name || 'Customer'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{order.customer_phone || order.customerInfo?.phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{order.customer_email || order.customerInfo?.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Typography variant="h4" className="mb-4">Order Items</Typography>
                <div className="space-y-3">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <div className="flex-1">
                          <Typography variant="body1" className="font-medium">
                            {item.menu_item?.name || item.name || 'Item'}
                          </Typography>
                          {item.customizations && Array.isArray(item.customizations) && item.customizations.length > 0 && (
                            <Typography variant="caption" className="text-gray-600">
                              {item.customizations.map(c => c.name).join(', ')}
                            </Typography>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-600">x{item.quantity}</span>
                          <span className="font-medium">
                            {formatPrice((item.unit_price || item.price) * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Typography variant="body2" className="text-gray-600 text-center py-4">
                      No items in this order
                    </Typography>
                  )}
                </div>

                <div className="border-t mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(order.total_amount || order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <Icons.Eye className="w-4 h-4 mr-2" />
              Track Order Status
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/orders')}
            >
              <Icons.List className="w-4 h-4 mr-2" />
              My Orders
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/menu')}
            >
              <Icons.ShoppingCart className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </ContentContainer>
      </Section>
    </PageContainer>
  )
}
