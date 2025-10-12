/**
 * Format price in Nigerian Naira
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  return `₦${parseFloat(price).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Format price range in Nigerian Naira
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {string} Formatted price range string
 */
export const formatPriceRange = (minPrice, maxPrice) => {
  return `₦${minPrice.toLocaleString('en-NG')} - ₦${maxPrice.toLocaleString('en-NG')}`;
};
