import React, { useState } from 'react';
import { Calendar, Search, PlusCircle, X } from 'lucide-react';
import LoadingIndicator from '../../../components/LoadingIndicator';
import foodDummyData from '../foodDummyData';
import TrackedFoodList from './TrackedFoodList';
import DateRangeInput from './DateRangeInput';
import MealTypeSelection from './MealTypeSelection';

const TrackerForm = () => {
    // Local state for tracking foods and search
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [trackedFoods, setTrackedFoods] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedMealTypes, setSelectedMealTypes] = useState([]);
    const [isSavingMeal, setIsSavingMeal] = useState(false);

    // Get meal icons from utility function in MealTypeSelection
    const mealIcons = MealTypeSelection.getMealIcons();

    // Handle search input change
    const handleInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    // Handle search submission (local search in dummy data file foodDummyData.js)
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setTimeout(() => {
            const q = searchInput.trim().toLowerCase();
            if (!q) {
                setSearchResults([]);
                setShowResults(true);
                setIsLoading(false);
                return;
            }
            const results = foodDummyData.filter(food =>
                (food.product_name && food.product_name.toLowerCase().includes(q)) ||
                (food.product_name_en && food.product_name_en.toLowerCase().includes(q)) ||
                (food.brands && food.brands.toLowerCase().includes(q))
            );
            setSearchResults(results);
            setShowResults(true);
            setIsLoading(false);
        }, 300); // 300ms delay for debouncing
    };

    // Select a food item from search results
    const handleSelectFood = (food) => {
        setSelectedFood(food);
        setShowResults(false);
        setSearchResults([]);
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
    const handleAddTrackedFood = () => {
        if (!selectedFood || !startDate || !endDate || selectedMealTypes.length === 0) return;
        setIsSavingMeal(true);
        try {
            // Use the utility function to normalize dates
            const normalizedStartDate = DateRangeInput.normalizeDate(startDate);
            const normalizedEndDate = DateRangeInput.normalizeDate(endDate);
            
            const newTracked = selectedMealTypes.map(mealType => ({
                id: Date.now() + Math.random().toString(36).substring(2, 9),
                food: selectedFood,
                startDate: normalizedStartDate,
                endDate: normalizedEndDate,
                mealType
            }));
            
            setTrackedFoods(prev => [...prev, ...newTracked]);
            setSelectedFood(null);
            setSearchInput('');
            setStartDate('');
            setEndDate('');
            setSelectedMealTypes(['breakfast']);
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
                                placeholder="Search for a food item..."
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
                                <div className="font-medium text-gray-800">{selectedFood.product_name || selectedFood.product_name_en}</div>
                                <div className="text-sm text-gray-500 mt-1">{selectedFood.brands}</div>
                                <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                        {Math.round(selectedFood.nutriments?.['energy-kcal'] || 0)} kcal
                                    </span>
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                        {Math.round(selectedFood.nutriments?.proteins || 0)}g protein
                                    </span>
                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                                        {Math.round(selectedFood.nutriments?.carbohydrates || 0)}g carbs
                                    </span>
                                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                        {Math.round(selectedFood.nutriments?.fat || 0)}g fat
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
                                        <div className="font-medium text-gray-800">{food.product_name || food.product_name_en}</div>
                                        <div className="text-sm text-gray-500">{food.brands}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Error Message */}
                        {error && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                                <p className="text-red-600 font-medium flex items-center">
                                    <X size={16} className="mr-1" />
                                    {error}
                                </p>
                            </div>
                        )}
                        
                        {/* Show "No results" message if search completed but no results */}
                        {!isLoading && showResults && searchResults.length === 0 && !error && (
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
