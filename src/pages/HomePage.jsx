import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Navbar,
  PWAInstallPrompt,
  PageContainer,
  ContentContainer,
  Section,
  Grid
} from '../components'
import {
  Button,
  Badge,
  Typography,
  Card
} from '../design-system/components'
import { Icons } from '../design-system/icons'
import { useAuth } from '../context/AuthContext'
import { menu as menuAPI } from '../services/api'
import { formatPrice } from '../utils/currency'

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [featuredItems, setFeaturedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [restaurantSettings, setRestaurantSettings] = useState({
    restaurant_name: 'Vendorr',
    restaurant_phone: '+234 906 455 4795, +234 916 492 3056',
    restaurant_email: 'vendorr1@gmail.com',
    restaurant_address: 'Red Brick, Faculty of Arts, University of Jos, Jos, Plateau State, Nigeria'
  })

  // Load featured items from API
  useEffect(() => {
    const loadFeaturedItems = async () => {
      try {
        const response = await menuAPI.getMenuItems()
        // Filter for featured items
        const featured = response.data.filter(item => item.is_featured && item.is_available).slice(0, 3)
        setFeaturedItems(featured)
      } catch (error) {
        console.error('Error loading featured items:', error)
        // Use fallback data if API fails
        setFeaturedItems([])
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedItems()
  }, [])

  // Load restaurant settings from API
  useEffect(() => {
    const loadRestaurantSettings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/whatsapp`)
        if (response.ok) {
          const data = await response.json()
          if (data.restaurant_name) {
            setRestaurantSettings({
              restaurant_name: data.restaurant_name || 'Vendorr',
              restaurant_phone: data.restaurant_phone || '+234 906 455 4795',
              restaurant_email: data.restaurant_email || 'vendorr1@gmail.com',
              restaurant_address: data.restaurant_address || 'Red Brick, Faculty of Arts, University of Jos'
            })
          }
        }
      } catch (error) {
        console.error('Error loading restaurant settings:', error)
      }
    }

    loadRestaurantSettings()
  }, [])

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Check if restaurant is open (9 AM - 10 PM)
  useEffect(() => {
    const hours = currentTime.getHours()
    setIsRestaurantOpen(hours >= 9 && hours < 22)
  }, [currentTime])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const features = [
    {
      icon: Icons.Clock,
      title: "Skip the Queue",
      description: "Order ahead and skip waiting in line. Your food will be ready when you arrive."
    },
    {
      icon: Icons.Bell,
      title: "Real-time Updates",
      description: "Get notified when your order is ready for pickup with live status tracking."
    },
    {
      icon: Icons.CreditCard,
      title: "Secure Payments",
      description: "Pay securely with bank transfer and upload your proof of payment."
    },
    {
      icon: Icons.Star,
      title: "Quality Guaranteed",
      description: "Fresh ingredients, made-to-order meals with our quality guarantee."
    }
  ]

  const stats = [
    { number: "15+", label: "Menu Items" },
    { number: "5-20", label: "Min Prep Time" },
    { number: "500+", label: "Happy Customers" },
    { number: "4.8★", label: "Average Rating" }
  ]

  // formatPrice is imported from '../utils/currency' at the top

  return (
    <PageContainer>
      <Navbar />
      <PWAInstallPrompt />

      {/* Main Banner Section */}
      <Section className="bg-gradient-to-br from-vendorr-blue-500 to-vendorr-blue-700 text-white py-20">
        <ContentContainer>
          <div className="text-center max-w-4xl mx-auto">
            {/* Restaurant Status */}
            <div className="mb-6">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                isRestaurantOpen
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  isRestaurantOpen ? 'bg-green-500' : 'bg-red-500'
                }`} />
                {isRestaurantOpen ? 'Open Now' : 'Closed'} • {formatTime(currentTime)}
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Skip the Wait,<br />
              <span className="text-vendorr-gold-400">Order Ahead</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Pre-order your favorite meals from Vendorr and pick them up when they're ready.
              No queues, no waiting, just delicious food on your schedule.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {isRestaurantOpen ? (
                <Link to="/menu">
                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full sm:w-auto text-lg px-8 py-4 shadow-xl hover:scale-105 transition-transform"
                  >
                    <Icons.ShoppingCart className="w-6 h-6 mr-3" />
                    Order Now
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  disabled
                  className="w-full sm:w-auto text-lg px-8 py-4 border-2 border-white/30 text-white/70"
                >
                  <Icons.Clock className="w-6 h-6 mr-3" />
                  Closed - Opens at 9:00 AM
                </Button>
              )}

              <Link to="/menu">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-vendorr-blue-500"
                >
                  <Icons.Search className="w-6 h-6 mr-3" />
                  Browse Menu
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-vendorr-gold-400 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-blue-200">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ContentContainer>
      </Section>

      {/* Today's Deals Section */}
      <Section className="bg-white py-16">
        <ContentContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Today's Featured Items
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hand-picked favorites at great prices. Available for a limited time only.
            </p>
          </div>

          <Grid cols="md:grid-cols-2 lg:grid-cols-3" gap="gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">Loading featured items...</p>
              </div>
            ) : featuredItems.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No featured items available at the moment.</p>
              </div>
            ) : (
              featuredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                  <div className="relative">
                    <img
                      src={item.image_url || '/assets/placeholder-food.svg'}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/assets/placeholder-food.svg'
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <div className="bg-vendorr-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-700">
                        <Icons.Clock className="w-3 h-3 inline mr-1" />
                        {item.preparation_time} min
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-vendorr-blue-500">
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      <Link to="/menu">
                        <Button
                          variant="primary"
                          className="w-full"
                          disabled={!isRestaurantOpen}
                        >
                          {isRestaurantOpen ? 'Order Now' : 'View Details'}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))
            )}
          </Grid>
        </ContentContainer>
      </Section>

      {/* How It Works Section */}
      <Section className="bg-gray-50 py-16">
        <ContentContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Vendorr Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ordering ahead has never been easier. Here's how you can skip the queue and get your food faster.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              {
                step: "1",
                icon: Icons.Search,
                title: "Browse Menu",
                description: "Choose from our selection of fresh, made-to-order meals"
              },
              {
                step: "2",
                icon: Icons.Plus,
                title: "Add to Cart",
                description: "Customize your order and add items to your cart"
              },
              {
                step: "3",
                icon: Icons.CreditCard,
                title: "Pay & Confirm",
                description: "Secure payment with bank transfer and order confirmation"
              },
              {
                step: "4",
                icon: Icons.Bell,
                title: "Pickup Ready",
                description: "Get notified when your order is ready for collection"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-vendorr-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-vendorr-gold-500 rounded-full flex items-center justify-center text-vendorr-blue-500 font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to={isAuthenticated ? "/menu" : "/register"}>
              <Button variant="primary" size="lg" className="px-8">
                {isAuthenticated ? "Start Ordering" : "Get Started"}
              </Button>
            </Link>
          </div>
        </ContentContainer>
      </Section>

      {/* Features Section */}
      <Section className="bg-white py-16">
        <ContentContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Vendorr?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to making your dining experience faster, easier, and more enjoyable.
            </p>
          </div>

          <Grid cols="md:grid-cols-2 lg:grid-cols-4" gap="gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-vendorr-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-vendorr-blue-500 transition-colors">
                  <feature.icon className="w-8 h-8 text-vendorr-blue-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </Grid>
        </ContentContainer>
      </Section>

      {/* Location & Hours Section */}
      <Section className="bg-gray-900 text-white py-16">
        <ContentContainer>
          <Grid cols="md:grid-cols-2" gap="gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Visit Our Restaurant</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Icons.MapPin className="w-6 h-6 text-vendorr-gold-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-gray-300 whitespace-pre-line">
                      {restaurantSettings.restaurant_address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Icons.Phone className="w-6 h-6 text-vendorr-gold-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Contact</h3>
                    <p className="text-gray-300 whitespace-pre-line">
                      {restaurantSettings.restaurant_phone}
                      {restaurantSettings.restaurant_email && (
                        <>
                          <br />
                          {restaurantSettings.restaurant_email}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Opening Hours</h2>
              <div className="space-y-3">
                {[
                  { day: "Monday - Friday", hours: "9:00 AM - 10:00 PM" },
                  { day: "Saturday", hours: "10:00 AM - 11:00 PM" },
                  { day: "Sunday", hours: "10:00 AM - 9:00 PM" }
                ].map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="font-medium">{schedule.day}</span>
                    <span className="text-vendorr-gold-400">{schedule.hours}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-vendorr-blue-500 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isRestaurantOpen ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="font-semibold">
                    {isRestaurantOpen ? 'Open Now' : 'Currently Closed'}
                  </span>
                </div>
                <p className="text-sm text-blue-100 mt-1">
                  {isRestaurantOpen
                    ? 'Order now for pickup or browse our menu for later'
                    : 'We open at 9:00 AM. Browse our menu and place your order when we\'re open'
                  }
                </p>
              </div>
            </div>
          </Grid>
        </ContentContainer>
      </Section>

      {/* Call to Action Section */}
      <Section className="bg-gradient-to-r from-vendorr-gold-400 to-vendorr-gold-500 py-16">
        <ContentContainer>
          <div className="text-center text-vendorr-blue-500">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Skip the Queue?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who save time with Vendorr.
              Start your order today and experience the convenience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={isAuthenticated ? "/menu" : "/register"}>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto px-8 shadow-xl hover:scale-105 transition-transform"
                >
                  {isAuthenticated ? (
                    <>
                      <Icons.ShoppingCart className="w-6 h-6 mr-3" />
                      Browse Menu
                    </>
                  ) : (
                    <>
                      <Icons.User className="w-6 h-6 mr-3" />
                      Create Account
                    </>
                  )}
                </Button>
              </Link>

              {!isAuthenticated && (
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto px-8 border-2 border-vendorr-blue-500 text-vendorr-blue-500 hover:bg-vendorr-blue-500 hover:text-white"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </ContentContainer>
      </Section>
    </PageContainer>
  )
}
