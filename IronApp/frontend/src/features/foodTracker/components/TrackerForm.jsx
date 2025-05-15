import React, { useState, useEffect } from 'react';
import { Calendar, Search, PlusCircle, X, Check } from 'lucide-react';
import LoadingIndicator from '../../../components/LoadingIndicator';
import TrackedFoodList from './TrackedFoodList';
import DateRangeInput from './DateRangeInput';
import MealTypeSelection from './MealTypeSelection';
import useFoodSearch from '../hooks/useFoodSearch';

const TrackerForm = () => {
    // Local state for tracking foods and search
    const [searchInput, setSearchInput] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [trackedFoods, setTrackedFoods] = useState([]);
    const [selectedMealTypes, setSelectedMealTypes] = useState(['breakfast']);
    const [isSavingMeal, setIsSavingMeal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Constants for food search and API operations
    const { 
        searchResults, 
        selectedFood, 
        setSelectedFood, 
        isLoading, 
        error, 
        searchFood,
        trackMealForDateRange,
        getMealTypeCode
    } = useFoodSearch();

    // Clear messages after 5 seconds
    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    // Show error from search hook
    useEffect(() => {
        if (error) {
            setErrorMessage(error);
        }
    }, [error]);

    // Get meal icons from utility function in MealTypeSelection
    const mealIcons = MealTypeSelection.getMealIcons();

    // Handle search input change
    const handleInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    // Handle search submission
    const handleSubmit = (e) => {
        e.preventDefault();
        searchFood(searchInput);
        setShowResults(true);
    };

    // Select a food item from search results
    const handleSelectFood = (food) => {
        setSelectedFood(food);
        setShowResults(false);
    };

    // Toggle meal type selection
    const toggleMealType = (mealType) => {
        setSelectedMealTypes(prev =>
            prev.includes(mealType)
                ? prev.filter(type => type !== mealType)
                : [...prev, mealType]
        );
    };

    // Add the tracked food to the list (for each selected meal type)
    const handleAddTrackedFood = async () => {
        if (!selectedFood || !startDate || !endDate || selectedMealTypes.length === 0) return;
        
        setIsSavingMeal(true);
        setErrorMessage('');
        setSuccessMessage('');
        
        try {
            const normalizedStartDate = DateRangeInput.normalizeDate(startDate);
            const normalizedEndDate = DateRangeInput.normalizeDate(endDate);
            
            // Create meal records for each meal type
            const allMealPromises = selectedMealTypes.map(async (mealType) => {
                const mealTypeCode = getMealTypeCode(mealType);
                
                // trackMealForDateRange creates meal records for a date range and meal type
                const result = await trackMealForDateRange(
                    selectedFood.id,
                    mealTypeCode,
                    normalizedStartDate,
                    normalizedEndDate
                );
                
                // Format tracked foods for display in the list
                const newTracked = {
                    id: Date.now() + Math.random().toString(36).substring(2, 9),
                    food: selectedFood,
                    startDate: normalizedStartDate,
                    endDate: normalizedEndDate,
                    mealType,
                    recordCount: result.records.length
                };
                
                return newTracked;
            });
            
            // Await all meal type API calls to complete
            const newTrackedItems = await Promise.all(allMealPromises);
            
            // Update tracked foods state
            setTrackedFoods(prev => [...prev, ...newTrackedItems]);
            
            // Show success message after food is added to meal tracker
            setSuccessMessage(`Added ${selectedFood.product_name_en || selectedFood.product_name} to meal tracker`);
            
            // Reset form
            setSelectedFood(null);
            setSearchInput('');
            setStartDate('');
            setEndDate('');
            setSelectedMealTypes(['breakfast']);
            
        } catch (err) {
            setErrorMessage(err.response?.data?.error || 'Failed to add meal to tracker');
        } finally {
            setIsSavingMeal(false);
        }
    };

    // Remove a tracked food
    const handleRemoveTrackedFood = (id) => {
        setTrackedFoods(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[var(--neutral-color-blue)] flex items-center gap-2">
                    <Calendar size={22} className="text-[var(--secondary-color-green)]" />
                    <span>Future Food Tracker</span>
                </h2>
            </div>
            
            {/* Success and Error Messages */}
            {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm flex items-center">
                    <Check size={16} className="mr-2 text-green-600" />
                    <p className="text-green-700 font-medium">{successMessage}</p>
                </div>
            )}
            
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm flex items-center">
                    <X size={16} className="mr-2 text-red-600" />
                    <p className="text-red-700 font-medium">{errorMessage}</p>
                </div>
            )}
            
            <div className="bg-gray-50 p-5 rounded-lg mb-6">
                <h3 className="text-md font-medium mb-4 text-gray-700 border-b pb-2">Track foods for future dates</h3>
                
                <div className="space-y-5">
                    {/* Food Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search Food Item
                        </label>
                        <form onSubmit={handleSubmit} className="flex space-x-2">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={handleInputChange}
                                placeholder="Search for a food item by name..."
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color-teal)] focus:border-transparent"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !searchInput.trim()}
                                className={`text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center ${
                                    isLoading || !searchInput.trim()
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[var(--primary-color-teal)] hover:bg-[var(--secondary-color-green)]'
                                }`}
                            >
                                {isLoading ? <LoadingIndicator /> : <Search size={18} />}
                            </button>
                        </form>
                        
                        {/* Selected Food Display */}
                        {selectedFood && (
                            <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="font-medium text-gray-800">{selectedFood.product_name_en}</div>
                                <div className="text-sm text-gray-500 mt-1">{selectedFood.brands}</div>
                                <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                        {Math.round(selectedFood.nutriments?.['energy_kcal_serving'] || 0)} kcal
                                    </span>
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                        {Math.round(selectedFood.nutriments?.proteins_serving || 0)}g protein
                                    </span>
                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                                        {Math.round(selectedFood.nutriments?.carbohydrates_serving || 0)}g carbs
                                    </span>
                                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                        {Math.round(selectedFood.nutriments?.fat_serving || 0)}g fat
                                    </span>
                                </div>
                            </div>
                        )}
                        
                        {/* Search Results */}
                        {showResults && searchResults.length > 0 && (
                            <div className="mt-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg shadow-sm bg-white">
                                {searchResults.map((food, index) => (
                                    <div 
                                        key={index}
                                        onClick={() => handleSelectFood(food)}
                                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                    >
                                        <div className="font-medium text-gray-800">{food.product_name_en}</div>
                                        <div className="text-sm text-gray-500">{food.brands}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Show "No results" message if search completed but no results */}
                        {!isLoading && showResults && searchResults.length === 0 && !error && !errorMessage && (
                            <p className="text-amber-600 text-sm mt-3 p-2 bg-amber-50 border border-amber-100 rounded-lg">
                                No results found. Try a different search or a different food.
                            </p>
                        )}
                    </div>
                    
                    {/* Date Range */}
                    <DateRangeInput 
                        startDate={startDate}
                        onStartDateChange={setStartDate}
                        endDate={endDate}
                        onEndDateChange={setEndDate}
                    />
                    
                    {/* Meal Type Selection */}
                    <MealTypeSelection 
                        selectedMealTypes={selectedMealTypes}
                        onToggleMealType={toggleMealType}
                        mealIcons={mealIcons}
                    />
                    
                    {/* Add Button */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={handleAddTrackedFood}
                            disabled={isSavingMeal || !selectedFood || !startDate || !endDate || selectedMealTypes.length === 0}
                            className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${
                                isSavingMeal || !selectedFood || !startDate || !endDate || selectedMealTypes.length === 0
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-[var(--accent-color-orange)] text-white hover:bg-orange-600 shadow-sm'
                            }`}
                        >
                            {isSavingMeal ? <LoadingIndicator /> : <PlusCircle size={18} />}
                            <span>Add to Meal Tracker</span>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Tracked Foods */}
            <TrackedFoodList 
                trackedFoods={trackedFoods}
                mealIcons={mealIcons}
                handleRemoveTrackedFood={handleRemoveTrackedFood}
            />
        </div>
    );
};

export default TrackerForm;
