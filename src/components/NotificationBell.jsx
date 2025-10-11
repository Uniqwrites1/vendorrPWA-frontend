import React, { useState, useRef, useEffect } from 'react'
import { Icons } from '../design-system/icons'
import { Button, Typography, Text } from '../design-system/components'
import { useNotifications } from '../context/NotificationContext'

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    simulateNotification,
    permission,
    requestPermission
  } = useNotifications()

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatTime = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now - time
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return time.toLocaleDateString()
  }

  const getNotificationIcon = (type) => {
    const iconMap = {
      info: Icons.Info,
      success: Icons.CheckCircle,
      warning: Icons.AlertTriangle,
      error: Icons.AlertCircle,
      order_update: Icons.Package
    }
    return iconMap[type] || Icons.Bell
  }

  const getNotificationColor = (type) => {
    const colorMap = {
      info: 'text-blue-500',
      success: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500',
      order_update: 'text-vendorr-blue-500'
    }
    return colorMap[type] || 'text-gray-500'
  }

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id)

    // Handle notification-specific actions
    if (notification.data?.orderId) {
      window.location.href = `/orders/${notification.data.orderId}`
    }
  }

  const recentNotifications = notifications.slice(0, 5)

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative p-2 rounded-lg transition-colors duration-200
          ${isOpen
            ? 'bg-vendorr-blue-100 text-vendorr-blue-600'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
      >
        <Icons.Bell className="w-6 h-6" />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Typography variant="h4">Notifications</Typography>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-vendorr-blue-600 hover:text-vendorr-blue-800 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Permission Request */}
          {permission !== 'granted' && (
            <div className="px-4 py-3 bg-yellow-50 border-b border-yellow-200">
              <div className="flex items-start space-x-3">
                <Icons.Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <Text size="sm" className="text-yellow-800 mb-2">
                    Enable notifications to get real-time order updates
                  </Text>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={requestPermission}
                    className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                  >
                    Enable Notifications
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type)
                const iconColor = getNotificationColor(notification.type)

                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`
                      px-4 py-3 border-b border-gray-100 cursor-pointer
                      transition-colors duration-200 hover:bg-gray-50
                      ${!notification.read ? 'bg-blue-50' : ''}
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 ${iconColor} mt-0.5`}>
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <Text size="sm" weight="medium" className={`
                            truncate
                            ${!notification.read ? 'text-gray-900' : 'text-gray-700'}
                          `}>
                            {notification.title}
                          </Text>

                          {!notification.read && (
                            <div className="w-2 h-2 bg-vendorr-blue-500 rounded-full flex-shrink-0 ml-2" />
                          )}
                        </div>

                        <Text size="sm" color="muted" className="mb-1">
                          {notification.message}
                        </Text>

                        <Text size="xs" color="light">
                          {formatTime(notification.timestamp)}
                        </Text>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          clearNotification(notification.id)
                        }}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1"
                      >
                        <Icons.X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="px-4 py-8 text-center">
                <Icons.Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <Text color="muted" className="mb-2">
                  No notifications yet
                </Text>
                <Text size="sm" color="light">
                  You'll see order updates and important messages here
                </Text>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 5 && (
            <div className="px-4 py-3 border-t border-gray-200 text-center">
              <button className="text-sm text-vendorr-blue-600 hover:text-vendorr-blue-800 font-medium">
                View all notifications
              </button>
            </div>
          )}

          {/* Development Testing Controls */}
          {process.env.NODE_ENV === 'development' && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <Text size="sm" color="muted" className="mb-2">
                Development Testing:
              </Text>
              <div className="flex space-x-2">
                <button
                  onClick={() => simulateNotification('success')}
                  className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                >
                  Success
                </button>
                <button
                  onClick={() => simulateNotification('warning')}
                  className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
                >
                  Warning
                </button>
                <button
                  onClick={() => simulateNotification('error')}
                  className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                >
                  Error
                </button>
                <button
                  onClick={() => simulateNotification('order_update')}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                >
                  Order
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell
