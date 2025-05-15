import { useState, useCallback } from 'react';
import api from '../../auth/api';

/**
 * UseFoodSearch hook for searching and tracking food items by name 
 */
const useFoodSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentFoods, setRecentFoods] = useState([]);

  // Look up food by name
  const searchFood = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/food/search/', { 
        params: { search: query } 
      });
      
      if (response.data && response.data.results && response.data.results.length > 0) {
        setSearchResults(response.data.results);
      } else {
        setSearchResults([]);
        setError('No matching food items found. Try a different search term.');
      }
    } catch (err) {
      console.error('Food search error:', err);
      setError(err.response?.data?.error || 'Failed to search for food items');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load recent food items
  const loadRecentFoods = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/food/recent/');
      setRecentFoods(response.data);
    } catch (err) {
      console.error('Error loading recent foods:', err);
      setError(err.response?.data?.error || 'Failed to load recent foods');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add a food to recents (foodlog)
  const addToRecents = useCallback(async (foodId) => {
    try {
      await api.post('/food/recent/', {
        food_product_id: foodId
      });
    } catch (err) {
      console.error('Error adding food to recents:', err);
    }
  }, []);

  // trackMealForDateRange creates meal records for a date range and meal type
  const trackMealForDateRange = useCallback(async (foodId, mealType, startDate, endDate, servings = 1) => {
    try {
      setIsLoading(true);
      const response = await api.post('/api/meals/batch-create/', { 
        food_id: foodId,
        meal_type: mealType,
        start_date: startDate,
        end_date: endDate,
        servings
      });
      
      await addToRecents(foodId);
      
      return response.data;
    } catch (err) {
      console.error('Error tracking meal:', err);
      setError(err.response?.data?.error || 'Failed to track meal');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addToRecents]);

  // Convert meal type from frontend format to backend format
  const getMealTypeCode = useCallback((mealType) => {
    const mealTypeCodes = {
      breakfast: 'B',
      lunch: 'L',
      dinner: 'D',
      snack: 'S'
    };
    return mealTypeCodes[mealType] || 'S';
  }, []);

  return {
    searchResults,
    selectedFood,
    setSelectedFood,
    isLoading,
    error,
    searchFood,
    recentFoods,
    loadRecentFoods,
    trackMealForDateRange,
    getMealTypeCode
  };
};

export default useFoodSearch; 