import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
import { formatPrice } from '../utils/currency'

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')

  // Mock data - replace with actual API calls
  useEffect(() => {
    setTimeout(() => {
      const mockOrder = {
        id: orderId,
        customer: {
          name: 'John Doe',
          phone: '+27 11 123 4567',
          email: 'john@example.com'
        },
        items: [
          {
            id: 1,
            name: 'Grilled Chicken Burger',
            quantity: 2,
            unitPrice: 89.99,
            total: 179.98,
            customizations: ['No pickles', 'Extra sauce']
          },
          {
            id: 2,
            name: 'Crispy Fries',
            quantity: 1,
            unitPrice: 34.99,
            total: 34.99,
            customizations: []
          }
        ],
        subtotal: 214.97,
        tax: 0,
        total: 214.97,
        status: 'preparing',
        orderType: 'pickup',
        paymentStatus: 'paid',
        paymentMethod: 'Bank Transfer',
        paymentReference: 'PAY-VEN-001-2024',
        createdAt: '2024-01-15T14:30:00Z',
        estimatedTime: '15-20 minutes',
        specialInstructions: 'Please call when ready for pickup',
        orderHistory: [
          { status: 'pending_payment', timestamp: '2024-01-15T14:30:00Z', note: 'Order created' },
          { status: 'confirmed', timestamp: '2024-01-15T14:32:00Z', note: 'Payment confirmed via bank transfer' },
          { status: 'preparing', timestamp: '2024-01-15T14:35:00Z', note: 'Kitchen started preparation' }
        ]
      }
      setOrder(mockOrder)
      setLoading(false)
    }, 1000)
  }, [orderId])

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
      'confirmed': 'Confirmed',
      'preparing': 'Preparing',
      'ready': 'Ready',
      'completed': 'Completed'
    }
    return texts[status] || status
  }

  const updateOrderStatus = (newStatus) => {
    setOrder({
      ...order,
      status: newStatus,
      orderHistory: [
        ...order.orderHistory,
        {
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: notes || `Status updated to ${getStatusText(newStatus)}`
        }
      ]
    })
    setNotes('')
  }

  const addNote = () => {
    if (!notes.trim()) return

    setOrder({
      ...order,
      orderHistory: [
        ...order.orderHistory,
        {
          status: order.status,
          timestamp: new Date().toISOString(),
          note: notes
        }
      ]
    })
    setNotes('')
  }

  if (loading) {
    return (
      <PageContainer>
        <Navbar />
        <Section className="py-16">
          <ContentContainer>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendorr-blue-500 mx-auto mb-4"></div>
              <Typography.Body>Loading order details...</Typography.Body>
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
              <Icons.AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <Typography.H2>Order Not Found</Typography.H2>
              <Typography.Body className="text-gray-600 mb-6">
                The order with ID {orderId} could not be found.
              </Typography.Body>
              <Button onClick={() => navigate('/admin/orders')}>
                Back to Orders
              </Button>
            </div>
          </ContentContainer>
        </Section>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Navbar />

      {/* Header */}
      <Section className="bg-gray-50 py-8">
        <ContentContainer>
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/orders')}
            className="mb-4"
          >
            <Icons.ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <Typography.H1>Order #{order.id}</Typography.H1>
              <Typography.Body className="text-gray-600 mt-2">
                Placed on {formatDateTime(order.createdAt)}
              </Typography.Body>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Badge className={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Badge>
              <Button variant="outline" onClick={() => window.print()}>
                <Icons.Printer className="w-4 h-4 mr-2" />
                Print Order
              </Button>
            </div>
          </div>
        </ContentContainer>
      </Section>

      <Section className="py-8">
        <ContentContainer>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card className="p-6">
                <Typography.H3 className="mb-4">Customer Information</Typography.H3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Typography.Small className="text-gray-600">Name</Typography.Small>
                    <Typography.Body className="font-medium">{order.customer.name}</Typography.Body>
                  </div>
                  <div>
                    <Typography.Small className="text-gray-600">Phone</Typography.Small>
                    <Typography.Body className="font-medium">{order.customer.phone}</Typography.Body>
                  </div>
                  <div>
                    <Typography.Small className="text-gray-600">Email</Typography.Small>
                    <Typography.Body className="font-medium">{order.customer.email}</Typography.Body>
                  </div>
                  <div>
                    <Typography.Small className="text-gray-600">Order Type</Typography.Small>
                    <Typography.Body className="font-medium capitalize">{order.orderType}</Typography.Body>
                  </div>
                </div>

                {order.specialInstructions && (
                  <div className="mt-4">
                    <Typography.Small className="text-gray-600">Special Instructions</Typography.Small>
                    <Typography.Body className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      {order.specialInstructions}
                    </Typography.Body>
                  </div>
                )}
              </Card>

              {/* Order Items */}
              <Card className="p-6">
                <Typography.H3 className="mb-4">Order Items</Typography.H3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex-1">
                        <Typography.Body className="font-medium">{item.name}</Typography.Body>
                        <Typography.Small className="text-gray-600">
                          Quantity: {item.quantity} × {formatPrice(item.unitPrice)}
                        </Typography.Small>
                        {item.customizations.length > 0 && (
                          <div className="mt-1">
                            <Typography.Small className="text-gray-600">Customizations:</Typography.Small>
                            <ul className="list-disc list-inside ml-2">
                              {item.customizations.map((customization, index) => (
                                <Typography.Small key={index} className="text-gray-600">
                                  {customization}
                                </Typography.Small>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <Typography.Body className="font-medium">
                        {formatPrice(item.total)}
                      </Typography.Body>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Typography.Body>Subtotal</Typography.Body>
                      <Typography.Body>{formatPrice(order.subtotal)}</Typography.Body>
                    </div>
                    {order.tax > 0 && (
                      <div className="flex justify-between">
                        <Typography.Body>Tax</Typography.Body>
                        <Typography.Body>{formatPrice(order.tax)}</Typography.Body>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                      <Typography.Body>Total</Typography.Body>
                      <Typography.Body>{formatPrice(order.total)}</Typography.Body>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payment Information */}
              <Card className="p-6">
                <Typography.H3 className="mb-4">Payment Information</Typography.H3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Typography.Small className="text-gray-600">Payment Method</Typography.Small>
                    <Typography.Body className="font-medium">{order.paymentMethod}</Typography.Body>
                  </div>
                  <div>
                    <Typography.Small className="text-gray-600">Payment Status</Typography.Small>
                    <Badge className={order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="md:col-span-2">
                    <Typography.Small className="text-gray-600">Payment Reference</Typography.Small>
                    <Typography.Body className="font-medium">{order.paymentReference}</Typography.Body>
                  </div>
                </div>
              </Card>
            </div>

            {/* Order Management */}
            <div className="space-y-6">
              {/* Status Management */}
              <Card className="p-6">
                <Typography.H3 className="mb-4">Update Status</Typography.H3>

                <div className="space-y-4">
                  <div>
                    <Typography.Small className="text-gray-600 mb-2 block">Current Status</Typography.Small>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>

                  <div>
                    <Typography.Small className="text-gray-600 mb-2 block">Update to</Typography.Small>
                    <div className="space-y-2">
                      {order.status !== 'confirmed' && (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => updateOrderStatus('confirmed')}
                        >
                          Confirm Order
                        </Button>
                      )}
                      {order.status !== 'preparing' && (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => updateOrderStatus('preparing')}
                        >
                          Start Preparing
                        </Button>
                      )}
                      {order.status !== 'ready' && (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => updateOrderStatus('ready')}
                        >
                          Mark as Ready
                        </Button>
                      )}
                      {order.status !== 'completed' && (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => updateOrderStatus('completed')}
                        >
                          Complete Order
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Add Notes */}
              <Card className="p-6">
                <Typography.H3 className="mb-4">Add Note</Typography.H3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add a note about this order..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendorr-blue-500 focus:border-transparent resize-none"
                />
                <Button
                  variant="primary"
                  className="w-full mt-3"
                  onClick={addNote}
                  disabled={!notes.trim()}
                >
                  Add Note
                </Button>
              </Card>

              {/* Order History */}
              <Card className="p-6">
                <Typography.H3 className="mb-4">Order History</Typography.H3>
                <div className="space-y-3">
                  {order.orderHistory.map((entry, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-vendorr-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <Typography.Body className="font-medium text-sm">
                          {entry.note}
                        </Typography.Body>
                        <Typography.Small className="text-gray-600">
                          {formatDateTime(entry.timestamp)}
                        </Typography.Small>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </ContentContainer>
      </Section>
    </PageContainer>
  )
}
