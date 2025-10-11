import React, { useState } from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'

/**
 * Social Login Buttons Component
 * Provides Google and Facebook OAuth authentication options
 */
const SocialLoginButtons = ({ onSuccess, onError }) => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true)
    try {
      // Send the credential to our backend
      const response = await authAPI.socialLogin({
        provider: 'google',
        token: credentialResponse.credential
      })

      // Log in the user
      await login(response.data.user, response.data.access_token)

      if (onSuccess) {
        onSuccess(response.data)
      } else {
        navigate('/menu')
      }
    } catch (error) {
      console.error('Google login error:', error)
      const errorMessage = error.response?.data?.detail || 'Google login failed'
      if (onError) {
        onError(errorMessage)
      } else {
        alert(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleError = () => {
    console.error('Google login failed')
    if (onError) {
      onError('Google login failed')
    }
  }

  const handleFacebookLogin = async () => {
    setIsLoading(true)
    try {
      // Initialize Facebook SDK if not already done
      if (!window.FB) {
        await loadFacebookSDK()
      }

      window.FB.login((response) => {
        if (response.authResponse) {
          // Send the access token to our backend
          authenticateWithFacebook(response.authResponse.accessToken)
        } else {
          console.log('User cancelled Facebook login')
          setIsLoading(false)
        }
      }, { scope: 'public_profile,email' })
    } catch (error) {
      console.error('Facebook login error:', error)
      setIsLoading(false)
      if (onError) {
        onError('Facebook login failed')
      }
    }
  }

  const authenticateWithFacebook = async (accessToken) => {
    try {
      const response = await authAPI.socialLogin({
        provider: 'facebook',
        token: accessToken
      })

      // Log in the user
      await login(response.data.user, response.data.access_token)

      if (onSuccess) {
        onSuccess(response.data)
      } else {
        navigate('/menu')
      }
    } catch (error) {
      console.error('Facebook authentication error:', error)
      const errorMessage = error.response?.data?.detail || 'Facebook login failed'
      if (onError) {
        onError(errorMessage)
      } else {
        alert(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const loadFacebookSDK = () => {
    return new Promise((resolve, reject) => {
      // Check if SDK is already loaded
      if (window.FB) {
        resolve()
        return
      }

      // Load the SDK asynchronously
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: import.meta.env.VITE_FACEBOOK_APP_ID || 'your-facebook-app-id',
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        })
        resolve()
      }

      // Load SDK script
      const script = document.createElement('script')
      script.src = 'https://connect.facebook.net/en_US/sdk.js'
      script.async = true
      script.defer = true
      script.crossOrigin = 'anonymous'
      script.onerror = reject
      document.body.appendChild(script)
    })
  }

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!googleClientId) {
    console.warn('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in your environment variables.')
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="space-y-2">
        {/* Google Login Button */}
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                logo_alignment="left"
              />
            </div>
          </GoogleOAuthProvider>
        ) : (
          <button
            type="button"
            disabled
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Sign in with Google (Not Configured)</span>
          </button>
        )}

        {/* Facebook Login Button */}
        <button
          type="button"
          onClick={handleFacebookLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>{isLoading ? 'Signing in...' : 'Sign in with Facebook'}</span>
        </button>
      </div>

      {isLoading && (
        <div className="text-center text-sm text-gray-500">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
          Authenticating...
        </div>
      )}
    </div>
  )
}

export default SocialLoginButtons
