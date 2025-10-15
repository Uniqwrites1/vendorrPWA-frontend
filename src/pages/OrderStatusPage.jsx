import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { PageContainer, Section, ContentContainer } from '../components/Layout';
import { Card, Button, Typography } from '../design-system/components';
import { Icons } from '../design-system/icons';
import Navbar from '../components/Navbar';
import { orders as ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';

const OrderStatusPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      // Try to get order from location state first (coming from checkout)
      if (location.state?.order) {
        setOrder(location.state.order);
        setIsLoading(false);
        return;
      }

      // Otherwise, fetch from API
      try {
        setIsLoading(true);
        const response = await ordersAPI.getOrder(orderId);
        setOrder(response.data);
        setError(null);
      } catch (err) {
        console.error('Error loading order:', err);
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();

    // Set up polling for real-time updates every 30 seconds
    const pollInterval = setInterval(async () => {
      if (isAuthenticated && orderId) {
        try {
          const response = await ordersAPI.getOrder(orderId);
          setOrder(response.data);
        } catch (err) {
          console.error('Error refreshing order:', err);
        }
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }, [orderId, location.state, isAuthenticated, navigate]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-ZA', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending_payment':
        return {
          icon: Icons.CreditCard,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          title: 'Pending Payment',
          description: 'Please complete your payment to confirm your order'
        };
      case 'payment_confirmed':
        return {
          icon: Icons.Check,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          title: 'Payment Confirmed',
          description: 'Your payment has been confirmed! We will start preparing your order soon.'
        };
      case 'preparing':
        return {
          icon: Icons.ChefHat,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          title: 'Preparing',
          description: 'Our chefs are preparing your delicious meal'
        };
      case 'almost_ready':
        return {
          icon: Icons.Clock,
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          title: 'Almost Ready',
          description: 'Your order is almost ready! Just finishing up...'
        };
      case 'ready_for_pickup':
        return {
          icon: Icons.ShoppingBag,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          title: 'Ready for Pickup',
          description: 'Your order is ready and waiting for pickup!'
        };
      case 'completed':
        return {
          icon: Icons.Check,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          title: 'Completed',
          description: 'Your order has been successfully completed. Thank you!'
        };
      case 'cancelled':
        return {
          icon: Icons.X,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          title: 'Cancelled',
          description: 'This order has been cancelled'
        };
      default:
        return {
          icon: Icons.Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          title: 'Processing',
          description: 'Your order is being processed'
        };
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Section className="min-h-screen bg-gray-50 py-8">
          <ContentContainer>
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendorr-blue mx-auto"></div>
              <Typography variant="body1" className="mt-4 text-gray-600">
                Loading order details...
              </Typography>
            </div>
          </ContentContainer>
        </Section>
      </PageContainer>
    );
  }

  if (!order) {
    return (
      <PageContainer>
        <Section className="min-h-screen bg-gray-50 py-8">
          <ContentContainer>
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 rounded-full p-6">
                  <Icons.X className="w-16 h-16 text-red-600" />
                </div>
              </div>
              <Typography variant="h2" className="text-xl font-semibold text-gray-900 mb-2">
                Order Not Found
              </Typography>
              <Typography variant="body1" className="text-gray-600 mb-8">
                We couldn't find an order with ID: {orderId}
              </Typography>
              <Button
                variant="primary"
                onClick={() => navigate('/orders')}
              >
                View All Orders
              </Button>
            </div>
          </ContentContainer>
        </Section>
      </PageContainer>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <PageContainer>
      <Navbar />
      <Section className="min-h-screen bg-gray-50 py-8">
        <ContentContainer>
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center text-vendorr-blue hover:text-vendorr-blue-dark transition-colors mr-4"
            >
              <Icons.ArrowLeft className="w-5 h-5 mr-2" />
              Back to Orders
            </button>
            <Typography variant="h1" className="text-2xl font-bold text-gray-900">
              Order #{order.id}
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Status */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              <Card className="p-6">
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-full ${statusInfo.bgColor} mr-4`}>
                    <StatusIcon className={`w-8 h-8 ${statusInfo.color}`} />
                  </div>
                  <div>
                    <Typography variant="h3" className="text-xl font-semibold text-gray-900">
                      {statusInfo.title}
                    </Typography>
                    <Typography variant="body1" className="text-gray-600">
                      {statusInfo.description}
                    </Typography>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Icons.Clock className="w-5 h-5 text-blue-600 mr-2" />
                      <Typography variant="body1" className="text-blue-800">
                        {order.status === 'completed'
                          ? `Completed: ${formatDateTime(order.updated_at)}`
                          : order.estimated_ready_time
                            ? `Estimated ready: ${formatDateTime(order.estimated_ready_time)}`
                            : 'We\'ll update you soon'}
                      </Typography>
                    </div>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => window.location.reload()}
                      className="text-blue-600"
                    >
                      <Icons.RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Customer Information */}
              <Card className="p-6">
                <Typography variant="h3" className="font-semibold text-gray-900 mb-4">
                  Customer Information
                </Typography>
                <div className="space-y-3">
                  <div>
                    <Typography variant="body2" className="text-gray-600 font-medium">
                      Name
                    </Typography>
                    <Typography variant="body1" className="text-gray-900">
                      {order.customer_name || `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim() || 'N/A'}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body2" className="text-gray-600 font-medium">
                      Phone
                    </Typography>
                    <Typography variant="body1" className="text-gray-900">
                      {order.customer_phone || order.customer?.phone || 'N/A'}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body2" className="text-gray-600 font-medium">
                      Email
                    </Typography>
                    <Typography variant="body1" className="text-gray-900">
                      {order.customer_email || order.customer?.email || 'N/A'}
                    </Typography>
                  </div>
                  {order.notes && (
                    <div>
                      <Typography variant="body2" className="text-gray-600 font-medium">
                        Special Instructions
                      </Typography>
                      <Typography variant="body1" className="text-gray-900">
                        {order.notes}
                      </Typography>
                    </div>
                  )}
                </div>
              </Card>

              {/* Order Items */}
              <Card className="p-6">
                <Typography variant="h3" className="font-semibold text-gray-900 mb-4">
                  Order Items
                </Typography>
                <div className="space-y-4">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => {
                      const itemName = item.menu_item?.name || item.name || 'Item';
                      const itemImage = item.menu_item?.image || item.image || '/placeholder-food.jpg';
                      const unitPrice = item.unit_price || item.price || 0;

                      return (
                        <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                          <img
                            src={itemImage}
                            alt={itemName}
                            className="w-15 h-15 object-cover rounded-lg"
                            onError={(e) => { e.target.src = '/placeholder-food.jpg'; }}
                          />
                          <div className="flex-1">
                            <Typography variant="body1" className="font-medium text-gray-900">
                              {itemName}
                            </Typography>
                            <Typography variant="body2" className="text-gray-600">
                              Quantity: {item.quantity}
                            </Typography>
                            {item.notes && (
                              <Typography variant="body2" className="text-gray-600 text-sm mt-1">
                                Note: {item.notes}
                              </Typography>
                            )}
                          </div>
                          <Typography variant="body1" className="font-medium text-gray-900">
                            {formatPrice(unitPrice * item.quantity)}
                          </Typography>
                        </div>
                      );
                    })
                  ) : (
                    <Typography variant="body2" className="text-gray-600 text-center py-4">
                      No items in this order
                    </Typography>
                  )}
                </div>
              </Card>
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
                    <span className="font-medium">{formatPrice(order.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatPrice(order.tax_amount || 0)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(order.total_amount || order.total || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order Number</span>
                    <span className="text-gray-900 font-mono">{order.order_number || `#${order.id}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order placed</span>
                    <span className="text-gray-900">{formatDateTime(order.created_at || order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment</span>
                    <span className="text-gray-900 capitalize">{order.payment_method || 'N/A'}</span>
                  </div>
                  {order.payment_status && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Status</span>
                      <span className="text-gray-900 capitalize">{order.payment_status}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/menu')}
                    className="w-full"
                  >
                    Order Again
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </ContentContainer>
      </Section>
    </PageContainer>
  );
};

export default OrderStatusPage;
