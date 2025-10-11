import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

// Hook for handling login form
export function useLogin() {
  const { login, isLoading, error } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [localError, setLocalError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear errors when user starts typing
    if (localError) setLocalError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    // Basic validation
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields')
      return
    }

    const result = await login(formData)

    if (!result.success) {
      setLocalError(result.error)
    }

    return result
  }

  const resetForm = () => {
    setFormData({ email: '', password: '' })
    setLocalError('')
  }

  return {
    formData,
    handleChange,
    handleSubmit,
    resetForm,
    isLoading,
    error: localError || error
  }
}

// Hook for handling registration form
export function useRegister() {
  const { register, isLoading, error } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  })
  const [localError, setLocalError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear errors when user starts typing
    if (localError) setLocalError('')
  }

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setLocalError('Please fill in all required fields')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match')
      return false
    }

    if (formData.password.length < 8) {
      setLocalError('Password must be at least 8 characters long')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!validateForm()) {
      return
    }

    // Prepare data for API
    const userData = {
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirmPassword,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone || null
    }

    const result = await register(userData)

    if (!result.success) {
      setLocalError(result.error)
    }

    return result
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: ''
    })
    setLocalError('')
  }

  return {
    formData,
    handleChange,
    handleSubmit,
    resetForm,
    isLoading,
    error: localError || error
  }
}

// Hook for handling profile updates
export function useProfile() {
  const { user, updateProfile, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  })
  const [localError, setLocalError] = useState('')
  const [success, setSuccess] = useState('')

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone || '',
        email: user.email || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear messages when user starts typing
    if (localError) setLocalError('')
    if (success) setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    setSuccess('')

    // Prepare data for API
    const userData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone || null,
      email: formData.email
    }

    const result = await updateProfile(userData)

    if (result.success) {
      setSuccess('Profile updated successfully')
    } else {
      setLocalError(result.error)
    }

    return result
  }

  return {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    error: localError,
    success
  }
}

// Hook for handling password changes
export function usePasswordChange() {
  const { changePassword } = useAuth()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [localError, setLocalError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear messages when user starts typing
    if (localError) setLocalError('')
    if (success) setSuccess('')
  }

  const validateForm = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setLocalError('Please fill in all fields')
      return false
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setLocalError('New passwords do not match')
      return false
    }

    if (formData.newPassword.length < 8) {
      setLocalError('New password must be at least 8 characters long')
      return false
    }

    if (formData.currentPassword === formData.newPassword) {
      setLocalError('New password must be different from current password')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    setSuccess('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    const result = await changePassword(formData.currentPassword, formData.newPassword)

    if (result.success) {
      setSuccess('Password changed successfully')
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } else {
      setLocalError(result.error)
    }

    setIsLoading(false)
    return result
  }

  const resetForm = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setLocalError('')
    setSuccess('')
  }

  return {
    formData,
    handleChange,
    handleSubmit,
    resetForm,
    isLoading,
    error: localError,
    success
  }
}

// Hook for role-based access control
export function useRoleAccess(allowedRoles = []) {
  const { user, hasAnyRole, isLoading } = useAuth()

  const hasAccess = allowedRoles.length === 0 || hasAnyRole(allowedRoles)

  return {
    hasAccess,
    isLoading,
    user,
    userRole: user?.role
  }
}

// Hook for auto-logout on token expiration
export function useTokenExpiry() {
  const { refreshToken, logout, token } = useAuth()

  useEffect(() => {
    if (!token) return

    // Parse token to get expiry time
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expiryTime = payload.exp * 1000 // Convert to milliseconds
      const currentTime = Date.now()
      const timeUntilExpiry = expiryTime - currentTime

      if (timeUntilExpiry <= 0) {
        // Token already expired
        logout()
        return
      }

      // Set timeout to refresh token 5 minutes before expiry
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0)

      const timeoutId = setTimeout(async () => {
        const result = await refreshToken()
        if (!result.success) {
          logout()
        }
      }, refreshTime)

      return () => clearTimeout(timeoutId)
    } catch (error) {
      console.error('Error parsing token:', error)
      logout()
    }
  }, [token, refreshToken, logout])
}

// Hook for handling OAuth login
export function useOAuth() {
  const { oauthLogin } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleOAuthLogin = async (provider, accessToken) => {
    setIsLoading(true)
    setError('')

    const result = await oauthLogin(provider, accessToken)

    if (!result.success) {
      setError(result.error)
    }

    setIsLoading(false)
    return result
  }

  return {
    handleOAuthLogin,
    isLoading,
    error
  }
}
