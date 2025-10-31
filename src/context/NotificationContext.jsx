import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'

const NotificationContext = createContext(null)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const { user, token } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState('default')
  const [wsConnection, setWsConnection] = useState(null)

  // Check if push notifications are supported
  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (!user || !token) return

    const connectWebSocket = () => {
      // Get base URL and convert to WebSocket protocol
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const wsProtocol = baseUrl.startsWith('https') ? 'wss' : 'ws'
      const wsHost = baseUrl.replace(/^https?:\/\//, '')
      const wsUrl = `${wsProtocol}://${wsHost}/ws/notifications?token=${token}`
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log('✅ WebSocket connected for real-time notifications')
        setWsConnection(ws)

        // Send keepalive ping every 30 seconds
        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send('ping')
          }
        }, 30000)

        ws.pingInterval = pingInterval
      }

      ws.onmessage = (event) => {
        try {
          // Handle pong response
          if (event.data === 'pong') {
            return
          }

          const data = JSON.parse(event.data)

          // Handle connection confirmation
          if (data.type === 'connection') {
            console.log('WebSocket connection confirmed:', data.message)
            return
          }

          // Handle notification
          handleIncomingNotification(data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...')
        setWsConnection(null)

        // Clear ping interval
        if (ws.pingInterval) {
          clearInterval(ws.pingInterval)
        }

        // Reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000)
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    }

    connectWebSocket()

    return () => {
      if (wsConnection) {
        if (wsConnection.pingInterval) {
          clearInterval(wsConnection.pingInterval)
        }
        wsConnection.close()
      }
    }
  }, [user, token])

  // Handle incoming notifications
  const handleIncomingNotification = useCallback((data) => {
    const notification = {
      id: data.id || Date.now(),
      title: data.title,
      message: data.message,
      type: data.type || 'info', // info, success, warning, error
      timestamp: new Date(data.timestamp || Date.now()),
      read: false,
      data: data.data || {},
      notification_type: data.notification_type
    }

    setNotifications(prev => [notification, ...prev])
    setUnreadCount(prev => prev + 1)

    // Show browser notification if permission granted
    if (permission === 'granted') {
      showBrowserNotification(notification)
    }

    // Show in-app notification
    showInAppNotification(notification)

    // Dispatch custom event for order notifications
    if (data.notification_type === 'order_status') {
      const event = new CustomEvent('orderNotification', { detail: notification })
      window.dispatchEvent(event)
    }
  }, [permission])

  // Request notification permission
  const requestPermission = async () => {
    if (!isSupported) {
      return 'unsupported'
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)

      if (result === 'granted') {
        // Register for push notifications
        await registerForPushNotifications()
      }

      return result
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return 'error'
    }
  }

  // Register for push notifications
  const registerForPushNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY || '')
      })

      // Send subscription to server
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userId: user.id
        })
      })

      console.log('Push notification subscription successful')
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
    }
  }

  // Show browser notification
  const showBrowserNotification = (notification) => {
    if (permission !== 'granted') return

    const options = {
      body: notification.message,
      icon: '/assets/icon-192x192.svg',
      badge: '/assets/icon-72x72.png',
      tag: notification.id.toString(),
      requireInteraction: notification.type === 'warning' || notification.type === 'error',
      actions: notification.type === 'order_update' ? [
        {
          action: 'view',
          title: 'View Order'
        }
      ] : [],
      data: notification.data
    }

    const browserNotification = new Notification(notification.title, options)

    browserNotification.onclick = () => {
      window.focus()
      if (notification.data.orderId) {
        window.location.href = `/orders/${notification.data.orderId}`
      }
      browserNotification.close()
    }

    // Auto-close after 5 seconds for non-critical notifications
    if (notification.type === 'info' || notification.type === 'success') {
      setTimeout(() => {
        browserNotification.close()
      }, 5000)
    }
  }

  // Show in-app notification (toast)
  const showInAppNotification = (notification) => {
    // Create custom event for toast notifications
    const event = new CustomEvent('showToast', {
      detail: {
        title: notification.title,
        message: notification.message,
        type: notification.type,
        duration: notification.type === 'error' ? 8000 : 4000
      }
    })
    window.dispatchEvent(event)
  }

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))

    // Send to server
    if (token) {
      fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(error => {
        console.error('Error marking notification as read:', error)
      })
    }
  }, [token])

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
    setUnreadCount(0)

    // Send to server
    if (token) {
      fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(error => {
        console.error('Error marking all notifications as read:', error)
      })
    }
  }, [token])

  // Clear notification
  const clearNotification = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    )
  }, [])

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  // Simulate notification (for testing)
  const simulateNotification = useCallback((type = 'info') => {
    const mockNotifications = {
      info: {
        title: 'Information',
        message: 'This is an informational message',
        type: 'info'
      },
      success: {
        title: 'Order Confirmed',
        message: 'Your order has been confirmed and is being prepared',
        type: 'success',
        data: { orderId: 'VEN-123456' }
      },
      warning: {
        title: 'Order Delayed',
        message: 'Your order is running 5 minutes behind schedule',
        type: 'warning',
        data: { orderId: 'VEN-123456' }
      },
      error: {
        title: 'Payment Failed',
        message: 'There was an issue processing your payment',
        type: 'error'
      },
      order_update: {
        title: 'Order Ready!',
        message: 'Your order is ready for pickup',
        type: 'order_update',
        data: { orderId: 'VEN-123456' }
      }
    }

    handleIncomingNotification({
      ...mockNotifications[type],
      id: Date.now(),
      timestamp: new Date().toISOString()
    })
  }, [handleIncomingNotification])

  const value = {
    notifications,
    unreadCount,
    isSupported,
    permission,
    requestPermission,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
    simulateNotification
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default NotificationContext
