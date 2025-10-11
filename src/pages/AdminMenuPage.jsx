import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Navbar,
  PageContainer,
  ContentContainer,
  Section
} from '../components'
import {
  Button,
  Card,
  Typography,
  Badge
} from '../design-system/components'
import { Icons } from '../design-system/icons'

export default function AdminMenuPage() {
  const navigate = useNavigate()
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  // Mock data - replace with actual API calls
  useEffect(() => {
    setTimeout(() => {
      const mockCategories = [
        { id: 1, name: 'Burgers', count: 8 },
        { id: 2, name: 'Wraps', count: 6 },
        { id: 3, name: 'Salads', count: 4 },
        { id: 4, name: 'Sides', count: 5 },
        { id: 5, name: 'Beverages', count: 3 }
      ]

      const mockMenuItems = [
        {
          id: 1,
          name: 'Grilled Chicken Burger',
          description: 'Juicy grilled chicken breast with lettuce, tomato, and our special sauce',
          price: 89.99,
          category: 'Burgers',
          categoryId: 1,
          image: '/assets/burger-special.jpg',
          available: true,
          preparationTime: 12,
          allergens: ['Gluten', 'Dairy'],
          calories: 650,
          popularity: 95
        },
        {
          id: 2,
          name: 'Beef Wrap',
          description: 'Tender beef strips with fresh vegetables wrapped in a soft tortilla',
          price: 75.99,
          category: 'Wraps',
          categoryId: 2,
          image: '/assets/wrap-special.jpg',
          available: true,
          preparationTime: 8,
          allergens: ['Gluten'],
          calories: 580,
          popularity: 87
        },
        {
          id: 3,
          name: 'Caesar Salad',
          description: 'Fresh romaine lettuce with parmesan cheese and croutons',
          price: 45.00,
          category: 'Salads',
          categoryId: 3,
          image: '/assets/placeholder-food.jpg',
          available: true,
          preparationTime: 5,
          allergens: ['Dairy', 'Gluten'],
          calories: 320,
          popularity: 78
        },
        {
          id: 4,
          name: 'Crispy Fries',
          description: 'Golden crispy potato fries seasoned to perfection',
          price: 34.99,
          category: 'Sides',
          categoryId: 4,
          image: '/assets/placeholder-food.jpg',
          available: true,
          preparationTime: 6,
          allergens: [],
          calories: 420,
          popularity: 92
        },
        {
          id: 5,
          name: 'Loaded Nachos',
          description: 'Crispy tortilla chips topped with cheese, jalapeños, and sour cream',
          price: 65.99,
          category: 'Sides',
          categoryId: 4,
          image: '/assets/nachos-special.jpg',
          available: false,
          preparationTime: 10,
          allergens: ['Dairy'],
          calories: 740,
          popularity: 85
        },
        {
          id: 6,
          name: 'Soft Drink',
          description: 'Refreshing carbonated beverage - Various flavors available',
          price: 14.00,
          category: 'Beverages',
          categoryId: 5,
          image: '/assets/placeholder-food.jpg',
          available: true,
          preparationTime: 1,
          allergens: [],
          calories: 150,
          popularity: 70
        }
      ]

      setCategories(mockCategories)
      setMenuItems(mockMenuItems)
      setLoading(false)
    }, 1000)
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price)
  }

  const toggleAvailability = (itemId) => {
    setMenuItems(menuItems.map(item =>
      item.id === itemId
        ? { ...item, available: !item.available }
        : item
    ))
  }

  const deleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      setMenuItems(menuItems.filter(item => item.id !== itemId))
    }
  }

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.categoryId.toString() === selectedCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  const ItemModal = ({ item, onClose, onSave }) => {
    const [formData, setFormData] = useState(item || {
      name: '',
      description: '',
      price: '',
      categoryId: 1,
      image: '',
      available: true,
      preparationTime: '',
      allergens: [],
      calories: ''
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      onSave({
        ...formData,
        id: item?.id || Date.now(),
        category: categories.find(c => c.id === parseInt(formData.categoryId))?.name || 'Uncategorized',
        popularity: item?.popularity || 0
      })
      onClose()
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Typography.H3>{item ? 'Edit Menu Item' : 'Add New Menu Item'}</Typography.H3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <Icons.X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendorr-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (ZAR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendorr-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendorr-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendorr-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prep Time (min)
                  </label>
                  <input
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({...formData, preparationTime: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendorr-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calories
                  </label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({...formData, calories: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendorr-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendorr-blue-500 focus:border-transparent"
                  placeholder="/assets/placeholder-food.jpg"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({...formData, available: e.target.checked})}
                  className="w-4 h-4 text-vendorr-blue-500 border-gray-300 rounded focus:ring-vendorr-blue-500"
                />
                <label htmlFor="available" className="ml-2 text-sm text-gray-700">
                  Available for ordering
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {item ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const saveItem = (itemData) => {
    if (editingItem) {
      setMenuItems(menuItems.map(item =>
        item.id === editingItem.id ? itemData : item
      ))
    } else {
      setMenuItems([...menuItems, itemData])
    }
    setEditingItem(null)
    setShowAddModal(false)
  }

  if (loading) {
    return (
      <PageContainer>
        <Navbar />
        <Section className="py-16">
          <ContentContainer>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendorr-blue-500 mx-auto mb-4"></div>
              <Typography.Body>Loading menu...</Typography.Body>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                className="mb-4"
              >
                <Icons.ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Typography.H1>Menu Management</Typography.H1>
              <Typography.Body className="text-gray-600 mt-2">
                Manage your restaurant menu items and categories
              </Typography.Body>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Menu Item
              </Button>
            </div>
          </div>
        </ContentContainer>
      </Section>

      {/* Filters and Search */}
      <Section className="py-6">
        <ContentContainer>
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-vendorr-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Items ({menuItems.length})
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id.toString())}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id.toString()
                        ? 'bg-vendorr-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendorr-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </Card>
        </ContentContainer>
      </Section>

      {/* Menu Items Grid */}
      <Section className="pb-8">
        <ContentContainer>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/placeholder-food.jpg'
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className={item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      {item.popularity}% Popular
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-3">
                    <Typography.H4 className="mb-1">{item.name}</Typography.H4>
                    <Typography.Small className="text-gray-600 mb-2">{item.category}</Typography.Small>
                    <Typography.Body className="text-gray-700 text-sm line-clamp-2">
                      {item.description}
                    </Typography.Body>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <Typography.Body className="font-bold text-vendorr-blue-500 text-lg">
                      {formatPrice(item.price)}
                    </Typography.Body>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Icons.Clock className="w-4 h-4" />
                      <span>{item.preparationTime} min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      {item.calories} calories
                    </div>
                    {item.allergens.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.allergens.map((allergen, index) => (
                          <Badge key={index} className="text-xs bg-yellow-100 text-yellow-800">
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingItem(item)}
                      className="flex-1"
                    >
                      <Icons.Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAvailability(item.id)}
                      className="flex-1"
                    >
                      {item.available ? (
                        <>
                          <Icons.EyeOff className="w-4 h-4 mr-1" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Icons.Eye className="w-4 h-4 mr-1" />
                          Show
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Icons.Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <Card className="p-12 text-center">
              <Icons.Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <Typography.Body className="text-gray-600">
                No menu items found matching your criteria
              </Typography.Body>
            </Card>
          )}
        </ContentContainer>
      </Section>

      {/* Modals */}
      {(showAddModal || editingItem) && (
        <ItemModal
          item={editingItem}
          onClose={() => {
            setShowAddModal(false)
            setEditingItem(null)
          }}
          onSave={saveItem}
        />
      )}
    </PageContainer>
  )
}
