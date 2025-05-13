import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../../auth/api';

const useFoodLog = () => {
    // State declarations for the food log
    const [meals, setMeals] = useState({
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: []
    });
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchMode, setSearchMode] = useState('name'); 
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMeal, setSelectedMeal] = useState('breakfast');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [retryCount, setRetryCount] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [mealsHistory, setMealsHistory] = useState({});
    const MAX_RETRIES = 3;
    const PAGE_SIZE = 5;

    // Format date to YYYY-MM-DD for use as keys in the meals history
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Get the current date key
    const currentDateKey = useMemo(() => formatDate(selectedDate), [selectedDate]);

    // Load meals for the selected date when the date changes
    useEffect(() => {
        // If we have meals for this date in history, load them
        if (mealsHistory[currentDateKey]) {
            setMeals(mealsHistory[currentDateKey]);
        } else {
            // Initialize empty meals for new date
            setMeals({
                breakfast: [],
                lunch: [],
                dinner: [],
                snack: []
            });
        }
    }, [currentDateKey, mealsHistory]);

    // Navigate to previous day
    const goToPreviousDay = () => {
        const prevDate = new Date(selectedDate);
        prevDate.setDate(prevDate.getDate() - 1);
        setSelectedDate(prevDate);
    };

    // Navigate to next day
    const goToNextDay = () => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        setSelectedDate(nextDate);
    };

    // Navigate to specific day
    const goToDate = (date) => {
        setSelectedDate(new Date(date));
    };

    // Return to today
    const goToToday = () => {
        setSelectedDate(new Date());
    };

    // Clear the search results when the user wants to search for a new item
    const clearSearchResults = useCallback(() => {
        setSearchResults([]);
        setSearchInput('');
        setSearchQuery('');
        setCurrentPage(1);
        setTotalPages(1);
        setTotalResults(0);
        setError(null);
    }, []);

    // Make the API request to the food search endpoint to get the search results
    const makeApiRequest = async (params) => {
        try {
            const response = await api.get('/food/search/', { params });
            return response;
        } catch (error) {
            console.error('Search API error:', error.response?.data);
            throw error;
        }
    };

    // Get the food items from the API based on the search mode and query
    const fetchFoodItems = async (page = 1, overrideQuery) => {
        const q = overrideQuery !== undefined ? overrideQuery : searchQuery;
        if (!q.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            // set the parameters for the API request based on the search mode
            let params;
            if (searchMode === 'barcode') {
                params = { code: q };
            } else if (searchMode === 'brand') {
                params = { search: q, page, page_size: PAGE_SIZE };
            } else {
                params = { search: q, page, page_size: PAGE_SIZE };
            }

            const response = await makeApiRequest(params);
            if (response.data.error) {
                throw new Error(response.data.error);
            }

            // Get base results and count of results
            let results = response.data.results || [];
            let count = response.data.count || results.length;

            // apply filtering by brand based on the search mode
            if (searchMode === 'brand' && results.length > 0) {
                // create a copy for brand filtering (to avoid mutating the original results)
                const brandMatches = results.filter(item =>
                    item.brands && item.brands.toLowerCase().includes(q.toLowerCase())
                );
                
                // results are replaced if we found brand matches
                if (brandMatches.length > 0) {
                    results = brandMatches;
                    count = brandMatches.length;
                }
            }

            const calculatedTotalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
            if (page === 1) {
                setSearchResults(results);
            } else {
                setSearchResults(prevResults => [...prevResults, ...results]);
            }
            setTotalResults(count);
            setTotalPages(calculatedTotalPages);
            setCurrentPage(page);
            setRetryCount(0); //reset retry count on success
        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.error || error.message || 'an unknown error occurred.';

            if (status === 504) { //gateway timeout
                if (retryCount < MAX_RETRIES) {
                    setRetryCount(prev => prev + 1);
                    setError('Search timed out. Retrying...'); 
                } else {
                    setError('Search timed out after multiple attempts. Please try again later.');
                }
            } else if (status === 503 || status === 502) { //service unavailable or bad gateway
                setError(message); //use the message from our backend
                //no retries for these
            } else if (status === 404) { //not found
                setSearchResults([]); //clear any previous results
                setTotalResults(0); //reset total results on not found

                //handle specific error messages for different search modes
                if (searchMode === 'brand') {
                    setError('Brand search failed. Please try a different search method.');
                } else if (searchMode === 'barcode') {
                    //provide a more specific message for barcode searches
                    setError(`No product found with barcode "${q}"`); 
                } else {
                    //use the backend message for other 'not found' scenarios
                    setError(message); 
                }
            } else if (status === 400) { //bad request
                setError(message); //use the message from our backend
            } else { //fallback for other errors
                setError(message || 'Failed to fetch food items. Please check your connection or try again.');
            }
        } finally {
            setIsLoading(false);
        } 
    };

    // Debounce search to prevent multiple requests to the API
    useEffect(() => {
        let timer;
        return () => clearTimeout(timer); // Clear the timer when the component unmounts
    }, []);

    const handleSearch = () => {
        const q = searchInput.trim();
        if (!q) return;
        setSearchResults([]);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalResults(0);
        setSearchQuery(q);
        fetchFoodItems(1, q);
    };

    const handleSearchModeChange = (newMode) => {
        // Clear the search results and set the new search mode
        clearSearchResults();
        setSearchMode(newMode);
    };

    const handlePageChange = (page) => {
        if (page !== currentPage && !isLoading && searchQuery.trim()) {
            fetchFoodItems(page);
        }
    };

    // Normalize the nutriments to ensure the correct values are used
    const normalizeNutriments = (nutriments) => {
        if (!nutriments) return {};
        
        return {
            calories: nutriments['energy_kcal_serving'] || nutriments['energy-kcal_serving'] || nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0,
            protein: nutriments['proteins_serving'] || nutriments['proteins_100g'] || 0,
            carbs: nutriments['carbohydrates_serving'] || nutriments['carbohydrates_100g'] || 0,
            fat: nutriments['fat_serving'] || nutriments['fat_100g'] || 0,
            fiber: nutriments['fiber_serving'] || nutriments['fiber_100g'] || 0,
            sugar: nutriments['sugars_serving'] || nutriments['sugars_100g'] || 0,
            sodium: nutriments['sodium_serving'] || nutriments['sodium_100g'] || 0
        };
    };

    const handleAddFood = async (foodItem) => {
        // Clone the food item to avoid reference issues
        const foodToAdd = JSON.parse(JSON.stringify(foodItem));
        
        // Normalize the nutriments before adding for correct calculations
        if (foodToAdd.nutriments) {
            const normalizedNutriments = normalizeNutriments(foodToAdd.nutriments);
            foodToAdd.normalizedNutriments = normalizedNutriments;
        }
        
        const newItem = {
            ...foodToAdd,
            _justAdded: true // Add a flag to highlight newly added items
        };
        
        // Add the new item to the selected meal
        setMeals(prev => {
            const updatedMeals = {
                ...prev,
                [selectedMeal]: [...prev[selectedMeal], newItem]
            };
            
            // Update the meal history for the current date
            setMealsHistory(prevHistory => ({
                ...prevHistory,
                [currentDateKey]: updatedMeals
            }));
            
            return updatedMeals;
        });
        
        //map meal types from frontend to backend format
        const mealTypeMapping = {
            breakfast: 'B',
            lunch: 'L',
            dinner: 'D',
            snack: 'S',
        };
        
        //find the correct id field for the backend
        const foodId = foodToAdd._id || foodToAdd.id;
        
        //save to backend
        try {
            setIsLoading(true);
            setError(null);
            
            //prepare payload for API
            const payload = {
                food: foodId,
                meal_type: mealTypeMapping[selectedMeal] || selectedMeal.charAt(0).toUpperCase(),
                date: new Date().toISOString().split('T')[0], //current date in YYYY-MM-DD format
                servings: 1 //default to 1 serving
            };
            
            //send to backend
            await api.post('/api/meals/', payload);
            
            //successful save - no need to update local state as it's already updated
        } catch (err) {
            console.error('Failed to save meal record:', err.response?.data || err.message);
            setError('Failed to save meal. Please try again.');
        } finally {
            setIsLoading(false);
        }
        
        //set a timeout to remove the highlight after 1.5 seconds
        setTimeout(() => {
            setMeals(prev => {
                const updatedMeal = prev[selectedMeal].map((item, index) => {
                    if (index === prev[selectedMeal].length - 1 && item._justAdded) {
                        const { _justAdded, ...rest } = item;
                        return rest;
                    }
                    return item;
                });
                
                const updatedMeals = {
                    ...prev,
                    [selectedMeal]: updatedMeal
                };
                
                // Update the meal history for the current date
                setMealsHistory(prevHistory => ({
                    ...prevHistory,
                    [currentDateKey]: updatedMeals
                }));
                
                return updatedMeals;
            });
        }, 1500);
    };

    // Remove the food item from the selected meal
    const handleRemoveFood = (mealType, index) => {
        setMeals(prev => {
            const updatedMeals = {
                ...prev,
                [mealType]: prev[mealType].filter((_, i) => i !== index)
            };
            
            // Update the meal history for the current date
            setMealsHistory(prevHistory => ({
                ...prevHistory,
                [currentDateKey]: updatedMeals
            }));
            
            return updatedMeals;
        });
    };

    // Memoize nutrient calculations for each meal to prevent recalculations on every render
    const mealNutrients = useMemo(() => {
        const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
        
        return mealTypes.reduce((acc, mealType) => {
            const nutrients = meals[mealType].reduce((mealAcc, food) => {
                // Normalize the nutriments for correct calculations
                const nutriments = food.normalizedNutriments || normalizeNutriments(food.nutriments) || {};
                
                // Calculate the total nutrients for the meal
                const caloriesValue = Number(nutriments.calories) || 0;
                const proteinValue = Number(nutriments.protein) || 0;
                const carbsValue = Number(nutriments.carbs) || 0;
                const fatValue = Number(nutriments.fat) || 0;
                const fiberValue = Number(nutriments.fiber) || 0;
                const sugarValue = Number(nutriments.sugar) || 0;
                const sodiumValue = Number(nutriments.sodium) || 0;
                
                return {
                    calories: (mealAcc.calories || 0) + caloriesValue,
                    protein: (mealAcc.protein || 0) + proteinValue,
                    carbs: (mealAcc.carbs || 0) + carbsValue,
                    fat: (mealAcc.fat || 0) + fatValue,
                    fiber: (mealAcc.fiber || 0) + fiberValue,
                    sugar: (mealAcc.sugar || 0) + sugarValue,
                    sodium: (mealAcc.sodium || 0) + sodiumValue
                };
            }, {});
            
            acc[mealType] = nutrients;
            return acc;
        }, {});
    }, [meals]);

    // Calculate the total nutrients for the day using useMemo to prevent recalculations on every render
    const dailyTotals = useMemo(() => {
        return ['breakfast', 'lunch', 'dinner', 'snack'].reduce((acc, mealType) => {
            const mealNutrient = mealNutrients[mealType];
            return {
                calories: (acc.calories || 0) + (mealNutrient.calories || 0),
                protein: (acc.protein || 0) + (mealNutrient.protein || 0),
                carbs: (acc.carbs || 0) + (mealNutrient.carbs || 0),
                fat: (acc.fat || 0) + (mealNutrient.fat || 0),
                fiber: (acc.fiber || 0) + (mealNutrient.fiber || 0),
                sugar: (acc.sugar || 0) + (mealNutrient.sugar || 0),
                sodium: (acc.sodium || 0) + (mealNutrient.sodium || 0)
            };
        }, {});
    }, [mealNutrients]);

    const calculateTotalNutrients = (mealType) => {
        return mealNutrients[mealType];
    };

    const calculateDailyTotals = () => {
        return dailyTotals;
    };

    const setMealType = (mealType) => {
        setSelectedMeal(mealType);
    };

    return {
        meals,
        searchInput,
        setSearchInput,
        searchQuery,
        searchMode,
        setSearchMode: handleSearchModeChange, // Set the new search mode
        searchResults,
        selectedMeal,
        setMealType,
        handleSearch,
        handleAddFood,
        handleRemoveFood,
        calculateTotalNutrients,
        calculateDailyTotals,
        isLoading,
        error,
        currentPage,
        totalPages,
        totalResults,
        handlePageChange,
        clearSearchResults,
        selectedDate,
        goToPreviousDay,
        goToNextDay,
        goToDate,
        goToToday,
        formatDate
    };
};

export default useFoodLog;
