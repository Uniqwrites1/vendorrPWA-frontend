import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Input,
  Typography,
  LoadingSpinner
} from '../design-system/components';
import { Icons } from '../design-system/icons';
import { settings as settingsAPI } from '../services/api';

const AdminSettingsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    whatsapp_link: '',
    whatsapp_enabled: true
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load current settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await settingsAPI.getSettings();
        setSettings(response.data);
      } catch (error) {
        console.error('Error loading settings:', error);
        setErrorMessage('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await settingsAPI.updateSettings(settings);
      setSuccessMessage('Settings saved successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setErrorMessage('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <Icons.ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <Typography variant="h1" className="text-3xl font-bold text-gray-900">
            Settings
          </Typography>
          <Typography variant="body1" className="text-gray-600 mt-2">
            Manage your application settings
          </Typography>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
            <Icons.CheckCircle className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
            <Icons.AlertCircle className="w-5 h-5 mr-2" />
            {errorMessage}
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSubmit}>
          {/* WhatsApp Settings Card */}
          <Card className="p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <Icons.MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <Typography variant="h3" className="text-xl font-semibold text-gray-900">
                  WhatsApp Support
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Configure the floating WhatsApp button for customer support
                </Typography>
              </div>
            </div>

            <div className="space-y-4">
              {/* Enable/Disable Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Typography variant="body1" className="font-medium text-gray-900">
                    Enable WhatsApp Button
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Show floating WhatsApp button on all pages
                  </Typography>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.whatsapp_enabled}
                    onChange={(e) => handleChange('whatsapp_enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              {/* WhatsApp Link Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Link
                </label>
                <Input
                  type="url"
                  value={settings.whatsapp_link}
                  onChange={(e) => handleChange('whatsapp_link', e.target.value)}
                  placeholder="https://wa.me/qr/EKAYKJ7XOVOTP1"
                  required
                  className="w-full"
                />
                <Typography variant="body2" className="text-gray-500 mt-2">
                  Enter your WhatsApp chat link or QR code link
                </Typography>
              </div>

              {/* Preview */}
              {settings.whatsapp_link && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Typography variant="body2" className="font-medium text-blue-900 mb-2">
                    Preview:
                  </Typography>
                  <a
                    href={settings.whatsapp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {settings.whatsapp_link}
                  </a>
                </div>
              )}

              {/* Instructions */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <Typography variant="body2" className="font-medium text-gray-900 mb-2">
                  How to get your WhatsApp link:
                </Typography>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Open WhatsApp Business on your phone</li>
                  <li>Go to Settings → Business Tools → Short Link</li>
                  <li>Create or copy your business link</li>
                  <li>Paste it in the field above</li>
                </ol>
                <Typography variant="body2" className="text-gray-600 mt-3">
                  Or use format: <code className="bg-gray-200 px-2 py-1 rounded text-xs">https://wa.me/2349064554795</code>
                </Typography>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving || !settings.whatsapp_link}
              className="min-w-[120px]"
            >
              {saving ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
