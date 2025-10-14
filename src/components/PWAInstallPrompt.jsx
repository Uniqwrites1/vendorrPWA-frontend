import React, { useState, useEffect } from 'react'
import { Button } from '../design-system/components'
import { Icons } from '../design-system/icons'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(isIOSDevice)

    // Check if app is already installed (standalone mode)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                              window.navigator.standalone ||
                              document.referrer.includes('android-app://')
    setIsStandalone(isInStandaloneMode)

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
      console.log('PWA was installed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Show install prompt for iOS users (manual instruction)
    if (isIOSDevice && !isInStandaloneMode) {
      setShowInstallPrompt(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setShowInstallPrompt(false)
      }
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Store dismissal in localStorage to avoid showing again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Don't show if already installed
  if (isStandalone) {
    return null
  }

  // Don't show if not ready yet
  if (!showInstallPrompt) {
    return null
  }

  // Check if recently dismissed (within 24 hours for testing)
  const dismissedTime = localStorage.getItem('pwa-install-dismissed')
  if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-vendorr-blue-600 to-vendorr-blue-500 text-white py-3 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <Icons.Download className="w-6 h-6 text-vendorr-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm">Install Vendorr App</h3>
            <p className="text-xs text-blue-100 line-clamp-2">
              {isIOS
                ? 'Tap Share (⬆️) button, then "Add to Home Screen"'
                : 'Get faster access and offline ordering capability'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          {!isIOS && deferredPrompt && (
            <Button
              variant="gold"
              size="sm"
              onClick={handleInstallClick}
              className="text-xs px-3 py-1.5 whitespace-nowrap font-semibold"
            >
              Install
            </Button>
          )}

          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Dismiss install prompt"
          >
            <Icons.Close className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
