import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

export default function AdminOrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data - replace with actual API calls
  useEffect(() => {
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'VEN-001',
          customer: {
            name: 'John Doe',
            phone: '+27 11 123 4567',
            email: 'john@example.com'
          },
          items: [
            { name: 'Grilled Chicken Burger', quantity: 2, price: 89.99 },
            { name: 'Crispy Fries', quantity: 1, price: 34.99 }
          ],
          total: 214.97,
          status: 'preparing',
          orderType: 'pickup',
          paymentStatus: 'paid',
          createdAt: '2024-01-15T14:30:00Z',
          estimatedTime: '15-20 minutes'
        },
        {
          id: 'VEN-002',
          customer: {
            name: 'Jane Smith',
            phone: '+27 11 234 5678',
            email: 'jane@example.com'
          },
          items: [
            { name: 'Beef Wrap', quantity: 1, price: 75.99 },
            { name: 'Soft Drink', quantity: 1, price: 14.00 }
          ],
          total: 89.99,
          status: 'ready',
          orderType: 'dine-in',
          paymentStatus: 'paid',
          createdAt: '2024-01-15T14:25:00Z',
          estimatedTime: '10-15 minutes'
        },
        {
          id: 'VEN-003',
          customer: {
            name: 'Mike Johnson',
            phone: '+27 11 345 6789',
            email: 'mike@example.com'
          },
          items: [
            { name: 'Caesar Salad', quantity: 1, price: 45.00 }
          ],
          total: 45.00,
          status: 'pending_payment',
          orderType: 'pickup',
          paymentStatus: 'pending',
          createdAt: '2024-01-15T14:20:00Z',
          estimatedTime: '10-15 minutes'
        },
        {
          id: 'VEN-004',
          customer: {
            name: 'Sarah Wilson',
            phone: '+27 11 456 7890',
            email: 'sarah@example.com'
          },
          items: [
            { name: 'Fish & Chips', quantity: 2, price: 95.99 },
            { name: 'Onion Rings', quantity: 1, price: 27.99 }
          ],
          total: 219.97,
          status: 'confirmed',
          orderType: 'dine-in',
          paymentStatus: 'paid',
          createdAt: '2024-01-15T14:15:00Z',
          estimatedTime: '20-25 minutes'
        },
        {
          id: 'VEN-005',
          customer: {
            name: 'David Brown',
            phone: '+27 11 567 8901',
            email: 'david@example.com'
          },
          items: [
            { name: 'Chicken Wings', quantity: 1, price: 68.99 }
          ],
          total: 68.99,
          status: 'completed',
          orderType: 'pickup',
          paymentStatus: 'paid',
          createdAt: '2024-01-15T13:45:00Z',
          estimatedTime: '15-20 minutes'
        }
      ]
      setOrders(mockOrders)
      setLoading(false)
    }, 1000)
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price)
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-ZA', {
      month: 'short',
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

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus }
        : order
    ))
  }

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery)

    return matchesFilter && matchesSearch
  })

  const filterOptions = [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'pending_payment', label: 'Pending Payment', count: orders.filter(o => o.status === 'pending_payment').length },
    { value: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length },
    { value: 'preparing', label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
    { value: 'ready', label: 'Ready', count: orders.filter(o => o.status === 'ready').length },
    { value: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length }
  ]

  if (loading) {
    return (
      <PageContainer>
        <Navbar />
        <Section className="py-16">
          <ContentContainer>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendorr-blue-500 mx-auto mb-4"></div>
              <Typography.Body>Loading orders...</Typography.Body>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                className="mb-4"
              >
                <Icons.ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Typography.H1>Order Management</Typography.H1>
              <Typography.Body className="text-gray-600 mt-2">
                Manage and track all customer orders
              </Typography.Body>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="primary">
                <Icons.Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
            </div>
          </div>
        </ContentContainer>
      </Section>

      {/* Filters and Search */}
      <Section className="py-6">
        <ContentContainer>
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Status Filters */}
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === option.value
                        ? 'bg-vendorr-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label} ({option.count})
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendorr-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </Card>
        </ContentContainer>
      </Section>

      {/* Orders Table */}
      <Section className="pb-8">
        <ContentContainer>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items & Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <Typography.Body className="font-medium text-vendorr-blue-500">
                            {order.id}
                          </Typography.Body>
                          <Typography.Small className="text-gray-600">
                            {formatDateTime(order.createdAt)}
                          </Typography.Small>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <Typography.Body className="font-medium">
                            {order.customer.name}
                          </Typography.Body>
                          <Typography.Small className="text-gray-600">
                            {order.customer.phone}
                          </Typography.Small>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <Typography.Body className="font-medium">
                            {formatPrice(order.total)}
                          </Typography.Body>
                          <Typography.Small className="text-gray-600">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </Typography.Small>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <Typography.Body className="capitalize">
                            {order.orderType}
                          </Typography.Body>
                          <Typography.Small className="text-gray-600">
                            {order.estimatedTime}
                          </Typography.Small>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-vendorr-blue-500 focus:border-transparent"
                        >
                          <option value="pending_payment">Pending Payment</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Link to={`/admin/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              <Icons.Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.print()}
                          >
                            <Icons.Printer className="w-4 h-4 mr-1" />
                            Print
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Icons.ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <Typography.Body className="text-gray-600">
                  No orders found matching your criteria
                </Typography.Body>
              </div>
            )}
          </Card>
        </ContentContainer>
      </Section>
    </PageContainer>
  )
}
