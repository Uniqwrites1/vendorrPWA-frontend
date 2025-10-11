import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  PageContainer,
  Section,
  ContentContainer
} from '../components'
import {
  Card,
  Button,
  Input,
  Typography,
  Badge
} from '../design-system/components'
import { Icons } from '../design-system/icons'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/'

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const result = await login({ email: formData.email, password: formData.password })

      if (result.success) {
        navigate(from, { replace: true })
      } else {
        // Handle login failure
        const errorMessage = result.error || 'Login failed. Please try again.'

        // Provide more specific error messages based on the error content
        if (errorMessage.toLowerCase().includes('credentials') || errorMessage.toLowerCase().includes('invalid')) {
          setErrors({
            general: 'Invalid email or password. Please try again.'
          })
        } else if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('connection')) {
          setErrors({
            general: 'Network error. Please check your connection and try again.'
          })
        } else if (errorMessage.toLowerCase().includes('verification') || errorMessage.toLowerCase().includes('verify')) {
          setErrors({
            general: 'Please verify your email address before logging in.'
          })
        } else {
          setErrors({
            general: errorMessage
          })
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({
        general: 'An unexpected error occurred. Please try again later.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageContainer>
      <Section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vendorr-blue-50 to-white py-12 px-4">
        <ContentContainer className="max-w-md w-full">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-vendorr-blue hover:text-vendorr-blue-dark transition-colors"
            >
              <Icons.ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-vendorr-blue text-white rounded-lg p-3">
                <Icons.User className="w-8 h-8" />
              </div>
            </div>
            <Typography variant="h2" className="mb-2">
              Welcome Back
            </Typography>
            <Typography variant="body1" color="muted">
              Sign in to your Vendorr account
            </Typography>
          </div>

          <Card className="p-8">
            {/* Success message from registration */}
            {location.state?.message && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Typography variant="body2" className="text-green-800">
                  {location.state.message}
                </Typography>
              </div>
            )}

            {/* General error message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <Typography variant="body2" className="text-red-800">
                  {errors.general}
                </Typography>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Icons.Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    autoComplete="email"
                    required
                  />
                </div>
                {errors.email && (
                  <Typography variant="caption" className="text-red-600 mt-1">
                    {errors.email}
                  </Typography>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Icons.Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <Icons.EyeOff className="w-5 h-5" />
                    ) : (
                      <Icons.Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <Typography variant="caption" className="text-red-600 mt-1">
                    {errors.password}
                  </Typography>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-vendorr-blue focus:ring-vendorr-blue"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-vendorr-blue hover:text-vendorr-blue-dark"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
                loading={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Social Login Options */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => {/* Handle Google login */}}
                disabled={isLoading}
                className="flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => {/* Handle Facebook login */}}
                disabled={isLoading}
                className="flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <Typography variant="body2" color="muted">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-vendorr-blue hover:text-vendorr-blue-dark"
                >
                  Sign up for free
                </Link>
              </Typography>
            </div>
          </Card>

          {/* Terms */}
          <div className="mt-6 text-center">
            <Typography variant="caption" color="muted">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-vendorr-blue hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-vendorr-blue hover:underline">
                Privacy Policy
              </Link>
            </Typography>
          </div>
        </ContentContainer>
      </Section>
    </PageContainer>
  )
}

export default LoginPage
