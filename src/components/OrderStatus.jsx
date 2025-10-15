import React from 'react'
import { Badge } from '../design-system/components'
import { Icons } from '../design-system/icons'
import { formatPrice } from '../utils/currency'

export default function OrderStatus({ order, onTrackOrder, showDetails = false }) {

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-ZA'),
      time: date.toLocaleTimeString('en-ZA', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getStatusConfig = (status) => {
    const configs = {
      'pending': {
        color: 'bg-yellow-100 text-yellow-800',
        icon: Icons.Clock,
        text: 'Order Received',
        description: 'Your order is being processed'
      },
      'confirmed': {
        color: 'bg-blue-100 text-blue-800',
        icon: Icons.CheckCircle,
        text: 'Confirmed',
        description: 'Order confirmed and in queue'
      },
      'preparing': {
        color: 'bg-orange-100 text-orange-800',
        icon: Icons.Fire,
        text: 'Preparing',
        description: 'Your food is being prepared'
      },
      'ready': {
        color: 'bg-green-100 text-green-800',
        icon: Icons.Bell,
        text: 'Ready for Pickup',
        description: 'Your order is ready!'
      },
      'completed': {
        color: 'bg-green-100 text-green-800',
        icon: Icons.CheckCircle2,
        text: 'Completed',
        description: 'Order completed successfully'
      },
      'cancelled': {
        color: 'bg-red-100 text-red-800',
        icon: Icons.X,
        text: 'Cancelled',
        description: 'Order has been cancelled'
      }
    }
    return configs[status] || configs['pending']
  }

  const getPaymentStatusConfig = (status) => {
    const configs = {
      'pending': {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Payment Pending'
      },
      'confirmed': {
        color: 'bg-green-100 text-green-800',
        text: 'Payment Confirmed'
      },
      'failed': {
        color: 'bg-red-100 text-red-800',
        text: 'Payment Failed'
      }
    }
    return configs[status] || configs['pending']
  }

  const statusConfig = getStatusConfig(order.status)
  const paymentConfig = getPaymentStatusConfig(order.payment_status)
  const StatusIcon = statusConfig.icon
  const { date, time } = formatDateTime(order.created_at)

  // Calculate estimated ready time
  const estimatedReadyTime = new Date(order.created_at)
  estimatedReadyTime.setMinutes(estimatedReadyTime.getMinutes() + (order.estimated_prep_time || 15))

  return (
    <div className="bg-white rounded-lg shadow-vendorr p-6 border border-gray-200">
      {/* Order Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Order #{order.id}
          </h3>
          <p className="text-sm text-gray-500">
            {date} at {time}
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-vendorr-blue">
            {formatPrice(order.total_amount)}
          </div>
          <Badge className={paymentConfig.color} size="sm">
            {paymentConfig.text}
          </Badge>
        </div>
      </div>

      {/* Status Section */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className={`p-2 rounded-full ${statusConfig.color} mr-3`}>
            <StatusIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              {statusConfig.text}
            </h4>
            <p className="text-sm text-gray-500">
              {statusConfig.description}
            </p>
          </div>
        </div>

        {/* Estimated Ready Time */}
        {(order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing') && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
            <div className="flex items-center">
              <Icons.Clock className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">
                Estimated ready time: {estimatedReadyTime.toLocaleTimeString('en-ZA', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        )}

        {/* Ready for Pickup Alert */}
        {order.status === 'ready' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
            <div className="flex items-center">
              <Icons.Bell className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm text-green-800 font-medium">
                Your order is ready for pickup at the counter!
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-700">Order Progress</span>
          <span className="text-xs text-gray-500">
            {order.status === 'completed' ? '100%' :
             order.status === 'ready' ? '90%' :
             order.status === 'preparing' ? '60%' :
             order.status === 'confirmed' ? '30%' : '10%'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              order.status === 'completed' ? 'bg-green-500 w-full' :
              order.status === 'ready' ? 'bg-green-500 w-5/6' :
              order.status === 'preparing' ? 'bg-orange-500 w-3/5' :
              order.status === 'confirmed' ? 'bg-blue-500 w-1/3' :
              order.status === 'cancelled' ? 'bg-red-500 w-1/12' : 'bg-yellow-500 w-1/12'
            }`}
          />
        </div>
      </div>

      {/* Order Items Summary */}
      {showDetails && (
        <div className="mb-6">
          <h5 className="font-medium text-gray-900 mb-3">Order Items</h5>
          <div className="space-y-2">
            {order.items?.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    {item.quantity}x {item.menu_item_name}
                  </span>
                  {item.customizations && item.customizations.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      Customizations: {item.customizations.join(', ')}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Order Totals */}
          <div className="border-t border-gray-200 pt-3 mt-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>VAT (15%)</span>
              <span>{formatPrice(order.tax_amount || 0)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-gray-200 pt-1">
              <span>Total</span>
              <span className="text-vendorr-blue">{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => onTrackOrder(order.id)}
          className="flex-1 bg-vendorr-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Icons.MapPin className="w-4 h-4 inline mr-2" />
          Track Order
        </button>

        {order.status === 'completed' && (
          <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
            <Icons.Star className="w-4 h-4 inline mr-2" />
            Leave Review
          </button>
        )}

        {(order.status === 'pending' || order.status === 'confirmed') && (
          <button className="border border-red-300 text-red-700 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm">
            <Icons.X className="w-4 h-4 inline mr-2" />
            Cancel
          </button>
        )}
      </div>

      {/* Customer Notes */}
      {order.customer_notes && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h6 className="text-sm font-medium text-gray-900 mb-1">Special Instructions</h6>
          <p className="text-sm text-gray-700">{order.customer_notes}</p>
        </div>
      )}
    </div>
  )
}
