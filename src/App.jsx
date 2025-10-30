import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { NotificationProvider } from './context/NotificationContext'
import ToastContainer from './components/ToastContainer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderStatusPage from './pages/OrderStatusPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import PaymentUploadPage from './pages/PaymentUploadPage'
import ProfilePage from './pages/ProfilePage'
import AdminDashboard from './pages/AdminDashboard'
import AdminOrdersPage from './pages/AdminOrdersPage'
import AdminOrderDetailsPage from './pages/AdminOrderDetailsPage'
import AdminMenuPage from './pages/AdminMenuPage'
import ComponentDemo from './pages/ComponentDemo'
import './App.css'

// Placeholder parts for other pages
const PlaceholderPage = ({ title }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600">This page is coming soon!</p>
    </div>
  </div>
)

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/orders/:orderId/payment" element={<PaymentUploadPage />} />
              <Route path="/orders" element={<OrderHistoryPage />} />
              <Route path="/orders/:orderId" element={<OrderStatusPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/orders/:orderId" element={<AdminOrderDetailsPage />} />
              <Route path="/admin/menu" element={<AdminMenuPage />} />
              <Route path="/admin/customers" element={<PlaceholderPage title="Customer Management" />} />
              <Route path="/admin/reports" element={<PlaceholderPage title="Reports & Analytics" />} />
              <Route path="/demo" element={<ComponentDemo />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
            </Routes>
            <ToastContainer />
            <FloatingWhatsApp />
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
