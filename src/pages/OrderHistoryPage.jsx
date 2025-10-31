import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Section, ContentContainer } from '../components/Layout';
import { Card, Button, Typography } from '../design-system/components';
import { Icons } from '../design-system/icons';
import Navbar from '../components/Navbar';
import { orders as ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, delivered, active

  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        const response = await ordersAPI.getMyOrders();
        // Ensure response.data is an array
        const ordersData = Array.isArray(response.data) ? response.data : [];
        setOrders(ordersData);
      } catch (error) {
        console.error('Error loading orders:', error);
        // Fallback to localStorage for backward compatibility
        const savedOrders = JSON.parse(localStorage.getItem('vendorr-orders') || '[]');
        // Ensure savedOrders is an array
        const validOrders = Array.isArray(savedOrders) ? savedOrders : [];
        setOrders(validOrders);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, navigate]);



  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending_payment':
        return { color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Pending Payment' };
      case 'payment_confirmed':
        return { color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Payment Confirmed' };
      case 'preparing':
        return { color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Preparing' };
      case 'almost_ready':
        return { color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Almost Ready' };
      case 'ready_for_pickup':
        return { color: 'text-indigo-600', bgColor: 'bg-indigo-100', label: 'Ready for Pickup' };
      case 'completed':
        return { color: 'text-green-600', bgColor: 'bg-green-100', label: 'Completed' };
      case 'cancelled':
        return { color: 'text-red-600', bgColor: 'bg-red-100', label: 'Cancelled' };
      default:
        return { color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Processing' };
    }
  };

  // Safely filter orders, ensuring orders is an array
  const safeOrders = Array.isArray(orders) ? orders : [];
  const filteredOrders = safeOrders.filter(order => {
    if (filter === 'delivered') return order.status === 'delivered';
    if (filter === 'active') return order.status !== 'delivered';
    return true;
  });

  const reorderItems = (order) => {
    // Navigate to menu page with items to reorder
    navigate('/menu', { state: { reorderItems: order.items } });
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Section className="min-h-screen bg-gray-50 py-8">
          <ContentContainer>
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendorr-blue mx-auto"></div>
              <Typography variant="body1" className="mt-4 text-gray-600">
                Loading order history...
              </Typography>
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
                Order History
              </Typography>
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-vendorr-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'active'
                    ? 'bg-vendorr-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('delivered')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'delivered'
                    ? 'bg-vendorr-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Delivered
              </button>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 rounded-full p-6">
                  <Icons.ShoppingBag className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              <Typography variant="h2" className="text-xl font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
              </Typography>
              <Typography variant="body1" className="text-gray-600 mb-8">
                {filter === 'all'
                  ? "You haven't placed any orders yet. Start browsing our menu!"
                  : `You don't have any ${filter} orders at the moment.`
                }
              </Typography>
              <Button
                variant="primary"
                onClick={() => navigate('/menu')}
                className="inline-flex items-center"
              >
                <Icons.ChefHat className="w-5 h-5 mr-2" />
                Browse Menu
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <Card key={order.id} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <Typography variant="h3" className="font-semibold text-gray-900">
                            Order #{order.id}
                          </Typography>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${statusInfo.bgColor}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <Typography variant="body2" className="text-gray-600">
                          {formatDate(order.created_at || order.createdAt)} • {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                        </Typography>
                      </div>
                      <div className="text-right">
                        <Typography variant="h3" className="font-semibold text-gray-900">
                          {formatPrice(order.total_amount || order.total)}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600 capitalize">
                          {order.payment_method || order.orderInfo?.paymentMethod || 'Bank Transfer'}
                        </Typography>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                        {order.items && order.items.length > 0 ? (
                          <>
                            {order.items.slice(0, 3).map((item, index) => {
                              const itemName = item.menu_item?.name || item.name || 'Item';
                              const itemImage = item.menu_item?.image || item.image || '/placeholder-food.jpg';

                              return (
                                <div key={index} className="flex items-center space-x-2 flex-shrink-0">
                                  <img
                                    src={itemImage}
                                    alt={itemName}
                                    className="w-10 h-10 object-cover rounded"
                                    onError={(e) => { e.target.src = '/placeholder-food.jpg'; }}
                                  />
                                  <div className="min-w-0">
                                    <Typography variant="body2" className="text-gray-900 font-medium truncate">
                                      {itemName}
                                    </Typography>
                                    <Typography variant="body2" className="text-gray-600 text-sm">
                                      Qty: {item.quantity}
                                    </Typography>
                                  </div>
                                </div>
                              );
                            })}
                            {order.items.length > 3 && (
                              <Typography variant="body2" className="text-gray-600 flex-shrink-0">
                                +{order.items.length - 3} more
                              </Typography>
                            )}
                          </>
                        ) : (
                          <Typography variant="body2" className="text-gray-600">
                            No items
                          </Typography>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => reorderItems(order)}
                          className="inline-flex items-center"
                        >
                          <Icons.RotateCcw className="w-4 h-4 mr-1" />
                          Reorder
                        </Button>
                      </div>

                      {order.status === 'delivered' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement review modal or navigate to review page
                            window.dispatchEvent(new CustomEvent('showToast', {
                              detail: {
                                title: 'Coming Soon',
                                message: 'Review feature will be available soon!',
                                type: 'info'
                              }
                            }));
                          }}
                          className="text-vendorr-blue hover:text-vendorr-blue-dark inline-flex items-center"
                        >
                          <Icons.Star className="w-4 h-4 mr-1" />
                          Write Review
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {filteredOrders.length > 0 && (
            <div className="mt-8 text-center">
              <Typography variant="body2" className="text-gray-600">
                Showing {filteredOrders.length} of {safeOrders.length} orders
              </Typography>
            </div>
          )}
        </ContentContainer>
      </Section>
    </PageContainer>
  );
};

export default OrderHistoryPage;
