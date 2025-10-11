import React, { useState, useEffect } from 'react'
import { Icons } from '../design-system/icons'

const ToastNotification = ({
  id,
  title,
  message,
  type = 'info',
  duration = 4000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Fade in animation
    const timer = setTimeout(() => setIsVisible(true), 100)

    // Auto-dismiss timer
    const dismissTimer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => {
      clearTimeout(timer)
      clearTimeout(dismissTimer)
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose?.(id)
    }, 300)
  }

  const getTypeStyles = () => {
    const styles = {
      info: {
        bg: 'bg-blue-50 border-blue-200',
        text: 'text-blue-800',
        icon: Icons.Info,
        iconColor: 'text-blue-500'
      },
      success: {
        bg: 'bg-green-50 border-green-200',
        text: 'text-green-800',
        icon: Icons.CheckCircle,
        iconColor: 'text-green-500'
      },
      warning: {
        bg: 'bg-yellow-50 border-yellow-200',
        text: 'text-yellow-800',
        icon: Icons.AlertTriangle,
        iconColor: 'text-yellow-500'
      },
      error: {
        bg: 'bg-red-50 border-red-200',
        text: 'text-red-800',
        icon: Icons.AlertCircle,
        iconColor: 'text-red-500'
      },
      order_update: {
        bg: 'bg-vendorr-blue-50 border-vendorr-blue-200',
        text: 'text-vendorr-blue-800',
        icon: Icons.Bell,
        iconColor: 'text-vendorr-blue-500'
      }
    }
    return styles[type] || styles.info
  }

  const typeStyle = getTypeStyles()
  const IconComponent = typeStyle.icon

  return (
    <div
      className={`
        fixed right-4 top-4 z-50 w-96 max-w-sm mx-auto
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isExiting
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
        }
      `}
      style={{
        top: `${(parseInt(id.toString()) % 5) * 80 + 20}px`
      }}
    >
      <div className={`
        ${typeStyle.bg} border rounded-lg shadow-lg p-4
        backdrop-blur-sm bg-opacity-95
      `}>
        <div className="flex items-start space-x-3">
          <div className={`flex-shrink-0 ${typeStyle.iconColor}`}>
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium ${typeStyle.text} mb-1`}>
              {title}
            </h4>
            <p className={`text-sm ${typeStyle.text} opacity-90`}>
              {message}
            </p>
          </div>

          <button
            onClick={handleClose}
            className={`
              flex-shrink-0 ${typeStyle.iconColor} hover:opacity-75
              transition-opacity duration-200
            `}
          >
            <Icons.X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar for auto-dismiss */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
          <div
            className={`
              h-1 rounded-full transition-all ease-linear
              ${type === 'success' ? 'bg-green-500' :
                type === 'warning' ? 'bg-yellow-500' :
                type === 'error' ? 'bg-red-500' :
                type === 'order_update' ? 'bg-vendorr-blue-500' :
                'bg-blue-500'
              }
            `}
            style={{
              width: '100%',
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>
    </div>
  )
}

const ToastContainer = () => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handleShowToast = (event) => {
      const { title, message, type, duration } = event.detail
      const id = Date.now()

      const newToast = {
        id,
        title,
        message,
        type,
        duration
      }

      setToasts(prev => [...prev, newToast])
    }

    window.addEventListener('showToast', handleShowToast)

    return () => {
      window.removeEventListener('showToast', handleShowToast)
    }
  }, [])

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}

      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  )
}

export default ToastContainer
