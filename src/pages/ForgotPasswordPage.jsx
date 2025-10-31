import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer, Section, ContentContainer } from '../components/Layout'
import { Card, Button, Typography } from '../design-system/components'
import { Icons } from '../design-system/icons'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // TODO: Implement password reset API call
      // await api.requestPasswordReset(email)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      setIsSubmitted(true)
    } catch (err) {
      console.error('Password reset error:', err)
      setError('Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageContainer>
      <Section className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12">
        <ContentContainer>
          <div className="max-w-md mx-auto">
            {/* Logo/Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-block">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">V</span>
                </div>
              </Link>
              <Typography variant="h1" className="text-3xl font-bold text-gray-900 mb-2">
                Forgot Password?
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                {isSubmitted
                  ? "Check your email for reset instructions"
                  : "Enter your email to receive password reset instructions"
                }
              </Typography>
            </div>

            <Card className="p-8 shadow-xl">
              {isSubmitted ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icons.CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <Typography variant="h3" className="text-xl font-semibold text-gray-900 mb-3">
                    Email Sent!
                  </Typography>
                  <Typography variant="body1" className="text-gray-600 mb-6">
                    We've sent password reset instructions to <strong>{email}</strong>
                  </Typography>
                  <Typography variant="body2" className="text-sm text-gray-500 mb-6">
                    Didn't receive the email? Check your spam folder or try again.
                  </Typography>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSubmitted(false)
                        setEmail('')
                      }}
                      className="w-full"
                    >
                      Try Another Email
                    </Button>
                    <Link to="/login" className="block">
                      <Button variant="primary" className="w-full">
                        Back to Login
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                      <Icons.AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <Typography variant="body2" className="text-sm text-red-800">
                          {error}
                        </Typography>
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Icons.Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                  </Button>

                  <div className="text-center">
                    <Link
                      to="/login"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                    >
                      <Icons.ArrowLeft className="w-4 h-4 mr-1" />
                      Back to Login
                    </Link>
                  </div>
                </form>
              )}
            </Card>

            {/* Additional Help */}
            <div className="mt-6 text-center">
              <Typography variant="body2" className="text-sm text-gray-600">
                Need help?{' '}
                <a href="mailto:vendorr1@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium">
                  Contact Support
                </a>
              </Typography>
            </div>
          </div>
        </ContentContainer>
      </Section>
    </PageContainer>
  )
}

export default ForgotPasswordPage
