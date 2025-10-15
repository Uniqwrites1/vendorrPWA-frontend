import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Section, ContentContainer } from '../components/Layout';
import { Card, Button, Typography } from '../design-system/components';
import { Icons } from '../design-system/icons';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load user data
    if (user) {
      setFormData({
        name: user.name || user.full_name || '',
        email: user.email || '',
        phone: user.phone || user.phone_number || '',
        address: user.address || ''
      });
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // TODO: Implement API call to update user profile
      // await api.updateProfile(formData);

      // For now, just show success message
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: {
          title: 'Success',
          message: 'Profile updated successfully',
          type: 'success'
        }
      }));

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: {
          title: 'Error',
          message: 'Failed to update profile. Please try again.',
          type: 'error'
        }
      }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <PageContainer>
      <Section className="min-h-screen bg-gray-50 py-8">
        <ContentContainer>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-vendorr-blue hover:text-vendorr-blue-dark transition-colors mr-4"
              >
                <Icons.ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <Typography variant="h1" className="text-2xl font-bold text-gray-900">
                My Profile
              </Typography>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Profile Card */}
            <Card className="p-6 mb-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-vendorr-blue text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1">
                  <Typography variant="h2" className="text-xl font-semibold text-gray-900">
                    {formData.name || 'User'}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {formData.email}
                  </Typography>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center"
                  >
                    <Icons.Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendorr-blue focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendorr-blue focus:border-transparent bg-gray-50"
                      placeholder="your@email.com"
                      disabled
                    />
                    <Typography variant="body2" className="text-gray-500 text-xs mt-1">
                      Email cannot be changed
                    </Typography>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendorr-blue focus:border-transparent"
                      placeholder="+234 800 000 0000"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendorr-blue focus:border-transparent"
                      placeholder="Enter your delivery address"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" variant="primary" className="flex-1">
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form data
                        if (user) {
                          setFormData({
                            name: user.name || user.full_name || '',
                            email: user.email || '',
                            phone: user.phone || user.phone_number || '',
                            address: user.address || ''
                          });
                        }
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Typography variant="body2" className="text-gray-600 text-sm">
                          Phone Number
                        </Typography>
                        <Typography variant="body1" className="text-gray-900 font-medium">
                          {formData.phone || 'Not provided'}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body2" className="text-gray-600 text-sm">
                          Delivery Address
                        </Typography>
                        <Typography variant="body1" className="text-gray-900 font-medium">
                          {formData.address || 'Not provided'}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 mb-6">
              <Typography variant="h3" className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </Typography>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <Icons.ShoppingBag className="w-5 h-5 text-vendorr-blue mr-3" />
                    <span className="text-gray-900 font-medium">My Orders</span>
                  </div>
                  <Icons.ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button
                  onClick={() => navigate('/menu')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <Icons.ChefHat className="w-5 h-5 text-vendorr-blue mr-3" />
                    <span className="text-gray-900 font-medium">Browse Menu</span>
                  </div>
                  <Icons.ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </Card>

            {/* Account Settings */}
            <Card className="p-6">
              <Typography variant="h3" className="text-lg font-semibold text-gray-900 mb-4">
                Account Settings
              </Typography>
              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center">
                    <Icons.LogOut className="w-5 h-5 text-red-600 mr-3" />
                    <span className="text-red-600 font-medium">Sign Out</span>
                  </div>
                  <Icons.ChevronRight className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </Card>
          </div>
        </ContentContainer>
      </Section>
    </PageContainer>
  );
};

export default ProfilePage;
