import React, { useState, useEffect } from 'react'import React, { useState, useEffect } from 'react'

import { Link } from 'react-router-dom'import { Link } from 'react-router-dom'

import {import {

  Navbar,  Navbar,

  PWAInstallPrompt,  PWAInstallPrompt,

  PageContainer,  PageContainer,

  ContentContainer,  ContentContainer,

  Section,  Section,

  Grid  Grid

} from '../components'} from '../components'

import {import {

  Button,  Button,

  Typography,  Badge,

  Card  Typography,

} from '../design-system/components'  Card

import { Icons } from '../design-system/icons'} from '../design-system/components'

import { useAuth } from '../context/AuthContext'import { Icons } from '../design-system/icons'

import { menu as menuAPI } from '../services/api'import { useAuth } from '../context/AuthContext'

import { formatPrice } from '../utils/currency'import { menu as menuAPI } from '../services/api'

import { formatPrice } from '../utils/currency'

export default function HomePage() {

  const { isAuthenticated } = useAuth()export default function HomePage() {

  const [featuredItems, setFeaturedItems] = useState([])  const { isAuthenticated, user } = useAuth()

  const [loading, setLoading] = useState(true)  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true)

  const [restaurantSettings, setRestaurantSettings] = useState({  const [currentTime, setCurrentTime] = useState(new Date())

    restaurant_name: 'Vendorr',  const [featuredItems, setFeaturedItems] = useState([])

    restaurant_phone: '+234 906 455 4795, +234 916 492 3056',  const [loading, setLoading] = useState(true)

    restaurant_email: 'vendorr1@gmail.com',  const [restaurantSettings, setRestaurantSettings] = useState({

    restaurant_address: 'Red Brick, Faculty of Arts, University of Jos, Jos, Plateau State, Nigeria'    restaurant_name: 'Vendorr',

  })    restaurant_phone: '+234 906 455 4795, +234 916 492 3056',

    restaurant_email: 'vendorr1@gmail.com',

  // Load featured items    restaurant_address: 'Red Brick, Faculty of Arts, University of Jos, Jos, Plateau State, Nigeria'

  useEffect(() => {  })

    const loadFeaturedItems = async () => {

      try {  // Load featured items from API

        const response = await menuAPI.getMenuItems()  useEffect(() => {

        const featured = response.data.filter(item => item.is_featured && item.is_available).slice(0, 3)    const loadFeaturedItems = async () => {

        setFeaturedItems(featured)      try {

      } catch (error) {        const response = await menuAPI.getMenuItems()

        console.error('Error loading featured items:', error)        // Filter for featured items

        setFeaturedItems([])        const featured = response.data.filter(item => item.is_featured && item.is_available).slice(0, 3)

      } finally {        setFeaturedItems(featured)

        setLoading(false)      } catch (error) {

      }        console.error('Error loading featured items:', error)

    }        // Use fallback data if API fails

        setFeaturedItems([])

    loadFeaturedItems()      } finally {

  }, [])        setLoading(false)

      }

  // Load restaurant settings    }

  useEffect(() => {

    const loadRestaurantSettings = async () => {    loadFeaturedItems()

      try {  }, [])

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/whatsapp`)

        if (response.ok) {  // Load restaurant settings from API

          const data = await response.json()  useEffect(() => {

          if (data.restaurant_name) {    const loadRestaurantSettings = async () => {

            setRestaurantSettings({      try {

              restaurant_name: data.restaurant_name || 'Vendorr',        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/whatsapp`)

              restaurant_phone: data.restaurant_phone || '+234 906 455 4795',        if (response.ok) {

              restaurant_email: data.restaurant_email || 'vendorr1@gmail.com',          const data = await response.json()

              restaurant_address: data.restaurant_address || 'Red Brick, Faculty of Arts, University of Jos'          if (data.restaurant_name) {

            })            setRestaurantSettings({

          }              restaurant_name: data.restaurant_name || 'Vendorr',

        }              restaurant_phone: data.restaurant_phone || '+234 906 455 4795',

      } catch (error) {              restaurant_email: data.restaurant_email || 'vendorr1@gmail.com',

        console.error('Error loading restaurant settings:', error)              restaurant_address: data.restaurant_address || 'Red Brick, Faculty of Arts, University of Jos'

      }            })

    }          }

        }

    loadRestaurantSettings()      } catch (error) {

  }, [])        console.error('Error loading restaurant settings:', error)

      }

  const stats = [    }

    { number: "15+", label: "Menu Items" },

    { number: "5-20", label: "Min Prep Time" },    loadRestaurantSettings()

    { number: "500+", label: "Happy Customers" },  }, [])

    { number: "4.8★", label: "Average Rating" }

  ]  // Update current time every minute

  useEffect(() => {

  return (    const timer = setInterval(() => {

    <PageContainer>      setCurrentTime(new Date())

      <Navbar />    }, 60000)

      <PWAInstallPrompt />

    return () => clearInterval(timer)

      {/* Hero Section with Blue Background */}  }, [])

      <div className="relative bg-blue-600 text-white py-20 overflow-hidden">

        {/* Background Gradient Overlay */}  // Check if restaurant is open (9 AM - 10 PM)

        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"></div>  useEffect(() => {

            const hours = currentTime.getHours()

        <ContentContainer className="relative z-10">    setIsRestaurantOpen(hours >= 9 && hours < 22)

          <div className="text-center max-w-4xl mx-auto">  }, [currentTime])

            {/* Main Heading */}

            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">  const formatTime = (date) => {

              Skip the Wait,<br />    return date.toLocaleTimeString('en-ZA', {

              <span className="text-yellow-400">Order Ahead</span>      hour: '2-digit',

            </h1>      minute: '2-digit'

    })

            <p className="text-xl md:text-2xl mb-8 font-medium max-w-3xl mx-auto">  }

              Pre-order your favorite meals from Vendorr and pick them up when they're ready.

              No queues, no waiting, just delicious food on your schedule.  const features = [

            </p>    {

      icon: Icons.Clock,

            {/* CTA Buttons */}      title: "Skip the Queue",

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">      description: "Order ahead and skip waiting in line. Your food will be ready when you arrive."

              <Link to="/menu">    },

                <Button    {

                  variant="gold"      icon: Icons.Bell,

                  size="lg"      title: "Real-time Updates",

                  className="w-full sm:w-auto text-lg px-8 py-4 bg-yellow-400 text-blue-900 hover:bg-yellow-500 shadow-xl hover:scale-105 transition-transform font-bold"      description: "Get notified when your order is ready for pickup with live status tracking."

                >    },

                  <Icons.ShoppingCart className="w-6 h-6 mr-3" />    {

                  Order Now      icon: Icons.CreditCard,

                </Button>      title: "Secure Payments",

              </Link>      description: "Pay securely with bank transfer and upload your proof of payment."

    },

              <Link to="/menu">    {

                <button className="w-full sm:w-auto text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-lg font-semibold transition-all">      icon: Icons.Star,

                  <Icons.Search className="w-6 h-6 inline mr-3" />      title: "Quality Guaranteed",

                  Browse Menu      description: "Fresh ingredients, made-to-order meals with our quality guarantee."

                </button>    }

              </Link>  ]

            </div>

  const stats = [

            {/* Quick Stats - Now with Dark Blue Solid Backgrounds */}    { number: "15+", label: "Menu Items" },

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-12">    { number: "5-20", label: "Min Prep Time" },

              {stats.map((stat, index) => (    { number: "500+", label: "Happy Customers" },

                <div     { number: "4.8★", label: "Average Rating" }

                  key={index}   ]

                  className="bg-blue-800 rounded-xl py-6 px-4 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-yellow-400"

                >  // formatPrice is imported from '../utils/currency' at the top

                  <div className="text-3xl md:text-4xl font-extrabold text-yellow-400 mb-2">

                    {stat.number}  return (

                  </div>    <PageContainer>

                  <div className="text-sm md:text-base font-semibold text-white">      <Navbar />

                    {stat.label}      <PWAInstallPrompt />

                  </div>

                </div>      {/* Main Banner Section */}

              ))}      <Section className="bg-gradient-to-br from-vendorr-blue-500 to-vendorr-blue-700 text-white py-20">

            </div>        <ContentContainer>

          </div>          <div className="text-center max-w-4xl mx-auto">

        </ContentContainer>            {/* Main Heading */}

      </div>            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-2xl">

              Skip the Wait,<br />

      {/* Featured Items Section */}              <span className="text-vendorr-gold-400">Order Ahead</span>

      <Section className="bg-white py-16">            </h1>

        <ContentContainer>

          <div className="text-center mb-12">            <p className="text-xl md:text-2xl mb-8 font-medium text-white drop-shadow-lg max-w-3xl mx-auto">

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">              Pre-order your favorite meals from Vendorr and pick them up when they're ready.

              Today's Featured Items              No queues, no waiting, just delicious food on your schedule.

            </h2>            </p>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">

              Hand-picked favorites at great prices. Available for a limited time only.            {/* CTA Buttons */}

            </p>            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">

          </div>              <Link to="/menu">

                <Button

          <Grid cols="md:grid-cols-2 lg:grid-cols-3" gap="gap-8">                  variant="gold"

            {loading ? (                  size="lg"

              <div className="col-span-full text-center py-12">                  className="w-full sm:w-auto text-lg px-8 py-4 shadow-xl hover:scale-105 transition-transform"

                <p className="text-gray-600">Loading featured items...</p>                >

              </div>                  <Icons.ShoppingCart className="w-6 h-6 mr-3" />

            ) : featuredItems.length === 0 ? (                  Order Now

              <div className="col-span-full text-center py-12">                </Button>

                <p className="text-gray-600">No featured items available at the moment.</p>              </Link>

              </div>

            ) : (              <Link to="/menu">

              featuredItems.map((item) => (                <Button

                <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow group">                  variant="outline"

                  <div className="relative">                  size="lg"

                    <img                  className="w-full sm:w-auto text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-vendorr-blue-500"

                      src={item.image_url || '/assets/placeholder-food.svg'}                >

                      alt={item.name}                  <Icons.Search className="w-6 h-6 mr-3" />

                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"                  Browse Menu

                      onError={(e) => {                </Button>

                        e.target.src = '/assets/placeholder-food.svg'              </Link>

                      }}            </div>

                    />

                    <div className="absolute top-3 left-3">            {/* Quick Stats */}

                      <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mt-8">

                        Featured              {stats.map((stat, index) => (

                      </div>                <div key={index} className="text-center bg-vendorr-blue-600/90 backdrop-blur-md rounded-lg py-6 px-4 border-2 border-vendorr-gold-400 shadow-lg hover:bg-vendorr-blue-600 hover:shadow-xl transition-all hover:scale-105">

                    </div>                  <div className="text-3xl md:text-4xl font-extrabold text-vendorr-gold-400 mb-2 drop-shadow-lg">

                    <div className="absolute top-3 right-3">                    {stat.number}

                      <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-700">                  </div>

                        <Icons.Clock className="w-3 h-3 inline mr-1" />                  <div className="text-sm md:text-base font-semibold text-white">

                        {item.preparation_time} min                    {stat.label}

                      </div>                  </div>

                    </div>                </div>

                  </div>              ))}

            </div>

                  <div className="p-6">          </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">        </ContentContainer>

                      {item.name}      </Section>

                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-2">      {/* Today's Deals Section */}

                      {item.description}      <Section className="bg-white py-16">

                    </p>        <ContentContainer>

          <div className="text-center mb-12">

                    <div className="flex items-center justify-between mb-4">            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">

                      <span className="text-2xl font-bold text-blue-600">              Today's Featured Items

                        {formatPrice(item.price)}            </h2>

                      </span>            <p className="text-lg text-gray-600 max-w-2xl mx-auto">

                    </div>              Hand-picked favorites at great prices. Available for a limited time only.

            </p>

                    <Link to="/menu">          </div>

                      <Button variant="primary" size="sm" className="w-full">

                        Order Now          <Grid cols="md:grid-cols-2 lg:grid-cols-3" gap="gap-8">

                      </Button>            {loading ? (

                    </Link>              <div className="col-span-full text-center py-12">

                  </div>                <p className="text-gray-600">Loading featured items...</p>

                </Card>              </div>

              ))            ) : featuredItems.length === 0 ? (

            )}              <div className="col-span-full text-center py-12">

          </Grid>                <p className="text-gray-600">No featured items available at the moment.</p>

        </ContentContainer>              </div>

      </Section>            ) : (

              featuredItems.map((item) => (

      {/* How It Works Section */}                <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow group">

      <Section className="bg-gray-50 py-16">                  <div className="relative">

        <ContentContainer>                    <img

          <div className="text-center mb-12">                      src={item.image_url || '/assets/placeholder-food.svg'}

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">                      alt={item.name}

              How Vendorr Works                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"

            </h2>                      onError={(e) => {

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">                        e.target.src = '/assets/placeholder-food.svg'

              Ordering ahead has never been easier. Here's how you can skip the queue and get your food faster.                      }}

            </p>                    />

          </div>                    <div className="absolute top-3 left-3">

                      <div className="bg-vendorr-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">                        Featured

            {[                      </div>

              {                    </div>

                step: "1",                    <div className="absolute top-3 right-3">

                icon: Icons.Search,                      <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-700">

                title: "Browse Menu",                        <Icons.Clock className="w-3 h-3 inline mr-1" />

                description: "Choose from our selection of fresh, made-to-order meals"                        {item.preparation_time} min

              },                      </div>

              {                    </div>

                step: "2",                  </div>

                icon: Icons.Plus,

                title: "Add to Cart",                  <div className="p-6">

                description: "Customize your order and add items to your cart"                    <h3 className="text-xl font-semibold text-gray-900 mb-2">

              },                      {item.name}

              {                    </h3>

                step: "3",                    <p className="text-gray-600 mb-4 line-clamp-2">

                icon: Icons.CreditCard,                      {item.description}

                title: "Pay & Confirm",                    </p>

                description: "Secure payment with bank transfer and order confirmation"

              },                    <div className="flex items-center justify-between mb-4">

              {                        <span className="text-2xl font-bold text-vendorr-blue-500">

                step: "4",                          {formatPrice(item.price)}

                icon: Icons.Bell,                        </span>

                title: "Pickup Ready",                      </div>

                description: "Get notified when your order is ready for collection"

              }                                            <Link to={`/menu`}>

            ].map((step, index) => (                        <Button

              <div key={index} className="text-center">                          variant="primary"

                <div className="relative mb-6">                          size="sm"

                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">                          className="w-full"

                    <step.icon className="w-8 h-8 text-white" />                        >

                  </div>                          Order Now

                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">                        </Button>

                    {step.step}                      </Link>

                  </div>                    </div>

                </div>                  </Card>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">                ))

                  {step.title}            )}

                </h3>          </Grid>

                <p className="text-gray-600">        </ContentContainer>

                  {step.description}      </Section>

                </p>

              </div>      {/* How It Works Section */}

            ))}      <Section className="bg-gray-50 py-16">

          </div>        <ContentContainer>

          <div className="text-center mb-12">

          <div className="text-center">            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">

            <Link to={isAuthenticated ? "/menu" : "/register"}>              How Vendorr Works

              <Button variant="primary" size="lg" className="px-8">            </h2>

                {isAuthenticated ? "Start Ordering" : "Get Started"}            <p className="text-lg text-gray-600 max-w-2xl mx-auto">

              </Button>              Ordering ahead has never been easier. Here's how you can skip the queue and get your food faster.

            </Link>            </p>

          </div>          </div>

        </ContentContainer>

      </Section>          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

            {[

      {/* Features Section */}              {

      <Section className="bg-white py-16">                step: "1",

        <ContentContainer>                icon: Icons.Search,

          <div className="text-center mb-12">                title: "Browse Menu",

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">                description: "Choose from our selection of fresh, made-to-order meals"

              Why Choose Vendorr?              },

            </h2>              {

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">                step: "2",

              We're committed to making your dining experience faster, easier, and more enjoyable.                icon: Icons.Plus,

            </p>                title: "Add to Cart",

          </div>                description: "Customize your order and add items to your cart"

              },

          <Grid cols="md:grid-cols-2 lg:grid-cols-4" gap="gap-8">              {

            {[                step: "3",

              {                icon: Icons.CreditCard,

                icon: Icons.Clock,                title: "Pay & Confirm",

                title: "Skip the Queue",                description: "Secure payment with bank transfer and order confirmation"

                description: "Order ahead and skip waiting in line. Your food will be ready when you arrive."              },

              },              {

              {                step: "4",

                icon: Icons.Bell,                icon: Icons.Bell,

                title: "Real-time Updates",                title: "Pickup Ready",

                description: "Get notified when your order is ready for pickup with live status tracking."                description: "Get notified when your order is ready for collection"

              },              }

              {            ].map((step, index) => (

                icon: Icons.CreditCard,              <div key={index} className="text-center">

                title: "Secure Payments",                <div className="relative mb-6">

                description: "Pay securely with bank transfer and upload your proof of payment."                  <div className="w-16 h-16 bg-vendorr-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">

              },                    <step.icon className="w-8 h-8 text-white" />

              {                  </div>

                icon: Icons.Star,                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-vendorr-gold-500 rounded-full flex items-center justify-center text-vendorr-blue-500 font-bold text-sm">

                title: "Quality Guaranteed",                    {step.step}

                description: "Fresh ingredients, made-to-order meals with our quality guarantee."                  </div>

              }                </div>

            ].map((feature, index) => (                <h3 className="text-lg font-semibold text-gray-900 mb-2">

              <div key={index} className="text-center group">                  {step.title}

                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">                </h3>

                  <feature.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />                <p className="text-gray-600">

                </div>                  {step.description}

                <h3 className="text-lg font-semibold text-gray-900 mb-2">                </p>

                  {feature.title}              </div>

                </h3>            ))}

                <p className="text-gray-600">          </div>

                  {feature.description}

                </p>          <div className="text-center">

              </div>            <Link to={isAuthenticated ? "/menu" : "/register"}>

            ))}              <Button variant="primary" size="lg" className="px-8">

          </Grid>                {isAuthenticated ? "Start Ordering" : "Get Started"}

        </ContentContainer>              </Button>

      </Section>            </Link>

          </div>

      {/* Location Section */}        </ContentContainer>

      <Section className="bg-gray-900 text-white py-16">      </Section>

        <ContentContainer>

          <div className="max-w-4xl mx-auto">      {/* Features Section */}

            <h2 className="text-3xl font-bold mb-8 text-center">Visit Our Restaurant</h2>      <Section className="bg-white py-16">

            <div className="grid md:grid-cols-2 gap-8 items-start">        <ContentContainer>

              <div className="flex items-start space-x-4">          <div className="text-center mb-12">

                <Icons.MapPin className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">

                <div className="flex-1">              Why Choose Vendorr?

                  <h3 className="font-semibold mb-2 text-lg">Location</h3>            </h2>

                  <p className="text-gray-300 leading-relaxed">            <p className="text-lg text-gray-600 max-w-2xl mx-auto">

                    {restaurantSettings.restaurant_address}              We're committed to making your dining experience faster, easier, and more enjoyable.

                  </p>            </p>

                </div>          </div>

              </div>

          <Grid cols="md:grid-cols-2 lg:grid-cols-4" gap="gap-8">

              <div className="flex items-start space-x-4">            {features.map((feature, index) => (

                <Icons.Phone className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />              <div key={index} className="text-center group">

                <div className="flex-1">                <div className="w-16 h-16 bg-vendorr-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-vendorr-blue-500 transition-colors">

                  <h3 className="font-semibold mb-2 text-lg">Contact</h3>                  <feature.icon className="w-8 h-8 text-vendorr-blue-500 group-hover:text-white transition-colors" />

                  <p className="text-gray-300 leading-relaxed">                </div>

                    {restaurantSettings.restaurant_phone}                <h3 className="text-lg font-semibold text-gray-900 mb-2">

                    {restaurantSettings.restaurant_email && (                  {feature.title}

                      <>                </h3>

                        <br />                <p className="text-gray-600">

                        {restaurantSettings.restaurant_email}                  {feature.description}

                      </>                </p>

                    )}              </div>

                  </p>            ))}

                </div>          </Grid>

              </div>        </ContentContainer>

            </div>      </Section>

          </div>

        </ContentContainer>      {/* Location & Hours Section */}

      </Section>      <Section className="bg-gray-900 text-white py-16">

        <ContentContainer>

      {/* Final CTA Section */}          <div className="max-w-4xl mx-auto">

      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16">            <h2 className="text-3xl font-bold mb-8 text-center">Visit Our Restaurant</h2>

        <ContentContainer>            <div className="grid md:grid-cols-2 gap-8 items-start">

          <div className="text-center text-blue-900">              <div className="flex items-start space-x-4">

            <h2 className="text-3xl md:text-4xl font-bold mb-4">                <Icons.MapPin className="w-6 h-6 text-vendorr-gold-400 mt-1 flex-shrink-0" />

              Ready to Skip the Queue?                <div className="flex-1">

            </h2>                  <h3 className="font-semibold mb-2 text-lg">Location</h3>

            <p className="text-lg mb-8 max-w-2xl mx-auto">                  <p className="text-gray-300 leading-relaxed">

              Join thousands of satisfied customers who save time with Vendorr.                    {restaurantSettings.restaurant_address}

              Start your order today and experience the convenience.                  </p>

            </p>                </div>

              </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <Link to={isAuthenticated ? "/menu" : "/register"}>              <div className="flex items-start space-x-4">

                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-xl hover:bg-blue-700 hover:scale-105 transition-all">                <Icons.Phone className="w-6 h-6 text-vendorr-gold-400 mt-1 flex-shrink-0" />

                  {isAuthenticated ? (                <div className="flex-1">

                    <>                  <h3 className="font-semibold mb-2 text-lg">Contact</h3>

                      <Icons.ShoppingCart className="w-6 h-6 inline mr-3" />                  <p className="text-gray-300 leading-relaxed">

                      Browse Menu                    {restaurantSettings.restaurant_phone}

                    </>                    {restaurantSettings.restaurant_email && (

                  ) : (                      <>

                    <>                        <br />

                      <Icons.User className="w-6 h-6 inline mr-3" />                        {restaurantSettings.restaurant_email}

                      Create Account                      </>

                    </>                    )}

                  )}                  </p>

                </button>                </div>

              </Link>              </div>

            </div>

              {!isAuthenticated && (          </div>

                <Link to="/login">        </ContentContainer>

                  <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all">      </Section>

                    Sign In

                  </button>      {/* Call to Action Section */}

                </Link>      <Section className="bg-gradient-to-r from-vendorr-gold-400 to-vendorr-gold-500 py-16">

              )}        <ContentContainer>

            </div>          <div className="text-center text-vendorr-blue-500">

          </div>            <h2 className="text-3xl md:text-4xl font-bold mb-4">

        </ContentContainer>              Ready to Skip the Queue?

      </div>            </h2>

    </PageContainer>            <p className="text-lg mb-8 max-w-2xl mx-auto">

  )              Join thousands of satisfied customers who save time with Vendorr.

}              Start your order today and experience the convenience.

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
