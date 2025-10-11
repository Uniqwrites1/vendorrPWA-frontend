import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { auth as authAPI } from '../services/api'
import { RESTAURANT_INFO } from '../constants'

// Auth action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING'
}

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('vendorr_token'),
  isAuthenticated: false,
  isLoading: true,
  error: null
}

// Auth reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.access_token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      }

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      }

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }

    default:
      return state
  }
}

// Create context
const AuthContext = createContext()

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('vendorr_token')

      if (token) {
        try {
          // Verify token and get user info
          const response = await authAPI.getCurrentUser()
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user: response.data,
              access_token: token
            }
          })
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('vendorr_token')
          dispatch({ type: AUTH_ACTIONS.LOGOUT })
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START })

      const response = await authAPI.login(credentials)
      const { access_token, user } = response.data

      // Store token in localStorage
      localStorage.setItem('vendorr_token', access_token)

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, access_token }
      })

      return { success: true, user }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed'
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      })
      return { success: false, error: errorMessage }
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START })

      const response = await authAPI.register(userData)

      // Auto-login after registration
      if (response.data.success) {
        const loginResult = await login({
          email: userData.email,
          password: userData.password
        })
        return loginResult
      }

      return { success: true, message: 'Registration successful' }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Registration failed'
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage
      })
      return { success: false, error: errorMessage }
    }
  }

  // OAuth login function
  const oauthLogin = async (provider, accessToken) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START })

      const response = await authAPI.oauth({
        provider,
        access_token: accessToken
      })

      const { access_token, user } = response.data
      localStorage.setItem('vendorr_token', access_token)

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, access_token }
      })

      return { success: true, user }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'OAuth login failed'
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      })
      return { success: false, error: errorMessage }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint
      await authAPI.logout()
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
    } finally {
      // Always clear local state and storage
      localStorage.removeItem('vendorr_token')
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
    }
  }

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData)

      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: response.data
      })

      return { success: true, user: response.data }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Profile update failed'
      return { success: false, error: errorMessage }
    }
  }

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authAPI.changePassword({
        current_password: currentPassword,
        new_password: newPassword
      })

      return { success: true, message: response.data.message }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Password change failed'
      return { success: false, error: errorMessage }
    }
  }

  // Refresh token
  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken()
      const { access_token, user } = response.data

      localStorage.setItem('vendorr_token', access_token)

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, access_token }
      })

      return { success: true }
    } catch (error) {
      // If refresh fails, logout user
      logout()
      return { success: false }
    }
  }

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user?.role === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(state.user?.role)
  }

  // Check if user is staff (kitchen, counter, manager, admin)
  const isStaff = () => {
    // Temporary: Allow any authenticated user to access admin for testing
    return state.isAuthenticated
    // Original: return hasAnyRole(['kitchen_staff', 'counter_staff', 'manager', 'admin'])
  }

  // Check if user is admin or manager
  const isManager = () => {
    return hasAnyRole(['manager', 'admin'])
  }

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin')
  }

  // Context value
  const value = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    login,
    register,
    oauthLogin,
    logout,
    updateProfile,
    changePassword,
    refreshToken,

    // Role checks
    hasRole,
    hasAnyRole,
    isStaff,
    isManager,
    isAdmin,

    // Clear error
    clearError: () => dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: null })
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

// HOC for protecting routes
export function withAuth(Component, requiredRoles = []) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading, user, hasAnyRole } = useAuth()

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse-gold">
            <div className="h-12 w-12 bg-vendorr-gold rounded-full"></div>
          </div>
        </div>
      )
    }

    if (!isAuthenticated) {
      // Redirect to login page
      window.location.href = '/login'
      return null
    }

    if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-vendorr-blue mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}

export default AuthContext
