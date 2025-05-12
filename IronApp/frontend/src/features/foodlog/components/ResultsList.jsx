import React, { useEffect } from 'react';
import { Search, PlusCircle, XCircle, AlertCircle, Pizza } from 'lucide-react';
import LoadingIndicator from '../../../components/LoadingIndicator';

/*
ResultsList component displays the search results for the user to log their food.
*/

const ResultsList = ({ 
    searchResults, 
    isLoading, 
    error, 
    handleAddFood,
    currentPage,
    totalPages,
    onPageChange,
    searchInput,
    onClearResults,
    showPagination 
}) => {

    // Function to have a scrollable list of results
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        // if showPagination is true and the user has scrolled to the bottom of the list
        if (showPagination && scrollHeight - scrollTop <= clientHeight + 50 && !isLoading && currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    // Function to fetch more results if there are very few results
    useEffect(() => {
        // trigger auto-fetch if showPagination is true and there are very few results
        if (showPagination && searchResults.length > 0 && searchResults.length < 5 && currentPage < totalPages && !isLoading) {
            onPageChange(currentPage + 1); 
        }

    }, [searchResults, currentPage, totalPages, isLoading, onPageChange, showPagination]);

    if (isLoading && searchResults.length === 0) {
        return (
            <div className="flex justify-center items-center p-8 bg-white rounded-xl shadow-md">
                <LoadingIndicator />
                <span className="ml-3 text-gray-600 font-medium">Searching...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-5 bg-red-50 text-red-700 rounded-xl mb-4 border border-red-100 shadow-sm flex items-start">
                <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    // No results found for a specific search query
    if (searchResults.length === 0 && searchInput && showPagination) {
        return (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-center mb-4">
                    <Search size={32} className="text-gray-400" />
                </div>
                <p className="font-medium">No results found for "{searchInput}"</p>
                <p className="text-sm mt-2 text-gray-400">Try different search terms or filters</p>
            </div>
        );
    }

    // if no results, return null
    if (searchResults.length === 0) {
        return null;
    }

    return (
        <div className="relative bg-white rounded-xl shadow-md p-6 w-full">
             <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Pizza size={18} className="text-[var(--secondary-color-green)]" />
                        Search Results {isLoading && <LoadingIndicator size="sm" />}
                    </h3>
                 <button 
                    onClick={onClearResults}
                    className="text-sm text-gray-500 hover:text-red-500 flex items-center hover:bg-red-50 py-1 px-2 rounded-md transition-colors"
                 >
                     <XCircle size={16} className="mr-1" />
                        Close Results
                 </button>
             </div>
                
            <div 
                className="border border-gray-200 rounded-xl overflow-y-auto shadow-inner bg-gray-50/50 w-full max-h-[calc(100vh-400px)] min-h-[200px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" 
                onScroll={handleScroll}
                style={{ 
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(203, 213, 225, 0.8) rgba(241, 245, 249, 0.5)'
                }}
            >
                {searchResults.map((food) => (
                    <div
                        key={food.id}
                        onClick={() => handleAddFood(food)}
                        className="p-4 border-b last:border-b-0 hover:bg-blue-50/30 cursor-pointer transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            {food.image_url && (
                                <img 
                                    src={food.image_url} 
                                    alt={food.product_name_en || food.product_name}
                                    className="w-14 h-14 object-cover rounded-md shadow-sm border border-gray-100 flex-shrink-0"
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}
                            <div className="flex-1 min-w-0 mr-2">
                                <div className="font-medium text-gray-800 truncate">{food.product_name_en || food.product_name}</div>
                                <div className="text-xs text-gray-500 mb-2">{food.brands}</div>
                                <div className="text-sm text-[var(--primary-color-teal)] font-medium">
                                    {/* Show calories per serving if available, otherwise display '-' for no calories */}
                                    {food.nutriments && (food.nutriments?.['energy_kcal_serving'] || food.nutriments?.['energy-kcal_serving'] || food.nutriments?.['energy-kcal']) 
                                        ? `${Math.round(food.nutriments?.['energy_kcal_serving'] || food.nutriments?.['energy-kcal_serving'] || food.nutriments?.['energy-kcal'])} kcal per serving`
                                        : '- kcal'}
                                </div>
                                <div className="text-xs text-gray-500 mt-2 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-1">
                                    <div>
                                        <span className="font-medium">Pro:</span> {(food.nutriments?.['proteins_serving'] ?? 0).toFixed(1)}g
                                    </div>
                                    <div>
                                        <span className="font-medium">Carbs:</span> {(food.nutriments?.['carbohydrates_serving'] ?? 0).toFixed(1)}g
                                    </div>
                                    <div>
                                        <span className="font-medium">Fat:</span> {(food.nutriments?.['fat_serving'] ?? 0).toFixed(1)}g
                                    </div>
                                    <div>
                                        <span className="font-medium">Sugar:</span> {(food.nutriments?.['sugars_serving'] ?? 0).toFixed(1)}g
                                    </div>
                                    <div>
                                        <span className="font-medium">Fiber:</span> {(food.nutriments?.['fiber_serving'] ?? 0).toFixed(1)}g
                                    </div>
                                </div>
                            </div>
                            <button 
                                className="ml-auto px-3 py-2 bg-[var(--secondary-color-green)] text-white rounded-lg hover:bg-[var(--primary-color-teal)] transition-colors text-sm shadow-sm flex items-center gap-1 flex-shrink-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddFood(food);
                                }}
                            >
                                <PlusCircle size={16} />
                                Add
                            </button>
                        </div>
                    </div>
                ))}
                {isLoading && showPagination && searchResults.length > 0 && (
                    <div className="flex justify-center p-4">
                        <LoadingIndicator size="sm" />
                            <span className="ml-2 text-sm text-gray-500">Loading more...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsList; 