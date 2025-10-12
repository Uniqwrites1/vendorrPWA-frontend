import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Navbar,
  PageContainer,
  ContentContainer,
  Section,
  Grid
} from '../components'
import {
  Button,
  Card,
  Typography,
  Badge
} from '../design-system/components'
import { Icons } from '../design-system/icons'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    todayRevenue: 0,
    activeMenuItems: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock data - replace with actual API calls
  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalOrders: 156,
        pendingOrders: 8,
        todayRevenue: 4250.75,
        activeMenuItems: 24
      })

      setRecentOrders([
        {
          id: 'VEN-001',
          customer: 'John Doe',
          items: 3,
          total: 125.50,
          status: 'preparing',
          orderType: 'pickup',
          time: '2 mins ago'
        },
        {
          id: 'VEN-002',
          customer: 'Jane Smith',
          items: 2,
          total: 89.99,
          status: 'ready',
          orderType: 'dine-in',
          time: '5 mins ago'
        },
        {
          id: 'VEN-003',
          customer: 'Mike Johnson',
          items: 1,
          total: 45.00,
          status: 'pending_payment',
          orderType: 'pickup',
          time: '8 mins ago'
        },
        {
          id: 'VEN-004',
          customer: 'Sarah Wilson',
          items: 4,
          total: 198.75,
          status: 'confirmed',
          orderType: 'dine-in',
          time: '12 mins ago'
        }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price)
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

  const quickActions = [
    {
      title: 'View All Orders',
      description: 'Manage and track all customer orders',
      icon: Icons.ShoppingCart,
      link: '/admin/orders',
      color: 'bg-blue-500'
    },
    {
      title: 'Menu Management',
      description: 'Add, edit, or remove menu items',
      icon: Icons.List,
      link: '/admin/menu',
      color: 'bg-green-500'
    },
    {
      title: 'Settings',
      description: 'Configure WhatsApp and other app settings',
      icon: Icons.Settings,
      link: '/admin/settings',
      color: 'bg-gray-500'
    },
    {
      title: 'Customer Management',
      description: 'View customer information and history',
      icon: Icons.User,
      link: '/admin/customers',
      color: 'bg-purple-500'
    },
    {
      title: 'Reports & Analytics',
      description: 'View sales reports and analytics',
      icon: Icons.BarChart,
      link: '/admin/reports',
      color: 'bg-orange-500'
    }
  ]

  if (loading) {
    return (
      <PageContainer>
        <Navbar />
        <Section className="py-16">
          <ContentContainer>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendorr-blue-500 mx-auto mb-4"></div>
              <Typography.Body>Loading dashboard...</Typography.Body>
            </div>
          </ContentContainer>
        </Section>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Navbar />

      {/* Dashboard Header */}
      <Section className="bg-vendorr-blue-500 text-white py-12">
        <ContentContainer>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <Typography.H1 className="text-white mb-2">
                Admin Dashboard
              </Typography.H1>
              <Typography.Lead className="text-blue-100">
                Welcome back! Here's what's happening at your restaurant today.
              </Typography.Lead>
            </div>
            <div className="mt-4 md:mt-0">
              <Typography.Body className="text-blue-100">
                {new Date().toLocaleDateString('en-ZA', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography.Body>
            </div>
          </div>
        </ContentContainer>
      </Section>

      {/* Statistics Cards */}
      <Section className="py-8">
        <ContentContainer>
          <Grid cols="md:grid-cols-2 lg:grid-cols-4" gap="gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography.Small className="text-gray-600 uppercase tracking-wide">
                    Total Orders Today
                  </Typography.Small>
                  <Typography.H2 className="text-vendorr-blue-500 mt-1">
                    {stats.totalOrders}
                  </Typography.H2>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Icons.ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography.Small className="text-gray-600 uppercase tracking-wide">
                    Pending Orders
                  </Typography.Small>
                  <Typography.H2 className="text-orange-500 mt-1">
                    {stats.pendingOrders}
                  </Typography.H2>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Icons.Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography.Small className="text-gray-600 uppercase tracking-wide">
                    Today's Revenue
                  </Typography.Small>
                  <Typography.H2 className="text-green-500 mt-1">
                    {formatPrice(stats.todayRevenue)}
                  </Typography.H2>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Icons.CreditCard className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography.Small className="text-gray-600 uppercase tracking-wide">
                    Active Menu Items
                  </Typography.Small>
                  <Typography.H2 className="text-purple-500 mt-1">
                    {stats.activeMenuItems}
                  </Typography.H2>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Icons.List className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </Grid>
        </ContentContainer>
      </Section>

      {/* Quick Actions */}
      <Section className="py-8">
        <ContentContainer>
          <Typography.H2 className="mb-6">Quick Actions</Typography.H2>
          <Grid cols="md:grid-cols-2 lg:grid-cols-4" gap="gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <Card className="p-6 hover:shadow-lg transition-shadow group cursor-pointer">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 ${action.color} rounded-full mr-4`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <Typography.H4 className="group-hover:text-vendorr-blue-500 transition-colors">
                      {action.title}
                    </Typography.H4>
                  </div>
                  <Typography.Body className="text-gray-600">
                    {action.description}
                  </Typography.Body>
                </Card>
              </Link>
            ))}
          </Grid>
        </ContentContainer>
      </Section>

      {/* Recent Orders */}
      <Section className="py-8">
        <ContentContainer>
          <div className="flex items-center justify-between mb-6">
            <Typography.H2>Recent Orders</Typography.H2>
            <Link to="/admin/orders">
              <Button variant="outline">
                View All Orders
                <Icons.ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Typography.Body className="font-medium text-vendorr-blue-500">
                          {order.id}
                        </Typography.Body>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Typography.Body>{order.customer}</Typography.Body>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Typography.Body>{order.items} items</Typography.Body>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Typography.Body className="font-medium">
                          {formatPrice(order.total)}
                        </Typography.Body>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Typography.Body className="capitalize">
                          {order.orderType}
                        </Typography.Body>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Typography.Small className="text-gray-600">
                          {order.time}
                        </Typography.Small>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Link to={`/admin/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              <Icons.Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <Icons.Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </ContentContainer>
      </Section>
    </PageContainer>
  )
}
