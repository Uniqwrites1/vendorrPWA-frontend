import React, { useState, useEffect, useMemo } from 'react';
import {
  PageContainer,
  Section
} from '../components';
import {
  Card,
  Button,
  Input,
  Badge,
  LoadingSpinner,
  Typography
} from '../design-system/components';
import { Icons } from '../design-system/icons';
import Navbar from '../components/Navbar';
import MenuItemCard from '../components/MenuItemCard';
import CustomizationModal from '../components/CustomizationModal';
import { menu as menuAPI } from '../services/api';

// Mock menu data - will be replaced with API calls
const MOCK_MENU_DATA = [
  {
    id: 1,
    name: "Signature Beef Burger",
    description: "Grass-fed beef patty with aged cheddar, crispy bacon, lettuce, tomato, and our special sauce",
    price: 16.99,
    image: "/assets/placeholder-food.svg",
    category: "burgers",
    dietary: ["gluten-free-option"],
    spiceLevel: 1,
    prepTime: 12,
    rating: 4.8,
    reviewCount: 127,
    popular: true,
    ingredients: ["beef", "cheddar", "bacon", "lettuce", "tomato", "brioche bun"],
    allergens: ["gluten", "dairy"],
    calories: 680,
    is_available: true
  },
  {
    id: 2,
    name: "Truffle Mushroom Risotto",
    description: "Creamy arborio rice with wild mushrooms, truffle oil, parmesan, and fresh herbs",
    price: 22.99,
    image: "/assets/placeholder-food.svg",
    category: "mains",
    dietary: ["vegetarian", "gluten-free"],
    spiceLevel: 0,
    prepTime: 18,
    rating: 4.9,
    reviewCount: 89,
    popular: true,
    ingredients: ["arborio rice", "mushrooms", "truffle oil", "parmesan", "herbs"],
    allergens: ["dairy"],
    calories: 520,
    is_available: true
  },
  {
    id: 3,
    name: "Spicy Thai Curry",
    description: "Coconut curry with your choice of protein, jasmine rice, and fresh vegetables",
    price: 18.99,
    image: "/assets/placeholder-food.svg",
    category: "mains",
    dietary: ["vegan-option", "gluten-free"],
    spiceLevel: 3,
    prepTime: 15,
    rating: 4.7,
    reviewCount: 156,
    popular: false,
    ingredients: ["coconut milk", "curry paste", "vegetables", "jasmine rice"],
    allergens: [],
    calories: 445,
    is_available: true
  },
  {
    id: 4,
    name: "Caesar Salad",
    description: "Crisp romaine lettuce, croutons, parmesan cheese, and house-made caesar dressing",
    price: 12.99,
    image: "/assets/placeholder-food.svg",
    category: "salads",
    dietary: ["vegetarian"],
    spiceLevel: 0,
    prepTime: 8,
    rating: 4.5,
    reviewCount: 203,
    popular: false,
    ingredients: ["romaine lettuce", "croutons", "parmesan", "caesar dressing"],
    allergens: ["gluten", "dairy", "eggs"],
    calories: 320,
    is_available: true
  },
  {
    id: 5,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 8.99,
    image: "/assets/placeholder-food.svg",
    category: "desserts",
    dietary: ["vegetarian"],
    spiceLevel: 0,
    prepTime: 10,
    rating: 4.9,
    reviewCount: 91,
    popular: true,
    ingredients: ["chocolate", "flour", "butter", "eggs", "vanilla ice cream"],
    allergens: ["gluten", "dairy", "eggs"],
    calories: 580,
    is_available: true
  },
  {
    id: 6,
    name: "Craft Beer Selection",
    description: "Rotating selection of local and imported craft beers",
    price: 6.99,
    image: "/assets/placeholder-food.svg",
    category: "beverages",
    dietary: ["vegan"],
    spiceLevel: 0,
    prepTime: 2,
    rating: 4.6,
    reviewCount: 78,
    popular: false,
    ingredients: ["hops", "malt", "yeast", "water"],
    allergens: ["gluten"],
    calories: 180,
    is_available: true
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: '🍽️' },
  { id: 'appetizers', name: 'Appetizers', icon: '🥗' },
  { id: 'salads', name: 'Salads', icon: '🥬' },
  { id: 'burgers', name: 'Burgers', icon: '🍔' },
  { id: 'mains', name: 'Main Courses', icon: '🍖' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
  { id: 'beverages', name: 'Beverages', icon: '🥤' }
];

const DIETARY_FILTERS = [
  { id: 'vegetarian', name: 'Vegetarian', icon: <Icons.Leaf className="w-4 h-4" /> },
  { id: 'vegan', name: 'Vegan', icon: <Icons.Leaf className="w-4 h-4" /> },
  { id: 'vegan-option', name: 'Vegan Option', icon: <Icons.Leaf className="w-4 h-4" /> },
  { id: 'gluten-free', name: 'Gluten Free', icon: <Icons.Leaf className="w-4 h-4" /> },
  { id: 'gluten-free-option', name: 'Gluten Free Option', icon: <Icons.Leaf className="w-4 h-4" /> }
];

const SPICE_LEVELS = [
  { id: 0, name: 'Mild', icon: '🌶️' },
  { id: 1, name: 'Medium', icon: '🌶️🌶️' },
  { id: 2, name: 'Hot', icon: '🌶️🌶️🌶️' },
  { id: 3, name: 'Very Hot', icon: '🌶️🌶️🌶️🌶️' }
];

const PRICE_RANGES = [
  { id: 'under-15', name: 'Under $15', min: 0, max: 15 },
  { id: '15-25', name: '$15 - $25', min: 15, max: 25 },
  { id: 'over-25', name: 'Over $25', min: 25, max: Infinity }
];

const SORT_OPTIONS = [
  { id: 'popular', name: 'Most Popular' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'rating', name: 'Highest Rated' },
  { id: 'prep-time', name: 'Fastest Prep Time' }
];

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietaryFilters, setSelectedDietaryFilters] = useState([]);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCustomization, setShowCustomization] = useState(false);

  // Load menu data from API
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setLoading(true);

        // Load categories and items in parallel
        const [categoriesResponse, itemsResponse] = await Promise.all([
          menuAPI.getCategories(),
          menuAPI.getMenuItems()
        ]);

        // Add "All Items" category at the beginning
        const allCategories = [
          { id: 'all', name: 'All Items', icon: '🍽️' },
          ...categoriesResponse.data.map(cat => ({
            id: cat.id,
            name: cat.name,
            icon: cat.icon || '🍽️'
          }))
        ];

        setCategories(allCategories);
        setMenuItems(itemsResponse.data);
      } catch (error) {
        console.error('Error loading menu data:', error);
        // Fallback to mock data if API fails
        setCategories(CATEGORIES);
        setMenuItems(MOCK_MENU_DATA);
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, []);

  // Filter and sort menu items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = menuItems;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category_id == selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))
      );
    }

    // Dietary filters
    if (selectedDietaryFilters.length > 0) {
      filtered = filtered.filter(item =>
        selectedDietaryFilters.every(filter =>
          item.dietary.includes(filter) || item.dietary.includes(filter + '-option')
        )
      );
    }

    // Spice level filter
    if (selectedSpiceLevel !== null) {
      filtered = filtered.filter(item => item.spiceLevel <= selectedSpiceLevel);
    }

    // Price range filter
    if (selectedPriceRange) {
      filtered = filtered.filter(item =>
        item.price >= selectedPriceRange.min && item.price <= selectedPriceRange.max
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          if (a.popular !== b.popular) return b.popular - a.popular;
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'prep-time':
          return a.prepTime - b.prepTime;
        default:
          return 0;
      }
    });

    return filtered;
  }, [menuItems, selectedCategory, searchQuery, selectedDietaryFilters, selectedSpiceLevel, selectedPriceRange, sortBy]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowCustomization(true);
  };

  const handleDietaryFilterToggle = (filterId) => {
    setSelectedDietaryFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedDietaryFilters([]);
    setSelectedSpiceLevel(null);
    setSelectedPriceRange(null);
    setSortBy('popular');
  };

  const activeFilterCount = [
    selectedCategory !== 'all' ? 1 : 0,
    searchQuery ? 1 : 0,
    selectedDietaryFilters.length,
    selectedSpiceLevel !== null ? 1 : 0,
    selectedPriceRange ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

  if (loading) {
    return (
      <PageContainer>
        <Navbar />
        <Section className="py-20">
          <div className="flex justify-center">
            <LoadingSpinner size="large" />
          </div>
        </Section>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Navbar />

      {/* Header Section */}
      <Section className="bg-gradient-to-r from-vendorr-blue-50 to-white py-12">
        <div className="max-w-7xl mx-auto">
          <Typography variant="h1" className="text-center mb-4">
            Our Menu
          </Typography>
          <Typography variant="body1" className="text-center text-gray-600 max-w-2xl mx-auto">
            Discover our carefully crafted dishes made with fresh, locally-sourced ingredients.
            Filter by your preferences and find your perfect meal.
          </Typography>
        </div>
      </Section>

      {/* Search and Filters */}
      <Section className="py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search menu items, ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {/* Filter Toggle and Sort */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Icons.Filter className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="primary" className="ml-2">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendorr-blue-500 focus:border-transparent"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <span>{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <Card className="p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Dietary Restrictions */}
                <div>
                  <Typography variant="h6" className="mb-3">Dietary Preferences</Typography>
                  <div className="space-y-2">
                    {DIETARY_FILTERS.map(filter => (
                      <label key={filter.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDietaryFilters.includes(filter.id)}
                          onChange={() => handleDietaryFilterToggle(filter.id)}
                          className="rounded border-gray-300 text-vendorr-blue-600 focus:ring-vendorr-blue-500"
                        />
                        <span className="flex items-center gap-2">
                          {filter.icon}
                          {filter.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Spice Level */}
                <div>
                  <Typography variant="h6" className="mb-3">Max Spice Level</Typography>
                  <div className="space-y-2">
                    {SPICE_LEVELS.map(level => (
                      <label key={level.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="spiceLevel"
                          checked={selectedSpiceLevel === level.id}
                          onChange={() => setSelectedSpiceLevel(level.id)}
                          className="border-gray-300 text-vendorr-blue-600 focus:ring-vendorr-blue-500"
                        />
                        <span className="flex items-center gap-2">
                          <span>{level.icon}</span>
                          {level.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <Typography variant="h6" className="mb-3">Price Range</Typography>
                  <div className="space-y-2">
                    {PRICE_RANGES.map(range => (
                      <label key={range.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={selectedPriceRange?.id === range.id}
                          onChange={() => setSelectedPriceRange(range)}
                          className="border-gray-300 text-vendorr-blue-600 focus:ring-vendorr-blue-500"
                        />
                        <span>{range.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4">
            <Typography variant="body2" className="text-gray-600">
              Showing {filteredAndSortedItems.length} of {menuItems.length} items
            </Typography>
            {activeFilterCount > 0 && (
              <Button variant="ghost" onClick={clearAllFilters} className="text-sm">
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </Section>

      {/* Menu Items Grid */}
      <Section className="py-8">
        <div className="max-w-7xl mx-auto">
          {filteredAndSortedItems.length === 0 ? (
            <Card className="p-12 text-center">
              <Typography variant="h3" className="mb-4">No items found</Typography>
              <Typography variant="body1" className="text-gray-600 mb-6">
                Try adjusting your filters or search terms to see more results.
              </Typography>
              <Button onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedItems.map(item => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Customization Modal */}
      {showCustomization && selectedItem && (
        <CustomizationModal
          item={selectedItem}
          isOpen={showCustomization}
          onClose={() => {
            setShowCustomization(false);
            setSelectedItem(null);
          }}
        />
      )}
    </PageContainer>
  );
};

export default MenuPage;
