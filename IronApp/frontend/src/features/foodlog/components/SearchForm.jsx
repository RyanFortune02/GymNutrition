import React from 'react';
import { Search, Coffee, UtensilsCrossed, Apple, Tag, Barcode } from 'lucide-react';

/* Search Form Component 
    This component is used to search for food items in the database.
    User can search by name, brand, or barcode.
    They can select the meal type and the search mode.
    The search results are displayed in the ResultsList component.
*/
const SearchForm = ({ 
    searchInput, 
    setSearchInput, 
    searchMode, 
    setSearchMode, 
    handleSearch, 
    selectedMeal, 
    setMealType,
    isLoading
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch();
    };

    // Icons for meal types
    const mealIcons = {
        breakfast: <Coffee size={16} />,
        lunch: <UtensilsCrossed size={16} />,
        dinner: <UtensilsCrossed size={16} />,
        snack: <Apple size={16} />
    };

    // Icons for search modes
    const searchModeIcons = {
        name: <Search size={16} />,
        brand: <Tag size={16} />,
        barcode: <Barcode size={16} />
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-[var(--neutral-color-blue)] flex items-center gap-2">
                <Search size={20} className="text-[var(--secondary-color-green)]" />
                <span>Food Search</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="mb-6">
                {/* Meal Type Selection */}
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                        <UtensilsCrossed size={16} className="text-[var(--primary-color-teal)]" />
                        Select Meal
                    </label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 justify-center">
                        {['breakfast', 'lunch', 'dinner', 'snack'].map(meal => (
                            <button
                                type="button"
                                key={meal}
                                onClick={() => setMealType(meal)}
                                className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-center gap-2 ${
                                    selectedMeal === meal
                                        ? 'bg-[var(--primary-color-teal)] text-white shadow-md'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                {mealIcons[meal]}
                                {meal.charAt(0).toUpperCase() + meal.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Search Type Selection */}
                <div className="mb-4">
                    <label className="flex text-sm font-medium text-gray-700 mb-3 items-center gap-1">
                        <Search size={16} className="text-[var(--primary-color-teal)]" />
                        Search By
                    </label>
                    <div className="flex space-x-3">
                        {[
                            { id: 'name', label: 'Name' },
                            { id: 'brand', label: 'Brand' },
                            { id: 'barcode', label: 'Barcode' }
                        ].map(option => (
                            <button
                                type="button"
                                key={option.id}
                                onClick={() => setSearchMode(option.id)}
                                className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                                    searchMode === option.id
                                        ? 'bg-[var(--accent-color-orange)] text-white shadow-md'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                {searchModeIcons[option.id]}
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Search Input */}
                <div className="mb-6 mt-6">
                    {/* Responsive input and button: stack on small screens */}
                    <div className="flex flex-col sm:flex-row shadow-sm space-y-2 sm:space-y-0 sm:space-x-2">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder={`Search by ${searchMode}...`}
                            className="w-full flex-1 p-3 border border-gray-300 rounded-lg sm:rounded-l-lg focus:ring-2 focus:ring-[var(--primary-color-teal)] focus:border-transparent text-gray-800"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full sm:w-auto text-white px-5 py-3 rounded-lg sm:rounded-r-lg transition-colors flex items-center justify-center gap-2 ${
                                isLoading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-[var(--primary-color-teal)] hover:bg-[var(--secondary-color-green)] shadow-md'
                            }`}
                        >
                            <Search size={16} />
                            {isLoading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <Search size={12} className="mr-1" />
                        {searchMode === 'name' 
                            ? 'Example: chicken breast, brown rice' 
                            : searchMode === 'brand'
                                ? 'Example: Nestlé, kirkland'
                                : 'Enter product barcode number'}
                    </p>
                </div>
            </form>
        </div>
    );
};

export default SearchForm; 