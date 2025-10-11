import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Navbar,
  PageContainer,
  ContentContainer,
  Section
} from '../components'
import {
  Button,
  Card,
  Typography
} from '../design-system/components'
import { Icons } from '../design-system/icons'

export default function PaymentUploadPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    // Simulate API call to get order details
    setTimeout(() => {
      const mockOrder = {
        id: orderId,
        status: 'pending_payment',
        total: 214.97,
        bankDetails: {
          accountName: 'Vendorr Restaurant',
          bank: 'FNB',
          accountNumber: '1234567890',
          branchCode: '250655',
          reference: 'VEN-' + Date.now()
        }
      }
      setOrder(mockOrder)
      setLoading(false)
    }, 1000)
  }, [orderId])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price)
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Confirm file format is image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, etc.)')
      return
    }

    // Confirm file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setError('')
    setUploadedFile(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setPreviewUrl(null)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!uploadedFile) {
      setError('Please select a proof of payment file')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Simulate API call to upload proof of payment
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate successful upload
      console.log('Proof of payment uploaded successfully')

      // Navigate to order status page
      navigate(`/orders/${orderId}?payment_uploaded=true`)
    } catch (error) {
      console.error('Upload failed:', error)
      setError('Failed to upload proof of payment. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <Navbar />
        <Section className="py-16">
          <ContentContainer>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendorr-blue-500 mx-auto mb-4"></div>
              <Typography.Body>Loading order details...</Typography.Body>
            </div>
          </ContentContainer>
        </Section>
      </PageContainer>
    )
  }

  if (!order) {
    return (
      <PageContainer>
        <Navbar />
        <Section className="py-16">
          <ContentContainer>
            <div className="text-center">
              <Icons.AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <Typography.H2 className="mb-4">Order Not Found</Typography.H2>
              <Typography.Body className="mb-8">
                We couldn't find the order you're looking for.
              </Typography.Body>
              <Button onClick={() => navigate('/orders')} variant="primary">
                View My Orders
              </Button>
            </div>
          </ContentContainer>
        </Section>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Navbar />

      {/* Header */}
      <Section className="bg-gray-50 py-8">
        <ContentContainer>
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/orders/${orderId}/confirmation`)}
              className="mr-4"
            >
              <Icons.ArrowLeft className="w-5 h-5 mr-2" />
              Back to Order
            </Button>
          </div>
          <Typography.H1 className="mb-2">Upload Proof of Payment</Typography.H1>
          <Typography.Lead className="text-gray-600">
            Order #{order.id} - {formatPrice(order.total)}
          </Typography.Lead>
        </ContentContainer>
      </Section>

      {/* Upload Form */}
      <Section className="py-8">
        <ContentContainer>
          <div className="max-w-2xl mx-auto">
            {/* Payment Details Reminder */}
            <Card className="mb-8">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Icons.CreditCard className="w-6 h-6 text-vendorr-blue-500 mr-3" />
                  <Typography.H3>Payment Details</Typography.H3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Name:</span>
                    <span className="font-medium">{order.bankDetails.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank:</span>
                    <span className="font-medium">{order.bankDetails.bank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-medium font-mono">{order.bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-bold text-vendorr-blue-600">{order.bankDetails.reference}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-vendorr-blue-600 border-t pt-2">
                    <span>Amount:</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Upload Form */}
            <Card>
              <form onSubmit={handleSubmit} className="p-6">
                <Typography.H3 className="mb-6">Upload Proof of Payment</Typography.H3>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <Icons.Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <Typography.Body className="text-blue-800 font-medium mb-2">
                        Upload Instructions:
                      </Typography.Body>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Take a clear screenshot of your bank transfer confirmation</li>
                        <li>• Ensure the reference number and amount are visible</li>
                        <li>• Accepted formats: JPG, PNG (max 5MB)</li>
                        <li>• Your order will be confirmed once payment is verified</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* File Upload Area */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proof of Payment *
                  </label>

                  {!uploadedFile ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                      <Icons.Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <Typography.Body className="text-gray-600 mb-4">
                        Click to upload or drag and drop
                      </Typography.Body>
                      <Typography.Small className="text-gray-500 mb-4">
                        PNG, JPG up to 5MB
                      </Typography.Small>
                      <input
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button variant="outline">
                        Select File
                      </Button>
                    </div>
                  ) : (
                    <div className="border border-gray-300 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Icons.Check className="w-5 h-5 text-green-500 mr-2" />
                          <span className="font-medium">{uploadedFile.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={handleRemoveFile}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Icons.X className="w-4 h-4" />
                        </Button>
                      </div>

                      {previewUrl && (
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={previewUrl}
                            alt="Payment proof preview"
                            className="w-full h-48 object-contain bg-gray-50"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <Icons.AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <Typography.Body className="text-red-800">{error}</Typography.Body>
                    </div>
                  </div>
                )}

                {/* Send Button */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/orders/${orderId}/confirmation`)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!uploadedFile || uploading}
                    className="flex-1"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Icons.Upload className="w-4 h-4 mr-2" />
                        Submit Proof of Payment
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </ContentContainer>
      </Section>
    </PageContainer>
  )
}
