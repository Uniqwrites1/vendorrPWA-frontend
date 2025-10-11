import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  PageContainer,
  Section,
  ContentContainer
} from '../components'
import {
  Card,
  Button,
  Input,
  Typography
} from '../design-system/components'
import { Icons } from '../design-system/icons'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters'
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters'
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Terms acceptance
    if (!acceptTerms) {
      newErrors.terms = 'You must accept the Terms of Service and Privacy Policy'
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
      await register({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirm_password: formData.confirmPassword
      })

      // Redirect to login with success message
      navigate('/login', {
        state: {
          message: 'Registration successful! Please check your email to verify your account, then sign in.'
        }
      })
    } catch (error) {
      console.error('Registration error:', error)

      // Handle different types of errors
      if (error.message.includes('email already exists')) {
        setErrors({
          email: 'An account with this email already exists. Please use a different email or try signing in.'
        })
      } else if (error.message.includes('network')) {
        setErrors({
          general: 'Network error. Please check your connection and try again.'
        })
      } else if (error.message.includes('validation')) {
        setErrors({
          general: 'Please check your information and try again.'
        })
      } else {
        setErrors({
          general: 'Registration failed. Please try again later.'
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++

    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

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
                <Icons.UserPlus className="w-8 h-8" />
              </div>
            </div>
            <Typography variant="h2" className="mb-2">
              Create Account
            </Typography>
            <Typography variant="body1" color="muted">
              Join Vendorr and skip the wait
            </Typography>
          </div>

          <Card className="p-8">
            {/* General error message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <Typography variant="body2" className="text-red-800">
                  {errors.general}
                </Typography>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? 'border-red-500 focus:ring-red-500' : ''}
                    placeholder="John"
                    disabled={isLoading}
                    autoComplete="given-name"
                    required
                  />
                  {errors.firstName && (
                    <Typography variant="caption" className="text-red-600 mt-1">
                      {errors.firstName}
                    </Typography>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? 'border-red-500 focus:ring-red-500' : ''}
                    placeholder="Doe"
                    disabled={isLoading}
                    autoComplete="family-name"
                    required
                  />
                  {errors.lastName && (
                    <Typography variant="caption" className="text-red-600 mt-1">
                      {errors.lastName}
                    </Typography>
                  )}
                </div>
              </div>

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
                    placeholder="john@example.com"
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

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-gray-500">(optional)</span>
                </label>
                <div className="relative">
                  <Icons.Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="+1 (555) 123-4567"
                    disabled={isLoading}
                    autoComplete="tel"
                  />
                </div>
                {errors.phone && (
                  <Typography variant="caption" className="text-red-600 mt-1">
                    {errors.phone}
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
                    placeholder="Create a strong password"
                    disabled={isLoading}
                    autoComplete="new-password"
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${strengthColors[passwordStrength - 1] || 'bg-gray-200'}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                      <Typography variant="caption" color="muted">
                        {strengthLabels[passwordStrength - 1] || 'Too short'}
                      </Typography>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <Typography variant="caption" className="text-red-600 mt-1">
                    {errors.password}
                  </Typography>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Icons.Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <Icons.EyeOff className="w-5 h-5" />
                    ) : (
                      <Icons.Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <Typography variant="caption" className="text-red-600 mt-1">
                    {errors.confirmPassword}
                  </Typography>
                )}
              </div>

              {/* Terms Acceptance */}
              <div>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked)
                      if (errors.terms) {
                        setErrors(prev => ({ ...prev, terms: '' }))
                      }
                    }}
                    className={`mt-1 rounded border-gray-300 text-vendorr-blue focus:ring-vendorr-blue ${errors.terms ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  <div className="text-sm">
                    <Typography variant="body2" color="muted">
                      I agree to the{' '}
                      <Link to="/terms" className="text-vendorr-blue hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-vendorr-blue hover:underline">
                        Privacy Policy
                      </Link>
                    </Typography>
                  </div>
                </label>
                {errors.terms && (
                  <Typography variant="caption" className="text-red-600 mt-1">
                    {errors.terms}
                  </Typography>
                )}
              </div>

              {/* Action Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
                loading={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                </div>
              </div>
            </div>

            {/* Social Registration Options */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button
                variant="outline"
                onClick={() => {/* Handle Google registration */}}
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
                onClick={() => {/* Handle Facebook registration */}}
                disabled={isLoading}
                className="flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <Typography variant="body2" color="muted">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-vendorr-blue hover:text-vendorr-blue-dark"
                >
                  Sign in
                </Link>
              </Typography>
            </div>
          </Card>

          {/* Terms Notice */}
          <div className="mt-6 text-center">
            <Typography variant="caption" color="muted">
              By creating an account, you agree to our{' '}
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

export default RegisterPage
